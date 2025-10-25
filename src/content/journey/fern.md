---
title: "Building Fern"
subtitle: "The complete journey of developing a modern web graphics library"
description: "A deep dive into the development of Fern — a zero-dependency, Wasm-powered graphics and UI library built in C and C++. From early pixel buffers to a Flutter-like layout engine, this post documents the entire story."
publishedDate: 2025-07-23
tags: ["C++", "Wasm", "Graphics", "UI", "Layout Engine"]
category: "project"
projectId: "fern"
eventId: "timeline-30 May 2025"
---

## Chapter 1

So it all started with a simple idea, to make a graphing library that was flexible and easy to use, which can make simple shapes on a canvas, and export it to image. I got into some work, made a simple implementation by spinning up a simple C project, and made some example scenes out of it. Here is one of them.

![Initial sketches and wireframes for Fern](https://blobstorage-rishi.s3.ap-south-1.amazonaws.com/fern/fern-initial.png)

Initially you could just export the image to PPM format, which is a simple image format. This is the first tweet I made about it:

[![Tweet by @rishi2220 about Fern](https://blobstorage-rishi.s3.ap-south-1.amazonaws.com/fern/tweets/t1.png)](https://twitter.com/rishi2220/status/1234567890123456789)

The response was better than expected. 12 people starred the project on GitHub. I wanted to develop it further, so I started working on it. I made a simple canvas renderer, which could render basic shapes like lines, circles, rectangles, and text. After basic bitmap-based rasterization made the project look complete, I was genuinely excited. This was the first image I created after adding features like gradients and text rendering.

![First render of Fern with basic shapes and text](https://blobstorage-rishi.s3.ap-south-1.amazonaws.com/fern/cyberpunk.png)

After that I thought about taking the same concept and rendering it on the web using Wasm. It worked, and I found some amazing use cases. It felt like I was making an interactive website but using my own written library. The syntax was inspired by Flutter, and I made it that way on purpose.

[![Tweet by @rishi2220 about Fern](https://blobstorage-rishi.s3.ap-south-1.amazonaws.com/fern/tweets/t2.png)](https://x.com/Rishi2220/status/1921201566410846390)

Eventually I made a life simulator using Fern. It was kind of amazing to see it come together. Zero dependency, interactive, and built using raw C compiled to Wasm. The name "Fern" is also inspired from Flutter. Here is the link to that life simulator:

**[Fern Life Simulator](https://fern-life.web.app)**

It was time to make it public. Yes, it wasn't polished, but it worked. There was already a lot of proof of work. I quickly built a CLI, a documentation site, and a landing page. Here's the page you might have seen if you know Fern:

**[Fern Documentation](https://fern.rishia.in)**

## Chapter 2

I concluded the project for a while, but it always felt like there was more. During a random discussion, someone told me, "Till then, you'll make a whole DSL." And it hit me. I already had one — it just wasn't well structured. So I decided to take it seriously. I started porting it to C++ to make it more robust and scalable. Proper widget systems, layout managers, just like how Flutter does it. And this was the starting point.

Here's a small gist of the syntax if you haven't seen it yet.

```cpp
void draw() {
    Draw::fill(Colors::DarkGray);
    TextWidget(Point(50, 50), "Button Demo", 3, Colors::White);
    std::string counterText = "Count: " + std::to_string(clickCount);
    TextWidget(Point(50, 400), counterText.c_str(), 2, Colors::White);
}

int main() {
    Fern::initialize(pixels, 800, 600);
    setupUI();
    Fern::setDrawCallback(draw);
    Fern::startRenderLoop();
    return 0;
}
```

I then wrote an actual layout engine. Before this, you had to manually place everything with coordinates, which meant no responsive design. With Row, Column, Expanded, Spacer — just like Flutter — Fern could now lay out widgets properly. This was the first working layout:

![Layouts in Fern](https://blobstorage-rishi.s3.ap-south-1.amazonaws.com/fern/layout.png)

I kept going. Can we make this cross-platform? Maybe web is not enough. What about desktop? So I made renderers for both Wasm and native Linux. And now it ran on Linux too. Then I got tired of the blocky bitmap fonts. I wanted real text — like proper font rendering. So I learned about font rasterization, built a tool, wrote a blog, plugged it into Fern, and suddenly we had native TTF support. Not perfect, but it worked.

![First TTF rasterized text in Fern](https://blobstorage-rishi.s3.ap-south-1.amazonaws.com/fern/hello.png)

This project taught me how design decisions directly impact developer experience. It also showed me the value of early feedback and quick iterations. But more importantly, it made me realize how deep and powerful even the simplest graphics systems can be when built from scratch.

## What Now?

Fern is not finished. In fact, I am still building it. Right now progress is slow. A lot of other things are taking time. But the goal is clear. Polish the CLI, refine the C++ API, make the docs better, and officially launch the whole project.

If you have seen Fern before, know this. I am not done. The vision is still alive, and something better is coming soon.
