---
layout: post
title: 'MiSeCo #5: Castle.DynamicProxy ForTheWin!'
date: '2016-03-29 08:00:27 +0200'
image: /images/posts/2016-03-29-castle-dynamicproxy-forthewin/featured.jpg
categories:
- DajSiePoznac
- MiSeCo
tags:
- dajsiepoznac
- .net
- dynamicproxy
- castle
---
In the [last post](/2016/03/25/create-interface-methods-dynamically-fail), I described how I've tried to implement a dynamic proxy functionality in MiSeCo and failed. The process of manual injection of another method into the newly created type was way too complicated to understand in the short time I could dedicate to it. I needed to proceed with other tasks in the project. Fortunately, I have received a few valuable comments on [reddit.com](http://reddit.com), which suggested to use the [Castle.DynamicProxy](http://www.castleproject.org/projects/dynamicproxy) library, which does the same thing I was trying to accomplish.

DynamicProxy is being used in many other popular frameworks, like NHibernate (for lazy loading) or Moq and Rhino Mocks (for... mocking). They also provide a very cool explanation of what a proxy is, which I would like to quote here:

> One way of thinking about proxies, is by the analogy to The Matrix.
> I assume there's no one on the planet who hasn't seen the movie and can be spoiled here, by the details of the plot. Anyway, people in the matrix aren't the actual people ('The spoon does not exist', remember?) They're proxies to the actual people that can be... wherever. They look like ones, they behave like ones, but at the same time, they are not them actually. Another implication is the fact that different rules apply to proxies. Proxies can be what the proxied objects are, but they can be more (flying, running away from bullets, that kind of stuff). Hopefully you get the point, before I take that analogy too far. One more important thing, is that proxies ultimately delegate the behavior to the actual objects behind them (kind of like - 'if you're killed in the matrix, you die in the real life as well').
> [https://github.com/castleproject/Core/blob/master/docs/dynamicproxy-introduction.md](https://github.com/castleproject/Core/blob/master/docs/dynamicproxy-introduction.md)

With this library you are able to create a few kinds of proxy objects. For example, you can have a class which intercepts the call, does something with it (i.e. logs information about a call) and invokes the original implementation. There is also another type of proxy - the one without a real implementation behind it. In such cases you have an interface you want to implement and the proxy does all you need. The latter one is what I need in MiSeCo. I want to get information about the call to my interface.


If you read the [last post](/2016/03/25/create-interface-methods-dynamically-fail), you probably remember the loooong code listing working on IL and setting up a newly created method. As I said it was too much for me at the moment and I gave up on it. Now, I would like to show you the code, which does the same thing using the Castle.DynamicProxy.

# MethodInterceptor
This class will intercept the calls to a service interface.

{% highlight csharp %}
internal class MethodInterceptor : IInterceptor
{
    public void Intercept(IInvocation invocation)
    {
        Console.WriteLine($"New call: {invocation.Method.Name}");
        Type returnType = invocation.Method.ReturnType;
        invocation.ReturnValue = returnType.IsValueType
            ? Activator.CreateInstance(returnType)
            : null;
    }
}
{% endhighlight %}

For now it is only writing the invoked method name to the console and returning a default value based on the return type of the invoked method. Later it will contain code sending an http request to the service and getting results.

# CreateServiceObject
Next, we will create an object with our MethodInterceptor handling all the calls.

{% highlight csharp %}
public T CreateServiceObject<T>() where T:IContractInterface
{
    var generator = new ProxyGenerator();
    var proxy = generator.CreateInterfaceProxyWithoutTarget(typeof(T), new MethodInterceptor());
    return (T)proxy;
}
{% endhighlight %}

As you can see it's really simple. One call to ProxyGenerator and our object is created.

# Testing time!
Now it's time to test it! I have created a simple interface containing two methods - one returning an _int_ (value type) and the other a _string_. The interceptor should return 0 and null.

{% highlight csharp %}
public interface IFirstDynamicInterface
{
    int Add(int a, int b);
    string GetString();
}
{% endhighlight %}

And a console application is running everything.

{% highlight csharp %}
public static void Main(string[] args)
{
    var miseco = new MiSeCo();
    var service1 = miseco.CreateServiceObject<IFirstDynamicInterface>();
    int c = service1.Add(2, 2);
    Console.WriteLine(c);
    string s = service1.GetString();
    Console.WriteLine($"s is null: {s == null}");
}
{% endhighlight %}

It creates a service object based on my test interface, invokes both methods and prints out the results:

{% highlight csharp %}
New call: Add
0
New call: GetString
s is null: True
{% endhighlight %}

It works! :)
As you can see it was really easy. From one side it's a shame I didn't implement it myself, but from the other, it was far more complicated than I initially anticipated and it would probably take a really long time to do it properly. Here I have a working solution, which took something like a dozen lines of code and I am pretty sure it has less bugs than anything I would be able to come up with. It just shows you, sometimes it's better to take a step back and try something different before you spend days on something which can take away your whole motivation.

# Next...
Now, when I know how to do proxy classes, I will have to think how to design an API for services so that I can invoke a service classes remotely. 
