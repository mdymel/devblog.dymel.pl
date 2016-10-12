---
layout: post
title: Public API for your Google Analytics data   
date: '2016-10-13'
featured: /images/posts/2016-10-13-public-api-for-your-google-analytics/featured.jpg
image: /images/posts/2016-10-13-public-api-for-your-google-analytics/featured.jpg
tags: 
 - google analytics
 - jekyll 
---

Have you ever wanted to create a custom dashboard from the data on your Google Analytics account? And for the dashboard to be publically available? I recently wanted to add a "Top Posts" box on this blog. The problem is, it's based on Jekyll, so is statically generated. I could have created some kind of plugin for jekyll (or maybe there is one), but I thought it would be cooler to get this data directly from GA. Obviously, you need to be logged in to access the Google Analytics API, which makes it impossible to use on a webpage. However, I have found __Google Analytics superProxy__. Today, I would like to show you how you can easily create an API with your GA data. 

# What is it? 
The [Google Analytics superProxy](https://github.com/googleanalytics/google-analytics-super-proxy) is a Python application, which allows you to make a GA query publically available on the internet. 

![Google Analytics superProxy](/images/posts/2016-10-13-public-api-for-your-google-analytics/ga-super-proxy.png)

It is prepared to be hosted on Google App Engine. To set it up, you need to follow the [readme file](https://github.com/googleanalytics/google-analytics-super-proxy#hosting-the-application-on-app-engine) in the repository, but it's very simple: 

1. clone the repository on your computer,
1. create a project in the AppEngine
1. create an OAuthID and OAuthSecret in the AppEngine
1. configure application settings 
1. download & install [AppEngine Python SDK](https://cloud.google.com/appengine/docs/python/download)
1. use the SDK to deploy the application 

# Google Analytics Query Explorer
[Query Explorer](https://ga-dev-tools.appspot.com/query-explorer/) is a place, where you construct the query. 

![Google Analytics Query Explorer](/images/posts/2016-10-13-public-api-for-your-google-analytics/ga-query-explorer.png)

This is example query I have created for my litle widget with top posts on this blog. You can test the query in the explorer and it will show you results in a nice table. You can also get an API Query URI. We will use this URI in the "Super Proxy". It is a link to the query results, but, as whole Google Analytics, it's not available without logging in. When you have the URL copied, head back to the "SuperProxy". 

# Setting up a query in the SuperProxy
While creating the application, App Engine assinged it an Application ID. It's combined from the app name and some id number, for example: superproxy-123456. Your application is available under the URL: `https://APP-ID.appspot.com/admin`. When it's ready, you can create your query: 

![Create Query](/images/posts/2016-10-13-public-api-for-your-google-analytics/create-query.png)

Refresh interval is the amount of seconds, proxy will cache the results. You want to keep it rather high not to exceed the request number limit on your account. I set it to 86400, which means the proxy will update the results once a day. You paste the API Query URI from the Query Explorer and try to test it. It should work straight away - if it does, press `Save & Schedule Query`. This will save your query and start fetching it every day.
You now have access to Manage Query page: 

![Create Query](/images/posts/2016-10-13-public-api-for-your-google-analytics/manage-query.png)

Here, you can disable, edit or delete it, but also have access to the public results URLs. This is, how the "DataTable (JSON Response)" look like: 

![Query results](/images/posts/2016-10-13-public-api-for-your-google-analytics/query-results.png)

As you can see, it's available in the incognito mode, without logging in to my google account. 

# Where to use

As I said in the beginning you can use this setup for various dashboards based on Google Analytics data. You can create dynamic reports about your sites visitors, create a widget with the number of page visits, draw a graph of countries your site is most popular in. All the Google Analytics data is available to you!
