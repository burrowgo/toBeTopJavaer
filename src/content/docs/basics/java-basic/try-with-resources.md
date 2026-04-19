---
title: "Try With Resources"
---

In Java, for resources that are very expensive to open, such as file IO streams and database connections, they must be closed in time via the `close` method after use. Otherwise, the resources will remain open, which may lead to memory leaks and other issues.

The common way to close resources is to release them in the `finally` block, i.e., by calling the `close` method. For example, we often write code like this:

```java
public static void main(String[] args) {
``` 
BufferedReader br = null;
try {
    String line;
    br = new BufferedReader(new FileReader("d:\\hollischuang.xml"));
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    // handle exception
} finally {
    try {
        if (br != null) {
            br.close();
        }
    } catch (IOException ex) {
        // handle exception
    }
}
```
}
```

Starting from Java 7, the JDK provides a better way to close resources using the `try-with-resources` statement. Rewriting the above code yields the following effect:

```java
public static void main(String... args) {
``` 
try (BufferedReader br = new BufferedReader(new FileReader("d:\\ hollischuang.xml"))) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    // handle exception
}
```
}
```

Look, this is simply a great blessing. Although I used to generally use `IOUtils` to close streams and wouldn't write a lot of code in the `finally` block, this new syntactic sugar seems much more elegant. Let's look behind the scenes:

```java
public static transient void main(String args[])
``` 
{
    BufferedReader br;
    Throwable throwable;
    br = new BufferedReader(new FileReader("d:\\ hollischuang.xml"));
    throwable = null;
    String line;
    try
    {
        while((line = br.readLine()) != null)
            System.out.println(line);
    }
    catch(Throwable throwable2)
    {
        throwable = throwable2;
        throw throwable2;
    }
    if(br != null)
        if(throwable != null)
            try
            {
                br.close();
            }
            catch(Throwable throwable1)
            {
                throwable.addSuppressed(throwable1);
            }
        else
            br.close();
        break MISSING_BLOCK_LABEL_113;
        Exception exception;
        exception;
        if(br != null)
            if(throwable != null)
                try
                {
                    br.close();
                }
                catch(Throwable throwable3)
                  {
                    throwable.addSuppressed(throwable3);
                }
            else
                br.close();
    throw exception;
    IOException ioexception;
    ioexception;
}
```
}
```

In fact, the underlying principle is very simple: the compiler does all the resource-closing operations that we didn't do. So, it proves once again that the purpose of syntactic sugar is to make it convenient for programmers to use, but ultimately it must be converted into a language the compiler understands.
