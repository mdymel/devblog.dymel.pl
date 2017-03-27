---
layout: post
title: 'Passing data through the ASP.NET Core pipeline'
date: '2017-03-28'
image: /images/posts/2017-03-28-passing-data-through-asp-net-core-pipelines/featured.jpg
tags: 
- dajsiepoznac2017
- aspnetcore
- stactive
---
In Stactive, I have to be able to create statistical events during request processing and be able to save these events, when I get the control back to my [middleware](/2017/03/20/asp-net-core-pipelines/). Fortunately, ASP.NET Core has an easy way of passing data between middlewares in the pipeline. Let's see how it's done! 

When your middleware is executed, you have access to the `HttpContext` object. There, you have every information about the `Request`, the `Response`, but also a field called `Items`, which is declared as `IDictionary<object, object>`. You can use it to store whatever data you need and it will be available for all Middlewares. That was exactly what I was looking for. 

I have created a static `Stactive` class: 

{% highlight csharp %}
public static class Stactive
{
    public const string StactiveEventsKey = "StactiveEvents";

    public static void AddEvent(HttpContext context, StactiveEvent stactiveEvent)
    {
        if (!context.Items.ContainsKey(StactiveEventsKey))
        {
            context.Items[StactiveEventsKey] = new List<StactiveEvent>();
        }
        var list = context.Items[StactiveEventsKey] as List<StactiveEvent>;
        if (list is null) throw new StactiveException("Stactive events is not a List<StactiveEvent>");
        list.Add(stactiveEvent);
    }
}
{% endhighlight %}

For now, it only contains one method `AddEvent`. It checks the `Items` dictionary if the list of my events was already created and if not, creates it. Next, it adds the event to it. 

In the ASP.NET Middleware, you need to call `await _next(context);` at some point. It will give the control over the request to next middleware in the pipeline. When all processing is done, the control comes back to your middleware and you can do some work with the `HttpContext` object:  

{% highlight csharp %}
public async Task Invoke(HttpContext context)
{
    var sw = Stopwatch.StartNew();
    // Call the next delegate/middleware in the pipeline
    await _next(context);
    sw.Stop();

    _logger.LogInformation($"Request {context.Request.Path} took {sw.ElapsedMilliseconds}ms");

    if (context.Items.ContainsKey(Stactive.StactiveEventsKey))
    {
        ProcessEvents(context);
    }
}
{% endhighlight %}

Here, I am checking if the `Items` dictionary contains my list with events and if it does, I call `ProcessEvents` method. 

{% highlight csharp %}
private void ProcessEvents(HttpContext context)
{
    var list = context.Items[Stactive.StactiveEventsKey] as List<StactiveEvent>;
    if (list == null) return;

    foreach (StactiveEvent stactiveEvent in list)
    {
        _logger.LogInformation($"Event {stactiveEvent.Id}: {stactiveEvent.Name}");
    }
} 
{% endhighlight %}

For now, it only logs a message with the event name. Later on, it will persist the events in the database. 

That's all for today. I hope, this quick post will be helpful to some of you. The code is available on the [Stactive GitHub](https://github.com/mdymel/stactive).