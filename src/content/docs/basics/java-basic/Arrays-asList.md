---
title: "Arrays Aslist"
---

1. The list returned by `asList` is only an internal class of `Arrays`, a view of the original array. Therefore, performing add or remove operations on it will result in an error.

2. You can convert it into a real `ArrayList` using the `ArrayList` constructor.
