---
title: "Define Exception"
---

Custom exceptions are exceptions defined by developers themselves, typically implemented by inheriting from a subclass of `Exception`.

Writing a custom exception class involves inheriting from a standard API exception class and overriding the existing information with newly defined error messages.

This practice is common in Web development, where it is used to define "business exceptions." Examples include "insufficient balance" or "duplicate submission." These custom exceptions carry specific business meaning, making them much easier for upper-level code to understand and handle appropriately.