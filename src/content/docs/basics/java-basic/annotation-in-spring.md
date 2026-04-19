---
title: "Annotation In Spring"
---

`@Configuration` treats a class as an IoC container. If a method is annotated with `@Bean`, the return value of that method will be registered as a bean in the Spring container.

`@Scope` annotation: Defines the scope of the bean.

`@Lazy(true)`: Enables lazy initialization.

`@Service`: Used to annotate business layer components.

`@Controller`: Used to annotate controller layer components.

`@Repository`: Used to annotate data access components (DAOs).

`@Component`: A generic annotation for components when they don't fit into a specific layer (Service, Controller, or Repository).

`@Scope`: Specifies the scope (used on a class).

`@PostConstruct`: Specifies the initialization method (used on a method).

`@PreDestroy`: Specifies the destruction method (used on a method).

`@DependsOn`: Defines the order of bean initialization and destruction.

`@Primary`: When multiple bean candidates exist for autowiring, the bean marked as `@Primary` is preferred. Otherwise, an exception is thrown.

`@Autowired`: Defaults to autowiring by type. To autowire by name, combine it with the `@Qualifier` annotation:
`@Autowired @Qualifier("personDaoBean")`

`@Resource`: Defaults to autowiring by name. If no match is found by name, it falls back to autowiring by type.

### What are the differences between @Component, @Repository, @Service, and @Controller in Spring?

1. `@Component` is a generic term for a managed component.
   `@Controller`, `@Repository`, and `@Service` are all specialized versions of `@Component` used to distinguish between the presentation, persistence, and business layers, respectively. If a component is difficult to categorize, use `@Component`.

2. In current versions, these annotations serve primarily as markers for classification. Future versions of Spring may add additional functionality or semantics to them.