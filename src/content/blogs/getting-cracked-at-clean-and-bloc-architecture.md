---
title: "Getting Cracked at Clean and BLoC Architecture"
brief: "Advanced Flutter architecture blog covering clean architecture principles and BLoC pattern implementation."
dateAdded: 2025-01-05T00:00:00.000Z
hashnodeUrl: "https://rishi2220.hashnode.dev/getting-cracked-at-clean-and-bloc-architecture"
readTimeInMinutes: 25
author: "Rishi Ahuja"
---
In our previous exploration of BLoC architecture, we laid the groundwork by understanding the core concepts: streams, futures, Cubits, and basic BLoC patterns. We learned how to manage simple state changes, handle navigation, and implement basic testing. However, real-world applications demand more sophisticated approaches to state management and architecture. If you’ve not read the [previous blog](https://rishi2220.hashnode.dev/getting-started-at-bloc-architecture) first, please consider reading that first.

# Implementing a Cubit, rather a Hydrated Cubit

Hydrated Cubit?

A HydratedCubit is a special version of a Cubit that automatically persists and restores its state across app restarts and sessions. Whenever a new state is emitted, it saves the state in a serialized form, essentially a map. And you guessed it, when the app restarts, it emits the state back, hence you can persist those states, like the theme mode of an application maybe?

Let’s start writing a cubit to the same.

## Hydrated Cubit to persist Theme Mode of an application

### Initializing the hydrated bloc:

Make sure you’ve added `hydrated_cubit` and `path_provider` in your `pubspec.yaml` file:

```yaml
dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.8
  hydrated_bloc: ^7.1.0
  path_provider: ^
```

Add the following lines to the `main.dart`.

```dart
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  HydratedBloc.storage = await HydratedStorage.build(
    storageDirectory: kIsWeb
        ? HydratedStorage.webStorageDirectory
        : await getApplicationDocumentsDirectory(),
  );
  runApp(App());
}
```

`WidgetsFlutterBinding.ensureInitialized();` ensures the Widget bindings are initialized. Why is that Important?

HydratedBloc needs to access the device's storage system to save and retrieve state data. On mobile devices, this means interacting with the file system through `getApplicationDocumentsDirectory()`, and on web platforms, it means accessing browser storage APIs. These storage interactions are considered platform-specific operations - they need to communicate with the underlying operating system or browser.

Without initializing Flutter bindings first, these platform interactions would fail because the necessary communication channels between your Dart code and the platform wouldn't be established. It would be like trying to save data to a hard drive before the computer's operating system has fully booted up.

`HydratedBloc.storage = await HydratedStorage.build`: The 'storage' property is where HydratedBloc will save and retrieve its state. The `await` keyword is necessary because building storage is an asynchronous operation - it needs to wait for the system to set up the storage properly.

If `kIsWeb` is true (meaning your app is running in a web browser), it uses `HydratedStorage.webStorageDirectory`, which utilizes web-specific storage mechanisms like localStorage or IndexedDB.

Else, it calls `getApplicationDocumentsDirectory()` to get the app's dedicated document directory on the device's file system. This is awaited because accessing the file system is an asynchronous operation.

### Writing the Cubit

Finally! Let’s create a folder in `lib` and make two folders inside it. `widget` and `cubit`. The widget folder will contain the button we will be building, hence a file named, `theme_button.dart` let’s say, and Cubit folder will contain `theme_cubit.dart`.

When we create a class we would have to also create the following overrides, while extending a warm welcome to our cubit class initialized on `ThemeMode` type.

```dart
class ThemeCubit extends HydratedCubit<ThemeMode> {
  @override
  ThemeMode? fromJson(Map<String, dynamic> json) {
    throw UnimplementedError();
  }

  @override
  Map<String, dynamic>? toJson(ThemeMode state) {
    throw UnimplementedError();
  }
}
```

Before implementing the overrides, let’s first write the core implementation of the cubit.

Here is the initialization:

```dart
ThemeCubit() : super(ThemeMode.system);
```

After that here is the `updateTheme` method which needs to be implemented.

```dart
  void updateTheme(ThemeMode mode) => emit(mode);
```

Takes a theme mode and emits the same. Simple enough. Let’s implement the `toJson` and `fromJson` method.

```dart
  @override
  Map<String, dynamic>? toJson(state) {
    return {'themeMode': state.index};
  }
```

This override returns a Map, we want to serialize out data based on the last emitted state into some JSON object to store it in local storage. Any JSON map returned by this function will be handled automatically, stored in local storage, and will be provided back to `fromJson` method, which can be further processed to be emitted.

The stored map will look something like this:

```json
{'themeMode': 0} // for System
{'themeMode': 1} // for Light Mode
{'themeMode': 2} // for Dark Mode
```

```dart
@override
  fromJson(Map<String, dynamic> json) {
    return ThemeMode.values[json['themeMode'] as int];
  }
```

The provided map should be converted to some kind of `ThemeMode`, because that is what we are operating on. `ThemeMode` has an extension that can take integers and convert them back to `ThemeMode` objects. Hence we deserialize the old map and emit back the `ThemeMode` based on it.

### Integrating the cubit back into the presentation layer

First, we need to inject the cubit we created inside a higher-level tree to use the context of the Cubit.

```dart
BlocProvider(
  create: (context) => ThemeCubit(),
  child: MaterialApp(
    // App structure
  ),
)
```

We need to provide the theme mode to based on this context to our Material app.

```dart
//Material App Structure
child: BlocBuilder<ThemeCubit, ThemeMode>(
    builder: (context, mode) {
      return MaterialApp.router(
        title: 'Cubit Implementation',
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: mode,
        routerDelegate: ...
  );
```

Considering we’ve set the themes in a custom class, let’s say `AppTheme` something like this:

```dart
class AppTheme {
  static final lightTheme = ThemeData(
    primaryColor: AppColors.primaryLight,
    scaffoldBackgroundColor: AppColors.lightBackground,
    brightness: Brightness.light,
  );

  static final darkTheme = ThemeData(
    primaryColor: AppColors.primaryDark,
    scaffoldBackgroundColor: AppColors.darkBackground,
    brightness: Brightness.dark,
  );
}
```

After injecting this, we can read or listen to the changes in the cubit or can even use the defined methods of the cubit.

We can start by building a simple button:

```dart
class ThemeButton extends StatelessWidget {
  const ThemeButton({super.key});
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ThemeCubit, ThemeMode>(
      builder: (context, state) {
        return IconButton(
          onPressed: () {},
          icon: const Icon(Icons.sunny),
        );
      },
    );
  }
}
```

Now we can use two extensions on our Build context, one is `context.read` and the second is `context.watch`. The extensions are more or less intuitively named.

*   [context.read](http://context.read)() is used for one-time access, perfect for event triggers like button presses.
    
*   [context.watch](http://context.watch)() would be used when we need to continuously observe state changes.
    

Now on `onTap` method we can do something like this with the read method:

```dart
onPressed: () => state == ThemeMode.light
    ? (context.read<ThemeCubit>().updateTheme(ThemeMode.dark))
    : context.read<ThemeCubit>().updateTheme(ThemeMode.light),
```

This line does several things:

1.  Check the current theme state.
    
2.  Uses [`context.read`](http://context.read) to get the ThemeCubit instance.
    
3.  Calls `updateTheme()` with the opposite theme mode.
    

And based on that, we can also change the Icon.

```dart
icon: Icon(state == ThemeMode.light
              ? Icons.nightlight_round
              : Icons.wb_sunny_rounded),
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1736006664397/48c6aa91-4811-4622-90ed-e59687b3ef80.png align="center")

Interesting, simple, easy, and practical implementation of a hydrated cubit!

Let’s implement a BLoC, a complex one, but with clean architecture, let’s first understand clean architecture principles.

# Clean Architecture in Flutter Applications

Clean Architecture, introduced by Robert C. Martin (Uncle Bob), represents a modern approach to software design that emphasizes the separation of concerns and independence of frameworks. Here, we'll explore how these principles map to Flutter apps and why they matter for building scalable, maintainable mobile applications.

## Understanding Clean Architecture Principles

Clean Architecture is built on a fundamental premise: The inner layers of your application should not know anything about the outer layers. This means business logic should be completely independent of presentation logic, data sources, and external frameworks.

### The Layers of Clean Architecture

Working from the outside in, Clean Architecture consists of four main layers:

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">Things will become more digestible after getting through the implementations, right now it might sound a little finicky. If you don’t understand the points under the layers, don’t worry, just skim through it.</div>
</div>

1.  **Enterprise Business Rules (Entities)**
    
    *   Contains the most critical rules of your application
        
    *   Pure logic that doesn't depend on anything external
        
    *   Stays the same regardless of UI or database changes
        
    *   Something like this comes under Entities:
        
    
    ```dart
    class User {
      final String id;
      final String name;
      final String email;
    }
    ```
    
2.  **Application Business Rules (Use Cases Layer):**
    
    *   Coordinates between domain entities.
        
    *   Defines how different parts of the application interact.
        
    *   Independent of external frameworks.
        
3.  **Interface Adapter layer:**
    
    *   Converts data between different layers.
        
    *   Implements repositories.
        
    *   Manages state and data transformations.
        
    *   Connects use cases to external systems.
        
4.  **Frameworks & Drivers (External Interfaces):**
    
    *   UI components
        
    *   Platform-specific implementations
        
    *   External service integrations
        
    *   The most volatile and changeable layer
        

### The Dependency Rule

The fundamental rule that makes Clean Architecture work is the Dependency Rule: Source code dependencies must point only inward, toward higher-level policies. Nothing in an inner circle can know anything about something in an outer circle. In simpler terms here is a simpler example:

*   **A Chef (Core Logic)**: Chefs know the recipe and cooking techniques.
    
*   **A Waiter (Interface Adapter)**: A waiter and interferer translate customer orders to the kitchen.
    
*   **Customer (External Interface)**: Requests a specific dish.
    

The **Chef** doesn't care about the waiter's uniform or the restaurant's decor. The **Waiter** knows how to communicate between customers and the kitchen. The **Customer** just wants a good meal.

Ok, Ok, enough yap! Let’s start making folders. We will make a full auth system.

There can be two directory structures, Feature-first and Layer-first architecture.

```dart
lib/
├── core/
│   └── services/
│       └── service_locator.dart
│
├── data/
│   ├── feature_1/
│   │   ├── datasources/
│   │   ├── repositories/
│   │   └── models/
│   ├── feature_2/
│   │   ├── datasources/
│   │   ├── repositories/
│   │   └── models/
├── domain/
│   ├── feature_1/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── usecases/
│   ├── feature_2/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── usecases/
│
├── presentation/
│   ├── feature_1/
│   │   ├── bloc/
│   │   └── pages/
└── main.dart
```

Or Feature first implementation:

```dart
lib/
├── core/
│   └── services/
│       └── service_locator.dart
│
├── features/
│   ├── feature_1/
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   ├── repositories/
│   │   │   └── models/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── usecases/
│   │   └── presentation/
│   │       ├── bloc/
│   │       └── pages/
└── main.dart
```

We will be using layer-first architecture in this blog. Don’t get overwhelmed things will fall into place.

Before implementing the implementation to firebase service, let’s understand some functional programming and `dartz` packages.

### Functional programming concepts in Dart via `dartz`

`dartz` is a flutter package, that brings functional programming concepts to Dart. We can use things like `Either`, `Option` or `Maybe`. In most cases, we will only use Either.

Either can have two values. The Success and a Failure value. Success is denoted by Right, and Failure is denoted by Left. This means, that if the API we are calling, omits an error, we can return a Left, with the error object, and if everything goes right, and we get back the expected responses, we will return a Right with the returned entity being sent with it. Further, we can check if it is right or left to examine what to show in the lower layers.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1735990613138/c5d0ddc7-382a-4b31-8e4b-3a5073517c01.png align="center")

### Writing Entities and Models

Let’s create entities and models by making files in the following folders.

```plaintext
lib/
├── data/
│   ├── models/
│   │   ├── auth/
│   │   │   ├── create_user_request.dart
├── domain/
│   ├── entities/
│   │   ├── auth/
│   │   │   ├── user_entity.dart
```

To get started, we will create a model in the presentation, and then send it to data sources, which will be processed, and will be converted into a user entity, and will be plugged back into the presentation layer.

Let’s say we provide the name, email, and password to the server, and it provides us back with the UID, email, and name. The first is a `CreateUserModel` and the latter is a `UserEntity` here.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1735990462914/b0ac6c3b-e430-443e-aa5b-d984acb74640.png align="center")

Here is the structure of our Model:

```dart
class CreateUserRequest {
  final String email;
  final String password;
  final String name;

  CreateUserRequest({
    required this.email,
    required this.password,
    required this.name,
  });
}
```

And here is the User Entity which will be plugged back into the UI:

```dart
class UserEntity {
  final String email;
  final String name;
  final String id;

  UserEntity({
    required this.email,
    required this.name,
    required this.id,
  });
}
```

### Authentication Repository Abstraction

Now, Let’s implement Authentication Repository Implementation which will return us back the data.

Think of a library. When you want to borrow a book, you don't need to know whether it's stored in the basement, on the top floor, or in a different building altogether. You simply ask the librarian, and they handle all the details of finding and retrieving the book for you. The librarian acts as an intermediary between you and the complex library storage system.

This is exactly what a repository does in clean archtitecture. A repository is a design pattern that acts as an intermediary between your application's business logic and the data storage layer. Just like the librarian, it hides all the complex details of data operations.

Here is the file structure:

```plaintext
lib/
├── data/
│   ├── repository/
│   │   ├── auth/
│   │   │   ├── auth_repository_impl.dart
├── domain/
│   ├── repository/
│   │   ├── auth/
│   │   │   ├── auth_repository.dart
```

We made two files, first the auth repository (abstract class), and second its implementation.

```dart
abstract class AuthRepository {
  Future<Either> signUp(CreateUserRequest createUserRequest);
  // Other Methods..
  // Future<Either> signIn(LoginUserRequest loginUserRequest);
  // Future<void> logOut(NoParams noParams);
}
```

Note that it accepts a Create User Model, and returns a Future of Either, which we talked about previously.

Let’s talk about its implementation now. Its implementation should now call the Firebase functions right? To handle the Firebase SDK we need to further create a class called `AuthFirebaseImplementation`.

### Authentication Firebase Service Abstraction & Implementation

Using the same analogy, Think of Firebase Auth as a specialized security department within our library. While the repository (our librarian) handles the general interactions, the Firebase Auth Service is like the security team that specifically manages all the ID cards, security checks, and access controls.

Here is the file structure:

```plaintext
lib/
├── data/
│   ├── sources/
│   │   ├── auth/
│   │   │   ├── firebase_auth_service.dart
```

This file will contain both the abstract class and the implementation, we can also use `sealed` class instead of `abstract` for the same reason.

Here is the abstract interface:

```dart
abstract class AuthFirebaseService {
  Future<Either> signUp(CreateUserRequest createUserRequest);
  // Other Methods..
  // Future<Either> signIn(LoginUserRequest signinUserRequest);
  // Future<void> logOut(NoParams noParams);
}
```

And here is the Implementation:

```dart
class AuthFirebaseServiceImplementation extends AuthFirebaseService {
 @override
  Future<Either<String, UserEntity>> signUp(CreateUserRequest request) async {
    try {
      // Create user
      final userCredential =
          await FirebaseAuth.instance.createUserWithEmailAndPassword(
        email: request.email,
        password: request.password,
      );
      final userEntity = UserEntity(
        id: userCredential.user!.uid,
        email: request.email,
        name: request.name,
      );
      return Right(userEntity);
    } on FirebaseAuthException catch (e) {
      return Left(e.message ?? 'Sign up failed');
    }
  }
}
```

See How we are returning Left and Right objects, to determine the failure or success, and for success, we are returning a UserEntity Object.

To make things more clean, we can also define our custom Failure classes.

```dart
// core/domain/failures/auth_failures.dart
abstract class AuthFailure {
  const AuthFailure();
}

class EmailAlreadyInUseFailure extends AuthFailure {}
class InvalidEmailFailure extends AuthFailure {}
class WeakPasswordFailure extends AuthFailure {}
class UserNotFoundFailure extends AuthFailure {}
class WrongPasswordFailure extends AuthFailure {}
class NetworkFailure extends AuthFailure {}
class ServerFailure extends AuthFailure {}
```

And based on the error codes omitted by Firebase we can even return these classes in Left, instead of the string we are returning right now.

```dart
switch (e.code) {
        case 'email-already-in-use':
          return Left(EmailAlreadyInUseFailure());
        case 'invalid-email':
          return Left(InvalidEmailFailure());
        case 'weak-password':
          return Left(WeakPasswordFailure());
        default:
          return Left(ServerFailure());
}
```

But for simplicity, we will return to Strings right now.

Cool, We successfully wrote Auth Repository, Auth Service and it’s implementation. But where is Auth Repository Implementation? We will get through it, after looking at a Service Locator.

### Understanding Service Locators

Let’s understand Service Locators, Taking the analogy forward, Think of a service locator as the library's central information desk. When you walk into a large library, instead of wandering around looking for specific services, you go to the information desk. They know where everything is and who to contact for what - whether you need a librarian, the catalog system, the membership desk, or technical support.

Basically, We will register every service that can be used somewhere in the application, this is done, as stated, to avoid confusion and inject all the dependencies into one file, which can be called anywhere.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1736000206447/520c9b05-6458-4a68-9e56-278581264def.png align="center")

`get_it` provides a Service Locator (or dependency injection container) for Dart and Flutter.

```plaintext
lib/
├── service_locator.dart
```

```dart
final GetIt sl = GetIt.instance;
```

You can directly declare a global variable in the file and create an `GetIt` instance. And create a function that will be used to initialize the dependencies which we will register.

```dart
void getDependencies() {
sl.registerSingleton<AuthFirebaseService>(
    AuthFirebaseServiceImplementation(),
);
}
```

The line `sl.registerSingleton<AuthFirebaseService>(AuthFirebaseServiceImplementation());` does a lot of things.  
But first, break down each type of `GetIt` registration.

1.  **Singleton Registration**
    
    *   `GetIt.instance.registerSingleton(...);` This creates ONE instance that's shared everywhere in your app. Think of it like a global variable but safer and more manageable.
        
    *   We use a singleton class when need to maintain a shared state across the app, or for expensive resources like database connections, and API clients.
        
    *   In this case, We only want one instance of the `AuthService` to exist in the application, hence this is the perfect one in this case.
        
2.  **Lazy Singleton**
    
    *   `GetIt.instance.registerLazySingleton(() => UserRepositoryImpl());` Similar to a regular singleton the instance is created only when first requested. This helps with app startup performance.
        
    *   If the service has expensive initialization, or We want to improve app startup time We might use the register as lazy singleton.
        
    *   We will basically have singleton behavior but with delayed initialization.
        
3.  **Factory Registration**
    
    *   `GetIt.instance.registerFactory(() => HomeBloc());` This creates a new instance every time you request it. Perfect for components that need fresh state.
        
    *   This is used to avoid state leaks between screens, Hence it’s perfect for registering BLoCs.
        

Let’s understand what happens here behind the hood when registered.

```dart
sl.registerSingleton<AuthFirebaseService>(
    AuthFirebaseServiceImplementation(),
);
```

1.  Creates an instance immediately: `final serviceInstance = AuthFirebaseServiceImplementation();`
    
2.  Stores it in GetIt's internal registry with its type, The Internal registry looks something like this: `Map<Type, dynamic> _registry = { AuthFirebaseService: serviceInstance };`
    
3.  Makes it available for retrieval anywhere in the app: `final authService = sl<AuthFirebaseService>();`
    

Now that we have registered the Firebase service, we can write the implementation of the Auth Repository, considering we are calling the function we created in the main function, to register everything as soon the application starts.

```dart
void main() async {
    WidgetsFlutterBinding.ensureInitialized();
  HydratedBloc.storage = await HydratedStorage.build(
    storageDirectory: kIsWeb
        ? HydratedStorage.webStorageDirectory
        : await getApplicationDocumentsDirectory(),
  );
  // Here..
  getDependencies();
  runApp(const App());
}
```

Here is a simple Auth Repository implementation, which call the sign up method of the firebase service using the newly registered service locator.

```dart
class AuthRepositoryImplementation extends AuthRepository {
  final AuthFirebaseService _authFirebaseService = sl<AuthFirebaseService>();
  @override
  Future<Either> signUp(CreateUserRequest createUserRequest) {
    return _authFirebaseService.signUp(createUserRequest);
  }
  // ... Other functions
}
```

### Use cases

Now, Imagine you're a library manager, and you want to implement a new "Book Club Membership" system. This isn't just a simple "borrow a book" operation - it involves multiple steps and business rules, Check if the person is eligible for membership, Verify they haven't exceeded their membership quota, Process their membership fee etc..

Now Similarly, we might want to check if, the Sign Up is requested, but if the email is correct, or if the password qualifies for firebase’s decorum, etc.

Some methods like these:

```dart
if (!isPasswordStrong(request.password)) {
      return left(WeakPasswordFailure());
    }

 if (containsInappropriateContent(request.username)) {
      return left(InvalidUsernameFailure());
 }
```

Now Let’s create a simple class called use cases.

```plaintext
lib/
├── core/
│   ├── usecase/
│   │   │   ├── usecase.dart
├── domain/
│   ├── usecases/
│   │   ├── auth/
│   │   │   ├── signup_usecase.dart
```

Let’s first write an abstraction for all our use cases in `usecase.dart`.

```dart
abstract class Usecase<Type, Params> {
  Future<Type> call({Params? params});
}
```

This is the abstract interface where we will inherit all our use cases. It features a call function and two generic type parameters.

*   `Type`: What your use case will return (e.g., Either)
    
*   `Params`: What your use case needs as input (e.g., CreateUserRequest)
    

Now let’s create a sign-up use-case that will directly call the service locator to call the method in the auth repository and will pass the `params` to it.

```dart
class SignupUsecase extends Usecase<Either, CreateUserRequest> {
  @override
  Future<Either> call({CreateUserRequest? params}) {
    return sl<AuthRepository>().signUp(params!);
  }
}
```

Now this is how things are looking right now:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1736006818701/11b34615-17bb-460f-9971-e23839493441.png align="center")

OK OK! This looks scary, but if one looks it like simple node connections, things will fall into place easily.

Now Let’s implement a BLoC to handle all of this mess. 👋

## BLoC Implementation to handle the mess.

Here also we will write a hydrated bloc to persist the states.

This has been already established but let’s again see the

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1736014269367/08f0fd31-749e-450a-aec7-25d55623fad4.png align="center")

Hydrated BLoC structure.

The directory structure:

```plaintext
lib/
├── presentation/
│   ├── auth/
│   │   ├── bloc/
│   │   │   ├── auth_bloc.dart
│   │   │   ├── auth_event.dart
│   │   │   ├── auth_state.dart
│   │   ├── screens/
│   │   │   ├── signup.dart
```

We created 3 files, Bloc, Events, and State.

Events will be dispatched from the UI and Bloc in between call the Sign Up Usecase and a State will be emitted, based on which we can see the UI being changed.

Here is the Auth events file.

```dart
abstract class AuthEvent {}

class SignUpRequested extends AuthEvent {
  final String name;
  final String email;
  final String password;

  SignUpRequested({
    required this.name,
    required this.email,
    required this.password,
  });
}

// Other functions
// class SignInRequested extends AuthEvent {...}
// class LogoutRequested extends AuthEvent {...}
```

This Object will be sent to BLoC for processing.

And this is the states which can be emitted. Initial State, Loading State, Success State or Error State.

```dart
import 'package:blog/domain/entities/auth/user_entity.dart';

sealed class AuthState {}

class AuthInitial extends AuthState {}
class AuthLoading extends AuthState {}
class AuthSuccess extends AuthState {
  final UserEntity userEntity;
  AuthSuccess({required this.userEntity});
}
class AuthError extends AuthState {
  final String errorMessage;
  AuthError({required this.errorMessage});
}
```

Now we need to create event handlers to create the BLoC Logic (from the previous blog, we certainly know the structure of BLoC)

```dart
class AuthBloc extends HydratedBloc<AuthEvent, AuthState> {
  final SignupUsecase _signUpUseCase;

  AuthBloc(SignupUsecase signupUsecase)
      : _signUpUseCase = signupUsecase,
        super(AuthInitial()) {
    on<SignUpRequested>(_onSignUpRequested);
  }
}
```

Let’s right the event handler and understand that.

```dart
Future<void> _onSignUpRequested(
      SignUpRequested event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    final userRequest = CreateUserRequest(
        email: event.email,
        name: event.name,
        password: event.password,
        username: event.username);
    final result = await _signUpUseCase(params: userRequest);
   
    result.fold(
      (failure) => emit(AuthError(errorMessage: failure)), // Handle failure
      (user) => emit(AuthSuccess(userEntity: user)), // Handle success
    );
  }
```

Notice as soon as the Sign-Up Event is started to handle, it emits a state which indicates loading.

Based on the Object we received, the data is extracted and a `CreateUserRequest` object is created which is further injected by our `signUpUsecase`. Let’s understand why we are accepting the use case in the BLoC?

This is done for easy testing, it might not be relevant right now, but here is a small view.

Hard to Test because of tight coupling (what we were trying to do):

```dart
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final SignupUsecase _signUpUseCase = sl<SignupUseCase>();
}
```

This is easy to test and can mock dependencies:

```dart
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final SignupUsecase _signUpUseCase;
  AuthBloc(this._signUpUseCase);
}
```

Keep in mind that we need to register the BLoC itself to the service locator, but keep in mind it should be registered as a factory as discussed earlier.

```dart
sl.registerFactory(() => AuthBloc(sl<SignupUsecase>()));
```

We need to also handle `toJson` and `fromJson` methods, to persist the state of the BLoC. Hence we need methods that can serialize and deserialize the states into some kind of maps.

Let’s add those methods in AuthState.

```dart
sealed class AuthState {
  AuthState();
  factory AuthState.fromMap(Map<String, dynamic> map) {
    switch (map['type']) {
      case 'AuthInitial':
        return AuthInitial();
      case 'AuthLoading':
        return AuthLoading();
      case 'AuthError':
        return AuthError(errorMessage: map['errorMessage']);
      case 'AuthSuccess':
        return AuthSuccess(userEntity: UserEntity.fromMap(map['userEntity']));
      default:
        return AuthInitial();
    }
  }
  Map<String, dynamic> toMap();
}
```

and `toMap` method can be implemented based on other inherited classes.

```dart
class AuthInitial extends AuthState {
  @override
  Map<String, dynamic> toMap() {
    return {'type': 'AuthInitial'};
  }
}
```

```dart
class AuthError extends AuthState {
  final String errorMessage;
  AuthError({required this.errorMessage});

  @override
  Map<String, dynamic> toMap() {
    return {'type': 'AuthError', 'errorMessage': errorMessage};
  }
}
```

etc..

Now we are ready to add `toJson` and `fromJson` methods, and now things are simple enough.

```dart
  @override
  AuthState? fromJson(Map<String, dynamic> json) {
    try {
      return AuthState.fromMap(json);
    } catch (e) {
      return AuthInitial();
    }
  }
  @override
  Map<String, dynamic>? toJson(AuthState state) {
    try {
      final map = state.toMap();
      return map;
    } catch (e) {
      return {};
    }
  }
```

To add the event from a button, we can use the add method as discussed in the first blog.

```dart
onPressed: () async {
   final signUpUsecase = SignUpRequested(
              name: _nameController.text.trim(),
              email: _emailController.text.trim(),
              password: _passwordController.text.trim());
   context.read<AuthBloc>().add(signUpUsecase);
}
```

We can use a BLoC consumer both to listen and build based on the state updates.

```dart
BlocConsumer<AuthBloc, AuthState>(listener: (context, state) {
      if (state is AuthSuccess) {
        context.go('/home', extra: state.userEntity);
      }
      if (state is AuthError) {
        _animatedAppbar(context, state.errorMessage);
      }
    }, builder: (context, state) {
      return BasicButton(
        onPressed: () async {...},
        text: (state is AuthLoading) ? 'Loading...' : 'Get Started',
      );
    });
```

We can both listen to states like AuthSuccess and redirect the user to some other state, or listen for errors, show snack bars, and build/update the screen with loading animation or text based on the Auth Loading state.

Let’s see the diagram about what’s the data from, this is a simpler diagram and will clearly give a bird's eye view of the full architecture.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1736013996758/1e4e5f6d-23d5-49e0-9cea-6af1d047eade.png align="center")

## Exercise: Hive

Now that we've built a solid understanding of Clean Architecture and BLoC patterns with Firebase, let's explore how these same principles apply to local data storage using Hive. Why Hive, and why now?

Hive complements our architectural knowledge in several important ways:

1.  Just as we used Clean Architecture to separate our Firebase authentication concerns, we can apply the same principles to local data storage
    
2.  While Firebase handled our remote data, real applications often need robust local storage for offline functionality and improved performance
    
3.  Understanding how to implement Clean Architecture with both remote (Firebase) and local (Hive) data sources gives you a complete picture of modern Flutter application architecture
    

Think of Hive as another data source that can slot into our existing architecture. Just as we created repositories and use cases for Firebase authentication, we can apply the same patterns to local data storage.

I want you to get up and write your own implementation with clean and BLoC architecture. Here is a getting-started guide with Hive.

Dependencies:

```yaml
dependencies:
  hive: ^[latest_version]
  hive_flutter: ^[latest_version]

dev_dependencies:
  hive_generator: ^[latest_version]
  build_runner: ^[latest_version]
```

Initialization:

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Hive.initFlutter();
  runApp(MyApp());
}
```

Think of Hive like a smart storage box that can hold different types of items. But just like a toy needs assembly instructions, Hive needs instructions on how to store and retrieve your data. These instructions come from something called an "adapter."

```dart
@HiveType(typeId: 0)
  // This tells Hive "Here's a new type of thing to store"
class Person extends HiveObject {
  @HiveField(0)  
  // This is like putting a label "0" on the name field
  late String name;
  
  @HiveField(1)  
  // Label "1" for age
  late int age;
}
```

The numbers (0, 1, 2) are like labels on boxes. Imagine you're packing a suitcase - you put name in box 0, age in box 1, and email in box 2. This helps Hive know where to find each piece of information later.

Now, to create and register the adapter, you need three steps:

1.  First, create a new file named `person.g.dart` (it will be generated automatically)
    
2.  Run this command in your terminal to generate the adapter:
    
    ```bash
    flutter pub run build_runner build
    ```
    
3.  Then register the adapter in your code (usually in main.dart):
    
    ```dart
    void main() async {
      await Hive.initFlutter();  // Initialize Hive
      Hive.registerAdapter(PersonAdapter());  
      // Tell Hive how to handle Person objects
      // Now you can use it!
      var box = await Hive.openBox<Person>('people');
    }
    ```
    

Here is a simple use case:

```dart
// Create a new person
var john = Person()
  ..name = "John"
  ..age = 30
  ..email = "john@example.com";

// Save to Hive
await box.put('john_key', john);

// Get from Hive later
var savedJohn = box.get('john_key');
print(savedJohn.name);  // Prints: John
```

Now make methods to clean the class, like putting in the hive, deleting from the hive, and making a BLoC to handle all the events.

### Conclusion

This blog post serves as the second part of our deep dive into BLoC architecture, building upon the foundations laid in "Getting Started at BLoC." We've journeyed through advanced concepts and practical implementations that showcase the power and flexibility of state management in Flutter applications.

Stay tuned for more Flutter development insights and best practices. You can download the PDF format for this blog at Gumroad.

Connect with me on:

*   [X](https://x.com/rishi2220)
    
*   [LinkedIn](https://www.linkedin.com/in/rishi-ahuja-b1a224310/)
    

Your feedback and questions are invaluable as we continue exploring the world of Flutter development together. Whether you're building your first app or architecting complex systems, I hope these insights help you write cleaner, more maintainable code.

Remember: Good architecture isn't about following rules blindly – it's about making conscious decisions that help your application grow sustainably while remaining maintainable and testable.