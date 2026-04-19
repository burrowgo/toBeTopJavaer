---
title: "Api Vs Spi"
---

In Java, API and SPI are distinguished as follows: generally speaking, API and SPI are relative concepts, and their difference is purely semantic. APIs are directly used by application developers, while SPIs are used by framework extension developers.

### API: Application Programming Interface

In most cases, the implementer defines the interface and provides various implementations. The caller depends on the interface but has no right to choose between different implementations.

### SPI: Service Provider Interface

In contrast, when the caller defines the interface and the implementer provides different implementations based on that interface, the caller can choose the implementer they need.
