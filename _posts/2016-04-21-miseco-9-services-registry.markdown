---
layout: post
title: 'MiSeCo #9: Services Registry'
date: '2016-04-21 07:50:29 +0200'
categories:
- DajSiePoznac
- MiSeCo
tags:
- dajsiepoznac
- miseco
- microservices
---
# Previously on MiSeCo
In the last two posts ([here](/2016/04/14/miseco-7-communication/) and [here](/2016/04/16/miseco-8-service-discovery-methods)) I have explained how MiSeCo micro services will communicate between each other and how I am going to implement services discovery. TLDR I've decided to use services registry pattern in the way that every service could become one.
Fortunately, some of you, readers, pointed out in the comments on [reddit](https://www.reddit.com/r/programming/comments/4fcbh4/service_discovery_methods_in_microservices/) (thank you for that), it might not be the best idea... So it got me thinking :)

# Change of plans! 
I've decided to approach this problem differently. It does seem that making every service capable of becoming the main point in the architecture could complicate things. I think it will be better to create a separate application doing just that. 

# New plan!
I am going to create a services registry for MiSeCo. It will obviously utilize the framework, but its sole purpose will be to know where each service is hosted. It will also be possible to have few instances running to avoid a single point of failure. The only configuration requirement for all parts of the system will be to have a list of every registry in the system, so if one receives a new registration, it will be able to send it to others. There won't be a master/slave architecture - all registries will be equal. 


