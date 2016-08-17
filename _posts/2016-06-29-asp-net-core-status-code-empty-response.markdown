---
layout: post
title: Status Code with empty response in ASP.NET Core
date: '2016-06-29 18:32:53 +0200'
image: /images/posts/2016-06-29-asp-net-core-status-code-empty-response/featured.jpg
categories:
- Web
- ASP.NET Core
tags:
- aspnetcore
---
If you create JSON APIs, you know that sometimes it is useful to return **empty response** with just **status code** set. For example when user calls the API to get a document with id 123 and he doesn't have the rights to this particular document, it is a good practice to return with a status '403 Forbidden'. When you do that, you don't need to add anything to the response - status code is just enough.

My previous project was build with [NancyFx](https://github.com/NancyFx/Nancy/wiki), which makes it trivial:

{% highlight csharp %}
Get["/products/{id}"] = parameters =>;
{
    Product item = repository.Get(parameters.id);
    if (item == null)
    {
        return HttpStatusCode.NotFound;
    }
    return item;
};
{% endhighlight %}

In the ASP.NET 4.6 you had an option to throw a special exception which had a field for response status code:

{% highlight csharp %}
public Product GetProduct(int id)
{
    Product item = repository.Get(id);
    if (item == null)
    {
        throw new HttpResponseException(HttpStatusCode.NotFound);
    }
    return item;
}
{% endhighlight %}

Right now I am working on an API built with the new ASP.NET Core and I wanted to do the same. It quickly turned out there is no _HttpResponseException_ class there anymore. There were basically two simple options:

1. Change controller method signature to return **_IActionResult_ **and return **_StatusCode(403)_** - I didn't like it as I want to have proper type returned from my controller methods</li>
1. Set the **_Response.StatusCode_** manually and **_return null_** (or 0 if the method returns int) - also didn't like it as you can't easily unit test it.</li>

After some googling and searching on StackOverflow, I found a nice solution for this problem - to create a **new type of exception: _HttpStatusCodeException_**, containing a field for the status code and a **middleware**, which will catch these exceptions and reformat the response to just contain the status code.

This is the code for both things:

{% highlight csharp %}
public class ErrorHandlerMiddleware
{
    public class HttpStatusCodeException : Exception
    {
        public HttpStatusCode StatusCode { get; set; }

        public HttpStatusCodeException(HttpStatusCode statusCode)
        {
            StatusCode = statusCode;
        }
    }

    private readonly RequestDelegate _next;

    public ErrorHandlerMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (HttpStatusCodeException exception)
        {
            context.Response.StatusCode = (int) exception.StatusCode;
            context.Response.Headers.Clear();
        }
    }
}
{% endhighlight %}

As you can see, the _HttpStatusCodeException_ takes standard _HttpStatusCode_ as a constructor parameter and then it is read and returned by the middleware in the catch statement.

I like this solution because it's very simple and elegant. I don't return any content (even null) from the API methods and have proper type checking in the controller methods.

