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

## 🔧 Installation

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

