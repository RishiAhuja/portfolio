![Git Repo Cover](https://github.com/user-attachments/assets/65e4a18b-4369-4ab2-be26-6b3e0afdb1d2)


# Level_SuperMind
# SoulBuddy - AI-Powered Spiritual Guide

**SoulBuddy** is an AI-driven platform designed to provide personalized spiritual guidance through the power of astrology and numerology. The system generates actionable insights, recommendations, and rituals tailored to the user's birth details. Additionally, it offers an interactive chatbot for real-time spiritual advice, helping users align their daily lives with ancient wisdom.

---

## **Project Overview**
### **Objective**:
To bridge the gap between ancient spiritual practices and modern technology by providing an accessible, personalized, and interactive platform for spiritual growth and self-discovery.

### **Core Features**:
1. **User Input**:
   - Collect essential details:
     - Name
     - Date of Birth
     - Time of Birth
     - Gender
     - State
     - City

2. **Kundali & Horoscope Generation**:
   - Generate a comprehensive birth chart (Kundali) covering all 12 houses.
   - Provide insights on key aspects of life:
     - **Career**
     - **Relationships**
     - **Personal growth**
     - **Family**
     - **Social connections**
   - Offer daily and monthly horoscope predictions.

3. **AI-Driven Recommendations**:
   - Suggest personalized gemstones based on astrological insights.
   - Recommend rituals (Poojas) with detailed explanations of their significance and benefits.
   - Provide actionable "Do’s and Don’ts" based on astrological insights.

4. **Spiritual Content Delivery**:
   - Meditation and workout suggestions tailored to user needs.
   - Custom sleep content aligned with astrological recommendations.

5. **Interactive Chatbot**:
   - Provide spiritual advice in natural language.
   - Explain astrological predictions and recommendations clearly.
   - Answer questions related to spiritual practices and astrology.

---

## **Getting Started**
This section will guide you through setting up the SoulBuddy project on your local machine.

### **Prerequisites**:
Ensure the following tools are installed:
- **Node.js** (v18+)
- **Python** (v3.9+ for any AI/ML backend components)
- **MongoDB** (for database storage)
- **Git**


## **Project Architecture**

### **Frontend**:
- Built with **React.js** for an interactive user experience.
- Features:
  - Form for user input (Name, DOB, Time, Gender, Location).
  - Dynamic horoscope and Kundali display.
  - Chatbot interface for spiritual advice.

### **Backend**:
- Built with **Node.js** and **Express.js**.
- Features:
  - API for generating Kundalis using astrological libraries.
  - Endpoints for recommendations and daily horoscopes.
  - Integration with AI APIs for chatbot interactions.

### **Database**:
- **MongoDB** for storing user data, birth details, generated Kundalis, and recommendations.

### **AI Integration**:
- Uses AI/ML models for:
  - Generating recommendations (e.g., gemstones, rituals).
  - Tailoring meditation and sleep content.
  - Enabling natural language chatbot interaction.

---

## **Key Features in Detail**

### **1. Kundali & Horoscope Generation**:
- A **birth chart (Kundali)** is generated using the user's birth details, leveraging astrological libraries.
- Each of the 12 houses is analyzed to provide insights into various life aspects:
  - **Career**: Suitable fields and opportunities.
  - **Relationships**: Compatibility and improvements.
  - **Personal Growth**: Areas of focus and potential.
  - **Family**: Dynamics and support systems.
  - **Social Connections**: Friendships and networks.

### **2. AI-Driven Recommendations**:
- **Gemstones**: Suggestions are based on planetary positions and their influence.
- **Poojas**: Custom rituals with detailed benefits and methods.
- **Do’s and Don’ts**: Tailored advice to enhance positivity and avoid negative outcomes.

### **3. Spiritual Content Delivery**:
- **Meditation Suggestions**:
  - Designed to align with astrological periods (e.g., full moon).
  - Guided meditations for stress relief or focus.
- **Workout Plans**:
  - Simple exercises aligned with zodiac recommendations.
- **Sleep Content**:
  - Audio/visual suggestions for relaxation.

### **4. Chatbot Interaction**:
- Users can ask questions like:
  - "What does my horoscope say about today?"
  - "Which gemstone is suitable for me?"
  - "How should I perform the recommended Pooja?"
- The chatbot responds with concise and actionable advice, leveraging AI models for natural language understanding.

---

## **Future Scope**
1. **Multilingual Support**:
   - Expand chatbot and content delivery to support multiple languages.
2. **Advanced Numerology**:
   - Incorporate detailed numerological insights based on name and birth numbers.
3. **Integration with Wearables**:
   - Use smartwatch sensors to tailor meditation and sleep content.
4. **Community Features**:
   - Allow users to share insights and experiences.
5. **Gamification**:
   - Reward users for following spiritual practices and meditations.

---

## **Contributing**
We welcome contributions! To get started:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push:
   ```bash
   git commit -m "Add feature description"
   git push origin feature-name
   ```
4. Submit a pull request.

---


