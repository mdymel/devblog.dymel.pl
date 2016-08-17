---
layout: post
title: 'MiSeCo #2: Project structure'
date: '2016-03-15 08:30:33 +0100'
image: /images/posts/2016-03-15-miseco-project-structure/featured.jpg
categories:
- DajSiePoznac
- MiSeCo
tags:
- dajsiepoznac
- aspnetcore
- miseco
- c#
- microservices
- .net
---
In the [last post about MiSeCo](/2016/03/07/introduction-to-miseco/) I have described the idea of the framework and what I want to accomplish with it. There was no code. Last weekend, I finally got around to opening Visual Studio and made some progress. It mostly involved thinking, but I now have a rough idea how the whole thing is going to work. More or less :)

# Project structure
As you can see in the [GitHub repository](https://github.com/mdymel/miseco), there are a few projects created in the solution:

1. MiSeCo - this is the place, where the magic will happen. It is a Class Library project, but de-facto it will act as a WebApi. It has a classic ASP.NET Core Startup class and an API Controller. The controller will only have one function, which will handle all service calls. There is also a class named MiSeCo - it will act as the brain of the whole library. More on this later. When the call comes in it will contain the name of the service, function and parameters. MiSeCo will find the service, invoke the function and return the result.
1. Sample - I have also added a sample application. It contains a console project and two services (with contracts as explained in the [first MiSeCo post](2016/03/07/introduction-to-miseco)).

# MiSeCo class
This class currently has only one method (which throws NotImplementedException :)). The purpose of this method is simple. It will be responsible for creating Proxy classes implementing service interfaces. For example, imagine you have a service with such an interface:

{% highlight csharp %}
public interface IService1 : IContractInterface
{
    int Add(int a, int b);
}
{% endhighlight %}

Using MiSeCo, you will be able call that interface in this way:

{% highlight csharp %}
var miseco = new MiSeCo();
var service1 = miseco.CreateServiceObject();
Console.WriteLine($"2+2={service1.Add(2, 2)}");
{% endhighlight %}

As you can see, MiSeCo will act like an IoC container. The difference is, it won't have access to the real classes implementing the interfaces. It will just know how to serialize the call and where to send it by http request.

# Services registry
MiSeCo will also maintain the registry of all services. It will have to know what interfaces each service implements and the URL of the service. This registry will have to be accessible by all services. I don't know yet, how I'm going to implement that, but I will think about it when I get there :)

Next step is to implement a proxy class for the service interfaces.

You can find the MiSeCo source code on [github](https://github.com/mdymel/miseco). Go ahead and star it to get updates about new changes.

