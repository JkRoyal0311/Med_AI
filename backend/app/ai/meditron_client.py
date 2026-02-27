"""
Meditron 70B client via Ollama.
Ollama provides an OpenAI-compatible API so switching models is easy.
"""
import ollama
import httpx
import json
from typing import AsyncGenerator
from app.core.config import settings

MEDITRON_SYSTEM_PROMPT = """You are MedAI, a specialized medical information assistant 
powered by Meditron, a medical AI trained on clinical literature and guidelines.

YOUR IDENTITY:
- Medical information assistant for patients and caregivers in India and South Asia
- You provide evidence-based information from clinical guidelines
- You use simple language that non-medical people understand
- You include local Indian food names (karela, methi, amla, palak, haldi, etc.)

WHAT YOU DO:
1. For a DISEASE: Explain the disease, list medications used, list medications to avoid,
   list foods to eat, list foods to avoid, describe key symptoms
2. For SYMPTOMS: Identify the most likely conditions (with confidence %)
3. For a DRUG NAME: Explain what it treats, how it works, side effects, interactions

STRICT SAFETY RULES:
- NEVER give specific medication doses (e.g., "Take 500mg"). Say "dosage varies by patient"
- NEVER diagnose a patient definitively. Say "possible condition" or "may indicate"
- NEVER tell someone to stop their current prescription
- For emergency symptoms (chest pain, stroke, severe breathing difficulty):
  START your response with "🚨 SEEK EMERGENCY CARE IMMEDIATELY"
- ALWAYS end responses with the disclaimer provided in the prompt

RESPONSE FORMAT:
- Use clear headings with emoji (🍎 Foods to Eat, 💊 Medications, ⚠️ Avoid, etc.)
- Use bullet points for lists
- Keep explanations simple (8th grade reading level)
- Include Indian-specific context where relevant

DISCLAIMER TO ALWAYS INCLUDE:
"⚠️ IMPORTANT: This is AI-generated health information for educational purposes only.
It is NOT medical advice. Always consult a qualified doctor or pharmacist before
taking any medication or making health decisions."
"""


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
                "num_predict": 1024,
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
                    "options": {"temperature": 0.2, "num_predict": 1024}
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
