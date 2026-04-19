---
title: "Convert Bytestream Characterstream"
---

Two classes are needed to realize the mutual conversion between character streams and byte streams:

`OutputStreamWriter` is a bridge from character streams to byte streams.

`InputStreamReader` is a bridge from byte streams to character streams.

### Converting character stream to byte stream

```java
public static void main(String[] args) throws IOException {
``` 
File f = new File("test.txt");
    
// OutputStreamWriter is a bridge from character streams to byte streams, creating an object that goes from character stream to byte stream
OutputStreamWriter osw = new OutputStreamWriter(new FileOutputStream(f), "UTF-8");
    
osw.write("I am output by converting character stream to byte stream");
osw.close();
```
}
```

### Converting byte stream to character stream

```java
public static void main(String[] args) throws IOException {
``` 
File f = new File("test.txt");
    
InputStreamReader inr = new InputStreamReader(new FileInputStream(f), "UTF-8");
    
char[] buf = new char[1024];
    
int len = inr.read(buf);
System.out.println(new String(buf, 0, len));
    
inr.close();
```
}
```
