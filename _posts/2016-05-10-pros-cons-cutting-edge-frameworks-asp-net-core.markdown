---
layout: post
title: Pros and cons of cutting edge frameworks - ASP.NET Core
date: '2016-05-10 08:00:18 +0200'
image: /images/posts/2016-05-10-pros-cons-cutting-edge-frameworks-asp-net-core/featured.jpg
tags:
- .net
- dajsiepoznac
- aspnetcore
---
Since January, I am working for a client on a project, which is built with ASP.NET Core and Angular2. If you followed this blog, you know I am also working on my pet project that is to create a microservices framework MiSeCo - based on ASP.NET Core. I thought it would be a good idea to share my experience of working with frameworks which have not been released yet :)

# Why I have chosen beta (or RC) frameworks
When we were discussing the new project with a&nbsp;client, ASP.NET Core was in RC1 state with RC2 planned for February. Angular2 was in beta. The project development was planned to last a year with a release in January 2017. The customer required that the project was written in ASP and Angular. Given the release time, everyone agreed it didn't make sense to start in technologies that are planned to be replaced by the time the project goes live.

When it comes to MiSeCo, I think it's clear. Who would take on a pet project and do it in soon-to-be-legacy technology? ;) Here the choice was clear - ASP.NET Core again!

Since the experience with both of them was completely different, I think it makes sense to write about each separately.

# ASP.NET Core RC1
When I started to work on it, its current status was Release Candidate 1 with an RC2 planned next month. 4 months later, we're still on RC1, but it seems **RC2 is coming in a week or two**. During that time, there were no releases with bug fixes. It's partly because guys at Microsoft decided to change command line tooling, which is quite a big task if you consider the size of the framework.

# The good
I was working only with the API part of the MVC framework and it's much better than its predecessor. The biggest advantage is the fact it's **modular**. You can add and remove features as you need them by managing **NuGet packages**. It's also much **easier** and straightforward to **set up**. I hated the way it was done in the 'old' asp - with the gobal.asax here, routes there... All of it is gone. You've got one class called Startup and you set everything up there. Another, very nice thing is the fact, **WebApi is now part of the MVC**, so you can have class UserController, which will return a view, but also provide a JSON API. I know there are many improvements to **view processing** too, but I can't comment on that. Oh! And one more thing. It's cross-platform! :) And open source.

# The bad
One of the biggest issues are **gaps in the documentation**. If you go to [http://docs.asp.net](http://docs.asp.net) and see the list of topics, there are lot of wrench icons. This icon means, there is no text on this subject yet. Fortunately for me, most of the things for creating and API are covered, but when you're building an MVC app, you might have problems. The solution for this, as always, is StackOverflow, but there you hit another problem. **Naming**... This framework was called vNext, ASP.NET 5 and now it's ASP.NET Core. This doesn't help searching. Next problem - **changes**. Even if you find a solution to your problem, it could have been written for a previous version and might not work in the current one. Thanks to open source nature of it, there is also support available on **github**. But you get same problems there (apart from searching).

Another thing is **lack of support in the tooling**. You can forget about NCrunch or R# Test Runner. Both companies say they will get to it when it gets more stable. Maybe with RC2...

# The ugly
As with every Beta or RC version, you get some bugs and errors. That's completely normal and you have to remember about it when you start working with such thing. But! It's usually the case (look at angular2) you get **bug fixing releases** every now and then. The RC1 version was released in November 2015. Now, mid-May 2016, we should get an RC2. That's **half a year with no fixes**. That would still be acceptable if there wouldn't be any serious issues. And I have to admit there are not so many. But, for example, in my work-project I have some 'old style' Class Library projects. And Visual Studio has **problems with adding a reference** to a class library from the ASP.NET Core project. You have to manually add a dll from the obj folder, which is then not automatically compiled when you make changes and build your website... Annoying, but should be fixed in RC2 hopefully :)

# Summary
All in all, I am happy I took this path. It's always nice to work on something new, even though you get some problems from time to time. If you want to do the same, you have to remember it's going to be **frustrating sometimes** and will definitely take **more time** in the beginning as you have to get used to new things. But, when it's released, you should be already fluent with it, which can make you more **interesting on a job market** :)

In few days, I am going to post about my experience with **Angular2**. Follow my twitter or facebook page if you don't want to miss it!