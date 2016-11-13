---
layout: post
title: What to do with a legacy application
date: '2016-11-15'
featured: /images/posts/2016-11-15-what-to-do-with-a-legacy-application/featured.jpg
image: /images/posts/2016-11-15-what-to-do-with-a-legacy-application/featured.jpg
tags: 
 - 
---
The two, biggest problems in IT are cache invalidation and naming things. The third one, I think, is legacy code. If you're not working in a startup, which has just been founded, chances are, you need to deal with some sort of legacy application. For a majority of my career as a developer, I was working in one company. It was great, but we've had to maintain an application, which was created around year 2002! That's when [Napster](https://en.wikipedia.org/wiki/Napster) was shut down! Today, this application is still running, but since a few years, it only contains some of the functionality. The rest is being handled by a new app. In this post, I would like to share some experiences, how we dealt with it. 

# Legacy code definition
If you go to wikipedia and search for [legacy code](https://en.wikipedia.org/wiki/Legacy_code), you read:

> Legacy code is source code that relates to a no-longer supported or manufactured operating system or other computer technology. 

Some people would argue with that. One of the best definitions I heard recently was that the code is legacy the moment it hits the production server. That's when you forget about it and head on to other tasks. Obviously, the biggest problem is with applications written years ago, using old technologies and style which are different to what we do now. We are all learning all the time. I bet you also wonder sometimes how could you be so stupid when you were writing that app a year ago. That's normal - it's a sign of a progress we do as programmers. 

I think it's clear there are different kinds of legacy code. We should treat these kinds differently. I will try to go through some of them here and show you my thinking on this problem. 

# Services, tools and utility apps
You probably have few of them. Someone wrote them some time ago and they do something, somewhere. No one, or only a few people, know what they do. You might think, it will be easier to start with something small, like these apps. Don't. Think when was the last time you had to implement a major change in these apps. You probably don't remember. So don't bother. Leave them as they are. They are doing their job. You should focus on what's really important. 

# Main application in the company - strategy
Most software companies have this one, main application, which runs the whole shop. If the company was started years ago, chances are, it's using some old technologies. If it's really old, there is a big chance, these technologies are not supported anymore. In my case, it was an application written in Visual Basic 6. Yes, it was released in 1998. That's when movies "Armageddon" and "Saving Private Ryan" premiered. 

When you're in such situation you have few choices.

## Keep calm and carry on 
We were doing that for years. It is a fine solution. The app is working and brings business value. You probably have some framework which allows you to implement changes quickly. Of course, there are problems when you want to use a service, which your current technology does not support. We've had such situation with Memcached. There was no driver, so we had to build it. We wanted to use MongoDB - no chance. This approach is good if you just have to maintain things you already built and rarely add new stuff. If you want to do something more modern, you might run into problems. 

## Rewrite the bloody thing
That's probably the worst decision you can make. Think about it. This application was developed for years and is bringing business value to the company. How can you imagine to rebuild it in few months or a year? Of course, you can do it if it's small, but that's rarely the case. Usually, these are monsters. Often without unit tests. You need to have really solid reasons to go this road. There are many examples of teams trying to do that. They all failed (remember [Netscape Navigator](https://en.wikipedia.org/wiki/Netscape)?). I, personally, haven't heard of a single success with such approach, yet. It is also very hard to sell such idea to the business people. There is probably a pipeline of new things to implement and you want to stop everything and rewrite something which is working and bringing money. 

## Create a separate project and implement new stuff in it
In my opinion, that is the best way to go. You keep your old app, but whenever you have something new, you do it in the new project. It's much easier to convince business people to it because these new functionalities were supposed to be done anyway. After a while of adding new stuff to the project, you should have a mature solution, which has proved to be stable. At this point, you can start thinking about moving pieces over from the old platform. 

This way, you have a chance to test your solution in a live environment before you move the bits bringing the most business value. If you make a mistake, you don't bring the main product down. You don't stop development of new things for the time of the rewrite. This idea is much easier to sell. 

# Pioneer - leader 
If you want to bring a new technology into the company, you need to have a pioneer. That is probably you! A person, who will drive this project and make sure it won't die. You will have to test things and pick the best one, be the evangelist in the whole company. There will be 'others' wanting to dump this idea and you will have to defend it. You will have to answer questions from business (why we should invest in it?) and technical people (why Angular? We should pick React - it's cool today). You either have to know all the answers, or gather people around you, who will support you. It's not an easy job, but if you succeed, it comes with a big satisfaction. 

# Selecting technology 
My opinion here is, you should pick what's the newest from the technology your company is in. In our example, we were always working with Microsoft stuff. The main app was VB6, so it was clear we will stick with .NET. We could have tried python, NodeJS or any other popular thing then, but it would make the whole thing few times harder. Unless of course, your team knows these other things too. If not, I would go with something everyone is familiar with. 

I also think you should go with the newest version of the technology you choose. If you're in .NET, go with .NET Core. If you want Angular, pick Angular2. Don't go with something which will have a successor when you finish. It should also make the project more interesting for other developers. I know it's controversial, but in my opinion, when you're starting from scratch and will work on the project for a long time, it's better to be up to date from the day one.  

# Pilot project
You are moving to a new technology. You know which technology it is. Chances are you have never used it. You may start the work on your main project. But I think it's much better to start with some kind of pilot. Project which you can use as a test field for the architecture, libraries. Something to get the grasp of the new thing. You will make mistakes. Some decisions you will regret. It's better to do it in this pilot, so that, when you start the work on the main application, you have some experience. 
It would be ideal if this project is new - not an existing feature that you're moving to new technology. This way you avoid old thinking. It also can't be critical you finish it in a tight deadline. You don't want anyone standing over you and asking why it's taking so long. 

# People 
It's much better to have a team working on such project than a single developer. You can discuss different approaches, validate the thinking. It's crucial to pick a certain type of people. You will need experienced players who are enthusiastic about the new stuff, know the old application and will search for the best solutions for the new one.  Avoid developers who like the status quo and prefer to calmly close tasks. This team will have to make hard decisions and take on the risks. They can't be afraid of breaking things.  

# Summary
First - I said it in the beginning - don't imagine, you will rewrite everything in one go. It may take years. 

The second thing to remember is that you want to make this change for some reason. It's very easy to fall into a trap of recreating patterns and architecture from the old project. That's the worst thing you can do. If you do that, most certainly, you end up with the same thing, using newer technology. Especially in the beginning, you must read a lot about application design. Maybe you should try CQRS, maybe microservices. It might be, the repository pattern will suit you best. Whatever it is, make the decision about the architecture after a lot of thinking and brainstorming. This is crucial. In most cases, you shouldn't move any code or classes from the old application. If you have to do it, think, what is the best place for it in the new architecture. Don't recreate old patterns in the new app. 

If you do this, remember, it's not just another IT project. It's huge business decision. It's also a big cost for the company. In the beginning, you won't be as fast in coding than you were with the old technology. You will make mistakes and will have to go back. You will need time to create and test new architectures. It will all bring an extra cost for the company - in money and time. So make sure you have the right reasons, the thing you're doing brings a business value and isn't just developers playing with new toys.  

How do you deal with legacy applications? Do you have some stories to share? 