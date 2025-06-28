# numd

A powerful numerical computing library for Dart that provides efficient N-dimensional array operations and linear algebra capabilities. The library is designed to offer an intuitive interface for mathematical computations while maintaining type safety and performance.

## Table of Contents
1. [Installation](#installation)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Core Concepts](#core-concepts)
5. [API Reference](#api-reference)
6. [Examples](#examples)
7. [Performance Considerations](#performance-considerations)
8. [Contributing](#contributing)

## Installation

Add this to your package's `pubspec.yaml` file:

```yaml
dependencies:
  numd: ^1.0.3
```

Then run:
```bash
dart pub get
```

## Features

- Generic N-dimensional array implementation supporting both integer and floating-point numbers
- Efficient memory management using nested lists
- Built-in array initialization methods (zeros, ones, random)
- Operator overloading for basic arithmetic operations
- Matrix multiplication support through LinearAlgebra utility class
- Type-safe operations with compile-time checking
- Intuitive API design following Dart conventions
- Copy constructor for deep copying arrays

## Getting Started

First, import the library:

```dart
import 'package:numd/numd.dart';

void main() {
  // Basic array creation
  var array = NDArray.init([
    [1, 2, 3],
    [4, 5, 6]
  ]);
  print(array);

  // Binary array with diagonal ones
  var diagonal = NDArray<int>.binary([3, 3], (i, j) => i == j);
  print(diagonal);

  // Random binary array
  var randomBinary = NDArray<int>.binaryRand([2, 2]);
  print(randomBinary);

  // Array operations
  var a = NDArray.ones([2, 2]);
  var b = NDArray.zeros([2, 2]);
  print(a + b);

  // Copy constructor
  var copy = NDArray.copy(array);
  print('Copy: $copy');
}
```

## Core Concepts

### NDArray<T>

The `NDArray<T>` class is the foundation of the library. It represents a multi-dimensional array where T must be a numeric type (int or double). Key features include:

- **Type Safety**: The generic type parameter T ensures type safety at compile time
- **Shape Information**: Maintains array dimensions through the shape property
- **Efficient Storage**: Uses nested Lists for data storage
- **Element Access**: Direct element access through the `at(i, j)` method

### Shape and Dimensions

Each NDArray maintains its shape as a List<int>:
- `shape[0]`: Number of rows
- `shape[1]`: Number of columns

Accessible through properties:
- `dimensions`: Total number of dimensions
- `rows`: Number of rows
- `cols`: Number of columns

### Type Checking

The library provides runtime type checking methods:
- `isInt()`: Returns true if the array contains integers
- `isEmpty()`: Checks if the array is empty
- `isDouble()`: Returns true if the array contains floating-point numbers

## API Reference

### Constructors

1. **NDArray.init(List<List<T>> nestedLists, {Type type = double})**
- Creates an NDArray from a nested list structure
   - Optional type parameter defaults to double

2. **NDArray.zeros(List<int> dimensions, {Type type = double})**
- Creates an NDArray filled with zeros
   - Dimensions specify the shape
   - Optional type parameter

3. **NDArray.ones(List<int> dimensions, {Type type = double})**
- Creates an NDArray filled with ones
   - Similar parameters to zeros constructor

4. **NDArray.random(List<int> dimensions, {double min = 0, double max = 1, Type type = double})**
- Creates an NDArray filled with random values
   - Supports custom range through min and max parameters
   - Optional type parameter

5. **NDArray.binary(List<int> dimensions, bool Function(int i, int j) condition, {Type type = double})**
- Creates a binary NDArray (0s and 1s) based on a condition function
   - Condition function determines placement of 1s
   - Optional type parameter

6. **NDArray.binaryRand(List<int> dimensions, {Type type = double})**
   - Creates a random binary NDArray
   - Randomly places 0s and 1s
   - Optional type parameter

7. **NDArray.copy(NDArray<T> other)**
   - Creates a deep copy of an existing NDArray
   - Maintains type safety with generic type T
   - Copies both shape and data
   - Returns new independent NDArray instance


### Operators

The library provides operator overloading for basic arithmetic operations:

- **Addition (+)**: Element-wise addition of two arrays
- **Subtraction (-)**: Element-wise subtraction
- **Multiplication (*)**: Element-wise multiplication
- **Division (/)**: Element-wise division
- Array access: `[]`, `[]=`

All operators verify shape compatibility and throw ArgumentError if shapes don't match.

### Methods

1. **at(int i, int j)**
   - Returns element at specified indices
   - Type-safe return value matching array type

2. **forEach(void Function(T element) action)**
   - Iterates through all elements
   - Accepts a callback function for element processing

### LinearAlgebra Utilities

The `LinearAlgebra` class provides additional matrix operations:

1. **matmul(NDArray a, NDArray b)**
   - Performs matrix multiplication
   - Verifies matrix dimension compatibility
   - Returns new NDArray with result

## Ex
### Basic Array Operations

```dart
// Create arrays
var a = NDArray.init([[1, 2], [3, 4]]);
var b = NDArray.init([[5, 6], [7, 8]]);

// Addition
var sum = a + b;
print(sum.toString());

// Matrix multiplication
var product = LinearAlgebra.matmul(a, b);
print(product.toString());
```

### Random Array Generation

```dart
// Create 3x3 random integer array
var randomInts = NDArray.random([3, 3], min: 1, max: 100, type: int);

// Create 2x2 random double array
var randomDoubles = NDArray.random([2, 2], min: 0, max: 1);
```

### Binary Array Generation

```dart
// Create a diagonal binary matrix
var diagonal = NDArray<int>.binary([3, 3], (i, j) => i == j);
print(diagonal);
// Output:
// [ 
//  [1, 0, 0],
//  [0, 1, 0],
//  [0, 0, 1]
// ]

// Create a random binary matrix
var randomBinary = NDArray<int>.binaryRand([2, 2]);
print(randomBinary);
// Possible output:
// [ 
//  [1, 0],
//  [0, 1]
// ]
```

## Example
amples

### Basic Array Operations

```dart
// Create arrays
var a = NDArray.init([[1, 2], [3, 4]]);
var b = NDArray.init([[5, 6], [7, 8]]);

// Addition
var sum = a + b;
print(sum.toString());

// Matrix multiplication
var product = LinearAlgebra.matmul(a, b);
print(product.toString());
```

### Random Array Generation

```dart
// Create 3x3 random integer array
var randomInts = NDArray.random([3, 3], min: 1, max: 100, type: int);

// Create 2x2 random double array
var randomDoubles = NDArray.random([2, 2], min: 0, max: 1);
```

### Binary Array Generation

```dart
// Create a diagonal binary matrix
var diagonal = NDArray<int>.binary([3, 3], (i, j) => i == j);
print(diagonal);
// Output:
// [ 
//  [1, 0, 0],
//  [0, 1, 0],
//  [0, 0, 1]
// ]

// Create a random binary matrix
var randomBinary = NDArray<int>.binaryRand([2, 2]);
print(randomBinary);
// Possible output:
// [ 
//  [1, 0],
//  [0, 1]
// ]
```

## Example

```dart
import 'package:numd/numd.dart';

void main() {
  // Create a 2x3 array
  var array = NDArray.init([
    [1, 2, 3],
    [4, 5, 6]
  ]);
  print(array);

  // Create binary array
  var diagonal = NDArray<int>.binary([3, 3], (i, j) => i == j);
  print(diagonal);

  // Basic operations
  var a = NDArray.ones([2, 2]);
  var b = NDArray.zeros([2, 2]);
  print(a + b);

  // Copy constructor
  var copy = NDArray.copy(array);
  print('Copy: $copy');
}
```

## Performance Considerations

The library is optimized for performance in several ways:

1. **Efficient String Building**: Uses StringBuffer for string operations
2. **Memory Management**: Reuses existing arrays where possible
3. **Type Safety**: Compile-time type checking reduces runtime overhead

## Contributing

Contributions are welcome! Please feel free to submit pull requests. When contributing:

1. Follow the Dart style guide
2. Add tests for new functionality
3. Update documentation as needed
4. Maintain type safety
5. Consider performance implications

## License

This project is licensed under the MIT License - see the LICENSE file for details.