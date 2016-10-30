---
layout: post
title: Angular2 CLI with ASP.NET Core application - tutorial
date: '2016-10-25'
featured: /images/posts/2016-10-25-angular2-cli-with-aspnet-core-application-tutorial/featured.jpg
image: /images/posts/2016-10-25-angular2-cli-with-aspnet-core-application-tutorial/featured.jpg
tags: 
 - aspnetcore
 - angular2
 - tutorial
---
Few weeks ago I have posted a [tutorial](/2016/09/08/aspnet-core-with-angular2-tutorial/) on how to build an Angular2 application with ASP.NET Core API. Today, I would like to show you another way to accomplish that - by using **Angular2 CLI**, which has built in support for building and bundling Angular2 applications. 

1. TOC
{:toc}


# Angular2 CLI 
I have blogged about it [last week](/2016/10/20/angular2-cli/), but in short, it is a command line tool to help you work with Angular2 applications:

* initialize a new app
* generate code for new components, services etc.
* serve locally during development
* build for deployment 

Using it is much simpler, than configuring the application manually. If you are starting a new app, I **strongly recommend** using it. 

# Creating an application
I will now walk you through the process of creating an app using Visual Studio 2015. The whole code is available on [GitHub](https://github.com/mdymel/AspNetCoreAngular2Cli). Thanks to the input from [Paweł Sołtysiak](https://github.com/soltys), the project is also compatible with VS Code. 

## Backend project
Open Visual Studio and create a new ASP.NET Core project called Backend in the new solution. Name the solution with your project name. 

![backend project](/images/posts/2016-10-25-angular2-cli-with-aspnet-core-application-tutorial/create-backend.png)

## Configure MVC
Because we have created an empty project, we need to configure MVC and add support for static files. For that, you need to add these two packages to `project.json` file: 

{% highlight json %}
"Microsoft.AspNetCore.Mvc": "1.0.1",
"Microsoft.AspNetCore.StaticFiles": "1.0.0",
{% endhighlight %} 

When that's done, you can modify the Startup class: 

{% highlight csharp %}
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc();
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
        loggerFactory.AddConsole();

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

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

        app.UseMvc();
        app.UseStaticFiles();
    }
}
{% endhighlight %} 

## Frontend project
Next, add a new Class Library project in this solution. 

![backend project](/images/posts/2016-10-25-angular2-cli-with-aspnet-core-application-tutorial/create-frontend.png)

I have used the Class Library so that the frontend part is visible in the Visual Studio. 

Now, open a command prompt. If you haven't done that already, install Angular CLI with `npm install -g angular-cli`. Next, cd to the Frontend directory and run `ng init --name ProjectName`. This step will take a while. Ng will bootstrap your angular application and download all npm packages that you need. 

## Proxy to the API
Because you will use TypeScript to write the frontend part, you can't just serve these files to the browser. In the previous tutorial, I have used gulp to process all the files. Here, we will use `ng` command for it. The `ng serve` command is building the app, serves it on 4200 port and watches for changes you make in your code. When it detects modified file, it rebuilds the app and sends an event to the browser so it refreshes the window. This is great, but we also need to call our ASP API somehow. This is where the proxy configuration comes in. You need to create a file called `proxy.conf.json` in the Frontend directory: 

{% highlight json %}
{
  "/api": {
    "target": "http://localhost:65498",
    "secure": false
  }
}
{% endhighlight %} 

The target value contains a port number. If you're using Visual Studio, you can read it from Frontend project properties. 

![front project properties](/images/posts/2016-10-25-angular2-cli-with-aspnet-core-application-tutorial/proxy-conf.png)

This will pass all the API requests to the running ASP.NET Core application. 

The last thing we need to do here is to modify npm start script, so it uses the proxy configuration. Open `package.json` in the Frontend project, find the scripts section and modify start command to:  

{% highlight json %}
"start": "ng serve --proxy-config proxy.conf.json"
{% endhighlight %} 

## Build config
I mentioned above, we will use the cli to build the angular app. The CLI tool, by default, creates the files in the `dist` directory. We will change it to `wwwroot` in our backend app. For that, open `angular-cli.json` file and edit `outDir` property: 

{% highlight json %}
"outDir": "../Backend/wwwroot"
{% endhighlight %} 

# Working with your application 
Now, when everything is set up, there are few things to remember. 

## Development 
To work on the app, you need to start both, ng dev server and ASP.NET application. The first one is started with the command `npm start` executed from the Frontend directory. Backend app can be started from the Visual Studio or also command line with `dotnet watch run`. If you use the command line version, be careful about the port it uses and set it up properly in the proxy config file. The watch command in dotnet watches for changes in the application and rebuilds it whenever you change something.

You can also use ng tool to generate the angular2 files for you. Here are some useful commands. You can find all the details in the [documentation](https://github.com/angular/angular-cli) 

* ng g component my-new-component
* ng g directive my-new-directive
* ng g pipe my-new-pipe
* ng g service my-new-service
* ng g module my-module

The route command has been temporarily disabled due to the changes in the router, but it's probably coming back soon. 

## Building for deployment
To deploy the app, you need to first build the angular2 app with `ng build` command. It will transpile and bundle all needed files and copy everything, including static files, to `wwwroot` folder of the backend application. When it's done, you can use Publish option in Visual Studio to generate the whole package. 

# Summary
As you see, the process described here is very straight forward. In these few steps, what you get is an application, which is very easy to maintain and deploy. You can do it all manually, or clone my [seed repository](https://github.com/mdymel/AspNetCoreAngular2Cli), rename the project and start working on your application. 