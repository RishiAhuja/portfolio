---
title: "Go Beneath the Abstraction: Building Interactive UIs with FernKit"
brief: "Technical deep dive into FernKit UI toolkit, exploring low-level rendering, widget systems, and building UIs from scratch with C++."
dateAdded: 2025-08-03T00:00:00.000Z
hashnodeUrl: "https://rishi2220.hashnode.dev/fernkit"
readTimeInMinutes: 10
author: "Rishi Ahuja"
---
## **Go Beneath the Abstraction: Building UIs with FernKit**

As CS students and devs, we’re often nudged toward "tech stack maxxing", mastering frameworks, collecting tutorials, and grinding Leetcode. But in the process, we risk missing something deeper: **the ideas behind the tools**.

When I first learned Flutter at 14, I built a working to-do app with Firebase. It did what it needed to do.

But now, studying CS in college, I look at the *same* app through a very different lens. I think about how the input travels through the event pipeline, how rendering works all the way down to the pixels, and why certain architectural patterns emerge in the first place. It’s not just about getting it to work anymore; it’s about understanding *why* it works and how I might build something like it from scratch.

That’s what FernKit is about. It’s not just a UI framework in C++. It’s a philosophy:

*   **Build from first principles.**
    
*   **Understand what your tools are hiding.**
    
*   **Recreate, not just reuse.**
    

* * *

FernKit is my attempt to make the machinery visible, to replace the black box with a glass one. Every pixel, every button, every layout, hand-built, transparent, and understandable. I'm launching the first public beta (`0.1.0`), and I want to walk you through it.

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">Just a heads-up: think of this blog post as a quick tour to give you a feel for the project. It’s a starting guide, but it barely scratches the surface. There’s a ton of detailed documentation covering every widget, the layout system, the scene manager, and more over at <a target="_self" rel="noopener noreferrer nofollow" class="text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer" href="http://fernkit.in/docs" style="pointer-events: none;"><strong>fernkit.in/docs</strong></a>.</div>
</div>

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1753991863011/70c15491-afac-4d90-9624-afff0a241cf7.png align="center")

### **The Core Idea: Building from First Principles**

I started with one simple rule for Fern: **zero external dependencies**. I wanted to create a self-contained world where every piece of the puzzle was right there in the source code, understandable without needing to chase down massive, external libraries.

Without a graphics library like OpenGL or a browser engine to lean on, I had to confront the fundamentals. Fern paints every single pixel by itself. Every line, every circle, and every character of text is drawn using mathematical algorithms that manipulate a pixel buffer directly. The cool part is that this pixel buffer can be rendered into a native Linux window or a web browser via WebAssembly, all from the same C++ codebase.

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">It's also worth mentioning that for those who want to go even deeper, there's an older, web-based C implementation of Fern. It has fewer features than the current C++ version, but it offers incredibly direct and raw control over the rendering process, which some of you might find interesting to explore.</div>
</div>

This leads to a few core principles:

*   **Manual Pixel-by-Pixel Rendering**: At its heart, Fern is a software renderer. There's no hidden graphics API doing the heavy lifting.
    
*   **Zero-Dependency Architecture**: The core framework is pure C++. This means a simpler build process and a codebase you can read from top to bottom.
    
*   **Modern, Declarative API**: Although the underlying implementation is low-level, the API you'll use feels modern. I took heavy inspiration from Flutter for the declarative widget-tree approach to layouts.
    
*   **A Complete Toolkit**: Fern isn't just one library; it's the main component of FernKit, a comprehensive suite of tools I built to make the development experience feel complete.
    

* * *

### **It's More Than a Library: The FernKit Ecosystem**

Fern isn't just a single UI library; it's the centerpiece of a larger ecosystem of tools I built to create a cohesive development experience. I gave them some thematic names that fit the whole "growing from nothing" idea:

*   **Terra**: This is the bedrock and the CLI for the entire ecosystem. Like soil, it provides the foundation that nurtures everything else. Terra handles project management (`fern sprout`), building (`fern fire`), and orchestrating the other tools.
    
*   **Fern**: The UI library itself, which grows from Terra's foundation. It’s the core C++ library you use to define your UI, from basic shapes to complex, interactive widgets.
    
*   **Conduit**: A rudimentary networking library designed to connect one Fern application to another. Just as a real conduit transports water underground, this tool transports data between your apps. It's currently synchronous, but it lays the groundwork for creating connected experiences.
    
*   **Gleeb**: A Language Server Protocol (LSP) that plugs into your editor to give you things like autocomplete and error checking. Like beneficial bacteria in soil that help plants grow, Gleeb works quietly in the background to make your coding experience smoother.
    
*   **Flare**: A repository of starter templates. When you want to start a new project, Flare provides a bunch of pre-built examples you can pull down with Terra to get a head start.
    

### **Let's Build Something**

Talk is cheap. Let me show you what it feels like to build with Fern.

Here are some example images.

**A counter example:**

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1753991895021/ba087f5d-88f7-4200-8469-2fadbdb2acee.png align="center")

**A simple text editor:**

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1753991899598/568a2a93-e2b9-4a70-8e8f-580e9140c403.png align="center")

**A color picker:**

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1753991903941/676fba37-a681-49af-ae9e-f63775504ceb.png align="center")

#### **The Main Application Structure**

Everything kicks off in `main`, and I designed the startup process to be simple and explicit. You can see the entire lifecycle of the application right here:

```cpp
#include <fern/fern.hpp>
// ... other includes

using namespace Fern;

// ... (UI setup code will go here)

void draw() {
    // This is called on every frame, about 60 times per second.
    // Here, we just clear the screen with a dark background.
    Draw::fill(ModernColors::BackgroundDark);
}

int main() {
    // 1. Initialize the framework and create a window.
    Fern::initialize(680, 420);

    // 2. Define all your widgets.
    setupUI();

    // 3. Register the main draw callback.
    Fern::setDrawCallback(draw);

    // 4. Start the main loop. This function blocks until you close the window.
    Fern::startRenderLoop();

    return 0;
}
```

This structure gives you a clear entry point (`setupUI`) to define your interface and a hook (`draw`) to perform custom, frame-by-frame rendering, just like a game engine.

#### **Styling and Interactivity**

A button isn't just a static rectangle; it needs to communicate that it's interactive. Fern handles this through different visual states: a **normal** state, a **hover** state, and a **pressed** state. To make the button actually *do* something, we use a signal-slot system. A widget emits a "signal" (like `onClick`), and you "connect" a function (a "slot") to it.

```cpp
// Create a modern button style
ButtonStyle buttonStyle;
buttonStyle.normalColor(ModernColors::AccentGreen)  // Default state
          .hoverColor(0xFF059669)                 // Lighter on hover
          .pressColor(0xFF047857)                 // Darker when pressed
          .textColor(ModernColors::TextPrimary)
          .textScale(2)
          .borderRadius(8);                        // Rounded corners

// Create the increment button and apply the style
auto incrementBtn = Button(ButtonConfig(0, 0, 120, 55, "+ ADD").style(buttonStyle));

// Connect a lambda function to the button's onClick signal
incrementBtn->onClick.connect([]() {
    counter++;
    updateCounterDisplay();
});
```

* * *

### **Fern’s Layout Implementation**

Positioning every widget with hard-coded `x,y` coordinates quickly become a nightmare. This is "The Layout Problem," and it’s solved by using layout widgets that automatically arrange their children for you. The most important ones are:

*   **Column**: Stacks its children vertically.
    
*   **Row**: Arranges its children horizontally.
    
*   **Center**: Perfectly centers a single child widget.
    
*   **SizedBox**: An invisible widget that creates a fixed-size gap for spacing.
    

When using layouts, you always position child widgets at `Point(0, 0)`, because the layout itself is now in charge of calculating the final positions.

#### **Flexible Sizing with** `Expanded`

The real magic of responsive design comes from the `Expanded` widget. When you wrap a widget with `Expanded` inside a `Row` or `Column`, it grows

to fill any available space. You can even assign a `flex factor` to control *how much* space it takes relative to other expanded widgets.

Let's see a more complex example. Here's a full-screen layout with a fixed header and footer, and a middle section that splits the remaining space between two flexible children.

```cpp
void setupUI() {
    int width = Fern::getWidth();
    int height = Fern::getHeight();
    
    addWidget(
        // A Column that fills the entire screen
        Column({
            // 1. A fixed-height header
            Container(
                Colors::DarkBlue, 0, 0, width, 80,
                Center(Text(Point(0, 0), "HEADER", 2, Colors::White))
            ),
            
            // 2. An Expanded Row that takes up half the remaining vertical space
            Expanded(
                Row({
                    // This item gets 1 part of the horizontal space
                    Expanded(
                        Padding(Container(Colors::Red, 0, 0, 0, 0, Center(Text(Point(0, 0), "1", 3, Colors::White))), 10),
                        1 
                    ),
                    // This item gets 2 parts (twice the space of the others)
                    Expanded(
                        Padding(Container(Colors::Green, 0, 0, 0, 0, Center(Text(Point(0, 0), "2", 3, Colors::White))), 10),
                        2 
                    ),
                    // This item gets 1 part
                    Expanded(
                        Padding(Container(Colors::Blue, 0, 0, 0, 0, Center(Text(Point(0, 0), "1", 3, Colors::White))), 10),
                        1
                    )
                })
            ),
            
            // 3. An Expanded Column that takes up the other half of the vertical space
            Expanded(
                Column({
                    // These three items share the vertical space equally (flex: 1)
                    Expanded(
                        Padding(Container(Colors::Red, 0, 0, 0, 0, Center(Text(Point(0, 0), "1", 3, Colors::White))), 10),
                        1
                    ),
                    Expanded(
                        Padding(Container(Colors::Green, 0, 0, 0, 0, Center(Text(Point(0, 0), "1", 3, Colors::White))), 10),
                        1
                    ),
                    Expanded(
                        Padding(Container(Colors::Blue, 0, 0, 0, 0, Center(Text(Point(0, 0), "1", 3, Colors::White))), 10),
                        1
                    )
                })
            ),
            
            // 4. A fixed-height footer
            Container(
                Colors::DarkGray, 0, 0, 0, 80,
                Center(Text(Point(0, 0), "FOOTER", 2, Colors::White))
            )
        })
    );
}
```

This declarative structure allows you to build complex, responsive UIs that automatically adapt to the window size.

* * *

### **Managing Complexity with the Scene Manager**

Building single-screen apps is great, but real applications have multiple screens: a main menu, a settings page, a game screen, etc. Juggling all those widgets manually would be a mess.

That's why FernKit includes a **Scene Manager**. A `Scene` is a class that represents a distinct screen in your application. It manages its own set of widgets and has a clear lifecycle:

*   `onCreate()`: Called once to load resources.
    
*   `onEnter()`: Called every time the scene becomes active. This is where you create your UI.
    
*   `onExit()`: Called when you leave the scene. This is where you clean up the UI.
    

Scenes are managed on a stack. You can `pushScene("Settings")` to open a settings menu on top of your game, and then `popScene()` to close it and return right back to where you were. It’s a powerful system for organizing your entire application flow.

* * *

### **The** `0.1.0-beta` Release: An Invitation to Explore

I want to be very clear: **this is a** `0.1.0-beta` release. A lot of things might break.

This is a side project I've poured a ton of time into, but it's still in its early days. The dev experience is definitely best on **Linux** right now, and the custom **TTF text rendering** can still have visual artifacts, especially at small sizes.

I’m launching this beta to get FernKit into the hands of other curious developers and build a community around the idea of transparent, understandable software. I invite you to get involved in any way that sounds fun:

*   **If you're curious:** Clone the repo, run the examples, and dig into the code. See how a `Button` is not just a `rect` and some text.
    
*   **If you're a builder:** Try making a small application of your own. Your feedback on the API design and developer experience would be incredibly valuable.
    
*   **If you want to contribute:** Help me tackle the big stuff! Improving text rendering, getting other platforms working better, or squashing bugs would be amazing.
    

### **Get Started**

I wrote a full getting-started guide, but here are the essential steps to get you up and running quickly:

1.  **Clone the Repo:**
    
    ```bash
    git clone https://github.com/fernkit/fern.git
    cd fern
    ```
    
2.  Run the Installer:
    
    The repository includes a script that sets up the entire toolchain.
    
    ```bash
    chmod +x install.sh
    ./install.sh
    ```
    
3.  Verify Your Installation:
    
    After installing, run the system health check to make sure everything is ready.
    
    ```bash
    fern bloom
    ```
    
    Create & Run Your First Project:
    
    Use the fern CLI to create a new project and run it.
    
    ```bash
    # Create a new project in a new folder
    fern sprout my_first_app
    cd my_first_app
    
    # Build and run the default app for Linux
    fern fire
    ```
    

For the complete guide with prerequisites and advanced topics, please check out the official documentation and the getting started guide at [**fernkit.in/docs**](http://fernkit.in/docs).

* * *

Thanks for checking out Fern. I truly believe the tools we use don’t have to be magic boxes. I’m stoked to see what you think, and even more stoked to see what you might build with it.

Cheers,

Rishi