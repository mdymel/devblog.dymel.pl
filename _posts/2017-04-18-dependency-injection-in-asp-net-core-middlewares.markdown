---
layout: post
title: 'Dependency Injection in the ASP.NET Core Middleware'
date: '2017-04-18'
featured: /images/posts/2017-04-18-dependency-injection-in-asp-net-core-middlewares/featured.jpg
image: /images/posts/2017-04-18-dependency-injection-in-asp-net-core-middlewares/social.jpg
tags: 
- dajsiepoznac2017
- aspnetcore
- stactive
---
I am creating a project called [Stactive](/tags/#stactive), which will be helpful in logging requests and other events from the ASP.NET Core applications. Today, I introduced a `RequestLogger` class, which implements `IRequestLogger` interface. As always, I wanted to inject this in the constructor and realised it needs to be registered in the DI container. I would like to show you how it's done. 

If you're not familiar with the concept of ASP.NET Core pipelines and middlewares, you can read more about it in my [recent post](/2017/03/20/asp-net-core-pipelines/) covering this topic. 

# Dependency Injection in the ASP.NET Core 
There is a build in DI system in the ASP.NET Core. You can use Autofac or other containers, but if you don't decide to, you can stick with the one which you get out of the box. If you want to register a type with it, you do it by adding `AddTransient<>` call in `ConfigureServices()` method of your `Startup` class: 

{% highlight c# %}
services.AddTransient<IEmailSender, AuthMessageSender>();
services.AddTransient<ISmsSender, AuthMessageSender>();
{% endhighlight %}

The problem is, Stactive is going to be a library delivered as a Nuget package. Obviously, I don't want to make its users have to register all the types manually. Fortunately, there is a simple solution to this problem. 

# Registering types from the Middleware 
To register a middleware in the pipeline, in a previous post, I have created a  `StactiveMiddlewareExtensions` class: 

{% highlight c# %}
public static class StactiveMiddlewareExtensions
{
  public static IApplicationBuilder UseStactive(this IApplicationBuilder builder)
  {
    return builder.UseMiddleware<StactiveMiddleware>();
  }
}
{% endhighlight %}

The `UseStactive` method is being called from `Configure` in `Startup` class. 

Similarly, now we need to create another extension method, which will allow us to do all the registrations in the `ConfigureServices()`. For that, I will add a new method in the `StactiveMiddlewareExtensions`:

{% highlight c# %}
public static IServiceCollection AddStactive(this IServiceCollection services)
{
  services.AddTransient<IRequestLogger, RequestLogger>();
  return services;
}
{% endhighlight %}

And use it in the `ConfigureServices`: 

{% highlight c# %}
services.AddStactive();
{% endhighlight %}

Now, I can add all the registrations inside my library. Next step will be to add fluent configuration methods allowing to setup what should be logged where. For example, I am planning to create few loggers for different types of databases, like MongoDB or ElasticSearch. 

You can check all these changes in a [GitHub commit](https://github.com/mdymel/stactive/commit/cbeca1b604710103ecf799c5a4c63147462fb3db). 