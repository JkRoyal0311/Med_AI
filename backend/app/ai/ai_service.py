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
import re


DISCLAIMER = (
    "\n\n---\n"
    "⚠️ **IMPORTANT DISCLAIMER**: This is AI-generated health information "
    "for educational purposes only. It is NOT medical advice, diagnosis, or prescription. "
    "Always consult a qualified doctor or pharmacist before taking any medication "
    "or making any health decisions."
)


def _parse_section(text: str, section_name: str) -> list[str]:
    """Extract a section from the response and return as list of items."""
    # Match sections like "🔍 **What is X?**" or "⚠️ **Key Symptoms**" and capture until next section
    pattern = rf"^.*?{re.escape(section_name)}:?.*?\n(.*?)(?=^[🔍⚠️💊🚫🍎⛔🏃🤰❌]|$)"
    match = re.search(pattern, text, re.MULTILINE | re.IGNORECASE | re.DOTALL)
    
    if not match:
        return []
    
    content = match.group(1).strip()
    
    # Split by bullet points and newlines
    items = []
    for line in content.split('\n'):
        line = line.strip()
        # Remove bullet points, emojis, and extra formatting
        line = re.sub(r'^[-•*]\s*', '', line)
        line = re.sub(r'^[🔍⚠️💊🚫🍎⛔🏃🤰❌]\s*', '', line)
        line = re.sub(r'\*\*|\*|__|_', '', line)
        line = re.sub(r'^\(\d+\)\s*', '', line)
        
        if line and len(line) > 5:  # Avoid random short lines
            items.append(line)
    
    return items[:20]  # Limit to 20 items


def _parse_structured_section(text: str, section_name: str) -> list[dict]:
    """Extract a section with name: description pairs."""
    pattern = rf"^.*?{re.escape(section_name)}:?.*?\n(.*?)(?=^[🔍⚠️💊🚫🍎⛔🏃🤰❌]|$)"
    match = re.search(pattern, text, re.MULTILINE | re.IGNORECASE | re.DOTALL)
    
    if not match:
        return []
    
    content = match.group(1).strip()
    items = []
    
    for line in content.split('\n'):
        line = line.strip()
        line = re.sub(r'^[-•*]\s*', '', line)
        
        # Try to split on colon for name: description format
        if ':' in line:
            parts = line.split(':', 1)
            name = parts[0].strip()
            desc = parts[1].strip() if len(parts) > 1 else ""
            
            # Clean up formatting
            name = re.sub(r'\*\*|\*|__|_|\([^)]*\)', '', name).strip()
            desc = re.sub(r'\*\*|\*|__|_', '', desc).strip()
            
            if name and len(name) > 2:
                items.append({"name": name, "description": desc})
    
    return items[:20]


def disease_info(disease_name: str) -> dict:
    """
    Complete disease profile: medications, foods, symptoms, what to avoid.
    
    Called when: User types a disease in the search box.
    Returns: Structured dict with all disease information.
    """
    # Get relevant medical knowledge from our knowledge base
    context_chunks = retrieve(f"{disease_name} medications symptoms foods treatment", n=6)

    context = "\n\n".join([c["text"][:250] for c in context_chunks])

    prompt = f"""Based on the medical knowledge below, write a DETAILED and COMPLETE guide about {disease_name}.

MEDICAL KNOWLEDGE:
{context}

Write your response with these exact sections. For each section, provide SPECIFIC, DETAILED information - do NOT repeat the instructions:

🔍 What is {disease_name}?
{disease_name} is... [Explain what it is, causes, and importance in 3-4 sentences]

⚠️ Key Symptoms
[List and describe the main symptoms people experience]

💊 Medications Used
[List medications used to treat this disease with brief explanations]

🚫 Medications to Avoid
[List medications to avoid and explain why]

🍎 Foods to Eat
[List beneficial foods with Indian names like karela, methi, amla, palak, adrak, haldi - explain why each helps]

⛔ Foods to Avoid
[List harmful foods and explain why to avoid them]

🏃 Lifestyle Tips
[Provide 3-5 practical lifestyle recommendations]

IMPORTANT RULES:
- DO NOT give specific medicine doses
- Include Indian food and remedy names
- Be thorough and comprehensive
- Always emphasize consulting a doctor
- Use clear, simple language"""

    raw_response = query_meditron(prompt)
    
    # Parse the response into structured sections
    what_is = _parse_section(raw_response, "What is")
    symptoms = _parse_section(raw_response, "Key Symptoms|Symptoms")
    medications = _parse_structured_section(raw_response, "Medications Used|Medications")
    meds_avoid = _parse_structured_section(raw_response, "Medications to Avoid")
    foods_eat = _parse_section(raw_response, "Foods to Eat")
    foods_avoid = _parse_structured_section(raw_response, "Foods to Avoid")
    lifestyle = _parse_section(raw_response, "Lifestyle Tips|Lifestyle")
    
    return {
        "name": disease_name,
        "description": what_is[0] if what_is else "",
        "symptoms": symptoms,
        "medications": medications,
        "medications_to_avoid": meds_avoid,
        "foods_to_eat": foods_eat,
        "foods_to_avoid": foods_avoid,
        "lifestyle_tips": lifestyle,
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

    context = "\n\n".join([c["text"][:250] for c in context_chunks])

    prompt = f"""A patient reports these symptoms: {symptoms_str}

MEDICAL KNOWLEDGE:
{context}

Based on this knowledge, write a DETAILED response with these exact sections. For each section, provide SPECIFIC information - do NOT repeat the instructions:

🔍 TOP 3 POSSIBLE CONDITIONS

Condition 1:
- What is it?
- Why these symptoms match
- Likelihood: High/Medium/Low
- Key symptom to watch
- When to see doctor: Emergency/1-2 days/Routine

Condition 2:
[Same format]

Condition 3:
[Same format]

⚠️ IMPORTANT NOTE
This is NOT a diagnosis. These are possible conditions. Always see a doctor.

🚨 EMERGENCY CHECK
If any symptoms suggest emergency, state: "SEEK EMERGENCY CARE IMMEDIATELY"

RULES:
- Be detailed and informative
- Provide reasoning for each condition
- Use simple, clear language
- Always emphasize need for doctor consultation"""

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
    
    context = "\n\n".join([c["text"][:250] for c in context_chunks])

    prompt = f"""Based on the medical knowledge below, write a DETAILED and COMPLETE guide about the medicine {drug_name}.

MEDICAL KNOWLEDGE:
{context}

Write your response with these exact sections. For each section, provide SPECIFIC, DETAILED medical information - do NOT repeat the instructions:

💊 What is {drug_name}?
{drug_name} is... [Explain the drug class and description]

🎯 What it treats
[List the conditions and diseases this medicine treats]

⚙️ How it works
[Explain the mechanism of action in simple terms]

⚠️ Common Side Effects
[List common side effects, marking which are serious]

🔗 Important Interactions
[List drugs and substances to avoid with this medicine]

🚫 What to Avoid While Taking
[Explain foods, alcohol, and activities to avoid]

❌ Who Should NOT Take It
[List contraindications and who should avoid this medicine]

🤰 Pregnancy & Breastfeeding
[Provide safety information for pregnancy and breastfeeding]

IMPORTANT RULES:
- DO NOT say "dosage varies" - say actual typical ranges then note "consult your doctor"
- Include Indian brand names like Allercet, Zandine for {drug_name}
- Use clear medical terminology with simple explanations
- Be comprehensive and thorough
- Always remind to consult doctors"""

    raw_response = query_meditron(prompt)
    
    # Parse structured response
    what_is = _parse_section(raw_response, "What is")
    what_treats = _parse_section(raw_response, "What it treats")
    how_works = _parse_section(raw_response, "How it works")
    side_effects = _parse_section(raw_response, "Common Side Effects|Side Effects")
    interactions = _parse_structured_section(raw_response, "Important Interactions|Interactions")
    avoid = _parse_section(raw_response, "What to Avoid")
    contraindications = _parse_section(raw_response, "Who Should NOT")
    pregnancy = _parse_section(raw_response, "Pregnancy|Breastfeeding")
    
    return {
        "drug": drug_name,
        "description": what_is[0] if what_is else "",
        "what_treats": what_treats,
        "how_works": how_works[0] if how_works else "",
        "side_effects": side_effects,
        "interactions": interactions,
        "avoid": avoid,
        "contraindications": contraindications,
        "pregnancy": pregnancy,
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
    context = "\n\n".join([c["text"][:200] for c in context_chunks])
    
    user_context = ""
    if user_conditions:
        user_context = f"\n[Patient has: {', '.join(user_conditions)}]"
    if pregnancy:
        user_context += "\n[PREGNANT - apply pregnancy safety guidelines]"

    system_msg = MEDITRON_SYSTEM_PROMPT + user_context if user_context else MEDITRON_SYSTEM_PROMPT

    # Build message history for Meditron
    messages = [
        {"role": m["role"], "content": m["content"]}
        for m in history[-6:]  # Last 3 exchanges
    ]
    messages.append({
        "role": "user", 
        "content": f"MEDICAL CONTEXT:\n{context}\n\nUSER: {message}"
    })

    async for chunk in stream_meditron(messages, system=system_msg):
        yield chunk
    
    yield DISCLAIMER
