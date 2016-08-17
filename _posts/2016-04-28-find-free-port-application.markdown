---
layout: post
title: 'MiSeCo #11: Find free port for your application'
date: '2016-04-28 07:50:37 +0200'
image: /images/posts/2016-04-28-find-free-port-application/featured.jpg
tags:
- dajsiepoznac
- miseco
- .net
---
When you want to host your service or application on a dynamically chosen port, you have to consider two things at the beginning:

* Which port range to use
* Find the port which is open 

# Port range for internal applications
There is an organization responsible for the global coordination of the DNS Root, IP addressing and other Internet protocol resources - including port numbers. Its name is [IANA](http://www.iana.org/). On their website you can find a [list of all registered protocol port numbers](http://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xml). What you can see there is that port numbers are divided into 3 ranges:

* System Ports (0-1023),
* User Ports (1024-49151),
* Dynamic and/or Private Ports (49152-65535)

Based on that, it's clear, you should be using the last range for you applications.
Since it's really a lot of ports, I think I will simply randomize the number and check if it's open. In normal situations this should be a safe way to get a free port to bind my service to.

# Checking if port is available
To check if port number is available on your server, you need to list all opened ports and check if yours is not there. I've found a nice function doing that on StackOverflow: 

{% highlight csharp %}
private bool CheckAvailableServerPort(int port)
{
    bool isAvailable = true;

    IPGlobalProperties ipGlobalProperties = IPGlobalProperties.GetIPGlobalProperties();
    IPEndPoint[] tcpConnInfoArray = ipGlobalProperties.GetActiveTcpListeners();

    foreach (IPEndPoint endpoint in tcpConnInfoArray)
    {
        if (endpoint.Port == port)
        {
            isAvailable = false;
            break;
        }
    }
    return isAvailable;
}
{% endhighlight %}

# Binding
Using this function I will be able to check if I can try to bind to randomly selected port number from private range. One thing to remember is to implement error handling - theoretically race condition is possible here. Some other application could have selected the same number and be faster in binding to it:

{% highlight csharp %}
var i = 0;
while (true)
{
    var port = RandomizePortNumber();
    if (CheckAvailableServerPort(port) && TryBindToPort(port)) break;
    if (i++>100) throw new Exception("I checked 100 ports and cound't bind");
}
{% endhighlight %}

# Summary
With this knowledge I should be able to setup hosting of MiSeCo serwices. 