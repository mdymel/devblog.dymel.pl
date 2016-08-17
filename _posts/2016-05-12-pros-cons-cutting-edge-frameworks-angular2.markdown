---
layout: post
title: Pros and cons of cutting edge frameworks - Angular2
date: '2016-05-12 08:09:11 +0200'
image: /images/posts/2016-05-12-pros-cons-cutting-edge-frameworks-angular2/featured.jpg
categories:
- DajSiePoznac
- Angular2
tags:
- dajsiepoznac
- angular2
---
In my [previous post](2016/05/10/pros-cons-cutting-edge-frameworks-asp-net-core), I wrote about my experience working on a project based on ASP.NET Core RC1. A framework which has not been released fully yet. Today I would like to give you a comparison to the work with another popular framework in beta (now also Release Candidate) stage - Angular2.

I am using it in the same project where I use ASP.NET Core, so I spent exactly&nbsp;the same amount of time with both of them. The last post was split into 3 sections - the good, the bad and the ugly. Here, I will go with a different format and make a comparison between these two frameworks.

# Overall experience
Both, Angular2 and ASP.NET Core have been changed significantly compared to their previous versions. There was huge noise raised by developers around the world when Angular team announced last year, they're going to completely rewrite Angular. I was working with version one at [wayn.com](http://www.wayn.com) before and can tell for sure, the new version is a huge improvement. It's much easier to structure your applications. Building components just feels natural. Also, TypeScript improves things a lot, but that was just my choice to go with it. You can write Angular2 applications with JS and even Dart.

# Documentation
Here, both projects lack in the same way. There are missing parts in docs of angular and you mostly have to rely on a 'Quickstart' tutorial and third party articles. Fortunately, it seems Angular2 is more popular amongst developers than the new ASP, so there is rarely a problem with finding information.

# Breaking changes
I have to say I didn't have many issues with changes during these few months of work. Also, most of the examples found online work across different versions. The only upgrade which required more work was a first Release Candidate version a week ago, where they changed packages structure. It took something like an hour to fix it.

# Tools
With the Asp there is a problem with tools - the biggest players haven't brought tools for the new platform yet. It's different with the Angular. There are few editors with very nice angular2 support (WebStorm, VS Code). I strongly recommend WebStorm - it does help a lot.

# Bug fixes
Latest asp.net core version - RC1 - was released in... November. Since then there were 10 alfa, 17 beta and 2 RC versions of Angular2. In this case, bugs are fixed and you get new version roughly every two weeks. It makes so much difference when you see things improve.

# Summary
When I was starting to work on this new project back in January, I was aware there are going to be issues. That some things will require more digging and debugging than in previous versions of frameworks. But I always liked to update early. Given the release date was a year ahead and I was pretty sure, by that time, both ASP and Angular are going to be fully released, I couldn't resist from working with the new stuff. Would I do it again now, after four months? Definitely! Even though sometimes I was stuck with a problem I couldn't fix, I still think it's better than to write a project with technologies which are going to be out-dated when your product go live. I highly recommend - if you can - work on new versions. You will learn more, you will go out of your comfort zone and by the time the release is ready, you will already be proficient with the new technology - that will never hurt :)

