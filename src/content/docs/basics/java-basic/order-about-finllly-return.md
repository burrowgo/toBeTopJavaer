---
title: "Order About Finllly Return"
---

If there is a `return` statement inside `try()`, will the code inside the subsequent `finally{}` be executed? When will it be executed, before or after the `return`?

If there is a `return` statement in `try`, the code in `finally` will still be executed. Since `return` indicates that the entire method body should return, the statements in `finally` will execute before the `return`.

However, for modifications made within the `finally` block before the `return`, the effect differs between reference types and value types.

```java
// Test modifying a value type
static int f() {
``` 
int ret = 0;
try {
	return ret;  // Returns 0; the modification in finally has no effect
} finally {
	ret++;
	System.out.println("finally executed");
}
```
}

// Test modifying a reference type
static int[] f2(){
``` 
int[] ret = new int[]{0};
try {
	return ret;  // Returns [1]; the modification in finally takes effect
} finally {
	ret[0]++;
	System.out.println("finally executed");
}
```
}
```
