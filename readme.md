# Vinu Digital Task - USDT Transfer Monitoring System

A real-time blockchain monitoring system that tracks USDT (Tether) transfers on the Ethereum network and sends push notifications for large transactions.

## 🚀 Features

- **Real-time USDT Transfer Monitoring**: Listens to USDT contract transfers on Ethereum mainnet
- **Push Notifications**: Sends Firebase Cloud Messaging notifications for transfers over 100,000 USDT
- **WebSocket Integration**: Uses WebSocket connections for real-time blockchain data
- **Responsive UI**: Material-UI based frontend with modern design
- **Device Token Management**: Registers and manages FCM tokens for multiple devices
- **Transaction History**: Displays recent transfer notifications with transaction details

## 🛠️ Tech Stack

### Frontend
- **React.js** with TypeScript
- **Material-UI** component library
- **Firebase Cloud Messaging** for push notifications
- **Vite** for build tooling
- **Fetch API** for HTTP requests

### Backend
- **NestJS** framework with TypeScript
- **Ethers.js** for Ethereum blockchain interaction
- **Firebase Admin SDK** for push notifications
- **WebSocket Provider** for real-time blockchain data
- **Infura** as Ethereum node provider

### Infrastructure
- **Ethereum Mainnet** via Infura WebSocket
- **Firebase Cloud Messaging** for cross-platform notifications
- **USDT Contract**: `0xdAC17F958D2ee523a2206206994597C13D831ec7`

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **pnpm**
- **Firebase Project** with Cloud Messaging enabled
- **Infura Account** with WebSocket access

## � Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Cloud Messaging** in the project

### 2. Generate Service Account Key (Backend)
1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. **Rename** the file to `firebase_credential.json`
5. **Place** it in `backend/src/` folder

### 3. Get Firebase Configuration (Frontend)
1. In Firebase Console, go to **Project Settings** → **General**
2. Scroll down to **Your apps** section
3. Click **Add app** → **Web app** (if not already created)
4. Copy the Firebase configuration object

### 4. Update Configuration Files

#### Frontend Service Worker (`frontend/public/firebase-messaging-sw.js`)
Update the Firebase config object:
```javascript
const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_project.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id"
};
```

#### Frontend App (`frontend/src/firebase.ts`)
Update the Firebase config object:
```typescript
const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_project.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id"
};
```

## �🔧 Installation

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend Setup

```bash
cd backend
# Install pnpm if not already installed
npm install -g pnpm
pnpm install
pnpm start
```

The backend will run on `http://localhost:8000`


## 📡 API Endpoints

### Backend Endpoints

- `POST /register-device` - Register FCM token for notifications
  ```json
  {
    "token": "fcm_token_here"
  }
  ```


## 🏗️ Architecture

```
┌─────────────────┐    WebSocket    ┌─────────────────┐
│   Ethereum      │◄──────────────►│   Backend       │
│   Mainnet       │                │   (NestJS)      │
│   (Infura)      │                │                 │
└─────────────────┘                │  ┌────────────┐ │
                                  │  │EtherJsHost  │ │
                                  │  │Service      │ │
                                  │  └────────────┘ │
                                  │                 │
                                  │  ┌────────────┐ │
                                  │  │Firebase    │ │
                                  │  │Messaging  │ │
                                  │  └────────────┘ │
                                  └─────────────────┘
                                           │
                                           │ FCM
                                           ▼
                                  ┌─────────────────┐
                                  │   Frontend      │
                                  │   (React)       │
                                  │                 │
                                  │  ┌────────────┐ │
                                  │  │Notification │ │
                                  │  │Handler      │ │
                                  │  └────────────┘ │
                                  └─────────────────┘
```


⚠️ **Important**: This codebase contains hardcoded environment variables and private keys for demonstration purposes only. In production:

- Use environment variables managed by your CI/CD pipeline
- Store sensitive credentials in secure vaults
- Never commit private keys to version control
- Use Firebase service account keys with minimal required permissions

## 🌐 Browser Compatibility

### ✅ **Fully Supported**
- **Microsoft Edge**: Tested and working perfectly

### ⚠️ **Known Issues**
- **Brave Browser**: Firebase Cloud Messaging may not work due to aggressive privacy features

#### Brave Browser Troubleshooting:
**Issue**: Push notifications don't work despite granting permissions.

