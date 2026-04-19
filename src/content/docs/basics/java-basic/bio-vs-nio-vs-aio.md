---
title: "Bio Vs Nio Vs Aio"
---

### IO
What is IO? It refers to the interface between a computer and the outside world, or between a program and the rest of the computer system. It is critical to any computer system, and as such, the core of all I/O is actually built into the operating system. Individual programs generally rely on the system to perform most of the work.

In Java programming, until recently, I/O was primarily handled using "streams." All I/O is treated as the movement of individual bytes, moving one byte at a time through an object called a `Stream`. Stream I/O is used for interacting with the outside world and is also used internally to convert objects to bytes and back.

### BIO
Java BIO (Blocking I/O) is synchronous and blocking I/O. BIO represents the traditional implementation found in the `java.io` package.

### NIO
What is NIO? NIO (New I/O) serves the same purpose as the original I/O, but the most significant difference lies in how data is packaged and transmitted. While original I/O processes data in streams, NIO processes data in blocks.

**Stream-oriented** I/O systems process data one byte at a time. An input stream produces one byte, and an output stream consumes one. It is easy to create filters for streaming data or link multiple filters for complex processing. However, stream-oriented I/O is typically slow.

**Block-oriented** I/O systems process data in blocks. Each operation produces or consumes a data block in one step. Processing data by blocks is much faster than by bytes, but it lacks some of the elegance and simplicity of stream-oriented I/O.

### AIO
Java AIO (Asynchronous I/O) is asynchronous and non-blocking I/O.

### Differences and Connections

- **BIO (Blocking I/O):** Synchronous blocking mode. Data reading and writing must block a thread until completion. Imagine boiling water: you stand by one kettle until it boils before moving to the next. The thread does nothing while waiting.
- **NIO (New I/O):** Supports both blocking and non-blocking modes. In synchronous non-blocking mode, a thread polls the status of multiple I/O operations. In the boiling water analogy, you walk around checking each kettle to see if any have boiled.
- **AIO (Asynchronous I/O):** Asynchronous non-blocking mode. It does not require polling. The system notifies the thread when an I/O operation is complete. Imagine each kettle has a whistle that alerts you only when the water is ready.

### Applicable Scenarios

- **BIO:** Best for architectures with a small, fixed number of connections. It is resource-intensive but simple to understand. It was the only choice before JDK 1.4.
- **NIO:** Best for architectures with many short-lived connections (light operations), like chat servers. It is more complex to program and has been supported since JDK 1.4.
- **AIO:** Best for architectures with many long-lived connections (heavy operations), like photo album servers. It leverages the OS for concurrency and has been supported since JDK 7.

### Usage

#### Using BIO for File Read/Write

```java
// Initializes The Object
User1 user = new User1();
user.setName("hollis");
user.setAge(23);
System.out.println(user);

// Write Obj to File
ObjectOutputStream oos = null;
try {
``` 
oos = new ObjectOutputStream(new FileOutputStream("tempFile"));
oos.writeObject(user);
```
} catch (IOException e) {
``` 
e.printStackTrace();
```
} finally {
``` 
IOUtils.closeQuietly(oos);
```
}

// Read Obj from File
File file = new File("tempFile");
ObjectInputStream ois = null;
try {
``` 
ois = new ObjectInputStream(new FileInputStream(file));
User1 newUser = (User1) ois.readObject();
System.out.println(newUser);
```
} catch (IOException e) {
``` 
e.printStackTrace();
```
} catch (ClassNotFoundException e) {
``` 
e.printStackTrace();
```
} finally {
``` 
IOUtils.closeQuietly(ois);
try {
    FileUtils.forceDelete(file);
} catch (IOException e) {
    e.printStackTrace();
}
```
}
```

#### Using NIO for File Read/Write

```java
static void readNIO() {
``` 
String pathname = "C:\\data\\test.cfg";
FileInputStream fin = null;
try {
    fin = new FileInputStream(new File(pathname));
    FileChannel channel = fin.getChannel();

    int capacity = 100; // bytes
    ByteBuffer bf = ByteBuffer.allocate(capacity);
    System.out.println("Limit: " + bf.limit() + " Capacity: " + bf.capacity() + " Position: " + bf.position());
    int length = -1;

    while ((length = channel.read(bf)) != -1) {
        bf.clear();
        byte[] bytes = bf.array();
        System.out.write(bytes, 0, length);
        System.out.println();
        System.out.println("Limit: " + bf.limit() + " Capacity: " + bf.capacity() + " Position: " + bf.position());
    }
    channel.close();
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (fin != null) {
        try {
            fin.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
}

static void writeNIO() {
``` 
String filename = "out.txt";
FileOutputStream fos = null;
try {
    fos = new FileOutputStream(new File(filename));
    FileChannel channel = fos.getChannel();
    ByteBuffer src = Charset.forName("utf8").encode("Hello NIO");
    System.out.println("Initial Capacity and Limit: " + src.capacity() + "," + src.limit());
    int length = 0;
    while ((length = channel.write(src)) != 0) {
        System.out.println("Write length: " + length);
    }
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (fos != null) {
        try {
            fos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
}
```

#### Using AIO for File Read/Write

```java
public class ReadFromFile {
  public static void main(String[] args) throws Exception {
``` 
Path file = Paths.get("/usr/a.txt");
AsynchronousFileChannel channel = AsynchronousFileChannel.open(file);

ByteBuffer buffer = ByteBuffer.allocate(100_000);
Future<Integer> result = channel.read(buffer, 0);

while (!result.isDone()) {
  ProfitCalculator.calculateTax();
}
Integer bytesRead = result.get();
System.out.println("Bytes read [" + bytesRead + "]");
```
  }
}

public class WriteToFile {
  public static void main(String[] args) throws Exception {
``` java
AsynchronousFileChannel fileChannel = AsynchronousFileChannel.open(
    Paths.get("/asynchronous.txt"), StandardOpenOption.READ,
    StandardOpenOption.WRITE, StandardOpenOption.CREATE);
    
CompletionHandler<Integer, Object> handler = new CompletionHandler<Integer, Object>() {
```java
  @Override
  public void completed(Integer result, Object attachment) {
    System.out.println("Attachment: " + attachment + " " + result + " bytes written");
    System.out.println("CompletionHandler Thread ID: " + Thread.currentThread().getId());
  }

  @Override
  public void failed(Throwable e, Object attachment) {
    System.err.println("Attachment: " + attachment + " failed with:");
    e.printStackTrace();
  }
};
```

System.out.println("Main Thread ID: " + Thread.currentThread().getId());
fileChannel.write(ByteBuffer.wrap("Sample".getBytes()), 0, "First Write", handler);
fileChannel.write(ByteBuffer.wrap("Box".getBytes()), 0, "Second Write", handler);
```
  }
}
```
