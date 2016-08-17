---
layout: post
title: 'MiSeCo #6: HTTP Interface to a class'
date: '2016-04-05 07:50:24 +0200'
image: /images/posts/2016-04-05-http-interface-to-a-class/featured.jpg
tags:
- dajsiepoznac
- aspnetcore
- miseco
- .net
- autofac
---
# Previously on MiSeCo
I've shown how you can create dynamic proxy objects which will allow services to call other service methods over an HTTP connection. Now I want to figure out how to invoke methods when this HTTP call comes in.

# General Assumptions
MiSeCo will communicate with services over an HTTP API created with ASP.NET Core. I think the easiest way to do it is to create one controller with one method, handling all the calls - like a catch-all interface. I will send serialized call information as a JSON object, containing the following data:

* Interface name
* Method name
* Parameters

MiSeCo will have to get the object implementing this interface, call the method with received parameters and return a value.

# DI for the rescue
The easiest way to obtain all types implementing IContractInterface is to set them as a dependency of my ApiController and use a DI container to inject them in: 

{% highlight csharp %}
private readonly IEnumerable<IContractInterface> _services;
public ApiController(IEnumerable<IContractInterface> services)
{
    _services = services;
}
{% endhighlight %}

I have to set up a DI container. Because I want it to be dynamic, I need to use the auto discovery feature. I couldn't find such functionality in ASP.NET Core's built-in dependency injection, so I decided to use [AutoFac](http://autofac.org/). Normally it's very easy to register all the types implementing an interface:

{% highlight csharp %}
containerBuilder.RegisterAssemblyTypes(assembly)
    .Where(t => t.GetInterfaces().Contains(typeof(IContractInterface)))
    .AsImplementedInterfaces();
{% endhighlight %}

Unfortunately, in this use case I don't know the name of the assembly which contains the service :) I was banging my head for about half an hour until the solution came to my mind. The DI container is initialized in the ASP Startup class, but because the API is being launched from the service, I need to have startup classes defined there too. So I defined MiSeCoStartup as an abstract class with an abstract method GetServiceAssembly:

{% highlight csharp %}
public abstract class MisecoStartup
{
    public abstract Assembly GetServiceAssembly();
    ...
}
{% endhighlight %}

Now every MiSeCo service will have to implement this class like this: 

{% highlight csharp %}
public class Startup : MisecoStartup
{
    public override Assembly GetServiceAssembly()
    {
        return Assembly.GetExecutingAssembly();
    }
}
{% endhighlight %}

(unless you have a better solution for this? :)) 

# Manual invoke
Now I could finally implement the ConfigureServices method and initialize an AutoFac container properly:

{% highlight csharp %}
public IServiceProvider ConfigureServices(IServiceCollection services)
{
    services.AddMvc();

    // Add Autofac
    var containerBuilder = new ContainerBuilder();
    Assembly assembly = GetServiceAssembly();

    containerBuilder.RegisterAssemblyTypes(assembly)
            .Where(t => t.GetInterfaces().Contains(typeof(IContractInterface)))
            .AsImplementedInterfaces();
    containerBuilder.Populate(services);
    IContainer container = containerBuilder.Build();
    return container.Resolve<IServiceProvider>();
}
{% endhighlight %}

My API controller is being injected with objects of all classes implementing the contract interface. 

To test this part, I've created a simple interface with a very sophisticated implementation:

{% highlight csharp %}
public interface IService1 : IContractInterface
{
    int Add(int a, int b);
}

public class Service1 : IService1
{
    public int Add(int a, int b)
    {
        return a + b;
    }
}

{% endhighlight %}

And the time came for the easiest part - invoke this method by sending an HTTP request to the service API:

{% highlight csharp %}
[HttpGet]
[Route("")]
public string Services()
{
    const string serviceName = "Service1";
    const string methodName = "Add";
    object[] parametersArray = { 2, 2 };

    IContractInterface service = _services.First(s => s.GetType().Name == serviceName);

    MethodInfo methodInfo = service.GetType().GetMethods().First(m => m.Name == methodName);
    if (methodInfo == null) return "error";

    var parameters = methodInfo.GetParameters();
    if (parameters.Length == 0)
    {
        methodInfo.Invoke(service, null);
    }
    else
    {
        return methodInfo.Invoke(service, parametersArray).ToString();
    }
    return "error";
}
{% endhighlight %}

The code here is simple - I'm getting a service by name, then a method and finally calling it with the parameters - I don't think it needs any more explanation.. It worked :) 

# Summary
The biggest challenge here was to get an assembly of a parent class. I didn't find a way to do it from the MiSeCo assembly, as it's being referenced by the service application. I had to pass it from the service in an abstract method implementation. If you know a better way to do it, please let me know! 

