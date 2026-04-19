---
title: "Switch String"
---

In Java 7, the parameter for `switch` can be of `String` type, which is a very convenient improvement. So far, `switch` supports several data types: `byte`, `short`, `int`, `char`, and `String`. However, as a programmer, we not only need to know how useful it is but also how it is implemented. How is `switch` support for integers implemented? How about for character types? And for `String` type? Anyone with some Java development experience might guess that `switch` support for `String` uses the `equals()` and `hashCode()` methods. So, is it really these two methods? Let's take a look at how `switch` is actually implemented.

### 1. Implementation of switch support for integers

Below is a very simple Java code snippet that defines an `int` variable `a` and then uses a `switch` statement for judgment. Executing this code outputs `5`. Let's decompile this code to see how it is implemented.

``` java
public class switchDemoInt {
    public static void main(String[] args) {
        int a = 5;
        switch (a) {
        case 1:
            System.out.println(1);
            break;
        case 5:
            System.out.println(5);
            break;
        default:
            break;
        }
    }
}
//output 5
```

The decompiled code is as follows:

``` java
public class switchDemoInt
{
    public switchDemoInt()
    {
    }
    public static void main(String args[])
    {
        int a = 5;
        switch(a)
        {
        case 1: // '\001'
            System.out.println(1);
            break;

        case 5: // '\005'
            System.out.println(5);
            break;
        }
    }
}
```

We find that the decompiled code has no difference from the original code except for two extra lines of comments. Therefore, we know that **`switch` judgment for `int` is a direct comparison of integer values**.

### 2. Implementation of switch support for character types

Let's look at the code:

``` java
public class switchDemoChar {
    public static void main(String[] args) {
        char a = 'b';
        switch (a) {
        case 'a':
            System.out.println('a');
            break;
        case 'b':
            System.out.println('b');
            break;
        default:
            break;
        }
    }
}
```

The compiled code is as follows:

``` java
public class switchDemoChar
{
    public switchDemoChar()
    {
    }
    public static void main(String args[])
    {
        char a = 'b';
        switch(a)
        {
        case 97: // 'a'
            System.out.println('a');
            break;
        case 98: // 'b'
            System.out.println('b');
            break;
        }
  }
}
```

By comparing the above code, we find that when comparing `char` types, it actually compares the ASCII code. The compiler converts the `char` variable into the corresponding `int` variable.

### 3. Implementation of switch support for strings

Again, the code first:

``` java
public class switchDemoString {
    public static void main(String[] args) {
        String str = "world";
        switch (str) {
        case "hello":
            System.out.println("hello");
            break;
        case "world":
            System.out.println("world");
            break;
        default:
            break;
        }
    }
}
```

Decompile the code:

``` java
public class switchDemoString
{
    public switchDemoString()
    {
    }
    public static void main(String args[])
    {
        String str = "world";
        String s;
        switch((s = str).hashCode())
        {
        default:
            break;
        case 99162322:
            if(s.equals("hello"))
                System.out.println("hello");
            break;
        case 113318802:
            if(s.equals("world"))
                System.out.println("world");
            break;
        }
    }
}
```

Looking at this code, you can see that the string `switch` is implemented through the `equals()` and `hashCode()` methods. **Remember, only integers can be used in `switch`**, such as `byte`, `short`, `char` (ASCII code is an integer), and `int`. Fortunately, the `hashCode()` method returns an `int`, not a `long`. This makes it easy to remember the fact that `hashCode` returns an `int`. Looking closely, you can see that what is actually switched is the hash value, and then a safety check is performed using the `equals` method. This check is necessary because hash collisions can occur. Therefore, its performance is not as good as using an enum for `switch` or using pure integer constants, but it's not bad either. Because the Java compiler only adds an `equals` method, it will be very fast if you are comparing string literals, such as `"abc" == "abc"`. If you also consider the call overhead of the `hashCode()` method, there will be one more call overhead, but since strings cache their hash value once created, if this `switch` statement is used in a loop, such as processing some value item by item or a game engine rendering the screen in a loop, the call overhead of the `hashCode()` method is actually not very significant.

Alright, that's it for the implementation of `switch` support for integers, character types, and string types. To summarize, we can find that **actually, `switch` only supports one data type, which is integer. Other data types are converted to integers before using `switch`.**
