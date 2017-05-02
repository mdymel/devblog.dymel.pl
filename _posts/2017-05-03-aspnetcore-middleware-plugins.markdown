---
layout: post
title: 'Plugins for ASP.NET Core Middleware'
date: '2017-05-03'
featured: /images/posts/2017-05-03-aspnetcore-middleware-plugins/featured.jpg
image: /images/posts/2017-05-03-aspnetcore-middleware-plugins/social.png
tags: 
- dajsiepoznac2017
- aspnetcore
---
My Stactive project is now functional. It can log ASP.NET Core requests to a MongoDb database. Stactive is a middleware, which in future will be available as a Nuget package. It will support few storing options - as separate plugins - Nuget packages. To make it happen, I needed to implement MongoDb support as a plugin and I decided it might be worth to share how it's done. 

1. TOC
{:toc}

# Why plugins
You could ask, why I don't implement everything in one package. The answer is simple - dependencies. If you don't want Stactive to save anything to MongoDb, why should you add a dependency to MongoClient library? Same with ElasticSearch or MS SQL. Plugins allow to selectively add dependencies to your application. 

# Core project
So far, all of the Stactive code was stored in one project. Because I don't want my MongoDb persistence library to have a dependency from ASP.NET, I needed to create a Stactive.Core project and move all the models there. I have also added an `IPersistance` interface there, which all the persistence libraries will implement: 

{% highlight c# %}
public interface IPersistence
{
    Task SaveRequestLog(RequestLog log);
}
{% endhighlight %}

For now, we only log request information, so it only has this one method. In future, I will be adding more here. 

# Stactive.MongoDbPersistence project
This is the project of my new library: 

![Project structure](/images/posts/2017-05-03-aspnetcore-middleware-plugins/project.png)

As you see, it only has a few dependencies: 
 
 * Dependency Injection framework from ASP.NET Core
 * MongoDb driver
 * Stactive.Core

Nothing more is needed for it to perform its tasks. 

# Plugin registration
I wanted to be able to register this plugin like you do with other middlewares: 

{% highlight c# %}
services
    .AddStactive()
    .AddStactiveMongoPersistance(options => 
        options.WithConnectionString(Configuration.GetConnectionString("StactiveMongoDb")));
{% endhighlight %}

This is the part of the `Startup` class from my sample project. It uses both `Stactive` and `Stactive.MongoDbPersistence` dependencies. Thanks to the second one, it has access to `StactiveMongoRegistration` class, which is responsible for configuring the plugin: 

{% highlight c# %}
public static class StactiveMiddlewareExtensions
{
    public static IServiceCollection AddStactiveMongoPersistance(this IServiceCollection services, Action<StactiveMongoOptions> options = null)
    {
        services.AddTransient<IPersistence, MongoDbPersistence>();
            
        var stactiveMongoOptions = new StactiveMongoOptions();
        options?.Invoke(stactiveMongoOptions);
        services.AddTransient(c => stactiveMongoOptions);

        StactiveMongoDb.Initialize(stactiveMongoOptions);
        services.AddTransient<StactiveMongoDb>();
        return services;
    }
{% endhighlight %}

The first line registers `MongoDbPersistence` class as an implementation of my persistence interface. This way, Stactive will be able to inject it in the constructor. Then you can see the use of `StactiveMongoOptions` class: 

{% highlight c# %}
public class StactiveMongoOptions
{
    public string ConnectionString { get; private set; } = "mongodb://localhost:27017/";
    public string DatabaseName { get; private set; } = "stactive";
    public string RequestLogCollectionName { get; private set; } = "requestLog";

    public void WithConnectionString(string connectionString) => ConnectionString = connectionString;
    public void WithDatabaseName(string databaseName) => DatabaseName = databaseName;
    public void WithRequestLogCollectionName(string requestLogCollectionName) => RequestLogCollectionName = requestLogCollectionName;
}
{% endhighlight %}

This class allows setting all the options relevant to the plugin. It uses an instance of this class to initialize `StactiveMongoDb`, which contains MongoDb client object: 

{% highlight c# %}
public class StactiveMongoDb
{
    private static MongoClient _client;
    private static string _databaseName;

    public static void Initialize(StactiveMongoOptions options)
    {
        _client = new MongoClient(options.ConnectionString);
        _databaseName = options.DatabaseName;
    }

    public IMongoCollection<T> GetCollection<T>(string collectionName)
    {
        if (_client == null || _databaseName == null) throw new StactiveException("StactiveMongoDb has not been initialized");

        var database = _client.GetDatabase(_databaseName);
        return database.GetCollection<T>(collectionName);
    }
}
{% endhighlight %}

# Using the plugin
Because I have registered the `MongoDbPersistence` class with the DependencyInjection, everything I now have to do in the Stactive project is to request it in the constructor: 

{% highlight c# %}
public class RequestLogger : IRequestLogger
{
    private readonly IEnumerable<IPersistence> _persistances;

    public RequestLogger(IEnumerable<IPersistence> persistances)
    {
        _persistances = persistances;
    }

    public async Task LogRequest(HttpContext context, long processingTime)
    {
        var requestLog = new RequestLog
        {
            Url = context.Request.Path,
            ResponseStatus = context.Response.StatusCode,
            ContentType = context.Response.ContentType,
            ResponseLength = context.Response.ContentLength,
            ProcessingTime = processingTime
        };

        await Task.WhenAll(_persistances.Select(p =>
                p.SaveRequestLog(requestLog)))
            .ConfigureAwait(false);
    } 
}
{% endhighlight %}

You can see how the constructor expects `IEnumerable<IPersistence>` - this will provide all implementations of the interface, which are then used later in the `LogRequest()` method. 

# Summary
Sometimes, you see nuget libraries, which have a very long list of dependencies. If you want to use such library, you have to install them. Even though, you might need only one. An answer to such problem is partitioning the libraries. One way of doing that is by using plugins. I think it's very good option and I hope I made this concept more clear today. 

As always, you can find the code in the [Stactive](https://github.com/mdymel/stactive) repository. 