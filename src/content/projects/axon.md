---
title: "Axon"
description: "A high-performance command-line tool providing strong encryption and decryption capabilities using AES-128 with Cipher Block Chaining (CBC) mode. Designed for secure file protection with a focus on performance, security, and ease of use across multiple platforms."
tech_stack: ["C", "AES-128", "CMake", "Make"]
features:
  - "Industry-standard AES-128 encryption with Cipher Block Chaining (CBC) mode"
  - "Efficient file chunking system to handle files of any size"
  - "Cross-platform support with optimized builds for Linux, macOS, and Windows"
  - "Secure password handling with strong validation and key derivation"
github_url: "https://github.com/RishiAhuja/axon"
category: "cli"
is_featured: false
created_at: 2025-05-21
---

A robust, high-performance command-line encryption tool built with security and efficiency in mind. Axon provides military-grade file protection using industry-standard AES-128 encryption.

## Security Features

### AES-128 Encryption
- Cipher Block Chaining (CBC) mode for enhanced security
- Secure key derivation from passwords
- Strong password validation
- No plaintext password storage

### Performance
- Efficient file chunking for handling large files
- Optimized memory usage
- Fast encryption/decryption operations
- Minimal overhead

## Cross-Platform Support

Built with portable C and CMake, Axon runs seamlessly on:
- Linux (all distributions)
- macOS
- Windows

## Command-Line Interface

Simple, intuitive CLI design:
```bash
axon encrypt myfile.txt
axon decrypt myfile.txt.enc
```

Clean output, clear error messages, and helpful usage information make Axon accessible for both beginners and advanced users.
