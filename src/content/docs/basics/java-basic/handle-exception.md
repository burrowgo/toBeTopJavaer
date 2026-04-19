---
title: "Handle Exception"
---

There are two ways to handle exceptions:
1. Handle it yourself.
2. Throw it upwards and let the caller handle it.

Never catch an exception and do nothing with it, or only use `e.printStackTrace()`.

The principle for choosing a handling method is simple: if you clearly know how to handle it, handle it. If you don't know how to handle it, pass it to the caller.