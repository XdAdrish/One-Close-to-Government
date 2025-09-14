# One-close-step-to-government
A civic issue resolve platform

# 🏙️ Crowdsourced Civic Issue Reporting and Resolution System  

A mobile-first and web-based platform for **citizens to report civic issues** (like potholes, garbage, streetlights) in real-time, and for **municipal staff to manage, track, and resolve** these issues effectively.  

This project bridges the gap between citizens and government authorities by providing transparency, accountability, and real-time notifications.  

---

## ✨ Features  

### 👥 For Citizens  
- 📸 Report issues with **photo/video, GPS location, and description**  
- 🔔 Receive **real-time notifications** (Acknowledged → In-progress → Resolved)  
- 🌍 View live map of reported issues in the city  
- 📱 Cross-platform access via **Web + Flutter WebView App**  

### 🏢 For Admins / Departments  
- 🗺️ Interactive **dashboard** with filters (category, location, priority)  
- ⚡ Automated **AI-powered issue classification** using **YOLOv8**  
- 🏗️ Task assignment and status tracking  
- 📊 Analytics: Response times, heatmaps, and trend reports  

---

## 🛠️ Tech Stack  

### Frontend  
- **Website**: HTML, CSS, JavaScript  
- **Mobile App**: Flutter (WebView wrapper) + Dart + Java/Kotlin (Android Studio)  

### Backend  
- **Server**: Node.js + Express.js  
- **Database**: MongoDB (NoSQL)  
- **Authentication**: JWT / Clerk  
- **File Uploads**: Multer + fs.io  

### AI/ML  
- **YOLOv8** → Image classification (pothole, garbage, streetlight, etc.)  
- Automated routing to departments based on classification  

### Real-Time Communication  
- **Socket.io** (real-time notifications)  
- **Firebase Cloud Messaging (FCM)** (push notifications on mobile)  

---

## ⚙️ System Architecture  

```mermaid
flowchart TD
    A[Citizen - Web/Mobile App] -->|Report Issue| B[Node.js + Express Backend]
    B -->|Save Data| C[MongoDB Database]
    B -->|Upload Media| D[fs.io / Cloud Storage]
    B -->|Classify Image| E[YOLOv8 AI Model]
    E -->|Assign Dept| F[Municipal Dashboard]
    F -->|Update Status| B
    B -->|Notify| G[Socket.io / Firebase Notifications]
    G -->|Update Citizens| A

