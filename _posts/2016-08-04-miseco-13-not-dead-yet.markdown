---
layout: post
title: 'MiSeCo #13: It''s not dead yet'
date: '2016-08-04 23:11:23 +0200'
image: /images/posts/2016-08-04-miseco-13-not-dead-yet/featured.jpg
tags:
- miseco
---
For those of you who don't know, [MiSeCo](https://github.com/mdymel/miseco) is a little project I started for a blogging challenge back in March. It's an idea that came to me when I had to deal with WCF services. It struck me how not dev-friendly this technology is and I thought I would be cool to come up with something nicer. I wanted to create a .NET Core framework you would add to your class library as a nuget package and it would transform it to a microservice able to communicate with other services using this framework. And it would all happen without or with minimal configuration needed. You can read more about it in the [MiSeCo](/category/miseco/) category.

Everything was going well until I came to a point when I needed to bind the service to a free port. I didn't want the port number to be configured - it was meant to find free port, bind to it and let other services know where to find it. Unfortunately, back then, ASP.NET Core framework was at the RC2 stage and it wasn't possible to select the port programatically. Suddenly, my motivation fall through roof. Then I had the idea to switch to Nancy instead of ASP.NET Core and even started to do it, but never finished. It was really a shame, because I even managed to get two services talking to each other through proxy classes using http connection underneath.

It looks like the last time I did something in this project was in May. Through those nearly 3 months, I was thinking what to do with it. I still think it's a nice idea. Even if no one ever uses it, I learned a lot from doing it and I would learn even more if I continued. Now, I finally know what I am going to do. I am going to start over with a new solution, which will be using NancyFx and no Core stuff for now. I want to practice doing TDD in this and it will be easier with NCrunch, which doesn't support .NET Core yet. I also don't think using .NET Core is a good idea yet - there are too many problems and missing libraries. I will do it in full .NET and I can always migrate it back to .NET Core when it's (or I am) ready.

So, as the title said, it's not dead yet :) If you're interested in it, you can either follow my [twitter](https://twitter.com/mdymel), [facebook](https://www.facebook.com/dymeldevblog/), or MiSeCo project on [github](https://github.com/mdymel/miseco).