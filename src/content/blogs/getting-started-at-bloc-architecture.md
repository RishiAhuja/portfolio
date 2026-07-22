---
title: "Getting Started at BLoC Architecture"
brief: "Beginner-friendly Flutter architecture blog introducing BLoC pattern with practical examples."
dateAdded: 2024-12-13T00:00:00.000Z
hashnodeUrl: "https://rishi2220.hashnode.dev/getting-started-at-bloc-architecture"
readTimeInMinutes: 25
author: "Rishi Ahuja"
---
### Asynchronous data, streams, and futures:

Think of a busy restaurant where the waiter takes your order and then goes to serve other tables while your food is being prepared. You don’t have to wait for your meal to be ready before the waiter can take other orders. This is exactly asynchronous data. Just like the waiter can serve multiple tables, asynchronous data allows a computer or application to handle several tasks at once.

Now let’s understand the technicalities:

*   In asynchronous transmission, each character or byte of data is framed with a start bit and a stop bit. The start bit signals the beginning of the data transmission, while the stop bit indicates its end. For example, when sending an ASCII character, it might be represented as 10 bits: 1 start bit + 8 data bits + 1 stop bit.
    
*   This is cool, but it increases the memory that needs to be transferred because of the extra start and stop bits. And for the same reason, it also increases the processing overhead.
    
*   Data is sent one character at a time, as opposed to blocks or frames used in synchronous transmission. This means that each character is transmitted independently, allowing for irregular intervals between transmissions.
    
*   Unlike synchronous transmission, where data is sent in fixed intervals dictated by a clock signal, asynchronous transmission allows for variable timing between characters. The receiver does not know when the next character will arrive until it detects the start bit.
    

And a stream is like a hose that delivers water continuously. You can fill up a bucket (process the data) as the water flows out. The data sent by the stream is essentially asynchronous data.

Let’s understand futures in dart:

Future in Dart represents a value that may not be immediately available but will be at some point in the future and hence used to handle asynchronous data in Flutter.

A **Future** object can be in one of two states:

*   **Uncompleted**: The operation is still ongoing.
    
*   **Completed**: The operation has finished, either successfully with a value or with an error.
    

Hence the main thread of the app is not blocked using future datatype. Here is some code to understand futures:

```dart
import "dart:async";

void main() {
  final myFuture = Future(() {
    print("Creating the future");
    return 12;
  });

  print("end of main");
}
```

Here we are constructing a `Future` that takes a function as an argument. This function is executed asynchronously when the Future is scheduled to run. The function you pass to the `Future` constructor is queued to be executed in the event loop. After the creation of a `Future`, Dart schedules that task to run after all synchronous code has been completed. The event loop checks for tasks that are ready to be executed (like your Future) and runs them when it can.

Hence the output is something like this

```bash
end of main
Creating the future
```

```plaintext
Print "end of main" -> (synchronous)
End of main() -> (synchronous)
Execute Future's function -> (asynchronous)
Print "Creating the future" -> (asynchronous)
```

A good use of `Future` can be seen in this code, where we are mocking an `http` request:

```dart
import "dart:async";

void main() {
  Future<int>.delayed(Duration(seconds: 3), () {
    return 100;
    Duration.zero refers to a duration of zero time. When you use Future.delayed(Duration.zero), you are essentially creating a future that completes immediately, but not before the current event loop iteration finishes.

  }).then((value) {
    print("value: ${value}");
  });
  print("waiting for a value..");
}
```

*   `Future<int>.delayed` creates a `Future` that will be completed after a specified duration. In this case, it will be completed after **3 seconds**.
    
*   The function passed as the second argument returns the integer `100`. This value will be available when the Future is completed (after 3 seconds)
    
*   Then we can use the `.then()` method to specify what should happen once the Future is completed successfully.
    
*   When the Future completes after 3 seconds, it passes its result (the value `100`) to this callback function, which prints `"value: 100"` to the console.
    

Enough Future! Now Let’s implement whatever we know and yield some data using a stream.

```dart
Stream<int> dataStream() async* {
//async data generator function
  for (int i = 1; i <= 10; i++) {
    print("sent data: " + i.toString());
    await Future.delayed(Duration(seconds: 2));
    yield i;
  }
}

void main() async {
  Stream<int> stream = dataStream();
  stream.listen((receivedData) {
    print("recieved data: " + receivedData.toString());
  });
}
```

In the following code, we are generating some data every 2 seconds (to simulate useful streams) and yielding that data to the output. We are listening to the data from the stream in the main function.

Here is the breakdown of some keywords:

`async`:

*   When you declare a function with `async`, it returns a `Future`. This means that the function is expected to perform some asynchronous operation and eventually provide a single value (or no value) when it completes.
    
*   `async` is used when you need to perform an operation that will complete with a single result, such as fetching data from an API or performing a calculation.
    
*   When you call an `async` function, it starts executing immediately but may pause at any `await` keyword until the awaited operation is completed. After the awaited operation finishes, execution resumes from where it paused.
    
*   When we use `await` before a `Future`, the execution of the async function is paused at that point until the `Future` completes. This does not block the entire thread; instead, it allows other code (including other asynchronous operations) to run while waiting for the `Future` to resolve.
    

`async*`:

*   When you declare a function with `async*`, it returns a `Stream`. This indicates that the function will yield multiple values over time, rather than returning a single value at once. You use the `yield` keyword to emit values one at a time.
    
*   Each time a value is yielded, execution pauses until the next value is requested by a listener on the stream.
    
*   `async*` is used when you want to produce a series of values over time, such as generating data in intervals, where each value can be processed as it arrives.
    

State management of an app can be simplified using streams. By listening to a stream, widgets can rebuild themselves automatically when new data is emitted, making it easier to manage complex states.

To manage the state of our app more effectively and make the app more scalable, we might want to use a state management solution called BLoC. It listens for events dispatched from the UI, processes them, and emits new states based on the logic defined within the Bloc.

### Basics of Cubit & BLoC

But to simplify things, We might want to first learn about **Cubit**. Cubit is a simplified version of Bloc that does not rely on events. Instead, it uses methods to emit new states directly. (This will be understood once we write some code.)

First, we need to add the `flutter_bloc` package to your `pubspec.yaml` file:

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_bloc: ^8.0.0 # Check for the latest version
```

Now we can create a Cubit:

```dart
import 'package:flutter_bloc/flutter_bloc.dart';

// Define the CounterCubit
class CounterCubit extends Cubit<int> {
  // Initial state is set to 0
  CounterCubit() : super(0); 

  // Method to increment the counter
  void increment() => emit(state + 1); 
  // Method to decrement the counter
  void decrement() => emit(state - 1); 
}
```

Here we are simply inheriting our own class from a pre-existing `Cubit` class which is managing an integer here. The class constructor is defaulted and delegated to the Cubit class with the initial state set as 0 using the `super` keyword.

`state` is a public getter that returns the current state of the Cubit. It represents the value that the Cubit is managing. `emit` is a public method used to update the state of the Cubit. When you call `emit(newState)`, it sets the Cubit's state to `newState` and notifies any listeners that the state has changed.

Now this code can be used just like any single class.

```dart
void main() {
  final cubit = CounterCubit();
  print(cubit.state); //0
  cubit.increment();
  print(cubit.state); //1
  cubit.decrement();
  print(cubit.state); //2
}
```

See! We successfully separated our business logic from UI components. As the application grows, having a clear separation between the UI and business logic can make the codebase easier to maintain.

Now, As we know `Cubit` is essentially a stream-emitting state, we can listen to it using a `Stream`. Let’s listen:

```dart

Future<void> main() async {
  final cubit = CounterCubit();

  final streamSubscription = cubit.listen(
      print); 
  cubit.increment();
  cubit.increment();

  await Future.delayed(Duration.zero);
  await streamSubscription.cancel();
  await cubit.close();
}
```

As we are using `await` aka asynchronous tasks, we might want to make the main function asynchronous using `async` keyword. As we already discussed, when we declare a function `async` it returns a `Future`.

After creating an instance for the `Cubit`, We are subscribing to a stream to listen to the changes.

```dart
final streamSubscription = cubit.stream.listen(print);
```

*   Here, We are accessing the `stream` property of the `cubit` instance, which is a stream of integers representing the current state of the Cubit.
    
*   The `listen(print)` method subscribes to this stream. This means that every time a new state is emitted (when you call `emit()` in your Cubit), the `print` function will be called with that new state.
    

```dart
await Future.delayed(Duration.zero);
```

Zero Duration delay is simply used to let all the microtasks finish before the asynchronous tasks continues. We are letting the main thread yield some control.

Now we can simply unsubscribe to the stream, to don’t print any further state changes on the console.

```dart
await streamSubscription.cancel();
```

```dart
await cubit.close();
```

This line closes the Cubit instance. Closing a Cubit releases any resources it may be holding and signals that it will no longer emit any states.

This was cool!

Cubit emits a stream, but we need to call methods directly to emit new states. But BLoC is different, it is event-driven. It relies on events to trigger state changes. We send events to the BLoC, which processes them and emits new states.

BLoC is essentially a function, which take events as input and omits a state as the output.

```dart
import 'package:bloc/bloc.dart';

enum CounterEventState { increment, decrement }

class CounterBloc extends Bloc<CounterEventState, int> {
  CounterBloc() : super(0) {
    // Registering event handlers
    on<CounterEventState>((event, emit) {
      switch (event) {
        case CounterEventState.increment:
          emit(state + 1); // Emit new state for increment
          break;
        case CounterEventState.decrement:
          emit(state - 1); // Emit new state for decrement
          break;
      }
    });
  }
}
```

From the above build-up, this code is easily digestible. Here We converted a Cubit to a BLoC by creating an enumeration with only two possible values, increment or decrement.

Now similar to a Cubit, we are inheriting our custom class from BLoC, where we need to provide the enumeration and the data we want to manage. In the class constructor, we can register an event handler with `on<EventType>` which accepts an anon function with 2 parameters, the `event` and `emit`.

Now with a simple switch case block, we can determine what to emit after changing the state on different enum values.

```dart
Future<void> main() async {
  final bloc = CounterBloc();

  final streamSub = bloc.stream.listen(print); 
    // Listen to emitted states

  // Adding events to the BLoC
  bloc.add(CounterEventState.increment);
  bloc.add(CounterEventState.decrement);
  bloc.add(CounterEventState.increment);

  await Future.delayed(Duration.zero); 
    // Allow pending operations to complete
  await streamSub.cancel(); // Cancel subscription
  await bloc.close(); // Close the BLoC
}
```

Now similar to Cubit we can listen to the events after subscribing to a stream and we can use `.add` the method to add events to the event handler. This dispatches the event to the BLoC which is added to the queue of the correct event handler which then determines and emits that new state, then the event is removed from the queue. BLoC does not retain a record of processed events; it only maintains the current state and listens for new events.

### BLoC Provider

BLoC provider is a widget that provides the BLoC instance so that we are not required to create instance for each use. BLoC provider provides a single instance of a bloc to the subtree below it using the instance we will inject into the provider. This is called a dependency injection:

Imagine you have a car that needs fuel to run. Instead of the car having to go to the gas station and fill itself up, you have a friend (the injector) who brings the fuel to the car whenever it needs it. This way, the car doesn’t need to worry about where the fuel comes from; it just knows that it gets what it needs when it needs it.

BlocProvider uses lazy initialization by default, which means an object is created only when it is needed, rather than upfront. It saves memory and processing power by avoiding the creation of unused objects.

Let’s start by implementing a cubit with the bloc provider and the BLoC provider.

To get started, Visual Studio Code has an extension named `bloc` which is very helpful in creating cubits and blocs and for wrapping widgets with bloc providers or other bloc widgets. Let’s create a cubit with a name `counter`

```plaintext
lib
|-- cubit
|   |-- counter_cubit.dart
|   |-- counter_state.dart
|-- main.dart
```

here is `counter_state` file:

```dart
part of 'counter_cubit.dart';

class CounterState {
  int counterValue;
  CounterState({required this.counterValue});
}
```

In initial examples, we were managing an integer, but here we made our own custom class `CounterState` to be managed. Creating a separate state class promotes separation between business logic (managed by the Cubit) and the state representation. This makes the code cleaner and more maintainable, as changes to the state structure can be managed independently from the logic that operates on it. Here we have a normal `counterValue` integer with an initializer.

```dart
import 'package:bloc/bloc.dart';
part 'counter_state.dart';

class CounterCubit extends Cubit<CounterState> {
  CounterCubit() : super(CounterState(counterValue: 0));
}
```

Here we are similarly creating an extended cubit class, asking the cubit to manage the custom class we made, and creating a simple initializer with initial `counterValue` as 0.

We can add the following functions to the cubit:

```dart
void increment() => 
emit(CounterState(counterValue: state.counterValue + 1));
void decrement() => 
emit(CounterState(counterValue: state.counterValue - 1));
```

Now our Cubit is ready to be implemented with the UI and BlocProvider.

As we already discussed the bloc provider provided the instance of the bloc or cubit to the tree nested below it. Because our counter app starts `MaterialApp` widget, we will wrap that with `BlocProvider`:

```dart
class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return BlocProvider<CounterCubit>(
      create: (context) => CounterCubit(),
      child: MaterialApp(
        title: 'Flutter bloc',
        //theme: ThemeData(...),
        home: const MyHomePage(title: 'Bloc'),
      ),
    );
  }
}
```

Understanding the code:

`BlocProvider<CounterCubit>`: The generic type `<CounterCubit>` tells Flutter that this provider will manage an instance of `CounterCubit`.

`create`: This parameter is used to define how the BLoC instance will be created. It takes a function that returns an instance of the BLoC.

`(context) => CounterCubit()`: This is a lambda function that takes `context` (The current BuildContext provides information about the location of this widget in the widget tree.) as an argument and returns a new instance of `CounterCubit` (This calls the constructor of the `CounterCubit` class, creating a new instance that will manage the counter's state and logic).

Now the instance of the `CounterCubit` and its functions can be accessed within the widget tree like this:

```dart
onPressed: () {
   //accessing context of the bloc provider:
   BlocProvider.of<CounterCubit>(context).decrement();
}
```

Note that this will retrieve the closest instance of `CounterCubit` from the widget tree.

Now we change the state of the Cubit via UI. But might want to also view that, to that that we will use `BlocBuilder`.

### BLoC Builder

It listens for state changes and rebuilds the widget whenever a new state is emitted.

The builder function can be called multiple times, so it's important to ensure that it efficiently rebuilds only the parts of the UI that need updating, which means we will only wrap the text that will show the counter, instead of the whole UI. This helps avoid performance issues associated with unnecessary rebuilds.

```dart
BlocBuilder<CounterCubit, CounterState>(
   builder: (context, state) {
      return Text(state.counterValue.toString());
   },
)
```

The declaration of a `BlocBuilder` widget takes two things, one is the type of BLoC (here cubit, remember cubit is the subtype of BLoC but not vice versa) that it will listen to and state `CounterCubit` emits.

The builder function, a [pure function](https://en.wikipedia.org/wiki/Pure_function), also takes two arguments, which are the `BuildContext` and the state emitted by the `CounterCubit` (represents the latest state of the cubit).

Now we are able to see the value of our `counterValue` variable in the `CounterState` class in the UI.

Bloc Builder also provides a function `buildWhen` that allows us to control when the builder function should be called based on the state changes of the BLoC. The `buildWhen` function takes two parameters:

*   `previousState`: The state that was emitted before the current state.
    
*   `currentState`: The state that is currently being emitted.
    

It returns a boolean on which it is decided if the widget will be called or not.

```dart
buildWhen: (previousState, currentState) {
    // Only rebuilds if the counter value has changed
    return previousState.counterValue 
    != currentState.counterValue;
  }
```

Cool! But in `BlocBuilder`, the build function is not called once on a single state change, though it flutter engine may call this multiple times to rebuild the state on a function call. Hence you can’t push to another another screen or show a snackbar on a state change inside `BlocBuilder`. So solve this, we might need to move on to another BLoC concept called `BlocListener`.

### BLoC Listener and Consumer

To solve the stated issue, Bloc Listener has a `listen` function which is only called once per state (not including the initial state). Similarly we also have a `listenWhen` function in the `BlocListener` as well,

> Note that: `BlocListener` doesn’t rebuild the UI.
> 
> `BlocListener` is designed for executing side effects based on state changes, such as displaying a `SnackBar`, showing a dialog, or navigating to another page. These actions typically should not cause a rebuild of the widget tree, making `BlocListener` more suitable for these scenarios.

Let’s change some code.

`counter_state.dart`

```dart
class CounterState {
  int counterValue;
  bool? ifIncremented;
  CounterState({
    required this.counterValue,
    this.ifIncremented
  });
}
```

`counter_cubit.dart`

```dart
class CounterCubit extends Cubit<CounterState> {
  CounterCubit() : super(CounterState(counterValue: 0));
  void increment() => emit(
      CounterState(counterValue: state.counterValue + 1, 
      ifIncremented: true));
  void decrement() => emit(
      CounterState(counterValue: state.counterValue - 1, 
      ifIncremented: false));
}
```

We will show a snackbar based on if the the counter was incremented or decremented using a `BlocListener`.

```dart
body: BlocListener<CounterCubit, CounterState>(
        listener: (context, state) {
          if (state.ifIncremented == true) {
            ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('value incremented')));
          }
          if (state.ifIncremented == false) {
            ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('value decremented')));
          }
        },
child: ....
);
```

Now we are using both `BlocBuilder` and `BlocListener`, But we have another BLoC Concept, called `BlocConsumer` which combines both Listener and Builder into single widget.

```dart
BlocConsumer<CounterCubit, CounterState>(
   builder: (context, state) {
        return Text(state.counterValue.toString());
   },
   listener: (context, state) {
        if (state.ifIncremented == true) {
            SnackBar(..);
        }
        if (state.ifIncremented == false) {
            SnackBar(..);
        }
   },
)
```

We are up with basic BLoC concepts. Let’s move on to BLoC artitechture.

## BLoC Architecture

The BLoC architecture consists of three primary layers that work together to manage the flow of data and business logic in a Flutter application.

*   UI/Presentation layer:
    
    *   It listens to state changes from the BLoC and updates the UI accordingly.
        
    *   It handles user input and triggers events that are sent to the BLoC for processing.
        
*   BLoC (Business logic layer)
    
    *   Intermediary between the UI and Data layers which processes incoming events from the UI, applies business logic, and emits new states based on those events.
        
    *   It manages the flow of data and ensures that the UI reflects the current state of the application.
        
*   Data Layer
    
    *   It fetches, stores, and updates data as required by the business logic.
        

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1728665522146/d8e77399-34eb-4d89-b602-fd183ceda5b5.png align="center")

Let’s start with the Data layer first and build upon it to the UI layer.

### Data Layer

The data layer is further divided into 3 parts

*   Models
    
*   Data Providers
    
*   Repositories
    

Let’s zoom into Models to simplify things.

Models are like blueprints or templates for the data that your application uses. They help define what information you need to work with and how that information is organized. It’s essentially a Class.

Think of a model as a way to describe specific types of information an app needs. For example, we might have a **Weather model** that includes details like Temperature, Humidity, wind speed, city, etc.

Models often help convert data from one format to another. When a weather app fetches data from an API (like a JSON response), the model can turn that data into something the app can use easily. For example, converting the JSON fields for temperature and condition into properties of your Weather model.

Now Let’s talk about Data providers and repositories:

It is essentially an API for your app. It has multiple methods to access data and communicate with the app layer. These methods won’t return the Model, but rather the type of raw data received from the API (let’s say a JSON string).

Repositories are basically a wrapper around Data providers to encapsulate them. The Repository abstracts these interactions, meaning it handles the details of how data is retrieved or stored without exposing those complexities to the rest of the app. It’s only here, that we will instantiate the model object. and this will be send to the business logic layer.

### BLoC & UI layer

Now the bloc can be depended on the repository layer to build and emit a state. The interesting thing is that Blocs can communicate with one another. Let’s say we have two blocs, the first one about weather data, and another one about the internet state. We can subscribe to the stream of internet status in the weather bloc so that we can omit different states if there is no internet while accessing weather data, though we might be required to close the stream manually to prevent stream leaks.

Here are some naming conventions according to what we learned:

```plaintext
lib/
├── main.dart
├── data/
│   ├── models/
│   ├── data_providers/
│   └── repositories/
├── business_logic/
│   ├── cubits/
│   └── blocs/
└── presentation/
    ├── screens/
    └── pages/
```

## BLoC Testing

Testing helps identify defects early in the development lifecycle when they are cheaper to fix. This reduces risks related to software quality, security, and performance.

Test files are created under a folder called `test` at the same hierarchy as the `lib` folder. For our app, here is the directory hierarchy:

```plaintext
test/
├── cubit/
│   ├── counter_cubit_test.dart
```

To get started we will create a `group` function, it’s used to create a named group of tests that share a common context or setup. By grouping related tests together, you make it easier for anyone reading the test file (including your future self) to understand the purpose of each test and how they relate to one another.

```dart
void main() {
  group("CounterCubit", () {});
}
```

It takes two parameters, first is the description and second is an anonymous function.

```dart
group("CounterCubit", () {
    CounterCubit? counterCubit;
    setUp(() {
      counterCubit = CounterCubit();
    });
    tearDown(() {
      counterCubit!.close();
    });
  });
```

We need an instance of the Counter cubit. Next, we need two functions, `setUp` and `tearDown`.

*   The `setUp` function initializes a new instance of `CounterCubit` before each test run.
    
*   The `tearDown` function closes the cubit after each test to clean up resources.
    

Here is a test:

```dart
test("checking for initial state", () {
  expect(counterCubit!.state, CounterState(counterValue: 0));
});
```

`test` function also accepts a description and a function, in the closure, we have a `except` function, The `expect` function is used to assert that a certain condition holds true. It takes two arguments:

*   The first argument is the actual value you want to check—in this case, `counterCubit!.state`.
    
*   The second argument is the expected value—here, it’s `CounterState(counterValue: 0)`.
    

But we will experience something like this as an error:

```dart
Expected: <Instance of 'CounterState'>
Actual: <Instance of 'CounterState'>
```

*   The test is comparing two different instances of `CounterState`. Even if both instances are the same `counterValue`, they are stored in different memory locations.
    
*   Since the default implementation of `==` checks for reference equality, it returns `false` when comparing these two different instances, leading to a failed test.
    

To solve this, we need to override the `==` operator and the `hashCode` getter in the `CounterState` class.

```dart
@override
bool operator ==(Object other) {
  if (identical(this, other)) return true; 
  // Check if they are the same instance
  if (other is! CounterState) return false; 
  // Check if 'other' is not a CounterState
  return counterValue == other.counterValue; 
  // Compare based on counterValue
}
```

Now the test should successfully run. The next step is to write Bloc tests.

Here is a `blocTest`

```dart
blocTest<CounterCubit, CounterState>(
  'emits [CounterState(count: 1)] when increment event is added',
   build: () => counterCubit!,
   act: (cubit) => cubit.increment(),
   expect: () => [CounterState(counterValue: 1, 
                  ifIncremented: true)],
);
```

The `blocTest` function is part of the `bloc_test` package in Dart and Flutter, designed to simplify the process of unit testing BLoCs

*   **Build**: It initializes a new instance of `CounterCubit`.
    
*   **Action**: It simulates an increment action by calling the `increment()` method on the cubit.
    
*   **Expectation**: It checks that after performing the increment action, the cubit emits a new state with specific values (`counterValue: 1` and `ifIncremented: true`).
    

## Navigation with BLoC

As we know, when we wrap a widget with `BlocProvider`, the Bloc instance is available in the widget tree below it. However when the new screen is pushed, a new `BuildContext` is generated, hence the bloc instance is no longer available. Hence we need to manually pass the instance using `BlocProvider.value`.

We can make a new screen and change the file hierarchy with respect to the previously discussed BLoC artitechture.

```plaintext
lib/
├── logic/
│   └── cubit/
│       ├── counter_cubit.dart
│       └── counter_state.dart
├── presentation/
│   ├── home.dart
│   └── second_screen.dart
└── main.dart
```

Before proceeding, one should have basic knowledge about navigating in flutter, including, anonymous, name, and generative navigators.

### Anonymous navigators

Here is the implementation for anonymous navigators:

```dart
onPressed: () {
   Navigator.pushReplacement(
            context,
            MaterialPageRoute(
               builder: (_) => BlocProvider.value(
                   value: BlocProvider.of<CounterCubit>(context),
                   child: const SecondScreen(
                             title: "second screen",
                             color: Colors.redAccent),
   )));
}
```

Here we are simply injecting the old instance of the cubit into the new screen with a new context.

Here are some Naive mistakes:

**#1:**

```dart
onPressed: () {
   Navigator.pushReplacement(
            context,
            MaterialPageRoute(
               builder: (_) => BlocProvider.value(
                   value: CounterCubit(),
                   child: const SecondScreen(...),
   )));
}
```

Here one might accidentally provide a new instance of `CounterCubit` instead of the pre-existing one, leading to creation of a new Cubit, leakage of memory and undefined behavior.

**#2:**

```dart
onPressed: () {
   Navigator.pushReplacement(
            context,
            MaterialPageRoute(
               builder: (context) => BlocProvider.value(
                   value: BlocProvider.of<CounterCubit>(context),
                   child: const SecondScreen(...),
   )));
}
```

If we carefully watch, we are accessing the cubit with `BuildContext` name `context`. The `BlocProvider` will naturally look for the nearest context, and find the `BuildContext` in which we are building the new screen which is also named `context` and within that context, we don’t have any Cubit defined. Hence we either need to change the name of the context which is being built with some other name, or just assign `_` as an argument, because this `BuildContext` won’t be used in this screen. The correct code can be referred to as the original one.

### Named navigators

Here is a simple implementation of named navigation

Create a cubit instance inside the `MyApp` widget where we will define our routes.

```dart
final CounterCubit _cubit = CounterCubit();
```

define the `routes` parameter inside `MaterialApp`:

```dart
initialRoute: '/',
routes: {
  '/': (context) => BlocProvider.value(
   value: _cubit,
   child: const HomeScreen(title: "home", 
             color: Colors.blueAccent)),
  '/second': (context) => BlocProvider.value(
   value: _cubit,
   child: const SecondScreen(title: "second", 
             color: Colors.redAccent)),
},
```

Simply change the push replacement navigator to the named one.

```dart
Navigator.pushNamed(context, '/second');
```

But as we manually created an instance of the cubit, we need to manually dispose the cubit to avoid a memory leak.

```dart
  void dispose() {
    _cubit.close();
    super.dispose();
  }
```

### Generative navigators

Generative navigtors can also be implemented with `BlocProvider.value`. Make a folder and two files for the router to encapsulate everything. Generative navigators are the best kind for the same reason.

Here is the Router constants class

```dart
class RouterConstants {
  static const String home = '/';
  static const String secondScreen = '/second';
}
```

Here is the Route Generator itself:

```dart
class RouteGenerator {
  final CounterCubit _cubit = CounterCubit();
  Route<dynamic> generate(RouteSettings settings) {
    final args = settings.arguments;
    final name = settings.name;

    switch (name) {
      case RouterConstants.home:
        return MaterialPageRoute(
            builder: (_) =>
                BlocProvider.value(
                    value: _cubit, 
                    child: const HomeScreen()));
      case RouterConstants.secondScreen:
        if (args is Color?) {
          return MaterialPageRoute(
              builder: (_) => BlocProvider.value(
                  value: _cubit, 
                  child: SecondScreen(color: args as Color)));
        }
        break;
    }
    return MaterialPageRoute(
        builder: (_) =>
            BlocProvider.value(
                value: _cubit, 
                child: const HomeScreen()));
  }
  void dispose() {
    _cubit.close();
  }
}
```

Similarly, a Cubit instance can be initialized within the class, and the instance can be fed to, `BlocProvider.value` wrapped on the screen where we are pushing the screen.

The old route map can be removed completely, and can be replaced with

```dart
onGenerateRoute: _router.generate
```

after the instance of the router generator class is created:

```dart
final RouteGenerator _router = RouteGenerator();
```

The old navigator can also be replaced and the args can also be passed:

```dart
Navigator.pushNamed(context, '/second',
                    arguments: Colors.redAccent);
```

This blog post serves as the first part of a two-part series focusing on the concepts of streams, futures, and state management using BLoC (Business Logic Component) and Cubit. Looking ahead, the second part of this series, titled **"Getting Cracked at BLoC,"** will explore advanced BLoC patterns and their integration into Flutter applications. This will include practical implementations and deeper insights into managing application state effectively.

Stay tuned for these upcoming discussions as we continue to unravel the intricacies of asynchronous programming and state management in Dart.

You can download the PDF format for this blog at [Gumroad](https://rishiahuja.gumroad.com/l/bloc1). Feel free to connect with me on my social media platforms:

*   [X](https://x.com/rishi2220)
    
*   [LinkedIn](https://www.linkedin.com/in/rishi-ahuja-b1a224310/).
    

Your thoughts and feedback are always appreciated!