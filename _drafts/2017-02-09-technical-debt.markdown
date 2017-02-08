---
layout: post
title: On technical debt
date: '2017-02-09'
featured: /images/posts/2017-02-09-technical-debt/featured.jpg
image: /images/posts/2017-02-09-technical-debt/featured.jpg
tags: 

---
Technical debt is inherent part of IT. If you're working on software, you probably incured it few times. Consiously or not. Sometimes it is worth to accept it, but only if you know exactly why you took it, how much is it and when or if you're going to pay it up. And most importantly, if you agreed it with business. There has been many articles written about this topic, but most of them talk about from a business perspective. Today, I would like to share few thoughts from a developers side.   

1. TOC
{:toc}

# What technical debt is? 

> A concept in programming that reflects the extra development work that arises when code that is easy to implement in the short run is used instead of applying the best overall solution
>
> -- <cite>Wikipedia</cite>

![dilbert](https://pbs.twimg.com/media/C4EebBEXAAAd-mz.jpg:large)
<cite>[http://dilbert.com/strip/2017-01-03](http://dilbert.com/strip/2017-01-03)</cite>

Technical debt is an analogy created by Ward Cunningham. According to the author, it's something you get, when you delay design decisions for later, when you'll have better information. It means, that to be speaking about the technical debt, you need to make a consious decision and have to know precisely, how and when you're going to refactor things. 

In simpler words, when you're working on a piece of software and knowingly do not take the best approach, meaning, you cut corners, you incur a debt. This debt will have to be paid up in future. 

This situation can be easily compared to the financial debt. When you want to buy a car, but don't have the full ammount, you have two choices. You can either continue saving money, what, let's say, will take you additional year, or borrow money from the bank. You can buy this car now, but you'll have a debt to pay off. In IT, instead of money you borrow time. Time, which is needed to implement changes you're working on with the best possible quality. 

# Bad code is not a technical debt
Technical debt is a way to make a design trade-off decisions. Decisions you can manage. **Writing bad code is not a technical debt**.  

## We'll improve it later
One of my 'favourite' examples is in a Scrum Team. Imagine you're part of Scrum team, which is finishing a sprint. There were 5 tasks planned to be done in this sprint, but the team realizes, they won't be able to close one of them. They decide to ignore a bug, or make a quick & dirty implementation of something, which will work fine in dev & test environments, but will definitely fail when released to production. Maybe not right away, but it will. The team ignores the problem saying they will fix it later. 

They incured a debt and will have to pay it up later. Now the problem is, after this iteration, there is another one coming, with its own tasks. They simply won't have time to improve the code from previous iteration. It gets worse if they incur another debt in the new iteration aswell. 

In effect, the team borrows time, but has no plan, when they're going to repay it. It's a very shortsighted move. They can say to the product owner, they have implemented all features, but in reality they have not. If, by the time, the software is released to production, someone remembers all the issues they have left in the code, they will have to somehow fix them. If not, someone will release it live. 

When such product is released, effects of decisions made during development may not be visible straight away. In some time, when the traffic grows, peformance issues may arrise. Implementing new features will take more and more time, because base of the system wasn't designed properly. It may become aparent, system not scalable, bugs are harder and harder to fix. 

In such situation, the team decided to incur a debt, but had no actual plan to pay it up. 

## Let's hack it quickly 
Another way teams and companies take a technical debt is, when they want to build something in less time than they should. In some situations it is reasonable (more on that later), but what it usually means is following such scenario. You have a product to build. You can make it with the good code quality, following principles, writing unit tests etc. Instead, very often, people decide to hack it quickly. When taking the decision they lure themselves saying they will rewrite it later, when it succedes, but in reality, if the project becomes a success they never have time to do that. They will need to implement new features instead. As a result, they're building company core application on very weak foundations. When they realize that (for example when they have problems with scaling), they already have a big application, which will take a lot of time to rewrite. That's when they start to have a problem with [legacy code](/2016/11/15/what-to-do-with-a-legacy-application/)... 

## We need it faster - skip the tests 
When the business presses to get the software done faster, they often suggest to skip writing tests. This seems to speed the process up in the beginning, but... as with the most things, catches you later. If you don't test your code, you have no assurance later, when you make changes or refactoring. Having a test suit is like an insurance policy. It prevents you from re-introducing bugs you already fixed, or creating new ones when you implement new features. It saves you time later, when you need to introduce a change. 

# How to avoid it? 
Here are few points to keep in mind: 

1. Think before you start coding. Create best quality code you can. 
1. Follow the coding standards
1. Automate tests 
1. Make reviews - discuss your architecture, design, tests, code - everything. It's the easiest way to spot weak points.  
1. Fix bugs before implementing new features 
1. Avoid "quick & dirty". The quote was "Move fast and break things" - there was no "dirty" there! 

If you need to finish something faster and don't have time to create fully fledged product. Think, how you can do it in a way, which will allow you to easily extend the product in future, but at the same time, will not limit functionalities for the user.  

# When is it acceptable? 
Sometimes you are in a situation, when you want or need to ship something sooner. In such scenario, it's ok to take a consious decision to cut some corners. Make a simpler implementation, which for example won't scale so well. You do it for example to test the product idea. But you know, that when the idea proves itself, you might need to throw what you have away and build fully fledged thing from scratch. 

# It's a business decision
As a developer, it's not your decision to make things not to a highest standards. Your job is to always strive to the best quality. If someone from the business side asks you, if you can do it faster, you have to inform them about consequences. It's ok to make things simpler, but only if both parties agree on the approach you're going to take. It has to be clear, what will the maintanance cost in feature. 

# Summary
