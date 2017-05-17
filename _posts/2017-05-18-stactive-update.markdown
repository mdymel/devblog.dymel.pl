---
layout: post
title: 'Stactive - release 0.1 and status update'
date: '2017-05-18'
featured: /images/posts/2017-05-18-stactive-update/featured.jpg
image: /images/posts/2017-05-18-stactive-update/social.png
tags: 
- dajsiepoznac2017
- stactive
---
Nearly three months ago, I have joined a contest called "Daj Się Poznać" (Polish for "Get yourself known" or "Get Noticed"). The rules are simple - you have to blog twice a week and work on an open source project on GitHub. All of this for 3 months - from March till the end of May. As it is close to the finish line, I would like to give you an update on how I am doing so far. 

# Stactive is released as NuGet packages! 
Two weeks ago, I decided to publish Stactive in the nuget repository. It's very early version, with limited functionality, but it's there. 

There are two packages: 

 * [Stactive](https://www.nuget.org/packages/Stactive/) - main package of the library
 * [Stactive.Persistence.MongoDb](https://www.nuget.org/packages/Stactive.Persistence.MongoDb/) - MongoDb persistance layer 

When I am writing this post, only one functionality has been implemented, which is saving request logs in the MongoDb database. The object, which is saved contains some useful information: 

{% highlight json %}
{
    "_id" : LUUID("7e701118-3807-a746-963a-7d7f725c1939"),
    "Url" : "/Account/Login",
    "ResponseStatus" : 200,
    "ResponseLength" : null,
    "ProcessingTime" : NumberLong(1017),
    "ContentType" : "text/html; charset=utf-8",
    "Authorized" : false,
    "UserId" : null
}
{% endhighlight %}

More information about installation and how to instructions are available on [GitHub](https://github.com/mdymel/stactive).

# Next steps 
First of all, I am going to add two more persistence implementations - for SQL Server and ElasticSearch. This will allow broader usage and dashboards and graphs from Kibana. 
Next, I am planning to add the main feature - statistical events logging. It will be possible to log events with extra data, which can later be used for checking the user flows in the application, doing A/B tests and finding anomalies. 
I also want to add more configuration options. It should be possible to set, which information should be saved and which not. 

# It's an OSP
The whole project is, obviously, open source and available on [GitHub](https://github.com/mdymel/stactive). It would be great to see some contributions or even issues raised with bugs or feature requests. I know it's early, but if you like the idea, let me know! 

# Summary
This has been really intense 3 months. Blogging twice a week requires a lot of determination. If you add a project to this it becomes quite hard. I was spending at least 3-4 evenings in a week on either blog or Stactive. When the contest finishes, I will definitely go back to writing one post a week. I just hope I will find enough motivation to keep developing Stactive. We shall see :) 