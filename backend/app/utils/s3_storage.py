"""AWS S3 file storage service for DiscoveryOS."""
import structlog
from typing import Optional

logger = structlog.get_logger()


async def upload_file_to_s3(
    file_bytes: bytes,
    workspace_id: str,
    filename: str,
    s3_client
) -> str:
    """Upload file to S3 and return the key/path."""
    try:
        key = f"workspace/{workspace_id}/{filename}"
        s3_client.put_object(
            Bucket=s3_client._bucket_name,
            Key=key,
            Body=file_bytes
        )
        logger.info("File uploaded to S3", key=key, size=len(file_bytes))
        return key
    except Exception as e:
        logger.error("Failed to upload file to S3", error=str(e))
        raise


async def download_file_from_s3(file_key: str, s3_client) -> bytes:
    """Download file from S3 and return bytes."""
    try:
        response = s3_client.get_object(
            Bucket=s3_client._bucket_name,
            Key=file_key
        )
        file_bytes = response['Body'].read()
        logger.info("File downloaded from S3", key=file_key, size=len(file_bytes))
        return file_bytes
    except Exception as e:
        logger.error("Failed to download file from S3", error=str(e))
        raise


async def delete_file_from_s3(file_key: str, s3_client) -> bool:
    """Delete file from S3 and return True on success."""
    try:
        s3_client.delete_object(
            Bucket=s3_client._bucket_name,
            Key=file_key
        )
        logger.info("File deleted from S3", key=file_key)
        return True
    except Exception as e:
        logger.error("Failed to delete file from S3", error=str(e))
        return False


def get_presigned_url(
    file_key: str,
    s3_client,
    expiration: int = 3600
) -> str:
    """Generate presigned URL for secure file download."""
    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': s3_client._bucket_name, 'Key': file_key},
            ExpiresIn=expiration
        )
        logger.info("Generated presigned URL", key=file_key, expiration=expiration)
        return url
    except Exception as e:
        logger.error("Failed to generate presigned URL", error=str(e))
        raise
