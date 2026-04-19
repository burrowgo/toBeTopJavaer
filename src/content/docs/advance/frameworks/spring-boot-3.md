---
title: "Spring Boot 3.x"
---


## Overview
**Spring Boot 3.0**, released in November 2022, represents the next generation of the Spring framework. It is built upon **Spring Framework 6** and requires a minimum of **Java 17**.

## Key Changes in 3.x

### 1. Java 17+ Requirement
Spring Boot 3.x baseline was moved to Java 17 to take advantage of modern language features like Records, Sealed Classes, and improved performance. It also fully supports **Java 21 (LTS)** and its Virtual Threads.

### 2. Jakarta EE Transition
As detailed in the [Jakarta EE Transition](/toBeTopJavaer/advance/frameworks/jakarta-ee-transition) section, Spring Boot 3 moved from `javax.*` to `jakarta.*` for all Enterprise APIs. This affects:
- Servlet API (Tomcat 10.1+, Jetty 11+)
- JPA (Hibernate 6.1+)
- Bean Validation (Hibernate Validator 7.0+)

### 3. Native Image Support (GraalVM)
Spring Boot 3 introduced first-class support for compiling Spring applications into **Native Executables** using GraalVM.
- **Benefits:** Instant startup, significant reduction in memory footprint.
- **Use Case:** Ideal for serverless (AWS Lambda) and container-optimized deployments.

### 4. Observability with Micrometer
The infrastructure for metrics and tracing was overhauled. Spring Boot 3 provides an integrated observability solution using Micrometer and Micrometer Tracing (replaces Spring Cloud Sleuth).

### 5. Virtual Threads Support
Starting with **Spring Boot 3.2**, you can enable Virtual Threads with a simple property:
```yaml
spring.threads.virtual.enabled: true
```
This allows the embedded web server (Tomcat/Jetty) to use Virtual Threads for handling requests, providing massive scalability.

## Migration from 2.x to 3.x
Migration requires several steps:
1. **Java Upgrade:** Ensure the runtime and build environment are Java 17+.
2. **Namespace Change:** Update all imports from `javax.*` to `jakarta.*`.
3. **Dependency Updates:** Hibernate 6, Security 6, and other major version upgrades.
4. **Configuration Properties:** Some property names have changed or been removed.

## Conclusion
Spring Boot 3.x is the foundation for modern Java microservices in 2026. Its focus on GraalVM native images and Project Loom (Virtual Threads) makes it highly efficient for cloud-native environments.
