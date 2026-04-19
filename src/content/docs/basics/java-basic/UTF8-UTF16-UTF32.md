---
title: "Utf8 Utf16 Utf32"
---

Unicode is an international standard encoding that accommodates all characters and symbols in the world, using four bytes to encode each character.

UTF is short for Unicode Transformation Format, meaning the process of converting Unicode characters into a specific format. The UTF series of encoding schemes (UTF-8, UTF-16, UTF-32) are all derived from the Unicode encoding scheme to adapt to different data storage or transmission requirements. They can all fully represent all characters in the Unicode standard. Currently, among these derivative schemes, UTF-8 is widely used, while UTF-16 and UTF-32 are rarely used.

UTF-8 uses one to four bytes to encode each character. Most Chinese characters are encoded with three bytes, while a small number of uncommon Chinese characters use four bytes. Because UTF-8 is a variable-length encoding method, it can reduce storage space compared to Unicode encoding, which is why it is widely used.

UTF-16 uses two or four bytes to encode each character. Most Chinese characters use two bytes, and a small number of uncommon ones use four bytes. UTF-16 encoding distinguishes between big-endian and little-endian, namely UTF-16BE and UTF-16LE. Before encoding, a Byte Order Mark (BOM) like U+FEFF or U+FFFE is placed (UTF-16BE is represented by FEFF, and UTF-16LE by FFFE). The U+FEFF character in Unicode represents "ZERO WIDTH NO-BREAK SPACE," which is a zero-width, non-breaking space.

UTF-32 uses four bytes to encode every character, which means it often occupies two to four times more space than other encodings. Like UTF-16, UTF-32 distinguishes between big-endian and little-endian, with U+0000FEFF or U+0000FFFE placed before encoding for differentiation.
