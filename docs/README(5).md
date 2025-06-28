# Nexus - Connect. Create. Collaborate. 🚀

[![Flutter Version](https://img.shields.io/badge/Flutter-3.x-blue.svg)](https://flutter.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Enabled-orange.svg)](https://firebase.google.com)
[![State Management](https://img.shields.io/badge/Bloc-8.x-purple.svg)](https://bloclibrary.dev)
[![Clean Architecture](https://img.shields.io/badge/Clean%20Architecture-Implemented-blue.svg)]()
[![GitHub](https://img.shields.io/github/stars/RishiAhuja/nexus?style=social)](https://github.com/RishiAhuja/nexus)

> A modern, feature-rich blogging platform built with Flutter web, focusing on community connection and content creation.

## Deployment
 
### Live Demo

Experience Nexus in action at our official deployment:

🌐 [https://nexus.rishia.in](https://nexus.rishia.in)


## Table of Contents

- About Nexus
- Key Features
- Visual Showcase
- Technology Stack
- Getting Started
  - Prerequisites
  - Installation
  - Configuration
  - Running Locally
- Architecture
- Contributing
- License
- Contact

## About Nexus

Nexus is a cutting-edge social blogging platform designed to connect creators, developers, and writers. The platform enables users to publish "signals" - blog posts that resonate across the network, fostering collaboration and knowledge sharing. Built with Flutter for the web, Nexus demonstrates how modern web applications can be developed with a mobile-first framework while maintaining excellent performance and user experience.

The project implements Clean Architecture principles and the BLoC pattern for state management, making it an excellent reference for developers looking to build scalable, maintainable web applications with Flutter.

## Key Features

- **Modern UI/UX**: Clean, responsive design that works across all devices
- **Social Blogging**: Connect with other users and share content
- **Rich Content Editor**: Create beautiful posts with markdown support
- **Authentication**: Secure sign-in and account management
- **Dark/Light Mode**: Full theme support based on user preference
- **Explore Feed**: Discover content from creators in the network
- **Responsive Design**: Optimized for both mobile and desktop experiences
- **Profile Pages**: Customizable user profiles
- **Real-time Updates**: Live content updates using Firebase

## Visual Showcase

![Landing Page](/assets/screenshots/nexus/landing.png)
*Modern landing page with a compelling value proposition and gradient design elements*

![Sign Up](/assets/screenshots/nexus/signup.png)
*Clean and intuitive sign-up experience with social authentication options*

![Sign In](/assets/screenshots/nexus/signin.png)
*Streamlined sign-in process that maintains the brand's visual language*

![Dashboard](/assets/screenshots/nexus/dashboard.png)
*Personalized dashboard showing trending signals and network activity*

![Content Editor](/assets/screenshots/nexus/editor.png)
*Powerful markdown editor with live preview for crafting high-quality signals*

![Explore Feed](/assets/screenshots/nexus/explore.png)
*Discover signals from across the network with intelligent categorization*

![User Profile](/assets/screenshots/nexus/profile.png)
*User profiles showcasing published signals and network connections*

## Technology Stack

- **Frontend**: Flutter Web
- **State Management**: BLoC Pattern
- **Backend**: Firebase (Firestore, Authentication)
- **Architecture**: Clean Architecture
- **Routing**: go_router
- **UI Components**: Custom-built for web
- **Testing**: Unit and Widget Tests

### Brand Elements

The Nexus brand is built on several key design principles:

- **Color Palette**: Gradient blues (#0062E6 to #33A9FF) representing depth and connectivity, contrasted with clean whites and deep darks for readability
- **Typography**: Space Grotesk for headings and interface elements, providing a modern, technical feel with excellent readability
- **Iconography**: Custom minimal icons focused on connectivity and signal themes
- **Visual Language**: Wave and pulse motifs that symbolize the amplification of signals across the network
- **Tone**: Professional but approachable, technical but not intimidating, focused on knowledge sharing and community

## Technical Architecture

Below is a detailed visualization of the Nexus technical architecture:

```mermaid
graph TD
    subgraph "Presentation Layer"
        UI[UI Components]
        BLOC[BLoC State Management]
        ROUTES[Go Router]
    end

    subgraph "Domain Layer"
        ENTITIES[Entities]
        REPOS[Repository Interfaces]
        USECASES[Use Cases]
    end

    subgraph "Data Layer"
        REPO_IMPL[Repository Implementations]
        DS[Data Sources]
        DTO[Data Transfer Objects]
    end

    subgraph "Core"
        ERRORS[Error Handling]
        UTILS[Utilities]
        DI[Dependency Injection]
        CONSTANTS[Constants]
    end

    subgraph "Firebase Services"
        AUTH[Authentication]
        FIRESTORE[Firestore Database]
        STORAGE[Cloud Storage]
        FUNCTIONS[Cloud Functions]
    end

    UI --> BLOC
    BLOC --> USECASES
    USECASES --> REPOS
    REPOS --> ENTITIES
    REPO_IMPL --> DS
    REPO_IMPL --> DTO
    REPOS -.-> REPO_IMPL
    DS --> FIREBASE
    ROUTES --> UI
    DI --> BLOC
    DI --> REPO_IMPL
    DI --> USECASES

    DS --> AUTH
    DS --> FIRESTORE
    DS --> STORAGE
    DS --> FUNCTIONS
 ```   

 The architecture follows Clean Architecture principles with clear separation of concerns:
 
 1. **Presentation Layer**: Handles UI rendering and user interactions
 2. **Domain Layer**: Contains business logic independent of any platform or framework
 3. **Data Layer**: Manages data access and transformations
 4. **Core**: Provides shared functionality across layers
 5. **Firebase Services**: External services for data persistence and authentication
 
 This design enables high testability, maintainability, and flexibility to adapt to changing requirements.


## Getting Started

### Prerequisites

- Flutter SDK 3.27.0 or higher
- Dart 3.5.3 or higher
- Firebase account
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/RishiAhuja/nexus.git
cd nexus
```

2. Install dependencies:

```bash
flutter pub get
```

### Configuration

1. Set up Firebase:

```bash
# Install FlutterFire CLI
dart pub global activate flutterfire_cli

# Configure Firebase for your project
flutterfire configure
```

2. Update Firebase configuration:
   - Add your Firebase web app credentials to the appropriate configuration files

### Running Locally

Run the application with the Canvas kit renderer for optimal performance:

```bash
flutter run -d chrome --web-renderer canvaskit
```

For a production build:

```bash
flutter build web --web-renderer canvaskit --release
```

## Architecture

Nexus is built following Clean Architecture principles:

```
lib/
├── core/           # Core functionality, configs
├── data/           # Data sources, repositories impl
├── domain/         # Business logic, entities, repositories
├── presentation/   # UI components, BLoCs
│   ├── auth/       # Authentication screens
│   ├── blog/       # Blog creation and viewing
│   ├── explore/    # Explore feed
│   ├── home/       # Home screen
│   ├── landing/    # Landing page
│   └── profile/    # User profiles
└── common/         # Shared widgets, helpers
```

The application follows a strict separation of concerns:

- **Domain Layer**: Contains business logic and entities
- **Data Layer**: Handles data access and repository implementations
- **Presentation Layer**: Manages UI and state

For state management, Nexus uses the BLoC pattern with the `flutter_bloc` package, ensuring a unidirectional data flow and predictable state transitions.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make to Nexus are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Areas for Contribution

- Enhanced editor features
- Social interaction capabilities
- SEO improvements
- Performance optimizations
- Testing coverage
- Documentation

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Rishi Ahuja - [@rishi2220](https://twitter.com/rishi2220)

Project Link: [https://github.com/RishiAhuja/nexus](https://github.com/RishiAhuja/nexus)

---

⭐ If you found Nexus helpful or interesting, please consider giving it a star on GitHub!

Similar code found with 2 license types
