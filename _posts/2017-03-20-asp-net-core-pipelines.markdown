---
layout: post
title: 'ASP.NET Core pipelines'
date: '2017-03-20'
image: /images/posts/2017-03-20-asp-net-core-pipelines/featured.jpg
tags: 
- dajsiepoznac2017
- aspnetcore
- stactive
---
Sometimes, in the web application, you need to perform some task for every request. It could be logging, authenticating users or modifying the response. Every web framework allows implementing this in some way. Today, I would like to show you how to do it in the ASP.NET Core. 

1. TOC
{:toc}

# The context - Stactive project
A few weeks ago, I [decided](/2017/03/01/hello-world-2/#stactive) to create an open source project called Stactive. It will be a library, which you can add to an ASP.NET Core project. It will help you gather activity logs from your application and present stats using an interface in Kibana. 
To be able to do that, I need to run its code for all requests. During the processing, it will be possible to save some events (user X did Y). All these events will be persisted at once, after the request processing is finished. This way, I will minimise the number of queries to the database. 

# Middleware 
If you go to [ASP.NET Core documentation](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/middleware), you can read: 

> Middleware is software that is assembled into an application pipeline to handle requests and responses. Each component chooses whether to pass the request on to the next component in the pipeline and can perform certain actions before and after the next component is invoked in the pipeline. Request delegates are used to build the request pipeline. The request delegates handle each HTTP request.

The ASP.NET Core pipeline is built of various middlewares. That's how you add functionality to the application: 

{% highlight csharp %}
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
{
    loggerFactory.AddConsole(Configuration.GetSection("Logging"));
    loggerFactory.AddDebug();

    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
        app.UseDatabaseErrorPage();
        app.UseBrowserLink();
    }
    else
    {
        app.UseExceptionHandler("/Home/Error");
    }

    app.UseStaticFiles();

    app.UseIdentity();
    
    app.UseMvc(routes =>
    {
        routes.MapRoute(
            name: "default",
            template: "{controller=Home}/{action=Index}/{id?}");
    });

}
{% endhighlight %}

This is a `Configure` method from the `Startup` class generated with an ASP.NET Core sample project. You can notice a bunch of `app.Use***()` statements. Each one of these adds a new middleware. Those middlewares are executed in the order they're added here. So for example, if you request an image file, StaticFiles middleware will return it and stop further request processing. Also, if Identity middleware decides you're not logged in when you should, it would return `401 Unauthorised` status and stop the processing. 

What it means is, you have a great control, over what happens after your middleware method is executed. You can stop processing completely and return something else or you can perform your tasks and give the control back to the next middleware in the pipeline. 

# Inline implementation
There are two ways to implement a middleware. You can do it inline in the `Startup` class, or extract it to another class (or a project). The simplest way to do it is to inject such code in the `Configure` method: 

{% highlight csharp %}
app.Use(async (context, next) =>
{
    // Do work that doesn't write to the Response.
    await next.Invoke();
    // Do logging or other work that doesn't write to the Response.
});
{% endhighlight %}

As you see, there are two parts where you can write your code. They are divided by the `await next.Invoke();` call. This call gives the control back to the pipeline and continues executing other middlewares in it. When that's done, the control is coming back to your middleware, so you can do logging or, in my case, save events to the database. 

# Middleware as a class
Because Stactive is going to be a library, I not only need to have my middleware as a separate class, I need it in another project. This means, we need to add these NuGet packages to the project: 

{% highlight xml %}
<ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.Http.Abstractions" Version="1.1.1" />
    <PackageReference Include="Microsoft.Extensions.Logging.Abstractions" Version="1.1.1" />
</ItemGroup>
{% endhighlight %}

The middleware class is simple and only contains one method: 

{% highlight csharp %}
public class StactiveMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger _logger;

    public StactiveMiddleware(RequestDelegate next, ILogger<StactiveMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        // Call the next delegate/middleware in the pipeline
        await _next(context);
        sw.Stop();

        _logger.LogInformation($"Request {context.Request.Path} took {sw.ElapsedMilliseconds}ms");
    }
}
{% endhighlight %}

As you can see, it measures request processing time and logs it as an information. The `sw.stop()` and the logging take place after the `_next()` call, which means they're executed after other middlewares are finished with the processing. 

Now, we need an extension method to the `IApplicationBuilder`, so we can add our middleware in the `Startup` method. For this, we need another class: 

{% highlight csharp %}
public static class StactiveMiddlewareExtensions
{
    public static IApplicationBuilder UseStactive(
        this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<StactiveMiddleware>();
    }
}
{% endhighlight %}

And the last bit, registering our middleware in the `Startup` method: `app.UseStactive();`. It's important where you place this. For example, if you want to measure request processing time like above, it should be in the beginning, above other middlewares. 

# Summary
I think this is one of the most powerful parts of the ASP.NET Core. It gives you many possibilities and is very easy to implement. It's also a very convenient way of creating libraries other developers can add to their applications like I am going to do with Stactive :) 