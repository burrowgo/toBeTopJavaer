---
title: "Simpledateformat Thread Safe"
---

In daily development, we often use time, and there are many ways to get time in Java code. However, the format of the time obtained by different methods varies. Therefore, we need a formatting tool to display the time in our desired format.

The most commonly used method is to use the `SimpleDateFormat` class. Although it appears simple to use, improper usage can lead to significant issues.

The Alibaba Java Development Manual has the following clear regulation:

<img src="https://www.hollischuang.com/wp-content/uploads/2018/11/Regulation1.png" alt="Regulation 1" width="1862" height="154" class="aligncenter size-full wp-image-3043" />

This article will analyze how to use `SimpleDateFormat` correctly by examining its usage and underlying principles.

### Usage of SimpleDateFormat

`SimpleDateFormat` is a utility class provided by Java for formatting and parsing dates. It allows for formatting (Date -> Text), parsing (Text -> Date), and normalization. It enables users to choose any defined date-time pattern.

In Java, you can use the `format` method of `SimpleDateFormat` to convert a `Date` type to a `String` type with a specified output format.

```java
// Date to String
Date data = new Date();
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
String dataStr = sdf.format(data);
System.out.println(dataStr);
```

The result of the above code is: `2018-11-25 13:00:00`. The date and time format is determined by the "date and time pattern" string. You can specify different patterns for other formats.

You can also use the `parse` method to convert a `String` to a `Date`.

```java
// String to Date
System.out.println(sdf.parse(dataStr));
```

#### Date and Time Pattern Representation

When using `SimpleDateFormat`, you describe time elements using letters to assemble the desired pattern. Common time elements and their corresponding letters are:

![-w717][1]

Pattern letters are usually repeated; the count determines the exact representation. Common output format representations are:

![-w535][2]

#### Outputting Time in Different Time Zones

A time zone is a region that uses the same time definition. Historically, time was determined by the sun's position (local time). In 1863, the concept of time zones was introduced to establish standard times for regions.

Different countries have different sunrise and sunset times due to their geographical locations, resulting in time differences.

The world is divided into 24 time zones. For administrative convenience, countries or provinces often use a single standard time. For instance, although China spans nearly five time zones, it uses Beijing Time (East Eighth Time Zone) as the standard.

In Java, it is crucial to consider time zones when retrieving time. By default, `new Date()` uses the computer's local time zone.

To get time in a different time zone, use `setTimeZone`:

```java
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
sdf.setTimeZone(TimeZone.getTimeZone("America/Los_Angeles"));
System.out.println(sdf.format(Calendar.getInstance().getTime()));
```

The result might be `2018-11-24 21:00:00`. While it's 13:00 on Nov 25 in China, it's 16 hours earlier in Los Angeles (this varies with Daylight Saving Time).

> You can also try `America/New_York`. New York time would be `2018-11-25 00:00:00`, which is 13 hours behind Beijing.

## SimpleDateFormat Thread Safety

Since `SimpleDateFormat` is common, many developers define it as a static variable:

```java
public class Main {
``` java
private static SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

```java
public static void main(String[] args) {
    simpleDateFormat.setTimeZone(TimeZone.getTimeZone("America/New_York"));
    System.out.println(simpleDateFormat.format(Calendar.getInstance().getTime()));
}
```
```
}
```

**This approach poses significant safety risks.**

#### Problem Reproduction

The following code uses a thread pool to execute time output:

```java
/** * @author Hollis */ 
public class Main {

``` java
private static SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

private static ThreadFactory namedThreadFactory = new ThreadFactoryBuilder()
    .setNameFormat("demo-pool-%d").build();

private static ExecutorService pool = new ThreadPoolExecutor(5, 200,
    0L, TimeUnit.MILLISECONDS,
    new LinkedBlockingQueue<Runnable>(1024), namedThreadFactory, new ThreadPoolExecutor.AbortPolicy());

private static CountDownLatch countDownLatch = new CountDownLatch(100);

```java
public static void main(String[] args) {
    Set<String> dates = Collections.synchronizedSet(new HashSet<String>());
    for (int i = 0; i < 100; i++) {
        Calendar calendar = Calendar.getInstance();
        int finalI = i;
        pool.execute(() -> {
                calendar.add(Calendar.DATE, finalI);
                String dateString = simpleDateFormat.format(calendar.getTime());
                dates.add(dateString);
                countDownLatch.countDown();
        });
    }
    countDownLatch.await();
    System.out.println(dates.size());
}
```
```
}
```

This code loops 100 times, adding days to the current date and storing the result in a thread-safe `HashSet`. One would expect the output to be 100, but it is often less.

This is because `SimpleDateFormat` is not thread-safe and is being shared across multiple threads.

The Alibaba Java Development Manual also highlights this:

<img src="https://www.hollischuang.com/wp-content/uploads/2018/11/Regulation2.png" alt="Regulation 2" width="1878" height="546" class="aligncenter size-full wp-image-3044" />

#### Why It Is Not Thread-Safe

The JDK documentation explicitly states:
> Date formats are not synchronized. It is recommended to create separate format instances for each thread. If multiple threads access a format concurrently, it must be synchronized externally.

Looking at the `format` method implementation:

![][5]

`SimpleDateFormat` uses a member variable `calendar` to store time. Since our `simpleDateFormat` is static, this `calendar` is shared. If Thread 1 sets the time but Thread 2 overwrites it before Thread 1 finishes, Thread 1 will output the wrong date. The `parse` method has the same issue.

#### Solutions

**1. Use Local Variables**
Declare `SimpleDateFormat` inside the thread's scope:
```java
pool.execute(() -> {
``` 
SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
// ... logic ...
```
});
```
This avoids sharing and ensures safety.

**2. Synchronization**
Lock the shared variable:
```java
synchronized (simpleDateFormat) {
``` 
String dateString = simpleDateFormat.format(calendar.getTime());
// ...
```
}
```
This forces threads to wait, ensuring sequential access.

**3. ThreadLocal**
`ThreadLocal` gives each thread its own `SimpleDateFormat` instance:
```java
private static ThreadLocal<SimpleDateFormat> simpleDateFormatThreadLocal = new ThreadLocal<SimpleDateFormat>() {
``` 
```java
@Override
protected SimpleDateFormat initialValue() {
    return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
}
```
```
};

String dateString = simpleDateFormatThreadLocal.get().format(calendar.getTime());
```
This caches instances per thread, avoiding both competition and frequent object creation.

**4. DateTimeFormatter (Java 8+)**
Use `DateTimeFormatter`, which is immutable and thread-safe:
```java
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
LocalDate date = LocalDate.parse(dateStr, formatter);
```

### Summary

`SimpleDateFormat` is useful for converting between `String` and `Date` and handling time zones. However, it is not thread-safe. Use local variables, synchronization, `ThreadLocal`, or `DateTimeFormatter` in concurrent environments.

 [1]: https://www.hollischuang.com/wp-content/uploads/2018/11/15431240092595.jpg
 [2]: https://www.hollischuang.com/wp-content/uploads/2018/11/15431240361504.jpg
 [3]: https://www.hollischuang.com/archives/2888
 [4]: https://www.hollischuang.com/archives/290
 [5]: https://www.hollischuang.com/wp-content/uploads/2018/11/15431313894397.jpg
