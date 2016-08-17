---
layout: post
title: 'MiSeCo #1: Introduction to MiSeCo'
date: '2016-03-07 18:24:05 +0100'
image: /images/posts/2016-03-07-introduction-to-miseco/featured.jpg
tags:
- dajsiepoznac
- aspnetcore
- miseco
---
MiSeCo stands for **Mi**cro**Se**rvices framework based on ASP.NET **Co**re.
As I said in my [Hello World](/2016/02/27/hello-world/) post, I came up with idea for this project while working on a solution containing lots of WCF components communicating with each other. 

> Windows Communication Foundation (**WCF**) is a framework for building service-oriented applications. Using **WCF**, you can send data as asynchronous messages from one service endpoint to another. A service endpoint can be part of a continuously available service hosted by IIS, or it can be a service hosted in an application.
> [https://msdn.microsoft.com/en-us/library/ms731082(v=vs.110).aspx](https://msdn.microsoft.com/en-us/library/ms731082(v=vs.110).aspx)

It hit me immediately, while the concept of WCF is nice, how complicated it is to create and maintain configuration of all these projects. I thought it would be really nice to have the features of WCF (at least basic) and get rid of all the configuration needs. At the same time I was also working on a new web project based on ASP.NET Core (a.k.a. vnext), so when I read about 'Daj Sie Poznac' contest, I immediately had an idea for a project. 

MiSeCo will be delivered as a single nuget package. With minimal configuration, the library will transform an ASP.NET Core based API project to a microservice. When started, it should try to automatically discover other services running on local or remote host with support of running multiple instances of the same service for scaling. It will also provide a secure way of communication between services with signed requests. 

Each service application should be split into two projects - one with interfaces (contract) and one with implementation. Contract projects will be referenced by other services and MiSeCo will provide an interface to query other components based on referenced contracts. 

That's the core concept of my project - please let me know in comments what you think about it! 


As for the plan of action, I think I will start with implementing communication channel based on contract interfaces. I will definitely keep you posted. 

You can find the MiSeCo source code on [github](https://github.com/mdymel/miseco). Go ahead and star it to get updates about new changes. 


