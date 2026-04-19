---
title: "Meta Annotation"
---

Simply put, meta-annotations are "annotations that define other annotations."
```java
For example, the `@Override` annotation is not a meta-annotation; it is defined using meta-annotations.
```

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface Override {
}
```

In this case, `@Target` and `@Retention` are meta-annotations.

There are six meta-annotations:
- `@Target`: Specifies where the annotation can be applied.
- `@Retention`: Specifies at what level the annotation information is preserved.
- `@Documented`: Includes this annotation in JavaDoc.
- `@Inherited`: Allows subclasses to inherit annotations from the parent class.
- `@Repeatable` (Added in 1.8): Allows an annotation to be used multiple times on a single element.
- `@Native` (Added in 1.8): Annotates member variables, indicating that the variable can be referenced by native code; often used by code generation tools.