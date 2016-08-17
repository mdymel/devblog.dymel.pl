---
layout: post
title: Creating test data and mocking dependencies
date: '2016-04-26 07:50:24 +0200'
image: /images/posts/2016-04-26-test-data-and-mocks/featured.jpg
tags:
- .net
- dajsiepoznac
- testing
- autofixture
- fakeiteasy
---
When you are testing your application, at some point will have solve two problems:

* Creating test data you will pass to your functions 
* Mocking your dependencies

# Creating test data with Autofixture
Every time you test a function which takes some values as parameters, you need to provide these values. You can create it manually, but it's cumbersome when you need to populate an object with 10 properties. Here is where [Autofixture](https://github.com/AutoFixture) comes handy. It's a library created by [Mark Seeman](http://blog.ploeh.dk/). It allows you to easily create test data for your unit tests. 

{% highlight csharp %}
[Fact]
public void generating_string_with_autofixture()
{
    var fixture = new Fixture();
    var s = fixture.Create<string>();
    Assert.NotEmpty(s);
}
{% endhighlight %}

You can create simple value types and complex objects with properties filled with data. 

# Mocking dependencies
Another problem while testing your application is mocking your dependencies. Imagine you have an application which has some service and a repository this service depends on: 

{% highlight csharp %}
public interface ITestRepository
{
    int TestMethod(int a);
}

public class TestService
{
    private readonly ITestRepository _repository;
    public TestService(ITestRepository repository)
    {
        _repository = repository;
    }

    public int InvokeTestMethod(int a)
    {
        return _repository.TestMethod(a);
    }
}
{% endhighlight %}

When you are writing tests for TestService, you don't want to use real repository implementation, which, for example, talks directly to the database. You just want to check the TestService code. 

The answer to this problem is to use a mocking library. There are at least few of them available: [Moq](https://github.com/Moq/moq4/wiki/Quickstart), [NSubstitute](http://nsubstitute.github.io/) and [FakeItEasy](https://fakeiteasy.github.io/). They all have similar capabilities, but my favourite is the last one - FakeItEasy. 

I would like to show you how to use it on a simple example with service and repository mentioned above. In the test, I would like to check if: 

1. InvokeTestMethod is calling TestMethod in the repository
1. Service method is returning what it got from the repository

{% highlight csharp %}
[Fact]
public void method_has_been_called()
{
    var fixture = new Fixture();
    var repository = A.Fake<itestrepository>();

    var service = new TestService(repository);

    var a = fixture.Create<int>();
    var b = fixture.Create<int>();
    A.CallTo(() => repository.TestMethod(a)).Returns(b);
    var result = service.InvokeTestMethod(a);
    A.CallTo(() => repository.TestMethod(a)).MustHaveHappened();
    Assert.Equal(b, result);
}
{% endhighlight %}

In this example, I am using both libraries.&nbsp; Autofixture helps me to create a test data - in this case it's two integers: a & b. Then I am using FakeItEasy to create a fake repository, setup a call to TestMethod and check if it was called by the service. 

# AutoFixture + FakeItEasy
It is also possible to configure AutoFixture to fallback to FakeItEasy when an interface is requested, but I don't find it useful and prefer to use these libraries on their own. There is a nice post by Nikos Baxevanis explaining it [here](http://blog.nikosbaxevanis.com/2011/12/14/auto-mocking-with-fakeiteasy-and-autofixture/).

# Summary

As you can see, not only those libraries are easy to use, but also functionality they provide is very helpful. I highly encourage you to go to [AutoFixture CheatSheet](https://github.com/AutoFixture/AutoFixture/wiki/Cheat-Sheet) and [FakeItEasy QuickStart](http://fakeiteasy.readthedocs.org/en/stable/quickstart/) pages and check all the options available in these two libraries. 


