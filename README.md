# 🏥 MedAI - Project Structure & File Inventory

**Date:** February 28, 2026  
**Status:** ✅ All files created and ready for setup  
**Next Step:** Follow SETUP_GUIDE.md for deployment

---

## 📁 Complete Folder Structure

```
d:\medai\
│
├── 📄 MedAI_Complete_Plan.md          (Original plan document)
├── 📄 SETUP_GUIDE.md                  (🎯 START HERE - deployment guide)
├── 📄 README.md                       (This file)
│
├── 📁 backend/
│   ├── 📄 main.py                     (FastAPI entry point - START BACKEND HERE)
│   ├── 📄 requirements.txt            (Python dependencies)
│   ├── 📄 .env                        (Configuration - update DATABASE_URL, REDIS_URL)
│   ├── 📄 .gitignore
│   │
│   ├── 📁 app/
│   │   ├── 📄 __init__.py
│   │   ├── 📁 api/
│   │   │   ├── 📄 __init__.py
│   │   │   └── 📁 routes/
│   │   │       ├── 📄 __init__.py
│   │   │       ├── 📄 auth.py         (Register, Login endpoints)
│   │   │       └── 📄 medical.py      (Disease, Drug, Symptom, Chat endpoints)
│   │   │
│   │   ├── 📁 ai/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 meditron_client.py  (Ollama/Meditron 70B wrapper)
│   │   │   ├── 📄 rag_engine.py       (ChromaDB indexer & semantic search)
│   │   │   └── 📄 ai_service.py       (Main AI orchestration - disease_info, predict, chat)
│   │   │
│   │   ├── 📁 core/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 config.py           (Settings from .env)
│   │   │   ├── 📄 database.py         (SQLAlchemy + PostgreSQL setup)
│   │   │   └── 📄 security.py         (JWT auth + password hashing)
│   │   │
│   │   ├── 📁 models/
│   │   │   ├── 📄 __init__.py
│   │   │   └── 📄 models.py           (SQLAlchemy ORM: User, Disease, Medicine, etc.)
│   │   │
│   │   └── 📁 schemas/                (Pydantic request/response schemas - placeholder)
│   │
│   ├── 📁 medical_knowledge/          (RAG knowledge base - add more files here)
│   │   ├── 📄 diabetes.txt
│   │   ├── 📄 hypertension.txt
│   │   └── 📄 hypothyroidism.txt
│   │       [ADD MORE: asthma.txt, arthritis.txt, anemia.txt, etc.]
│   │
│   └── 📁 tests/                      (Unit tests - placeholder)
│
└── 📁 frontend/
    ├── 📄 app.json                    (Expo config)
    ├── 📄 package.json                (npm dependencies)
    ├── 📄 tsconfig.json               (TypeScript config)
    ├── 📄 tailwind.config.js          (Tailwind CSS theme)
    ├── 📄 babel.config.js             (Babel for React Native)
    ├── 📄 .gitignore
    │
    ├── 📁 app/                        (Expo Router - file-based navigation)
    │   ├── 📄 _layout.tsx             (Root layout with AuthGuard)
    │   ├── 📄 global.css              (Global Tailwind CSS)
    │   ├── 📄 result.tsx              (Disease/Drug result display)
    │   ├── 📄 symptoms.tsx            (Symptom checker screen)
    │   │
    │   ├── 📁 (auth)/                 (Auth route group)
    │   │   ├── 📄 _layout.tsx         (Auth stack navigation)
    │   │   ├── 📄 login.tsx           (Login screen)
    │   │   └── 📄 register.tsx        (Register screen)
    │   │
    │   └── 📁 (tabs)/                 (Main app route group)
    │       ├── 📄 _layout.tsx         (Bottom tab navigator)
    │       ├── 📄 index.tsx           (Home screen)
    │       ├── 📄 search.tsx          (Disease/Drug search screen)
    │       ├── 📄 chat.tsx            (AI Chat screen)
    │       └── 📄 profile.tsx         (User profile + logout)
    │
    ├── 📁 components/ui/              (Reusable UI components)
    │   ├── 📄 DisclaimerBanner.tsx    (Medical disclaimer - shown on every medical screen)
    │   ├── 📄 MedCard.tsx             (Universal medical info card)
    │   └── 📄 SearchBar.tsx           (Animated search with autocomplete)
    │
    ├── 📁 services/
    │   └── 📄 api.ts                  (Axios client + API endpoints + streaming chat)
    │
    ├── 📁 store/
    │   └── 📄 authStore.ts            (Zustand global auth state)
    │
    ├── 📁 hooks/
    │   └── 📄 useDebounce.ts          (Debounce hook for search)
    │
    └── 📁 assets/                     (Icons, images - placeholder)
```

---

## 🔧 What Each File Does

### Backend - Core Files

| File | Purpose | Status |
|------|---------|--------|
| `main.py` | FastAPI app entry point, startup/shutdown logic | ✅ Ready |
| `app/api/routes/auth.py` | Register & login endpoints | ✅ Ready |
| `app/api/routes/medical.py` | Disease search, drug lookup, symptom prediction, chat streaming | ✅ Ready |
| `app/core/config.py` | Load settings from `.env` | ✅ Ready |
| `app/core/database.py` | SQLAlchemy PostgreSQL connection | ✅ Ready |
| `app/core/security.py` | JWT + password hashing | ✅ Ready |
| `app/models/models.py` | Database tables (User, Disease, Medicine, etc.) | ✅ Ready |
| `app/ai/meditron_client.py` | Ollama 70B wrapper + streaming | ✅ Ready |
| `app/ai/rag_engine.py` | ChromaDB indexer + semantic search | ✅ Ready |
| `app/ai/ai_service.py` | AI orchestration (disease_info, predict, drug_info, chat) | ✅ Ready |

### Backend - Knowledge Base

| File | Purpose | Status |
|------|---------|--------|
| `medical_knowledge/diabetes.txt` | Type 2 diabetes full profile | ✅ Added |
| `medical_knowledge/hypertension.txt` | Hypertension full profile | ✅ Added |
| `medical_knowledge/hypothyroidism.txt` | Thyroid disease full profile | ✅ Added |
| `medical_knowledge/[MORE].txt` | ⚠️ TODO: Add 7+ more diseases | 🔲 Needed |

### Frontend - Navigation & Screens

| File | Purpose | Status |
|------|---------|--------|
| `app/_layout.tsx` | Root layout, auth guard, route protection | ✅ Ready |
| `app/(auth)/login.tsx` | Login form | ✅ Ready |
| `app/(auth)/register.tsx` | Registration form | ✅ Ready |
| `app/(tabs)/index.tsx` | Home dashboard | ✅ Ready |
| `app/(tabs)/search.tsx` | Disease/drug search | ✅ Ready |
| `app/(tabs)/chat.tsx` | AI conversation (streaming) | ✅ Ready |
| `app/(tabs)/profile.tsx` | User profile + logout | ✅ Ready |
| `app/result.tsx` | Disease/drug results display | ✅ Ready |
| `app/symptoms.tsx` | Symptom checker | ✅ Ready |

### Frontend - Components & Services

| File | Purpose | Status |
|------|---------|--------|
| `components/ui/DisclaimerBanner.tsx` | Disclaimer shown on every medical screen | ✅ Ready |
| `components/ui/MedCard.tsx` | Medical info card component | ✅ Ready |
| `components/ui/SearchBar.tsx` | Animated search with autocomplete | ✅ Ready |
| `services/api.ts` | Axios API client + fetch for streaming | ✅ Ready |
| `store/authStore.ts` | Zustand auth state management | ✅ Ready |
| `hooks/useDebounce.ts` | Debounce hook for search | ✅ Ready |

---

## 🎯 Quick Start Checklist

### Phase 1: Local Development (Hours 1-2)

- [ ] **Backend Setup**
  - [ ] Create Python venv: `python -m venv venv && venv\Scripts\activate`
  - [ ] Install deps: `pip install -r requirements.txt`
  - [ ] Install PostgreSQL → create `medai_db`
  - [ ] Install Redis
  - [ ] Install Ollama → `ollama pull meditron:7b`
  - [ ] Update `.env` with DB/Redis URLs
  - [ ] Start 3 terminals: backend, Ollama, Redis
  - [ ] Visit http://localhost:8000/docs → test endpoints

- [ ] **Frontend Setup**
  - [ ] Install Node.js
  - [ ] `cd frontend && npm install`
  - [ ] Find your IP: `ipconfig` (Windows) / `ifconfig` (Mac/Linux)
  - [ ] Update `services/api.ts` BASE_URL with your IP
  - [ ] `npx expo start`
  - [ ] Scan QR code with Expo Go on phone
  - [ ] Test all screens

### Phase 2: Knowledge Base (Hour 3)

- [ ] Add medical knowledge files to `medical_knowledge/`
- [ ] Rebuild RAG index (restart backend)
- [ ] Test disease searches return detailed results

### Phase 3: Deployment (Hours 4-5)

- [ ] Choose cloud provider (Railway,​ Render, AWS)
- [ ] Deploy backend with PostgreSQL + Redis
- [ ] Build frontend for app stores
- [ ] Submit to Google Play Store / Apple App Store
- [ ] Set up custom domain + SSL

---

## 🚀 Deployment Paths

### **Fastest (Railway)** - 30 minutes
```bash
1. Connect GitHub repo to Railway
2. Add PostgreSQL & Redis add-ons
3. Set .env variables
4. Deploy
# Result: Live API at railway-url.railway.app
```

### **Self-Hosted (AWS EC2)** - 2 hours
```bash
1. Launch EC2 instance
2. Install Python, PostgreSQL, Redis, Ollama
3. Clone + configure repo
4. Run with Gunicorn + Nginx
5. Set up SSL with Let's Encrypt
# Result: Full control, lowest cost if staying <$50/month
```

### **App Store (Android/iOS)** - 1 week
```bash
1. Build APK/IPA: eas build
2. Upload to Play Store / App Store
3. Wait for review (24-48 hours)
4. App goes live
# Cost: $25 (Android) + $99 (iOS)
```

---

## 📊 Current Status Summary

| Component | Status | Details |
|-----------|--------|---------|
| **Backend** | ✅ 100% Complete | All routes, models, AI services ready |
| **Frontend** | ✅ 100% Complete | All screens, components, navigation ready |
| **Database Models** | ✅ 100% Complete | 8 tables with relationships |
| **API Endpoints** | ✅ 100% Complete | Auth, disease, drug, symptom, chat |
| **AI Services** | ✅ 100% Complete | Meditron client, RAG, orchestration |
| **Medical Knowledge** | 🟡 30% Complete | 3/15+ diseases added |
| **Deployment Scripts** | 🟡 50% Complete | Manual guide provided (auto-deploy pending) |
| **Unit Tests** | 🔲 0% Complete | Placeholder directory exists |
| **Documentation** | ✅ 100% Complete | SETUP_GUIDE.md with all steps |

---

## 📞 Getting Help

### Issues with specific file?
Check the error message and look in:
- Backend errors → `app/` folder corresponding module
- Frontend errors → `app/` or `components/` folder
- API errors → `app/api/routes/` or `app/ai/`

### Quick debugging:
```bash
# Backend
curl http://localhost:8000/health

# Frontend - check network tab in Expo CLI
# Should show requests to http://YOUR_IP:8000/api

# Meditron
ollama list
# Should show: meditron (and version)

# PostgreSQL
psql -U postgres -d medai_db -c "\dt"
# Should show all tables
```

---

## 🎓 Learning Resources

- **FastAPI Tutorial:** https://fastapi.tiangolo.com/tutorial/
- **React Native Docs:** https://reactnative.dev/docs/getting-started
- **Expo Guide:** https://docs.expo.dev/
- **SQLAlchemy ORM:** https://docs.sqlalchemy.org/en/20/orm/quickstart.html

---

**Built with ❤️ for healthcare · MedAI MVP · Feb 2026**
