# 🏥 MedAI - Complete Setup & Deployment Guide

**Current Date:** February 28, 2026  
**Project Status:** ✅ Folder structure & all core files created  
**Next Phase:** Setup, Configuration & Deployment

---

## 📋 What's Been Created

### ✅ Backend Structure (Ready to Deploy)
```
backend/
├── app/
│   ├── api/routes/       [auth.py, medical.py]
│   ├── ai/               [meditron_client.py, rag_engine.py, ai_service.py]
│   ├── core/             [config.py, database.py, security.py]
│   ├── models/           [models.py]
│   └── schemas/          [Placeholder for Pydantic schemas]
├── medical_knowledge/    [diabetes.txt, hypertension.txt, hypothyroidism.txt]
├── main.py              [FastAPI entry point]
├── requirements.txt     [All dependencies]
├── .env                 [Configuration file]
└── .gitignore
```

### ✅ Frontend Structure (Ready to Deploy)
```
frontend/
├── app/
│   ├── (auth)/          [login.tsx, register.tsx, _layout.tsx]
│   ├── (tabs)/          [index.tsx, search.tsx, chat.tsx, profile.tsx, _layout.tsx]
│   ├── _layout.tsx      [Root layout with auth guard]
│   ├── result.tsx       [Disease/drug results display]
│   └── symptoms.tsx     [Symptom checker screen]
├── components/ui/       [DisclaimerBanner, MedCard, SearchBar]
├── services/            [api.ts - Axios client]
├── store/               [authStore.ts - Zustand state]
├── hooks/               [useDebounce.ts]
├── package.json         [Dependencies]
├── tsconfig.json        [TypeScript config]
├── tailwind.config.js   [Tailwind CSS theme]
├── babel.config.js      [Babel config for React Native]
└── app.json             [Expo configuration]
```

---

## 🚀 Step 1: Backend Setup (Hour 1)

### 1.1 Create Python Virtual Environment

```bash
cd d:\medai\backend

# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 1.2 Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- FastAPI 0.115 (REST API framework)
- SQLAlchemy 2.0 (Database ORM)
- ChromaDB 0.5 (Vector database for RAG)
- Ollama client (Meditron 70B interface)
- Redis, Pydantic, JWT, Passlib, etc.

**⏱️ Expected time: 5-7 minutes**

### 1.3 Install & Start Ollama

Ollama is a tool that runs Meditron 70B locally without needing GPU expertise.

**Download:**
- Windows/Mac/Linux: https://ollama.ai/

**Install and pull Meditron:**

```bash
# After installing Ollama, open terminal/command prompt:
ollama pull meditron:7b

# Use 7b for development (4GB) OR 70b for production (40GB)
# The 7b version is sufficient for MVP testing

# Verify it's running:
ollama list
```

**Keep this running in background.** It will serve requests on `http://localhost:11434`

### 1.4 Install PostgreSQL

The app uses PostgreSQL for relational data (users, diseases, medicines).

**Options:**
- **Local installation:** https://www.postgresql.org/download/
- **Docker:** `docker run --name medai_db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15`
- **Cloud:** AWS RDS, DigitalOcean, or Railway PostgreSQL

**Create database:**

```bash
# Windows: Use pgAdmin or psql
psql -U postgres -c "CREATE DATABASE medai_db;"

# Mac/Linux:
createdb medai_db
```

### 1.5 Install Redis

Redis caches expensive AI responses (so repeated queries are instant).

**Options:**
- **Local:** https://redis.io/download
- **Docker:** `docker run --name medai_redis -p 6379:6379 -d redis:8.4.2`
- **Cloud:** Redis Cloud, Railway

**Verify running:**

```bash
docker exec -it medai_redis redis-cli ping
# Should output: PONG
```

### 1.6 Start Backend Services (3 terminals)

**Terminal 1 - Backend API:**
```bash
cd d:\medai\backend
venv\Scripts\activate  # or source venv/bin/activate on Mac
uvicorn main:app --reload --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
✅ Database tables ready
✅ Ollama/Meditron is running
✅ RAG index built
```

**Terminal 2 - Ollama (if not auto-running):**
```bash
ollama serve
```

**Terminal 3 - Redis (if not auto-running):**
```bash
redis-server
```

### 1.7 Test Backend

Navigate to: **http://localhost:8000/docs**

You'll see Swagger UI. Try these endpoints:

1. **Register** → `POST /api/auth/register`
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "test123",
     "age": 35
   }
   ```

2. **Login** → `POST /api/auth/login`
   ```json
   {
     "email": "john@example.com",
     "password": "test123"
   }
   ```
   Copy the returned `token`

3. **Get Disease Info** → `GET /api/medical/disease?name=Diabetes`
   - Add `Authorization: Bearer YOUR_TOKEN` in header
   - **This takes 15-30 seconds on first call** (Meditron processing)
   - Subsequent calls cached for 2 hours (instant)

4. **Health Check** → `GET /health`
   ```json
   {
     "status": "ok",
     "meditron": "running",
     "app": "MedAI",
     "version": "1.0.0"
   }
   ```

---

## 📱 Step 2: Frontend Setup (Hour 2)

### 2.1 Install Node.js

Download: https://nodejs.org/ (LTS version recommended)

Verify:
```bash
node --version   # Should be v18+ 
npm --version    # Should be v9+
```

### 2.2 Install Expo CLI & Dependencies

```bash
cd d:\medai\frontend

# Install Expo globally
npm install -g expo-cli

# Install all project dependencies
npm install

# Takes 3-5 minutes
```

### 2.3 Update API Configuration

**Find your computer's local IP:**

Windows:
```bash
ipconfig
# Look for "IPv4 Address" under your active network adapter
# Example: 192.168.1.100
```

Mac/Linux:
```bash
ifconfig | grep "inet "
# Look for address starting with 192.168 or 10.0
```

**Update frontend [services/api.ts](services/api.ts):**
```typescript
// Line 8
export const BASE_URL = 'http://YOUR_IP_HERE:8000/api';
// Example: 'http://192.168.1.100:8000/api'
```

**Why?** Expo Go on your phone needs the same IP your computer uses. `localhost` won't work.

### 2.4 Start Frontend Dev Server

```bash
cd d:\medai\frontend
npx expo start
```

You'll see:
```
📱 Starting Metro Bundler
│
│  ✓ Metro Bundler started

│  🎯 Using Expo Go
│  ✓ Connected to Metro Bundler at ws://...

│  📱 Scan this QR code with your phone (Android/iOS):
│  ┌─────────────────────┐
│  │  [QR CODE APPEARS]  │
│  └─────────────────────┘
```

### 2.5 Test Frontend on Your Phone

**Android:**
1. Download "Expo Go" from Google Play Store
2. Open the app
3. Scan the QR code from terminal
4. App loads on your phone

**iPhone:**
1. Download "Expo Go" from Apple App Store
2. Open the app
3. Scan the QR code (use iPhone camera)
4. App loads

**First-time User Flow:**
1. Tap "Sign up"
2. Enter: name, email, password, optional age
3. Get logged in automatically
4. See Home screen with:
   - Search bar
   - Feature grid (Disease, Drug, Symptom, Chat)
   - Common conditions (Diabetes, Hypertension, etc.)
   - Disclaimer banner ⚠️

### 2.6 Test Core Features

**Feature 1 - Disease Lookup:**
1. Tap "Disease Guide" button
2. Type "Diabetes"
3. Tap the auto-complete suggestion
4. See full disease profile loading...
5. View structured response with medications, foods, symptoms

**Feature 2 - Symptom Checker:**
1. Tap "Symptom Check" button
2. Select/add symptoms: "frequent urination", "fatigue", "blurred vision"
3. Tap "Analyze 3 Symptoms"
4. Get top 3 possible conditions from AI

**Feature 3 - Drug Info:**
1. Tap "Drug Info" button  
2. Search "Metformin"
3. See drug profile: uses, side effects, interactions

**Feature 4 - AI Chat:**
1. Tap "AI Chat" button
2. Type question: "What foods should a diabetic avoid?"
3. Watch answer stream word-by-word in real-time
4. Ask follow-up: "What about rice?"
5. AI remembers context from previous question

​---

## 🔧 Step 3: Add More Medical Knowledge (Hour 3)

The RAG system is currently indexed with 3 diseases. Add more for better accuracy:

### 3.1 Create Knowledge Files

Add these files to `backend/medical_knowledge/`:

**kidney_disease.txt** - Chronic kidney disease (CKD)
**asthma.txt** - Asthma and respiratory
**arthritis.txt** - Rheumatoid and osteoarthritis
**anemia.txt** - Iron deficiency anemia
**heart_disease.txt** - Coronary artery disease
**anxiety.txt** - Anxiety and panic disorders

Each file should have:
```
DISEASE: [Name]
CATEGORY: [Medical category]
ICD-10: [Code]
SEVERITY: [Mild/Moderate/Severe]

DESCRIPTION: [Detailed explanation]

SYMPTOMS: [Bullet list with explanations]

MEDICATIONS USED: [List each drug with details]

MEDICATIONS TO AVOID: [Important drug warnings]

FOODS TO EAT: [List with local Indian names where relevant]

FOODS TO STRICTLY AVOID: [Foods that worsen condition]

DANGEROUS COMBINATIONS: [Drug-drug or drug-food interactions]
```

### 3.2 Rebuild RAG Index

```bash
# In backend terminal, after adding new files:
# Stop uvicorn (Ctrl+C)
# Restart:
uvicorn main:app --reload --port 8000

# On startup, it rebuilds the index with all .txt files
✅ RAG index built: 2000+ chunks ready
```

---

## 🌍 Step 4: Production Deployment (Hour 4-5)

### 4.1 Backend Deployment Options

#### **Option A: Railway (Recommended - Easiest)**
1. Go to https://railway.app/
2. Sign up with GitHub
3. Create new project → PostgreSQL
4. Create new project → Redis
5. Create new project → Deploy FastAPI:
   - Connect GitHub repo
   - Set environment variables from `.env`
   - Railway automatically detects `main.py`

```bash
# Cost: $5/month for small deployment
# Includes: PostgreSQL, Redis, FastAPI hosting
```

#### **Option B: Render**
1. https://render.com/
2. Connect GitHub
3. Create Web Service from your `backend/` folder
4. Attach PostgreSQL and Redis add-ons
5. Deploy

```bash
# Cost: Free tier available (8 hours/month)
# Paid: $7+/month
```

#### **Option C: AWS EC2 (Full Control)**
```bash
# 1. Launch t3.medium instance (1GB RAM minimum)
# 2. SSH into server
# 3. Install: Python, PostgreSQL, Redis, Ollama
# 4. Clone repo, install dependencies
# 5. Use Gunicorn + Nginx:

gunicorn main:app -w 4 -b 0.0.0.0:8000

# 6. Set up SSL with Let's Encrypt
# Cost: $10-20/month
```

**Important for Meditron:**
- If using Meditron 70B, you need GPU server
- AWS g4dn.2xlarge: $0.75/hour (~$500/month)
- **Alternative:** Keep backend on CPU, use Meditron 7B
- **Or:** Partner with medical AI provider (MedPaLM 2, etc.)

### 4.2 Frontend Deployment - App Store

#### **For Testing (Free):**
Keep using Expo Go​ (development mode)

#### **Android Play Store:**
```bash
cd frontend

# 1. Build APK
eas build --platform android --profile production

# 2. Upload to Google Play Store
# Cost: $25 one-time developer fee
# Time: 2-3 hours for review
```

#### **Apple App Store:**
```bash
cd frontend

# 1. Build IPA for iOS
eas build --platform ios --profile production

# 2. Upload to App Store
# Requirements:
#   - Apple Developer account ($99/year)
#   - MacBook (for notarization)
# Time: 24-48 hours for review
```

---

## 📊 Checklist for Launch

- [ ] **Backend running locally:**
  - [ ] PostgreSQL accessible
  - [ ] Redis running
  - [ ] Ollama/Meditron running
  - [ ] FastAPI docs page shows all endpoints
  - [ ] JWT authentication working

- [ ] **Frontend running locally:**
  - [ ] Expo Go shows all screens without errors
  - [ ] Login/register works
  - [ ] Disease search returns results
  - [ ] Symptom checker shows predictions
  - [ ] Chat streams responses in real-time
  - [ ] Disclaimers appear on every medical screen

- [ ] **Medical Knowledge:**
  - [ ] At least 10 disease knowledge files added
  - [ ] RAG index built successfully (500+ chunks)
  - [ ] All searches return relevant results

- [ ] **Deployment Plan:**
  - [ ] Backend Cloud (Railway/Render/AWS)
  - [ ] Meditron strategy (cloud/local/API)
  - [ ] Domain name reserved (optional)
  - [ ] SSL certificate (HTTPS)

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| `Connection refused: localhost:8000` | Start backend with `uvicorn main:app --reload --port 8000` |
| `Ollama not detected` | Install Ollama & run `ollama serve` in separate terminal |
| `ModuleNotFoundError: No module named 'fastapi'` | Run `pip install -r requirements.txt` after venv activation |
| `PostgreSQL connection failed` | Ensure PostgreSQL is running; check DATABASE_URL in .env |
| `Expo Go shows blank screen` | Check BASE_URL in api.ts matches your computer IP (use ipconfig/ifconfig) |
| `Frontend slow to load` | First Meditron call takes 15-30s; cache returns instant results |
| `Medical AI giving generic answers` | Add more disease knowledge files & rebuild RAG index |
| `"Authorization required" on API calls` | Register/login first; copy returned token to Authorization header |

---

## 📈 Next Features (Phase 2+)

### Week 2-3:
- [ ] Multi-language support (Hindi)
- [ ] Offline mode (cache last 20 searches)
- [ ] Medication reminder notifications
- [ ] Drug interaction checker (2+ drugs)
- [ ] Food allergy detection

### Month 2:
- [ ] Lab report upload/interpretation (PDF parsing)
- [ ] Doctor dashboard (Next.js web app)
- [ ] Telemedicine integration (Practo/Mfine)
- [ ] Apple Health / Google Fit sync

### Month 3+:
- [ ] Wearable integration (smartwatch data)
- [ ] Personalized health recommendations
- [ ] Family health profiles
- [ ] Medical records backup
- [ ] B2B partnerships (hospitals, clinics)

---

## 💡 Quick Commands Reference

```bash
# Backend startup (3 terminals)
## Terminal 1:
cd backend && venv\Scripts\activate && uvicorn main:app --reload

## Terminal 2:
ollama serve

## Terminal 3:
redis-server

# Frontend startup
cd frontend && npx expo start

# Test API
curl http://localhost:8000/health -H "Authorization: Bearer YOUR_TOKEN"

# Rebuild RAG index (after adding disease files)
# Restart backend: Ctrl+C, then re-run uvicorn

# View backend logs
tail -f backend_output.log

# Check Meditron status
ollama list

# Reset database (⚠️ loses all data)
dropdb medai_db && createdb medai_db
```

---

## 🎯 Success Metrics

**MVP Launch Goals:**
- ✅ 10+ diseases with full profiles
- ✅ <2 second response time (cached queries)
- ✅ <30 second response time (fresh AI queries)
- ✅ 99% uptime during deployment
- ✅ All medical screens show disclaimer
- ✅ 1000+ downloads (app store)

---

## 📞 Support & Resources

**Documentation:**
- FastAPI: https://fastapi.tiangolo.com/
- React Native: https://reactnative.dev/
- Expo: https://docs.expo.dev/
- SQLAlchemy: https://docs.sqlalchemy.org/
- ChromaDB: https://docs.trychroma.com/
- Ollama: https://github.com/ollama/ollama

**Medical AI:**
- Meditron Paper: https://arxiv.org/abs/2311.16079
- OpenFDA API: https://open.fda.gov/

---

**Last Updated:** February 28, 2026  
**Version:** 1.0.0 - MVP Build  
**Status:** 🟢 Ready for Deployment
