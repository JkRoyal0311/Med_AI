"""
MedAI - Medical Information System with Streamlit
Beautiful UI with gradients, animations, and all medical features
"""

import streamlit as st
import requests
import json
from typing import Optional, List
import time
import os

# Page Configuration
st.set_page_config(
    page_title="MedAI - Medical Information",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# API Configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000/api")

# Custom CSS for beautiful gradients and animations
st.markdown("""
<style>
    /* Main background gradient */
    .main {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    /* Header styling */
    .header-container {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        padding: 30px;
        border-radius: 15px;
        color: white;
        text-align: center;
        margin-bottom: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: fadeIn 0.8s ease-in;
    }
    
    .header-title {
        font-size: 3em;
        font-weight: bold;
        margin: 0;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .header-subtitle {
        font-size: 1.2em;
        margin-top: 10px;
        opacity: 0.95;
    }
    
    /* Card styling */
    .info-card {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        padding: 20px;
        border-radius: 12px;
        color: white;
        margin: 15px 0;
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        animation: slideIn 0.6s ease-out;
    }
    
    .info-card.disease {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .info-card.symptom {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        color: #333;
    }
    
    .info-card.drug {
        background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
    }
    
    .info-card.chat {
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        color: #333;
    }
    
    /* Section headers */
    .section-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        margin: 20px 0 10px 0;
        font-size: 1.3em;
        font-weight: bold;
    }
    
    /* Animations */
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }
    
    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    
    /* Button styling */
    .stButton > button {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: 8px !important;
        padding: 10px 30px !important;
        font-weight: bold !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important;
    }
    
    /* Input styling */
    .stTextInput > div > div > input,
    .stSelectbox > div > div > select,
    .stTextArea > div > div > textarea {
        border: 2px solid #667eea !important;
        border-radius: 8px !important;
        padding: 10px !important;
    }
    
    /* Warning and info boxes */
    .disclaimer-box {
        background: linear-gradient(135deg, #fee140 0%, #f5576c 100%);
        color: #333;
        padding: 20px;
        border-radius: 10px;
        border-left: 5px solid #f5576c;
        margin: 15px 0;
        font-weight: 500;
    }
    
    .success-box {
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
    }
    
    /* Loading animation */
    .loading {
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    /* Tabs styling */
    .stTabs > div > div > button {
        border-bottom: 3px solid transparent !important;
        transition: all 0.3s ease !important;
    }
    
    .stTabs > div > div > button[aria-selected="true"] {
        border-bottom-color: #667eea !important;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []
if 'current_user_symptoms' not in st.session_state:
    st.session_state.current_user_symptoms = []

# Header
st.markdown("""
<div class="header-container">
    <div class="header-title">🏥 MedAI</div>
    <div class="header-subtitle">AI-Powered Medical Information System</div>
    <p style="margin-top: 15px; font-size: 0.95em; opacity: 0.9;">
        Get instant medical information powered by Meditron 70B • Educational purposes only
    </p>
</div>
""", unsafe_allow_html=True)

# Disclaimer
st.markdown("""
<div class="disclaimer-box">
    ⚠️ <strong>IMPORTANT MEDICAL DISCLAIMER</strong><br>
    MedAI provides AI-generated health information for educational purposes only. 
    It is NOT a substitute for professional medical advice, diagnosis, or treatment.
    Always consult a qualified doctor or pharmacist before making any health decisions.
</div>
""", unsafe_allow_html=True)

# Sidebar Navigation
st.sidebar.markdown("### 🎯 Navigation")
page = st.sidebar.radio(
    "Select a feature:",
    ["🏠 Home", "🔍 Disease Lookup", "💊 Drug Info", "🩺 Symptom Checker", "🤖 AI Chat"],
    label_visibility="collapsed"
)

st.sidebar.markdown("---")
st.sidebar.markdown("""
### ℹ️ How to Use MedAI

1. **Disease Lookup**: Search for any disease to get complete information
2. **Drug Info**: Learn about medicines, side effects, and interactions
3. **Symptom Checker**: Enter symptoms to get possible conditions
4. **AI Chat**: Ask medical questions and get personalized responses

### 📱 Features
- Real-time AI responses
- Cached results for instant access
- Beautiful, easy-to-read format
- Medical information based on clinical data
""")

# Home Page
if page == "🏠 Home":
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div class="info-card">
            <h3 style="margin-top: 0; text-align: center;">🔍 Disease Lookup</h3>
            <p>Search for any disease and get comprehensive information including symptoms, medications, foods to eat/avoid, and lifestyle tips.</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="info-card drug">
            <h3 style="margin-top: 0; text-align: center;">💊 Drug Information</h3>
            <p>Look up any medicine to understand what it treats, how it works, side effects, and interactions with other drugs.</p>
        </div>
        """, unsafe_allow_html=True)
    
    col3, col4 = st.columns(2)
    
    with col3:
        st.markdown("""
        <div class="info-card symptom">
            <h3 style="margin-top: 0; text-align: center;">🩺 Symptom Checker</h3>
            <p>Enter your symptoms and get a list of possible conditions ranked by likelihood. Great for preliminary understanding.</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown("""
        <div class="info-card chat">
            <h3 style="margin-top: 0; text-align: center;">🤖 AI Chat</h3>
            <p>Ask medical questions in natural language and get detailed, context-aware answers powered by advanced AI.</p>
        </div>
        """, unsafe_allow_html=True)
    
    # Common Diseases
    st.markdown('<div class="section-header">📚 Common Diseases</div>', unsafe_allow_html=True)
    
    common_diseases = [
        "Type 2 Diabetes", "Hypertension", "Asthma",
        "Heart Disease", "Arthritis", "Anxiety Disorder",
        "Hypothyroidism", "Anemia", "Kidney Disease"
    ]
    
    cols = st.columns(3)
    for idx, disease in enumerate(common_diseases):
        with cols[idx % 3]:
            if st.button(f"📖 {disease}", key=f"home_{disease}", use_container_width=True):
                st.session_state['search_disease'] = disease
                st.switch_page("pages/disease_lookup.py")

# Disease Lookup Page
elif page == "🔍 Disease Lookup":
    st.markdown('<div class="section-header">🔍 Disease Information Lookup</div>', unsafe_allow_html=True)
    
    disease_name = st.text_input(
        "Enter a disease name:",
        placeholder="e.g., Type 2 Diabetes, Hypertension, Asthma...",
        help="Type any disease name to get comprehensive information"
    )
    
    if st.button("🔍 Search Disease", use_container_width=True):
        if disease_name.strip():
            with st.spinner("🔄 Fetching disease information..."):
                try:
                    response = requests.get(
                        f"{BACKEND_URL}/medical/disease",
                        params={"name": disease_name},
                        timeout=45
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        
                        st.markdown("""
                        <div class="info-card disease">
                            <h2 style="margin-top: 0; color: white;">✅ Results for: """ + disease_name + """</h2>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        # Display response
                        if isinstance(data, dict) and 'response' in data:
                            st.markdown(data['response'])
                        elif isinstance(data, str):
                            st.markdown(data)
                        else:
                            st.json(data)
                        
                        st.success("✅ Information retrieved successfully!")
                    else:
                        st.error(f"❌ Error: {response.status_code} - {response.text}")
                except requests.exceptions.Timeout:
                    st.error("⏱️ Request timeout. The AI is processing a large amount of data. Please try again.")
                except Exception as e:
                    st.error(f"❌ Error: {str(e)}")
        else:
            st.warning("⚠️ Please enter a disease name")

# Drug Info Page
elif page == "💊 Drug Info":
    st.markdown('<div class="section-header">💊 Medicine Information Lookup</div>', unsafe_allow_html=True)
    
    drug_name = st.text_input(
        "Enter a medicine name:",
        placeholder="e.g., Metformin, Aspirin, Insulin...",
        help="Type any medicine name to get detailed information"
    )
    
    if st.button("🔍 Search Medicine", use_container_width=True):
        if drug_name.strip():
            with st.spinner("🔄 Fetching medicine information..."):
                try:
                    response = requests.get(
                        f"{BACKEND_URL}/medical/drug",
                        params={"name": drug_name},
                        timeout=45
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        
                        st.markdown("""
                        <div class="info-card drug">
                            <h2 style="margin-top: 0; color: white;">✅ Results for: """ + drug_name + """</h2>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        if isinstance(data, dict) and 'response' in data:
                            st.markdown(data['response'])
                        elif isinstance(data, str):
                            st.markdown(data)
                        else:
                            st.json(data)
                        
                        st.success("✅ Information retrieved successfully!")
                    else:
                        st.error(f"❌ Error: {response.status_code}")
                except requests.exceptions.Timeout:
                    st.error("⏱️ Request timeout. Please try again.")
                except Exception as e:
                    st.error(f"❌ Error: {str(e)}")
        else:
            st.warning("⚠️ Please enter a medicine name")

# Symptom Checker Page
elif page == "🩺 Symptom Checker":
    st.markdown('<div class="section-header">🩺 Symptom to Disease Predictor</div>', unsafe_allow_html=True)
    
    st.write("Select or type symptoms you're experiencing:")
    
    common_symptoms = [
        "Fever", "Cough", "Fatigue", "Headache", "Chest pain",
        "Shortness of breath", "Nausea", "Vomiting", "Diarrhea",
        "Joint pain", "Rash", "Dizziness", "Frequent urination",
        "Excessive thirst", "Weight loss", "Anxiety", "Insomnia"
    ]
    
    # Symptom selection
    col1, col2 = st.columns([3, 1])
    with col1:
        selected_symptoms = st.multiselect(
            "Common symptoms:",
            common_symptoms,
            help="Click to select symptoms"
        )
    
    # Custom symptom input
    custom_symptom = st.text_input(
        "Or type a custom symptom:",
        placeholder="e.g., 'blurred vision', 'numbness in fingers'"
    )
    
    # Add custom symptom to list
    all_symptoms = selected_symptoms.copy()
    if custom_symptom.strip():
        all_symptoms.append(custom_symptom.strip())
    
    if st.button("🔍 Predict Diseases", use_container_width=True):
        if all_symptoms:
            with st.spinner("🔄 Analyzing symptoms..."):
                try:
                    response = requests.post(
                        f"{BACKEND_URL}/medical/symptoms/predict",
                        json={"symptoms": all_symptoms},
                        timeout=45
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        
                        st.markdown("""
                        <div class="info-card symptom">
                            <h2 style="margin-top: 0; color: #333;">📊 Symptom Analysis Results</h2>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        st.write(f"**Your symptoms:** {', '.join(all_symptoms)}")
                        
                        if isinstance(data, dict) and 'response' in data:
                            st.markdown(data['response'])
                        elif isinstance(data, str):
                            st.markdown(data)
                        else:
                            st.json(data)
                        
                        st.success("✅ Analysis complete!")
                    else:
                        st.error(f"❌ Error: {response.status_code}")
                except Exception as e:
                    st.error(f"❌ Error: {str(e)}")
        else:
            st.warning("⚠️ Please select or enter at least one symptom")

# AI Chat Page
elif page == "🤖 AI Chat":
    st.markdown('<div class="section-header">🤖 Medical AI Assistant</div>', unsafe_allow_html=True)
    
    # Display chat history
    for message in st.session_state.chat_history:
        if message["role"] == "user":
            st.markdown(f"""
            <div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 12px 15px; border-radius: 10px; 
                        margin: 10px 0; margin-left: 20px; text-align: right;">
                👤 {message['content']}
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div style="background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%); 
                        color: white; padding: 12px 15px; border-radius: 10px; 
                        margin: 10px 0; margin-right: 20px;">
                🤖 {message['content']}
            </div>
            """, unsafe_allow_html=True)
    
    # Chat input
    user_message = st.text_area(
        "Ask a medical question:",
        placeholder="e.g., 'What are the side effects of Metformin?', 'How to manage diabetes naturally?'",
        height=100
    )
    
    if st.button("🚀 Send Message", use_container_width=True):
        if user_message.strip():
            # Add user message to history
            st.session_state.chat_history.append({"role": "user", "content": user_message})
            
            with st.spinner("🤖 AI is thinking..."):
                try:
                    response = requests.post(
                        f"{BACKEND_URL}/medical/chat/stream",
                        json={
                            "message": user_message,
                            "history": st.session_state.chat_history[:-1],
                            "user_conditions": [],
                            "pregnancy": False
                        },
                        timeout=60,
                        stream=True
                    )
                    
                    if response.status_code == 200:
                        # Collect streaming response
                        full_response = ""
                        for line in response.iter_lines():
                            if line:
                                try:
                                    if line.startswith(b"data: "):
                                        chunk = line[6:].decode('utf-8')
                                        if chunk != "[DONE]":
                                            full_response += chunk
                                except:
                                    pass
                        
                        st.session_state.chat_history.append({"role": "assistant", "content": full_response})
                        st.rerun()
                    else:
                        st.error(f"❌ Error: {response.status_code}")
                except Exception as e:
                    st.error(f"❌ Error: {str(e)}")
        else:
            st.warning("⚠️ Please enter a message")
    
    # Clear history button
    if st.button("🗑️ Clear Chat History", use_container_width=True):
        st.session_state.chat_history = []
        st.rerun()

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666; padding: 20px; margin-top: 30px;">
    <p>🏥 <strong>MedAI</strong> - Powered by Meditron 70B | Educational Information Only</p>
    <p style="font-size: 0.9em;">For emergency medical situations, please call emergency services immediately.</p>
    <p style="font-size: 0.85em; opacity: 0.7;">© 2024 MedAI. All rights reserved.</p>
</div>
""", unsafe_allow_html=True)
