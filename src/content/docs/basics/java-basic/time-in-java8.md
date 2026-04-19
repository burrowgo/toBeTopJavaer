---
title: "Time In Java8"
---

Java 8 further strengthened date and time handling by releasing the new Date-Time API (JSR 310).

In older versions of Java, the date and time API had many problems, including:

* Non-thread safe - `java.util.Date` is not thread-safe; all date classes are mutable, which is one of the biggest issues with Java date classes.

```java
* Poor design - The definitions of Java's date/time classes are inconsistent. There are date classes in both the `java.util` and `java.sql` packages. Additionally, classes for formatting and parsing are defined in the `java.text` package. `java.util.Date` contains both date and time, while `java.sql.Date` contains only the date, and placing it in the `java.sql` package is unreasonable. Furthermore, both classes have the same name, which is itself a very poor design.
```

* Difficult time zone handling - Date classes do not provide internationalization and have no time zone support. Therefore, Java introduced the `java.util.Calendar` and `java.util.TimeZone` classes, but they also suffer from all the problems mentioned above.

In Java 8, the new time and date API is located in the `java.time` package. What are the important classes in this package, and what do they represent?

`Instant`: Timestamp

`Duration`: Duration, time difference

`LocalDate`: Contains only the date, e.g., 2016-10-20

`LocalTime`: Contains only the time, e.g., 23:12:10

`LocalDateTime`: Contains both date and time, e.g., 2016-10-20 23:14:21

`Period`: Period of time

`ZoneOffset`: Time zone offset, e.g., +8:00

`ZonedDateTime`: Time with a time zone

`Clock`: Clock, e.g., to get the current time in New York, USA

```java
The new `java.time` package covers all operations for handling date, time, date/time, time zone, instant, duration, and clock.
```

### What is the difference between LocalTime and LocalDate?

`LocalDate` represents the date (year, month, day), while `LocalTime` represents the time (hour, minute, second).

### Getting the Current Time

In Java 8, use the following method to get the current time:
 
 LocalDate today = LocalDate.now();
 int year = today.getYear();
 int month = today.getMonthValue();
 int day = today.getDayOfMonth();
 System.out.printf("Year: %d Month: %d day: %d t %n", year, month, day);
 

### Creating a Specific Date

 LocalDate date = LocalDate.of(2018, 01, 01);
 

### Checking for a Leap Year

You can directly use the `isLeapYear` method of `LocalDate` to determine if it is a leap year.

 LocalDate nowDate = LocalDate.now();
 // Check for leap year
 boolean leapYear = nowDate.isLeapYear();
 
### Calculating the Number of Days and Months Between Two Dates

In Java 8, you can use the `java.time.Period` class for calculations.

 Period period = Period.between(LocalDate.of(2018, 1, 5), LocalDate.of(2018, 2, 5));
