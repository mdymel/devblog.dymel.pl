---
layout: post
title: 'Travis - a free CI for an opensource project'
date: '2017-03-13'
image: /images/posts/2017-03-13-travis-free-ci-for-opensource-projects/featured.jpg
tags:
- dajsiepoznac2017
- .net
- devops
---
When you are working on a software project, it's good to know the state of this project. I think the most essential information is if the project builds correctly. If you have unit tests (and you should!), if these tests pass. Of course, every person should check these things before they commit their changes, but in reality, we often make mistakes and it happens to check in something which breaks the build. That's when Continues Integration (CI) comes in handy. It automatically builds your project after each commit to the repository. Today, I would like to show you how to setup CI for a project in Travis. The good thing is, this tool is completely free for opensource stuff! 

# Travis CI
Travis CI is a service allowing to build and test projects hosted on GitHub.com (and only there). There is a handful of technologies supported and there are [docs](https://docs.travis-ci.com/user/languages/csharp/) explaining how to set it up. Unfortunately, the setup didn't work for me straight away and I had to do some digging and modifications. 

There are two instances of Travis: 
 
  * [https://travis-ci.org](https://travis-ci.org) - this one is free and used only for public GitHub projects.
  * [https://travis-ci.com/](https://travis-ci.com/) - for private GitHub projects. This one is paid - basic plan is $69 per month and is offering 1 concurrent job

# Adding your project 
You sign up by connecting with your GitHub account. When that's done, you will see a list of all your public projects with a switch enabling the CI: 

![selecting project](/images/posts/2017-03-13-travis-free-ci-for-opensource-projects/selecting-project.png)

All you have to do here to flick a switch next to the project you want to enable: 

![project selected](/images/posts/2017-03-13-travis-free-ci-for-opensource-projects/project-selected.png)

# .travis.yml
When you have enabled CI for your repository, you need to add a configuration file named `.travis.yml`. My project is based on .NET Core, so I went to [csharp page](https://docs.travis-ci.com/user/languages/csharp/) in help. It explains a lot, how you should set the config file. As I said before, it didn't work for me. I had to search for solutions in other GitHub projects ;) In the end, I came up with a config file that works fine: 

{% highlight yml %}
language: csharp
dist: trusty
mono: none
dotnet: 1.0.1
solution: Stactive.sln
script:
  - dotnet restore
  - dotnet build
  - dotnet test src/Stactive.Tests/Stactive.Tests.csproj

notifications:
  email: false
{% endhighlight %}

It was necessary to setup the `trusty` Ubuntu distribution, which is supported by `dotnet` tools and use standard `dotnet` commands in the script section to build and test my project. I have also specified I want to use `1.0.1` version of the tools. 

After you push this file to GitHub, you will immediately see the project building in Travis: 

![project building](/images/posts/2017-03-13-travis-free-ci-for-opensource-projects/first-build.png)

If everything is ok, the yellow will soon change to green, which means the build was successful. 

# Adding build status to the README file
Now, when you have CI setup, you can add a status image showing if the last build was successful

![master branch build status](https://api.travis-ci.org/mdymel/stactive.svg?branch=master)

This is an image for my project. The change is very simple. You can format it to a table like this: 

{% highlight markdown %}
{% raw %}

|Branch             |Build status                                                  
|-------------------|-----------------------------------------------------
|master             |[![master branch build status](https://api.travis-ci.org/mdymel/stactive.svg?branch=master)](https://travis-ci.org/mdymel/stactive)

{% endraw %}
{% endhighlight %}

Remember to change links to point to your project. 

# Summary
At this point, I have a working CI system, which automatically builds and runs tests in my project. I encourage you to do the same. Next step of automatisation is Continous Delivery, which releases your software to servers, but I will add that later on when I have something to be delivered ;) 