---
layout: post
title: Working with legacy code
date: '2016-11-15'
featured: /images/posts/2016-11-15-working-with-legacy-code/featured.jpg
image: /images/posts/2016-11-15-working-with-legacy-code/featured.jpg
tags: 
 - 
---
The biggest problems in IT, as we all know, are cache invalidation and naming things. I think, the third one is legacy code. If you're not working in a startup, which has just been founded, chances are, you need to deal with some sort of legacy application. Majority of my career as a developer was working almost 10 years in one company. It was great, but we've had to maintain an application, which was created around year 2002! That's when [Napster](https://en.wikipedia.org/wiki/Napster) was shut down! Today, this application is still running, but since a few years, it only contains some of the functionality. The rest is being handled by a new app. In this post, I would like to share some experiences, how we dealt with it. 

# Legacy code definition
If you go to wikipedia and search for [legacy code](https://en.wikipedia.org/wiki/Legacy_code), you read:

> Legacy code is source code that relates to a no-longer supported or manufactured operating system or other computer technology. 

Some people would argue with that. One of the best definitions I heard recently was that the code is legacy the moment it hits the production server. That's when you forget about it and head on to an other task. Obviously, the biggest problem is with applications written years ago, using old technologies and style which is different to what we do now. We are all learning all the time. I bet you also wonder how could you be so stupid where you were writing that app a year ago. That's normal - it's a sign of a progress we do as programmers. 

I think it's clear, there are different kinds of legacy code. We should treat these kinds differently. I will try to go through some of them here and show you my thinking on this problem. 

# Services, tools and utility apps
You probably have few of them. Someone wrote them some time ago and they do something somewhere. Noone or only few people know what these do. You might think it will be easier to start with something small. Don't. Think when was the last time you had to implement a major change in these apps. You probably don't remember. So don't bother. Leave them as they are. They are doint their job. You should focus on what's important. 

# Main application in the company 
Most software companies have this one, main application, which runs the whole shop. If the company was started years ago, chances are, its using some really old technologies. If it's really old, these technologies are not supported anymore. In my case it was an application written in Visual Basic 6. Yes, it was released in 1998. That's when movies "Armageddon" and "Saving Private Ryan" were released. 

When you're in such situations you have few choices: 

**Keep calm and carry on.**We were doing that for years. It is fine solution. The app is working, you probably have some framework which allows you to implement changes quickly. Of course there are problems when you want to use some service, which your current technology does not support. We've had such situation with Memcached. There was no driver, so we had to build it. We wanted to use MongoDb - no chance. This approach is good if you just have to maintain things you already built. If you want to do something more modern, you might run into problems. 

**Rewrite the bloody thing.** That's probably the worst decision you can make. Think about it. This application was developed for years. How can you imagine to rebuild it in few months or a year. Of course, you can do it if it's small, but that's rarely the case. Usually, these are monsters. Often without unit tests. You need to have really solid reasons to go this road. 

**Create a separate project and implement new stuff in it.** In my opinion, that is the best way to go. You keep your old app, but whenever you have something new, you do it in the new project. After some time, when the new project is stable and you know what you're doing, you can start moving things over one by one. 

# Pioneer - leader 
If you want to bring a new technology into the company, you need to have a pioneer (that might be you!). A person, who will drive this project and make sure it doesn't die. Someone who will test things and pick the best one. 

# Selecting a technology 
My opinion here is, you should pick what's the newest from the technology your company is in. In our example, we were always working with Microsoft stuff. The main app was VB6, so it was clear we will stick with .NET. We could have tried python, NodeJS or any other popular thing then, but it would make the whole thing few times harder. Unless of course, your team is familiar with other things too. If not, I would go with something everyone is familiar with. 

I also think you should go with the newest of new stuff. If you're in .NET, go with core. If you want angular, pick angular2. Don't go with somthing which will have a successor when you finish. It should also make the project more interesting for other developers. 

# Pilot project
You are moving to a new technology. You know which technology it is. Chances are you have never worked in it. You may start the work on your main project. But I think it's much better to start with some kind of pilot project. Project which you can use as a test field for the architecture, libraries. Something to get the grasp of the new thing. You will for sure make mistakes. Some decisions you will regret. It's better to do it in this pilot, so that when you start work on the main application, you know better.  

# People 
It's much better to have a team working on such project. They can discuss different approaches, validate the thinking. Saying that, it's crucial to pick certain type of people. You will need players who are enthusiastic of the new stuff, have some experience, know the old application and will search for the best solutions. Avoid developers who like the status quo and prefer calmly close tasks. 

# Practical tips
First - I said it in the beginning - don't imagine, you will rewrite everything. 

Second thing to remember is that you want to make this change for some reason. It's very easy to fall into a trap of recreating patterns and architecture from the old project. That's the worst thing you can do. If you do that, most certainly, you end up with the same thing, using newer technology. Especially in the begining, you must read a lot about application design. Maybe you should try CQRS, maybe microservices. It might be, the repository pattern will suit you best. Whatever it is, make the decision about the architecture after a lot of thinking and brainstorming. This is crucial. In most cases, you shouldn't move any code or classes from the old application. If you have to do it, think, what is the best place for it in the architecture. Don't recreate old patterns in the new app. 

Sometimes, you will have access parts of your old application. In such case, I find the best practice, to follow your new architecture and create an abstraction to get the data using some sort of an API in the old app. 

# Summary
Legacy is a big problem in IT. The world moves very fast and the code, which sits in the repository gets older everyday. Probalby in many cases, the best you can do about it is... nothing. If you have a valid reason to change something, you need to be very careful as it's easy to fall into a trap of rewriting legacy applications. 

How do you deal with legacy applications? Do you have some stories to share? 