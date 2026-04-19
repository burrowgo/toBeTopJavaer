---
title: "Concurrent Vs Parallel"
---

Joe Armstrong, the father of Erlang, used a graphic to explain the difference between concurrency and parallelism:

![](http://www.hollischuang.com/wp-content/uploads/2018/12/CON.jpg)

Concurrency is two queues alternately using one coffee machine. Parallelism is two queues using two coffee machines at the same time.

Mapping to a computer system, the coffee machine in the figure above is the CPU, and the two queues refer to two processes.
