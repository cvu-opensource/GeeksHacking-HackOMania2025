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

## **Future Enhancements**  
🚀 **Potential future improvements include:**  
- 🔎 **Thread and comment recommendations** to enhance forum engagement  
- 📈 **Optimized recommendation algorithms** refined via user feedback  
- 🏆 **Daily challenges & LeetCode-style posts** to encourage skill-building  

## **Get Involved**  
Want to contribute or learn more? Stay tuned for updates!  