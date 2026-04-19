---
title: "Sample Of Break Parents Delegate"
---

Breaking the parent delegation mechanism is not unusual; many frameworks, containers, etc., break this mechanism to implement certain features.

*The first case of breaking occurred before the introduction of parent delegation.*

Since the parent delegation model was introduced after JDK 1.2, and there were already user-defined class loaders in use before that, these did not follow the parent delegation principle.

*The second case is when JNDI, JDBC, etc., need to load SPI interface implementation classes.*

*The third case is to implement hot-swapping and hot-deployment tools.* To make code take effect dynamically without restarting, the implementation replaces the module along with the class loader, achieving hot replacement of code.

*The fourth case is the emergence of web containers like Tomcat.*

*The fifth case is the application of modular technologies such as OSGI and Jigsaw.*