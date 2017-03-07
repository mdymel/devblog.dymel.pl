---
layout: post
title: 'Visual Studio 2017 - first impressions'
date: '2017-03-07'
image: /images/posts/2017-03-07-visual-studio-2017-first-impressions/featured.jpg
tags:
- dajsiepoznac2017
- .net
---
Today, a new VisualStudio was released. It's a 20th anniversary edition, numbered 2017. Let's see what it has to offer in the free, Community edition. 

1. TOC
{:toc}

# New installation process 
First new thing you see when you download the install package is the new installation experience: 

![vs2017 installer](/images/posts/2017-03-07-visual-studio-2017-first-impressions/installer.png)

It helps you select the features you need, so you can tailor VS exactly to your needs. According to Microsoft, the smallest installation is just a few hundred megabytes and it should contain basic code editing support for over twenty languages. Options I have selected (desktop, web and some of the tools) was close to 5GB. 

Even though I have installed lots of components, after just a few minutes, I've seen the information the installation is now complete: 

![vs2017 installation complete](/images/posts/2017-03-07-visual-studio-2017-first-impressions/installation-complete.png)

# First launch
This is really impressive! Some time ago, I decided to wait for the RTM version with trying VS 2017. I wanted to see the finished product instead of checking each RC version. I heard it starts faster than previous versions, but... WOW! It takes about **4 seconds** to get to `Get Started` screen. Compare this to 15s I have to wait for VS 2015 and you will know what I mean. Of course, I have R# and NCrunch installed with VS2015 and VS2017 is clean, but still - VS was never starting this fast... 

# Converting a project 
I am working on .NET Core based projects recently, so first thing I saw was an information about a project upgrade:

![vs2017 project upgrade](/images/posts/2017-03-07-visual-studio-2017-first-impressions/core-upgrade.png)

After a moment, project was converted. These are the changes: 

![vs2017 project upgraded](/images/posts/2017-03-07-visual-studio-2017-first-impressions/project-upgrade.png)

As you see, instead of `global.json`, `project.json` and `*.xproj` files, we now have a single `csproj` file per project. I was very happy to see, it is really simple now: 

![vs2017 csproj file](/images/posts/2017-03-07-visual-studio-2017-first-impressions/csproj-file.png)

There were no errors with the migration and project built and started without any problems. 

# Opening a solution 
When I open an sln file in the new VS, it takes about 20s until everything is loaded. It's faster than VS2015, but again - I have R# in the old version, so it's hard to compare. We will have to see when JetBrains releases a version ready to work with final VS 2017 to compare that. 

# IDE features
There are loads of new features packed in the new version. You can see the full list in the [official announcement](https://www.visualstudio.com/en-us/news/releasenotes/vs2017-relnotes), but here are few things I liked the most: 

## Improved Code Navigation
There is `Go To Type` functionality finally available in the VS: 

![vs2017 goto types](/images/posts/2017-03-07-visual-studio-2017-first-impressions/goto-types.png)

It even has the same shortcut as R# (CTRL + T). Also `Go To Line` is improved is available in the same menu as `Go To Type`.

## Structure Guide Lines
These are enabled by default and look quite good actually: 

![vs2017 Structure Guide Lines](/images/posts/2017-03-07-visual-studio-2017-first-impressions/coding-guide-lines.png)

When you hove over the line, a tooltip is displayed showing the context of the current code block. 

## Lightweight Solution Load
This sounds interesting, but I didn't have a chance to test it yet. It should enable faster loading for large solutions. The feature is not enabled by default. When enabled (per solution), VS waits with project load until you start working with it. It should be very helpful for large solutions with dozens of projects. 

## Quick Actions and Refactorings
Another feature known from R# world - VS will now suggest improvements to your code with an option to make the transformation for you: 

![vs2017 Refactoring](/images/posts/2017-03-07-visual-studio-2017-first-impressions/objectinitializer.png)

# Summary
There are many more interesting feature - I suggest you go to [Release Notes](https://www.visualstudio.com/en-us/news/releasenotes/vs2017-relnotes) and check them yourself. In my opinion, it looks really promising. As always, some time is needed to see how it all performs in the day-to-day work, but my first impressions are really positive. Now, we have to wait until Resharper and NCrunch are released to see how they impact improved VS performance. What is worth to notice is the fact that VS Team is constantly implementing more and more features of these popular additions. There is a chance, we might not need them in some time... 

PS. I know you don't technically need R# or NCrunch, but they simply make the life easier ;) 