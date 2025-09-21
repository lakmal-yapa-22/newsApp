# 📰 NewsApp

A modern mobile news application built with **React Native** + **Expo Router**.  
Users can read, search, like, and comment on news articles. Admin users can also publish, edit, and delete articles with multi-language support.

[![Download APK](https://img.shields.io/badge/Download-APK-blue?style=for-the-badge&logo=android)](https://drive.google.com/file/d/1TcYrKnJAALpIN3CAnuPL6CNhqT1-v8bD/view?usp=drive_link)
[![Watch Demo](https://img.shields.io/badge/Watch-Demo-red?style=for-the-badge&logo=youtube)](https://youtu.be/mNsYBq-VdRE?si=K5g60xYnBTMmxqfq)

---

## ✨ Features

### 🔐 **User Authentication**
- Secure login & logout system
- User profile management
- Role-based access control (Admin/User)

### 📰 **News Management**
- Browse all published articles
- Real-time news feed updates
- Article categorization and tagging
- View count tracking for popularity

### 🔍 **Search & Discovery**
- Advanced search functionality
- Filter by title, author, or tags
- Quick search suggestions
- Category-based browsing

### 💬 **Interactive Features**
- ❤️ Like articles and see engagement metrics
- 💬 Comment on articles with threaded discussions
- ✏️ Edit and delete your own comments
- 👀 Track article views and popularity

### 🛠 **Content Creation (Admin/Authors)**
- ✏️ Create new articles with rich text editor
- 📝 Edit existing articles
- 🗑️ Delete articles with proper permissions
- 📊 View article analytics

### 🌍 **Multi-Language Support**
- English (EN)
- Sinhala (SI) 
- Tamil (TA)
- Easy language switching

### 📱 **User Experience**
- Clean and responsive UI/UX
- Dark/Light theme support
- Smooth navigation with Expo Router
- Optimized for both Android and iOS

---

## 🛠 Tech Stack

| **Frontend** | **Backend & Database** | **Tools & Services** |
|-------------|----------------------|---------------------|
| React Native | Firebase Auth | Expo SDK |
| Expo Router | Firestore Database | EAS Build |
| NativeWind (Tailwind) | Firebase Storage | Expo CLI |
| Lucide React Native | | Git & GitHub |

---

## ⚙️ Installation & Setup

### Prerequisites
Make sure you have the following installed:
- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0 or **Yarn**
- **[Expo CLI](https://docs.expo.dev/get-started/installation/)**
- **Android Studio** (for Android development) or **Xcode** (for iOS)
- **Git** for version control

### 🚀 Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/lakmal-yapa-22/newsApp.git
cd newsApp
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
# Create a .env file in the root directory
cp .env.example .env

# Add your Firebase configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

4. **Start the development server**
```bash
npx expo start
```

5. **Run on your preferred platform**
```bash
# Android
npx expo run:android

# iOS
npx expo run:ios

# Web
npx expo start --web
```

---

## 📱 Download & Test

### 🎥 **Demo Video**
Watch the complete app walkthrough and features demonstration:

**[🎬 Watch NewsApp Demo on YouTube](https://youtu.be/mNsYBq-VdRE?si=K5g60xYnBTMmxqfq)**

### 📦 **Pre-built APK**
You can directly download and install the latest APK build:

**[📥 Download NewsApp APK](https://drive.google.com/file/d/1TcYrKnJAALpIN3CAnuPL6CNhqT1-v8bD/view?usp=drive_link)**

*Compatible with Android 6.0 (API level 23) and above*

---

## 🏗️ Project Structure

```
newsApp/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── common/           # Common components
├── constants/            # App constants
├── hooks/               # Custom hooks
├── lib/                 # Utilities & configurations
│   └── firebase.ts      # Firebase setup
├── types/               # TypeScript type definitions
└── assets/             # Images, fonts, etc.
```

---

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database
3. Add your Firebase config to `.env` file
4. Set up Firestore security rules for proper data access

### Building for Production
```bash
# Build APK
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for both platforms
eas build --platform all
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Lakmal Yapa**
- 🔗 GitHub: [@lakmal-yapa-22](https://github.com/lakmal-yapa-22)
- 📧 Email: [your.email@example.com](mailto:your.email@example.com)
- 💼 LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- **React Native Community** for the amazing framework
- **Expo Team** for the excellent developer experience
- **Firebase** for reliable backend services
- **Lucide** for beautiful icons
- **NativeWind** for Tailwind CSS in React Native

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/lakmal-yapa-22/newsApp)
![GitHub last commit](https://img.shields.io/github/last-commit/lakmal-yapa-22/newsApp)
![GitHub issues](https://img.shields.io/github/issues/lakmal-yapa-22/newsApp)
![GitHub pull requests](https://img.shields.io/github/issues-pr/lakmal-yapa-22/newsApp)

---

<div align="center">

**⭐ Star this repository if you found it helpful! ⭐**

*Built with ❤️ using React Native & Expo*
