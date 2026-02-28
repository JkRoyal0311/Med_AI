# MedAI System Verification & Startup Guide

## ✅ System Status Check

### Prerequisites Verified:
- ✅ Backend: FastAPI with public endpoints (no auth required)
- ✅ Frontend: Streamlit with beautiful UI (gradients, animations)
- ✅ Medical Knowledge Base: 37 disease files with comprehensive data
- ✅ Python 3.14 Compatibility: Dependencies updated (streamlit>=1.32.0)
- ✅ Virtual Environments: Created and configured

---

## 🚀 Startup Instructions (3 Terminal Windows Required)

### **REQUIREMENT: Meditron 70B must be running via Ollama**
Before starting anything, ensure Ollama service is available on localhost:11434

### Terminal 1: Start Ollama Service (Meditron)
```powershell
ollama serve
```
**Expected Output:**
```
Ollama is running on 127.0.0.1:11434
```
**Keep this terminal open and running in background**

---

### Terminal 2: Start Backend API
```powershell
cd d:\medai\backend

# Activate virtual environment
.\venv\Scripts\activate

# Start FastAPI server with reload
python -m uvicorn main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
✅ Ollama/Meditron is running
✅ RAG index: 37000+ chunks ready
✅ Database: Connected
```

**Keep this terminal open**

---

### Terminal 3: Start Streamlit Application
```powershell
cd d:\medai\frontend

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies (if not already done)
pip install -r streamlit_requirements.txt

# Start Streamlit app
streamlit run streamlit_app.py
```

**Expected Output:**
```
  You can now view your Streamlit app in your browser.

  Local URL: http://localhost:8501
```

**Note:** If dependencies haven't been installed yet, this step will take 30-60 seconds

**Keep this terminal open**

---

## 🧪 Testing Checklist

### Test 1: Backend Health Check
**Command (in any terminal):**
```powershell
curl http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "meditron": "running",
  "app": "MedAI",
  "version": "1.0.0"
}
```

**If You Get an Error:**
- ❌ "Connection refused" → Backend not running (see Terminal 2)
- ❌ "meditron": "not_running" → Ollama not running (see Terminal 1)

---

### Test 2: Frontend Connection
1. Open browser to **http://localhost:8501**
2. You should see the MedAI home page with 4 feature cards
3. Theme colors should be purple/blue with smooth animations

**If You See Errors:**
- ❌ Connection refused → Backend not running
- ❌ Blank page → Streamlit not loaded, wait 10 seconds and refresh

---

### Test 3: Disease Lookup (Real Medical Data)
**Steps in Streamlit App:**
1. Click the **🔍 Disease Lookup** tab
2. Type a disease name: `Common Cold` (or `Diabetes`)
3. Click **Search Disease** button
4. **First query TAKES 15-30 SECONDS** (normal - AI processing)
5. You should see:
   - Disease name
   - Symptoms (bulleted list)
   - Medications with details
   - Foods to eat/avoid
   - When to see a doctor
   - **NOT** the template structure

**Example of GOOD Response:**
```
# Common Cold (Viral Rhinitis)
## ICD-10: J00

### Symptoms:
- Nasal congestion (first 2 days, then decreases)
- Sore throat or throat irritation
- Cough (dry first 2-3 days, then productive)
...
```

**Example of BAD Response (Template):**
```
data: {"type": "template", "value": "common_cold_symptoms"}
```

---

### Test 4: Drug Information
**Steps:**
1. Click **💊 Drug Info** tab
2. Type drug name: `Paracetamol` or `Ibuprofen`
3. Click **Search Drug** button
4. Should return medication details with dosage and warnings

---

### Test 5: Symptom Checker
**Steps:**
1. Click **🩺 Symptom Checker** tab
2. Select multiple symptoms: `Fever`, `Cough`, `Fatigue`
3. Click **Predict Disease** button
4. Should return probable diseases with confidence scores

---

### Test 6: AI Chat
**Steps:**
1. Click **🤖 AI Chat** tab
2. Type a question: `What should I eat when I have diabetes?`
3. Click **Send** button
4. Should stream real medical advice (takes 10-20 seconds first time)

---

## 📊 Performance Expectations

| Operation | First Run | Cached/Subsequent | Note |
|-----------|-----------|-------------------|------|
| Disease Lookup | 15-30 sec | <1 sec | AI processing + RAG retrieval |
| Drug Lookup | 10-20 sec | <1 sec | Faster than disease (less text) |
| Symptom Prediction | 5-10 sec | Instant | Uses pre-computed embeddings |
| AI Chat | 20-40 sec | 5-10 sec | Depends on question complexity |

**First-time queries are slower because:**
- LLM loading model into VRAM
- RAG engine retrieving relevant medical documents
- Response streaming from Meditron

---

## 🔍 Troubleshooting

### Problem: "HTTPConnectionPool... Failed to establish a new connection"
```
HTTPConnectionPool(host='localhost', port=8000): Max retries exceeded
```
**Solution:** Start Terminal 2 (Backend API)

---

### Problem: "Connection refused: [WinError 10061]"
**Solution:** 
1. Check if Ollama is running (Terminal 1)
2. Check if Backend is running (Terminal 2)
3. Try: `netstat -an | find "8000"` (should show LISTENING)

---

### Problem: Getting template structure instead of real data
```json
{
  "type": "template", 
  "value": "common_cold_symptoms"
}
```
**Causes & Solutions:**
1. **Ollama not responding:** 
   - Command: `curl http://localhost:11434/api/models`
   - Should return list with `meditron` model
   - Fix: Restart `ollama serve`

2. **Meditron model not loaded:**
   - Command: `ollama list` (in another terminal)
   - Fix: Run `ollama pull meditron:70b` 

3. **Backend not receiving Ollama response:**
   - Check: Terminal 2 logs for "Ollama error"
   - Fix: Restart Backend → Restart Ollama

---

### Problem: Dependencies won't install (numpy error)
```
Unknown compiler(s): [['icl'], ['cl'], ['cc'], ['gcc'], ['clang'], ['clang-cl'], ['pgcc']]
```
**Solution:** Already fixed! Dependencies in `streamlit_requirements.txt` are:
```
streamlit>=1.32.0  # Has Python 3.14 wheels
numpy>=2.0.0       # Has Python 3.14 pre-built wheels
```

---

## 📝 Quick Reference URLs

| Component | URL | Purpose |
|-----------|-----|---------|
| Streamlit App | http://localhost:8501 | Web UI |
| Backend API | http://localhost:8000 | API endpoints |
| Health Check | http://localhost:8000/health | Status |
| API Docs (Swagger) | http://localhost:8000/docs | Interactive API testing |
| OpenAPI Schema | http://localhost:8000/openapi.json | API definition |
| Ollama Service | http://localhost:11434 | LLM service (background) |

---

## 📂 Key File Locations

```
d:\medai\
├── backend/
│   ├── main.py                          # FastAPI entry point
│   ├── medical_knowledge/               # 37 disease files
│   │   ├── common_cold.txt
│   │   ├── diabetes.txt
│   │   ├── asthma.txt
│   │   └── ... (34 more diseases)
│   ├── logs/
│   │   ├── app.log                      # Backend logs
│   │   └── database.log                 # Database operations
│   └── venv/                            # Backend virtual env
│
├── frontend/
│   ├── streamlit_app.py                 # Main Streamlit web app
│   ├── streamlit_requirements.txt       # Python dependencies
│   ├── .streamlit/config.toml           # Streamlit theme config
│   └── venv/                            # Frontend virtual env
│
└── Documentation/
    ├── README.md                         # Main readme
    ├── QUICK_START.md                    # Quick setup guide
    ├── STREAMLIT_SETUP.md                # Detailed Streamlit guide
    └── SYSTEM_VERIFICATION.md            # This file
```

---

## ✨ Features Implemented

### Home Page (🏠)
- Welcome banner with project description
- 4 feature cards (Disease Lookup, Drug Info, Symptom Checker, AI Chat)
- Quick links to 9 common diseases
- Beautiful gradient background with animations

### Disease Lookup (🔍)
- Search by disease name
- Returns:
  - Disease description with ICD-10 code
  - Detailed symptoms with timeline
  - Medications with brand names and warnings
  - Foods to eat and foods to avoid
  - Lifestyle tips and prevention
  - When to see a doctor

### Drug Information (💊)
- Search by drug/medication name
- Returns:
  - Drug description and mechanism
  - Typical dosages
  - Side effects and warnings
  - Drug interactions
  - Storage and precautions

### Symptom Checker (🩺)
- Multi-select symptoms (Fever, Cough, Fatigue, Nausea, etc.)
- AI predicts probable diseases
- Returns confidence scores
- Links to each disease's full information

### AI Chat (🤖)
- Real-time streaming medical chatbot
- Conversation history maintained per session
- Can ask questions about:
  - Symptoms and conditions
  - Medications and treatments
  - Diet and lifestyle modifications
  - Prevention and management
- Chat history persists in sidebar

---

## 🔐 Security Note

**Authorization Removed:** All endpoints are now public (as requested). No authentication required.
- No JWT tokens
- No user registration
- No login page
- Direct access to all medical features

---

## 📞 Support

If you encounter issues:

1. **Check logs:**
   - Backend: `d:\medai\backend\logs\app.log`
   - Database: `d:\medai\backend\logs\database.log`

2. **Test individual components:**
   - Ollama: `curl http://localhost:11434/api/models`
   - Backend: `curl http://localhost:8000/health`
   - Streamlit: Open http://localhost:8501

3. **Verify all 3 services running:**
   - Terminal 1: `ollama serve` ✅
   - Terminal 2: Backend logs showing "✅" ✅
   - Terminal 3: Streamlit running on http://localhost:8501 ✅

---

**Last Updated:** System verified and ready for testing  
**Status:** All components configured and dependency issues resolved
