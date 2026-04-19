---
title: "Jakarta EE Transition"
---


## Overview
The transition from **Java EE (Java Enterprise Edition)** to **Jakarta EE** is one of the most significant changes in the history of the Java ecosystem. This change was primarily driven by the move of the enterprise Java platform from Oracle to the **Eclipse Foundation**.

## The Package Rename: `javax` to `jakarta`
The most critical impact of this transition is the renaming of the base packages. Due to trademark restrictions, the `javax.*` namespace (e.g., `javax.servlet`, `javax.persistence`, `javax.transaction`) could no longer be used for new Jakarta EE releases.

Starting with **Jakarta EE 9**, all enterprise APIs were moved to the `jakarta.*` namespace.

### Common Mappings
| Old Package (Java EE / Jakarta EE 8) | New Package (Jakarta EE 9+) |
| :--- | :--- |
| `javax.servlet` | `jakarta.servlet` |
| `javax.persistence` | `jakarta.persistence` |
| `javax.transaction` | `jakarta.transaction` |
| `javax.validation` | `jakarta.validation` |
| `javax.inject` | `jakarta.inject` |
| `javax.mail` | `jakarta.mail` |

## Impact on Spring Boot 3
**Spring Boot 3.0** (released in late 2022) was the first major version of Spring Boot to require **Jakarta EE 9** (or higher) and **Java 17**. 

If you are migrating a project from Spring Boot 2.x to 3.x, you **must** update all your imports from `javax.*` to `jakarta.*` for any EE-related dependencies.

## Migration Tools
For large-scale projects, manual renaming can be tedious. Several tools can automate the bytecode or source code transformation:
- **Eclipse Transformer:** A standalone tool to transform JARs or source code.
- **OpenRewrite:** Provides recipes for automated Spring Boot and Jakarta EE migrations.
- **IntelliJ IDEA / Eclipse:** Modern IDEs have built-in refactoring tools to migrate from `javax` to `jakarta`.

## Why It Matters in 2026
By 2026, the `javax.*` namespace is considered legacy for enterprise development. All modern libraries (Hibernate 6+, Tomcat 10+, Jetty 11+) have fully embraced the `jakarta.*` namespace. Understanding this transition is essential for any senior Java engineer working with modern microservices.
