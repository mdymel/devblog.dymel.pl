---
layout: post
title: 'Configuring ASP.NET Core middleware'
date: '2017-04-20'
featured: /images/posts/2017-04-20-configuring-asp-net-core-middleware/featured.jpg
image: /images/posts/2017-04-20-configuring-asp-net-core-middleware/social.png
tags: 
- dajsiepoznac2017
- aspnetcore
- stactive
---
In the last few posts I have been writing about ASP.NET Core middlewares. You have seen how to [create one](/2017/03/20/asp-net-core-pipelines/), [pass data from request](/2017/03/28/passing-data-through-asp-net-core-pipelines/) and [setup dependency injection](/2017/04/18/dependency-injection-in-asp-net-core-middlewares/). Today I would like to show you, how you can build a configuration for the middleware and set it up from the Startup class. 

# Implementation

In the [Stactive](/tags/#stactive) project, I want to be able to decide which modules should be used, or where the data should be stored. The best place for such setup is the `ConfigureServices` method of the `Startup` class. That's how it's done for EntityFramework and IdentityFramework: 

{% highlight c# %}
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();
{% endhighlight %}

As you can see, they use two methods. EntityFramework is using an options builder - you get an `options` object and set it up to your needs. IdentityFramework uses few extension methods on the `services` object to setup various options. I prefer the first solution - I think it's cleaner and would like to use in Stactive project. 

First, we need to create a `StactiveOptions` class, which will contain all the settings. For the first implementation, I have just added a `bool` field `UseMongoDb`: 

{% highlight c# %}
public class StactiveOptions
{
    internal bool UseMongoDb { get; set; }
}
{% endhighlight %}

Next, we need a static field in the Stactive object - a place where we will keep our configuration: 

{% highlight c# %}
internal static StactiveOptions Options { get; } = new StactiveOptions();
{% endhighlight %}

As you see it's marked as internal, so that it's available for other components of the library and is initialized with an empty object. 

Now, we need an options builder class: 

{% highlight c# %}
public static class StactiveOptionsBuilder
{
    public static StactiveOptions UseMongoDb(this StactiveOptions options)
    {
        options.UseMongoDb = true;
        return options;
    }
}
{% endhighlight %}

For now, it contains one extension method, which just sets the bool field to true. Later on, it should take a connection string to the database and write it down. 

At this point we have everything we need to configure Stactive from the Startup class: 

{% highlight c# %}
services.AddStactive(options => options.UseMongoDb());
{% endhighlight %}

# Summary
I hope you will find this short post useful. It's a quick and dirty implementation, but does the job and can be improved later. If you have a better way to setup middlewares, please share in comments. Whole commit for this change is available on [GitHub](https://github.com/mdymel/stactive/commit/7b8dc05a91debeb06390e75fa59e0ad3f399a31c).