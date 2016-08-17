---
layout: post
title: Return 401 Unauthorized from ASP.NET Core API
date: '2016-07-07 18:39:38 +0200'
image: /images/posts/2016-07-07-return-401-unauthorized-from-asp-net-core-api/featured.jpg
categories:
- Web
- ASP.NET Core
tags:
- aspnetcore
---
Another quick tip on working with ASP.NET Core API today. When you use ASP.NET Core Identity framework for user authentication, you probably use **[Authorize]** attribute in your controllers too. For those of you who don't know it, you can add it to a method in the controller if you want this method to be accessible only by users who have successfully logged in:

{% highlight csharp %}
[Authorize]
public IActionResult Index()
{
   return View();
}
{% endhighlight %}

By default, when unauthenticated user tries to access this route, ASP will redirect him to '/Account/Login', which is a default login route. You can change this route in the Startup class, in the identity options:

{% highlight csharp %}
services.AddIdentity<User, IdentityRole>(options =>
{
   options.Cookies.ApplicationCookie.LoginPath = "/login";
});
{% endhighlight %}

This is great for a routes returning views. However, Authorize attribute behaves the same way also in the API methods returning JSON responses:

{% highlight csharp %}
[Authorize]
[HttpGet]
[Route("hello")]
public string Hello()
{
   return "Hello World!";
}
{% endhighlight %}

Generally, in the API, you don't want that. What you want is to return a HTTP Status - in this case '401 Unauthorized' message.

I have found two ways to accomplish that. One is through [Middleware](https://docs.asp.net/en/latest/fundamentals/middleware.html), but I have also found another, in my opinion, nicer solution, which overrides Identity behaviour, which is exactly what we want to do here.

Identity options, apart from setting LoginPath, allows to modify few events. One of these events is called **OnRedirectToLogin**:

{% highlight csharp %}
options.Cookies.ApplicationCookie.Events = new CookieAuthenticationEvents
{
   OnRedirectToLogin = ctx =>
   {
       if (ctx.Request.Path.StartsWithSegments("/api") &&
           ctx.Response.StatusCode == (int) HttpStatusCode.OK)
       {
           ctx.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
       }
       else
       {
           ctx.Response.Redirect(ctx.RedirectUri);
       }
       return Task.FromResult(0);
   }
};
{% endhighlight %}

If you insert this code into your Startup class, Identity will redirect all normal requests to your login page, but for the API calls it will return 401 Unauthorized status code. If you use this API from JavaScript application, you could catch and handle such error, which would be much harder if the API returns redirect.

If you liked this post and are interested in ASP.NET Core, I will be posting more of such tips in future - follow me on Twitter or Facebook not to miss them!