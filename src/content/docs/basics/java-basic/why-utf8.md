---
title: "Why Utf8"
---

In a broad sense, Unicode is a standard that defines a character set and a series of encoding rules, including the Unicode character set and rules like UTF-8, UTF-16, and UTF-32.

Unicode is the **character set**, while UTF-8 is an **encoding rule**.

Although Unicode unified the binary encoding of characters worldwide, it did not specify how they should be stored.

If Unicode were to mandate that every symbol be represented by three or four bytes (necessary to accommodate the vast number of characters), every English letter would be preceded by two or three bytes of zeros. This is because all English letters are in the ASCII set and can be represented by a single byte; the extra byte positions would simply be padded with zeros.

If this were implemented, the size of text files would increase two to three times, leading to a massive waste of storage space. As a result, various storage methods for Unicode emerged.

UTF-8 is one such storage method for Unicode, as reflected in its name: **Unicode Transformation Format**.

UTF-8 uses variable-length bytes to store Unicode characters. For example, ASCII letters continue to use 1 byte, while accented characters, Greek, or Cyrillic letters use 2 bytes. Commonly used Chinese characters require 3 bytes, and supplementary plane characters use 4 bytes.

Typically, a single region uses only one type of script. For example, Korean or Japanese characters are rare in Chinese-speaking regions. Therefore, this encoding method significantly saves space. A purely English website, for instance, will consume less storage than a purely Chinese one.
