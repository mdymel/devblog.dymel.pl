---
layout: post
title: 'Exceptionless - better logging for .NET & JavaScript'
date: '2017-04-13'
image: /images/posts/2017-04-13-exceptionless-better-logging/featured.jpg
tags: 
- dotnet
- javascript
- tools
- dajsiepoznac2017
---
Every application sometimes fails. I know it's hard to admit, but it's true. When it does fail, it usually throws an exception. Based on the type of application, you can handle it differently, but you should always log it somewhere. It might be a file, database or a console. Today, I would like to show you a great tool, which is called [Exceptionless](https://exceptionless.com). 

# Exceptionless - to be without exception
Exceptionless is a logging platform available as a hosted service or an application you can run on your servers. If you choose to use the hosted solution, it's **free** for one project and one user (with some limits) or paid (from $15) for bigger plans. You can also host the service on your servers and then it's **free with no limits**. It's also completely open source, so you can even contribute by fixing some issues. 

# Supported platforms 
Exceptionless was originally built for **.NET** world, but recently **JavaScript** support was added. 

Setup in both cases is really simple. You need to download the package from Nuget or Npm and use the tool on the website to add the configuration code (depending on the type of application). For example, to make it work in ASP.NET Core you need to add this line in the Startup class: 

{% highlight c# %}
app.UseExceptionless("YOUR APPLICATION KEY HERE")
{% endhighlight %}

When that's done, the application should send all unhandled exceptions to Exceptionless. If you'd like to send custom exception, you can always do it by using `ex.ToExceptionless().Submit()`. 

# Features 

The entry point for the application is the **dashboard**: 

![dashboard](/images/posts/2017-04-13-exceptionless-better-logging/dashboard.jpg)

From here you can see most frequent and most recent exceptions from your application. You also see a graph showing you, how the exception frequency changes over time. 

Every event is being saved with some **additional data**: 

![event](/images/posts/2017-04-13-exceptionless-better-logging/event.png)

You can check details like the application name, time or full stack trace, but also some information about the request, logged in user, libraries versions etc. 

For example, if you saved the exception from the javascript application, you can see **details about the request** - URL, Referer, Client IP or which browser the error came from. 

![request](/images/posts/2017-04-13-exceptionless-better-logging/request.png)

Another very useful feature is the ability to pass custom data with the exception: 

![custom objects](/images/posts/2017-04-13-exceptionless-better-logging/custom-objects.jpg)

If you have a place in your application, which is prone to errors, for example, a search, which can timeout, you can catch such exception and log the information about the search, so you can further optimise your queries: 

There are many more features available, you can see them all in the [projects documentation](https://github.com/exceptionless/Exceptionless/wiki#individual-client-documentation#individual-client-documentation). 

# API 
All the data is available through the API. You can use it to create custom dashboards or integrate information from Exceptionless in your existing analytics. 

# Summary 
I am using [exceptionless](https://exceptionless.com) for a good few years now. It helped me many times to identify problems quickly and find the root cause of an issue. An additional benefit is, you can get this service for **free or** for a small amount of money. 

I also like the fact, the company is very active in the open source community. Except the Exceptionless itself, they have also open sourced [Foundatio](https://github.com/exceptionless/Foundatio), which is a set of components for building loosely coupled distributed apps.