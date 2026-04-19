---
title: "Genericity List Wildcard"
---

`List<?>` is a List of an unknown type, while `List<Object>` is actually a List of any type. You can assign `List<String>` or `List<Integer>` to `List<?>`, but you cannot assign `List<String>` to `List<Object>`.
