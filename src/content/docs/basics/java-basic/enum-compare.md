---
title: "Enum Compare"
---

In Java, there is no difference between using the `==` operator and the `equals` method to compare enum values; both can be used interchangeably with the same effect.

This is because the default implementation of the `equals` method in the `Enum` class is specifically written to use `==` for comparison.

Similarly, the `compareTo` method in the `Enum` class compares the `ordinal` values (positional order) of the enums.

Also, both the `name` method and the `toString` method in `Enum` return the name of the enum constant.