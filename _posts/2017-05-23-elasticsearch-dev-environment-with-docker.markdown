---
layout: post
title: 'ElasticSearch development environment with docker'
date: '2017-05-23'
featured: /images/posts/2017-05-23-elasticsearch-dev-environment-with-docker/featured.jpg
image: /images/posts/2017-05-23-elasticsearch-dev-environment-with-docker/social.png
tags: 
- dajsiepoznac2017
- stactive
---
For some time, I am using docker to setup my dev environment. If I need a database engine, I set it up as a docker container. Need RabbitMQ - docker. It is quite handy as you don't need to install anything on your PC and easily remove it when you don't need it anymore. Today, I wanted to setup ElasticSearch but turned out to be more complicated than simply executing a command found in the docker hub. 

1. TOC
{:toc}

# What is ElasticSearch? 
For those of you who don't know, ElasticSearch is a distributed, RESTful search and analytics engine. There are many use cases for it. From implementing a quick search for your site, through storing logs to big-data analytics. The most important thing about it is... It's fast. And I mean FAST! 

I am currently looking to implement ES persistence for Stactive - my open source project, which logs requests from ASP.NET Core application. In future will also allow to save user actions from the app and get stats about it. So let's see how to set it up. 

# Finding the right docker image
Usually, when you need a docker image, you go to [docker hub](https://hub.docker.com/) and search for the service you need. You will usually find an official repository with images and instructions how to use them. For example, [this](https://hub.docker.com/_/mongo/) is a MongoDb repository. Unfortunately, when you go to [elasticserach repository](https://hub.docker.com/_/elasticsearch/), you see a big **DEPRECATED** message. It turns out Elastic is providing their image on [their own site](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html). 

# X-Pack - trial included 
Now you know why the image is not on docker hub. They include [X-Pack](https://www.elastic.co/products/x-pack) in the docker image. It's a paid plugin to ElasticSearch, which includes security, alerting, monitoring and few other functionalities. You get 30 days trial with the image. I don't know what happens after that time - maybe ES is non-accessible. Fortunately, you can remove it. 

# Interface
ElasticSearch comes with no interface. You communicate with it through an HTTP API. Of course, it's not very handy, so there are few apps which make it easier: 

 * [ElasticSearch Head](http://mobz.github.io/elasticsearch-head/) - it used to be a plugin to ES, now it has to be run as a separate app. It's a web app, so you can either download it and run from npm or install as another docker container. I used the docker option and will show you how in a moment.
 * [ElasticHQ](http://www.elastichq.org) - another HTTP interface. This one doesn't require you to install anything. You can use it straight from [their page](http://www.elastichq.org/app/)
 
# Setting it up
The whole process is simple, but it took me some time to figure out all the options to get the setup I wanted. 

## Download the image  
First let's pull the image from elastic.co: 

```
docker pull docker.elastic.co/elasticsearch/elasticsearch:5.4.0
```

## Run the container
```
docker run -p 9200:9200 -e "http.host=0.0.0.0" -e "transport.host=127.0.0.1" -e "http.cors.enabled=true" -e "http.cors.allow-origin=*" --name elasticsearch docker.elastic.co/elasticsearch/elasticsearch:5.4.0
```
There are few interesting things going on here: 
 
 * `-p 9200:9200` will make elastic available on 9200 port of your system 
 * `-e "http.host=0.0.0.0"` binds elastic to all IP addresses in the container

By default, ES won't have CORS support enabled, so the HEAD or HQ interfaces wouldn't work - their requests would be denied by the browser. These two settings will enable CORS and allow connections from all hosts. **You shouldn't do it in Production**, but as we're building DEV environment it's fine: 

 * `-e "http.cors.enabled=true"`
 * `-e "http.cors.allow-origin=*"`

Executing this command will start the container and ES will be available on the 9200 port. 

## Remove X-Pack
I mentioned X-Pack before. Now it's time to remove it from our container. 

First, we need to execute bash inside the container: 

```
docker exec -i -t elasticsearch /bin/bash
```

When you're in, you can remove the plugin: 

```
elasticsearch-plugin remove x-pack
```

Now you can exit the container and restart it: 

```
docker restart elasticsearch 
```

At this point, our ElasticSearch instance is ready and you should be able to access it from [ElasticHQ](http://www.elastichq.org/app/).

![elastic HQ](/images/posts/2017-05-23-elasticsearch-dev-environment-with-docker/elastic-hq.png)

## Installing Head
This is the easiest part. You simply run the container with the following command: 

```
docker run -p 9100:9100 mobz/elasticsearch-head:5
```

And immediately, you can access Head at [http://localhost:9100/](http://localhost:9100/).

![elastic Head](/images/posts/2017-05-23-elasticsearch-dev-environment-with-docker/elastic-head.png)

# Summary
I think using docker to host services you need for development is a great way to avoid making a mess in your environment. You can have something up and running really quick and clean it up even faster. With ElasticSearch it was bit too complicated than it should be, so I hope this post will save someone's time :) 
