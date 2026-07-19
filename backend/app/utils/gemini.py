"""Google Gemini API integration for DiscoveryOS Copilot."""
import httpx
import json
import asyncio
from app.config import settings
import structlog

logger = structlog.get_logger()


def compile_copilot_prompt(query: str, context_chunks: list) -> str:
    """Compile user query with context chunks into a system prompt."""
    system_instruction = (
        "You are the DiscoveryOS Copilot. You analyze customer feedback and telemetry data. "
        "Use the provided context chunks extracted from uploaded documents to answer the user query accurately. "
        "Always cite the source filenames if mentioned in the context. "
        "Keep responses highly professional, data-driven, and focused on actionable product management decisions.\n\n"
    )
    
    context_str = "Context Documents:\n"
    for chunk in context_chunks:
        context_str += f"- [File: {chunk['filename']}] {chunk['content']}\n"
        
    full_prompt = f"{system_instruction}{context_str}\nUser Query: {query}\nResponse:"
    return full_prompt


async def generate_gemini_stream(prompt: str):
    """
    Stream responses from Gemini API with proper error handling.
    Yields text chunks as they arrive from the API.
    """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:streamGenerateContent?key={settings.GEMINI_API_KEY}"
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": settings.GEMINI_TEMPERATURE,
            "maxOutputTokens": settings.GEMINI_MAX_TOKENS
        }
    }
    
    headers = {"Content-Type": "application/json"}
    
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            async with client.stream("POST", url, json=payload, headers=headers) as response:
                if response.status_code != 200:
                    logger.error(
                        "Gemini API error", 
                        status_code=response.status_code, 
                        response_text=await response.aread()
                    )
                    yield "Error: Unable to reach Gemini API service. Please try again."
                    return
                
                buffer = ""
                token_count = 0
                
                async for line in response.aiter_lines():
                    if not line.strip():
                        continue
                    
                    # Parse JSON from stream
                    try:
                        # Remove "data: " prefix if present (standard SSE format)
                        if line.startswith("data: "):
                            line = line[6:]
                        
                        chunk = json.loads(line)
                        
                        # Extract text from nested Gemini API structure
                        if "candidates" in chunk and len(chunk["candidates"]) > 0:
                            candidate = chunk["candidates"][0]
                            if "content" in candidate and "parts" in candidate["content"]:
                                parts = candidate["content"]["parts"]
                                if len(parts) > 0 and "text" in parts[0]:
                                    text = parts[0]["text"]
                                    buffer += text
                                    token_count += len(text.split())
                                    yield text
                    
                    except json.JSONDecodeError:
                        logger.debug("Skipped non-JSON line from stream", line=line[:50])
                        continue
                    except (KeyError, IndexError) as e:
                        logger.debug("Unexpected stream format", error=str(e), line=line[:50])
                        continue
                
                logger.info(
                    "Streaming completed successfully",
                    total_tokens=token_count,
                    response_length=len(buffer)
                )
    
    except asyncio.TimeoutError:
        logger.error("Gemini API request timed out after 120s")
        yield "Error: Request timed out. Please try again."
    
    except httpx.ConnectError as e:
        logger.error("Failed to connect to Gemini API", error=str(e))
        yield f"Error: Connection failed. Please check your internet connection and try again."
    
    except httpx.RequestError as e:
        logger.error("Gemini API request failed", error=str(e))
        yield f"Error: {str(e)}"
    
    except Exception as e:
        logger.error("Unexpected error in streaming", error=str(e), error_type=type(e).__name__)
        yield "Error: An unexpected error occurred. Please try again."
