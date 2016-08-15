---
layout: post
title: Becoming a better developer with NDepend
date: '2016-07-18 08:00:52 +0200'
image: /2016-07-18-becoming-a-better-developer-with-ndepend/featured.jpg
categories:
- Productivity
- .NET
tags:
- .net
- tools
- ndepend
---
Every good developer knows, there are certain rules one should follow when writing software. There are many books written on this subject and many principles. All of it is meant to help us write software, which is easier to maintain in a long run. Unfortunately, sometimes it's not easy to follow all these rules consistently. We forget ourselves and create a little mess, we then need to live with. This is, when tools come in handy. Tools that exist to help us find problems in our code.

I would like to present one of such tools today: [NDepend](http://www.ndepend.com/).

# About NDepend
NDepend is a tool meant to help you build a better code. It does that by analysing your projects and showing where you can improve. It is packed with features - from checking code rules like naming conventions, design improvements or visibility of your types, through traditional code metrics (lines of code, cyclomatic Complexity, coupling) to change tracking, so you can actually see on a graph, if the changes you make are going in the right direction.

# Installation
There are few ways you can use NDepend. The easiest one is to install it as an extension in the Visual Studio. This way you have easy access to all the features right from your IDE. If you don't want add anything to VS, there is a standalone application which analyses assemblies you point it to. Third, a&nbsp;very interesting option is an integration with Continuous Integration tool you use - like TFS or TeamCity. This way you can get information and warnings after every change you push to your repository.

# Dashboard
When you first start the tool, you are shown a Dashboard:

![NDepend dashboard](/images/posts/2016-07-18-becoming-a-better-developer-with-ndepend/dashboard.jpg)

It displays the most important information about your project - basic metrics, a&nbsp;number of code rules violations and graphs presenting trends in your code. It's a great place to start analysing your project. You also get a web version of the report which opens automatically in your browser after NDepend is finished analysing your project.

# Code rules
In my opinion, one of the most useful features of NDepend is Code Rules analyser. When you go to the dashboard, its results&nbsp;are presented in one of the boxes:

![NDepend Code rules](/images/posts/2016-07-18-becoming-a-better-developer-with-ndepend/code-rules.png)

You can immediately see how you're doing in your project and what are the problems in your code. From there you can go to a view where you can check details and find exactly where the problem is:

![NDepend Code rules details](/images/posts/2016-07-18-becoming-a-better-developer-with-ndepend/code-rules-details.png)

![NDepend Code rules methods](/images/posts/2016-07-18-becoming-a-better-developer-with-ndepend/code-rules-methods.png)

After you fix these problems, you can run the analyser again and see the progress on the dashboard graphs.

# Diagrams
Apart from code metrics, you also get a set of diagrams showing dependency relations in your code:

![NDepend Component Dependencies Diagram](/images/posts/2016-07-18-becoming-a-better-developer-with-ndepend/ComponentDependenciesDiagram.jpg)

And a heatmap showing you size of components (in lines of code) and cyclomatic complexity:

![NDepend Visual NDepend View](/images/posts/2016-07-18-becoming-a-better-developer-with-ndepend/VisualNDependView.jpg)

# Summary
The amount of features of NDepend is really overwhelming. The ones I mentioned above are the most important for you to improve your projects and yourself as a developer. I think it's worth to note a few others, which I also see as very useful:

* You can create your own code rules and hook them up to the analyser/li>
* There are integrations available for most popular continuous integration tools/li>
* You can hook it up to test coverage reports/li>
* Code queries using LINQ - query your code metrics

I hope what I have shown above got you at least a bit interested in the NDepend. I think it's a brilliant software and I highly encourage you to try it out. There is a two weeks trial available, and you only need minutes to start using it. So go on and [**get it now**](http://www.ndepend.com/Download.aspx)!

