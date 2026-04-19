---
title: "Java 17 to 25: Modern Era of Java (LTS Versions)"
---


## Java 17 (LTS)
Released in September 2021, **Java 17** was the first major step into the "Modern Java" era, introducing:
- **Sealed Classes:** Control over which classes can extend or implement them.
- **Pattern Matching for `instanceof`:** Clean up old-style type checks.
- **New macOS Rendering Pipeline:** Support for Apple Silicon (AArch64).
- **Removal of Applet API:** Deprecated and finally removed.

## Java 21 (LTS)
Released in September 2023, **Java 21** is arguably the most impactful version since Java 8. Key features:
- **Virtual Threads (Project Loom):** Massively scalable threads for I/O-heavy applications.
- **Record Patterns:** Pattern matching for deconstructing records.
- **Sequenced Collections:** New interfaces like `SequencedCollection` and `SequencedMap` for reliable element ordering.
- **Key-Value String Templates (Preview):** Cleaner way to compose strings.

## Java 25 (LTS)
As of **April 2026**, **Java 25** is the latest Long-Term Support version. It has refined the experiments of the previous few years:
- **Scoped Values (Standard):** A lightweight alternative to `ThreadLocal` for sharing data within threads and child threads.
- **Structured Concurrency (Standard):** A safer API for multi-threaded programming that treats multiple tasks as a single unit of work.
- **Generational ZGC (Standard):** Significant performance improvements for ZGC, making it the preferred garbage collector for modern low-latency applications.
- **Foreign Function & Memory API (Standard):** Reliable way to call non-Java code and access memory outside the heap (replaces JNI).

## Summary Table
| Feature | Introduced (Preview) | Standardized (LTS) |
| :--- | :--- | :--- |
| **Virtual Threads** | Java 19 | **Java 21** |
| **Sealed Classes** | Java 15 | **Java 17** |
| **Pattern Matching** | Java 14 | **Java 17/21** |
| **Generational ZGC** | Java 21 | **Java 25** |
| **Structured Concurrency** | Java 19 | **Java 25** |

## Conclusion
By 2026, the industry has largely settled on **Java 21** and **Java 25** as the primary deployment targets. The transition to these versions is not just about performance but about adopting a new concurrency model (Project Loom) and more modern language constructs.
