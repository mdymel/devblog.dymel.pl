---
layout: post
title: 'MiSeCo #7: Communication'
date: '2016-04-14 10:45:22 +0200'
image: /images/posts/2016-04-14-miseco-7-communication/featured.jpg
tags:
- dajsiepoznac
- aspnetcore
- miseco
- .net
---
Last week, I created an API, which has been able to find and invoke a method in a service. The API was getting all service classes by dependency injection supported by an Autofac container. The next step was to connect the dots and implement a way to invoke a remote service method by using the MiSeCo class.  

# Communication 
Just to remind you, how it's going to work, I will give an example. I have created a simple service called Service1, which implements an interface IService1: 

{% highlight csharp %}
public interface IService1 : IContractInterface
{
    int Add(int a, int b);
}
{% endhighlight %}

As you have probably already correctly guessed, the only method here is adding two integers (without worrying about adding two big integers and overflowing the int type ;)). This interface is implemented in a class library project called Service1, which is referencing MiSeCo. MiSeCo contains a WebApi controller inside and everything that's needed to host a web service. 

On the other end, we have a simple console application, which is referencing Service1.Contract (containing just the IService1 interface) and MiSeCo. The difference is, that here MiSeCo will just provide a method to find and invoke Service1 methods over an HTTP API.
![miseco](/images/posts/2016-04-14-miseco-7-communication/miseco.png)

To summarize: 

* The application doesn't know about the Service1 implementation - it only references its interface
* Service1 has no idea about the Application 

# API Model
To communicate, I had to create an API model: 

{% highlight csharp %}
public class InvocationApiModel
{
    public string ServiceName { get; set; }
    public string MethodName { get; set; }
    public object[] Parameters { get; set; }
}
{% endhighlight %}

It contains everything that's needed to find and invoke a method. 

# Application
When the application needs to call a service it asks the MiSeCo class for an interface implementation: 

{% highlight csharp %}
public class Program
{
    public static void Main(string[] args)
    {
        var miseco = new MiSeCo();
        var service1 = miseco.CreateServiceObject<iservice1>();
        int c = service1.Add(2, 2);
        Console.WriteLine(c);
    }
}
{% endhighlight %}

Then it can just call the method as if it was a real service implementation. 

# MiSeCo
What's happening behind the scenes is that MiSeCo is creating a dynamic proxy object with a method interceptor: 

{% highlight csharp %}
public void Intercept(IInvocation invocation)
{
    if (invocation.Method.ReflectedType == null) throw new Exception("Unknown service type");
    var model = new InvocationApiModel
    {
        ServiceName = invocation.Method.ReflectedType.Name,
        MethodName = invocation.Method.Name,
        Parameters = invocation.Arguments
    };

    using (var client = new HttpClient())
    {
        client.BaseAddress = new Uri("http://localhost:5000/");
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        HttpResponseMessage response = client.PostAsJsonAsync("invokeMethod", model)
            .ConfigureAwait(false)
            .GetAwaiter()
            .GetResult();

        if (!response.IsSuccessStatusCode) return;

        string result = response.Content.ReadAsStringAsync()
            .ConfigureAwait(false)
            .GetAwaiter()
            .GetResult();
        object returnValue = JsonConvert.DeserializeObject(result, invocation.Method.ReturnType);
        invocation.ReturnValue = returnValue;
    }
}
{% endhighlight %}

When a call comes in, it's getting the name of the service, its method and its parameters, and creates a model. This model is then sent to the API (service URL is hard-coded for now, support for many services is coming later). The API should return the result, which is converted to a return type and set as a return value of the method.

# Service WebApi
The MiSeCo WebAPI finds a service implementation and the requested method, then it simply sets all the parameters, invokes it and returns the result as a JSON response. 

{% highlight csharp %}
[HttpPost]
[Route("invokeMethod")]
public object Services([FromBody] InvocationApiModel model)
{
    IContractInterface service = _services.FirstOrDefault(s => s.GetType().GetInterfaces().Any(i => i.Name == model.ServiceName));
    if (service == null) throw new Exception($"Service {model.ServiceName} could not be found");

    MethodInfo methodInfo = service.GetType().GetMethods().First(m => m.Name == model.MethodName);
    if (methodInfo == null) throw new Exception($"Method {model.MethodName} not found in service {model.ServiceName}");

    var methodParameters = methodInfo.GetParameters();
    if (methodParameters.Length == 0) methodInfo.Invoke(service, null);

    if (methodParameters.Length != model.Parameters.Length) throw new Exception($"Wrong number of parameters for method {model.ServiceName}.{model.MethodName}");
    var parameters = new List<object>();
    for (int i = 0; i < methodParameters.Length; i++)
    {
        object value = Convert.ChangeType(model.Parameters[i], methodParameters[i].ParameterType);
        parameters.Add(value);
    }

    return methodInfo.Invoke(service, parameters.ToArray());
}
{% endhighlight %}

# Testing time!
I have started the service in one console, application in an other and it all worked!
![miseco testing](/images/posts/2016-04-14-miseco-7-communication/testing.png)

Next, I need to find a way to autodiscover running services. It will be a hard nut to crack. 

All the code for MiSeCo is available on Github: [https://github.com/mdymel/miseco](https://github.com/mdymel/miseco)

