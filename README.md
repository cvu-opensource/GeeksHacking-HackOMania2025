# **GeekedIn**  
### **Connecting Geeks, Fostering Collaboration**  

## **Overview**  
GeekedIn is a platform designed to help geeks connect based on their interests, enabling collaboration, in-person interactions, and event discovery. It goes beyond simple networking by modeling deep relationships between people, events, and products, powered by a custom recommendation algorithm that leverages similarity search.  

## **Key Features**  
✅ **Dynamic UI** – Built with TypeScript and deployed on Node.js, featuring four interactive pages:  
- 🏠 **Main Page** – Discover new connections and trending topics  
- 📅 **Events** – Find local meetups and tech gatherings  
- 💬 **Forums** – Engage in discussions and share ideas  
- 👤 **Profile** – Customize and manage your personal geek profile  

✅ **Graph-Based Backend** – Neo4j serves as the core database, storing:  
- 👥 **Users** – Modeled as nodes with interests and profiles  
- 🎟️ **Events** – Nodes linked to users and interest categories  
- 🔗 **Relationships** – Mapped between users, events, and shared interests  

✅ **Automated Event Updates** – EventManager service syncs with **Eventbrite** and **EventSize** daily to update our event database while maintaining performance efficiency.  

✅ **AI-Powered Recommendations** – A Milvus Vector DB stores **latent representations** of users and events, enabling **highly relevant recommendations** based on shared interests and preferences.

## **Architecture**
GeekedIn follows a **microservices-based** architecture with three core services:
1. **Frontend (UI Service)** – TypeScript, Node.js, interactive map feature
2. **Backend Service** – FastAPI with Neo4j for storing and managing relationships
3. **Recommendation Engine** – Milvus for similarity search-based recommendations

![Architecture](static/Architecture_overview.png "Architecture")

## **Deployment Instructions**
To set up and run GeekedIn, follow these steps:

### **1. Clone the Repository**
```bash
git clone https://github.com/gerardlke/Hackomania2025.git
cd Hackomania2025
```

### **2. Backend Setup**
Ensure you have Python installed, then:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
source venv/bin/activate  # On macOS/Linux
pip install -r requirements.txt
backend.bat  # Start the FastAPI backend
```

### **3. Frontend Setup**
Ensure Node.js and npm are installed, then:
```bash
cd frontend
npm install
npm run  # Starts the frontend service
```

### **4. Recommendation Service Setup**
Ensure Milvus is running, then:
```bash
cd vector_db
python MainControllerEventsDB.py  # Start the FastAPI recommendation engine
```

---

## **UI Showcase**  
### **Homepage**  
![Homepage](static/Homepage.jpg "Homepage")  
![Homepage](static/Signup.jpg "Homepage") 

### **Main Page**  
![Homepage](static/Geekstagram.jpg "Main Page") 
![Homepage](static/COTD.jpg "Main Page")  
![Homepage](static/Connect.jpg "Main Page")  

### **Events Page**  
![Events](static/events.jpg "Events")  

### **Forums Page**  
![Forums](static/forums.jpg "Forums")  

### **Profile Page**  
![Profile](static/profile.jpg "Profile")   

---

## **Future Enhancements**  
🚀 **Potential future improvements include:**  
- 🔎 **Thread and comment recommendations** to enhance forum engagement  
- 📈 **Optimized recommendation algorithms** refined via user feedback  
- 🏆 **Daily challenges & LeetCode-style posts** to encourage skill-building  