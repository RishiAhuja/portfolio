---
title: "Shamir's Secret Sharing Scheme and Multi Party Computation."
brief: "Mathematical Blog exploring Shamir's Secret Sharing Scheme and Multi Party Computation for private key management."
dateAdded: 2025-07-05T00:00:00.000Z
hashnodeUrl: "https://rishi2220.hashnode.dev/shamirs-secret-sharing-scheme-and-multi-party-computation"
readTimeInMinutes: 23
author: "Rishi Ahuja"
---
Imagine losing $600 million because a single database was compromised. That's exactly what happened to Poly Network in 2021, and it highlights a fundamental flaw in how we handle sensitive data. Whether it's your crypto wallet, API keys, or confidential business data, storing critical secrets in one place creates a catastrophic single point of failure.

Recently, while exploring Web3 tools like BonkBot, I discovered an elegant mathematical solution to this problem: Shamir's Secret Sharing. But here's what makes it fascinating, the same technique that protects billion-dollar crypto protocols can secure any sensitive information you need to manage.

## What You'll Learn?

By the end of this post, you'll understand: -

*   **Why traditional secret storage fails** and costs companies millions.
    
*   **The mathematical elegance** behind splitting secrets without weakening them.
    
*   **How to implement** Shamir's Secret Sharing in code (with working examples).
    
*   **Real-world applications** from crypto wallets to enterprise security.
    
*   **Advanced techniques** like Multi-Party Computation that eliminate reconstruction risks.
    

When something like a cryptographic private key, a critical access code, or confidential data, relying on a single copy or a single custodian introduces a perilous single point of failure, we need better ways to manage it than just storing it directly or relying on simple encryption/hashing in a single database. This is especially true for things like private crypto keys, where a breach can lead to financial ruin like [this](https://wazirx.com/blog/important-update-cyber-attack-incident-and-measures-to-protect-your-assets/).  
That’s why we are using a simple solution in this blog to understand proper private key management using Shamir’s secret sharing algorithm; it’s a very intuitive and mathematical thing.

## Centralized Trust

The inherent nature of many critical secrets, like the private key that controls your digital assets, creates a significant security challenge. By design, such secrets are often a single, unique string of data. This "single copy" paradigm leads to several vulnerabilities:

*   The entire security of the secret hinges on the protection of that one copy. If it's lost, corrupted, or compromised, the secret is gone forever, or worse, accessible to unauthorized parties.
    
*   When you entrust a secret to a single individual, a service, or a specific device, you are placing absolute trust in that custodian's ability to protect it. Any failure on their part – whether accidental (loss, negligence) or malicious (insider threat, hack), directly compromises your secret.
    

In essence, while many systems aim for decentralization, the storage of their most critical secrets often remains a centralized weak point. How can we mitigate this centralization of risk without making the secret inaccessible or overly complex to manage?

### The Cost of Centralized Trust

| Storage Method | Single Point of Failure | Recovery if Lost | Security if Compromised |
| --- | --- | --- | --- |
| **Single Database** | Yes | Impossible | Total loss |
| **Encrypted Single Copy** | Yes | Impossible | Depends on encryption |
| **Multiple Identical Copies** | No | Possible | Multiple attack vectors |
| **Shamir's Secret Sharing** | No | Possible | Requires multiple compromises |

## Distributed Security with Shamir's Secret Sharing: The core idea

Shamir's Secret Sharing offers a mathematically robust answer to this dilemma. Instead of keeping a single copy of a secret, SSS allows you to **split** it into multiple distinct parts, known as "shares." From one key, one can split the key into 5 different parts, which can go to 5 different databases with different security protocols.

Now you need to keep 5 databases running, and as soon as one goes down, the key reconstruction fails, lol. To get around this, we can define thresholds in SSS, let’s say 5-split has a 3 threshold, now any of the 3 parts of the key can be used to reconstruct the key back into the original secret. So you can have any 2 servers down at any point, and still be able to reconstruct the secret back, and an attacker would need to compromise at least three distinct, geographically separated, and technologically diverse storage locations/custodians to gain access to the secret. This significantly increases the cost and complexity of an attack, making it far more impractical.

## The Mathematical stuff

SSS uses a very simple technique of polynomials on a graph. If we take one point, we can pass any number of lines from that point.

Imagine a single point on a graph, say at coordinates (2,4). How many straight lines can go through that specific point? An infinite number. Each of these lines would have a different slope and, importantly for us, a different y-intercept (the point where the line crosses the vertical y-axis, i.e., when x=0).

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1751710683281/c24b960d-7e92-43ce-90f8-dc3f1ecdc6d7.png align="center")

Now, consider what happens if you have **two** distinct points. There is only *one* unique straight line that can pass through both of them.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1751710648078/e16b4cca-dac3-4475-b7bf-1bee995f3f96.png align="center")

This simple point is everything that we need to know, and it’s that simple. For this example, we can identify the value of `f(0)` which in this case is 2.

*   For one point `f(0)` can be anything
    
*   But for two points `f(0)` is deterministic.
    

### The core Idea

The core idea is that, let’s say A has a secret, 6 and he wants to split the secret between B and C. A can choose any secret line such that `f(0)` is 6 and A gives any two points on the line it chooses to B and C (except `f(0)`) obviously.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1751711113649/1fe4bd69-1d85-451d-aac2-3c5880836fad.png align="center")

We can see how things got split. Now we can destroy our secret and still be able to find out about the secret by reconstructing the line using the other 2 points, given to B and C. Actually we can also generate another point on the line, to D, let’s say (3,6) and now we can generate the original secret from any two points out of B, C, D.

What if we want a higher threshold? For instance, what if we need **three** shares to reconstruct the secret, and two shares reveal nothing? Now we can use higher-degree polynomials.

Just as two points uniquely define a straight line (a polynomial of degree 1), **three distinct points uniquely define a parabola** (a polynomial of degree 2, i.e., a quadratic function).

Let's illustrate this with an example. Suppose our secret is 5, meaning `f(0)=5`. We want to create a scheme where 3 shares are needed to reconstruct this secret. This requires us to use a quadratic polynomial of degree 2:

$$f(x) = S + a_1 x + a_2 x^2$$

where `S=5`, and `a1`​,`a2`​ are randomly chosen coefficients. Let's pick `a1​=3` and `a2​=−1`. So, our secret polynomial is:

$$f(x) = 5 + 3x - x^2$$

Now, we can generate three shares (points) from this polynomial:

**Share 1:** Let `x=1`.

$$f(1) = 5 + 3(1) - (1)^2 = 5 + 3 - 1 = 7$$

So, Point 1 is `(1,7)`.

**Share 2:** Let `x=2`.

$$f(2) = 5 + 3(2) - (2)^2 = 5 + 6 - 4 = 7$$

So, Point 2 is (2,7).

**Share 3:** Let `x=3`.

$$f(3) = 5 + 3(3) - (3)^2 = 5 + 9 - 9 = 5$$

So, Point 3 is (3,5).

These three points: (1,7), (2,7), and (3,5) uniquely define our secret quadratic polynomial:

$$f(x) = 5 + 3x - x^2$$

If you have any two of these points, you could fit an infinite number of parabolas through them, and thus learn nothing about f(0). But with all three, the curve is fixed, and so is our secret.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1751711850255/78053efe-df3f-4391-bc27-13c2fe239171.png align="center")

Gathering three shares allows us to precisely reconstruct the unique parabola, and by evaluating it at x=0, we retrieve our secret (5). If you only had two points, say (1,7) and (2,7), an infinite number of parabolas (and even lines!) could pass through them, each with a different y-intercept. This means no information about the secret is revealed until the threshold is met.

Let’s Generalize.

### Generalization: `(T, N)` Threshold Schemes

The core rule is to uniquely define a polynomial of degree `T−1`, you need `T` distinct points.

Therefore, in a `(T,N)` Shamir's Secret Sharing scheme:

*   The secret S is the y-intercept `(f(0))` of a polynomial of degree `T−1`.
    
*   The dealer chooses `T−1` random coefficients to construct this polynomial:
    

$$f(x) = S + a_1 x + a_2 x^2 + \cdots + a_{T-1} x^{T-1}$$

*   The dealer then generates N shares by evaluating this polynomial at N unique non-zero x values `(e.g., x=1,2,…,N)`. Each share is an `(xi​,f(xi​))` pair.
    
*   To reconstruct the secret, any T of these shares are collected. Using a process called **Lagrange Interpolation** (Will discuss this in the second), the original polynomial is recreated, and the secret S is revealed.
    
*   Crucially, if an attacker has fewer than T shares, they have **zero information** about the secret. This is because an infinite number of polynomials of degree T−1 can pass through T−1 or fewer points, meaning f(0) could be any value.
    

## Implementation Details

Now that we understand the elegant polynomial mathematics behind Shamir's Secret Sharing, let's see how these principles are implemented in practice. When moving from theory to code, a crucial concept arises: **Galois Fields**, also called **Finite Fields**.

In theoretical examples, we use ordinary numbers. However, for cryptographic applications like Shamir's Secret Sharing, using standard integers or floating-point numbers creates several problems:

*   **Preventing Overflow:** When secrets are large (like private keys), polynomial evaluation involves big numbers. These can exceed standard data type limits, causing overflows and incorrect results.
    
*   **Ensuring Unique Division:** In a finite field, every nonzero element has a unique multiplicative inverse, so division is always possible and well-defined. Standard division can produce fractions or remainders, which are not suitable for cryptography.
    
*   **Information-Theoretic Security:** The guarantee that fewer than TT shares reveal no information about the secret depends on all calculations being performed in a finite field. Without this, partial shares could leak information.
    

A **finite field** (often denoted `GF(p)`) is a set of numbers (usually 0 to `p−1` with `p` prime) with addition, subtraction, multiplication, and division (except by zero), all performed modulo `p`.

$$\mathbb{F}_p = \{ 0, 1, 2, \ldots, p-1 \}$$

**What is a "Prime Field"?**

A **prime field** is the simplest finite field, constructed using integers modulo a prime `p`.

*   **Elements:** `0, 1, 2,…, p−1`
    
*   **Arithmetic:** All operations are done modulo `p`.
    

$$\mathbb{Z}_p = \{ 0, 1, 2, \ldots, p-1 \}$$

**Example in** `GF(5)`:

*   **Elements:** `0, 1, 2, 3, 4`
    
*   **Addition:**
    

$$3 + 4 = 7 \equiv 2 \pmod{5}$$

*   **Subtraction:**
    

$$1 - 3 = -2 \equiv 3 \pmod{5}$$

*   **Multiplication:**
    

$$2 \times 3 = 6 \equiv 1 \pmod{5}$$

*   **Division**:
    
    **Example**: What is the inverse of 2 in {Z}\_5?
    

Try:

$$2 \times x \equiv 1 \pmod{5}$$

We try ( x = 3 ):

$$2 \times 3 = 6 \equiv 1 \pmod{5} \Rightarrow 2^{-1} = 3$$

Therefore:

$$4 \div 2 \pmod{5} = 4 \times 3 \pmod{5} = 12 \pmod{5} = 2$$

**Choosing the Field Size:**

For implementation, pick a prime `p` large enough to encode your secret. For example, `p=257` fits in an 8-bit unsigned integer, but for real cryptography, use a much larger prime.

Beyond the basic modular arithmetic, two important mathematical tools are commonly employed in SSS implementations to ensure correctness and efficiency:

### 1\. Fermat's Little Theorem (for Modular Inverse)

As we saw with division in finite fields, finding the modular multiplicative inverse (B−1B−1) is crucial. For prime fields ZPZP, **Fermat's Little Theorem** provides an elegant way to do this without complex algorithms like the Extended Euclidean Algorithm.

The theorem states that if `P` is a prime number, then for any integer `a` not divisible by `P`:

$$a^{P-1} \equiv 1 \pmod{P}$$

From this, we can derive the inverse:

$$a \cdot a^{P-2} \equiv 1 \pmod{P}$$

Therefore, the **modular inverse** of aa is:

$$a^{-1} \equiv a^{P-2} \pmod{P}$$

This theorem allows us to calculate a−1a−1 by performing **modular exponentiation**, which involves repeated modular multiplication.

### 2\. Horner's Method (for Polynomial Evaluation)

When we evaluate a polynomial like:

$$f(x) = S + a_1x + a_2x^2 + \dots + a_{T-1}x^{T-1}$$

to generate shares, a naive approach would involve calculating each power of `x (x2,x3,…)` and then multiplying by its coefficient. This can be computationally inefficient, especially for higher-degree polynomials.

**Horner's Method** (also known as Horner's Scheme) provides a more efficient algorithm for evaluating polynomials. It rewrites the polynomial in a nested form:

$$f(x) = S + x(a_1 + x(a_2 + \dots + x(a_{T-1})\dots))$$

For example, a quadratic polynomial

$$f(x) = a_0 + a_1x + a_2x^2$$

would be evaluated as

$$f(x) = a_0 + x(a_1 + x a_2)$$

This significantly reduces the number of multiplications required, making the share generation process faster.

Now let’s see some code. We'll focus on the `split` function, which is responsible for taking your secret and generating the shares.

I've written this example code in **Zig**, a language I've been exploring recently for its low-level control and performance, which makes it an interesting choice for cryptographic primitives. However, the logic and mathematical concepts are universal, and you could implement Shamir's Secret Sharing in any language you're comfortable with (Python, JavaScript, Rust, C++, etc.).

Some helper methods for Galois arithmetic and polynomial evaluation.

```c
const FieldSize: u16 = 257;

// --- Finite Field Arithmetic Operations ---
// All operations are performed modulo FieldSize.
// Using u16 for intermediate calculations to prevent overflow before modulo.

fn add(a: u8, b: u8) u8 {
    return @intCast((@as(u16, a) + @as(u16, b)) % FieldSize);
}

fn sub(a: u8, b: u8) u8 {
    // (a - b) mod P is equivalent to (a - b + P) mod P to ensure positive results.
    return @intCast((@as(u16, a) + FieldSize - @as(u16, b)) % FieldSize);
}

fn mul(a: u8, b: u8) u8 {
    return @intCast((@as(u16, a) * @as(u16, b)) % FieldSize);
}

/// Calculates the modular multiplicative inverse of 'a' modulo 'FieldSize'.
/// Uses Fermat's Little Theorem (a^(P-2) mod P) since FieldSize is prime.
fn inv(a: u8) !u8 {
    if (a == 0) {
        return AppError.DivisionByZero; // Modular inverse of 0 is undefined.
    }

    var res: u8 = 1;
    var base: u8 = a;
    var exp: u8 = FieldSize - 2; // Exponent for Fermat's Little Theorem

    // Implements "Exponentiation by Squaring" for efficient modular exponentiation.
    while (exp > 0) {
        if ((exp % 2) == 1) { // If exponent is odd
            res = mul(res, base);
        }
        base = mul(base, base); // Square the base
        exp /= 2; // Halve the exponent
    }
    return res;
}

/// Performs modular division: (a / b) mod FieldSize = (a * b_inverse) mod FieldSize.
fn div(a: u8, b: u8) !u8 {
    return mul(a, try inv(b));
}
```

Polynomial evaluation using Hornet’s scheme.

```c
fn poly_eval(coeffs: []const u8, x: u8) u8 {
    if (coeffs.len == 0) return 0; // An empty polynomial evaluates to 0.

    // Start with the highest degree coefficient.
    var result: u8 = coeffs[coeffs.len - 1];

    // Iterate downwards from the second highest degree coefficient.
    var i: usize = coeffs.len - 1;
    while (i > 0) {
        i -= 1;
        // result = (result * x + coeffs[i]) mod FieldSize
        result = add(mul(result, x), coeffs[i]);
    }
    return result;
}
```

Let’s see the split function.

```c
pub const Shamir = struct {
    pub const Share = struct {
        x: u8,
        y: u8,
    };
    pub fn split(secret: u8, num_shares: u8, threshold: u8, allocator: std.mem.Allocator) !std.ArrayList(Share) {
        if (threshold == 0 or num_shares == 0 or threshold > num_shares) {
            return AppError.InvalidThreshold;
        }
        if (secret >= FieldSize) {
            return AppError.SecretTooLarge;
        }

        var coeffs = std.ArrayList(u8).init(allocator);
        defer coeffs.deinit();
        try coeffs.append(secret);

        // Initialize a cryptographically secure random number generator (CSPRNG).
        // This is crucial for generating unpredictable polynomial coefficients (a_1 to a_threshold-1).
        var seed_buffer: [8]u8 = undefined;
        std.crypto.random.bytes(&seed_buffer);
        const seed = std.mem.readInt(u64, &seed_buffer, .little);
        var rng = std.rand.DefaultPrng.init(seed);
        var rand_val_gen = rng.random();

        // Generate 'threshold - 1' random coefficients for the polynomial's higher-degree terms.
        for (0..(threshold - 1)) |_| {
            try coeffs.append(rand_val_gen.uintLessThan(u8, FieldSize));
        }

        var shares = std.ArrayList(Share).init(allocator);
        // Generate 'num_shares' distinct points (x, y) on the polynomial.
        // We use x-coordinates starting from 1 to avoid x=0, which would reveal the secret.
        for (1..(num_shares + 1)) |i| {
            const x_coord: u8 = @intCast(i);
            const y_coord = poly_eval(coeffs.items, x_coord);
            try shares.append(.{ .x = x_coord, .y = y_coord });
        }
        return shares;
    }
};
```

## Reconstruction of the secret

Let’s see how we can reconstruct the secret, and to this, we might need to use **Lagrange Interpolation.**

Recall the fundamental principle: `T` **distinct points uniquely define a polynomial of degree** `T−1`. If you have collected `T` (or more) shares, you have precisely enough information to reconstruct the unique polynomial that passes through them, and thereby retrieve the secret `f(0)`.

Let's imagine we've received our shares, for example, four shares of a degree-3 polynomial (meaning our threshold `T=4`):

$$\displaylines{ f(5) = 3 \cr f(7) = 2 \cr f(12) = 6 \cr f(30) = 15 }$$

Our goal is to reconstruct the unique polynomial `f(x)` that visits all these four points. The key insight is that once we have this unique polynomial, its value at `x=0`, i.e., `f(0)`, must be the original secret. We don't care how this function behaves for any other points `(like f(3),f(10))`, only for our specific share points and, critically, for `f(0)`.

The first idea to construct such a function is to create a "helper" function for each point we want to visit. Let's call these **Delta functions**, `δi(x)` A simple initial thought might be to define δi(x)δi(x) such that it behaves specifically at the points in our set `C={5,7,12,30}`:

$$\delta_i(x) = \begin{cases} 1 & \text{if } x \in C \text{ and } x = i \\ 0 & \text{if } x \in C \text{ and } x \neq i \\ \text{"don't care"} & \text{else} \end{cases}$$

For example, `δ5(x)` would be 1 if `x=5`, and 0 if `x=7, 12` or `30`.

Then, our overall polynomial `f(x)` could be expressed as a weighted sum of these `δi(x)` functions, where the weights are the original y-values:

$$f(x) = 3 \cdot \delta_5(x) + 2 \cdot \delta_7(x) + 6 \cdot \delta_{12}(x) + 15 \cdot \delta_{30}(x)$$

If we plug in `x=7` into this sum, for instance, only the `δ7(x)` term would be non-zero (it would be 1), giving us `f(7)=2`, which is exactly what we want. This works for all our known points.

However, the simple "if/else" definition for `δi(x)` does not yield a polynomial. These are discrete, step-like functions. To make them proper polynomials, we need to carefully construct them using algebraic expressions.

## Constructing the Polynomial Delta Functions

The goal for each δi(x)δi(x) (which are formally called **Lagrange Basis Polynomials**, `Li(x)`) remains the same:

*   It must evaluate to 0 at all other x-coordinates in our set C (where `x` not equal to `i`).
    
*   It must evaluate to 1 at its own x-coordinate, `x=i`.
    

Let's try to construct `δ5(x)` to meet these criteria. To make it zero when `x=7, 12, or 30`, we can multiply terms like `(x−7)`, `(x−12)`, and `(x−30)`:

$$\delta_5(x) = (x-7)(x-12)(x-30)$$

This product will indeed be zero if `x` is 7, 12, or 30. But, if we evaluate this at `x=5`:

$$\delta_5(x) = \frac{(x-7)(x-12)(x-30)}{(5-7)(5-12)(5-30)}$$

Similarly for `δ7(x)`:

$$\delta_7(x) = \frac{(x-5)(x-12)(x-30)}{(7-5)(7-12)(7-30)}$$

And so on for `δ12(x)` and `δ30(x)`.

Now we can abstract things. We can generalize this pattern. For any `i` in our set of x-coordinates `C`, the polynomial `δi(x) (or Li(x))` is given by the product:

$$\delta_i(x) = \prod_{\substack{j \in C \\ j \neq i}} \frac{x - j}{i - j}$$

This is a polynomial of degree `T−1` (in our example, degree 3). And crucially, it satisfies both conditions: it's 0 at all other points in `C`, and 1 at its own point `i`.

Now that we have the correct polynomial `δi(x)` functions (Lagrange Basis Polynomials), we can go back to our general form for the reconstructed polynomial `f(x)`:

$$f(x) = \sum_{i \in C} f(i) \cdot \delta_i(x)$$

Where `f(i)` is simply the y-value `(y_i)` corresponding to the x-coordinate `i`.

For our example shares:

$$f(x) = 3 \cdot \delta_5(x) + 2 \cdot \delta_7(x) + 6 \cdot \delta_{12}(x) + 15 \cdot \delta_{30}(x)$$

Since we are summing polynomials of degree `T−1`, the resulting function `f(x)`is also a polynomial of degree `T−1`. We have found the only polynomial of degree 3 that visits our four given points.

Therefore, the value of this polynomial at `x=0` must be the original secret that was shared using this scheme.

$$S = f(0) = ∑{j=1}^{T} y_j ⋅ ∏{k=1, k ≠ j}^{T} (0 − x_k) / (x_j − x_k)$$

As we've continually discussed, every single operation (subtraction, multiplication, division, requiring modular inverse) in these calculations must be performed over our finite field to ensure mathematical correctness and security.

### Reconstruction in Code

Implementing Lagrange Interpolation involves nested loops to calculate the products and sums defined by the formula. Our finite field arithmetic functions (`add`, `sub`, `mul`, `div`, `inv`) are essential here.

Here's the Zig code for the `reconstruct` function:

```c
pub fn reconstruct(shares: []const Share, threshold: u8) !u8 {
    if (shares.len < threshold) {
        return AppError.NotEnoughShares;
    }
    if (threshold == 0) {
        return AppError.InvalidThreshold;
    }
    var secret_sum: u8 = 0;
    // Outer loop: Iterate through each share (x_j, y_j) in the provided set.
    // This corresponds to the outer summation in the Lagrange formula: Σ y_j * L_j(0)
    for (shares) |share_j| {
        if (share_j.x == 0) {
            return share_j.y;
        }
        var num: u8 = 1; // Numerator of the L_j(0) term: Product of (0 - x_k) for k != j
        var den: u8 = 1; // Denominator of the L_j(0) term: Product of (x_j - x_k) for k != j

        // Inner loop: Iterate through all shares again to build the L_j(0) term (the product part).
        // This corresponds to the product (Π) in the Lagrange formula.
        for (shares) |share_k| {
            if (share_j.x == share_k.x) {
                continue; // Skip when j == k, as per the Lagrange formula (k != j)
            }

            const num_term = sub(0, share_k.x);
            num = mul(num, num_term);

            // Calculate denominator term: (x_j - x_k)
            const den_term = sub(share_j.x, share_k.x);
            if (den_term == 0) {
                return AppError.DuplicateShareXCoordinate;
            }
            den = mul(den, den_term);
        }

        const l_j_at_zero = try div(num, den);
        secret_sum = add(secret_sum, mul(share_j.y, l_j_at_zero));
    }
    return secret_sum;}
```

This was too much maths, but you might have guessed it, we could just solve the equations via elimination and find the secret.

## Alternative Approach

While Lagrange interpolation is a classic and elegant method to reconstruct the secret polynomial from shares, there is a simpler, more straightforward approach, directly solving the system of equations for the polynomial coefficients.

Suppose we have three shares corresponding to points on a degree-2 polynomial:

$$\begin{cases} f(3) = 2 \\ f(4) = 1 \\ f(5) = 2 \end{cases}$$

Assuming the polynomial is of the form

$$f(x) = a_0 + a_1 x + a_2 x^2$$

We substitute each point into the polynomial to get three equations:

$$\begin{cases} 2 = a_0 + 3a_1 + 9a_2 \\ 1 = a_0 + 4a_1 + 16a_2 \\ 2 = a_0 + 5a_1 + 25a_2 \end{cases}$$

After simple elimination, here is `a_0` which is our secret.

$$\boxed{17}$$

This direct algebraic approach is intuitive and straightforward, especially for small systems. It provides a practical alternative to Lagrange interpolation, and both methods ultimately yield the same polynomial and secret.

This was Shamir’s Secret Sharing, and its implementation for y’all. Let’s move on to a newer concept to address issues in what we’ve currently achieved.

## Multi-Party Computation (MPC)

We've seen how Shamir's Secret Sharing (SSS) provides a good way to distribute a secret, like an Ethereum private key, across multiple custodians (e.g., 5 different databases) such that a subset (e.g., 3 out of 5) can reconstruct it. This successfully eliminates the single point of failure in *storage*. Our key is now decentralized and fault-tolerant.

However, a critical challenge remains: the moment of reconstruction. If one single server is designated to orchestrate the key shares from the 5 different databases, and during the reconstruction process, all the shares converge at this single server, the whole security effort could be undermined. If that single point (the reconstruction server) is compromised, and all the shares eventually pass through or reside there, the reconstructed key will still be exposed. This reintroduces a perilous single point of exposure during the *active use* phase of the secret.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1751717129536/f2ccd08c-12c4-4264-b56b-5e439076a5b1.png align="center")

This is precisely the problem **Secure Multi-Party Computation (MPC)** aims to eliminate. MPC allows multiple parties to jointly compute a function on their private inputs without ever revealing those inputs to each other. In our Ethereum private key example, MPC could enable several custodians to collectively "sign" a transaction without any single party ever learning the full private key or even seeing the other parties' shares of it.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1751717179845/1fb98a3f-0e57-4281-b832-e81f273bd4f6.png align="center")

Let’s take simple examples.

Suppose three organizations, Org A, Org B, and Org C, jointly manage an Ethereum wallet. The private key is never stored in full; instead, each organization holds a share generated via **SSS Scheme**. When they wish to sign a transaction, the key must not be reconstructed on any single device. Secure multi-party computation (MPC) allows them to compute over their shares and authorize a transaction, without revealing the private key to any single party.

**Step 1 is to represent each Private Share as a Polynomial.**

Each organization encodes its share of the private key as a polynomial. Assume:

*   The threshold is 3 (all three must participate)
    
*   The degree of each polynomial is 2 (threshold - 1)
    

For example, if Org A’s share is `k_1`:

$$f_A(x) = k_1 + a_1 x + a_2 x^2$$

Similarly, Orgs B and C construct:

$$f_B(x) = k_2 + b_1 x + b_2 x^2$$

$$f_C(x) = k_3 + c_1 x + c_2 x^2$$

Each party keeps the share for their own xx-coordinate and exchanges the others.

Example polynomials.

$$\begin{align*} f_A(x) &= 3 + 2x + x^2 \\ f_B(x) &= 1 + 4x + 3x^2 \\ f_C(x) &= 2 + 5x + 2x^2 \end{align*}$$

**Step 2 is summing the polynomials.**

Adding the polynomials gives a new polynomial whose value at `x=0` is the sum of the private key fragments, i.e., the actual private key.

$$F(x) = f_A(x) + f_B(x) + f_C(x)$$

At `x=0`:

$$F(0) = f_A(0) + f_B(0) + f_C(0) = k_1 + k_2 + k_3 = \text{Ethereum Private Key}$$

Because polynomial addition is coefficient-wise, `F(x)` remains degree 2, so any 3 points determine it uniquely.

**Step 3 is secure evaluation at distinct points.**

Each organization locally adds up the shares they received for their own xx-coordinate:

Org A computes:

$$F(1) = f_A(1) + f_B(1) + f_C(1)$$

Org B computes:

$$F(2) = f_A(2) + f_B(2) + f_C(2)$$

Org C computes:

$$F(3) = f_A(3) + f_B(3) + f_C(3)$$

Now, the points `(1,F(1))`, `(2,F(2))`, `(3,F(3))` are available on the global polynomial `F(x)`.

**Step 4 is reconstructing only the result, not the secret.**

With three points on `F(x)`, Lagrange interpolation can recover the full polynomial and specifically evaluate `F(0)`, the result of the joint computation.

$$F(0) = \sum_{j=1}^{3} F(j) \cdot \prod_{\substack{k=1 \\ k \neq j}}^{3} \frac{0 - k}{j - k}$$

The Ethereum private key itself is never revealed to any party.

## Conclusion

By using **Shamir’s Secret Sharing**, we removed the single point of failure. No one party ever held the full key, and no compromise of an individual could jeopardize the system. Then, through secure multi-party computation, we enabled these fragmented shares to contribute meaningfully, to sign, to compute, without ever coming back together.

You know what, the math was very very simple, but it created different schemes to securely manage private keys.

If you’ve made it this far, Thanks.

If you want to explore more, here is the github repo, it’s in zig though, but you can always reconstruct the code the language you prefer.

Github - [here](https://github.com/rishiahuja/shamir-bindings).

Feel free to connect with me on my social media platforms:

*   [X](https://x.com/rishi2220)
    
*   [LinkedIn](https://www.linkedin.com/in/rishi-ahuja-b1a224310/).
    

Your thoughts and feedback are always appreciated!