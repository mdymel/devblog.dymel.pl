---
layout: post
title: Why you should not use TFS
date: '2016-07-21 10:12:08 +0200'
image: /2016-07-21-why-you-should-not-use-tfs/featured.jpg
categories:
- Uncategorised
- Productivity
tags:
- .net
- git
- tfs
---
# Intro - svn, git.... Tfs
I have roughly 10+ years experience of working with version control systems. I started with SVN and a few years ago made a total transition to git. It was refreshing, how easy and fast was git compared to the SVN. Easy branches, merges... Everything was (and is) great. Now, since few months ago, I am working on a project, which is hosted in TFS. For the past few years, I've seen many comments regarding the version control from Microsoft. They were not positive (TfuFS ;)). When I learned that the project I will be working on is using TFS, I was a bit worried. Then, at first, I thought it's not that bad. It wasn't git (I still use it locally to track my changes in this project), but I could have lived with it. Now, after few months I think I learned enough to be able to confirm all these comments I read before - **do not use TFS if you can avoid it**.

_Disclaimer: The version I am using is quite dated, so some of the things I am going to say here might be out of date._

# Updates
The disclaimer above is one of the arguments against using TFS. The version I am using is about 4 years old. The company bought the license for hosted solution, but (I suppose) didn't get updates, so they're (and I am) missing on all the improvements. This does not happen with open source version control (not only git) - you can and should always have the newest version available.

# Branching
Branches in TFS are simply a copy of your code - it's just wrong. It makes them slow and cumbersome to use. You can't easily branch locally and test some code on a side. Everything is based on server, so it takes ages...

# .gitignore
I think this got resolved in newer versions, but the one I am using doesn't have a way to permanently ignore a file pattern. Every time I want to commit my changes, I need to manually select and exclude _packages_ folders and any other file I do not want to check in.

# Selecting changes (branches)
The consequence of the two points above is that when you want to check your files in, the pending changes screen shows you files from all branches you have synced with your workspace. You need to manually exclude all branches you don't want to commit at the moment.

# Everything is server based - sloooow
If you have used git, you know, it keeps everything regarding your repository locally, on your machine. With TFS it's different - everything is on the server. This means that when you want to browse source tree, or see history of changes to a single file, you need to browse to it and because it's all server based, it's painfully slow (at least compared to git). Same goes for merging - when you resolve conflicts, VS communicates with server every time you accept changes to a single file. And... maybe it's the server I am working on, but all the communications are slow. For example, accepting merge for a file takes about 20-30s. For a single file! Arghhh!

# Good things
To be fair it's not that it's all ugly. There are two nice things about using TFS. First, you get a work tracker in the package. You have a nice website, where you can create user stories or bugs and tasks. You get a kanban-like board, a burnout chart - all of this is nice, but again - slow... Another pretty good thing is the merge tool included in the Visual Studio. It's not as good as Beyond Compare or Araxis Merge, but much better than all the other free tools I've seen and it really does the job well.

# Summary
I think it's clear that these days **git is an industry standard**. Everyone knows it. Everyone knows how to use it. Because of that, there are many hosting options - free and paid, public and private. If you don't want to host your code in the cloud, you can easily set your own server up and running literally in minutes. You really should **use the best tool for the job**. In terms of version control this tool is definitely **git**.

