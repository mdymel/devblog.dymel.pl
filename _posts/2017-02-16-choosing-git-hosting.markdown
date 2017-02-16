---
layout: post
title: Choosing git hosting service in 2017
date: '2017-02-16'
featured: /images/posts/2017-02-16-choosing-git-hosting/featured.jpg
image: /images/posts/2017-02-16-choosing-git-hosting/featured.jpg
tags: 
 - git
---
When you work on an opensource project, you go to GitHub. Sometimes though you don't want to make your source code public. That's the moment when you have to decide, which provider to choose. There are currently 3 who really count in the game: [GitHub](https://github.com), [BitBucket](https://bitbucket.org) and [GitLab](https://gitlab.com). I have recently started working on a new project, so had to choose between them. I thought I will share the outcome. 

# Requirements

These are pretty standard: 

 * Reliable
 * Cost effective
 * Additional Features 

# GitHub
That was obviously my first choice. But, since the project I am working on is a one for a company, I would need an organisation account. These ones cost $9 per user, but the initial package is 5 users for $25. What you get in return is a service, which you know from all the opensource projects. It's quite reliable and good looking. That's pretty much it. You get what you have in your free account with the possibility of creating private repositories. One thing worth to note though is the fact that there are loads of integration options ready. Pretty much every service you check will have a connection ready to GitHub. 

# BitBucket
BitBucket is part of the Atlassian product family (the ones behind Jira). Great thing about it is they offer unlimited private repositories in the free option. Free, meaning for teams up to 5 users. When your team grows, you'll have to pay. They are introducing new model soon - $2 per user per month starting with $10. That's much less than GitHub. What you get is the same service as in GitHub, but... worse user experience in my opinion. For me, it doesn't look good and is not intuitive. What BitBucket also offers is a service they call Continous Integration Pipelines. It allows you to build your projects on their servers. In the free account, you get 50 minutes of build time per month. That's not a lot if you want to build every day, but it is there. You can also purchase additional build minutes - $10/month per 1000 minutes. When it comes to integrations it's all good - probably not as good as with GitHub, but most services support BitBucket too. 

# GitLab
Last, but not least - GitLab. I'll be blunt - that's the one I have chosen. It looks very nice and is intuitive with a nice user experience. It's also free for unlimited private repositories and collaborators. As you see it's the best offer money wise. What I liked the most though was a service called Pipelines. As with BitBucket, you can use it to build your projects, but here you can use your own build runners (even on your own machine), so you're not limited with build minutes. It's very easy to setup and works like a charm. I have recently configured pipelines, which compile my projects, create docker containers and upload them to docker cloud, which does deployments automatically. I will soon write a separate post about it. 

# Summary
As you see, GitLabs offer looks very good. You probably heard about their recent problems with restoring the database backup. You could be worried about that, but... it already happened. They will probably be very cautious about such things now, so I wouldn't worry about it. The service works quite well with short problems from time to time (you can check status on their [twitter account](https://twitter.com/gitlabstatus). What sold it for me was Pipelines. As I said, they're very easy to setup and just work. So far, I recommend this service. 

