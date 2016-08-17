---
layout: post
title: 'MiSeCo #12: Find free TCP port in the system'
date: '2016-05-05 08:00:31 +0200'
image: /images/posts/2016-05-05-find-free-tcp-port-system/featured.jpg
tags:
- .net
- dajsiepoznac
- miseco
---
In the previous post, I wrote about my research on how to find a free TCP port in the system, which you can use to bind your application to. What I wanted to do was to randomize port from a dynamic port range (49152-65535) and check if it is open.
Fortunately, I added this post to reddit and got a comment saying it's a stupid idea. Well... it was :)
There is a much easier way - I can use the system to do this for me!
What you need is such method: 

{% highlight csharp %}
static int FreeTcpPort()
{
    TcpListener l = new TcpListener(IPAddress.Loopback, 0);
    l.Start();
    int port = ((IPEndPoint)l.LocalEndpoint).Port;
    l.Stop();
    return port;
}
{% endhighlight %}

As you can see it starts a TcpListener on an IP address (here it's a loopback interface, meaning localhost). The second parameter in the constructor is a port number. Zero means it will assign next free port - exactly what I need. Next step is to read the port number, stop the listener and return the port. Because the listener was stopped, I can bind to this port straight away. Bingo! 

It just shows you how good it is to question whatever you find in programming blogs and why it's good to share your thoughts with others - someone may show you a better way :) 