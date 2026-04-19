---
title: "Annotation In Java"
---


```java
@Override indicates that the current method overrides the parent class's method.
```

@Deprecated indicates that the method is obsolete, there is a horizontal line on the method, and there will be a warning when using it.

@SuppressWarnings indicates closing some warning messages (notifies the java compiler to ignore specific compilation warnings).

@SafeVarargs (updated in jdk1.7) indicates: specifically provided to suppress "heap pollution" warnings.

@FunctionalInterface (updated in jdk1.8) indicates: used to specify that an interface must be a functional interface, otherwise it will compile with an error.


### Common Spring Annotations

@Configuration treats a class as an IoC container, and if @Bean is registered at the head of one of its methods, it will serve as a Bean in this Spring container.

@Scope annotation Scope

@Lazy(true) indicates lazy initialization

@Service used to mark business layer components

@Controller used to mark control layer components. @Repository used to mark data access components, i.e., DAO components.

@Component refers generally to components, when components are not easy to classify, we can use this annotation to mark them.

@Scope used to specify the scope (used on classes)

@PostConstruct used to specify the initialization method (used on methods)

@PreDestroy used to specify the destruction method (used on methods)

@DependsOn: Defines the order of Bean initialization and destruction

@Primary: When multiple Bean candidates appear during auto-wiring, the Bean annotated with @Primary will be the first choice, otherwise an exception will be thrown.

@Autowired Default wiring by type, if we want to use wiring by name, we can use it in combination with @Qualifier annotation. As follows:
@Autowired @Qualifier("personDaoBean") Used together when multiple instances exist.

@Resource Default wiring by name, only when no bean matching the name is found will it be wired by type.

@PostConstruct initialization annotation

@PreDestroy destruction annotation default singleton load upon startup
