---
title: "Get Los_Angeles Time"
---

Friends familiar with Java 8 may know that Java 8 provides a new set of time processing APIs, which are much friendlier than the previous ones.

Java 8 adds support for time zones, with the time-zoned types being: `ZonedDate`, `ZonedTime`, and `ZonedDateTime`.

Each time zone corresponds to an ID, and the region IDs are in the format "{Region}/{City}", such as `Asia/Shanghai`, `America/Los_Angeles`, etc.

In Java 8, the following code can be used directly to output the time in Los Angeles, USA:

```java
LocalDateTime now = LocalDateTime.now(ZoneId.of("America/Los_Angeles"));
System.out.println(now);
```

Why can't the following code obtain the US time?

```java
System.out.println(Calendar.getInstance(TimeZone.getTimeZone("America/Los_Angeles")).getTime());
```

When we use `System.out.println` to output a time, it calls the `Date` class's `toString` method, which reads the operating system's default time zone for time conversion.

```java
public String toString() {
``` 
// "EEE MMM dd HH:mm:ss zzz yyyy";
BaseCalendar.Date date = normalize();
...
```
}
    
private final BaseCalendar.Date normalize() {
``` 
...
TimeZone tz = TimeZone.getDefaultRef();
if (tz != cdate.getZone()) {
    cdate.setZone(tz);
    CalendarSystem cal = getCalendarSystem(cdate);
    cal.getCalendarDate(fastTime, cdate);
}
return cdate;
```
}
    
static TimeZone getDefaultRef() {
``` 
TimeZone defaultZone = defaultTimeZone;
if (defaultZone == null) {
    // Need to initialize the default time zone.
    defaultZone = setDefaultZone();
    assert defaultZone != null;
}
// Don't clone here.
return defaultZone;
```
}
```

The main code is as above. That is to say, if we want to output the time in Los Angeles via `System.out.println` for a `Date` class, we need to find a way to change `defaultTimeZone` to `America/Los_Angeles`.

However, by reading the `Calendar` source code, we find that although the `getInstance` method has a parameter to pass in a time zone, it does not set the default time zone to the passed-in time zone.

The time obtained after `Calendar.getInstance().getTime()` is just a timestamp, which does not retain any information related to the time zone. Therefore, when outputting, it still displays the time of the current system's default time zone.
