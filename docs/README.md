# KisaanMithraa - Agricultural Cooperative Platform

## Overview

KisaanMithraa is a mobile application designed to connect farmers with agricultural cooperatives in India. The app facilitates the formation and management of farming cooperatives, resource pooling, and creates a digital marketplace for agricultural resources.

This platform addresses several UN Sustainable Development Goals:
- **SDG 1**: No Poverty
- **SDG 2**: Zero Hunger
- **SDG 8**: Decent Work and Economic Growth
- **SDG 9**: Industry, Innovation, and Infrastructure
- **SDG 10**: Reducing Inequality
- **SDG 11**: Sustainable Cities and Communities

## Features

- **Cooperative Management**: Create and manage agricultural cooperatives
- **Resource Pooling**: Share equipment, seeds, and other farming resources
- **Marketplace**: Buy, sell, or rent agricultural resources
- **Mandi Prices**: Real-time agricultural market prices with watchlist functionality
- **AI-Powered Chatbot**: Get farming advice and assistance through natural conversation
- **Location-based Services**: Find nearby cooperatives and farmers
- **Notifications**: Stay updated on coerative activities and marketplace listings
- **Offline Support**: Access critical information even with limited connectivity


## Technology Stack

KisaanMithraa is built using Flutter for cross-platform mobile development and Firebase for backend services.

## Screenshots

### Home & Dashboard
<p float="left">
  <img src="assets/screenshots/home/home1.png" width="23%" alt="Home Dashboard" />
  <img src="assets/screenshots/home/home2.png" width="23%" alt="Home Watchlist" />
  <img src="assets/screenshots/home/home3.png" width="23%" alt="Price Details" />
  <img src="assets/screenshots/home/onboard1.png" width="23%" alt="Onboarding Experience" />
</p>

<p float="left">
  <img src="assets/screenshots/home/profile1.png" width="23%" alt="User Profile" />
  <img src="assets/screenshots/home/splash.png" width="23%" alt="App Launch Screen" />
</p>

### Cooperative Management
<p float="left">
  <img src="assets/screenshots/cooperative/coop1.png" width="23%" alt="Cooperative Dashboard" />
  <img src="assets/screenshots/cooperative/coop2.png" width="23%" alt="Cooperative Details" />
  <img src="assets/screenshots/cooperative/coop3.png" width="23%" alt="Member Management" />
  <img src="assets/screenshots/cooperative/coop4.png" width="23%" alt="Resource Sharing" />
</p>

<p float="left">
  <img src="assets/screenshots/cooperative/coop5.png" width="23%" alt="Cooperative Creation" />
  <img src="assets/screenshots/cooperative/coop6.png" width="23%" alt="Task Management" />
  <img src="assets/screenshots/cooperative/coop7.png" width="23%" alt="Performance Analytics" />
</p>

### Mandi Price System
<p float="left">
  <img src="assets/screenshots/mandi/mandi1.png" width="23%" alt="Market Price Listings" />
  <img src="assets/screenshots/mandi/watchlist.png" width="23%" alt="Watchlist View" />
  <img src="assets/screenshots/mandi/watchlist2.png" width="23%" alt="Watchlist Management" />
</p>

### AI Chatbot & Assistance
<p float="left">
  <img src="assets/screenshots/chatbot/chatbot1.png" width="23%" alt="AI Farming Assistant" />
</p>

### Podcast & Knowledge Base
<p float="left">
  <img src="assets/screenshots/podcasts/podcast1.png" width="23%" alt="Agricultural Knowledge Library" />
  <img src="assets/screenshots/podcasts/podcast2.png" width="23%" alt="Audio Content Player" />
  <img src="assets/screenshots/podcasts/podcast3.png" width="23%" alt="Podcast Information" />
</p>

### Developer Tools
<p float="left">
  <img src="assets/screenshots/debug/debug1.png" width="23%" alt="Development Interface" />
  <img src="assets/screenshots/debug/debug2.png" width="23%" alt="Testing Tools" />
</p>
### Architecture Overview

```mermaid
flowchart TB
    subgraph "App Architecture"
        direction TB
        
        subgraph "Flutter UI Layer"
            UI[Flutter UI Components]
            UI --> MaterialDesign[Material Design]
            UI --> CustomWidgets[Custom Widgets]
            UI --> Screens[App Screens]
        end
        
        subgraph "State Management"
            GetX[GetX Framework]
            GetX --> Controllers[Controllers]
            GetX --> Routes[Route Management]
            GetX --> DependencyInjection[Dependency Injection]
        end
        
        subgraph "Service Layer"
            Services[Services]
            Services --> AuthService[Auth Service]
            Services --> DatabaseService[Database Service]
            Services --> StorageService[Storage Service]
            Services --> LocationService[Location Service]
            Services --> NotificationService[Notification Service]
            Services --> SpeechService[Speech Recognition]
        end
        
        UI --> GetX
        GetX --> Services
        
        subgraph "External Services"
            direction TB
            Firebase[Firebase]
            DataGovAPI[Data.gov.in API]
            OpenAI[OpenAI API]
            GoogleMaps[Google Maps Platform]
        end
        
        Services --> Firebase
        Services --> DataGovAPI
        Services --> OpenAI
        Services --> GoogleMaps
        
        subgraph "Offline Capabilities"
            FirestoreCache[Firestore Offline Cache]
            LocalStorage[Local Storage]
            SharedPrefs[Shared Preferences]
        end
        
        Services ---> LocalStorage
        Services ---> SharedPrefs
    end
```

### Features Architecture

```mermaid
flowchart TB
    subgraph "Core Features"
        subgraph "User Management"
            UserAuth[Authentication]
            UserProfile[Profile Management]
            Localization[Multilingual Support]
        end
        
        subgraph "Cooperative Management"
            CoopCreation[Cooperative Creation]
            CoopManagement[Management Dashboard]
            ResourceSharing[Resource Sharing]
            MemberManagement[Member Management]
        end
        
        subgraph "Marketplace"
            ResourceListings[Resource Listings]
            BuySellFlow[Buy/Sell Flow]
            RentalSystem[Equipment Rental]
            TransactionHistory[Transaction Records]
        end
    end
    
    subgraph "Advanced Features"
        subgraph "Mandi Price System"
            PriceData[Price Data Fetching]
            PriceDisplay[UI Representation]
            Watchlist[Watchlist Management]
            PriceNotifications[Price Alerts]
            CacheSystem[Price Caching]
        end
        
        subgraph "AI Chatbot"
            SpeechRecognition[Voice Recognition]
            TextProcessing[Text Analysis]
            AIIntegration[OpenAI Integration]
            ChatHistory[Conversation History]
            FarmingDatabase[Knowledge Base]
        end
        
        subgraph "Location Services"
            MapsIntegration[Maps Integration]
            GeoLocation[Geolocation Services]
            ProximitySearch[Proximity Search]
            RoutePlanning[Route Planning]
        end
    end
```

### Data Flow Architecture

```mermaid
flowchart LR
    subgraph "Mandi Price System"
        direction TB
        PriceController[MandiPriceController]
        PriceRepository[MandiPriceRepository]
        PriceModels[CropPriceModel]
        PriceWidgets[Price UI Components]
        
        User --> PriceWidgets
        PriceWidgets --> PriceController
        PriceController --> PriceRepository
        PriceRepository -- API Request --> DataGovAPI[Data.gov.in API]
        DataGovAPI -- JSON Response --> PriceRepository
        PriceRepository -- Parse --> PriceModels
        PriceRepository -- Cache --> LocalStorage
        LocalStorage -- Cached Data --> PriceRepository
        PriceModels --> PriceController
        PriceController --> PriceWidgets
    end
    
    subgraph "AI Chatbot System"
        direction TB
        ChatController[ChatbotController]
        SpeechService[SpeechService]
        OpenAIService[OpenAIService]
        MessageModels[ChatMessage Model]
        ChatWidgets[Chat UI Components]
        
        User -- Speech Input --> SpeechService
        User -- Text Input --> ChatWidgets
        ChatWidgets --> ChatController
        SpeechService -- Transcribed Text --> ChatController
        ChatController -- Manages --> MessageModels
        ChatController -- Request --> OpenAIService
        OpenAIService -- API Request --> OpenAI[OpenAI API]
        OpenAI -- Response --> OpenAIService
        OpenAIService --> ChatController
        ChatController --> ChatWidgets
    end
```

### Debugging & Development Tools

KisaanMithraa includes a comprehensive suite of debugging and development tools to facilitate testing and quality assurance:

- **Test Data Generation**: Ability to generate random users with realistic Indian farmer profiles
- **Cooperative Simulation**: Create test cooperatives with specified names, descriptions, and member counts
- **Location Testing**: Interactive map integration for selecting precise geographical coordinates
- **Media Content Management**: Upload and test podcast content with proper metadata
- **File Upload Simulation**: Test audio and image file uploads with size validation
- **Geographic Distribution**: Quick-access buttons to test various regions across India
- **Location Search**: Geocoding integration to find and test specific locations
- **Clear Debug Data**: Option to purge all test-generated data from the database

These tools are carefully isolated from production code and provide developers with a sandbox environment to test new features, verify data flows, and ensure the application functions correctly across India's diverse geographic and linguistic landscape.

### Debugging Architecture

```mermaid
flowchart TB
    subgraph "Debugging System"
        direction TB
        
        subgraph "Data Generation"
            UserGenerator[Random User Generator]
            CooperativeGenerator[Cooperative Generator]
            ContentGenerator[Podcast Content Generator]
            LocationSelector[Geographic Location Selector]
        end
        
        subgraph "Test Controls"
            GenerationControls[Generation Controls]
            FileUploaders[File Upload Simulators]
            DataValidator[Input Validator]
            DataCleaner[Debug Data Cleaner]
        end
        
        subgraph "Visual Tools"
            MapInterface[Interactive Map Interface]
            SearchInterface[Location Search]
            ProgressIndicators[Operation Progress Tracking]
            WarningBanners[Safety Warning System]
        end
        
        UserGenerator --> GenerationControls
        CooperativeGenerator --> GenerationControls
        ContentGenerator --> GenerationControls
        
        GenerationControls --> DataValidator
        FileUploaders --> DataValidator
        MapInterface --> LocationSelector
        SearchInterface --> LocationSelector
        
        DataValidator --> Firebase
        DataCleaner --> Firebase
        
        subgraph "Integration Points"
            Firebase[Firebase Database]
            Storage[Cloud Storage]
            Auth[Authentication]
        end
        
        ContentGenerator --> Storage
        UserGenerator --> Auth
        CooperativeGenerator --> Firebase
    end

```

## Key Technologies

- **Flutter**: Cross-platform UI framework for building native interfaces
- **Firebase Authentication**: Secure user authentication system
- **Cloud Firestore**: NoSQL database for storing application data
- **Firebase Storage**: Cloud storage for images and other assets
- **Firebase Cloud Messaging**: Push notification service
- **Data.gov.in API**: Real-time agricultural market prices
- **Gemini API**: AI-powered farming assistance chatbot
- **Google Maps Platform**: Location services and mapping
- **Speech-to-Text**: Voice recognition for natural conversation
- **GetX**: State management and dependency injection

## Getting Started

### Prerequisites
- Flutter SDK (version 3.10.0 or higher)
- Dart (version 3.0.0 or higher)
- Firebase project with Firestore database
- Google Maps API key
- OpenAI API key
- Data.gov.in API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RishiAhuja/kisaanmithraa.git
cd kisaanmithraa
```

2. Install dependencies:
```bash
flutter pub get
```

3. Configure environment variables:
   - Create a .env file in the project root
   - Add the following keys:
     ```
     DATA_GOV_API_KEY=your_data_gov_api_key
     GEMINI_API_KEY=your_gemini_api_key
     MAPS_API_KEY=your_google_maps_api_key
     ```

4. Configure Firebase:
   - Create a new Firebase project
   - Add an Android and iOS app to your Firebase project
   - Download the configuration files (google-services.json for Android, GoogleService-Info.plist for iOS)
   - Place these files in the appropriate directories

5. Run the app:
```bash
flutter run
```

## Technical Implementation Highlights

### Mandi Price Module
- Real-time agricultural market price data from Data.gov.in API
- Efficient caching system for offline access and reduced API calls
- Watchlist functionality for farmers to track specific crops
- Detailed price analytics with min/max/modal price comparisons
- Location-based price filtering

### AI-Powered Chatbot
- Natural language processing using OpenAI's API
- Voice recognition for hands-free operation
- Contextual awareness to maintain conversation flow
- Farming-specific knowledge base for targeted assistance
- Multilingual support for regional language conversations

### Performance Optimizations
- Aggressive caching for offline functionality
- Lazy loading of components for faster startup
- Image optimization for reduced data usage
- Background data synchronization
- Battery-efficient location services

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Social Impact

KisaanMithraa aims to empower farmers in India by:
- Facilitating cooperative formation to increase bargaining power
- Reducing equipment costs through resource sharing
- Improving access to markets and fair pricing
- Providing AI-powered farming advice and assistance
- Building digital literacy in rural communities
- Creating a network of support among agricultural communities

## Future Roadmap

- Weather forecasting integration
- Market price predictions
- Crop disease detection using image recognition
- Integration with government agricultural schemes
- Support for more regional languages
- Expanded AI capabilities with specialized agricultural models

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries, please reach out to [www.rishiahuja@gmail.com](mailto:www.rishiahuja@gmail.com)

---

*KisaanMithraa is proudly built to address several UN Sustainable Development Goals through technological innovation in agriculture.*
