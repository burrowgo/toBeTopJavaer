---
title: "Memory mode"
---

H2 is an open-source embedded (non-embedded device) database engine. It is a class library developed in Java that can be directly embedded in applications and packaged and released with applications, without platform restrictions.

Compared with other open-source databases such as Derby, HSQLDB, MySQL, and PostgreSQL, the advantages of H2 are:
* Java development, not restricted by platform;
* H2 has only one jar package, small footprint, suitable for embedded databases;
* Has a web console for managing the database.

Next, we introduce the database access practice of Spring+Mybatis+H2. Reference: https://blog.csdn.net/xktxoo/article/details/78014739

Add H2 database dependency:

```xml
<dependency>
``` 
<groupId>com.h2database</groupId>
<artifactId>h2</artifactId>
<version>1.4.190</version>
```
</dependency>
```

The configuration of the H2 database property file is as follows. This article uses the memory mode to access the H2 database:

```properties
driver=org.h2.Driver
url=jdbc:h2:mem:testdb;MODE=MYSQL;DB_CLOSE_DELAY=-1
# Persistence mode
#url= jdbc:h2:tcp://localhost/~/test1;MODE=MYSQL;DB_CLOSE_DELAY=-1
```

The Spring configuration file for H2 database access is:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns="http://www.springframework.org/schema/beans"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:jdbc="http://www.springframework.org/schema/jdbc"
       xsi:schemaLocation="
            http://www.springframework.org/schema/beans
                http://www.springframework.org/schema/beans/spring-beans-4.0.xsd
            http://www.springframework.org/schema/tx
                http://www.springframework.org/schema/tx/spring-tx-4.0.xsd
            http://www.springframework.org/schema/jdbc
                http://www.springframework.org/schema/jdbc/spring-jdbc-3.0.xsd">

``` 
<!-- Introduce property file -->
<bean id="propertyConfigurer" class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
    <property name="locations">
        <list>
            <value>classpath:config.properties</value>
        </list>
    </property>
</bean>

<!-- Auto scan DAO -->
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
    <property name="basePackage" value="com.xiaofan.test" />
</bean>

<!-- Configure Mybatis sqlSessionFactory -->
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="dataSource"/>
    <property name="configLocation" value="classpath:mybatis_config.xml"/>
    <property name="mapperLocations" value="classpath:user_mapper.xml"/>
</bean>

<!-- Configure data source -->
<bean id="dataSource"
      class="org.springframework.jdbc.datasource.DriverManagerDataSource">
    <property name="driverClassName" value="${driver}" />
    <property name="url" value="${url}" />
    <!--<property name="username" value="sa" />-->
    <!--<property name="password" value="123" />-->
</bean>

<!-- Initialize database -->
<jdbc:initialize-database data-source="dataSource" ignore-failures="DROPS">
    <jdbc:script location="classpath:sql/ddl.sql" />
    <jdbc:script location="classpath:sql/dml.sql" />
</jdbc:initialize-database>

<!-- Configure transaction management -->
<tx:annotation-driven transaction-manager="transactionManager" proxy-target-class="true"/>
<bean id="transactionManager"
      class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource"/>
</bean>
```

</beans>
```

The DDL statement file for initializing the database is:
```sql
CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `age` int(11) NOT NULL,
  PRIMARY KEY (`id`)
);
```

The DML statement file for initializing the database is:
```sql
insert into `user` (`id`,`name`,`age`) values (1, 'Jerry', 27);
insert into `user` (`id`,`name`,`age`) values (2, 'Angel', 25);
```

Write the test file, as follows:

```java
/**
 * Created by Jerry on 17/7/30.
 */
@ContextConfiguration(locations = {"classpath:config.xml"})
@RunWith(SpringJUnit4ClassRunner.class)
public class Test extends AbstractJUnit4SpringContextTests{

``` java
@Resource
UserDAO userDAO;

@org.junit.Test
```java
public void testInsert() {
```

    int result = userDAO.insert(new User(null, "LiLei", 27));

    Assert.assertTrue(result > 0);
}

@org.junit.Test
```java
public void testUpdate() {
    int result = userDAO.update(new User(2L, "Jerry update", 28));
```

    Assert.assertTrue(result > 0);
}

@org.junit.Test
```java
public void testSelect() {
    User result = userDAO.findByName(new User(null, "Jerry", null));
```

    Assert.assertTrue(result.getAge() != null);
}

@org.junit.Test
```java
public void testDelete() {
    int result = userDAO.delete("Jerry");
```

    Assert.assertTrue(result > 0);
}
```

}
```
