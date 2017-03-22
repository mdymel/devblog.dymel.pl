---
layout: post
title: 'Tools I use for web development on windows'
date: '2017-03-23'
image: /images/posts/2017-03-23-web-dev-tools/featured.jpg
tags: 
- dajsiepoznac2017
- tools
- web
---
These days, you can select from many applications to help you at work everyday. I am doing web development for something like 15 years (!). I thought some of you may find it useful to see the tools I use at work. 

# General 

## Cmder - console replacement 

![cmder](/images/posts/2017-03-23-web-dev-tools/cmder.png)

I prefer to use git from the console, but... windows command line is sh... not very usable. Fortunately, some time ago I have found [cmder](http://cmder.net/), which is an awesome replacement. It has all the features you would expect (normal copy and paste, tabs and lots of config options), full git support, plus linux tools (like cat, grep, ls etc). You like working with console, you have to try it out.  

## Servant Salamander - file manager

![Servant Salamander](/images/posts/2017-03-23-web-dev-tools/salamander.png)

It's like Windows Commander, but with much better looks. It also works better - at least for me. It's just more intuitive. Also has loads of plugins like ftp support (is anyone using ftp these days?), disk copy, checksums etc. Unfortunately, it's not free but has a trial. You can download it from the [Altap](https://www.altap.cz/) website. 

## Greenshot - screenshots 

![greenshot](/images/posts/2017-03-23-web-dev-tools/greenshot.png)

The best tool I've found for screenshots. Has lots of options, like region or window capturing, built in editor and upload to imgur and few other services. Download [here](http://getgreenshot.org/).

## Ditto - clipboard manager

![ditto](/images/posts/2017-03-23-web-dev-tools/ditto.png)

Simple - keeps a history of things in your clipboard. Very useful. Download [here](http://ditto-cp.sourceforge.net/). Although homepage looks like it was built for windows 3.11, it works with windows 10 and even has a 64bit version :)

## AutoHotKey - scripts for shortcuts 
That's another very useful tool. I'm using it just to [stop CTRL+Scroll zoom](/2016/03/18/stop-ctrl-scroll-zoom/), but you can achieve a lot more. Basically, you can write a script and assign any shortcut or mouse action to it. 

# Text Editors 

## Sublime Text 
I think there are two camps in the developer's world. One uses [Notepad++](https://notepad-plus-plus.org/), the other [Sublime Text](https://www.sublimetext.com/3). I prefer the latter. It feels faster and packed with more features. This is my go-to text editor. From large scripts to basic notepad. And it has awesome multi-line editing. 

## VS Code 
When I have some bigger project I want to preview. Or some small work to do in something, which is not .NET, I use VS Code. I would replace Sublime with it, but it's not so fast to start. Oh... And I write this blog in VS Code. 

# Backend 

## Visual Studio  
No introduction needed here, I think. In my opinion, it's the best IDE out there. Especially with Resharper (next point). It has all you need. The downside is its hunger for memory, but my thinkpad with 16GB handles it perfectly fine. The [recent VS 2017](/2017/03/07/visual-studio-2017-first-impressions/) release makes it even reacher in features and a bit faster. 

### ReSharper
The thing, which makes Visual Studio much better. If you do .NET, you probably know it If you don't, go ahead and [download trial](https://www.jetbrains.com/resharper/?fromMenu) now! When the trial ends, JetBrains has now a subscription plan, which cost less than $13 for an individual developer. It's not much considering what you get: code analysis, refactorings, navigation and much more). Must have! 

### NCrunch - automatic test execution

![NCrunch coding](/images/posts/2017-03-23-web-dev-tools/ncrunch.gif)

Another great plugin for VS. I've written a [whole post](/2016/07/28/continous-testing-in-visualstudio-with-ncrunch/) about it. It has only one job - to run your tests in the background, when you write code. It knows which line is covered by which test and it executes them automatically and let you know by coloured dots on the left if test passes or not. There was a new version released recently, which added long-awaited support for .NET Core. Get it [here](http://www.ncrunch.net/)

### NDepend - code metrics and quality 
Also a great tool, which analyses your code. I covered mode in a separate [post](/2016/07/18/becoming-a-better-developer-with-ndepend/). You can check various code metrics, see class diagrams and get some hints about the tech debt you might be creating. Get it [here](http://www.ndepend.com/).   

# Frontend 

## WebStorm 
Since the last year, I mostly work with Angular2. I checked few options for the main editor (including VS Code) and WebStorm turned out the be the best. Everything just works and you get the feeling of the statically typed language. You don't have to worry about remembering what you have to import for which class - WebStorm does it for you. You have good navigation, refactoring options. You basically get a real IDE. As with Resharper, they offer a monthly subscription. In this case, it's only $5.9 for an individual. It's less than a coffee in... You know where ;) Get it [here](https://www.jetbrains.com/webstorm/?fromMenu). 

# Summary
These are the tools I use every day to do my job. I hope you didn't know some of them and thanks to this post you will try them out. What are your favourite apps? 