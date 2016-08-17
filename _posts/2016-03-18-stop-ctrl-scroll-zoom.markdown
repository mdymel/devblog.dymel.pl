---
layout: post
title: How to disable ctrl scroll zoom
date: '2016-03-18 07:00:27 +0100'
image: /images/posts/2016-03-18-stop-ctrl-scroll-zoom/featured.jpg
tags:
- tools
- tips
- autohotkey
- productivity
---
A few weeks ago, my mouse started to act up. Sometimes it didn't track the cursor properly, sometimes it didn't respond to click etc. It seemed like a problem with the connection. It was a few years old Logitech laser mouse, so maybe it was time to get something new. I did some research and found a [Logitech MX Master](http://www.logitech.com/en-us/product/mx-master). I know! I even like the name :) Then, after a few days, Scott Hanselman wrote a post titled [Finding the Perfect Mouse](http://www.hanselman.com/blog/FindingThePerfectMouse.aspx), where he said MX Master was the best mouse he had found. That was it for me - the next day I had it on my desk.  

And... It is really, really great - it feels good in the hand, no problems with connection etc. It also has a feature, my previous mouse had too: smooth scroll. I liked it before and still like it now - it feels much better than those old style click-click-click scrolling mouse wheels. The one in the MX Master is even more sensitive than the one I had before, which seemed amazing at first...  

But then, you go to Chrome, select some text, press CTRL+C and suddenly your page is zoomed by 500%. You realize, you pressed CTRL when the wheel was still scrolling a bit. You hit CTRL+0 and are back to normal. Unfortunately, after few a days of such problems it gets really annoying.  

Today I decided to find a solution!  

There is no option in windows to disable CTRL+scroll zoom. No option in Chrome, neither in Visual Studio. Fortunately, I have found a nice piece of software called [AutoHotKey](https://autohotkey.com/). You can do loads of things with it:  

* Automate almost anything
* Remap keys
* Create hotkeys
* Etc.

It turned out it took three lines in the script to disable CTRL+scroll zoom in the whole of windows:  

{% highlight conf %}
#MaxHotkeysPerInterval 500
^WheelDown::return
^WheelUp::return
{% endhighlight %}

You just save this in a file, double-click it to run the script and the problem is gone :) 

I highly recommend you try AutoHotKey for that or any other automation tasks in windows. What are your secret tips to make windows less annoying? 


