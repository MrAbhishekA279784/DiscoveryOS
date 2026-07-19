from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class FileItemResponse(BaseModel):
    id: str
    name: str
    size: str
    type: str
    timestamp: str
    rawSize: Optional[int] = None

class PainPointResponse(BaseModel):
    id: str
    name: str
    count: int
    percentage: float

class ReasoningStep(BaseModel):
    id: str
    label: str
    status: str

class ChatMessageRequest(BaseModel):
    text: str

class ChatMessageResponse(BaseModel):
    id: str
    sender: str
    text: str
    timestamp: str
    isStreaming: Optional[bool] = None
    confidenceScore: Optional[float] = None
    sources: Optional[List[str]] = None
    reasoningSteps: Optional[List[ReasoningStep]] = None

class KpiResponse(BaseModel):
    title: str
    value: str
    change: str
    isPositive: bool
    type: str
    iconName: str
    sparklineData: List[float]

class RecommendationResponse(BaseModel):
    id: str
    title: str
    freqImpact: str
    confidence: float
    iconName: str

class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    database: str
    uptime: float

class ErrorResponse(BaseModel):
    detail: str

class SearchQuery(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None
    limit: int = 10
    offset: int = 0
    sort_by: Optional[str] = None

class SearchResult(BaseModel):
    id: str
    content: str
    metadata: Optional[Dict[str, Any]] = None
    filename: str
