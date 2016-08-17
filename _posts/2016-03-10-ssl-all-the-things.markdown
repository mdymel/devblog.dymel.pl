---
layout: post
title: SSL All the things!
date: '2016-03-10 08:00:00 +0100'
image: /images/posts/2016-03-10-ssl-all-the-things/featured.jpg
categories:
- DajSiePoznac
- Web
tags:
- dajsiepoznac
- web
- hosting
- security
- ssl
- cloudflare
---
These days, many people have their own website. A lot of these websites have some kind of form, which is sending data through the wires. It may be something completely irrelevant like meaningless numbers (ex. for RGB conversion), but some send more sensitive data, like email addresses. Some even have functionality of logging in, so there is email and a password. Unfortunately a lot of them are sending data in plain text, because they do not support secure, SSL connection. 

Few years ago it required quite a lot of hassle to enable SSL on your website. Not all hosting providers had that in their offer and if they had, they didn't have proper certificates, so you had to buy your own, which cost significant amount of money. It was understandable, that smaller websites, blogs etc. didn't bother to implement SSL. 

But! We now have 2016 and there are few options to secure your website for free! One of them is [https://letsencrypt.org/](https://letsencrypt.org/) - a free, automated and open certificate authority (CA). You can get your certificate for free and install on your server. Unfortunately it still requires some effort and is not that easy if you don't have your own server. 

Fortunately there is another free and really easy option. It's called [CloudFlare](https://www.cloudflare.com/). It's a company providing CDN services for websites. I know, there are many companies offering such thing, but CloudFlare has a free plan! And it is definitely enough for small (or even bigger websites). Here are some of the features, which they offer: 

* CDN - so your website is faster 
* Optimization - for images, scripts, css 
* DDoS protection 
* DNS 
* and... SSL

To enable these features on your domain you have to create&nbsp; an account and delegate domain name to CloudFlare DNS servers. At this moment, you get a nice and easy to use admin panel for your DNS records. When you open this tool, every record has a cloud icon: 
![CloudFlare step 1](/images/posts/2016-03-10-ssl-all-the-things/cloudflare-step1.png)
When it's orange, it means CloudFlare services are enabled and all requests to your website go through CDN network, which makes them faster for you clients. It also enables secure SSL connection. If, for some reason, you don't want that for some records, you just click on the cloud and disable it only for that record. 

Of course there are loads of other settings where you can tweak everything: 
![CloudFlare step 1](/images/posts/2016-03-10-ssl-all-the-things/cloudflare-step2.png)
But it's not really subject of this post. You can read more about CF features here: [https://www.cloudflare.com/overview/](https://www.cloudflare.com/overview/)

So now, my dear reader, go ahead and make your website secure. There is no excuse! Especially if you have forms accepting emails and passwords. 


