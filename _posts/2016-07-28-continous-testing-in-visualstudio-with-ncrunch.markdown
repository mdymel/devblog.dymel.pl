---
layout: post
title: Continous testing in VisualStudio with NCrunch
date: '2016-07-28 08:00:56 +0200'
image: /images/posts/2016-07-28-continous-testing-in-visualstudio-with-ncrunch/featured.png
categories:
- Productivity
tags:
- testing
- tools
- ncrunch
- tdd
---
Last week, I have recommended a tool for analyzing .NET projects called [NDepend](/2016/07/18/becoming-a-better-developer-with-ndepend/). Today, I would like to present another, amazing piece of software called [NCrunch](http://www.ncrunch.net/). It's a plugin for Visual Studio, which, compiles your code in the background and runs all tests found in the solution. Of course you can tell it which projects it should monitor or which tests it should run, but the idea is that whenever you modify a single line of code, NCrunch knows what it has to compile, which test is covering this line and it immediately executes tests affected by your modification. And it's fast. Incredibly fast.

# General concept
When writing unit tests, I always found it annoying that you have to run them manually. Obviously there are ways to make it easier, like using shortcuts, but you still have to wait for Visual Studio to build the project and run all the tests. When your solution gets bigger it can really take a lot of your time. That's why I was so amazed when I saw how fast it can be with NCrunch.

In this place, I would like to quickly demonstrate how it works. Apart from the main view with a list of projects and tests, NCrunch uses colored dots next to each line of code.

![NCrunch dots](/images/posts/2016-07-28-continous-testing-in-visualstudio-with-ncrunch/dots.png)

There are four types of dots:

* White - line not covered by any tests
* Red - line covered by failing tests, red x means the line which is failing
* Green - line covered by passing tests
* Yellow - tests is passing, but the line takes long time to run

![NCrunch coding](/images/posts/2016-07-28-continous-testing-in-visualstudio-with-ncrunch/coding.gif)

Here you can see it in action. We start with an empty test and a method without the implementation. We add test body and immediately see it fails - both method and tests are marked with red dots. When we add method body, everything is green.

For me, the biggest advantage of NCrunch is the immediate feedback about changes I make in the code.

# Performance metrics
One of the additional features you get is instant performance metrics.

![NCrunch preformance metrics 1](/images/posts/2016-07-28-continous-testing-in-visualstudio-with-ncrunch/performance-metrics-2.png)

Every line of your code which takes longer to run gets marked with a yellow dot.

![NCrunch preformance metrics 2](/images/posts/2016-07-28-continous-testing-in-visualstudio-with-ncrunch/performance-metrics-2.png)

When you hover over it, you get detailed information on the number of tests covering this line and execution time.

# Code coverage
![NCrunch code coverage](/images/posts/2016-07-28-continous-testing-in-visualstudio-with-ncrunch/metrics.png)

As you'd expect from a tool running your tests, you also get detailed information about the code coverage and basic metrics, which you can expand to a class level.

What is more important than that, NCrunch encourages improving your test coverage:

![NCrunch uncovered](/images/posts/2016-07-28-continous-testing-in-visualstudio-with-ncrunch/uncovered.png)

Lines that are not covered by any tests, get while dot next to them. It's like they're calling 'Test me! Test me!' ;) Fun aside, it's very useful reminder.

# Distributed processing
One of the possible problems with NCrunch is performance. Every change of code triggers compilation of the project. I can't notice anything on my Core i7 PC, but I did before on older PC. Fortunately, there is a solution for this. NCrunch comes with support for distributed processing. You can set it up to run your tests on a remote server. To do so, you just need to install .NET SDK and NCrunch DIstributed Processing on a server, point your NCrunch to it and all your tests are run remotely there. I've been using this with a team of 5 people on some older PC and it was performing great. What it does is send your code to the server and do the compilation and processing there. Your PC is just responsible for transferring data through the network, so it costs nearly nothing of your CPU time.

# Summary
For me NCrunch is one of the two best additions to Visual Studio (R# is the other one). If you are writing tests for your code, you have to try it out and I guarantee you're going to love it. Every IDE gives you ability to see syntax errors you make. NCrunch does the same with the tests. Go to [**download page**](http://www.ncrunch.net/download) now and get a free trial version - it works for two weeks. There are only two downsides of NCrunch for me. One is the lack of support for .NET Core. The author says he's waiting for the dotnet cli tools to be stable, which is fair enough I think. The other one is the price. While $159 for a named license is not so bad, the company seat one for $289 is rather expensive for many. However when you see, how complete this piece of software is, with very detailed configuration options, you start to get, why it's so pricey. 

