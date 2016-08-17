---
layout: post
title: 'MiSeCo #10: Hosting environment - welcome NancyFx'
date: '2016-04-24 21:27:23 +0200'
image: /images/posts/2016-04-24-miseco-10-hosting-environment-welcome-nancyfx/featured.jpg
tags:
- .net
- dajsiepoznac
- aspnetcore
- miseco
- nancyfx
---
Since the beginning, my idea for MiSeCo was that services would automatically bind themselves to a free port on a server and register with other services of the application. To do it I need to have a possibility of assigning a port in the runtime. Unfortunately, as far as I can see, it's not possible in the ASP.NET Core. You can only customise port manually in the config file. I also couldn't find a way to read the port number from the application. It seems to me, the server running the application is on the layer above the application itself, making it impossible to read hosting information in runtime. 

In the past, I was working on a large web project utilizing NancyFx. It's a lightweight, highly configurable web framework with many hosting options. You can run it in IIS as an ASP.NET application, using Owin, WCF and... self host. In the last option you create a webserver in your application: 

{% highlight csharp %}
using (var host = new NancyHost(new Uri("http://localhost:1234")))
{
    host.Start();
    Console.WriteLine("Running on http://localhost:1234");
    Console.ReadLine();
}
{% endhighlight %}

As you can see, you can setup a host and a port to which the server should bind. It's perfect for me - I will be able to determine the port to be used during runtime, start service and register it with the registry. 

If I go with it, I have to consider if I should still base MiSeCo on ASP.NET Core... NancyFx is cross platform (thanks to mono) and will run happily in every type of project. Is there a point to depend on DNX runtime? 