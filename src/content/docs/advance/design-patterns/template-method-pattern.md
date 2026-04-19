---
title: "Template Method Pattern"
---


## Overview
The **Template Method Pattern** is a behavioral design pattern that defines the skeleton of an algorithm in a base class but lets subclasses override specific steps of the algorithm without changing its structure.

## Structure
-   **Abstract Class:** Contains the `templateMethod()` which defines the algorithm's structure. It calls both abstract methods and (optionally) hook methods.
-   **Concrete Class:** Implements the abstract steps to provide specific behavior.

## Example Code
```java
abstract class DataMiner {
``` java
// The template method
public final void mine(String path) {
    openFile(path);
    extractData();
    parseData();
    analyzeData();
    sendReport();
    closeFile();
}

abstract void extractData();
abstract void parseData();

void openFile(String path) {
    System.out.println("Opening file: " + path);
}

void analyzeData() {
    System.out.println("Analyzing data...");
}

void sendReport() {
    System.out.println("Sending report...");
}

void closeFile() {
    System.out.println("Closing file.");
}
```
}

class PDFDataMiner extends DataMiner {
``` java
```java
@Override
void extractData() {
    System.out.println("Extracting data from PDF...");
}

@Override
void parseData() {
    System.out.println("Parsing PDF data...");
}
```
```
}
```

## Benefits
-   **Code Reuse:** Pulls common behavior into a superclass.
-   **Flexibility:** Subclasses can decide how to implement specific steps.
-   **Control:** The superclass controls the overall algorithm and its invariant parts.

## Real-world Usage
-   **Java `AbstractList`:** Methods like `addAll()` use `add()` which subclasses must implement.
-   **Servlet `HttpServlet`:** The `service()` method is a template that calls `doGet()`, `doPost()`, etc.
-   **Spring `JdbcTemplate`:** Handles the lifecycle of a database connection while letting you provide the specific SQL and mapping logic.
