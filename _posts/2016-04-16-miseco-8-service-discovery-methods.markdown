---
layout: post
title: 'MiSeCo #8: Service discovery methods in microservices architecture'
date: '2016-04-16 20:36:31 +0200'
categories:
- DajSiePoznac
- MiSeCo
tags:
- dajsiepoznac
- miseco
- microservices
---
# Previously on MiSeCo
So far I have implemented a way of calling service methods remotely over HTTP protocol. Currently, service URL is hard-coded in the application. I need to find a way to allow services register automatically so that very little configuration is needed.
Initially, I wanted to create MiSeCo in the way that there is no central point, all services are equal and have information about all other parts of the system. Right now I don't think it's a good idea or even possible to implement efficiently. It seems there will have to be some sort of router/registry.

# The Problem
Every system using microservices architecture needs to have at least some of these features:

* **Service Registration** - there has to be some central point, which stores information, where each service is hosted. Services need to know where this central point is located and be able to register themselves at it
* **Service Discovery** - client applications or other services need a way of accessing other services 
* **Load Balancing** - some services may be using multiple instances
* **Monitoring** - it has to be clear which services are running and if there is a problem with some of them 
* **Availability** - how to handle situation when a service failed or is not responding

# Options
It seems to be clear there needs to be one point controlling the whole system. I have found few patterns helping to deal with these problems. All of them are utilizing some sort of ServiceRegistry.

* **Client-side discovery** - when a service needs to make a request to another service, it's querying a Service Registry to get the location of service instances
* **Server-side discovery** - here the request is sent to the router, which forwards it to the correct service
* **DNS discovery** - this is a quite clever use of old technology for new purposes. DNS records can also store other information - for example, host and port of a named service. The only drawback is, that this information is not very dynamic, so it's not suitable for frequently changing systems. 

# Ready solutions
As always in the Open Source era, there are solutions ready to be used. I won't be going into details, but if you're interested, you can check following projects: 

* [ZooKeeper](http://zookeeper.apache.org) by Apache 
* [Eureka](https://github.com/Netflix/eureka) by Netflix 
* [SmartStack](http://nerds.airbnb.com/smartstack-service-discovery-cloud/) by Airbnb 
* [SkyDNS](https://github.com/skynetservices/skydns) - using Spotify idea of using DNS records

# Solution
After this research, I know I need to have a service registry in my architecture. What I don't want is to have to maintain a specialized service doing just that. I want every service to be able to act as one. For systems hosted on many servers, there would be one registry per server, where registries would update one another. This way, the only needed config would be a list of registries with host addresses and ports. Every service, on start, would check if the registry is available and if not, would bind to the registry port and became one. All other services would find any available port, bind to it and register at the central point.
OK... I'm going back to work! :) 
