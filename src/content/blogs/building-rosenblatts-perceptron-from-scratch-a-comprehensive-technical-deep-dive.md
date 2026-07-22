---
title: "Building Rosenblatt's Perceptron From Scratch in Flutter"
brief: "Technical blog implementing classic machine learning perceptron algorithm in Flutter with visual explanations."
dateAdded: 2025-02-27T00:00:00.000Z
hashnodeUrl: "https://rishi2220.hashnode.dev/building-rosenblatts-perceptron-from-scratch-a-comprehensive-technical-deep-dive"
readTimeInMinutes: 26
author: "Rishi Ahuja"
---
## Introduction: My Journey Into Neural Networks

A few months ago, I stumbled across a blog post about neural networks that mentioned something called a "perceptron." Despite having no formal machine learning training, I was immediately captivated by this computational model inspired by biological neurons, developed in the 1950s by Frank Rosenblatt. The concept seemed both elegant and foundational – a primitive neural network that could learn to classify patterns through an iterative training process.

Rather than using an existing ML framework like TensorFlow or PyTorch, I decided to build a perceptron from absolute scratch. This wasn't about creating the most efficient implementation; it was about truly understanding the fundamental mechanics of neural networks. This blog post documents my journey in excruciating detail – from mathematical foundations to implementation challenges to visual design decisions.

## Introduction to Rosenblatt’s perceptron

Imagine you're teaching a child to recognize different shapes - squares, triangles, and rectangles. At first, they don't know what to look for. You show them examples and gently correct them when they make mistakes. Eventually, they learn to recognize the important features of each shape.

A perceptron works in a surprisingly similar way. Developed in the 1950s by Frank Rosenblatt, it's one of the simplest forms of artificial intelligence - a basic neural network that can learn to recognize patterns.

Here's how it works in everyday terms:

1.  **Input**: The perceptron receives information - in our case, a simple drawing of a shape represented as a grid of pixels (little squares that are either "on" or "off").
    
2.  **Processing**: The perceptron has connections between these inputs and its "brain" (hidden layer). Each connection has a different importance or "weight" - just like how the straight edges of a shape might be more important for recognizing it than random dots.
    
3.  **Output**: After processing the information, the perceptron makes a guess: "Is this a square, triangle, or rectangle?"
    
4.  **Learning**: This is the magic part! If the perceptron guesses wrong, it adjusts those connection weights. Features that led to the wrong answer become less important, and features that would have led to the right answer become more important.
    

In my project, I built a perceptron with three layers:

*   An input layer that "sees" a 5×5 grid drawing
    
*   A hidden layer that processes this information
    
*   An output layer with three "neurons" - one each for square, triangle, and rectangle
    

After showing it hundreds of examples, the perceptron gradually improves, eventually reaching about 80% accuracy. The fascinating part is watching the learning happen in real-time - the connections visually change as the perceptron figures out which features matter for identifying different shapes.

All modern AI and neural networks, despite their complexity, build upon this same fundamental principle: learn from examples by adjusting connection strengths based on mistakes.

## The Mathematical Foundations of Perceptrons

Before diving into code, let's establish the mathematical model that powers a perceptron:

### The Single Perceptron Model

A perceptron takes multiple binary inputs x₁, x₂, ..., xₙ and produces a single binary output:

```dart
output = { 1 if w₁x₁ + w₂x₂ + ... + wₙxₙ + b > 0
         { 0 otherwise
```

Where:

*   w₁, w₂, ..., wₙ are weights (real numbers expressing the importance of inputs)
    
*   b is the bias (a measure of how easy it is to get the perceptron to output a 1)
    

For a more flexible neural network, we replace the step function with a sigmoid activation function:

```dart
σ(z) = 1 / (1 + e^(-z))
```

Where z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b

The sigmoid function maps any real value to a range between 0 and 1, which we can interpret as a probability or activation level.

### Multi-Layer Perceptron

A single perceptron can only learn linearly separable patterns. To recognize more complex patterns (like geometric shapes), we need a multi-layer architecture:

1.  **Input Layer**: Neurons that represent our input features (pixels in our shape grid)
    
2.  **Hidden Layer(s)**: Neurons that transform the input in complex ways
    
3.  **Output Layer**: Neurons that provide classification decisions
    

## The Complete Architecture Design

For my shape recognition task, I designed a three-layer network:

1.  **Input Layer (Sensory)**: 5×5 grid (25 neurons) representing a binary image of a shape
    
2.  **Hidden Layer (Association)**: 20 neurons to process the input information
    
3.  **Output Layer (Response)**: 3 neurons, each corresponding to a specific shape
    
    *   First neuron: Square (target output: \[1,0,0\])
        
    *   Second neuron: Triangle (target output: \[0,1,0\])
        
    *   Third neuron: Rectangle (target output: \[0,0,1\])
        

The connectivity between layers is crucial:

*   Each sensory neuron connects to approximately 25% of association neurons (randomly assigned)
    
*   Each association neuron connects to all three response neurons
    

This partial connectivity in the first layer introduces a form of regularization that helps the network generalize better.

## Meet “NumD“

The perceptron implementation uses my custom-built numerical computing library for Dart called "numd" (available at [pub.dev/packages/numd](http://pub.dev/packages/numd)[)](https://pub.dev/packages/numd). I created numd because Dart lacked a robust matrix operation library comparable to Python's numpy, which is essential for neural network computations. The library provides N-dimensional array operations, matrix multiplication, and other mathematical functions needed for implementing neural networks. With numd providing the mathematical foundation, I was able to build this perceptron from scratch, focusing on making every aspect of the neural network's operation visible and interactive rather than treating it as a black box.

## Designing the Neural Network Implementation

With NumD in place, I could implement the neural network architecture for the perceptron. The implementation centers around three key components:

### 1\. Network Initialization and Structure

The network is initialized with empty layers and random connection weights:

```dart
// Initialize network layers
var sensory = NDArray<double>.init([
  [0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0],
]);

var association = NDArray<double>.init(
  List.generate(ASSOCIATION_UNITS, (i) => [0.0])
);

var response = NDArray<double>.init([
  [0.0], // Square
  [0.0], // Triangle
  [0.0], // Rectangle
]);

// Connection data structures
final List<Connection> associationConnections = [];
final List<Connection> responseConnections = [];
```

### 2\. Connection Generation: The Heart of the Perceptron

At the core of my perceptron implementation is the `Connection` class, which represents the links between neurons. Each connection stores:

*   Source and target neuron identifiers
    
*   The visual positions (coordinates) for drawing
    
*   A weight value that determines the connection strength
    
*   Visual properties like color and line width
    
    ```dart
    class Connection {
      final String sourceId;
      final String targetId;
      final Offset source;
      final Offset target;
      final Color color;
      final double width;
      double weight;
      final bool showWeight;
    
      Connection({
        required this.sourceId,
        required this.targetId,
        required this.source,
        required this.target,
        required this.color,
        this.width = 5.0,
        required this.weight,
        this.showWeight = false,
      });
    }
    ```
    

The connection generation process is particularly important because it establishes the network structure. Rather than fully connecting every neuron (which would create too many connections to visualize clearly), I implemented a partial connectivity approach:

```dart
void generateAssociationConnections() {
  final random = math.Random();
  associationConnections.clear();

  for (int i = 0; i < sensory.rows; i++) {
    for (int j = 0; j < sensory.cols; j++) {
      // Each sensory unit connects to about 25% of association units
      int numConnections = (ASSOCIATION_UNITS * 0.25).round();
      List<int> targetUnits = List.generate(ASSOCIATION_UNITS, (i) => i);
      targetUnits.shuffle(random);
      targetUnits = targetUnits.sublist(0, numConnections);

      for (int targetUnit in targetUnits) {
        // Create connection with random initial weight
        final weight = -0.5 + random.nextDouble(); // Range: -0.5 to 0.5
        
        // Add connection with visual properties
        associationConnections.add(Connection(
            sourceId: '$i-$j',
            targetId: '$targetUnit-0',
            source: sourceCenter,
            target: associationTargetCenter,
            width: 1.5,
            weight: weight,
            color: weight > 0 ? AppColors.green : AppColors.red));
      }
    }
  }
}
```

This approach ensures that:

1.  Each input neuron connects to only 25% of hidden neurons (randomly selected)
    
2.  Initial weights are small random values between -0.5 and 0.5
    
3.  Connections have visual properties that reflect their weights (green for positive, red for negative)
    

During training, these connections are the elements that actually "learn" - their weights are adjusted based on errors in the network's predictions. The color and thickness of the connections change visually as the network learns, providing a direct visualization of the learning process.

### 3\. Forward Pass: Information flow

The forward pass is where the actual "thinking" happens in our perceptron. This process takes our input (the shape pattern) and calculates the output (what shape the network thinks it is).

Here's how the `forwardPass` method works in plain language:

```dart
void forwardPass(NDArray input) {
  // Process input through hidden layer
  for (int i = 0; i < association.rows; i++) {
    double sum = 0.0;
    final incomingConns = getIncomingConnectionsL1('$i-0');

    for (var conn in incomingConns) {
      final sourceIndices = conn.sourceId.split('-');
      final sourceRow = int.parse(sourceIndices[0]);
      final sourceCol = int.parse(sourceIndices[1]);
      sum += conn.weight * input.at(sourceRow, sourceCol);
    }

    // Apply sigmoid activation function
    association[i][0] = sigmoid(sum);
  }

  // Process hidden layer outputs through output layer
  for (int i = 0; i < response.rows; i++) {
    double sum = 0.0;
    final incomingConns = getIncomingConnectionsL2('$i-0');

    for (var conn in incomingConns) {
      final sourceIndices = conn.sourceId.split('-');
      final sourceRow = int.parse(sourceIndices[0]);
      sum += conn.weight * association.at(sourceRow, 0);
    }

    // Apply sigmoid activation function
    response[i][0] = sigmoid(sum);
  }
}
```

This method does two main things:

1.  **Processing the Hidden Layer**: For each hidden neuron, it:
    
    *   Finds all connections coming into that neuron
        
    *   Multiplies each input value by its connection weight
        
    *   Adds these values together to get a sum
        
    *   Transforms this sum using the sigmoid function to get a value between 0 and 1
        
2.  **Processing the Output Layer**: Similarly, for each output neuron, it:
    
    *   Calculates the weighted sum of all hidden neuron values
        
    *   Applies sigmoid to get the final output value
        

The sigmoid function is a special mathematical formula that squashes any number into a value between 0 and 1:

```dart
double sigmoid(double x) {
  return 1.0 / (1.0 + math.exp(-x));
}
```

This is crucial because it allows the network to make decisions - values close to 1 mean "yes, this is that shape" while values close to 0 mean "no, this is not that shape."

## Training Data Generation

To train the network effectively, I needed diverse training examples. I implemented a `ShapeGenerator` class that creates variations of basic shapes:

```dart
class ShapeGenerator {
  static const int MATRIX_SIZE = 5;
  static final math.Random _random = math.Random();

  // Base patterns for shapes
  static final List<List<List<double>>> squarePatterns = [
    [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    // Additional square patterns...
  ];

  static final List<List<List<double>>> trianglePatterns = [
    [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    // Additional triangle patterns...
  ];

  static final List<List<List<double>>> rectanglePatterns = [
    [
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    // Additional rectangle patterns...
  ];

  static List<TrainingPattern> generateTrainingSet({int variationsPerPattern = 100}) {
    final patterns = <TrainingPattern>[];

    void addShapeVariations(List<List<List<double>>> basePatterns, String label,
        List<List<double>> output) {
      for (var pattern in basePatterns) {
        for (int i = 0; i < variationsPerPattern; i++) {
          patterns.add(_generateVariation(pattern, label, output));
        }
      }
    }

    // Generate variations for each shape type
    addShapeVariations(squarePatterns, 'Square', [[1.0], [0.0], [0.0]]);
    addShapeVariations(trianglePatterns, 'Triangle', [[0.0], [1.0], [0.0]]);
    addShapeVariations(rectanglePatterns, 'Rectangle', [[0.0], [0.0], [1.0]]);

    // Shuffle to avoid order-based bias during training
    patterns.shuffle(_random);
    return patterns;
  }

  // Generate a variation of a base pattern with random transformations
  static TrainingPattern _generateVariation(List<List<double>> basePattern,
      String label, List<List<double>> expectedOutput) {
    var matrix = List.generate(MATRIX_SIZE,
        (i) => List.generate(MATRIX_SIZE, (j) => basePattern[i][j]));

    // Apply random transformations
    if (_random.nextBool()) {
      matrix = _flipHorizontal(matrix);
    }
    if (_random.nextBool()) {
      matrix = _flipVertical(matrix);
    }

    return TrainingPattern(
        label: label,
        input: NDArray.init(matrix),
        expectedOutput: NDArray.init(expectedOutput));
  }

  // Utility methods for transformations
  static List<List<double>> _flipHorizontal(List<List<double>> matrix) {
    return List.generate(
        MATRIX_SIZE,
        (i) => List.generate(MATRIX_SIZE, (j) => matrix[i][MATRIX_SIZE - 1 - j]));
  }

  static List<List<double>> _flipVertical(List<List<double>> matrix) {
    return List.generate(
        MATRIX_SIZE,
        (i) => List.generate(MATRIX_SIZE, (j) => matrix[MATRIX_SIZE - 1 - i][j]));
  }
}
```

The shape generator creates variations using horizontal and vertical flips, producing different orientations of the same basic shapes. This helps the network learn the essential features of each shape rather than just memorizing specific examples.

For each shape category, I defined multiple base patterns to capture different styles and positions. For instance, the square patterns include squares in different corners of the grid and with different sizes.

## The Learning Algorithm: Backpropagation in Detail

The most fascinating part of my perceptron implementation is how it actually learns. The `adjustWeights` method implements backpropagation - the algorithm that allows neural networks to learn from their mistakes.

Here's the detailed implementation:

```dart
void adjustWeights(TrainingPattern pattern) {
  // First, run the input through the network
  forwardPass(pattern.input);

  // STEP 1: Adjust output layer weights
  for (int i = 0; i < response.rows; i++) {
    double actual = response[i][0];      // What the network predicted
    double expected = pattern.expectedOutput[i][0];  // What it should have predicted
    double error = expected - actual;    // The difference (error)
    
    // STEP 2: Calculate how much to change weights based on this error
    // This formula comes from calculus (derivative of sigmoid function)
    double delta = error * actual * (1 - actual); 

    // Find all connections coming into this output neuron
    final incomingConns = getIncomingConnectionsL2('$i-0');
    for (var conn in incomingConns) {
      // Get the activity level of the hidden neuron that's sending info
      final sourceIndices = conn.sourceId.split('-');
      final sourceRow = int.parse(sourceIndices[0]);
      final associationActivity = association[sourceRow][0];

      // Find this connection in our list
      int connectionIndex = responseConnections.indexWhere(
          (c) => c.sourceId == conn.sourceId && c.targetId == conn.targetId);

      if (connectionIndex != -1) {
        // STEP 3: Calculate weight update using the magic formula
        // Δw = learning_rate * error_signal * input_activation
        double weightUpdate = learningRate * delta * associationActivity;
        double newWeight = responseConnections[connectionIndex].weight + weightUpdate;

        // Update the connection with its new weight and color
        setState(() {
          responseConnections[connectionIndex] = Connection(
              sourceId: conn.sourceId,
              targetId: conn.targetId,
              source: conn.source,
              target: conn.target,
              width: conn.width,
              weight: newWeight,
              showWeight: true,
              color: newWeight > 0 ? AppColors.green : AppColors.red);
        });
      }
    }
  }

  // STEP 4: Now adjust hidden layer weights (a bit simplified)
  for (var conn in associationConnections) {
    // Get info about this connection
    final sourceIndices = conn.sourceId.split('-');
    final targetIndices = conn.targetId.split('-');
    final sourceRow = int.parse(sourceIndices[0]);
    final sourceCol = int.parse(sourceIndices[1]);
    final targetRow = int.parse(targetIndices[0]);

    // Get the input value and hidden neuron output
    double input = sensory[sourceRow][sourceCol];
    double output = association[targetRow][0];
    
    // Simplified error calculation for hidden layer
    double delta = output * (1 - output);
    double weightUpdate = learningRate * delta * input;

    // Update the connection weight
    setState(() {
      conn.weight += weightUpdate;
    });
  }
}
```

Here's what makes this algorithm amazing:

1.  **The Error Signal**: The network compares what it predicted (`actual`) with what it should have predicted (`expected`). This difference is the error signal that drives learning.
    
2.  **The Delta Formula**: The `delta = error * actual * (1 - actual)` formula comes from calculus. It's the derivative of the sigmoid function, which tells us how sensitive the output is to changes in the input. This is crucial because:
    
    *   If the neuron is very certain (output close to 0 or 1), it will learn more slowly
        
    *   If the neuron is uncertain (output around 0.5), it will learn more quickly
        
3.  **Weight Update Rule**: The formula `weightUpdate = learningRate * delta * associationActivity` determines how much to change each weight:
    
    *   `learningRate` controls the speed of learning (I set it to 1 to make changes more visible)
        
    *   `delta` is the error signal combined with the sensitivity factor
        
    *   `associationActivity` ensures that connections from active neurons get adjusted more
        
4.  **Visual Feedback**: Every time a weight changes, I update the connection's color and width:
    
    *   Green for positive weights (excitatory connections)
        
    *   Red for negative weights (inhibitory connections)
        
    *   Thicker lines for stronger weights
        

The backpropagation algorithm has a beautiful mathematical property: it efficiently distributes blame for errors. If the network mistakes a triangle for a square, it doesn't just randomly adjust weights. It precisely identifies which connections contributed most to the error and adjusts them accordingly.

I implemented a simplified version of backpropagation for the hidden layer weights to keep the visualization clear, but the principle is the same - weights are adjusted based on how much they contributed to the error.

The `learningRate` of 1.0 is higher than what would typically be used in production neural networks (where 0.01-0.1 is more common), but I chose this value to make the learning process more visually dramatic. In practice, a learning rate that decreases over time often gives better results.

Through this weight adjustment process, repeated over thousands of examples, the network gradually shapes its internal connections to distinguish between different shapes - essentially learning what features define a square versus a triangle versus a rectangle.

## The Training Process

The training process runs multiple epochs, where each epoch processes the entire training dataset:

```dart
Future<void> trainNetwork(int epochs) async {
  // Start a timer to track how long training takes
  trainingStartTime = DateTime.now();
  _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
    if (trainingStartTime != null) {
      final duration = DateTime.now().difference(trainingStartTime!);
      setState(() {
        elapsedTime =
            '${duration.inMinutes}:${(duration.inSeconds % 60).toString().padLeft(2, '0')}';
      });
    }
  });

  try {
    // Run through the specified number of training epochs
    for (int epoch = 0; epoch < epochs; epoch++) {
      setState(() {
        // Update progress indicators
        trainingProgress =
            '${((epoch + 1) / epochs * 100).toStringAsFixed(1)}%';
        currentStatus = 'Training epoch ${epoch + 1}/$epochs';
      });
      // Train for one complete epoch
      await trainOneEpoch();
      // Short delay to allow UI to update
      await Future.delayed(const Duration(milliseconds: 10));
    }
  } finally {
    // Clean up timer when done
    _timer?.cancel();
  }
}
```

This main training function manages the overall process, running for a set number of epochs (I typically use 15). Each epoch is a complete pass through the entire training dataset. The function also handles timing and progress tracking to give visual feedback during training.

The heart of training happens in the `trainOneEpoch` method:

```dart
Future<void> trainOneEpoch() async {
  int correct = 0;
  int total = 0;

  // Process each training example
  for (var pattern in trainingData) {
    // Update the input layer to show this pattern
    setState(() {
      sensory = pattern.input;
    });
    total++;
    
    // Run the pattern through the network
    forwardPass(pattern.input);

    // Check if the prediction was correct
    bool isCorrect = true;
    for (int i = 0; i < response.rows; i++) {
      double predicted = response[i][0] > 0.5 ? 1.0 : 0.0;
      double expected = pattern.expectedOutput[i][0];

      if ((predicted > 0.5 && expected < 0.5) ||
          (predicted < 0.5 && expected > 0.5)) {
        isCorrect = false;
        break;
      }
    }

    // Count correct predictions
    if (isCorrect) correct++;

    // Adjust weights based on errors
    adjustWeights(pattern);

    // Update accuracy metrics and chart
    setState(() {
      currentAccuracy = (correct / total) * 100;
      currentStatus = 'Accuracy: ${currentAccuracy.toStringAsFixed(2)}%';

      // Add point to accuracy chart
      accuracyPoints.add(FlSpot(dataPoint.toDouble(), currentAccuracy));
      dataPoint++;

      // Keep chart data from growing too large
      if (accuracyPoints.length > 500) {
        accuracyPoints.removeAt(0);
      }
    });

    // Allow UI to refresh periodically
    if (total % 10 == 0) {
      await Future.delayed(const Duration(milliseconds: 5));
    }
  }
}
```

This function:

1.  **Processes Each Example**: It loops through every training pattern, showing it to the network.
    
2.  **Checks Accuracy**: After the network makes a prediction, it checks if the prediction is correct. A prediction is considered correct if:
    
    *   Output neurons that should be active (expected = 1) have values > 0.5
        
    *   Output neurons that should be inactive (expected = 0) have values <= 0.5
        
3.  **Updates Weights**: It calls `adjustWeights()` to improve the network's performance in this example.
    
4.  **Tracks Progress**: It calculates the current accuracy as a percentage of correct predictions and updates the chart.
    
5.  **Maintains Responsiveness**: It periodically allows the UI to update so the user can see the training process.
    

The thresholding at 0.5 is important - it converts the sigmoid outputs (which are between 0 and 1) into binary decisions. This means that for a square, the ideal output would be \[1,0,0\], but the network is considered correct if it outputs something like \[0.7, 0.3, 0.2\] since after thresholding this becomes \[1,0,0\].

As training progresses, you can observe several fascinating patterns:

1.  **Initial Rapid Improvement**: In early epochs, accuracy typically jumps quickly from ~33% (random guessing) to 60-70%.
    
2.  **Plateaus**: The network often gets stuck at certain accuracy levels before suddenly improving.
    
3.  **Pattern Recognition**: Eventually the network reaches about 80% accuracy, meaning it can correctly identify most shape examples.
    
4.  **Visual Learning**: The connections visibly change - with some becoming strongly positive (green), others strongly negative (red), and many weak connections fading away.
    

The training process is deliberately slowed down to make it visible, allowing you to see the "thought process" of the neural network as it gradually builds an internal model of what defines each shape.

## Visualization: Making Neural Networks Transparent

One of my primary goals was to demystify neural networks by visualizing every component. The visualization includes:

### 1\. Neural Units

Each neuron is represented by a circular widget with its activation value:

```dart
class Unit extends StatelessWidget {
  final double value;
  final List<Connection> connections;
  final Function(dynamic)? onHover;
  final Function() onClick;

  const Unit({
    super.key,
    required this.value,
    required this.connections,
    this.onHover,
    required this.onClick,
  });

  @override
  Widget build(BuildContext context) {
    // Create tooltip message from connections
    String tooltipMessage = connections.isEmpty
        ? 'No connections'
        : connections
            .map((conn) =>
                'Source: ${conn.sourceId} -> Target: ${conn.targetId} (Weight: ${conn.weight})')
            .join('\n');

    return GestureDetector(
      onTap: () => onClick.call(),
      child: MouseRegion(
        onEnter: (_) => onHover?.call(true),
        onExit: (_) => onHover?.call(false),
        child: Tooltip(
          message: tooltipMessage,
          waitDuration: const Duration(milliseconds: 500),
          showDuration: const Duration(seconds: 2),
          textStyle: const TextStyle(
            color: Colors.white,
            fontSize: 14,
          ),
          decoration: BoxDecoration(
            color: AppColors.primary.withOpacity(0.9),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Container(
            alignment: Alignment.center,
            width: AppConstants.unitSize,
            height: AppConstants.unitSize,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Color.lerp(
                Colors.grey[400],
                Colors.white,
                value.clamp(0.0, 1.0),
              ),
              border: Border.all(color: AppColors.primary, width: 6),
            ),
            child: Text(
              value.toStringAsFixed(1),
              style: Theme.of(context).textTheme.displayMedium?.copyWith(
                    color: AppColors.background,
                  ),
            ),
          ),
        ),
      ),
    );
  }
}
```

The `Unit` widget is the visual representation of a neuron in the network. Here's what makes it special:

1.  **Interactive Visualization**: Each neuron is a clickable circle showing its activation value (from 0.0 to 1.0).
    
2.  **Visual Activation**: The brightness of the circle directly represents the neuron's activation level - this is handled by the `Color.lerp` function that creates a gradient from gray to white based on the neuron's value.
    
3.  **Value Clamping**: The `value.clamp(0.0, 1.0)` ensures that the activation value stays within the 0-1 range for visual consistency, even if unexpected values occur during training.
    
4.  **Connection Information**: Hovering over any neuron shows a tooltip with detailed information about all its connections - where they come from, where they go, and their weight values.
    
5.  **Interactive Input**: Clicking on neurons in the input layer toggles their values between 0 and 1, allowing users to draw their own patterns and see how the network responds.
    

The rest of the visualization system is equally important but conceptually simpler:

1.  **Connection Visualization**: Arrows show the direction of information flow, with color (green/red) indicating positive/negative weights and line thickness representing connection strength.
    
2.  **Real-time Training Display**: A chart plots accuracy over time, allowing users to see the learning curve as the network improves.
    
3.  **Progress Indicators**: Labels show training progress, elapsed time, and current accuracy.
    

The entire visualization creates a system where nothing is hidden. You can see:

*   What information is being processed (input layer)
    
*   How that information is being transformed (hidden layer)
    
*   What decision the network is making (output layer)
    
*   Which connections are strengthening or weakening during learning
    
*   How accuracy improves over time
    

This visual approach makes neural networks much more approachable and understandable. Rather than just seeing input go in and output come out, you can witness the entire learning process unfold - seeing which features become important for recognizing different shapes and how the network's internal representation evolves.

The clamping of values is particularly important for the visualization. While sigmoid activation functions naturally produce values between 0 and 1, I added explicit clamping as a safeguard to ensure the visual representation remains consistent even during the early chaotic phases of training when weights might produce extreme values.

### 2\. Connections with Weight Visualization

A crucial part of making the perceptron understandable is visualizing the connections between neurons. The `ArrowPainter` class handles this by drawing arrows that represent the weighted connections in the network:

```dart
class ArrowPainter extends CustomPainter {
  final Offset start;
  final Offset end;
  final Color color;
  final double strokeWidth;
  final double weight;
  final bool? showWeight;

  ArrowPainter({
    required this.start,
    required this.end,
    this.color = Colors.white,
    this.strokeWidth = 2.0,
    required this.weight,
    this.showWeight
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    canvas.drawLine(start, end, paint);

    if (showWeight ?? false) {
      final textSpan = TextSpan(
        text: weight.toStringAsFixed(2),
        style: TextStyle(
          color: Colors.white,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      );
      final textPainter = TextPainter(
        text: textSpan,
        textDirection: TextDirection.ltr,
      );
      textPainter.layout();

      final angle = math.atan2(end.dy - start.dy, end.dx - start.dx);

      final random = math.Random();
      final ratio = random.nextBool()
          ? 0.2 + random.nextDouble() * 0.1
          : 0.4 + random.nextDouble() * 0.1;

      // Calculate position along the line
      final posX = start.dx + (end.dx - start.dx) * ratio;
      final posY = start.dy + (end.dy - start.dy) * ratio;

      final perpOffset = 15.0;
      final textOffset = Offset(
          posX - textPainter.width / 2 - perpOffset * math.sin(angle),
          posY - textPainter.height / 2 + perpOffset * math.cos(angle));

      canvas.save();
      canvas.translate(textOffset.dx, textOffset.dy);
      if (angle.abs() < math.pi / 4) {
        canvas.rotate(angle);
      }
      textPainter.paint(canvas, Offset.zero);
      canvas.restore();
    }

    // Calculate the arrow head
    final double arrowSize = 10.0;
    final double angle = math.atan2(end.dy - start.dy, end.dx - start.dx);
    final Path arrowPath = Path();

    arrowPath.moveTo(end.dx, end.dy);
    arrowPath.lineTo(
      end.dx - arrowSize * math.cos(angle - math.pi / 6),
      end.dy - arrowSize * math.sin(angle - math.pi / 6),
    );
    arrowPath.lineTo(
      end.dx - arrowSize * math.cos(angle),
      end.dy - arrowSize * math.sin(angle),
    );
    arrowPath.lineTo(
      end.dx - arrowSize * math.cos(angle + math.pi / 6),
      end.dy - arrowSize * math.sin(angle + math.pi / 6),
    );
    arrowPath.close();

    paint.style = PaintingStyle.fill;
    canvas.drawPath(arrowPath, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
```

This visualization includes several key features:

1.  **Directional Arrows**: Each connection is drawn as an arrow pointing from the source neuron to the target neuron, showing the direction of information flow.
    
2.  **Color-Coded Weights**:
    
    *   Green lines represent positive weights (excitatory connections)
        
    *   Red lines represent negative weights (inhibitory connections)
        
    *   The intensity of the color reflects the magnitude of the weight
        
3.  **Weight Labels**: For important connections (particularly in the output layer), the numerical weight value is displayed directly on the connection. This helps users understand exactly how strong each connection is.
    
4.  **Strategic Placement**: The text labels are positioned using slightly randomized placements to prevent overlapping when many connections are close together.
    
5.  **Dynamic Updates**: As training progresses and weights change, the arrows update in real-time - changing color, thickness, and labels to reflect the network's evolving state.
    

The trigonometry used in this class (with functions like `math.atan2`, `math.sin`, and `math.cos`) handles the proper positioning and orientation of arrows and text labels regardless of the neurons' positions on screen.

This visual representation of connections is crucial for demystifying neural networks because it shows exactly how information flows through the system and which connections become more important during learning. When you see a strong green connection develop between a specific input pattern and the "square" output neuron, you're witnessing the network learning that this feature is strongly indicative of a square.

The combination of neurons (represented by the `Unit` class) and connections (represented by the `ArrowPainter` class) creates a complete visual model of the neural network that makes the abstract concept of "learning" tangible and observable.

### 3\. Real-time Training Metrics

I implemented a chart to track accuracy over time:

```dart
LineChart(
  LineChartData(
    gridData: FlGridData(show: true),
    titlesData: FlTitlesData(
      bottomTitles: AxisTitles(
        sideTitles: SideTitles(showTitles: false),
      ),
      leftTitles: AxisTitles(
        sideTitles: SideTitles(
          showTitles: true,
          interval: 20,
          reservedSize: 30,
        ),
      ),
      topTitles: AxisTitles(
        sideTitles: SideTitles(showTitles: false),
      ),
      rightTitles: AxisTitles(
        sideTitles: SideTitles(showTitles: false),
      ),
    ),
    borderData: FlBorderData(show: true),
    minX: accuracyPoints.isEmpty ? 0 : accuracyPoints.first.x,
    maxX: accuracyPoints.isEmpty ? 0 : accuracyPoints.last.x,
    minY: 0,
    maxY: 100,
    lineBarsData: [
      LineChartBarData(
        spots: accuracyPoints,
        isCurved: true,
        color: Colors.blue,
        dotData: FlDotData(show: false),
        belowBarData: BarAreaData(
          show: true,
          color: Colors.blue.withOpacity(0.2),
        ),
      ),
    ],
  ),
)
```

The chart shows accuracy fluctuations during training, revealing the non-linear nature of neural network learning. Initial rapid improvements are followed by periods of plateau, occasionally broken by sudden jumps when the network overcomes local minima.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1740603532047/3f78df18-e403-4455-b6f4-8164a3cf16c0.png align="center")

## Testing the Network

After training, the network can classify new inputs. The `predictPattern` method takes a user-created input and runs it through the network:

```dart
void predictPattern(NDArray<double> userInput) {
  setState(() {
    sensory = userInput;
  });

  forwardPass(userInput);

  List<double> thresholdedResponse = [];
  String prediction = "";

  for (int i = 0; i < response.rows; i++) {
    thresholdedResponse.add(response[i][0] > 0.5 ? 1.0 : 0.0);
  }

  if (thresholdedResponse[0] == 1) {
    prediction = "Square";
  } else if (thresholdedResponse[1] == 1) {
    prediction = "Triangle";
  } else if (thresholdedResponse[2] == 1) {
    prediction = "Rectangle";
  } else {
    prediction = "Unknown Shape";
  }

  print('Network prediction: $prediction');
```

Now train it!

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1740603546412/23399e01-f8ab-4d25-b949-0dbd5f6069a6.png align="center")

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1740603548451/da2c09fd-0658-4795-90a4-801fe873bdd7.png align="center")

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1740603555446/f91dbb71-e5be-49eb-bdc4-fc0bfaabe05b.png align="center")

## Conclusion: Seeing Neural Networks With New Eyes

Building this perceptron from scratch has been an incredible journey of discovery. What started as curiosity about neural networks led to developing both a visual neural network simulator and a numerical computing library for Dart.

The most rewarding aspect wasn't just seeing the network achieve 80% accuracy in shape recognition, but watching the learning process unfold visually - seeing connections strengthen and weaken, neurons activate in patterns, and the gradual emergence of intelligence from randomness.

This project demonstrates that neural networks don't have to be mysterious black boxes. By visualizing every component and process, we can gain intuitive understanding of how these systems learn.

If you're interested in exploring this project further:

1.  **Try it yourself**: The complete source code is available on [GitHub](https://github.com/RishiAhuja/perceptron)
    
2.  **Explore NumD**: The numerical computing library that powers the calculations is available at [pub.dev/packages/numd](https://pub.dev/packages/numd)
    
3.  **Experiment**: Clone the repo and try modifying the network architecture, training data, or visualization
    

I hope this project inspires others to explore neural networks not just as tools to be used, but as systems to be understood. Sometimes building something from scratch, even when there are more efficient alternatives available, is the best way to truly understand how it works.

What started as reading a random blog post about perceptrons became a fascinating exploration of the foundations of machine learning - proving that you don't need to be an ML expert to start building and understanding these systems. You just need curiosity and a willingness to learn by doing.

And that's it! Thank you for taking the time to read through this exploration of building a perceptron from scratch. I hope you found these insights valuable, especially regarding how neural networks learn and process information. Understanding these fundamental concepts is crucial for anyone interested in AI and machine learning.

If you found this guide helpful, I'd love to connect:

*   [**X (formerly Twitter)**](https://x.com/rishi2220)
    
*   [LinkedIn](https://www.linkedin.com/in/rishi-ahuja-b1a224310/)
    
*   Portfolio: [rishia.in](http://rishia.in)
    

Happy coding!