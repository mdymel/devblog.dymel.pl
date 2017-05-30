---
layout: post
title: 'ASP.NET Core Utils - nuget package available'
date: '2017-05-31'
featured: /images/posts/2017-05-31-asp-net-core-utlis/featured.jpg
image: /images/posts/2017-05-31-asp-net-core-utlis/social.png
tags: 
- dajsiepoznac2017
- aspnetcore
---
A few weeks ago, I have started to work on a new project based on ASP.NET Core. I quickly had to deal with problems I have already solved. Some of them I even described on this blog. I started to copy classes from other projects, but then I realised it would be better to make it opensource and available as a NuGet package. And that's what I have done. Read on to see what utils are available there at the moment. 

# The Project 
AspNetCoreUtils is a library package, which can bring some useful classes into your project. Currently, it's only 4 of them, but I hope to be adding more. You can also contribute if you have an idea for a functionality or maybe have something ready. The project is available on [GitHub](https://github.com/mdymel/AspNetCoreUtils) and as a [Nuget package](https://www.nuget.org/packages/AspNetCoreUtils/). I want to keep it free of extra dependencies. Currently, the only package it requires is `Microsoft.AspNetCore` and I would like it to stay that way. 

# The Utils

## CloudFlareUtilities 
If you don't know [CloudFlare](https://www.cloudflare.com/). Take a moment and check it out now! It's a service, which provides free CDN for your website. You also get DDoS protection and effortless SSL. Really worth to try it out. 
Because it's a CDN, requests to your website will come from a proxy, so if you want to access your users IP address, you can't simply get it from the `HttpContext` object. You need to use `X-Forwarded` headers. CloudFlare provides a list of its network IP addresses. This list is needed to properly configure `UseForwardedHeaders` option. I described it in detail in [another post](/2017/04/25/aspnetcore-reverse-proxy-client-ip/). CloudFlareUtilities downloads the list (or falls back to a copy), parses it and returns `ForwardedHeadersOptions` object. So everything you need to do to configure your app is this: 

{% highlight c# %}
var options = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.All,
    RequireHeaderSymmetry = false,
    ForwardLimit = null
};
CloudFlareUtilities.FillKnownNetworks(options);
app.UseForwardedHeaders(options);
{% endhighlight %}

## ForwardedHeadersRegistration
If you want to use a standard configuration for the `UseForwardedHeaders` with CloudFlare IP addresses, you can use this class to make the registration. 

{% highlight c# %}
app.RegisterForwardedHeaders(Options.ReverseProxyIp);
{% endhighlight %}

Reverse proxy IP is useful for example when you're using Docker behind Nginx server to host your application. 

## ErrorHandlerMiddleware
That's a middleware allowing you to return an empty response with the desired status code from your API. For example `404 Not Found`. If have wrote a [post about it](/2016/06/29/asp-net-core-status-code-empty-response/) too. 
After you enable it in the `Startup` class: 

{% highlight c# %}
app.UseMiddleware<ErrorHandlerMiddleware>();
{% endhighlight %}

You can use it like that: 

{% highlight c# %}
if (sId == null || !ObjectId.TryParse(sId, out var subscriptionId))
{
    throw new ErrorHandlerMiddleware.HttpStatusCodeException(HttpStatusCode.Forbidden);
}
{% endhighlight %}

## OptionsExtensions
This is a class, which simplifies registration of the application settings stored in the `appsettings.json` file. You can use this file with `IOptions<T>` implementation to access your settings. The functionality is described in the [documentation](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration). What I didn't like about this was the fact of having a wrapper object over my options, so you'd have to do `options.Value.MyProperty`. And more importantly, if I was using another assembly with Domain code and wanted to access options, I'd have to reference the ASP assemblies. This is why I prefer to register MyOptions object with the dependency injector. When it's done, I can simply inject `MyOptions` class whenever I need it. 
To use it, you need to add this code in your `Startup` class: 

{% highlight c# %}
var myOptions = services.RegisterOptions<MyOptions>(Configuration.GetSection("MyOptions"));
{% endhighlight %}

This will get the configuration section and register the instance of the `MyOptions` in the dependency injection container. 

# Summary 
It's not a lot of functionality for now, but I am sure it will grow. If you have a class, which fits in this set, please contribute it to this project :) 