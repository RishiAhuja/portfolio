---
title: "Towards the Modern Transformer Architecture"
brief: "Tracing how the 2017 Transformer evolved into the recipes used by modern frontier models — norms, activations, attention variants, RoPE, KV cache, and more."
dateAdded: 2026-07-01T00:00:00.000Z
hashnodeUrl: "https://rishi2220.hashnode.dev/towards-the-modern-transformer-architecture"
readTimeInMinutes: 36
author: "Rishi Ahuja"
---
Hi y'all, Long time no see! [Last post](https://rishi2220.hashnode.dev/you-dont-know-websockets-yet) was last year.

Everyone has likely read [*Attention Is All You Need*](https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf), and understood everything around self-attention, and mapped out how encoders and decoders talk to each other. Obviously, the raw 2017 Transformer is no longer remotely used in our modern frontier models. Over the last few years, the community has converged to some highly optimized, tested recipes.

In this post, we are going to trace exactly how we got where we are. We will try to break down each major architectural optimization, analyze why modern frontier models have converged on these specific designs, and show exactly how the old-school architecture evolved into the modern transformer.

## Prerequisites

Before continuing, you should be familiar with:

*   You have read and understood the original [Attention Is All You Need (Vaswani et al., 2017)](https://arxiv.org/abs/1706.03762) paper, specifically how self-attention works.
    
*   And you understand how standard Feed-Forward Networks (FFN) process representations using linear layers and basic activation functions like ReLU or GeLU.
    

## From Seq2Seq to Decoder only

As we all know, the original Transformer was built for specific neural machine translation tasks. It was designed to take a sequence of tokens in one language (like English) and translate it into a sequence of tokens in another language (like French).

Hence, it used an Encoder to read and understand the English sentence all at once, and a Decoder to generate the French sentence one word at a time. For this, the Decoder relied on Cross-Attention, which allowed it to constantly look back at the Encoder's representations to make sure it was translating the right words. It's expected that we know this already.

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/bebf5112-f1c0-4364-ad1d-5466c017b61a.png align="center")

Because we don't want a machine translation task right now, but rather a natural language generation task, we don't need an encoder right now, and we also don't have any cross-attention to attend to.

This realization is what directly bridged the gap between the 2017 baseline and GPT-1. By discarding the encoder and the cross-attention machinery, the architecture was streamlined into a pure, autoregressive stack.

However, while GPT-1 successfully proved the decoder-only concept, it was still fundamentally built using the exact internal components of the original 2017 Transformer.

To really appreciate how clean the modern upgrades are, let's look at GPT-1 mathematically. Writing down the exact forward pass step-by-step, from raw tokens to next-token probabilities, helps us pinpoint exactly where the math was bottlenecked.

### GPT-1 Forward pass.

Here is what GPT-1 forward pass looks like.

$$h_0 = U W_e + W_p$$

$$a_l = \text{LN}\left(h_{l-1} + \text{MHA}(h_{l-1})\right) \quad \text{for } l = 1 \dots n$$

$$h_l = \text{LN}\left(a_l + \text{FFN}(a_l)\right) \quad \text{for } l = 1 \dots n$$

$$P(U) = \text{Softmax}\left(h_n W_e^T\right)$$

Inside each function:

$$\text{MultiHead}(h_{l-1}) = \text{Concat}(\text{head}_1, \dots, \text{head}_h) W^O$$

$$\text{head}i = \text{Softmax}\left(\frac{(h{l-1} W_i^Q)(h_{l-1} W_i^K)^T}{\sqrt{d_k}} + M\right)(h_{l-1} W_i^V)$$

$$\text{FFN}(a_l) = \text{GELU}(a_l W_1 + b_1) W_2 + b_2$$

I hope everything up to here makes sense.

Here is a simple diagram for the GPT-1 architecture alongside the Vanilla Transformer.

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/af240d7b-dadd-485a-bd52-269478612c0e.png align="center")

Now that we have the full forward pass written out, let's actually look at it like researchers instead of readers. Everything here was a *choice* someone made in 2018, under 2018 constraints. None of these choices are sacred and never will be, and honestly, there's always a lot of room to optimize almost every block in this equation.

$$h_0 = U W_e + \boxed{W_p}$$

Start with our positional embedding. It's just a learned lookup table, one row per position at this moment. then

$$a_l = \text{LN}\left(h_{l-1} + \text{MHA}(h_{l-1})\right), \quad h_l = \text{LN}\left(a_l + \text{FFN}(a_l)\right)$$

Then we have LayerNorm, which is used twice per layer and placed in a very specific spot in each equation.

$$\text{head}i = \text{Softmax}\left(\frac{(h{l-1} W_i^Q)(h_{l-1} W_i^K)^T}{\sqrt{d_k}} + M\right)\boxed{(h_{l-1} W_i^V)}$$

Our Multi-Head Attention block itself has quietly become one of the most re-engineered pieces of the entire architecture at inference time.

And Activation Functions: GELU is now not used at all.

$$\text{FFN}(a_l) = \boxed{\text{GELU}}(a_l W_1 + b_1) W_2 + b_2$$

It's enough teasing. Let's start by adapting stuff one by one.

## Pre-vs-post norm

By 2020-2021, essentially every major LM architecture kinda agreed on pre-norm, from post-norm, except BERT. This is one of the most universally agreed-upon architectural choices in the field, more consistent than the choice of activation, position embedding, or attention variant.

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/6b3c56fc-dcac-4193-ac04-38dbbb55ad00.png align="center")

Images in this section from *\[*[*Xiong 2020*](https://arxiv.org/pdf/2002.04745)*\]* and *\[*[*Salazar and Ngyuen 2019*](https://arxiv.org/pdf/1910.05895)*\]*

Here is post-norm vs pre-norm.

Post Norm:

$$x_{l+1} = \text{LN}(x_l + F_l(x_l))$$

In Post Norm, When you calculate the gradient (the backward pass) to send the error signal from layer `l+1` down to layer `l`, the gradient must pass *through* the LayerNorm derivative.

$$\frac{\partial \text{Loss}}{\partial x_l} = \frac{\partial \text{Loss}}{\partial x_{l+1}} \cdot \frac{\partial \text{LayerNorm}}{\partial(\dots)} \cdot \left(I + \frac{\partial \text{SubLayer}}{\partial x_l}\right)$$

The derivative of LayerNorm involves dividing by the standard deviation of its input. In a deep network, as you add more layers, the variance of that `(x_l + SubLayer)` term grows larger and larger. Therefore, the LayerNorm derivative aggressively shrinks the gradient. Because there is a LayerNorm at *every single layer*, the gradient gets shrunk and shrunk again. By the time it reaches the first layer, the gradient is almost zero (as we commonly know as Gradient Vanishing).

Here is a Pre-Norm forward pass:

$$x_{l+1} = x_l + \text{SubLayer}(\text{LayerNorm}(x_l))$$

Now, look at what happens to the gradient during backpropagation.

$$\frac{\partial \text{Loss}}{\partial x_l} = \frac{\partial \text{Loss}}{\partial x_{l+1}} \cdot \left(\mathbf{I} + \frac{\partial (\text{SubLayer} \circ \text{LayerNorm})}{\partial x_l}\right)$$

and if we expand that out:

$$\frac{\partial \text{Loss}}{\partial x_l} = \frac{\partial \text{Loss}}{\partial x_{l+1}} + (\text{Gradient from the SubLayer branch})$$

Now, expand the pre-norm recursion out across all `n` layers instead of just one step:

$$\frac{\partial\text{Loss}}{\partial x_l} = \frac{\partial\text{Loss}}{\partial x_n} \cdot \prod_{k=l}^{n-1} \left( I + \frac{\partial(\text{SubLayer} \circ \text{LayerNorm})}{\partial x_k} \right)$$

Expanding that product term by term gives you:

$$= \frac{\partial\text{Loss}}{\partial x_n} + \sum_{k=l}^{n-1} (\text{gradient contribution from branch } k) + (\text{higher-order cross terms})$$

Now notice how the leading term is just `∂Loss/∂x_n`**,** with a coefficient of exactly 1, and which is completely independent of how many layers sit between `l` and `n`. Every other term in that expansion carries at least one LayerNorm derivative inside it, but this one doesn't, ever, no matter how deep you go.

Compare that to post-norm, where every single factor in the equivalent product is a `LayerNorm-derivative × (something)`, there's no term anywhere in that expansion that reduces to a clean, LayerNorm-free coefficient of 1.

Let's see some graphs.

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/f39f36d1-12a2-4a48-b9fc-4121dcf55b9d.png align="center")

This graph measures the gradient magnitude actually reaching one specific weight matrix (`W¹` in the FFN), at each of 6 layers, right at initialization.

In Post-LN (orange), layer 6 gets a gradient of about 1.25. Layer 1 gets about 0.05. That is roughly a 25x gap between the top and bottom of a 6-layer network, at step zero, before any training has happened. This is a direct, visible consequence of everything we just derived. Layer 6's gradient only has to pass through one LayerNorm derivative on its way to the loss; layer 1's has to pass through six.

Pre-LN (blue) is always flat, around 0.2, across all six layers, and has no dependence on depth, which we derived.

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/c143cd66-2372-4f10-8554-63b21780d018.png align="center")

Look at the `PostNorm+LayerNorm` at the very bottom (dotted-purple). It's for a machine translation task on a vanilla transformer. It starts out terrible, struggles to learn early on, and never catches up to the other lines.

Every other line on that graph uses Pre-Norm. They all learn much faster and reach a higher final accuracy.

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/94d27add-71a8-4c76-9ff4-61ada8598d8a.png align="center")

You can clearly see how Pre-Norm is visibly better. On IWSLT, post-norm *without* warmup is visibly worse than every pre-norm variant across all 15 epochs.

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/e8d71c4e-364c-41a6-b8c7-3789b06e19a6.png align="center")

This chart tracks the *global norm.*

<details data-node-type="hn-details-summary">
<summary>Global Norm</summary>
<latex-preview>\text{Global Norm} = \sqrt{\sum_{i=1}^{N} g_i^2}</latex-preview>
</details>

Post-norm (purple) keeps spiking, with large, sudden jumps in gradient size recurring throughout training, not just at the start. Pre-norm variants stay in a tight, low band the entire time. This shows pre-norm is stablier.

## Double Norm (Sandwich Norm)

Pre-norm fixed the gradient problem by keeping the residual stream itself untouched by any LayerNorm rather, the copy feeding into attention/FFN gets normalized. But this leaves the size of what attention or FFN actually outputs uncontrolled.

$$x_{l+1} = x_l + \text{SubLayer}(\text{LayerNorm}(x_l))$$

Nothing in this equation constrains `SubLayer(...)`'s output magnitude. It's just a stack of matrix multiplies.. whatever the current weights produce is what gets added straight onto the stream. Early in training, this is not an issue, since weights start small. But as training goes on, there's nothing stopping a given layer's attention or FFN block from occasionally producing an unusually large output.. some particular combination of weights, at some particular point in training, spits out values far bigger than a typical layer's contribution. That gets added directly into the stream, no check in place, and can cascade into a loss spike or a diverged run.

Double norm (used in Gemma 2 and Grok) adds a second LayerNorm right after the sublayer, before the addition:

$$x_{l+1} = x_l + \text{LayerNorm}{\text{out}}(\text{SubLayer}(\text{LayerNorm}{\text{in}}(x_l)))$$

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/23be9484-8092-481d-a0db-319db42470b0.png align="center")

## RMSNorm

We all know LayerNorm, as used in GPT-1/2/3, OPT, GPT-J, BLOOM, is defined as:

$$y = \frac{x - \mathbb{E}[x]}{\sqrt{\text{Var}[x] + \epsilon}} * \gamma + \beta$$

Two statistics computed per vector, i) the mean `E[x]`, subtracted off, and the variance, divided out, ii) learned parameters, `γ` (a gain, rescaling the result) and `β` (a bias, shifting it)

RMSNorm, used across LLaMA, PaLM, Chinchilla, T5, looks like this:

$$y = \frac{x}{\sqrt{\|x\|_2^2 + \epsilon}} * \gamma$$

RMSNorm drops the mean subtraction, means no `E[x]` term. It divides by the root-mean-square of `x` instead of the standard deviation and it also drops `β`.

Going back to what LayerNorm's mean-subtraction is actually for:

**Re-centering invariance.** If you shift every value in your input vector up by some constant `c`, LayerNorm's output is completely unchanged, the `x - E[x]` term cancels the shift out exactly `(x + c) - E[x + c] = x - E[x]`), since `E[x]` shifts by `c` too. It means the layer's output doesn't care about an arbitrary additive offset in its input.

The RMSNorm paper's actual argument ([Zhang & Sennrich, 2019](https://arxiv.org/abs/1910.07467)) is empirical. They hypothesized that this specific invariance protection against additive shifts wasn't the property doing the real work in LayerNorm. The property they believed mattered was re-scaling invariance, i.e., protection against the input being multiplied by some constant. RMSNorm keeps re-scaling invariance (dividing by the RMS still cancels out any constant multiplied onto the input) but drops re-centering invariance (no mean subtraction, so an additive shift in the input isn't automatically canceled).

They tested this directly by training models with RMSNorm instead of LayerNorm and found performance was essentially the same. Which means Mean-subtraction was, empirically, solving a problem the network wasn't really an actual problem.

### Why RMSNorm caught on

The stated case for RMSNorm is usually that it's much faster, at effectively the same quality as LayerNorm.

Before concluding, have a look at the operator breakdown from [Ivanov et al. 2023](https://arxiv.org/pdf/2007.00072), profiling an actual transformer:

| Operator class | % FLOPs |
| --- | --- |
| Tensor contraction (matmuls) | 99.80 |
| Stat. normalization | 0.17 |
| Element-wise | 0.03 |

Matrix multiplies are 99.8% of all the arithmetic a transformer does. Normalization, the entire LayerNorm-vs-RMSNorm question, is 0.17% of FLOPs. It really looks like it's not worth optimizing at all. Normalization is just a rounding error in our compute budget.

But the fraction of a program's FLOPs an operation uses and the fraction of its wall-clock time it uses are two completely different numbers.

See this.

| Operator Class | % FLOPSs | % Runtime |
| --- | --- | --- |
| Tensor contraction (matmuls) | 99.80 | 61.0 |
| Stat. normalization | 0.17 | 25.5 |
| Element-wise | 0.03 | 13.5 |

Normalization goes from 0.17% of FLOPs to 25.5% of runtime, which is roughly 150x more expensive in wall-clock time than its FLOP share suggests. Matrix multiplication, 99.8% of the arithmetic, accounts for only 61% of the actual time.

GPUs aren't limited by how much arithmetic they can do; however, they're limited by how fast they can move data between memory and the compute units. A matrix multiply has high arithmetic intensity; we can load a relatively small amount of data, then perform a lot of operations on it before writing the result back out. Compute units stay busy; data movement is a small fraction of total time, and this is exactly what GPUs are built to be good at.

Normalization is the opposite. Computing a mean and variance requires reading every element of the vector, and the division applied to produce the output requires reading every element again and writing every element back out. Arithmetic per byte moved is tiny, this is memory-bound, and not compute-bound. GPU spends most of its time waiting on memory reads and writes, not computing. This is why LayerNorm's FLOP-to-memory ratio sits at 3.5, versus attention's ratio of 153.. attention does 153x more arithmetic per byte of memory it touches.

[Narang et al 2020](https://arxiv.org/pdf/2102.11972), analysed it with other methods, and RMSNorm was not just faster but also had the lowest loss.

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/496ce2fe-6558-412d-9063-ae7c528cdaf6.png align="center")

## Dropping bias terms

Go back to the original FFN:

$$\operatorname{FFN}(x)=\max(0,xW_{1}+b_{1})W_{2}+b_{2}$$

Two bias vectors, b1​ and b2​. And it's not only the FFN, the original architecture also puts biases on the Q/K/V/O projections in attention, and LayerNorm has its own bias, `β` (which we already killed off when we moved to RMSNorm).

Most modern architectures drops bias terms almost everywhere.

$$\operatorname{FFN}(x)=\operatorname{act}\left(xW_{1}\right)W_{2}$$

Just the matmuls, no additive term anywhere. Let us see why:

*   It's not actually free, for the same reason RMSNorm's mean-subtraction wasn't free.
    
*   Another reason is that bias terms turned out to be actively bad for optimization, not just useless.
    

PaLM's authors explicitly report that removing biases from all dense kernels and layer norms increased training stability for large models. That's the opposite of a wash. The bias term wasn't neutral, it was a small source of instability at scale that nobody noticed at GPT-1/GPT-2 sizes because the instability only shows up when you stack enough layers and enough width for small effects to compound.

There's a plausible mechanism for why a bias is a per-channel constant added *unconditionally*, every forward pass, regardless of the input. Unlike a weight, which scales with the input and therefore scales with however you're normalizing that input, a bias has no such check on it. It's a free-floating offset the optimizer can push in one direction indefinitely, since nothing in the loss landscape directly punishes it for growing (weight decay usually excludes biases, since penalizing them the same way as weights tends to hurt performance). Removing it removes one more unconstrained degree of freedom from a network we're already trying to keep numerically well-behaved across 30+ layers in bf16.

We've optimized 2 things till now. Lets continue the next one. Activations.

$$\operatorname{FFN}(a_l) = \boxed{\operatorname{GELU}}\left(a_lW_1 + b_1\right)W_2 + b_2$$

### Activation Function

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/73699c03-e11a-42ea-ab41-4502f01ae99f.png align="center")

So far, every FFN we have considered has followed the same basic structure:

$$\operatorname{FFN}(x) = \phi(xW_{\text{up}})W_{\text{down}}$$

The input is projected into a larger hidden dimension, passed through an activation function, and then projected back into the model dimension.

But here the intermediate projection is being asked to do two things:

1.  Produce useful candidate features.
    
2.  Decide which of those features should remain active.
    

GLUs separate these two responsibilities.

Instead of computing one projection, we compute two:

$$u = xW_{\text{up}}$$

$$g = xW_{\text{gate}}$$

The first branch, (u), contains the candidate features. The second branch, (g), decides how strongly each candidate feature should be allowed through.

The two branches are then combined using elementwise (hadamard) multiplication:

$$h = u \odot \phi(g)$$

Finally, the result is projected back into the residual-stream dimension:

$$\operatorname{FFN} {\text{gated}}(x) = \left( xW{\text{up}} \odot \phi(xW_{\text{gate}}) \right) W_{\text{down}}$$

A useful way to remember this is:

$$\boxed{\text{output}=\text{content}\times\text{permission}}$$

This gating idea should look familiar if you have studied LSTMs.

An LSTM maintains a recurrent memory called the cell state. It uses learned gates to decide what information should be forgotten, written, and exposed:

$$c_t = f_t \odot c_{t-1} + i_t \odot \widetilde{c}_t$$

$$h_t = o_t \odot \tanh(c_t)$$

The important operation is the multiplication:

$$\text{information} \odot \text{gate}$$

The network does not just create information but It also separately computes a gate that decides how much of that information should survive.

Gated FFNs borrow this same principle.

The original GLU used a sigmoid function for the gate:

$$\operatorname{GLU}(x) = (xW_{\text{up}}+b_{\text{up}}) \odot \sigma(xW_{\text{gate}}+b_{\text{gate}})$$

Because

$$0 < \sigma(z) < 1,$$

the sigmoid branch behaves like a soft valve.

When a gate value is close to 0, the corresponding candidate feature is suppressed:

$$u_j \cdot 0 \approx 0$$

When it is close to (1), the feature is passed through:

$$u_j \cdot 1 \approx u_j$$

For one hidden coordinate (j), the computation is:

$$h_j = \left(xw_{\text{up},j}\right) \sigma\left(xw_{\text{gate},j}\right)$$

The two projections can therefore learn different jobs where w\_(up,j) detects or constructs a feature while w\_(gate,j) learns when that feature is useful.

GLUs were originally introduced in gated convolutional language models as a simplified, parallelizable gating mechanism. ([here](https://proceedings.mlr.press/v70/dauphin17a.html?utm_source=chatgpt.com))

Let's now trace what happens with a singular token.

Suppose one token is represented by:

$$x \in \mathbb{R}^{d_{\text{model}}}$$

The gated FFN performs the following operations.

**1\. Construct candidate features**

$$u=xW_{\text{up}}$$

where

$$W_{\text{up}} \in \mathbb{R}^{d_{\text{model}}\times d_{\text{ff}}}$$

Therefore:

$$u\in\mathbb{R}^{d_{\text{ff}}}$$

**2\. Construct the gates**

$$g=xW_{\text{gate}}$$

where

$$W_{\text{gate}} \in \mathbb{R}^{d_{\text{model}}\times d_{\text{ff}}}$$

Therefore:

$$g\in\mathbb{R}^{d_{\text{ff}}}$$

**3\. Apply the gate activation**

$$\widehat{g}=\phi(g)$$

The choice of phi determines whether this is a GLU, ReGLU, GEGLU, or SwiGLU.

**4\. Modulate the candidate features**

$$h=u\odot\widehat{g}$$

Element (j) is calculated as:

$$h_j=u_j\widehat{g}_j$$

Each hidden feature therefore receives its own input-dependent scaling factor.

**5\. Project back down**

$$y=hW_{\text{down}}$$

where

$$W_{\text{down}} \in \mathbb{R}^{d_{\text{ff}}\times d_{\text{model}}}$$

Thus:

$$y\in\mathbb{R}^{d_{\text{model}}}$$

The entire operation is:

$$\boxed{ \operatorname{FFN}{\text{gated}}(x)= \left[ xW{\text{up}} \odot \phi(xW_{\text{gate}}) \right] W_{\text{down}} }$$

For a sequence

$$X\in\mathbb{R}^{T\times d_{\text{model}}},$$

the same computation is applied to all (T) token representations in parallel.

### GLU to ReGLU, GEGLU, and SwiGLU

The sigmoid function is not the only possible gating function. [*Shazeer 2020*](https://arxiv.org/pdf/2002.05202) tested several alternatives inside Transformer FFNs and found that gated variants such as GEGLU and SwiGLU could outperform ordinary ReLU or GELU FFNs under comparable parameter budgets.

Ignoring biases, the major variants are:

**Original GLU**

$$\operatorname{GLU}(x) = \sigma(xW_{\text{gate}}) \odot (xW_{\text{up}})$$

**ReGLU**

$$\operatorname{ReGLU}(x) = \operatorname{ReLU}(xW_{\text{gate}}) \odot (xW_{\text{up}})$$

**GEGLU**

$$\operatorname{GEGLU}(x) = \operatorname{GELU}(xW_{\text{gate}}) \odot (xW_{\text{up}})$$

**SwiGLU**

$$\operatorname{SwiGLU}(x) = \operatorname{SiLU}(xW_{\text{gate}}) \odot (xW_{\text{up}})$$

where:

$$\operatorname{SiLU}(z)=z\sigma(z)$$

The full SwiGLU FFN is therefore:

$$\boxed{ \operatorname{FFN}{\text{SwiGLU}}(x) = \left[ \operatorname{SiLU}(xW{\text{gate}}) \odot (xW_{\text{up}}) \right] W_{\text{down}} }$$

<details data-node-type="hn-details-summary">
<summary>SiLU</summary>
<latex-preview>\operatorname{SiLU}(z)=z,\sigma(z)</latex-preview><p></p><p>where the sigmoid function is:</p><latex-preview>\sigma(z)=\frac{1}{1+e^{-z}}</latex-preview><p></p>
</details>

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/724c977c-d122-4e46-a7f2-1d38a8fe5386.png align="center")

A above image is taken from \[[Narang 2020](https://arxiv.org/pdf/2102.11972)\] corroborating Shazeer's work comparing different activation functions, and it can be clearly observed GLU variants are performed the best.

Now,

A normal FFN has two major weight matrices:

$$x \xrightarrow{W_{\text{up}}} d_{\text{ff}} \xrightarrow{W_{\text{down}}} d_{\text{model}}$$

Its approximate parameter count is:

$$2d_{\text{model}}d_{\text{ff}}$$

A gated FFN has three:

$$W_{\text{up}}, \qquad W_{\text{gate}}, \qquad W_{\text{down}}$$

Its parameter count is approximately:

$$3d_{\text{model}}d_{\text{ff,gated}}$$

Keeping the same hidden width would make the gated FFN approximately (50%) larger. Therefore, fair comparisons reduce the gated hidden dimension. To match the parameter count:

$$3d_{\text{model}}d_{\text{ff,gated}} = 2d_{\text{model}}d_{\text{ff,standard}}$$

Canceling d\_model:

$$d_{\text{ff,gated}} = \frac{2}{3}d_{\text{ff,standard}}$$

The traditional Transformer commonly uses:

$$d_{\text{ff,standard}}=4d_{\text{model}}$$

Therefore, an approximately parameter-matched gated FFN uses:

$$d_{\text{ff,gated}} = \frac{2}{3}(4d_{\text{model}}) = \frac{8}{3}d_{\text{model}}$$

So instead of expanding from d\_model to 4d\_model, a parameter-matched SwiGLU block expands to roughly:

$$2.67d_{\text{model}}$$

This is why gated FFNs often have a seemingly unusual intermediate dimension rather than the clean 4d\_model used by older Transformers.

### Putting it into the modern Transformer block

After combining bias-free projections, RMSNorm, pre-norm, and SwiGLU, the FFN part of a modern Transformer block becomes:

$$z_l = \operatorname{RMSNorm}(x_l)$$

$$f_l = \left[ \operatorname{SiLU}(z_lW_{\text{gate}}) \odot (z_lW_{\text{up}}) \right] W_{\text{down}}$$

$$x_{l+1} = x_l+f_l$$

Compare this with the GPT-1 FFN:

$$\operatorname{FFN}_{\text{GPT-1}}(x) = \operatorname{GELU}(xW_1+b_1)W_2+b_2$$

The modern replacement is:

$$\boxed{ \operatorname{FFN}{\text{modern}}(x) = \left[ \operatorname{SiLU}(xW{\text{gate}}) \odot (xW_{\text{up}}) \right] W_{\text{down}} }$$

## Huff! Next is Serial vs Parallel layers

We have already done so much. But there is another assumption inside the Transformer block that the attention must finish before the FFN can begin.

A normal pre-norm Transformer block arranges attention and the FFN serially as we all know:

$$\widetilde{x}_l = x_l + \operatorname{Attention} \left( \operatorname{Norm}(x_l) \right)$$

followed by:

$$x_{l+1} = \widetilde{x}_l + \operatorname{FFN} \left( \operatorname{Norm}(\widetilde{x}_l) \right)$$

So the computational flow is:

$$x_l \longrightarrow \operatorname{Attention} \longrightarrow \operatorname{FFN} \longrightarrow x_{l+1}$$

This is a standard serialized formulation. The important detail is that the FFN does not process the original x\_l rather the representation after attention has modified it:

$$\widetilde{x}_l = x_l + \operatorname{Attention} \left( \operatorname{Norm}(x_l) \right)$$

Expanding the complete block will make this dependency clearer:

$$x_{l+1} = x_l + \operatorname{Attention} \left( \operatorname{Norm}(x_l) \right) + \operatorname{FFN} \left( \operatorname{Norm} \left[ x_l + \operatorname{Attention} \left( \operatorname{Norm}(x_l) \right) \right] \right)$$

The FFN input contains the result of attention and naturally, the FFN cannot begin until the attention block has finished.

Conceptually, this arrangement makes sense. We can roughly think of the two operations as Attention as communication between tokens and FFN as feature transformation within each token.

### Parallel formulation

Guys at GPT-J introduced a way in which attention and the FFN receive the same input instead of being placed one after another. GPT-NeoX-20B later used nearly the same architectural organization, and PaLM also adopted parallel Transformer blocks.

First, normalize the residual stream:

$$n_l = \operatorname{Norm}(x_l)$$

Then send the same n\_l into both attention and the FFN:

$$a_l = \operatorname{Attention}(n_l)$$

$$f_l = \operatorname{FFN}(n_l)$$

Finally, add both updates to the original residual stream:

$$\boxed{ x_{l+1} = x_l+a_l+f_l }$$

Substituting the branches gives:

$$\boxed{ x_{l+1} = x_l + \operatorname{Attention} \left( \operatorname{Norm}(x_l) \right) + \operatorname{FFN} \left( \operatorname{Norm}(x_l) \right) }$$

Here is a illustration:

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/c6d9cd02-b34b-464e-8a4a-70fc8618258d.png align="center")

PaLM and GPT-NeoX reported that parallel Transformer blocks improved training throughput by roughly 15% in their large-scale setups.

Some performance trade-off also appeared small at scale. PaLM observed a slight degradation at the 8B scale, but no measurable degradation at 62B, and therefore used parallel layers in its 540B model. Large models seemed capable of compensating for the fact that the FFN no longer sees the current block’s attention output immediately, while still benefiting from the faster and more hardware-friendly computation graph.

## Positional Information: From Absolute Embeddings to RoPE

As we know self-attention has no built-in understanding of order.

### Let's first revisit absolute positional encodings

The original Transformer used fixed sinusoidal positional encodings.

For a token at position (pos), the positional vector is generated using:

$$PE_{(pos,2i)} = \sin\left( \frac{pos}{10000^{2i/d_{\text{model}}}} \right)$$

$$PE_{(pos,2i+1)} = \cos\left( \frac{pos}{10000^{2i/d_{\text{model}}}} \right)$$

Each pair of dimensions uses a different frequency. Some dimensions change rapidly with position, and some change much more slowly.

The positional vector is added directly to the token embedding:

$$h_{pos} = e_{\text{token}} + PE_{pos}$$

Later models such as GPT-1, GPT-2, and GPT-3 replaced the fixed sinusoidal vectors with learned absolute position embeddings:

$$h_i=e_i+p_i$$

where p\_i is a trainable vector associated with position i.

### Relative positional information

Suppose the query token is at position i, and it is attending to a key token at position j.

The relevant positional relationship is:

$$r=j-i$$

For example:

$$i=8,\qquad j=5$$

gives:

$$r=5-8=-3$$

The key lies three positions before the query. A relative-position attention mechanism can associate a learned representation with this distance:

$$a^K_{j-i}$$

The attention score can then be written as:

$$e_{ij} = \frac{ q_i^\top \left( k_j+a^K_{j-i} \right) }{ \sqrt{d_k} }$$

Expanding the dot product gives:

$$e_{ij} = \frac{ q_i^\top k_j + q_i^\top a^K_{j-i} }{ \sqrt{d_k} }$$

The score now contains two pieces:

$$\underbrace{q_i^\top k_j}{\text{content compatibility}} + \underbrace{q_i^\top a^K{j-i}}{\text{relative-position compatibility}}$$

Let's now discuss RoPE which takes a third approach.

### Rotary Position Embeddings

Rotary Position Embeddings, or **RoPE**, do not add a positional vector to the token embedding. RoPE rotates the query and key vectors according to their positions.

A query at position m is rotated according to m, while a key at position n is rotated according to n. And hen the rotated query and key are compared, their dot product depends on the difference between the two rotations:

$$n-m$$

It will be more clear in a second.

### Begin with ordinary attention

For the token at position m, we construct:

$$q_m=x_mW_Q$$

For the token at position n, we construct:

$$k_n=x_nW_K$$

Ordinary attention compares them using:

$$q_m^\top k_n$$

RoPE transforms them before this dot product is calculated:

$$\widetilde q_m=R_mq_m$$

$$\widetilde k_n=R_nk_n$$

where R\_m and R\_n are position-dependent rotation matrices.

Before understanding the complete high-dimensional operation, let us first understand what rotation means in two dimensions.

<details data-node-type="hn-details-summary">
<summary>How does multiplying by a rotation matrix rotate a vector?</summary>
<p>This should be implied, but here is a quick revision from high school.</p><p>Consider a two-dimensional vector:</p><latex-preview data-syntax-type="default">v= \begin{bmatrix} a\\ b \end{bmatrix}</latex-preview><p>The two-dimensional rotation matrix for an angle theta is:</p><latex-preview>R(\theta)= \begin{bmatrix} \cos\theta &amp; -\sin\theta \\ \sin\theta &amp; \cos\theta \end{bmatrix}</latex-preview><p>Multiplying the matrix by the vector gives:</p><latex-preview>R(\theta)\mathbf{v}=\begin{bmatrix}\cos\theta &amp; -\sin\theta \\ \sin\theta &amp; \cos\theta\end{bmatrix}\begin{bmatrix}a \\ b\end{bmatrix}</latex-preview><p>Carrying out the matrix multiplication:</p><latex-preview>R(\theta)v = \begin{bmatrix} a\cos\theta-b\sin\theta\\ a\sin\theta+b\cos\theta \end{bmatrix}</latex-preview><p>To see why this is a rotation, write the original vector using its magnitude r and direction alpha:</p><latex-preview>\mathbf{v}=r\begin{bmatrix}\cos\alpha \cr \sin\alpha\end{bmatrix}</latex-preview><p>Substituting this into the rotation:</p><latex-preview>R(\theta)\mathbf{v}=r\begin{bmatrix}\cos\alpha\cos\theta-\sin\alpha\sin\theta \cr \cos\alpha\sin\theta+\sin\alpha\cos\theta\end{bmatrix}</latex-preview><p>Using the angle-addition identities:</p><latex-preview>\cos(\alpha+\theta)=\cos\alpha\cos\theta-\sin\alpha\sin\theta</latex-preview><latex-preview>\sin(\alpha+\theta)=\sin\alpha\cos\theta+\cos\alpha\sin\theta</latex-preview><p>we obtain:</p><latex-preview>R(\theta)\mathbf{v}=r\begin{bmatrix}\cos(\alpha+\theta)\cr\sin(\alpha+\theta)\end{bmatrix}</latex-preview><p>The original vector pointed in direction alpha. The new vector points in direction:</p><latex-preview data-syntax-type="default">\alpha+\theta</latex-preview><p>Therefore, multiplying by (R(\theta)) rotates the vector by exactly (\theta).</p><p>The vector's magnitude remains unchanged:</p><latex-preview>\left\lVert R(\theta)\mathbf{v}\right\rVert=\left\lVert\mathbf{v}\right\rVert</latex-preview><p>because:</p><latex-preview>\left(a\cos\theta-b\sin\theta\right)^2+\left(a\sin\theta+b\cos\theta\right)^2=a^2+b^2</latex-preview><p></p><img class="rounded-lg max-w-full h-auto" src="https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/7d5d107f-a2f4-4a43-b472-130d7b05d1a6.png" isuploading="false" align="center">
</details>

### Make the rotation depend on position

Choose a rotational frequency:

$$\theta$$

For a query at position m, RoPE rotates it by:

$$m\theta$$

Therefore:

$$\widetilde q_m = R(m\theta)q_m$$

For a key at position (n):

$$\widetilde k_n = R(n\theta)k_n$$

So the rotations progress with position:

$$\begin{aligned} \text{position }0 &\rightarrow R(0\theta)\\ \text{position }1 &\rightarrow R(1\theta)\\ \text{position }2 &\rightarrow R(2\theta)\\ \text{position }3 &\rightarrow R(3\theta) \end{aligned}$$

Each position therefore produces a different orientation.

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/b7eb7b4f-67cb-4364-93f6-f68538784ff4.png align="center")

### Compare two rotated vectors

Attention calculates the dot product between the rotated query and key:

$$\widetilde q_m^\top\widetilde k_n$$

Substitute their definitions:

$$\widetilde q_m^\top\widetilde k_n = \left( R(m\theta)q_m \right)^\top \left( R(n\theta)k_n \right)$$

Move the transpose inside:

$$= q_m^\top R(m\theta)^\top R(n\theta) k_n$$

For a rotation matrix:

$$R(\phi)^\top = R(-\phi)$$

Therefore:

$$R(m\theta)^\top R(n\theta) = R(-m\theta)R(n\theta)$$

Rotations combine by adding their angles:

$$R(\alpha)R(\beta) = R(\alpha+\beta)$$

So:

$$R(-m\theta)R(n\theta) = R((n-m)\theta)$$

The final dot product becomes:

$$\boxed{ \widetilde q_m^\top\widetilde k_n = q_m^\top R((n-m)\theta) k_n }$$

This is the central equation of RoPE.

The query was rotated using its absolute position m, and the key was rotated using its absolute position n. But once their dot product is calculated, the positional effect depends only on:

$$n-m$$

which is their relative distance.

### Geometric intuition

Suppose the original query points at an angle (\\alpha), while the original key points at an angle (\\beta).

After applying RoPE:

$$\text{query angle} = \alpha+m\theta$$

$$\text{key angle} = \beta+n\theta$$

The angle between them becomes:

$$(\beta+n\theta)-(\alpha+m\theta)$$

Rearranging:

$$= (\beta-\alpha)+(n-m)\theta$$

The first term represents the original content relationship:

$$\beta-\alpha$$

The second represents relative position:

$$(n-m)\theta$$

RoPE therefore modifies the content similarity according to how far apart the tokens are. It does not calculate a separate content score and positional score. Instead, it alters the geometry of the query and key so that the dot product itself becomes position-aware.

### 2 dimensions examples to a full attention head

Everything we have discussed so far happened in only two dimensions. We took a two-dimensional vector,

$$\begin{bmatrix} q_0\\ q_1 \end{bmatrix}$$

and rotated it by multiplying it with:

$$\begin{bmatrix} \cos(m\theta) & -\sin(m\theta)\\ \sin(m\theta) & \cos(m\theta) \end{bmatrix}$$

But an actual query or key vector inside an attention head is much larger. For instance, Lets take d\_h=128 which results in each query vector also in 128-dimensions.

$$q_m= \begin{bmatrix} q_0\\ q_1\\ q_2\\ q_3\\ \vdots\\ q_{126}\\ q_{127} \end{bmatrix}$$

We obviously can't visualize a rotation in 128-dimensional space. RoPE approaches this by dividing the vector into adjacent pairs:

$$(q_0,q_1),\quad (q_2,q_3),\quad (q_4,q_5),\quad \ldots,\quad (q_{126},q_{127})$$

Each pair is treated as an independent two-dimensional vector. So a 128-dimensional attention-head vector becomes:

$$\frac{128}{2}=64$$

separate two-dimensional planes.

RoPE then rotates every pair independently. For the j-th pair:

$$\begin{bmatrix} q_{2j}\ q_{2j+1} \end{bmatrix}$$

the rotated coordinates at position m are:

$$\begin{bmatrix} q_{2j}\\ q_{2j+1} \end{bmatrix}$$

$$= \begin{bmatrix} \cos(m\theta_j) & -\sin(m\theta_j)\\ \sin(m\theta_j) & \cos(m\theta_j) \end{bmatrix} \begin{bmatrix} q_{2j}\\ q_{2j+1} \end{bmatrix}$$

Expanding the multiplication:

$$q'{2j} = q{2j}\cos(m\theta_j) - q_{2j+1}\sin(m\theta_j)$$

$$q'{2j+1} = q{2j}\sin(m\theta_j) + q_{2j+1}\cos(m\theta_j)$$

The same operation is applied to every pair in the query vector. The key vector is rotated in exactly the same way, except using the key's position n:

$$\begin{bmatrix} k'{2j}\\ k'{2j+1} \end{bmatrix}$$

$$= \begin{bmatrix} \cos(n\theta_j) & -\sin(n\theta_j)\\ \sin(n\theta_j) & \cos(n\theta_j) \end{bmatrix} \begin{bmatrix} k_{2j}\\ k_{2j+1} \end{bmatrix}$$

### Every pair uses a different frequency

RoPE does not rotate all 64 coordinate pairs at the same speed.

Each pair j receives its own frequency based on this:

$$\theta_j = 10000^{-2j/d_h}$$

where:

$$j=0,1,\ldots,\frac{d_h}{2}-1$$

At position m, the angle used for pair j is:

$$m\theta_j$$

For the first pair:

$$(q_0,q_1)$$

the rotation angle is:

$$m\theta_0$$

For the second pair the rotation angle is:

$$m\theta_1$$

and so on.

Some pairs rotate relatively quickly as the token position changes, while others rotate much more slowly which can be seen clearly.

### A smaller four-dimensional worked example

Suppose we have a four-dimensional query:

$$q_m= \begin{bmatrix} q_0\\ q_1\\ q_2\\ q_3 \end{bmatrix}$$

RoPE divides it into two pairs:

$$\begin{bmatrix} q_0\\ q_1 \end{bmatrix}, \qquad \begin{bmatrix} q_2\\ q_3 \end{bmatrix}$$

The first pair is rotated using frequency theta\_0, while the second is rotated using frequency theta\_1:

$$\begin{bmatrix} q'_0\\ q'_1 \end{bmatrix} = R(m\theta_0) \begin{bmatrix} q_0\\ q_1 \end{bmatrix}$$

$$\begin{bmatrix} q'_2\\ q'_3 \end{bmatrix} = R(m\theta_1) \begin{bmatrix} q_2\\ q_3 \end{bmatrix}$$

The resulting query is:

$$q'_m= \begin{bmatrix} q'_0\\ q'_1\\ q'_2\\ q'_3 \end{bmatrix}$$

Mathematically, all the independent rotations can be collected into one large block-diagonal matrix:

$$R_m= \begin{bmatrix} R(m\theta_0) & 0 & 0 & \cdots\\ 0 & R(m\theta_1) & 0 & \cdots\\ 0 & 0 & R(m\theta_2) & \cdots\\ \vdots & \vdots & \vdots & \ddots \end{bmatrix}$$

Each block is a two-dimensional rotation matrix:

$$R(m\theta_j) = \begin{bmatrix} \cos(m\theta_j) & -\sin(m\theta_j)\\\sin(m\theta_j) & \cos(m\theta_j) \end{bmatrix}$$

## Multi-Query and Grouped-Query Attention

As we know, Multi-head attention gives every attention head its own query, key, and value projections. This provides each head with an independent representation space, allowing different heads to search for and retrieve different kinds of information. However, this design becomes expensive during autoregressive generation.

At every Transformer layer, the keys and values of previous tokens are stored in the KV cache. In ordinary MHA, every attention head contributes a separate key and value vector for every token. As the context grows, repeatedly reading this cache becomes a major memory-bandwidth bottleneck.

Multi-Query Attention and Grouped-Query Attention modify the relationship between query heads and key–value heads to reduce this cost.

<details data-node-type="hn-details-summary">
<summary>Quick revision: prefill, decode, and the KV cac</summary>
<p>During the prefill phase, the complete prompt is already available. All prompt tokens can therefore be processed together using large matrix multiplications:</p><latex-preview>Q=XW_Q,\qquad K=XW_K,\qquad V=XW_V</latex-preview><p>The model is still causal; obviously, a token cannot attend to future tokens but all known prompt positions can be evaluated in parallel. After prefill, generation enters the decode phase. The model produces one token at a time in auto regressive nature:</p><latex-preview>x_{n+1}\rightarrow x_{n+2}\rightarrow x_{n+3}\rightarrow\cdots</latex-preview><p>Without caching, the model would repeatedly reconstruct the keys and values of all previous tokens. The KV cache avoids this by storing them at every attention layer. When a new token x_t reaches a layer, the model calculates only:</p><latex-preview>q_t=x_tW_Q</latex-preview><latex-preview>k_t=x_tW_K</latex-preview><latex-preview>v_t=x_tW_V</latex-preview><p></p><p>The new key and value are appended to the cache:</p><latex-preview>K_{\text{cache}} \leftarrow [K_{\text{cache}};k_t]</latex-preview><latex-preview>V_{\text{cache}} \leftarrow [V_{\text{cache}};v_t]</latex-preview><p>The new query then attends over all cached positions:</p><latex-preview>o_t= \operatorname{Softmax} \left( \frac{ q_tK_{\text{cache}}^\top }{ \sqrt{d_h} } \right) V_{\text{cache}}</latex-preview><p>Queries are not cached because an old query is not needed by future tokens. Future tokens produce their own queries, but reuse the previous keys and values. For batch size B, number of layers L, context length T, number of KV heads H_KV, and head dimension d_h, the approximate cache size becomes:</p><latex-preview>\text{KV-cache bytes} = 2BLTH_{KV}d_h \times \text{bytes per element}</latex-preview><p></p>
</details>

### Decoding is memory-bound

KV caching removes a large amount of redundant computation, but it introduces a different problem that the growing cache must be repeatedly read from GPU memory. During prefill, attention involves large matrix multiplications. Loaded values can be reused across many operations, which GPUs are made to handle.

During decoding, there is only one new query per sequence:

$$q_t\in\mathbb{R}^{1\times d_h}$$

It must be compared with all cached keys:

$$K_{\text{cache}}^\top \in \mathbb{R}^{d_h\times t}$$

The calculation is therefore closer to a vector–matrix multiplication:

$$(1\times d_h)(d_h\times t)$$

A large cache is loaded, but each element participates in relatively few arithmetic operations. This gives decoding low arithmetic intensity. Where Arithmetic intensity measures how much computation is performed for every unit of data moved from memory:

$$\text{Arithmetic intensity} = \frac{ \text{arithmetic operations} }{ \text{memory movement} }$$

High arithmetic intensity means the GPU performs a lot of calculations with every value it loads. Low arithmetic intensity means its compute units spend more time waiting for data.

### A rough arithmetic-intensity model

Let:

$$b=\text{batch size}$$

$$n=\text{number of decoding steps}$$

$$d=\text{model dimension}$$

$$H=\text{number of query heads}$$

$$d_h=\text{dimension of one head}$$

Usually:

$$d=Hd_h$$

The following analysis is a simplified asymptotic model. It omits constant factors and implementation-specific details, but it captures the scaling behaviour that motivates MQA and GQA.

Across n decoding steps, dense projections and feed-forward transformations perform roughly:

$$O(bnd^2)$$

arithmetic operations. For ordinary multi-head attention, the total memory movement is approximately:

$$O(bn^2d+nd^2)$$

The two terms represent different sources of memory traffic.

The term

$$bn^2d$$

comes from repeatedly reading the KV cache.

At decoding step t, the model reads approximately t cached positions, each with total KV width proportional to d:

$$O(btd)$$

Summing this over all decoding steps gives:

$$bd(1+2+\cdots+n)$$

the total cache traffic becomes:

$$O(bn^2d)$$

The cache itself grows only linearly with sequence length:

$$O(bnd)$$

The quadratic term appears because the growing cache is read repeatedly across the complete generation.

The second memory term,

$$nd^2$$

represents loading the model's projection and feed-forward weights across decoding steps. These weights can be reused across the batch, which is why this term does not contain b. Using the simplified operation and memory counts:

$$\text{AI}_{\text{MHA}} \sim \frac{ bnd^2 }{ bn^2d+nd^2 }$$

$$\text{AI}_{\text{MHA}} = O \left( \left( \frac{n}{d} + \frac{1}{b} \right)^{-1} \right)$$

This expression explains several properties of autoregressive decoding.

As context length increases:

$$n\uparrow \quad\Rightarrow\quad \frac{n}{d}\uparrow \quad\Rightarrow\quad \text{arithmetic intensity}\downarrow$$

A larger batch improves weight reuse:

$$b\uparrow \quad\Rightarrow\quad \frac{1}{b}\downarrow \quad\Rightarrow\quad \text{arithmetic intensity}\uparrow$$

However, interactive serving cannot always rely on large batches, and context length is usually determined by the application. This leaves the KV cache itself as an important architectural target.

Here is an AI-generated image to illustrate:

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/082677df-ce04-46a5-9705-9174090c450f.png align="center")

### Ordinary Multi-Head Attention

In ordinary Multi-Head Attention, every head has its own projections:

$$Q_h=XW_Q^{(h)}$$

$$K_h=XW_K^{(h)}$$

$$V_h=XW_V^{(h)}$$

Head h computes:

$$O_h= \operatorname{Softmax} \left( \frac{ Q_hK_h^\top }{ \sqrt{d_h} } \right) V_h$$

The head outputs are concatenated and projected back into the residual-stream dimension:

$$O= \operatorname{Concat} (O_1,O_2,\ldots,O_H)W_O$$

In ordinary MHA:

$$H_Q=H_K=H_V=H$$

If a model has 32 attention heads, every token contributes 32 key vectors and 32 value vectors to the cache at every layer.

This gives every head an independent query space, key space, and value space. It also makes KV-cache size proportional to the full number of attention heads.

### Multi-Query Attention

Multi-Query Attention keeps all query heads but replaces the head-specific keys and values with one shared key head and one shared value head.

For instance:

$$H_Q=32, \qquad H_{KV}=1$$

The query heads remain separate as it is:

$$Q_1,Q_2,\ldots,Q_{32}$$

but all heads share:

$$K_{\text{shared}}, \qquad V_{\text{shared}}$$

Each query head computes:

$$O_h= \operatorname{Softmax} \left( \frac{ Q_hK_{\text{shared}}^\top }{ \sqrt{d_h} } \right) V_{\text{shared}}$$

These are still different Attention heads, but just a shared library of keys and values. Sharing KV does not force the attention heads to produce identical outputs, and it's very trivial to understand.

Each head has its own query projection:

$$Q_1\neq Q_2\neq\cdots\neq Q_H$$

Therefore, even with the same keys:

$$Q_1K^\top \neq Q_2K^\top$$

The heads produce different attention distributions:

$$A_1 = \operatorname{Softmax}(Q_1K^\top)$$

$$A_2 = \operatorname{Softmax}(Q_2K^\top)$$

and hence:

$$A_1\neq A_2$$

They consequently retrieve different weighted combinations of the shared values:

$$O_1=A_1V$$

$$O_2=A_2V$$

### Reduction in memory movement by MQA

In ordinary MHA, the total width of all cached key heads is:

$$Hd_h=d$$

The same is true for the values. In MQA, only one key head and one value head are cached:

$$d_h=\frac{d}{H}$$

The KV-cache traffic term therefore changes from:

$$bn^2d$$

to:

$$bn^2d_h$$

Since:

$$d_h=\frac{d}{H}$$

this becomes:

$$bn^2\frac{d}{H}$$

The head-related KV-cache traffic is therefore reduced by approximately:

$$\frac{d}{d/H}=H$$

With 32 query heads:

$$\text{KV-cache traffic reduction} \approx 32\times$$

The simplified MQA memory-access becomes:

$$O \left( bnd + bn^2d_h + nd^2 \right)$$

The term

$$bnd$$

represents non-cache activation movement that still occurs during decoding.

The term

$$bn^2d_h$$

represents repeatedly reading the single shared K/V head.

The term

$$nd^2$$

represents loading the model weights.

The arithmetic work remains approximately:

$$O(bnd^2)$$

Therefore:

$$\text{AI}_{\text{MQA}} \sim \frac{ bnd^2 }{ bnd+bn^2d_h+nd^2 }$$

$$\text{AI}_{\text{MQA}} = O \left( \left( \frac{1}{d} + \frac{nd_h}{d^2} + \frac{1}{b} \right)^{-1} \right)$$

Using:

$$d_h=\frac{d}{H}$$

we obtain:

$$\boxed{ \text{AI} _{\text{MQA}} =O \left( \left( \frac{1}{d} + \frac{n}{dH} + \frac{1}{b} \right)^{-1} \right) }$$

The context-length term has changed to:

$$\boxed{ \frac{n}{d} \longrightarrow \frac{n}{dH} }$$

### Grouped-Query Attention

Grouped-Query Attention (a recent and understandable extension of MQA) uses more than one K/V head, but fewer K/V heads than query heads so one can decide the tradeoff.

Suppose:

$$H_Q=32$$

and:

$$H_{KV}=8$$

The 32 query heads are divided into eight groups:

$$\frac{H_Q}{H_{KV}} = \frac{32}{8} = 4$$

Let g(h) denote the KV group assigned to query head h. The output of that query head is:

$$O_h= \operatorname{Softmax} \left( \frac{ Q_hK_{g(h)}^\top }{ \sqrt{d_h} } \right) V_{g(h)}$$

The query heads inside one group still have different query projections and therefore produce different attention patterns. They only share the representation being searched and retrieved.

### Cache and bandwidth trade-off

For H\_Q query heads and H\_KV key–value heads, the total cached K/V width per token is:

$$H_{KV}d_h$$

Since:

$$d=H_Qd_h$$

we can write:

$$H_{KV}d_h = d\frac{H_{KV}}{H_Q}$$

The cache size relative to ordinary MHA is therefore:

$$\boxed{ \frac{ \text{GQA cache} }{ \text{MHA cache} } = \frac{H_{KV}}{H_Q} }$$

So this becomes the cache reduction factor:

$$\boxed{ \frac{H_Q}{H_{KV}} }$$

For 32 query heads:

| Query heads | KV heads | Architecture | Queries per KV head | KV cache relative to MHA |
| --- | --- | --- | --- | --- |
| 32 | 32 | MHA | 1 | (1) |
| 32 | 16 | GQA | 2 | (1/2) |
| 32 | 8 | GQA | 4 | (1/4) |
| 32 | 4 | GQA | 8 | (1/8) |
| 32 | 1 | MQA | 32 | (1/32) |

The corresponding cache-traffic term across decoding becomes:

$$O \left( bn^2H_{KV}d_h \right)$$

or equivalently:

$$O \left( bn^2d \frac{H_{KV}}{H_Q} \right)$$

The generalized arithmetic-intensity expression is therefore approximately:

$$\boxed{ \text{AI} = O \left( \left( \frac{1}{d} + \frac{nH_{KV}}{dH_Q} + \frac{1}{b} \right)^{-1} \right) }$$

so GQA turns the number of KV heads, H\_KV, into an architectural efficiency knob. Increasing H\_KV gives the model more independent key and value representation spaces, which provides greater representational freedom. However, it also increases the size of the KV cache and the amount of data that must be moved from GPU memory during decoding. Reducing H\_KV, on the other hand, forces more query heads to share the same key and value representations. This slightly restricts the model’s flexibility, but produces a smaller KV cache, reduces memory-bandwidth requirements, and makes autoregressive decoding cheaper and faster. Therefore, the number of KV heads can be chosen to balance representational capacity against inference efficiency.

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/2bc5a7bf-419a-4a23-a38b-454a6b65278e.png align="center")

MQA can hurt, but GQA is best of both worlds; see here: (from [Ainslie 2023](https://arxiv.org/pdf/2305.13245))

![](https://cdn.hashnode.com/uploads/covers/66a2992853a702ac0b81f928/f71768b4-4dc6-46d3-842d-cb055ce73967.png align="center")

We've discussed too much today. Let's conclude.

## So, what actually changed?

We started with the GPT-1-style decoder-only Transformer, which still retained most of the internal design choices of the original 2017 architecture.

It used post-norm Transformer blocks, full LayerNorm, bias terms throughout its projections, a GELU-based FFN, serial attention and feed-forward sublayers, learned absolute positional embeddings, and ordinary Multi-Head Attention.

Over time, almost every one of these choices was reconsidered. Post-norm was moved to pre-norm so that the residual stream could provide a cleaner path for gradients through deep networks. In some architectures, an additional normalization was placed after the sublayer as well, giving us sandwich or double normalization. LayerNorm was often replaced by RMSNorm. The mean subtraction and learned bias were removed, preserving the scale-control property that appeared to matter most while simplifying the operation and reducing memory-bound work.

Bias terms were also removed from many linear projections. They provided little additional representational value at scale, added more memory operations, and were reported to negatively affect stability in some large-model training runs.

The ordinary GELU FFN was replaced by gated variants such as SwiGLU. Instead of asking one projection to both construct features and decide which features should survive, gated FFNs separate these responsibilities into a content branch and a gate branch.

The assumption that attention must always finish before the FFN begins was also relaxed. Parallel Transformer blocks allow attention and the FFN to process the same normalized residual-stream representation simultaneously, improving hardware utilization in architectures that adopt this arrangement.

Absolute positional embeddings were replaced by mechanisms such as RoPE. Instead of adding a positional vector to each token representation, RoPE rotates queries and keys so that their dot product naturally depends on relative position.

Finally, ordinary Multi-Head Attention was modified for efficient autoregressive decoding. MQA allows many query heads to share one key–value head, while GQA provides an adjustable middle ground between full MHA and MQA.

It is also important to avoid treating this collection of choices as one universal architecture. Not every modern model uses every optimization discussed here. Some retain serial blocks, some use full MHA, some use GQA, and some add additional normalization or positional mechanisms. Modern Transformer design is better understood as a collection of tested trade-offs than as one final standardized block.

### What We Can and Cannot Know

Most of the architectural evolution discussed in this article comes from research papers, technical reports, and implementations released for publicly documented or open-weight models. But the public record is almost certainly a lagging view of the frontier labs. By the time an architectural choice appears in a paper or model report, frontier labs may already have tested, modified, or abandoned it internally.

In that sense, we are studying the best architecture that has been made visible to us, not necessarily the most advanced architecture currently being trained behind closed doors. Frontier labs rarely disclose enough about their newest models to reconstruct their normalization choices, attention patterns, positional methods, loss functions, data mixtures, or training-stability techniques with confidence.

### Where to Go Next

The Transformer block itself is only one part of building a modern language model. Several important topics deserve their own treatment, including QK normalization for controlling attention-logit growth, z-loss for stabilizing vocabulary logits, long-context RoPE extensions, partial and multimodal rotary embeddings, sliding-window and hybrid attention, Mixture-of-Experts layers, KV-cache quantization, FlashAttention, speculative decoding, initialization rules, residual scaling, and hyperparameter transfer across model sizes.

Those ideas operate either around the Transformer block or at the level of the complete training and inference system. Trying to include all of them here would turn this article into an entire course.

## Conclusion

There is no single final modern Transformer. There is a family of architectures built from carefully chosen compromises between training stability, model quality, hardware efficiency, memory usage, and inference speed. This blog was long as always.

Feel free to connect with me on my social media platforms:

*   [X](https://x.com/rishi2220)
    
*   [LinkedIn](https://www.linkedin.com/in/rishi-ahuja-b1a224310/).
    

Your thoughts and feedback are always appreciated!