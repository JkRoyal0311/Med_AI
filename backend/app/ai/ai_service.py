"""
Main AI Service — orchestrates RAG + Meditron for all MedAI features.

This service handles 4 core use cases:
1. disease_info()    — User enters a disease name
2. predict_disease() — User enters symptoms
3. drug_info()       — User enters a drug/medicine name
4. chat()            — Free-form medical conversation
"""
from app.ai.rag_engine import retrieve
from app.ai.meditron_client import query_meditron, stream_meditron, MEDITRON_SYSTEM_PROMPT
from typing import AsyncGenerator


DISCLAIMER = (
    "\n\n---\n"
    "⚠️ **IMPORTANT DISCLAIMER**: This is AI-generated health information "
    "for educational purposes only. It is NOT medical advice, diagnosis, or prescription. "
    "Always consult a qualified doctor or pharmacist before taking any medication "
    "or making any health decisions."
)


def disease_info(disease_name: str) -> dict:
    """
    Complete disease profile: medications, foods, symptoms, what to avoid.
    
    Called when: User types a disease in the search box.
    Returns: Structured dict with all disease information.
    """
    # Get relevant medical knowledge from our knowledge base
    context_chunks = retrieve(f"{disease_name} medications symptoms foods treatment", n=6)
    
    context = "\n\n".join([
        f"[Source: {c['source']}]\n{c['text']}"
        for c in context_chunks
    ])

    prompt = f"""MEDICAL KNOWLEDGE CONTEXT:
{context}

USER REQUEST: Provide complete medical information about "{disease_name}".

Structure your response with these exact sections:
1. **What is {disease_name}?** (2-3 sentence description)
2. **Key Symptoms** (bullet list)
3. **Medications to Take** (list with brief explanation of each)
4. **Medications to Avoid** (list with reasons)
5. **Foods to Eat** (list with Indian names where applicable)
6. **Foods to Strictly Avoid** (list with reasons)
7. **Lifestyle Tips** (3-5 practical points)

Use the medical context above as your primary source.
Keep language simple and clear. Include Indian food names.
End with the disclaimer."""

    raw_response = query_meditron(prompt)
    
    return {
        "disease": disease_name,
        "content": raw_response + DISCLAIMER,
        "sources": list(set(c["source"] for c in context_chunks)),
        "disclaimer": DISCLAIMER.strip(),
        "rag_chunks_used": len(context_chunks)
    }


def predict_disease(symptoms: list[str]) -> dict:
    """
    Symptom → disease prediction.
    
    Called when: User enters symptoms like "fatigue, frequent urination, blurred vision"
    Returns: Top 3 possible conditions with confidence % and what to do next.
    """
    symptoms_str = ", ".join(symptoms)
    
    # Search knowledge base for matching disease patterns
    context_chunks = retrieve(
        f"symptoms {symptoms_str} diagnosis disease condition",
        n=6
    )
    
    context = "\n\n".join([c["text"] for c in context_chunks])

    prompt = f"""MEDICAL KNOWLEDGE CONTEXT:
{context}

USER SYMPTOMS: {symptoms_str}

A patient reports these symptoms. Based on the medical context provided:

1. List the TOP 3 possible conditions these symptoms could indicate
2. For each condition, provide:
   - Condition name
   - Why these symptoms match (1-2 sentences)
   - Estimated likelihood (High/Medium/Low)
   - Key additional symptom to watch for
   - Urgency level (Seek emergency care / See doctor within 1-2 days / Schedule routine appointment)

IMPORTANT INSTRUCTIONS:
- Start with: "⚠️ These are possible conditions — NOT a diagnosis. See a doctor for proper evaluation."
- Do NOT say "you have [disease]" — say "these symptoms may indicate" or "could suggest"
- If any symptom suggests emergency (chest pain, stroke signs, breathing difficulty):
  START with "🚨 SEEK EMERGENCY CARE IMMEDIATELY"
- List conditions from most to least likely based on symptom match

End with the standard disclaimer."""

    raw_response = query_meditron(prompt)
    
    return {
        "symptoms_entered": symptoms,
        "analysis": raw_response + DISCLAIMER,
        "sources": list(set(c["source"] for c in context_chunks)),
        "disclaimer": DISCLAIMER.strip(),
        "is_prediction_not_diagnosis": True
    }


def drug_info(drug_name: str) -> dict:
    """
    Complete drug/medicine profile.
    
    Called when: User types a medicine name like "Metformin" or "Paracetamol"
    Returns: What it treats, how it works, side effects, interactions, what to avoid.
    """
    context_chunks = retrieve(
        f"{drug_name} medicine drug uses side effects interactions dosage",
        n=5
    )
    
    context = "\n\n".join([c["text"] for c in context_chunks])

    prompt = f"""MEDICAL KNOWLEDGE CONTEXT:
{context}

USER REQUEST: Provide detailed information about the medicine "{drug_name}".

Structure your response:
1. **What is {drug_name}?** (drug class, brief description)
2. **What it is used for** (conditions it treats)
3. **How it works** (mechanism in simple terms)
4. **Common Side Effects** (list, note which are serious)
5. **Important Interactions** (other drugs to avoid taking with it)
6. **What to Avoid While Taking It** (foods, alcohol, activities)
7. **Who Should NOT Take It** (contraindications)
8. **Pregnancy & Breastfeeding** safety information

Keep explanations simple. Use Indian brand names if known (e.g., Glucophage/Glycomet for Metformin).
DO NOT give specific doses.
End with the disclaimer."""

    raw_response = query_meditron(prompt)
    
    return {
        "drug": drug_name,
        "content": raw_response + DISCLAIMER,
        "sources": list(set(c["source"] for c in context_chunks)),
        "disclaimer": DISCLAIMER.strip()
    }


async def chat_stream(
    message: str,
    history: list[dict],
    user_conditions: list[str] = [],
    pregnancy: bool = False
) -> AsyncGenerator[str, None]:
    """
    Streaming AI chat with full conversation context.
    
    Called when: User sends a message in the AI Chat screen.
    Yields: Text chunks one by one (for real-time display).
    """
    # Get context based on the latest message
    context_chunks = retrieve(message, n=4)
    context = "\n\n".join([c["text"] for c in context_chunks])
    
    user_ctx = ""
    if user_conditions:
        user_ctx = f"[Patient conditions: {', '.join(user_conditions)}]"
    if pregnancy:
        user_ctx += " [PREGNANT — apply strict pregnancy safety filters]"

    enriched = f"""RETRIEVED MEDICAL CONTEXT:
{context}

{user_ctx}
USER MESSAGE: {message}

Answer helpfully using the context above. End with the disclaimer."""

    # Build message history for Meditron
    messages = [
        {"role": m["role"], "content": m["content"]}
        for m in history[-6:]  # Last 3 exchanges
    ]
    messages.append({"role": "user", "content": enriched})

    async for chunk in stream_meditron(messages):
        yield chunk
    
    yield DISCLAIMER
