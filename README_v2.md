# 🏥 MedAI - AI-Powered Medical Information System

> **Version 2.0** - Streamlit Edition with Beautiful UI, No Authentication Required

[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)](https://fastapi.tiangolo.com/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.28-FF4B4B.svg)](https://streamlit.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)](#)

---

## 🎯 Features

### 🔍 Disease Lookup
Get comprehensive information about any disease:
- What is the disease?
- Symptoms to watch for
- Medications used (with explanations)
- Foods to eat and avoid
- Lifestyle recommendations
- Local Indian remedies and food names

### 💊 Drug Information  
Learn everything about medicines:
- What the drug treats
- How it works (mechanism)
- Common and serious side effects
- Drug-drug and drug-food interactions
- Pregnancy/breastfeeding safety
- Brand names (especially Indian brands)

### 🩺 Symptom Checker
Get possible conditions from symptoms:
- Enter multiple symptoms
- Get ranked list of possible conditions
- Understand why symptoms match
- Know when to see a doctor
- Clear non-diagnosis disclaimer

### 🤖 AI Chat
Ask medical questions in natural language:
- Context-aware responses
- Conversation history
- Personalized to your conditions
- Real-time streaming answers
- Medical knowledge base grounded

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Streamlit Web Application                      │
│  • Beautiful UI with gradients & animations                │
│  • No authentication required                              │
│  • Responsive design (desktop/mobile)                      │
│  • Real-time responses                                     │
└────────────────────────────────────────┬────────────────────┘
                                         │ HTTP REST API
┌────────────────────────────────────────▼────────────────────┐
│             FastAPI Python Backend                          │
│  • Public endpoints (no auth)                              │
│  • Medical knowledge base (RAG)                            │
│  • Meditron 70B LLM integration                            │
│  • Redis caching (2-hour TTL)                             │
└────────────────────────────────────────┬────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────┐
        │                                 │                    │
    ┌───▼────┐                    ┌──────▼──────┐    ┌───────▼───┐
    │ Ollama  │                    │ PostgreSQL  │    │   Redis   │
    │Meditron │                    │  Database   │    │   Cache   │
    │  70B    │                    └─────────────┘    └───────────┘
    └────────┘
```

---

## 🚀 Quick Start

### ⏱️ 5 Minutes to Running

#### 1. Check Prerequisites
```bash
# Python 3.11+
python --version

# Ollama running (in separate terminal)
ollama serve
```

#### 2. Start Backend
```bash
cd d:\medai\backend

# Activate environment
.\venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start server
python -m uvicorn main:app --reload --port 8000
```

#### 3. Start Streamlit
```bash
cd d:\medai\frontend

# Install Streamlit (first time only)
pip install -r streamlit_requirements.txt

# Start app
streamlit run streamlit_app.py
```

**App opens automatically at:** `http://localhost:8501` 🎉

---

## 📋 System Requirements

| Component | Requirement | Notes |
|-----------|-------------|-------|
| **OS** | Windows/Mac/Linux | Any platform with Python |
| **Python** | 3.11+ | Download from python.org |
| **RAM** | 8GB minimum | 16GB recommended |
| **Storage** | 100GB+ | For Meditron 70B model |
| **Ollama** | Latest version | https://ollama.ai |
| **PostgreSQL** | 12+ (optional) | Can use SQLite alternative |
| **Redis** | 7.0+ (optional) | For caching (recommended) |

---

## 🎨 UI Features

### Beautiful Design
- 🎨 Colorful gradients (purple, pink, blue, green)
- ⚡ Smooth animations and transitions
- 📱 Responsive layout (works on all devices)
- 🎭 Card-based information display
- ⚠️ Always-visible medical disclaimer

### Easy Navigation
- Sidebar with feature selection
- Clear, intuitive buttons
- Progress indicators during loading
- Success/error messages
- Organized sections

---

## 📚 Documentation

### Quick References
- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup guide
- **[STREAMLIT_SETUP.md](STREAMLIT_SETUP.md)** - Detailed configuration
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - What changed from v1.0

### API Documentation
- Backend API Docs (Swagger): `http://localhost:8000/docs`
- Backend API ReDoc: `http://localhost:8000/redoc`

---

## 🔧 Configuration

### Environment Variables
Create `.env` file in `/frontend`:
```env
BACKEND_URL=http://localhost:8000/api
STREAMLIT_CLIENT_SHOWSTDERR=false
STREAMLIT_LOGGER_LEVEL=info
```

### Streamlit Config
Edit `.streamlit/config.toml` to customize:
- Colors and theme
- Font size and family
- Port and address
- Sidebar expansion

---

## 🏥 Medical Features

### Comprehensive Disease Database
- 50+ diseases covered
- Multiple languages support (English, Hindi)
- Local food names (Karela, Methi, Amla, etc.)
- Links to government health resources

### Drug Information
- 1000+ medicines indexed
- OpenFDA data integration
- Brand name mapping
- Interaction checker

### AI-Powered Responses
- Based on Meditron 70B model
- Trained on medical literature
- Context-aware answers
- Always includes medical disclaimer

---

## ⚕️ Medical Disclaimer

> **IMPORTANT:** This application provides **educational information only**.
>
> It is **NOT** a substitute for professional medical advice, diagnosis, or treatment.
>
> Always consult a qualified doctor or pharmacist before:
> - Taking any medication
> - Making health decisions
> - Interpreting test results
>
> **For emergencies:** Call 911 or your local emergency number immediately.

This disclaimer is shown on every screen and in every response.

---

## 🚀 Deployment

### Option 1: Streamlit Community Cloud (Free)
```bash
# Push to GitHub
git push origin main

# Go to https://streamlit.io/cloud
# Connect your repo → Deploy
```

### Option 2: Docker
```bash
cd frontend
docker build -t medai-streamlit .
docker run -p 8501:8501 medai-streamlit
```

### Option 3: Your Own Server
```bash
# SSH into server
ssh user@server.com

# Clone repo
git clone <your-repo>

# Install & run
pip install -r requirements.txt
streamlit run streamlit_app.py --server.port 8501 --server.address 0.0.0.0
```

---

## 🔄 What's New in v2.0

### ✨ Major Changes
- **Frontend:** React Native → Beautiful Streamlit app
- **Authentication:** None! (was JWT-based)
- **Database:** User table optional (was mandatory)
- **Deployment:** Web URL (was mobile app)
- **Time to use:** Instant (was sign-up required)

### ✅ All Features Preserved
- Disease lookup still works
- Drug information still available
- Symptom checker still functional
- AI chat still responds perfectly
- Medical knowledge base still comprehensive

### 📈 Improvements
- **Faster:** Server-side caching only
- **Simpler:** No auth complexity
- **Prettier:** Beautiful gradient UI
- **Accessible:** Instant access for everyone
- **Maintainable:** Simpler codebase

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Connection refused: localhost:8000 | Start backend: `python -m uvicorn main:app --reload --port 8000` |
| Blank white page in Streamlit | Wait 30 seconds, then refresh browser |
| "Ollama not detected" error | Start Ollama: `ollama serve` |
| Slow responses (15-30s) | Normal! First query is slow, cached queries are instant |
| "CORS error" in browser | Make sure backend is running and accessible |

See [QUICK_START.md](QUICK_START.md#troubleshooting) for detailed troubleshooting.

---

## 📊 Performance

### Response Times
- **First query:** 15-30 seconds (AI processing)
- **Cached queries:** <1 second
- **Cache duration:** 2 hours
- **Chat responses:** Real-time streaming

### System Performance
- CPU: Moderate (Meditron does heavy lifting)
- Memory: 2-4GB when running
- Network: Minimal (local API)
- Storage: Used only for cache

---

## 🎓 Learning Resources

### Medical AI
- [Meditron Paper](https://arxiv.org/abs/2311.16079) - Model research
- [OpenFDA API](https://open.fda.gov/) - Drug data source
- [PubMed Central](https://pubmed.ncbi.nlm.nih.gov/pmc/) - Medical literature

### Technical Stack
- [FastAPI Docs](https://fastapi.tiangolo.com/) - Backend framework
- [Streamlit Docs](https://docs.streamlit.io/) - Frontend framework
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/) - Database ORM
- [ChromaDB Docs](https://docs.trychroma.com/) - Vector database

---

## 🤝 Contributing

We welcome contributions! Areas for improvement:

- [ ] Add more medical knowledge files
- [ ] Improve drug interaction checker
- [ ] Add meal plan generator
- [ ] Add exercise recommendations
- [ ] Improve multi-language support
- [ ] Add dark mode toggle

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

### Getting Help
1. Check [QUICK_START.md](QUICK_START.md) - has troubleshooting
2. Review [STREAMLIT_SETUP.md](STREAMLIT_SETUP.md) - detailed guides
3. Check backend logs: `backend/logs/app.log`
4. Test API: `http://localhost:8000/docs`

### Report Issues
- Create a GitHub issue with:
  - Description of the problem
  - Steps to reproduce
  - Error messages/screenshots
  - System info (OS, Python version, etc.)

---

## 🙏 Acknowledgments

- **Meditron 70B** - Medical LLM model by Asclepius AI
- **FastAPI** - Modern Python web framework
- **Streamlit** - Rapid data app development
- **ChromaDB** - Vector database for medical knowledge
- **Ollama** - Easy LLM deployment

---

## 📈 Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Backend API** | ✅ Production Ready | All endpoints working |
| **Streamlit Frontend** | ✅ Production Ready | Beautiful, tested UI |
| **Medical Knowledge** | ✅ Production Ready | 50+ diseases, 1000+ drugs |
| **Caching** | ✅ Working | 2-hour TTL |
| **Documentation** | ✅ Complete | Comprehensive guides |
| **Deployment** | ✅ Ready | Multiple options available |

---

## 🎯 Roadmap

### v2.1 (Next)
- [ ] Dark mode support
- [ ] User preferences (localStorage)
- [ ] PDF export functionality
- [ ] Better mobile UI

### v2.2 (Future)
- [ ] Multi-language support (Hindi, Spanish, etc.)
- [ ] Medical history tracking
- [ ] Lab value interpretation
- [ ] Doctor finder integration

### v3.0 (Long-term)
- [ ] Optional user accounts
- [ ] Medical record upload/storage
- [ ] Telemedicine integration
- [ ] Wearable device integration

---

## 💡 Tips

### For Best Results
1. **First query:** Wait 15-30 seconds for AI processing
2. **Use specific terms:** "Type 2 Diabetes" finds more than "diabetes"
3. **Browse symptoms:** Select common symptoms first, then add custom ones
4. **Maintain context:** Chat remembers previous questions
5. **Trust medical advice:** When in doubt, consult a doctor

### Pro Features
- **Symptom combos:** Try multiple symptoms for better predictions
- **Drug interactions:** Ask about medication combinations
- **Food guides:** Get diet recommendations for your condition
- **Follow-ups:** Chat can answer follow-up questions

---

## 🏁 Getting Started

**TL;DR - Just run this:**

```bash
# Terminal 1
cd d:\medai\backend && python -m uvicorn main:app --reload --port 8000

# Terminal 2
cd d:\medai\frontend && streamlit run streamlit_app.py
```

**Done!** App opens at: `http://localhost:8501` ✨

---

**Created:** February 28, 2026  
**Version:** 2.0.0 - Streamlit Edition  
**Status:** 🟢 Production Ready  
**License:** MIT  

---

### ⭐ If you found this helpful, please star the repository!

For questions, issues, or feedback, please open a GitHub issue or contact us through the support channels.

**Happy exploring with MedAI!** 🏥✨
