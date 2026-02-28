# 🏥 MedAI - Quick Start Guide (Streamlit Version)

## 💡 What is MedAI?

MedAI is an **AI-powered medical information system** that provides:
- 🔍 **Disease Information** - Complete profiles of diseases
- 💊 **Drug Information** - Medicine details, side effects, interactions  
- 🩺 **Symptom Checker** - Identify possible conditions
- 🤖 **AI Chat** - Ask medical questions

**No login required!** Everything is instantly accessible.

---

## ⚡ 5-Minute Quick Start

### Prerequisites Check ✅
```bash
# Check Python is installed
python --version
# Should show Python 3.11+

# Check these services are running somewhere:
# - Ollama (Meditron): ollama serve
# - PostgreSQL or SQLite (for database)
# - Redis (optional, for caching)
```

### Step 1: Install & Start Backend (Terminal 1)
```bash
cd d:\medai\backend

# Activate virtual environment (if not already done)
.\venv\Scripts\activate

# Install dependencies (one-time)
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
✅ Database tables ready
✅ Ollama/Meditron is running
✅ RAG index: 2000+ chunks ready
```

### Step 2: Install & Start Streamlit (Terminal 2)
```bash
cd d:\medai\frontend

# Install Streamlit (one-time)
pip install -r streamlit_requirements.txt

# Start Streamlit app
streamlit run streamlit_app.py
```

The app will open automatically at: **http://localhost:8501**

---

## 🎮 Using the App (5 Minutes)

### Feature 1: Disease Lookup 🔍
1. Click **"Disease Lookup"** in the sidebar
2. Type: `"Type 2 Diabetes"`
3. Click **"Search Disease"**
4. 📖 See complete disease profile:
   - What it is
   - Symptoms
   - Medications
   - Foods to eat/avoid
   - Lifestyle tips

**First time?** Wait 15-30 seconds (Meditron processing)  
**Second time?** Instant (cached result)

### Feature 2: Drug Information 💊
1. Click **"Drug Info"** in the sidebar
2. Type: `"Metformin"`
3. Click **"Search Medicine"**
4. 💊 Get drug profile:
   - What it treats
   - How it works
   - Common side effects
   - Interactions with other drugs
   - Pregnancy safety

### Feature 3: Symptom Checker 🩺
1. Click **"Symptom Checker"** in the sidebar
2. Select or type symptoms:
   - Example: `["Fever", "Cough", "Fatigue"]`
3. Click **"Predict Diseases"**
4. 📊 Get list of possible conditions ranked by likelihood

### Feature 4: AI Chat 🤖
1. Click **"AI Chat"** in the sidebar
2. Ask any medical question:
   - Example: `"What are the best foods for diabetes?"`
   - Example: `"Is it safe to take Metformin during pregnancy?"`
3. Click **"Send Message"**
4. 💬 Get instant, detailed response
5. Ask follow-ups - the AI remembers context!

---

## ⚠️ Important Notes

### Medical Disclaimer
**This app provides EDUCATIONAL information only.**
- NOT a substitute for professional medical advice
- Always consult a doctor for medical decisions
- For emergencies, call 911 or your local emergency number

### Privacy
- No user accounts or logins
- No data collection
- All requests go to your local backend
- Results are cached on your computer

### Performance
- **First query:** 15-30 seconds (AI processing)
- **Cached queries:** Instant (<1 second)
- **Cache duration:** 2 hours
- **Chat history:** Clears on app restart

---

## 🎨 Beautiful UI Features

✨ **Colorful Gradients**
- Purple, Pink, Blue, Green color schemes
- Smooth animations on every interaction
- Professional medical theme

📱 **Responsive Design**
- Works on desktop, tablet, phone
- Touch-friendly buttons
- Clear, readable text

🎭 **Organized Layout**
- Sidebar navigation
- Cards with information
- Progress indicators during loading
- Success/error messages

---

## 🔧 Troubleshooting

### ❌ "Connection refused: localhost:8000"
**Solution:** Backend is not running
```bash
# In Terminal 1, make sure to run:
python -m uvicorn main:app --reload --port 8000
```

### ❌ "Blank white page"
**Solution:** Streamlit is still loading
- Wait 30 seconds
- Refresh the browser (F5)
- Check for errors in Terminal 2

### ❌ "Ollama not detected"
**Solution:** Start Ollama in a separate window
```bash
ollama serve
```

### ❌ "Response is very slow"
**Solution:** Normal for first query!
- First query: 15-30 seconds (AI processing)
- Next queries: Instant (cached)
- Check if Ollama is running

### ❌ "Error: 404 Not Found"
**Solution:** Endpoint might have changed
- Verify backend is running on `http://localhost:8000`
- Check API docs at `http://localhost:8000/docs`

---

## 🚀 One-Command Startup

On **Windows**, you can use the startup script:

```bash
d:\medai\start_medai.bat
```

This script:
- ✅ Checks for Python, Ollama, PostgreSQL, Redis
- ✅ Creates virtual environment if missing
- ✅ Installs dependencies
- ✅ Asks you which service(s) to start
- ✅ Opens proper URLs automatically

---

## 📚 Example Queries

Try these to test the app:

### Disease Queries
- "Type 2 Diabetes"
- "Hypertension"
- "Asthma"
- "Heart Disease"
- "Anxiety Disorder"

### Drug Queries
- "Metformin"
- "Aspirin"
- "Insulin"
- "Lisinopril"
- "Atorvastatin"

### Symptoms
- Fever, Cough, Fatigue
- Shortness of breath, Chest pain
- Frequent urination, Excessive thirst
- Headache, Dizziness

### Chat Questions
- "What are the symptoms of diabetes?"
- "How does Metformin work?"
- "What foods should I avoid with hypertension?"
- "Is it safe to combine these two medications?"
- "What exercises help control blood pressure?"

---

## 📊 System Requirements

| Component | Required | Notes |
|-----------|----------|-------|
| **Python** | 3.11+ | Download from python.org |
| **RAM** | 8GB+ | 16GB recommended |
| **Storage** | 100GB+ | For Meditron 70B model |
| **Backend** | FastAPI | Included in requirements.txt |
| **AI Model** | Meditron 70B | Via Ollama |
| **Database** | PostgreSQL | Optional, can use SQLite |
| **Cache** | Redis | Optional but recommended |

---

## 🔗 Useful Links

- 🏥 **MedAI App:** http://localhost:8501
- 📖 **API Docs:** http://localhost:8000/docs
- 📚 **Streamlit Docs:** https://docs.streamlit.io/
- 🤖 **Meditron Paper:** https://arxiv.org/abs/2311.16079
- 💻 **FastAPI Docs:** https://fastapi.tiangolo.com/

---

## 💬 Need Help?

1. **Check troubleshooting section** above
2. **Review the logs:**
   - Backend: `backend/logs/app.log`
   - Frontend: Check Terminal 2 console output
3. **Test the backend directly:**
   ```bash
   curl http://localhost:8000/health
   ```
4. **Verify Meditron is ready:**
   ```bash
   ollama list
   ```

---

## 🎉 Getting Started

**Ready to go?**

```bash
# Terminal 1 - Backend
cd d:\medai\backend
.\venv\Scripts\activate
python -m uvicorn main:app --reload --port 8000

# Terminal 2 - Streamlit (in new terminal)
cd d:\medai\frontend
streamlit run streamlit_app.py
```

**Browser automatically opens to:** http://localhost:8501

**Enjoy MedAI!** 🏥✨

---

**Version:** 2.0.0 - Streamlit Edition  
**Updated:** February 28, 2026  
**Status:** 🟢 Ready to Use
