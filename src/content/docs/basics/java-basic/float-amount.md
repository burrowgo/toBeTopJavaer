---
title: "Float Amount"
---

Since the decimal numbers stored in a computer are actually approximations of decimal numbers rather than exact values, you must never use floating-point numbers in your code to represent important metrics such as currency amounts.

It is recommended to use `BigDecimal` or `Long` (with the unit in cents) to represent currency amounts.