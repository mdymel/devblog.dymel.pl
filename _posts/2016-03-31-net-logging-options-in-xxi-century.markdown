---
layout: post
title: .NET Logging options in XXI century
date: '2016-03-31 07:50:00 +0200'
image: /images/posts/2016-03-31-net-logging-options-in-xxi-century/featured.jpg
tags:
- dajsiepoznac
- .net
- logentries
- exceptionless
- nlog
- log4net
---
When you write an application and release it live suddenly you lose access to the console, break points and whatever you use during app development. If anything bad happens, you are blind. Unless you were smart before and implemented logging. Today I would like to show you a few options for gathering logs from your applications. 

# Writing logs
In the .NET world there are really three options to do your logging, but you shouldn't use the first one ;) 

## System.Out.WriteLine
This is the logging option for 'poor people'. It is possible, but you should really try to use a proper logging library. Of course if you're writing a one time use app, which is an exe and doesn't do much, you don't have to configure a proper logging framework. However, in any other case I would strongly recommend to use one of the following libraries. 

## Log4Net, NLog & Serilog
These are the most popular logging frameworks for .NET. They mostly differ by the way you configure them. It's impossible to tell which or if either of them is better. I personally prefer NLog, but I recommend you check both of them out and pick the one that suits you better. The fact is, NLog seems to be getting more traction recently.
One thing which makes Serilog bit different is the fact that it supports structured data in your logs. You can pass objects with your messages, which can be useful sometimes. 

[http://nlog-project.org/](http://nlog-project.org/)
[https://logging.apache.org/log4net/](https://logging.apache.org/log4net/)
[http://serilog.net/](http://serilog.net/)

It doesn't really matter which one you choose. It's just important to use some framework, rather than just send everything to the console. A framework gives you the freedom to: 

* Choose a log level. Some information is valid while you are debugging that nasty bug, but most of the time you only need information about errors. WIth a logging framework it's easy. You just assign a log level to every message you save and in the app configuration you choose which level you want to follow. 
* Choose a destination for your logs. You can write to a console, but it's good to have the possibility to save messages to a file, database or cloud. You might want to save errors to a database, but write debug logs to a console. Whatever you need! 
* Format your logs - you can add whatever you need to your logs - it can be a class name, date, username, server name etc. 

# Destinations
When you know how you're going to write logs, you need to decide where to store them (unless you're doing System.Out.WriteLine, but I hope, you are not! :)).

## Console
This is the cheapest, but also the least flexible solution. It's usually good to enable it during development or testing. It just prints out errors to the console, which is quite useful. 

## File
This is another simple, but useful target. Dump everything to a rotating file (one file per day, keeping files for the past week), so you're able to track anything which happens when you're not watching. 

## ElasticSearch/Kibana
![kibana](/images/posts/2016-03-31-net-logging-options-in-xxi-century/kibana.jpg)

Doesn't matter how many logs you have, you need to be able to process them. Otherwise they're useless. It's great to store everything in files, but if you have a web app on a dozen servers and every one of them processes hundreds of requests per second, you need something better. The natural answer is some kind of database. I have tried many solutions in the past and this combo was the best. First of all - IT'S FAST! I mean FAAAST! It's really impressive how ElasticSearch is able to process and aggregate the data. With Kibana you can draw nice graphs, filter data, make dashboards etc. It's also great for tracking stats, but that's a topic for another post. If you've never tried it, I advise you to download ElasticSearch and Kibana, run it locally (it's self-hosted) and have a play with it. 

* [https://www.elastic.co/products/elasticsearch](https://www.elastic.co/products/elasticsearch)
* [https://www.elastic.co/products/kibana](https://www.elastic.co/products/kibana)
* [https://www.elastic.co/products/logstash](https://www.elastic.co/products/logstash)

## LogEntries
![logentries](/images/posts/2016-03-31-net-logging-options-in-xxi-century/logentries.jpg)

Like with everything there is a bunch of commercial solutions ready for you to use. LogEntries is one of them. It can simply be a target for all your logs (app, web,mobile, syslog...). You can use it with nearly everything. It has lots of features for searching, tagging, making reports, dashboards etc. It has a free plan, which is quite generous and a few paid options if you need more...
[https://logentries.com](https://logentries.com)

## Exceptionless
![exceptionless](/images/posts/2016-03-31-net-logging-options-in-xxi-century/exceptionless.jpg)

Originally Exceptionless was built only for .NET platform, but the company has released a JS client recently and is working on other options too. This is my favourite solution for working with exceptions. It can also store your regular logs, but exceptions is where it shines. You can filter your log by any property and you can add your own properties. It's very pleasing visually and has an API if you need to get the data, for example for your company dashboard. It's a commercial product, but again has a free option. It's also an open-source product, which you can host yourself! So you don't need to worry about high costs if you have a lot of apps you want to track. I strongly urge you to try it out! 
[https://exceptionless.com/](https://exceptionless.com/)

# Summary
If you were still logging messages using System.Out.WriteLine, I hope I've convinced you to at least try some other options - believe me, you won't go back :) And if you were already using some logging framework, I hope you found something new in the tools I suggested. 

What logging methods do you use in your apps? 