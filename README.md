# CareNav AI 🩺  
AI-Powered Healthcare Navigation App

## Overview
CareNav AI is a friendly, AI-powered healthcare navigation app designed to help users understand **what their next step in the healthcare system should be**, based on symptoms they describe.

⚠️ **Important**:  
CareNav AI does **not diagnose medical conditions**.  
It provides **safe, rule-based guidance** to reduce confusion, panic, and delays in care.

The app is designed for **all age groups**, with special attention to **elderly-friendly UI, accessibility, and calm visual design**.

---

## Problem Statement
Many people don’t know:
- Which medical department to visit
- Whether their condition is urgent
- How to prepare before seeing a doctor

This leads to:
- Delayed treatment
- Overcrowded emergency rooms
- Anxiety and misinformation from unreliable sources

CareNav AI solves this by offering **clear, safe, and structured healthcare navigation**.

---

## Key Features

### 1. Symptom Input (Text + Voice)
- Users describe symptoms in natural language
- Optional **voice input** with animated waveform
- Multilingual support (English, Hindi, regional-ready)

---

### 2. Rule-Based Department Selection (Safety First)
Medical department is selected using **predefined rules**, not AI guessing:

| Symptoms | Department |
|--------|------------|
| Chest pain, breathlessness | Cardiology |
| Headache, dizziness | Neurology |
| Cough, sore throat | ENT / Pulmonology |
| Stomach pain, nausea | Gastroenterology |
| Fever, fatigue | General Medicine |
| Unclear symptoms | General Practitioner |

This ensures **accuracy, trust, and medical safety**.

---

### 3. AI-Powered Guidance (Gemini)
The AI is used **only** to:
- Classify urgency level
- Generate preparation checklists

AI output is structured:
```json
{
  "urgency": "Green / Yellow / Red",
  "department": "Medical Department",
  "checklist": []
}
