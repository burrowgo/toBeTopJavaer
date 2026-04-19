---
title: "Annotion And Reflect"
---

Annotations and reflection are often used together, and their combined use can be seen in the code of many frameworks.

Reflection can be used to determine if a class, method, or field has a certain annotation and to obtain values within the annotation. An example of code to obtain an annotation on a method in a certain class is as follows:

```java
Class<?> clz = bean.getClass();
Method[] methods = clz.getMethods();
for (Method method : methods) {
``` 
if (method.isAnnotationPresent(EnableAuth.class)) {
    String name = method.getAnnotation(EnableAuth.class).name();
}
```
}
```

Use `isAnnotationPresent` to check for the existence of an annotation, use `getAnnotation` to obtain the annotation object, and then get the value.

### Example

Reference example: https://blog.csdn.net/KKALL1314/article/details/96481557

I wrote an example myself to implement the following function:
Certain fields of a class are marked by an annotation. When reading these attributes, the default values from the annotation are assigned to these attributes; attributes without the annotation are not assigned.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@Documented
@Inherited
public @interface MyAnno {
``` 
String value() default "Has Annotation";
```
}
```

Defining a class:

```java
@Data
@ToString
public class Person {
``` java
@MyAnno
```java
private String stra;
private String strb;
private String strc;
```

public Person(String str1, String str2, String str3){
    super();
    this.stra = str1;
    this.strb = str2;
    this.strc = str3;
}
```
}
```

Here, `stra` is annotated, and reflection is used to parse and assign values:

```java
public class MyTest {
``` java
```java
public static void main(String[] args) {
    // Initialize all as "No Annotation"
    Person person = new Person("No Annotation", "No Annotation", "No Annotation");
    // Parse annotation
    doAnnoTest(person);
    System.out.println(person.toString());
}
```
```

  private static void doAnnoTest(Object obj) {
        Class clazz = obj.getClass();
        Field[] declareFields = clazz.getDeclaredFields();
        for (Field field : declareFields) {
            // Check if the field uses a certain annotation
            if (field.isAnnotationPresent(MyAnno.class)) {
                MyAnno anno = field.getAnnotation(MyAnno.class);
                if (anno != null) {
                    String fieldName = field.getName();
                    try {
                        Method setMethod = clazz.getDeclaredMethod("set" + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1), String.class);
                        // Get the annotation's attribute
                        String annoValue = anno.value();
                        // Assign the annotation's attribute value to the corresponding attribute
                        setMethod.invoke(obj, annoValue);
                    } catch (NoSuchMethodException e) {
                        e.printStackTrace();
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    } catch (InvocationTargetException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
``` 
}
```
}
```

Running result:

```
Person(stra=Has Annotation, strb=No Annotation, strc=No Annotation)
```

When developers use Annotations to modify classes, methods, Fields, and other members, these Annotations do not take effect on their own. Developers must provide corresponding code to extract and process Annotation information. This code for extraction and processing is collectively called APT (Annotation Processing Tool).

Extraction of annotations relies on Java's reflection technology. Reflection is relatively slow, so care should be taken with time costs when using annotations.
