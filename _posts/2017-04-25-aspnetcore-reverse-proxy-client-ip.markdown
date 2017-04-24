---
layout: post
title: 'Client IP in the ASP.NET Core behind a reverse proxy'
date: '2017-04-25'
featured: /images/posts/2017-04-25-aspnetcore-reverse-proxy-client-ip/featured.jpg
image: /images/posts/2017-04-25-aspnetcore-reverse-proxy-client-ip/social.png
tags: 
- dajsiepoznac2017
- aspnetcore
- docker
---
One of my current projects is hosted in docker environment (more on that topic coming!). The setup requires me to use an Nginx reverse proxy. Additionally, for performance reasons, I also use CloudFlare as a CDN. This all means, before the user gets to my application, he has to go through at least two proxy servers. That's an issue when you want to know your users IP address.  

# Reverse Proxy
If you never heard about a reverse proxy, I will quickly explain what it is. When you host your app in a docker container, it will probably expose some port it runs on. This will rarely be a default HTTP port number 80. You probably want to have more apps running on this server, so you don't want to block the default port. You will use 5012 for example. If you want to make the application accessible from the outside world, you need to have something listening on the port 80 and forwarding the traffic to your app. This something is called reverse proxy. 

# X-Forwarded-For
In most cases, nginx is used for that purpose. It's very small and very fast http server, which is exactly what you need. So... We have our user, who connects to Nginx, which sends the request to ASP.NET application. This means, our app won't see the users IP Address, but the one nginx is running at. 
Fortunately, there is a concept of X-Forwarded-For HTTP header, which is used to carry information about all the IP addresses on the way to your application. In the case of my application, it will contain users address and CloudFlare server address. 

# Getting users address 
There are few ways to get hold of real users address. One of them is manually parsing HTTP headers, but we don't like manual work - why should we create new code, which is likely to contain errors, when we can use code written by someone else. 
Fortunately, it turns out, there is a middleware, part of the ASP.NET Core repository called [BasicMiddleware](https://github.com/aspnet/BasicMiddleware). One of the things it does is overwriting Request fields using Forwarded headers (the same concept applies to HTTP Scheme and ports used in the request). The configuration is quite simple. All you have to do is add this to `Configure` method of your `Startup` class: 

{% highlight c# %}
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.All,
    RequireHeaderSymmetry = false,
    ForwardLimit = null,
    KnownProxies = { IPAddress.Parse("162.158.202.131"), IPAddress.Parse("10.7.0.2") },
});
{% endhighlight %}

The first address in `KnownProxies` property is the CloudFlare server, second, my reverse proxy. 

After that, you should get a real client IP in `HttpContext.Connection.RemoteIpAddress`.

# Two important things 
I spent quite some time today to figure out, why it wasn't working for me: 

 * this code has to be the first Use* in the `Configure` method
 * you need to add all proxy servers to the `KnownProxies` list - including the last one(!)
 * `ForwardLimit` is a limit of proxy servers - if set to null, it disables this check

 # Summary
 I've seen applications doing this manually. Don't go that road. This is a much better method. It also proves, there is always someone who dealt with your problem - use his work instead of implementing such things yourself. 