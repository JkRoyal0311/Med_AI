"""
Meditron 70B client via Ollama.
Ollama provides an OpenAI-compatible API so switching models is easy.
"""
import ollama
import httpx
import json
from typing import AsyncGenerator
from app.core.config import settings

MEDITRON_SYSTEM_PROMPT = """You are a medical information assistant. Provide clear, evidence-based health information.
- Use simple language (8th grade level)
- Include Indian food names (karela, methi, amla, etc.)
- Never give specific doses - say "dosage varies by patient"
- Never diagnose definitively - say "may indicate" or "could suggest"
- Use bullet points and emoji headings (🍎, 💊, ⚠️)
- For emergencies: Start with "🚨 SEEK EMERGENCY CARE IMMEDIATELY"
- Always be cautious and remind users to consult doctors"""


def check_ollama_running() -> bool:
    """Check if Ollama service is available before making requests"""
    try:
        response = httpx.get(f"{settings.OLLAMA_BASE_URL}/api/tags", timeout=3)
        return response.status_code == 200
    except Exception:
        return False


def query_meditron(prompt: str, system: str = MEDITRON_SYSTEM_PROMPT) -> str:
    """
    Send a single query to Meditron and return the complete response.
    Used for: disease lookup, drug info, non-streaming responses.
    """
    if not check_ollama_running():
        return (
            "AI service is temporarily unavailable. "
            "Please try again in a moment. "
            "For urgent health matters, consult a doctor directly."
        )

    try:
        response = ollama.chat(
            model=settings.MEDITRON_MODEL,
            messages=[
                {"role": "system", "content": system},
                {"role": "user",   "content": prompt}
            ],
            options={
                "temperature": 0.2,
                "top_p": 0.9,
                "num_predict": 2048,
                "stop": ["</s>", "[INST]"]
            }
        )
        return response["message"]["content"]
    except ollama.ResponseError as e:
        return f"Model error: {str(e)}. Please ensure Meditron is running."
    except Exception as e:
        return f"Unexpected error: {str(e)}"


async def stream_meditron(
    messages: list[dict],
    system: str = MEDITRON_SYSTEM_PROMPT
) -> AsyncGenerator[str, None]:
    """
    Stream Meditron responses token by token using Server-Sent Events.
    Used for: AI chat screen where text appears word by word.
    """
    if not check_ollama_running():
        yield "AI service is temporarily unavailable. Please try again."
        return

    try:
        async with httpx.AsyncClient(timeout=120) as client:
            async with client.stream(
                "POST",
                f"{settings.OLLAMA_BASE_URL}/api/chat",
                json={
                    "model": settings.MEDITRON_MODEL,
                    "messages": [
                        {"role": "system", "content": system},
                        *messages
                    ],
                    "stream": True,
                    "options": {"temperature": 0.2, "num_predict": 2048}
                }
            ) as response:
                async for line in response.aiter_lines():
                    if line:
                        try:
                            chunk = json.loads(line)
                            if content := chunk.get("message", {}).get("content", ""):
                                yield content
                            if chunk.get("done", False):
                                break
                        except json.JSONDecodeError:
                            continue
    except httpx.TimeoutException:
        yield "\n\n[Response timed out. Please try a shorter question.]"
    except Exception as e:
        yield f"\n\n[Error: {str(e)}]"
