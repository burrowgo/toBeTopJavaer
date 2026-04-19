---
title: "Exception Chain"
---

"Exception chaining" is a very popular exception handling concept in Java. It refers to throwing another exception while performing an exception handling, thereby creating a chain of exceptions.

This technique is mostly used to encapsulate "checked exceptions" (checked exception) into "unchecked exceptions" (unchecked exception) or `RuntimeException`.

If you decide to throw a new exception because of an exception, you must include the original exception so that handlers can access the ultimate root cause via `getCause()` and `initCause()` methods.

From Java 1.4, almost all exceptions support exception chaining.

The following are methods and constructors in `Throwable` that support exception chaining:

```java
Throwable getCause()
Throwable initCause(Throwable)
Throwable(String, Throwable)
Throwable(Throwable)
```

`initCause` and the `Throwable` parameter of the `Throwable` constructor are the exceptions that caused the current exception. `getCause` returns the exception that caused the current exception, and `initCause` sets the cause of the current exception.

The following example shows how to use exception chaining:

```java
try {
``` 
// Some code that throws IOException
```
} catch (IOException e) {
``` 
throw new SampleException("Other IOException", e);
```
}
```

In this example, when an `IOException` is caught, a new `SampleException` is created with the original exception cause attached, and the exception chain is thrown to the next higher-level exception handler.
