---
title: "Exception Type"
---

Java exceptions are primarily divided into two categories: **checked exceptions** and **unchecked exceptions**.

### Checked Exceptions

If a method signature declares that it throws a checked exception:

```java
public void test() throws Exception { }
```

You must handle this exception (either by catching it or declaring it in your own `throws` clause) when calling the method. Otherwise, the code will fail to compile. This is a mandatory requirement in Java.

Checked exceptions are common in I/O operations. For example, `FileNotFoundException`. When using I/O streams to process a file, there's a possibility the file doesn't exist. The interface explicitly throws `FileNotFoundException` to alert the caller: "This method isn't guaranteed to succeed; the file might be missing. You must explicitly handle this scenario."

Use checked exceptions when you want to force the caller to address specific, recoverable error conditions.

### Unchecked Exceptions

Unchecked exceptions are typically runtime exceptions that inherit from `RuntimeException`. They do not need to be explicitly caught or declared in the method signature. However, if an unchecked exception occurs during runtime and isn't handled, the program will terminate.

These exceptions usually stem from programming errors, such as `NullPointerException` or `ArrayIndexOutOfBoundsException`. If the code is logically sound, these exceptions can be avoided entirely, so explicit handling isn't required.

Imagine if you had to catch an exception every time a `NullPointerException` was possible - nearly every line of code would require a try-catch block!
