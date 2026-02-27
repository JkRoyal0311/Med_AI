# 🏥 MedAI — Complete Production-Ready Plan
### React Native + Expo Frontend · Python FastAPI + Meditron 70B Backend
### 5-Hour Sprint · 4-Member Team · From Scratch to Deployment

---

> **⚠️ Medical Disclaimer (Build This Into Every Screen)**
> MedAI provides AI-generated health information for educational purposes only.
> It is NOT a substitute for professional medical advice, diagnosis, or treatment.
> Always consult a licensed doctor or pharmacist before making any health decisions.

---

## 📋 Table of Contents
1. [Team Roles & 5-Hour Timeline](#team-roles)
2. [Full Tech Stack](#tech-stack)
3. [System Architecture](#architecture)
4. [Backend — Member A](#member-a)
5. [Backend — Member B](#member-b)
6. [Frontend — Member C](#member-c)
7. [Frontend — Member D](#member-d)
8. [Integration & Deployment](#integration)
9. [Production Roadmap](#production-roadmap)

---

## 👥 Team Roles & 5-Hour Timeline {#team-roles}

```
TOTAL: 5 HOURS  |  4 MEMBERS  |  All work in parallel after Hour 1 sync

HOUR 0:00 → 0:30  ALL MEMBERS — Setup sync, clone repo, run shared setup script
HOUR 0:30 → 2:30  PARALLEL WORK (2 hours each person on their module)
HOUR 2:30 → 3:30  PARALLEL WORK continues
HOUR 3:30 → 4:30  Integration — connect frontend to backend, fix issues together
HOUR 4:30 → 5:00  Testing, polish, deploy to staging
```

| Member | Role | Responsibilities | Hours Active |
|--------|------|-----------------|--------------|
| **Member A** | Backend Lead | Meditron 70B setup, RAG pipeline, AI service, disease→drug logic | 0:00–4:30 |
| **Member B** | Backend API | FastAPI routes, PostgreSQL models, drug checker, food guide, symptom predictor | 0:30–4:30 |
| **Member C** | Frontend Lead | App navigation, Home screen, Disease Detail, animations, design system | 0:30–4:30 |
| **Member D** | Frontend Features | Search screen, Drug Info, Symptom Checker, Chat screen, disclaimer system | 0:30–4:30 |

---

## 🛠 Full Tech Stack {#tech-stack}

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.11+ | Primary language |
| FastAPI | 0.115 | REST API framework, auto Swagger docs |
| Uvicorn | 0.30 | ASGI server, handles async requests |
| SQLAlchemy | 2.0 | ORM for PostgreSQL |
| PostgreSQL | 15 | Main relational database |
| Alembic | 1.13 | Database migrations |
| Meditron 70B | via Ollama | Medical LLM, self-hosted, free |
| ChromaDB | 0.5 | Vector database for RAG |
| sentence-transformers | 3.2 | Text → embeddings for RAG search |
| Redis | 7 | Response caching, session store |
| Pydantic | 2.9 | Request/response validation |
| python-jose | 3.3 | JWT authentication |
| passlib + bcrypt | latest | Password hashing |
| httpx | 0.27 | Async HTTP client for OpenFDA calls |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React Native | 0.74 | Cross-platform mobile (iOS + Android) |
| Expo | 51 | Toolchain, OTA updates, camera, notifications |
| Expo Router | 3 | File-based navigation (like Next.js for mobile) |
| NativeWind | 4 | Tailwind CSS utility classes for React Native |
| React Native Reanimated | 3 | Smooth 60fps animations |
| React Native Gesture Handler | 2 | Swipe, pan, pinch gestures |
| Moti | 0.29 | Animation primitives (built on Reanimated) |
| React Query (TanStack) | 5 | Server state, caching, loading/error states |
| Zustand | 4 | Global client state (auth, user profile) |
| Axios | 1.7 | HTTP client with interceptors |
| React Native Linear Gradient | latest | Beautiful gradient backgrounds |
| React Native SVG | 15 | Icons, illustrations |
| Lottie React Native | 6 | JSON animations (loading, success states) |
| React Hook Form + Zod | latest | Form validation |
| AsyncStorage | latest | Persist auth token on device |
| Expo Haptics | latest | Tactile feedback on interactions |

---

## 🏗 System Architecture {#architecture}

```
┌─────────────────────────────────────────────────────────────────────┐
│                         REACT NATIVE APP (Expo)                     │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │  Home    │  │Disease Detail│  │  Drug Info │  │  Symptom     │  │
│  │  Screen  │  │  + Food Guide│  │  Lookup    │  │  Checker     │  │
│  └────┬─────┘  └──────┬───────┘  └─────┬──────┘  └──────┬───────┘  │
│       └───────────────┴─────────────────┴─────────────────┘         │
│                              Axios + React Query                     │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ HTTPS REST + SSE Streaming
┌────────────────────────────────▼────────────────────────────────────┐
│                       FASTAPI PYTHON BACKEND                        │
│  ┌──────────┐  ┌────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  /auth   │  │ /diseases  │  │   /symptoms  │  │   /ai/chat   │  │
│  │  /users  │  │ /medicines │  │   /drugs     │  │   /stream    │  │
│  └──────────┘  └────────────┘  └──────────────┘  └──────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    AI SERVICE LAYER                          │   │
│  │  RAG Pipeline → ChromaDB → Meditron 70B (Ollama) → Safety  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  PostgreSQL ──── Redis Cache ──── ChromaDB Vector Store            │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Meditron 70B (Ollama)  │
                    │   Running on your server │
                    │   Port 11434            │
                    └─────────────────────────┘
```

### Key Feature Flows

```
FLOW 1 — Disease Input:
User types "Type 2 Diabetes"
  → FastAPI /api/diseases/search
  → PostgreSQL lookup + ChromaDB RAG retrieval
  → Meditron generates: drugs to take, drugs to avoid, foods to eat,
    foods to avoid, symptoms, lifestyle tips
  → Response + disclaimer shown in beautiful card UI

FLOW 2 — Symptom Input:
User types "frequent urination, fatigue, blurred vision"
  → FastAPI /api/symptoms/predict
  → Meditron analyzes symptoms with medical context
  → Returns: top 3 possible conditions with confidence %
  → Each condition links to Flow 1 above
  → Disclaimer: "This is NOT a diagnosis. See a doctor."

FLOW 3 — Drug Lookup:
User types "Metformin"
  → FastAPI /api/drugs/info
  → OpenFDA API + ChromaDB RAG
  → Meditron generates: what it treats, dosage info, side effects,
    interactions, what to avoid while taking it
  → Full drug profile card shown

FLOW 4 — AI Chat:
User asks free-form health question
  → FastAPI /api/ai/chat (streaming SSE)
  → Full RAG pipeline → Meditron 70B
  → Response streams word by word into chat bubble
  → Disclaimer appended to every message
```

---

# 👨‍💻 MEMBER A — Backend Lead {#member-a}
## Meditron 70B Setup + RAG Pipeline + AI Service
### Time: Hour 0:00 → Hour 4:30

---

### STEP A1 — Initial Project Setup (Hour 0:00–0:30, ALL MEMBERS do this together)

**This step is done once by Member A while others watch, then everyone pulls the repo.**

```bash
# Member A runs these commands:
mkdir medai && cd medai
mkdir backend frontend

# ── Backend setup ────────────────────────────────────────────
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Create all folders
mkdir -p app/api/routes app/core app/models app/schemas
mkdir -p app/services app/ai app/data medical_knowledge tests

# Create requirements.txt
cat > requirements.txt << 'EOF'
fastapi==0.115.0
uvicorn[standard]==0.30.6
sqlalchemy==2.0.35
psycopg2-binary==2.9.9
alembic==1.13.3
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.12
python-dotenv==1.0.1
chromadb==0.5.15
sentence-transformers==3.2.1
httpx==0.27.2
redis==5.1.1
pydantic==2.9.2
pydantic-settings==2.5.2
ollama==0.3.3
EOF

pip install -r requirements.txt
# Takes 4-5 minutes — team discusses architecture meanwhile

# ── Create .env ───────────────────────────────────────────────
cat > .env << 'EOF'
APP_NAME=MedAI
DEBUG=True
SECRET_KEY=medai_super_secret_key_change_in_production_min_32_chars
DATABASE_URL=postgresql://postgres:password@localhost:5432/medai_db
REDIS_URL=redis://localhost:6379
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
OLLAMA_BASE_URL=http://localhost:11434
MEDITRON_MODEL=meditron
OPENFDA_BASE_URL=https://api.fda.gov
EOF

echo ".env" > .gitignore
echo "venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "chroma_db/" >> .gitignore

# ── Push to GitHub so all members can clone ───────────────────
git init && git add . && git commit -m "initial project setup"
# Create repo on GitHub, then:
# git remote add origin https://github.com/yourteam/medai.git
# git push -u origin main
```

---

### STEP A2 — Install & Configure Meditron 70B via Ollama (Hour 0:30–1:30)

**Why Ollama?** Ollama is a tool that lets you run large language models locally with one command. It handles all the GPU/CPU optimization, model loading, and provides an API automatically. Meditron 70B is a model specifically fine-tuned on medical literature — PubMed papers, clinical guidelines, and medical textbooks — making it far more accurate for MedAI than a general model.

```bash
# ── Install Ollama ────────────────────────────────────────────
# On Linux/Mac:
curl -fsSL https://ollama.ai/install.sh | sh

# On Windows: Download installer from https://ollama.ai

# ── Pull Meditron 70B ─────────────────────────────────────────
# WARNING: This is a 40GB download. Start this FIRST.
# If server doesn't have 40GB, use meditron:7b (4GB) for development
ollama pull meditron
# OR for limited hardware:
ollama pull meditron:7b

# ── Verify it works ───────────────────────────────────────────
ollama list
# Should show: meditron  <hash>  40 GB

# Test a quick medical question:
ollama run meditron "What medicines are used for Type 2 Diabetes? Keep answer brief."
# Should return a medical answer in ~10-30 seconds

# ── Ollama runs as a background service ──────────────────────
# It starts automatically after install on Linux
# Manual start: ollama serve
# API is available at: http://localhost:11434/api/chat
```

Now create the Ollama client wrapper:

```python
# app/ai/meditron_client.py
"""
Meditron 70B client via Ollama.
Ollama provides an OpenAI-compatible API so switching models is easy.
This file wraps all calls to Meditron with proper error handling,
timeout management, and streaming support.
"""
import ollama
import httpx
import json
from typing import AsyncGenerator
from app.core.config import settings

# ── Meditron Medical System Prompt ────────────────────────────
# This prompt is the "personality" of our medical AI.
# It defines scope, safety rules, response format, and tone.
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

STRICT SAFETY RULES — NEVER BREAK THESE:
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
    
    Args:
        prompt: The user's question or query
        system: System prompt (defaults to medical system prompt above)
    
    Returns:
        Complete text response from Meditron
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
                "temperature": 0.2,     # Low = factual, consistent answers
                "top_p": 0.9,           # Nucleus sampling for quality
                "num_predict": 1024,    # Max tokens in response
                "stop": ["</s>", "[INST]"]  # Stop tokens for Meditron format
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
    
    This makes the app feel much more responsive — users see text
    immediately instead of waiting 10-30 seconds for a full response.
    
    Yields:
        Individual text chunks as they are generated
    """
    if not check_ollama_running():
        yield "AI service is temporarily unavailable. Please try again."
        return

    try:
        # Use httpx async client for streaming
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
```

---

### STEP A3 — Medical Knowledge Base (Hour 1:30–2:30)

**What is the knowledge base?** These are carefully written text files about each disease. The RAG system uses these to give Meditron accurate, specific context before it answers. Without RAG, Meditron answers from general training. With RAG, it answers from YOUR validated medical documents — much more accurate.

```
medical_knowledge/
├── diabetes.txt
├── hypertension.txt
├── hypothyroidism.txt
├── kidney_disease.txt
├── asthma.txt
├── arthritis.txt
├── anemia.txt
├── drug_interactions.txt
└── general_nutrition.txt
```

Create `medical_knowledge/diabetes.txt`:

```
DISEASE: Type 2 Diabetes Mellitus
CATEGORY: Metabolic / Endocrine
ICD-10: E11
SEVERITY: Chronic — manageable with medication and diet

DESCRIPTION:
Type 2 diabetes occurs when cells become resistant to insulin and the pancreas 
cannot produce enough insulin to overcome this resistance. Blood glucose stays 
elevated above normal (fasting glucose above 126 mg/dL, HbA1c above 6.5%).

SYMPTOMS:
- Frequent urination (polyuria) — especially at night
- Excessive thirst (polydipsia)
- Unexplained weight loss
- Fatigue and weakness
- Blurred vision
- Slow-healing wounds and infections
- Tingling or numbness in hands and feet (neuropathy — late sign)
- Frequent infections (skin, urinary tract, gums)
- Darkened skin in armpits and neck (acanthosis nigricans)

MEDICATIONS USED (First-line to advanced):
1. METFORMIN (Glucophage, Glycomet, Gluformin)
   - First choice drug for most Type 2 diabetes patients
   - Reduces glucose production by the liver
   - Does not cause low blood sugar on its own
   - Take with food to reduce stomach upset
   - AVOID if: kidney disease (GFR below 30), liver disease, heavy alcohol use
   
2. GLIPIZIDE / GLIBENCLAMIDE (Sulfonylureas)
   - Stimulates pancreas to release more insulin
   - RISK: Can cause hypoglycemia (low blood sugar) — patient must carry glucose tablets
   - Avoid in elderly patients — hypoglycemia risk is higher

3. SITAGLIPTIN (Januvia) — DPP-4 Inhibitor
   - Well tolerated, low hypoglycemia risk
   - Good option for patients who cannot tolerate Metformin

4. EMPAGLIFLOZIN / DAPAGLIFLOZIN (SGLT2 Inhibitors)
   - Also protect the heart and kidneys
   - Cause glucose loss through urine
   - RISK: Urinary tract infections, genital yeast infections, dehydration

5. INSULIN (various types — Regular, NPH, Glargine, Aspart)
   - Used when oral medications are not enough
   - Requires blood glucose monitoring and dose adjustment by doctor

MEDICATIONS TO AVOID WITH DIABETES:
- High-dose corticosteroids (Prednisone, Dexamethasone) — raise blood sugar significantly
- Thiazide diuretics in high doses — worsen glucose control
- Atypical antipsychotics (Olanzapine, Clozapine) — cause weight gain + insulin resistance
- Fluoroquinolone antibiotics (Ciprofloxacin) — can cause dangerous glucose fluctuations

FOODS TO EAT:
- Bitter gourd / Karela: Contains charantin — natural blood sugar reducer
- Fenugreek / Methi seeds: Soaked overnight, 1 tsp daily — slows glucose absorption
- Indian gooseberry / Amla: Improves insulin sensitivity
- Oats and barley: Beta-glucan fiber reduces glucose spikes after meals
- Brown rice / unpolished rice: Much lower glycemic index than white rice (55 vs 72)
- Leafy greens — Palak, methi leaves, bathua: Low glycemic, high magnesium
- Lentils / Dal — masoor, moong, chana: Low GI protein, fiber slows glucose absorption
- Almonds and walnuts (handful daily): Improve insulin sensitivity
- Turmeric / Haldi: Curcumin has blood glucose lowering effects
- Cinnamon / Dalchini: May improve insulin sensitivity

FOODS TO STRICTLY AVOID:
- White rice (chawal): GI of 72 — causes rapid glucose spike. Replace with brown rice
- Sugar, mithai, gulab jamun, jalebi: Direct glucose spike
- Maida (refined flour) — bread, naan, paratha: Rapid glucose rise
- Packaged fruit juices: All fiber removed, concentrated sugar
- Soft drinks and sodas: 8-10 teaspoons of sugar per can
- Honey and jaggery / Gud: Still sugar despite being "natural" — will raise glucose
- Potatoes and white potato products: High starch, high GI
- Alcohol: Interferes with liver glucose regulation

DANGEROUS COMBINATIONS:
- Metformin + Alcohol: Risk of lactic acidosis (rare but life-threatening)
- Sulfonylureas + Alcohol: Severe hypoglycemia risk
- Insulin + vigorous exercise without glucose adjustment: Hypoglycemia
```

Create `medical_knowledge/hypertension.txt`:

```
DISEASE: Hypertension (High Blood Pressure)
CATEGORY: Cardiovascular
ICD-10: I10
SEVERITY: Chronic — serious if uncontrolled

DESCRIPTION:
Hypertension is blood pressure consistently above 140/90 mmHg. 
Stage 2: above 160/100 mmHg. Damages kidneys, eyes, heart, blood vessels.
Often called the "silent killer" as most patients have no symptoms.

SYMPTOMS:
- Usually NO symptoms (that is why it is dangerous)
- Severe hypertension: severe headache (back of head, worse in morning)
- Blurred vision or vision changes
- Nausea and vomiting
- Chest pain or tightness
- Shortness of breath
- Nosebleeds (epistaxis)
- Dizziness or lightheadedness
EMERGENCY: Sudden severe headache + confusion + vision loss = hypertensive crisis

MEDICATIONS USED:
1. AMLODIPINE (Calcium Channel Blocker)
   - Relaxes blood vessels. Once daily. Well tolerated.
   - Side effects: ankle swelling, flushing, headache
   
2. LOSARTAN / TELMISARTAN (ARB — Angiotensin Receptor Blocker)
   - Protects kidneys especially in diabetes + hypertension
   - AVOID in pregnancy (damages fetal kidneys)
   - Side effect: dizziness on standing up (postural hypotension)

3. ENALAPRIL / RAMIPRIL (ACE Inhibitor)
   - Excellent for diabetic patients. Protects kidneys.
   - Side effect: persistent dry cough in 10-15% of patients
   - If cough develops, switch to ARB

4. ATENOLOL / METOPROLOL (Beta Blocker)
   - Used with heart disease + hypertension
   - CAUTION: Can worsen asthma
   - NEVER stop suddenly — taper dose gradually

5. HYDROCHLOROTHIAZIDE / INDAPAMIDE (Thiazide Diuretic)
   - Removes excess fluid and sodium
   - Can cause low potassium — eat bananas, avoid potassium supplements with ACE inhibitors

MEDICATIONS TO AVOID WITH HYPERTENSION:
- NSAIDs (Ibuprofen, Diclofenac, Naproxen): Raise BP by retaining sodium. Use Paracetamol instead.
- Decongestants with Pseudoephedrine (in cold medicines): Constrict blood vessels, spike BP
- Combined oral contraceptives (estrogen-containing pills): Can raise BP by 5-10 mmHg
- Liquorice supplements or excessive liquorice: Raises BP significantly

FOODS TO EAT:
- Banana (Kela): High potassium — counteracts sodium's BP-raising effect
- Beetroot / Chukandar juice: Dietary nitrates dilate blood vessels, reduce BP
- Garlic / Lahsun (2-3 raw cloves daily): Allicin has vasodilating effect
- Flaxseeds / Alsi (1 tbsp ground): Omega-3 reduces arterial stiffness
- Spinach / Palak: High potassium and magnesium
- Pomegranate juice (unsweetened): Reduces systolic BP
- Dark chocolate (70%+ cocoa, small amount): Flavanols improve vessel elasticity
- Oats: Soluble fiber supports BP control

FOODS TO STRICTLY AVOID:
- Salt above 2g/day: Every extra gram raises BP by 2-3 mmHg. Read labels!
- Pickles / Achar: Extremely high sodium — one tablespoon = 1 day's sodium allowance
- Papads and packaged namkeen: Very high sodium
- Processed meats (sausages, salami, packaged chicken): Loaded with sodium
- Canned foods: Sodium as preservative
- Alcohol: Raises BP acutely and chronically
- Energy drinks (Red Bull etc.): Caffeine + stimulants spike BP
```

---

### STEP A4 — RAG Indexer & Retrieval System (Hour 2:30–3:30)

```python
# app/ai/rag_engine.py
"""
RAG (Retrieval-Augmented Generation) Engine for MedAI.

HOW IT WORKS:
1. At startup (or when triggered), read all .txt files in medical_knowledge/
2. Split each file into overlapping chunks of ~400 characters
3. Convert each chunk to a 384-dimensional vector using sentence-transformers
4. Store all vectors + text in ChromaDB (persistent on disk)

At query time:
1. Convert the user's question to a vector
2. Find the 5 most similar vectors in ChromaDB (cosine similarity search)
3. Return the text of those 5 chunks
4. These chunks become Meditron's context — it answers based on them
"""
import os
import chromadb
from chromadb.config import Settings as ChromaSettings
from sentence_transformers import SentenceTransformer

# Paths
KNOWLEDGE_DIR = "medical_knowledge"
CHROMA_DIR    = "chroma_db"
COLLECTION    = "medai_knowledge"
CHUNK_SIZE    = 400
OVERLAP       = 80

# Load embedding model once at module level (cached after first load)
print("⏳ Loading medical embedding model...")
_embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
print("✅ Embedding model loaded")

# ChromaDB client (persistent on disk)
_chroma = chromadb.PersistentClient(
    path=CHROMA_DIR,
    settings=ChromaSettings(anonymized_telemetry=False)
)


def _get_collection():
    return _chroma.get_or_create_collection(
        name=COLLECTION,
        metadata={"hnsw:space": "cosine"}
    )


def _chunk_text(text: str) -> list[str]:
    """
    Split text into overlapping chunks.
    
    Why overlap? Medical sentences often span chunk boundaries.
    Example: "...avoid Ibuprofen. | Paracetamol is safe for..."
    Without overlap, the second sentence loses context.
    With overlap, both chunks contain the full recommendation.
    """
    chunks, start = [], 0
    while start < len(text):
        end = start + CHUNK_SIZE
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start += CHUNK_SIZE - OVERLAP
    return chunks


def build_index():
    """
    Build or rebuild the medical knowledge vector index.
    Call this: at server startup, and whenever knowledge files are updated.
    Takes ~30-60 seconds depending on number of files.
    """
    collection = _get_collection()
    
    all_texts, all_ids, all_metas = [], [], []
    idx = 0

    for fname in sorted(os.listdir(KNOWLEDGE_DIR)):
        if not fname.endswith(".txt"):
            continue
        
        fpath = os.path.join(KNOWLEDGE_DIR, fname)
        text  = open(fpath, "r", encoding="utf-8").read()
        chunks = _chunk_text(text)
        disease = fname.replace(".txt", "").replace("_", " ").title()

        for chunk in chunks:
            all_texts.append(chunk)
            all_ids.append(f"chunk_{idx}")
            all_metas.append({"source": disease, "file": fname, "idx": idx})
            idx += 1

        print(f"  📄 {fname}: {len(chunks)} chunks")

    if not all_texts:
        print("⚠️  No .txt files found in medical_knowledge/")
        return 0

    # Delete existing and re-add (clean re-index)
    try:
        _chroma.delete_collection(COLLECTION)
    except Exception:
        pass
    
    collection = _chroma.get_or_create_collection(
        name=COLLECTION,
        metadata={"hnsw:space": "cosine"}
    )

    print(f"🔢 Embedding {len(all_texts)} chunks (this takes ~30s)...")
    embeddings = _embedder.encode(all_texts, show_progress_bar=True).tolist()

    # Add in batches of 100 (ChromaDB limit per call)
    batch_size = 100
    for i in range(0, len(all_texts), batch_size):
        collection.add(
            documents=all_texts[i:i+batch_size],
            embeddings=embeddings[i:i+batch_size],
            ids=all_ids[i:i+batch_size],
            metadatas=all_metas[i:i+batch_size]
        )

    total = collection.count()
    print(f"✅ RAG index built: {total} chunks ready")
    return total


def retrieve(query: str, n: int = 5) -> list[dict]:
    """
    Semantic search — find medical knowledge most relevant to a query.
    
    Args:
        query: User's question or the disease/symptom they entered
        n: Number of chunks to retrieve (5 is a good balance)
    
    Returns:
        List of relevant text chunks with source and relevance score
    
    Example:
        retrieve("diabetes foods to avoid")
        → Returns chunks about diabetic diet from diabetes.txt
    """
    collection = _get_collection()
    count = collection.count()
    
    if count == 0:
        print("⚠️  Knowledge base is empty — run build_index() first")
        return []

    q_embedding = _embedder.encode(query).tolist()
    
    results = collection.query(
        query_embeddings=[q_embedding],
        n_results=min(n, count),
        include=["documents", "metadatas", "distances"]
    )

    chunks = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    ):
        # cosine distance: 0=identical, 1=opposite. Keep only relevant ones.
        if dist < 0.8:
            chunks.append({
                "text": doc,
                "source": meta.get("source", "General"),
                "relevance": round(1 - dist, 3)
            })

    return sorted(chunks, key=lambda x: x["relevance"], reverse=True)
```

---

### STEP A5 — AI Service (Hour 3:30–4:30)

This is the main AI orchestration layer. Every feature call goes through here.

```python
# app/ai/ai_service.py
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
    
    IMPORTANT: This is not a diagnosis. We make this very clear in the response.
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
    Also calls OpenFDA for official drug label information.
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
    
    The conversation history means Meditron remembers earlier messages —
    "What about Metformin?" works because it knows from context you were
    discussing diabetes.
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
```

---

# 👨‍💻 MEMBER B — Backend API {#member-b}
## FastAPI Routes, Database Models, All Endpoints
### Time: Hour 0:30 → Hour 4:30

---

### STEP B1 — Database Models & Config (Hour 0:30–1:30)

```python
# app/core/config.py
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "MedAI"
    DEBUG: bool = False
    SECRET_KEY: str
    DATABASE_URL: str
    REDIS_URL: str = "redis://localhost:6379"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    MEDITRON_MODEL: str = "meditron"
    OPENFDA_BASE_URL: str = "https://api.fda.gov"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
```

```python
# app/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_size=20,
    max_overflow=0,
    pool_pre_ping=True,
    echo=settings.DEBUG
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

```python
# app/models/models.py
import uuid
from datetime import datetime
from sqlalchemy import (Column, String, Integer, Boolean, Text, DateTime,
                        Float, ForeignKey, ARRAY)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    user_id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name             = Column(String(100), nullable=False)
    email            = Column(String(150), unique=True, nullable=False, index=True)
    password_hash    = Column(String(255), nullable=False)
    age              = Column(Integer)
    gender           = Column(String(20))
    pregnancy_status = Column(Boolean, default=False)
    created_at       = Column(DateTime, default=datetime.utcnow)
    conditions       = relationship("UserCondition", back_populates="user", cascade="all, delete")
    search_history   = relationship("SearchHistory",  back_populates="user", cascade="all, delete")


class Disease(Base):
    __tablename__ = "diseases"
    disease_id     = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name           = Column(String(150), nullable=False, index=True)
    common_name    = Column(String(100))
    category       = Column(String(80))
    description    = Column(Text)
    severity_level = Column(String(20))
    icd10_code     = Column(String(10))
    medicines      = relationship("DiseaseMedicineMap", back_populates="disease")
    foods          = relationship("DiseaseFoodMap",     back_populates="disease")


class Medicine(Base):
    __tablename__ = "medicines"
    medicine_id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    generic_name        = Column(String(200), nullable=False, index=True)
    brand_names         = Column(ARRAY(String))
    drug_class          = Column(String(100))
    mechanism           = Column(Text)
    common_side_effects = Column(ARRAY(String))
    serious_warnings    = Column(ARRAY(String))
    pregnancy_category  = Column(String(5))
    is_otc              = Column(Boolean, default=False)


class DiseaseMedicineMap(Base):
    __tablename__ = "disease_medicine_map"
    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    disease_id        = Column(UUID(as_uuid=True), ForeignKey("diseases.disease_id"))
    medicine_id       = Column(UUID(as_uuid=True), ForeignKey("medicines.medicine_id"))
    relationship_type = Column(String(30))  # Recommended / Avoid / Caution
    reason            = Column(Text)
    disease           = relationship("Disease",  back_populates="medicines")
    medicine          = relationship("Medicine")


class DrugInteraction(Base):
    __tablename__ = "drug_interactions"
    interaction_id  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    medicine_a_id   = Column(UUID(as_uuid=True), ForeignKey("medicines.medicine_id"))
    medicine_b_id   = Column(UUID(as_uuid=True), ForeignKey("medicines.medicine_id"))
    severity        = Column(String(30))
    clinical_effect = Column(Text)
    management      = Column(Text)
    medicine_a      = relationship("Medicine", foreign_keys=[medicine_a_id])
    medicine_b      = relationship("Medicine", foreign_keys=[medicine_b_id])


class Food(Base):
    __tablename__ = "foods"
    food_id        = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name           = Column(String(150), nullable=False)
    local_names    = Column(ARRAY(String))
    category       = Column(String(50))
    glycemic_index = Column(Integer)


class DiseaseFoodMap(Base):
    __tablename__ = "disease_food_map"
    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    disease_id          = Column(UUID(as_uuid=True), ForeignKey("diseases.disease_id"))
    food_id             = Column(UUID(as_uuid=True), ForeignKey("foods.food_id"))
    recommendation      = Column(String(30))
    reason              = Column(Text)
    quantity_suggestion = Column(String(200))
    disease             = relationship("Disease", back_populates="foods")
    food                = relationship("Food")


class UserCondition(Base):
    __tablename__ = "user_conditions"
    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id    = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    disease_id = Column(UUID(as_uuid=True), ForeignKey("diseases.disease_id"))
    user       = relationship("User", back_populates="conditions")
    disease    = relationship("Disease")


class SearchHistory(Base):
    __tablename__ = "search_history"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id     = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    query       = Column(String(300))
    query_type  = Column(String(30))  # disease / symptom / drug
    created_at  = Column(DateTime, default=datetime.utcnow)
    user        = relationship("User", back_populates="search_history")
```

---

### STEP B2 — All API Routes (Hour 1:30–3:30)

```python
# app/api/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.models import User
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Auth"])

class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str
    age: Optional[int] = None
    gender: Optional[str] = None

class LoginIn(BaseModel):
    email: EmailStr
    password: str

@router.post("/register", status_code=201)
async def register(data: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "Email already registered")
    user = User(name=data.name, email=data.email,
                password_hash=hash_password(data.password),
                age=data.age, gender=data.gender)
    db.add(user); db.commit(); db.refresh(user)
    token = create_access_token({"sub": str(user.user_id)})
    return {"token": token, "user": {"id": str(user.user_id), "name": user.name, "email": user.email}}

@router.post("/login")
async def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token({"sub": str(user.user_id)})
    return {"token": token, "user": {"id": str(user.user_id), "name": user.name, "email": user.email}}
```

```python
# app/api/routes/medical.py
"""
Main medical routes — disease info, symptom prediction, drug lookup.
All the core MedAI features live here.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
import httpx, redis, json, hashlib

from app.core.database import get_db
from app.core.config import settings
from app.core.security import get_current_user
from app.ai.ai_service import disease_info, predict_disease, drug_info, chat_stream
from app.models.models import Disease, Medicine, SearchHistory

router = APIRouter(prefix="/medical", tags=["Medical AI"])

# Redis for caching expensive Meditron calls
try:
    cache = redis.from_url(settings.REDIS_URL, decode_responses=True)
    cache.ping()
    CACHE_ON = True
except Exception:
    CACHE_ON = False
    print("Redis unavailable — caching disabled")

CACHE_TTL = 7200  # Cache for 2 hours


def _cache_key(prefix: str, value: str) -> str:
    return f"medai:{prefix}:{hashlib.md5(value.lower().strip().encode()).hexdigest()}"


# ── DISEASE ENDPOINT ──────────────────────────────────────────
@router.get("/disease")
async def get_disease_info(
    name: str = Query(..., min_length=2, description="Disease name e.g. 'Type 2 Diabetes'"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get complete disease information including:
    - What the disease is
    - Symptoms to watch for  
    - Medications to take (with explanations)
    - Medications to avoid (with reasons)
    - Foods to eat (with Indian names)
    - Foods to strictly avoid
    - Lifestyle tips
    All generated by Meditron 70B grounded in RAG medical context.
    """
    key = _cache_key("disease", name)
    
    # Check cache first — Meditron takes 10-30s, cache makes it instant
    if CACHE_ON and (cached := cache.get(key)):
        return json.loads(cached)

    result = disease_info(name)
    
    # Save to cache
    if CACHE_ON:
        cache.setex(key, CACHE_TTL, json.dumps(result))
    
    # Log to search history
    if current_user:
        db.add(SearchHistory(
            user_id=current_user["user_id"],
            query=name,
            query_type="disease"
        ))
        db.commit()

    return result


# ── SYMPTOM PREDICTION ENDPOINT ───────────────────────────────
class SymptomsIn(BaseModel):
    symptoms: list[str]

@router.post("/symptoms/predict")
async def predict_from_symptoms(
    data: SymptomsIn,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Symptom → Disease prediction.
    User enters symptoms like ["fatigue", "frequent urination", "blurred vision"].
    Returns top 3 possible conditions with confidence levels.
    
    ALWAYS includes disclaimer that this is NOT a diagnosis.
    If emergency symptoms detected, response begins with emergency warning.
    """
    if not data.symptoms:
        raise HTTPException(400, "Please provide at least one symptom")
    if len(data.symptoms) > 15:
        raise HTTPException(400, "Too many symptoms (max 15)")

    symptoms_key = ",".join(sorted([s.lower().strip() for s in data.symptoms]))
    key = _cache_key("symptoms", symptoms_key)
    
    if CACHE_ON and (cached := cache.get(key)):
        return json.loads(cached)

    result = predict_disease(data.symptoms)
    
    if CACHE_ON:
        cache.setex(key, CACHE_TTL, json.dumps(result))

    if current_user:
        db.add(SearchHistory(
            user_id=current_user["user_id"],
            query=", ".join(data.symptoms),
            query_type="symptom"
        ))
        db.commit()

    return result


# ── DRUG INFO ENDPOINT ────────────────────────────────────────
@router.get("/drug")
async def get_drug_info(
    name: str = Query(..., min_length=2, description="Drug name e.g. 'Metformin'"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Drug/medicine information lookup.
    User types medicine name → gets:
    - What it treats
    - How it works (simple explanation)
    - Side effects (common and serious)
    - Drug interactions (what NOT to take with it)
    - Foods/activities to avoid while taking it
    - Who should not take it (contraindications)
    - Pregnancy safety category
    
    Also queries local database for structured data if available.
    Does NOT provide dosage recommendations (doctor's role).
    """
    key = _cache_key("drug", name)
    
    if CACHE_ON and (cached := cache.get(key)):
        return json.loads(cached)

    # Check local database first for structured data
    db_medicine = (
        db.query(Medicine)
        .filter(Medicine.generic_name.ilike(f"%{name}%"))
        .first()
    )

    result = drug_info(name)
    
    # Enrich with structured database data if found
    if db_medicine:
        result["structured_data"] = {
            "generic_name": db_medicine.generic_name,
            "brand_names": db_medicine.brand_names,
            "drug_class": db_medicine.drug_class,
            "is_otc": db_medicine.is_otc,
            "pregnancy_category": db_medicine.pregnancy_category,
            "common_side_effects": db_medicine.common_side_effects,
        }

    if CACHE_ON:
        cache.setex(key, CACHE_TTL, json.dumps(result))

    if current_user:
        db.add(SearchHistory(
            user_id=current_user["user_id"],
            query=name,
            query_type="drug"
        ))
        db.commit()

    return result


# ── AI CHAT STREAMING ENDPOINT ────────────────────────────────
class ChatIn(BaseModel):
    message: str
    history: list[dict] = []
    user_conditions: list[str] = []
    pregnancy: bool = False

@router.post("/chat/stream")
async def chat_stream_endpoint(
    data: ChatIn,
    current_user: dict = Depends(get_current_user)
):
    """
    Streaming medical AI chat.
    Returns Server-Sent Events (SSE) — text appears word by word in the app.
    
    Meditron uses full conversation history so follow-up questions work:
    User: "Tell me about diabetes"
    User: "What about the foods?" ← Meditron knows "foods" = diabetic diet
    """
    if not data.message.strip():
        raise HTTPException(400, "Message cannot be empty")

    async def generate():
        async for chunk in chat_stream(
            message=data.message,
            history=data.history,
            user_conditions=data.user_conditions,
            pregnancy=data.pregnancy
        ):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


# ── SEARCH SUGGESTIONS ────────────────────────────────────────
@router.get("/search/suggestions")
async def get_suggestions(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    """Auto-complete suggestions as user types in search bar"""
    diseases = (
        db.query(Disease.name, Disease.common_name, Disease.category)
        .filter(Disease.name.ilike(f"%{q}%"))
        .limit(5)
        .all()
    )
    medicines = (
        db.query(Medicine.generic_name, Medicine.drug_class)
        .filter(Medicine.generic_name.ilike(f"%{q}%"))
        .limit(5)
        .all()
    )
    return {
        "diseases": [{"name": d.name, "common_name": d.common_name, "category": d.category} for d in diseases],
        "medicines": [{"name": m.generic_name, "class": m.drug_class} for m in medicines]
    }


# ── USER SEARCH HISTORY ───────────────────────────────────────
@router.get("/history")
async def get_history(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's recent searches for the history/recents section"""
    history = (
        db.query(SearchHistory)
        .filter(SearchHistory.user_id == current_user["user_id"])
        .order_by(SearchHistory.created_at.desc())
        .limit(20)
        .all()
    )
    return [{"query": h.query, "type": h.query_type, "time": h.created_at} for h in history]
```

```python
# app/core/security.py
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, Header
from app.core.config import settings

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(p: str) -> str:
    return pwd.hash(p)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    payload = {**data, "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def get_current_user(authorization: Optional[str] = Header(None)) -> Optional[dict]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Authentication required")
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return {"user_id": payload["sub"]}
    except JWTError:
        raise HTTPException(401, "Invalid or expired token")
```

---

### STEP B3 — Main App Entry Point & Startup (Hour 3:30–4:30)

```python
# main.py
"""
MedAI FastAPI Application Entry Point.
Handles startup events, middleware, route registration, and Swagger UI config.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import engine, Base
from app.core.config import settings
from app.api.routes import auth, medical
from app.ai.rag_engine import build_index
from app.ai.meditron_client import check_ollama_running
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("medai")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Runs on startup and shutdown"""
    # ── STARTUP ───────────────────────────────────────────────
    logger.info("🚀 Starting MedAI...")
    
    # Create all database tables
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables ready")
    
    # Check Meditron is running
    if check_ollama_running():
        logger.info("✅ Ollama/Meditron is running")
    else:
        logger.warning("⚠️  Ollama not detected at localhost:11434 — run: ollama serve")
    
    # Build RAG index if not built yet
    logger.info("🔢 Building RAG knowledge index...")
    count = build_index()
    logger.info(f"✅ RAG index: {count} chunks ready")
    
    yield  # App runs here
    
    # ── SHUTDOWN ──────────────────────────────────────────────
    logger.info("👋 Shutting down MedAI...")


app = FastAPI(
    title="MedAI API",
    description="AI-Powered Medical Information System — Meditron 70B + RAG",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,    prefix="/api")
app.include_router(medical.router, prefix="/api")

@app.get("/health")
async def health():
    ollama_ok = check_ollama_running()
    return {
        "status": "ok" if ollama_ok else "degraded",
        "meditron": "running" if ollama_ok else "offline",
        "app": settings.APP_NAME,
        "version": "1.0.0"
    }
```

```bash
# Run backend:
uvicorn main:app --reload --port 8000

# Seed database:
python app/data/seed.py

# Test in browser:
# http://localhost:8000/docs   ← Swagger UI, test all endpoints
```

---

# 📱 MEMBER C — Frontend Lead {#member-c}
## Navigation, Design System, Home Screen, Disease Detail
### Time: Hour 0:30 → Hour 4:30

---

### STEP C1 — React Native + Expo Setup (Hour 0:30–1:00)

```bash
cd medai/frontend

# Create Expo app with TypeScript
npx create-expo-app@latest . --template blank-typescript
# Choose: blank-typescript

# Install all packages at once
npx expo install \
  expo-router \
  expo-haptics \
  expo-linear-gradient \
  expo-status-bar \
  @expo/vector-icons \
  react-native-safe-area-context \
  react-native-screens \
  react-native-gesture-handler \
  react-native-reanimated \
  @react-native-async-storage/async-storage

npm install \
  nativewind \
  tailwindcss \
  moti \
  @tanstack/react-query \
  axios \
  zustand \
  react-hook-form \
  @hookform/resolvers \
  zod \
  react-native-svg

# Configure NativeWind (Tailwind for React Native)
cat > tailwind.config.js << 'EOF'
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary:   "#0D7377",
        secondary: "#14BDAC",
        accent:    "#F4A261",
        danger:    "#E76F51",
        bg:        "#F8FAFB",
        card:      "#FFFFFF",
        text:      "#1A1A1A",
        muted:     "#6B7280",
      }
    }
  },
  plugins: [],
};
EOF

# Configure babel for Reanimated + NativeWind
cat > babel.config.js << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      "nativewind/babel",
      "react-native-reanimated/plugin",
    ],
  };
};
EOF

# Update app.json for Expo Router
# Add to app.json inside "expo": {}
# "scheme": "medai",
# "web": { "bundler": "metro" }
```

---

### STEP C2 — API Service + Global State (Hour 1:00–1:30)

```typescript
// services/api.ts
/**
 * Central API service.
 * All backend calls go through here — easy to change BASE_URL for production.
 * Axios interceptors automatically attach JWT token to every request.
 */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your computer's local IP for device testing
// Find it: Mac → ifconfig | grep inet, Windows → ipconfig
export const BASE_URL = 'http://192.168.1.100:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,  // 60s — Meditron can be slow on first run
});

// Attach token automatically to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('medai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
  res => res.data,
  async err => {
    if (err.response?.status === 401) {
      await AsyncStorage.removeItem('medai_token');
      // Auth store will handle redirect
    }
    return Promise.reject(err.response?.data || { error: 'Network error' });
  }
);

export const authAPI = {
  register: (d: any) => api.post('/auth/register', d),
  login:    (d: any) => api.post('/auth/login',    d),
};

export const medicalAPI = {
  getDiseaseInfo:    (name: string)         => api.get(`/medical/disease?name=${encodeURIComponent(name)}`),
  predictDisease:    (symptoms: string[])   => api.post('/medical/symptoms/predict', { symptoms }),
  getDrugInfo:       (name: string)         => api.get(`/medical/drug?name=${encodeURIComponent(name)}`),
  getSuggestions:    (q: string)            => api.get(`/medical/search/suggestions?q=${encodeURIComponent(q)}`),
  getHistory:        ()                     => api.get('/medical/history'),
};

// Streaming chat — returns a ReadableStream for SSE
export async function streamChat(data: {
  message: string;
  history: any[];
  user_conditions?: string[];
  pregnancy?: boolean;
}): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  const token = await AsyncStorage.getItem('medai_token');
  const response = await fetch(`${BASE_URL}/medical/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.body!.getReader();
}
```

```typescript
// store/authStore.ts
/**
 * Zustand global auth store.
 * Manages user login state across the entire app.
 * Zustand is simpler than Redux — no boilerplate, just a hook.
 */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

interface AuthState {
  user: { id: string; name: string; email: string } | null;
  token: string | null;
  loading: boolean;
  login:   (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout:  () => Promise<void>;
  restore: () => Promise<void>;  // Called on app open
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, token: null, loading: true,

  restore: async () => {
    const token = await AsyncStorage.getItem('medai_token');
    const user  = await AsyncStorage.getItem('medai_user');
    set({ token, user: user ? JSON.parse(user) : null, loading: false });
  },

  login: async (email, password) => {
    const res: any = await authAPI.login({ email, password });
    await AsyncStorage.setItem('medai_token', res.token);
    await AsyncStorage.setItem('medai_user', JSON.stringify(res.user));
    set({ token: res.token, user: res.user });
  },

  register: async (data) => {
    const res: any = await authAPI.register(data);
    await AsyncStorage.setItem('medai_token', res.token);
    await AsyncStorage.setItem('medai_user', JSON.stringify(res.user));
    set({ token: res.token, user: res.user });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['medai_token', 'medai_user']);
    set({ token: null, user: null });
  },
}));
```

---

### STEP C3 — Design System & Reusable Components (Hour 1:30–2:30)

```typescript
// components/ui/DisclaimerBanner.tsx
/**
 * Disclaimer banner — shown on EVERY screen that displays medical info.
 * This is a legal and ethical requirement. Do not remove or hide this.
 */
import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';

export function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  const [expanded, setExpanded] = useState(!compact);

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      className="bg-amber-50 border border-amber-300 rounded-2xl p-4 mx-4 mb-3"
    >
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        className="flex-row items-center gap-2"
      >
        <Ionicons name="warning" size={18} color="#D97706" />
        <Text className="text-amber-800 font-bold text-sm flex-1">
          ⚠️ Medical Disclaimer
        </Text>
        {compact && (
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16} color="#D97706"
          />
        )}
      </TouchableOpacity>

      {expanded && (
        <MotiView
          from={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <Text className="text-amber-700 text-xs mt-2 leading-5">
            This information is AI-generated for educational purposes only.
            It is{' '}
            <Text className="font-bold">NOT medical advice</Text>,
            diagnosis, or prescription.{'\n'}
            Always consult a qualified doctor or pharmacist before taking
            any medication or making health decisions.
          </Text>
        </MotiView>
      )}
    </MotiView>
  );
}
```

```typescript
// components/ui/MedCard.tsx
/**
 * Universal medical info card with animated entrance.
 * Used for disease sections, drug info, food guides, etc.
 */
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface MedCardProps {
  title: string;
  emoji: string;
  children: React.ReactNode;
  color?: string;
  gradientColors?: string[];
  delay?: number;
  onPress?: () => void;
}

export function MedCard({
  title, emoji, children,
  gradientColors = ['#FFFFFF', '#F8FAFB'],
  delay = 0, onPress
}: MedCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay }}
      className="mx-4 mb-4 rounded-3xl overflow-hidden shadow-sm"
    >
      <LinearGradient colors={gradientColors} className="p-5">
        <View className="flex-row items-center gap-3 mb-3">
          <View className="w-10 h-10 bg-white/50 rounded-2xl items-center justify-center">
            <Text className="text-2xl">{emoji}</Text>
          </View>
          <Text className="text-gray-800 font-bold text-lg flex-1">{title}</Text>
        </View>
        {children}
      </LinearGradient>
    </MotiView>
  );
}
```

```typescript
// components/ui/SearchBar.tsx
/**
 * Animated search bar with auto-complete suggestions.
 * Used on Home, Search, and Drug Info screens.
 */
import { View, TextInput, TouchableOpacity, FlatList, Text } from 'react-native';
import { useState, useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { medicalAPI } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchBarProps {
  placeholder: string;
  onSubmit: (query: string) => void;
  onSelect?: (item: any) => void;
}

export function SearchBar({ placeholder, onSubmit, onSelect }: SearchBarProps) {
  const [query, setQuery]           = useState('');
  const [suggestions, setSuggestions] = useState<any>({ diseases: [], medicines: [] });
  const [focused, setFocused]       = useState(false);
  const debouncedQ                  = useDebounce(query, 300);

  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  useEffect(() => {
    if (debouncedQ.length >= 2) {
      medicalAPI.getSuggestions(debouncedQ)
        .then((res: any) => setSuggestions(res))
        .catch(() => {});
    } else {
      setSuggestions({ diseases: [], medicines: [] });
    }
  }, [debouncedQ]);

  const allSuggestions = [
    ...suggestions.diseases.map((d: any) => ({ ...d, type: 'disease' })),
    ...suggestions.medicines.map((m: any) => ({ name: m.name, category: m.class, type: 'drug' })),
  ];

  return (
    <View className="mx-4 mb-4">
      <Animated.View style={animStyle}
        className={`flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-sm border ${
          focused ? 'border-teal-400' : 'border-gray-100'
        }`}
      >
        <Ionicons name="search" size={20} color={focused ? '#0D7377' : '#9CA3AF'} />
        <TextInput
          className="flex-1 ml-3 text-base text-gray-800"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          onFocus={() => { setFocused(true); scale.value = withSpring(1.02); }}
          onBlur={() => { setFocused(false); scale.value = withSpring(1); }}
          onSubmitEditing={() => { onSubmit(query); setSuggestions({ diseases: [], medicines: [] }); }}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Suggestions dropdown */}
      {focused && allSuggestions.length > 0 && (
        <View className="bg-white rounded-2xl shadow-lg mt-2 overflow-hidden border border-gray-100">
          <FlatList
            data={allSuggestions.slice(0, 8)}
            keyExtractor={(_, i) => i.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b border-gray-50"
                onPress={() => {
                  setQuery(item.name);
                  setSuggestions({ diseases: [], medicines: [] });
                  onSelect?.(item);
                }}
              >
                <Text className="text-lg mr-3">
                  {item.type === 'disease' ? '🏥' : '💊'}
                </Text>
                <View>
                  <Text className="text-gray-800 font-medium">{item.name}</Text>
                  {item.common_name && (
                    <Text className="text-gray-400 text-xs">{item.common_name}</Text>
                  )}
                  <Text className="text-teal-600 text-xs">{item.category}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
```

---

### STEP C4 — Home Screen (Hour 2:30–3:30)

```typescript
// app/(tabs)/index.tsx  (Home Screen)
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { SearchBar } from '../../components/ui/SearchBar';
import { DisclaimerBanner } from '../../components/ui/DisclaimerBanner';
import { useQuery } from '@tanstack/react-query';
import { medicalAPI } from '../../services/api';

const QUICK_SEARCHES = [
  { label: 'Diabetes',      emoji: '🩸', color: ['#FEE2E2','#FECACA'] },
  { label: 'Hypertension',  emoji: '❤️', color: ['#FCE7F3','#FBCFE8'] },
  { label: 'Hypothyroidism',emoji: '🦋', color: ['#EDE9FE','#DDD6FE'] },
  { label: 'Kidney Disease',emoji: '🫘', color: ['#DBEAFE','#BFDBFE'] },
  { label: 'Asthma',        emoji: '🫁', color: ['#D1FAE5','#A7F3D0'] },
  { label: 'Arthritis',     emoji: '🦴', color: ['#FEF3C7','#FDE68A'] },
];

const FEATURES = [
  { icon: '🔍', label: 'Disease\nGuide',  route: '/search',   color: '#0D7377' },
  { icon: '💊', label: 'Drug\nInfo',      route: '/drug',     color: '#7C3AED' },
  { icon: '🩺', label: 'Symptom\nCheck',  route: '/symptoms', color: '#DC2626' },
  { icon: '🤖', label: 'AI\nChat',        route: '/chat',     color: '#D97706' },
];

export default function HomeScreen() {
  const router  = useRouter();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const { data: history } = useQuery({
    queryKey: ['history'],
    queryFn: () => medicalAPI.getHistory() as any,
    staleTime: 60000,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  function handleQuickSearch(label: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/result', params: { query: label, type: 'disease' } });
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* ── HERO HEADER ──────────────────────────────── */}
        <LinearGradient colors={['#0D7377', '#14BDAC']} className="pb-8 px-6 pt-4">
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600 }}
          >
            <Text className="text-teal-100 text-sm">{greeting} 👋</Text>
            <Text className="text-white text-2xl font-bold mt-1">
              {user?.name ?? 'Welcome to MedAI'}
            </Text>
            <Text className="text-teal-100 text-sm mt-1">
              Your AI-powered health guide
            </Text>
          </MotiView>

          {/* ── SEARCH BAR INSIDE HEADER ─────────────── */}
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 600, delay: 200 }}
            className="mt-5 bg-white rounded-2xl flex-row items-center px-4 py-3"
          >
            <Ionicons name="search" size={20} color="#0D7377" />
            <TouchableOpacity
              className="flex-1 ml-3"
              onPress={() => router.push('/search')}
            >
              <Text className="text-gray-400 text-base">
                Search disease, drug, or symptom...
              </Text>
            </TouchableOpacity>
            <Ionicons name="mic" size={20} color="#0D7377" />
          </MotiView>
        </LinearGradient>

        {/* ── DISCLAIMER ───────────────────────────────── */}
        <View className="mt-4">
          <DisclaimerBanner compact />
        </View>

        {/* ── FEATURE GRID ─────────────────────────────── */}
        <View className="px-4 mt-2">
          <Text className="text-gray-800 font-bold text-lg mb-3">Features</Text>
          <View className="flex-row flex-wrap gap-3">
            {FEATURES.map((f, i) => (
              <MotiView
                key={f.route}
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: i * 80 }}
                className="flex-1 min-w-[22%]"
              >
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    router.push(f.route as any);
                  }}
                  className="items-center bg-white rounded-3xl py-4 shadow-sm"
                  style={{ borderTopWidth: 3, borderTopColor: f.color }}
                >
                  <Text className="text-3xl">{f.icon}</Text>
                  <Text className="text-xs text-gray-600 font-semibold mt-2 text-center">
                    {f.label}
                  </Text>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        </View>

        {/* ── QUICK SEARCH CONDITIONS ──────────────────── */}
        <View className="px-4 mt-6">
          <Text className="text-gray-800 font-bold text-lg mb-3">
            Common Conditions
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {QUICK_SEARCHES.map((item, i) => (
              <MotiView
                key={item.label}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 400, delay: i * 60 }}
              >
                <TouchableOpacity
                  onPress={() => handleQuickSearch(item.label)}
                >
                  <LinearGradient
                    colors={item.color as any}
                    className="flex-row items-center px-4 py-3 rounded-2xl"
                  >
                    <Text className="text-xl mr-2">{item.emoji}</Text>
                    <Text className="text-gray-700 font-semibold text-sm">
                      {item.label}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        </View>

        {/* ── RECENT SEARCHES ──────────────────────────── */}
        {(history as any)?.length > 0 && (
          <View className="px-4 mt-6 mb-4">
            <Text className="text-gray-800 font-bold text-lg mb-3">
              Recent Searches
            </Text>
            {(history as any).slice(0, 5).map((h: any, i: number) => (
              <TouchableOpacity
                key={i}
                className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-2 shadow-sm"
                onPress={() => router.push({
                  pathname: '/result',
                  params: { query: h.query, type: h.type }
                })}
              >
                <Text className="text-xl mr-3">
                  {h.type === 'disease' ? '🏥' : h.type === 'drug' ? '💊' : '🩺'}
                </Text>
                <View className="flex-1">
                  <Text className="text-gray-800 font-medium">{h.query}</Text>
                  <Text className="text-gray-400 text-xs capitalize">{h.type}</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

### STEP C5 — Disease Result Screen (Hour 3:30–4:30)

```typescript
// app/result.tsx  (Disease Info / Drug Info / Symptom Result — all in one)
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { medicalAPI } from '../services/api';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Parse Meditron's markdown-ish text response into structured sections
function parseSections(content: string) {
  const sections: { title: string; body: string; emoji: string }[] = [];
  const sectionMap: Record<string, string> = {
    'What is': '📋', 'Key Symptoms': '🩺', 'Medications to Take': '💊',
    'Medications to Avoid': '🚫', 'Foods to Eat': '🥗', 'Foods to Strictly Avoid': '❌',
    'Lifestyle Tips': '🌿', 'What it is used for': '🎯', 'How it works': '⚙️',
    'Side Effects': '⚠️', 'Interactions': '🔗', 'What to Avoid': '🚫',
    'Who Should NOT': '⛔', 'Pregnancy': '🤰',
  };

  const parts = content.split(/\*\*(.+?)\*\*/g);
  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i];
    const body  = (parts[i + 1] || '').trim().split('\n\n')[0];
    const emoji = Object.entries(sectionMap).find(([k]) => title.includes(k))?.[1] ?? '📌';
    if (body.length > 10) sections.push({ title, body, emoji });
  }
  return sections;
}

const SECTION_GRADIENTS: Record<string, string[]> = {
  '💊': ['#EDE9FE', '#DDD6FE'],  // Medications → purple
  '🥗': ['#D1FAE5', '#A7F3D0'],  // Foods to eat → green
  '❌': ['#FEE2E2', '#FECACA'],  // Avoid → red
  '🚫': ['#FEE2E2', '#FECACA'],
  '⛔': ['#FEE2E2', '#FECACA'],
  '🩺': ['#DBEAFE', '#BFDBFE'],  // Symptoms → blue
  '📋': ['#F0F9FF', '#E0F2FE'],  // Overview → light blue
  '🌿': ['#F0FDF4', '#DCFCE7'],  // Lifestyle → light green
  '⚠️': ['#FEF3C7', '#FDE68A'],  // Warnings → yellow
};

export default function ResultScreen() {
  const { query, type } = useLocalSearchParams<{ query: string; type: string }>();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['result', type, query],
    queryFn: () => {
      if (type === 'disease') return medicalAPI.getDiseaseInfo(query) as any;
      if (type === 'drug')    return medicalAPI.getDrugInfo(query)    as any;
      return null;
    },
    staleTime: 3600000, // 1 hour — Meditron results don't change
  });

  const content: string = data?.content ?? data?.analysis ?? '';
  const sections = parseSections(content);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* ── HEADER ─────────────────────────────────────── */}
      <LinearGradient colors={['#0D7377', '#14BDAC']} className="px-4 pt-4 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-3">
          <Ionicons name="arrow-back" size={22} color="white" />
          <Text className="text-white ml-2">Back</Text>
        </TouchableOpacity>
        <MotiView from={{ opacity: 0, translateY: -10 }} animate={{ opacity: 1, translateY: 0 }}>
          <Text className="text-teal-100 text-sm capitalize">{type} Information</Text>
          <Text className="text-white text-2xl font-bold mt-1">{query}</Text>
        </MotiView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="mt-4">
          <DisclaimerBanner compact />
        </View>

        {/* ── LOADING ──────────────────────────────────── */}
        {isLoading && (
          <MotiView
            from={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="items-center py-16 px-6"
          >
            <ActivityIndicator size="large" color="#0D7377" />
            <Text className="text-teal-700 font-semibold text-lg mt-4">
              Meditron is analyzing...
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Medical AI processing takes 10-30 seconds.{'\n'}
              Gathering information about {query}...
            </Text>
          </MotiView>
        )}

        {/* ── ERROR ────────────────────────────────────── */}
        {error && (
          <View className="m-4 p-4 bg-red-50 rounded-2xl border border-red-200">
            <Text className="text-red-700 font-bold">Could not load information</Text>
            <Text className="text-red-600 text-sm mt-1">
              Please check your connection and try again.
            </Text>
          </View>
        )}

        {/* ── RESULT SECTIONS ──────────────────────────── */}
        {!isLoading && sections.map((section, i) => {
          const gradient = SECTION_GRADIENTS[section.emoji] ?? ['#FFFFFF', '#F9FAFB'];
          return (
            <Animated.View
              key={i}
              entering={FadeInDown.duration(400).delay(i * 80)}
              className="mx-4 mb-4 rounded-3xl overflow-hidden shadow-sm"
            >
              <LinearGradient colors={gradient as any} className="p-5">
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-10 h-10 bg-white/60 rounded-2xl items-center justify-center">
                    <Text className="text-2xl">{section.emoji}</Text>
                  </View>
                  <Text className="text-gray-800 font-bold text-base flex-1">
                    {section.title}
                  </Text>
                </View>
                {/* Render bullet points */}
                {section.body.split('\n').filter(Boolean).map((line, li) => {
                  const isPoint = line.startsWith('-') || line.startsWith('•');
                  return (
                    <View key={li} className={`flex-row ${isPoint ? 'mt-2' : 'mt-1'}`}>
                      {isPoint && (
                        <Text className="text-gray-400 mr-2 mt-0.5">•</Text>
                      )}
                      <Text className={`text-gray-700 text-sm leading-6 flex-1 ${
                        line.startsWith('#') ? 'font-bold text-base' : ''
                      }`}>
                        {line.replace(/^[-•]\s*/, '').replace(/\*\*/g, '')}
                      </Text>
                    </View>
                  );
                })}
              </LinearGradient>
            </Animated.View>
          );
        })}

        {/* ── SOURCES ──────────────────────────────────── */}
        {data?.sources?.length > 0 && (
          <View className="mx-4 mb-4 p-4 bg-gray-100 rounded-2xl">
            <Text className="text-gray-500 text-xs font-semibold mb-1">
              Sources used:
            </Text>
            <Text className="text-gray-400 text-xs">
              {data.sources.join(' · ')}
            </Text>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

# 📱 MEMBER D — Frontend Features {#member-d}
## Symptom Checker, Drug Info, AI Chat, Navigation
### Time: Hour 0:30 → Hour 4:30

---

### STEP D1 — App Navigation Structure (Hour 0:30–1:00)

```typescript
// app/_layout.tsx  (Root layout — wraps entire app)
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../store/authStore';
import { useRouter, useSegments } from 'expo-router';
import '../global.css';  // NativeWind styles

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 300000 },
  },
});

function AuthGuard() {
  const { user, loading, restore } = useAuthStore();
  const segments = useSegments();
  const router   = useRouter();

  useEffect(() => { restore(); }, []);

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) router.replace('/(auth)/login');
    if (user && inAuth)   router.replace('/(tabs)');
  }, [user, loading]);

  return null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthGuard />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)"  />
          <Stack.Screen name="(tabs)"  />
          <Stack.Screen name="result"  options={{ presentation: 'card' }} />
          <Stack.Screen name="symptoms" />
          <Stack.Screen name="drug"     />
          <Stack.Screen name="chat"     />
          <Stack.Screen name="search"   />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
```

```typescript
// app/(tabs)/_layout.tsx  (Bottom tab navigator)
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Platform, View } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0D7377',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          backgroundColor: 'rgba(255,255,255,0.95)',
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index"
        options={{ title: 'Home', tabBarIcon: ({ color, size }) =>
          <Ionicons name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="search"
        options={{ title: 'Search', tabBarIcon: ({ color, size }) =>
          <Ionicons name="search" size={size} color={color} /> }} />
      <Tabs.Screen name="chat"
        options={{ title: 'AI Chat', tabBarIcon: ({ color, size }) =>
          <Ionicons name="chatbubbles" size={size} color={color} /> }} />
      <Tabs.Screen name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) =>
          <Ionicons name="person" size={size} color={color} /> }} />
    </Tabs>
  );
}
```

---

### STEP D2 — Login & Register Screens (Hour 1:00–1:30)

```typescript
// app/(auth)/login.tsx
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router    = useRouter();

  async function handleLogin() {
    if (!email || !pass) return Alert.alert('Please fill in all fields');
    setLoading(true);
    try {
      await login(email, pass);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Login failed', e?.error || 'Check your email and password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <LinearGradient colors={['#0D7377', '#14BDAC', '#F8FAFB']}
        locations={[0, 0.4, 0.7]} className="flex-1">
        <View className="flex-1 justify-center px-6">
          <MotiView from={{ opacity: 0, translateY: -30 }} animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 700 }} className="items-center mb-10">
            <Text className="text-6xl mb-3">🏥</Text>
            <Text className="text-white text-4xl font-bold">MedAI</Text>
            <Text className="text-teal-100 mt-2 text-center">
              Your AI-powered health information guide
            </Text>
          </MotiView>

          <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 700, delay: 200 }}
            className="bg-white rounded-3xl p-6 shadow-lg">

            <Text className="text-gray-800 text-xl font-bold mb-6">Sign In</Text>

            <TextInput className="bg-gray-50 rounded-2xl px-4 py-4 mb-3 text-gray-800 border border-gray-100"
              placeholder="Email" placeholderTextColor="#9CA3AF"
              value={email} onChangeText={setEmail}
              autoCapitalize="none" keyboardType="email-address" />

            <TextInput className="bg-gray-50 rounded-2xl px-4 py-4 mb-5 text-gray-800 border border-gray-100"
              placeholder="Password" placeholderTextColor="#9CA3AF"
              value={pass} onChangeText={setPass} secureTextEntry />

            <TouchableOpacity onPress={handleLogin} disabled={loading}>
              <LinearGradient colors={['#0D7377','#14BDAC']} className="rounded-2xl py-4 items-center">
                <Text className="text-white font-bold text-base">
                  {loading ? 'Signing in...' : 'Sign In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity className="mt-4 items-center"
              onPress={() => router.push('/(auth)/register')}>
              <Text className="text-gray-500">
                Don't have an account?{' '}
                <Text className="text-teal-600 font-bold">Sign up</Text>
              </Text>
            </TouchableOpacity>
          </MotiView>

          {/* Disclaimer on login screen */}
          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 600 }} className="mt-6 px-2">
            <Text className="text-teal-100 text-xs text-center leading-5">
              ⚠️ MedAI provides health information for educational purposes only.
              Always consult a qualified healthcare professional for medical advice.
            </Text>
          </MotiView>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
```

---

### STEP D3 — Symptom Checker Screen (Hour 1:30–2:30)

```typescript
// app/symptoms.tsx
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useMutation } from '@tanstack/react-query';
import { medicalAPI } from '../services/api';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const COMMON_SYMPTOMS = [
  'Fatigue', 'Headache', 'Fever', 'Nausea', 'Chest pain',
  'Shortness of breath', 'Blurred vision', 'Frequent urination',
  'Weight loss', 'Joint pain', 'Dizziness', 'Loss of appetite',
  'Swelling', 'Cough', 'Back pain', 'Skin rash',
];

export default function SymptomCheckerScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const [custom,   setCustom]   = useState('');
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (symptoms: string[]) =>
      medicalAPI.predictDisease(symptoms) as any,
    onSuccess: (data) => {
      router.push({
        pathname: '/symptom-result',
        params: { data: JSON.stringify(data) }
      });
    },
    onError: () => Alert.alert('Error', 'Could not analyze symptoms. Please try again.'),
  });

  function toggleSymptom(s: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  }

  function addCustom() {
    const s = custom.trim();
    if (s && !selected.includes(s)) {
      setSelected(prev => [...prev, s]);
      setCustom('');
    }
  }

  function analyze() {
    if (selected.length === 0) return Alert.alert('Add symptoms', 'Please select or type at least one symptom');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    mutation.mutate(selected);
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── HEADER ───────────────────────────── */}
        <LinearGradient colors={['#DC2626', '#EF4444']} className="px-4 pt-4 pb-8">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-4">
            <Ionicons name="arrow-back" size={22} color="white" />
            <Text className="text-white ml-2">Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">🩺 Symptom Checker</Text>
          <Text className="text-red-100 mt-2 text-sm leading-5">
            Select your symptoms and AI will suggest possible conditions.{'\n'}
            This is NOT a diagnosis — always see a doctor.
          </Text>
        </LinearGradient>

        <View className="mt-4">
          <DisclaimerBanner />
        </View>

        {/* ── SELECTED SYMPTOMS ────────────────── */}
        {selected.length > 0 && (
          <Animated.View entering={FadeInDown} className="mx-4 mb-4">
            <Text className="text-gray-700 font-semibold mb-2">
              Selected ({selected.length}):
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {selected.map(s => (
                <TouchableOpacity key={s} onPress={() => toggleSymptom(s)}>
                  <LinearGradient colors={['#DC2626','#EF4444']}
                    className="flex-row items-center px-3 py-2 rounded-full">
                    <Text className="text-white text-sm font-medium mr-1">{s}</Text>
                    <Ionicons name="close" size={14} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* ── CUSTOM SYMPTOM INPUT ─────────────── */}
        <View className="mx-4 mb-4 flex-row gap-2">
          <TextInput
            className="flex-1 bg-white rounded-2xl px-4 py-3 border border-gray-100 text-gray-800"
            placeholder="Type a symptom not listed..."
            placeholderTextColor="#9CA3AF"
            value={custom}
            onChangeText={setCustom}
            onSubmitEditing={addCustom}
          />
          <TouchableOpacity onPress={addCustom}
            className="bg-red-500 rounded-2xl px-4 items-center justify-center">
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* ── COMMON SYMPTOMS GRID ─────────────── */}
        <View className="px-4 mb-6">
          <Text className="text-gray-700 font-semibold mb-3">Common Symptoms:</Text>
          <View className="flex-row flex-wrap gap-2">
            {COMMON_SYMPTOMS.map((s, i) => {
              const isSelected = selected.includes(s);
              return (
                <MotiView key={s}
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', delay: i * 30 }}
                >
                  <TouchableOpacity
                    onPress={() => toggleSymptom(s)}
                    className={`px-4 py-2 rounded-full border ${
                      isSelected
                        ? 'bg-red-500 border-red-500'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${
                      isSelected ? 'text-white' : 'text-gray-600'
                    }`}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                </MotiView>
              );
            })}
          </View>
        </View>

        {/* ── ANALYZE BUTTON ───────────────────── */}
        <View className="px-4 mb-8">
          <TouchableOpacity onPress={analyze} disabled={mutation.isPending}>
            <LinearGradient
              colors={selected.length > 0 ? ['#DC2626','#EF4444'] : ['#D1D5DB','#E5E7EB']}
              className="rounded-3xl py-4 items-center"
            >
              {mutation.isPending ? (
                <Text className="text-white font-bold text-base">
                  🤖 Analyzing symptoms...
                </Text>
              ) : (
                <Text className={`font-bold text-base ${selected.length > 0 ? 'text-white' : 'text-gray-400'}`}>
                  Analyze {selected.length > 0 ? `${selected.length} Symptom${selected.length > 1 ? 's' : ''}` : 'Symptoms'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

### STEP D4 — AI Chat Screen (Hour 2:30–3:30)

```typescript
// app/chat.tsx  (AI Chat with streaming)
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { streamChat } from '../services/api';
import { useAuthStore } from '../store/authStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

const STARTERS = [
  { text: "What foods should a diabetic avoid?",  emoji: "🩸" },
  { text: "Is Metformin safe during pregnancy?",   emoji: "🤰" },
  { text: "What are signs of high blood pressure?",emoji: "❤️" },
  { text: "What medicines interact with Warfarin?", emoji: "💊" },
];

const DISCLAIMER_MSG = `\n\n⚠️ This is AI-generated information for educational purposes only. It is NOT medical advice. Always consult a qualified doctor or pharmacist.`;

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState('');
  const [sending,  setSending]  = useState(false);
  const listRef = useRef<FlatList>(null);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || sending) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput('');
    setSending(true);

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msg };
    const aiId = (Date.now() + 1).toString();
    const aiMsg: Message = { id: aiId, role: 'assistant', content: '', streaming: true };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const reader  = await streamChat({ message: msg, history });
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const raw = decoder.decode(value);
        for (const line of raw.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const chunk = line.slice(6);
          if (chunk === '[DONE]') break;
          accumulated += chunk;

          setMessages(prev => prev.map(m =>
            m.id === aiId ? { ...m, content: accumulated } : m
          ));
        }
        listRef.current?.scrollToEnd({ animated: false });
      }

      // Mark streaming done
      setMessages(prev => prev.map(m =>
        m.id === aiId ? { ...m, streaming: false } : m
      ));

    } catch {
      setMessages(prev => prev.map(m =>
        m.id === aiId
          ? { ...m, content: 'Sorry, I could not respond. Please try again.', streaming: false }
          : m
      ));
    } finally {
      setSending(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 200);
    }
  }

  function renderMessage({ item: msg }: { item: Message }) {
    const isUser = msg.role === 'user';
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300 }}
        className={`px-4 mb-3 ${isUser ? 'items-end' : 'items-start'}`}
      >
        {!isUser && (
          <View className="flex-row items-center mb-1 ml-1">
            <Text className="text-sm">🤖</Text>
            <Text className="text-gray-400 text-xs ml-1">MedAI</Text>
          </View>
        )}
        <View className={`max-w-[85%] rounded-3xl px-4 py-3 ${
          isUser ? 'bg-teal-600 rounded-tr-sm' : 'bg-white rounded-tl-sm shadow-sm'
        }`}>
          <Text className={`text-sm leading-6 ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {msg.content}
          </Text>
          {msg.streaming && (
            <View className="flex-row mt-2 gap-1">
              {[0,1,2].map(i => (
                <MotiView key={i}
                  from={{ opacity: 0.3, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'timing', duration: 600, delay: i*150, loop: true }}
                  className="w-1.5 h-1.5 rounded-full bg-teal-400"
                />
              ))}
            </View>
          )}
        </View>
      </MotiView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient colors={['#D97706','#F59E0B']} className="px-4 pt-3 pb-4">
        <Text className="text-white text-xl font-bold">🤖 AI Medical Chat</Text>
        <Text className="text-amber-100 text-xs mt-1">
          Powered by Meditron 70B · For information only
        </Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1" keyboardVerticalOffset={0}
      >
        {/* Starter prompts */}
        {messages.length === 0 && (
          <View className="p-4">
            <Text className="text-gray-500 text-sm font-medium mb-3">
              💡 Try asking:
            </Text>
            {STARTERS.map((s, i) => (
              <MotiView key={i}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: i * 100 }}
              >
                <TouchableOpacity
                  onPress={() => send(s.text)}
                  className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-2 border border-gray-100"
                >
                  <Text className="text-xl mr-3">{s.emoji}</Text>
                  <Text className="text-gray-700 text-sm flex-1">{s.text}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#D97706" />
                </TouchableOpacity>
              </MotiView>
            ))}

            {/* Disclaimer in chat */}
            <View className="bg-amber-50 rounded-2xl p-4 mt-2 border border-amber-200">
              <Text className="text-amber-700 text-xs leading-5">
                ⚠️ AI chat is for educational purposes only. Do not use for
                diagnosis or treatment decisions. Always consult a doctor.
              </Text>
            </View>
          </View>
        )}

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        />

        {/* Input */}
        <View className="px-4 py-3 bg-white border-t border-gray-100 flex-row items-end gap-3">
          <TextInput
            className="flex-1 bg-gray-50 rounded-3xl px-4 py-3 text-gray-800 max-h-24 border border-gray-100"
            placeholder="Ask a health question..."
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            onPress={() => send()}
            disabled={sending || !input.trim()}
            className={`w-12 h-12 rounded-2xl items-center justify-center ${
              input.trim() ? 'bg-amber-500' : 'bg-gray-200'
            }`}
          >
            {sending
              ? <ActivityIndicator size="small" color="white" />
              : <Ionicons name="send" size={20} color={input.trim() ? 'white' : '#9CA3AF'} />
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
```

---

### STEP D5 — Drug Info & Search Screens (Hour 3:30–4:30)

```typescript
// app/(tabs)/search.tsx  (Unified search — disease OR drug)
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { SearchBar } from '../../components/ui/SearchBar';

type SearchType = 'disease' | 'drug';

const DISEASE_EXAMPLES = [
  { name: 'Type 2 Diabetes', emoji: '🩸' },
  { name: 'Hypertension',     emoji: '❤️' },
  { name: 'Hypothyroidism',   emoji: '🦋' },
  { name: 'Asthma',           emoji: '🫁' },
  { name: 'Kidney Disease',   emoji: '🫘' },
  { name: 'Anemia',           emoji: '💉' },
];

const DRUG_EXAMPLES = [
  { name: 'Metformin',        emoji: '💊' },
  { name: 'Amlodipine',       emoji: '❤️' },
  { name: 'Paracetamol',      emoji: '🔵' },
  { name: 'Ibuprofen',        emoji: '🟠' },
  { name: 'Levothyroxine',    emoji: '🦋' },
  { name: 'Atorvastatin',     emoji: '🫀' },
];

export default function SearchScreen() {
  const [mode, setMode] = useState<SearchType>('disease');
  const router = useRouter();

  function go(query: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: '/result', params: { query, type: mode } });
  }

  const examples = mode === 'disease' ? DISEASE_EXAMPLES : DRUG_EXAMPLES;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={mode === 'disease' ? ['#0D7377','#14BDAC'] : ['#7C3AED','#A78BFA']}
          className="px-4 pt-4 pb-8"
        >
          <Text className="text-white text-2xl font-bold">
            {mode === 'disease' ? '🏥 Disease Search' : '💊 Drug Lookup'}
          </Text>
          <Text className="text-white/70 text-sm mt-1">
            {mode === 'disease'
              ? 'Get medications, food guide & symptoms'
              : 'Get drug info, side effects & interactions'}
          </Text>

          {/* Mode toggle */}
          <View className="flex-row bg-white/20 rounded-2xl p-1 mt-4">
            {(['disease', 'drug'] as SearchType[]).map(m => (
              <TouchableOpacity key={m} onPress={() => setMode(m)}
                className={`flex-1 py-2 rounded-xl items-center ${mode === m ? 'bg-white' : ''}`}>
                <Text className={`font-semibold text-sm ${
                  mode === m ? (m === 'disease' ? 'text-teal-700' : 'text-purple-700') : 'text-white'
                }`}>
                  {m === 'disease' ? '🏥 Disease' : '💊 Drug'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        <View className="mt-4">
          <SearchBar
            placeholder={mode === 'disease' ? 'e.g. Type 2 Diabetes, Asthma...' : 'e.g. Metformin, Ibuprofen...'}
            onSubmit={go}
            onSelect={(item) => go(item.name)}
          />
        </View>

        <View className="px-4 mt-2">
          <Text className="text-gray-600 font-semibold mb-3">Quick Select:</Text>
          <View className="flex-row flex-wrap gap-3">
            {examples.map((item, i) => (
              <MotiView key={item.name}
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: i * 50 }}
              >
                <TouchableOpacity onPress={() => go(item.name)}
                  className="flex-row items-center bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                  <Text className="text-xl mr-2">{item.emoji}</Text>
                  <Text className="text-gray-700 font-medium text-sm">{item.name}</Text>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

# 🔗 Integration & Deployment {#integration}

### Hour 4:00–4:30 — All Members Together

```bash
# ── BACKEND final checks ──────────────────────────────────────
cd backend

# Start everything:
redis-server &                    # Start Redis
ollama serve &                    # Start Ollama (if not auto-started)
uvicorn main:app --reload --port 8000

# Verify all endpoints work:
curl http://localhost:8000/health
# Expected: {"status":"ok","meditron":"running",...}

curl "http://localhost:8000/api/medical/disease?name=Diabetes" \
  -H "Authorization: Bearer YOUR_TOKEN"
# Should return disease info (takes 10-30s first time)

# ── FRONTEND connect to backend ───────────────────────────────
# Find your computer's local IP:
# Mac/Linux:  ifconfig | grep "inet " | grep -v 127
# Windows:    ipconfig | findstr "IPv4"

# Update BASE_URL in frontend/services/api.ts:
# const BASE_URL = 'http://YOUR_IP:8000/api';

# Start the app:
cd frontend
npx expo start

# On your phone:
# 1. Download Expo Go from App Store or Play Store
# 2. Scan the QR code shown in terminal
# 3. App loads on your phone!
```

### Environment Variables Checklist

```bash
# backend/.env — must be complete before running
APP_NAME=MedAI
DEBUG=True
SECRET_KEY=your_32_char_minimum_secret_key_here
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/medai_db
REDIS_URL=redis://localhost:6379
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
OLLAMA_BASE_URL=http://localhost:11434
MEDITRON_MODEL=meditron
OPENFDA_BASE_URL=https://api.fda.gov
```

### Complete File Structure

```
medai/
├── backend/
│   ├── .env                        # Secrets (never commit)
│   ├── .gitignore
│   ├── requirements.txt
│   ├── main.py                     # FastAPI app entry point
│   ├── medical_knowledge/
│   │   ├── diabetes.txt
│   │   ├── hypertension.txt
│   │   ├── hypothyroidism.txt
│   │   ├── kidney_disease.txt
│   │   └── asthma.txt
│   └── app/
│       ├── api/routes/
│       │   ├── auth.py             # Register, login
│       │   └── medical.py          # Disease, drug, symptoms, chat
│       ├── ai/
│       │   ├── meditron_client.py  # Ollama/Meditron wrapper + streaming
│       │   ├── rag_engine.py       # ChromaDB indexer + retrieval
│       │   └── ai_service.py       # Orchestration — all AI features
│       ├── core/
│       │   ├── config.py           # Settings from .env
│       │   ├── database.py         # SQLAlchemy setup
│       │   └── security.py         # JWT + password hashing
│       └── models/
│           └── models.py           # All DB table definitions
│
└── frontend/
    ├── app/
    │   ├── _layout.tsx             # Root layout + auth guard
    │   ├── (auth)/
    │   │   ├── login.tsx           # Login screen
    │   │   └── register.tsx        # Register screen
    │   ├── (tabs)/
    │   │   ├── _layout.tsx         # Bottom tab navigator
    │   │   ├── index.tsx           # Home screen
    │   │   ├── search.tsx          # Disease + drug search
    │   │   ├── chat.tsx            # AI chat
    │   │   └── profile.tsx         # User profile
    │   ├── result.tsx              # Disease/drug result display
    │   ├── symptoms.tsx            # Symptom checker
    │   └── symptom-result.tsx      # Symptom prediction results
    ├── components/ui/
    │   ├── DisclaimerBanner.tsx    # Medical disclaimer (on every screen)
    │   ├── MedCard.tsx             # Medical info card
    │   └── SearchBar.tsx           # Animated search with autocomplete
    ├── services/
    │   └── api.ts                  # All API calls + streaming
    ├── store/
    │   └── authStore.ts            # Zustand auth state
    ├── tailwind.config.js
    └── babel.config.js
```

---

# 🚀 Production Roadmap {#production-roadmap}

### Phase 1 — MVP (Week 1–2, current sprint)
| Task | Owner | Status |
|------|-------|--------|
| Meditron 70B running via Ollama | Member A | ✅ |
| RAG pipeline with 5+ disease files | Member A | ✅ |
| All 4 AI features (disease/drug/symptom/chat) | Member A+B | ✅ |
| FastAPI routes + PostgreSQL | Member B | ✅ |
| React Native app with all screens | Member C+D | ✅ |
| Disclaimer on every screen | Member D | ✅ |

### Phase 2 — Stability (Week 3–4)
- [ ] Add remaining 15+ disease knowledge files
- [ ] Have a doctor review all knowledge files for accuracy
- [ ] Add rate limiting (slowapi) — max 20 AI requests/minute per user
- [ ] Add structured logging (loguru) for audit trail
- [ ] Alembic database migrations setup
- [ ] Push notifications for medication reminders (Expo Notifications)
- [ ] Unit tests for all AI service functions

### Phase 3 — Scale (Month 2)
- [ ] Deploy backend to Railway or Render with GPU support for Meditron
- [ ] Use Expo EAS Build to publish to Google Play Store and Apple App Store
- [ ] Add offline mode — cache last 10 searches locally
- [ ] Hindi language support (add Hindi prompts to Meditron system prompt)
- [ ] Multi-condition support — user has diabetes AND hypertension
- [ ] Drug interaction checker (compare 2+ medicines simultaneously)

### Phase 4 — Growth (Month 3+)
- [ ] B2B doctor dashboard (Next.js web app)
- [ ] Lab report upload and AI interpretation (PDF parsing)
- [ ] Teleconsult integration (Practo/Mfine API partnership)
- [ ] Generic drug alternatives suggester
- [ ] Wearable data integration (Apple Health, Google Fit)

---

### Production Server Requirements for Meditron 70B

| Hardware | Meditron 70B (full) | Meditron 7B (light) |
|----------|---------------------|---------------------|
| RAM | 48GB minimum | 8GB minimum |
| GPU | NVIDIA A100 / RTX 3090 (optional but 10x faster) | GTX 1080 or CPU-only |
| Storage | 50GB free | 5GB free |
| Cloud Option | AWS g4dn.12xlarge (~$3.9/hr) | AWS t3.xlarge (~$0.17/hr) |

> **Budget tip for MVP**: Start with **Meditron 7B** on a $10/month VPS. When you have paying users, upgrade to the 70B on a GPU instance. The 7B still gives good medical answers for the RAG use case since most of the intelligence comes from your knowledge files, not the model size.

---

### Quick Start Commands (All Members)

```bash
# ══ BACKEND ══════════════════════════════════════
cd backend
source venv/bin/activate
pip install -r requirements.txt     # Install dependencies
ollama pull meditron:7b             # Pull model (use 7b for development)
redis-server &                      # Start Redis
uvicorn main:app --reload --port 8000
# Visit: http://localhost:8000/docs

# ══ FRONTEND ═════════════════════════════════════
cd frontend
npm install
# Edit services/api.ts — set BASE_URL to your computer's IP
npx expo start
# Scan QR code with Expo Go app on your phone
```
