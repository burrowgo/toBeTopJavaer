---
title: "Break Parants Delegate"
---

Knowing the implementation of the parent delegation model, breaking the parent delegation mechanism becomes very simple.

Because the parent delegation process is implemented in the loadClass method, to break this mechanism, you just need to customize a class loader and override its loadClass method so that it does not perform parent delegation.