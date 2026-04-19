---
title: "Synchronized Vs Asynchronization"
---

Synchronous and asynchronous describe the behavior of the callee.

For example, A calls B:

If it is **synchronous**, B will execute the task immediately upon receiving A's call. A's current call can get the result.

If it is **asynchronous**, B does not guarantee immediate execution upon receiving A's call but guarantees it will be done and will notify A when finished. A's current call does not get the result immediately, but B will notify A after execution.

### Difference between Synchronous/Asynchronous and Blocking/Non-blocking

Synchronous/Asynchronous describes the **callee**.

[Blocking/Non-blocking](/toBeTopJavaer/basics/java-basic/block-vs-non-blocking) describes the **caller**.

Synchronous does not necessarily mean blocking, and asynchronous does not necessarily mean non-blocking. There is no inevitable relationship.

A simple example: Old Zhang boils water.
1. Old Zhang puts the kettle on the fire and waits beside it until the water boils. (**Synchronous Blocking**)
2. Old Zhang puts the kettle on the fire, goes to the living room to watch TV, and occasionally goes to the kitchen to check if the water is boiling. (**Synchronous Non-blocking**)
3. Old Zhang puts a whistling kettle on the fire and waits beside it until the water boils. (**Asynchronous Blocking**)
4. Old Zhang puts a whistling kettle on the fire, goes to the living room to watch TV, and doesn't look at it until the kettle whistles. When it whistles, he goes to get the kettle. (**Asynchronous Non-blocking**)

The difference between 1 and 2 is what the caller does before getting the return.
The difference between 1 and 3 is how the callee handles the boiling water.
