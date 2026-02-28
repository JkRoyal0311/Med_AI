# 🏥 MedAI - Streamlit Version Setup & User Guide

**Version:** 2.0.0 - Streamlit Edition  
**Date:** February 28, 2026  
**Status:** ✅ Ready for Deployment

---

## 📋 What Changed

### ✅ No More Authentication
- Removed all login/register functionality
- All API endpoints are now public and don't require tokens
- Everyone can access all features immediately
- Simpler, faster, more accessible

### ✅ Beautiful Streamlit Interface
- Responsive, colorful responsive UI with gradients
- Smooth animations and transitions
- Easy-to-use navigation tabs
- Real-time responses
- Mobile-friendly design

### ✅ Features Preserved
All medical features are still available:
- 🔍 Disease Lookup - Get complete disease information
- 💊 Drug Info - Look up medicines and interactions
- 🩺 Symptom Checker - Get possible conditions from symptoms
- 🤖 AI Chat - Ask medical questions

---

## 🚀 Quick Start (Windows)

### Step 1: Install Python Dependencies

```bash
cd d:\medai\frontend

# Install Streamlit and dependencies
pip install -r streamlit_requirements.txt
```

### Step 2: Start Streamlit App

```bash
# From d:\medai\frontend directory
streamlit run streamlit_app.py
```

This will:
- Start the Streamlit dev server on http://localhost:8501
- Automatically open the app in your default browser
- Show a beautiful dashboard with all medical features

### Step 3: Verify Backend is Running

Make sure the backend is running in another terminal:

```bash
cd d:\medai\backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

Also ensure these services are running:
- **Ollama** (Meditron 70B): `ollama serve`
- **PostgreSQL**: Running (if using database features)
- **Redis**: Running (for caching)

---

## 📱 Using the App

### Home Page 🏠
- Overview of all features
- Quick links to common diseases
- Beautiful feature cards with descriptions

### Disease Lookup 🔍
1. Type a disease name (e.g., "Type 2 Diabetes")
2. Click "Search Disease"
3. Get comprehensive information:
   - What the disease is
   - Symptoms to watch for
   - Medications to use
   - Foods to eat/avoid
   - Lifestyle tips

**Time:** First query: 15-30 seconds (cached for future)

### Drug Info 💊
1. Type a medicine name (e.g., "Metformin")
2. Click "Search Medicine"
3. Get detailed information:
   - What it treats
   - How it works
   - Side effects
   - Drug interactions
   - Pregnancy safety

**Time:** Instant (cached)

### Symptom Checker 🩺
1. Select symptoms from the list or type custom ones
2. Click "Predict Diseases"
3. Get ranked list of possible conditions:
   - Condition name
   - Confidence percentage
   - Key characteristics

**Example:** Fever + Cough + Cough → Could indicate: Flu, COVID-19, Pneumonia

### AI Chat 🤖
1. Type any medical question in natural language
2. Click "Send Message"
3. Get instant, detailed response
4. Ask follow-up questions
5. Chat history is maintained during session

**Examples:**
- "What are the side effects of Aspirin?"
- "How to manage Type 2 diabetes naturally?"
- "Is it safe to take this drug during pregnancy?"
- "What foods help control blood pressure?"

---

## 🎨 UI Features

### Beautiful Design Elements
- 🎨 **Colorful Gradients** - Purple, Pink, Blue, Green gradients
- ⚡ **Smooth Animations** - Fade-in, slide-in effects
- 📱 **Responsive Layout** - Works on desktop, tablet, mobile
- 🎭 **Cards & Sections** - Organized information display
- ⚠️ **Disclaimer Banner** - Always visible at top

### Navigation
- Sidebar with feature selection
- Easy switching between different tools
- Clear, intuitive buttons
- Progress indicators during loading

### Accessibility
- Large, readable fonts
- High contrast colors
- Simple, clear language
- No complex technical jargon

---

## ⚙️ Configuration

### Environment Variables

Create (or update) `.env` in `d:\medai\frontend\`:

```env
BACKEND_URL=http://localhost:8000/api
STREAMLIT_CLIENT_SHOWSTDERR=false
STREAMLIT_LOGGER_LEVEL=info
```

### Streamlit Config

Config file: `d:\medai\frontend\.streamlit\config.toml`

Customize colors, fonts, and appearance there.

---

## 🔗 API Endpoints (Used by Streamlit)

All endpoints are now **public** (no authentication required):

```
GET    /api/health                          — Health check
GET    /api/medical/disease?name=...        — Get disease info
GET    /api/medical/drug?name=...           — Get medicine info
POST   /api/medical/symptoms/predict        — Predict from symptoms
POST   /api/medical/chat/stream             — Streaming AI chat
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank white page | Wait 30 seconds for Streamlit to compile |
| "Connection refused" error | Check backend is running on port 8000 |
| Slow responses | Ollama might be processing (normal: 15-30s for first query) |
| Cached responses not updating | Wait 2 hours (cache TTL) or restart app |
| App crashes on startup | Check `streamlit_app.py` for Python syntax errors |
| Feature not working | See console output: scroll up in terminal |

### Enable Debug Mode

```bash
streamlit run streamlit_app.py --logger.level=debug
```

---

## 📊 Performance Tips

1. **First query is slow:** Meditron needs 15-30 seconds to process
2. **Subsequent queries are instant:** Results are cached for 2 hours
3. **Clear cache:** Delete Redis data or wait for TTL to expire
4. **Use shorter prompts:** "Diabetes" searches faster than "Tell me about diabetes complications"

---

## 🔄 Update Backend Responses

Backend responses are now formatted beautifully with:
- ✅ Emojis for visual interest
- ✅ Markdown formatting
- ✅ Clear sections with headers
- ✅ Bullet points for readability
- ✅ Medical disclaimer included

Example response structure:
```
🏥 **What is Type 2 Diabetes?**
[Description here]

⚠️ **Symptoms**
- Symptom 1
- Symptom 2

💊 **Medications**
- [Drug name]: [Purpose]

🍎 **Foods to Eat**
- [Food]: [Benefit]

[Medical Disclaimer Footer]
```

---

## 🚀 Production Deployment

### Option 1: Streamlit Community Cloud (Free)
```bash
# Push your code to GitHub
# Go to https://streamlit.io/cloud
# Connect GitHub repo → Deploy
```

### Option 2: Heroku
```bash
# Create Procfile:
web: streamlit run streamlit_app.py --server.port=$PORT --server.address=0.0.0.0

# Deploy
heroku login
heroku create medai-app
git push heroku main
```

### Option 3: Docker
```bash
# Create Dockerfile (provided below)
docker build -t medai-streamlit .
docker run -p 8501:8501 medai-streamlit
```

### Important for Production
1. Update `BACKEND_URL` to your production API URL
2. Ensure CORS is enabled on backend
3. Set `streamlit.server.headless = true`
4. Use HTTPS for both frontend and backend
5. Add rate limiting to prevent abuse

---

## 📈 Future Enhancements

Potential additions to the Streamlit version:
- [ ] User preferences/favorites without login
- [ ] Symptom severity slider
- [ ] Drug comparison tool
- [ ] Meal plan suggestions
- [ ] Exercise recommendations
- [ ] Medical history tracking (localStorage)
- [ ] Offline mode support
- [ ] Dark theme toggle
- [ ] Multiple language support (Hindi, Spanish, etc.)
- [ ] Export results to PDF

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Streamlit documentation: https://docs.streamlit.io/
3. Check FastAPI backend logs: `backend/logs/app.log`
4. Verify Meditron is running: `ollama list`

---

## 📝 License & Disclaimer

This software is provided for **educational purposes only**. It is not a substitute for professional medical advice. Always consult qualified healthcare providers for medical decisions.

---

**Version:** 2.0.0 - Streamlit Edition  
**Last Updated:** February 28, 2026  
**Status:** 🟢 Production Ready
