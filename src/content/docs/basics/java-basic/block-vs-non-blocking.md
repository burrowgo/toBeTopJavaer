---
title: "Block Vs Non Blocking"
---

Blocking and non-blocking describe the caller.

Like A calling B:

If it is blocking, A must wait after making the call until B returns the result.

If it is non-blocking, A does not need to wait after making the call and can do its own thing.


### Difference between Synchronous/Asynchronous and Blocking/Non-blocking

[Synchronous and Asynchronous](/toBeTopJavaer/basics/java-basic/synchronized-vs-asynchronization) describe the callee.

Blocking and non-blocking describe the caller.

Synchronous is not necessarily blocking, and asynchronous is not necessarily non-blocking. There is no necessary relationship.

Take a simple example, Lao Zhang boiling water.
1. Lao Zhang puts the kettle on the fire and waits by the kettle until the water boils. (Synchronous blocking)
2. Lao Zhang puts the kettle on the fire, goes to the living room to watch TV, and goes to the kitchen from time to time to see if the water is boiling. (Synchronous non-blocking)
3. Lao Zhang puts a whistling kettle on the fire and waits by the kettle until the water boils. (Asynchronous blocking)
4. Lao Zhang puts a whistling kettle on the fire, goes to the living room to watch TV, and stops looking at it before the kettle whistles. When it whistles, he goes to get the kettle. (Asynchronous non-blocking)

The difference between 1 and 2 is what the caller does before getting the return.
The difference between 1 and 3 is that the callee's processing of boiling water is different.
