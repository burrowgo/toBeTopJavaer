---
title: "Replace In String"
---

`replace`, `replaceAll`, and `replaceFirst` are commonly used methods in Java for replacing characters. Their method definitions are:

`replace(CharSequence target, CharSequence replacement)`: replaces all occurrences of `target` with `replacement`. Both parameters are strings.

`replaceAll(String regex, String replacement)`: replaces all occurrences matching the `regex` with `replacement`. `regex` is a regular expression, and `replacement` is a string.

`replaceFirst(String regex, String replacement)`: basically the same as `replaceAll`, but it only replaces the first match.

As can be seen, `replaceAll` and `replaceFirst` are related to regular expressions, while `replace` is not.

The main difference between `replaceAll` and `replaceFirst` is the content being replaced: `replaceAll` replaces all matching characters, while `replaceFirst()` only replaces the first occurrence of the character.

### Usage Examples

```java
String string = "abc123adb23456aa";
System.out.println(string); //abc123adb23456aa

// Use replace to replace 'a' with 'H'
System.out.println(string.replace("a","H")); //Hbc123Hdb23456HH
// Use replaceFirst to replace the first 'a' with 'H'
System.out.println(string.replaceFirst("a","H")); //Hbc123adb23456aa
// Use replace to replace 'a' with 'H'
System.out.println(string.replaceAll("a","H")); //Hbc123Hdb23456HH

// Use replaceFirst to replace the first digit with 'H'
System.out.println(string.replaceFirst("\\d","H")); //abcH23adb23456aa
// Use replaceAll to replace all digits with 'H'
System.out.println(string.replaceAll("\\d","H")); //abcHHHadbHHHHHaa
```
