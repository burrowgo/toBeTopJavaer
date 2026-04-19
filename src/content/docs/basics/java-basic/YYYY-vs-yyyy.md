---
title: "Yyyy Vs Yyyy"
---

When using `SimpleDateFormat`, you need to use letters to describe time elements and assemble them into the desired date and time pattern. The common time elements and their corresponding letters (JDK 1.8) are as follows:

![](http://www.hollischuang.com/wp-content/uploads/2020/01/15781278483147.jpg)

As you can see, *`y` represents Year, while `Y` represents Week Year.*

### What is Week Year?

Different countries have different definitions for the start and end of a week. For example, in China, Monday is considered the first day of the week, while in the United States, Sunday is considered the first day.

Similarly, how to define which week is the first week of the year? This is also a question with multiple interpretations.

For example, below is a calendar for December 2019 to January 2020.

![](http://www.hollischuang.com/wp-content/uploads/2020/01/15781286552869.jpg)

Which week counts as the first week of 2020? Different regions, countries, and even individuals have different understandings:

1.  January 1st is a Wednesday; the seven days until the following Wednesday (January 8th) count as the first week of the year.
2.  Since Sunday (or Monday) is the first day of the week, the first week starts from the first Sunday (or Monday) of 2020 and lasts for 7 days.
3.  Since December 29, 30, and 31 are in 2019, while January 1, 2, and 3 are in 2020, and Saturday/Sunday starts the next week, the first week should only consist of January 1, 2, and 3.

#### ISO 8601

Because of these differing interpretations, an international standard was established: ISO 8601.

ISO 8601 is an international standard for representing dates and times. In ISO 8601, there are four equivalent ways to define the first calendar week of the year:
1.  The week containing the first Thursday of the year.
2.  The week containing January 4th.
3.  The week that has at least 4 days in the new year.
4.  The week starting with a Monday between December 29th and January 4th.

According to this standard, we can calculate:

The first week of 2020: 2019.12.29 - 2020.1.4

Therefore, according to the ISO 8601 standard, December 29, 30, and 31 of 2019 do not belong to the last week of 2019, but rather to the first week of 2020.

#### JDK Support for ISO 8601

According to the ISO 8601 definition, 2019.12.29 - 2020.1.4 is the first week of 2020.

We want a program to tell us which year a specific date belongs to based on the ISO 8601 calendar definition.

For instance, if I input 2019-12-20, it should return 2019; if I input 2019-12-30, it should return 2020.

To provide this data, Java 7 introduced `YYYY` as a new date pattern identifier. By using `YYYY` with `SimpleDateFormat`, you can determine which year a date's week belongs to.

Therefore, when representing dates, you must use `yyyy-MM-dd` instead of `YYYY-MM-dd`. While the results are the same most of the time, `YYYY` will cause issues in edge cases.
