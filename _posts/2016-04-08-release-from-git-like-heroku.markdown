---
layout: post
title: Release from git like Heroku
date: '2016-04-08 09:43:52 +0200'
categories:
- DajSiePoznac
- Tips
tags:
- dajsiepoznac
- hosting
- tips
---
If you ever used (Heroku)[https://www.heroku.com/] services, you probably liked their release process. It is built around git. Every application you host there has its own repository. To deploy an application you simply push your changes to this repository and they do the magic. Have you ever wondered, how they do this magic? :) I did. So when I got my VPS in [Digital Ocean](https://m.do.co/c/52b0b5522e84) to host my applications, I wanted to have a similar deployment experience like on Heroku. It turned out to be very simple. You just have to write a deployment script in bash and set it up as a post-receive git hook. In the script, you can compile your app, run gulp or grunt tasks, whatever you need. Then you copy files to the destination directory et voil&agrave; - your app has been deployed!

# Setup
First of all, you need to setup git on your server - just follow [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-private-git-server-on-a-vps) to do that. You can still use Github, or any other git server to host your repository. You just need to set up an additional remote using the _git remote add_ command:

{% highlight bash %}
git remote add myserver https://domain.com/user/repo.git
{% endhighlight %}

When you've done that, you're ready to go!

# Examples
For a simple static website you could have a script with just one command:

{% highlight bash %}
#!/bin/bash
git --work-tree=/var/www/mywebsite.com/ --git-dir=/home/git/mywebsite/ checkout -f
{% endhighlight %}

It will get files from your repository and copy them to _/var/www/mywebsite.com/_

You can also have a different setup for branches:

{% highlight bash %}
#!/bin/bash

while read oldrev newrev ref
do
    if [[ $ref =~ .*/master$ ]];
    then
        echo "Master ref received.  Deploying master branch to production..."
        git --work-tree=/var/www/mywebsite.com --git-dir=/home/git/mywebsite checkout -f master
        cd /var/www/mywebsite.com
        npm install
        grunt release
    elif [[ $ref =~ .*/dev$ ]];
    then
        echo "Dev ref received. Deploying dev branch to staging environment..."
        git --work-tree=/var/www/mywebsite.com --git-dir=/home/git/mywebsite checkout -f dev
        cd /var/www/dev.mywebsite.com
        npm install
        grunt release
    else
        echo "Ref $ref successfully received.  Doing nothing: only the master or dev branch may be deployed on this server."
    fi
done
{% endhighlight %}

Here you can see the configuration for the master and dev branches. Depending on which branch has been pushed, the script deploys data to a different directory. It also runs npm and grunt commands after the files were copied.

The last example is a script for a .NET application, which is being compiled with mono:

{% highlight bash %}
#!/bin/sh
git --work-tree=/var/apps/mydotnetapp/ --git-dir=/home/git/mydotnetapp/ checkout -f
cd /var/apps/mydotnetapp
mono /home/git/nuget.exe restore
cd src
xbuild  /p:Configuration=Release mydotnetapp.csproj
{% endhighlight %}

Yes, it is a Linux server and I am running .NET apps on it! It's going to be even easier and better supported with the new .NET Core and ASP.NET Core, which are cross-platform, but it's also possible with mono.

# Summary
If you're a developer, you should script your whole life. Especially deployments. Doing this manually is a hassle and a waste of time. I hope I have shown you a better way.

PS. I think having a private VPS where you can host your applications is very useful. I will write a separate post about why I recommend it and what else you can use it for. If you don't have a VPS yet, go on and get one. There are many providers with different offers. I did my research, picked Digital Ocean and am happy with the decision. It's only $5 per month and you can do lots of cool stuff with it. If you register from [this link](https://m.do.co/c/52b0b5522e84), you will get a $10 credit for free!
