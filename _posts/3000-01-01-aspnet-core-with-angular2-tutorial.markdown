---
layout: post
title: AspNet Core with Angular2 - tutorial
date: '3000-01-01'
tags: 
 - aspnetcore
 - angular2
 - tutorial
---
In this post, I would like to show you, how to set up an application using ASP.NET Core as an API for Angular2 frontend. To get some nice styles, I will use Twitter Bootstrap v4. 
The whole project, which you can use as a template, can be found on GITHUB. 

I will start with preparing our backend service. For that, open up a Visual Studio and create an empty ASP.NET Core web project. After that, you should have a simple app ready to print “Hello World”. Let’s modify it to suit our needs. 

Since we want to use MVC for the API, you need to add following package as a dependency in project.json file:

{% highlight conf %}
"Microsoft.AspNetCore.Mvc": "1.0.0"
{% endhighlight %}

Now, we can modify the Startup class, to tell asp.net to use MVC: 

{% highlight csharp %}
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc()
            .AddMvcOptions(options =>
            {
                options.CacheProfiles.Add("NoCache", new CacheProfile
                {
                    NoStore = true,
                    Duration = 0
                });
            });
    }
    
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
        loggerFactory.AddConsole();

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseMvcWithDefaultRoute();
    }
}
{% endhighlight %}


As you can see, I’ve added MVC setup in two places. First one is adding MVC services and second is running them. I have also added NoCache headers to everything which will be run by MVC. This way I am preventing caching of API calls. 

Now, let’s add an index.html file, which will host Angular2 app. It’s easily done by this piece of code added to Configure method of Startup class: 

{% highlight csharp %}
app.Use(async (context, next) =>
{
    await next();

    if (context.Response.StatusCode == 404 &&
        !Path.HasExtension(context.Request.Path.Value) &&
        !context.Request.Path.Value.StartsWith("/api/"))
    {
        context.Request.Path = "/index.html"; 
        await next();
    }
});
{% endhighlight %}

What it does is, if MVC returns 404 response and the request path does not have an extension (like html, jpg etc.), it will return the index.html file. It’s like a catch all, so whenever some will browse to urls like: 

* /home
* /product/123
* /contact

It will serve this index file and angular app will pick up from there. 

At this point, we have our backend part ready. Let’s setup frontend. First, we need to get all the packages Angular2 needs from npm. For this, you need to add a package.json file with such dependencies: 

{% highlight conf %}
"@angular/common": "2.0.0-rc.5",
"@angular/compiler": "2.0.0-rc.5",
"@angular/core": "2.0.0-rc.5",
"@angular/http": "2.0.0-rc.5",
"@angular/platform-browser": "2.0.0-rc.5",
"@angular/platform-browser-dynamic": "2.0.0-rc.5",
"@angular/router": "3.0.0-rc.1",
"core-js": "^2.4.0",
"reflect-metadata": "^0.1.3",
"rxjs": "5.0.0-beta.6",
"systemjs": "0.19.27",
"zone.js": "^0.6.12"
{% endhighlight %}

If there is a new angular version released, you can always get current package versions here: [https://angular.io/docs/ts/latest/quickstart.html](https://angular.io/docs/ts/latest/quickstart.html)


