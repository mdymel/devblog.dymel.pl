---
layout: post
title: Angular2 and tests failing on detectChanges
date: '2016-04-19 16:14:34 +0200'
categories:
- Bugs
- Angular2
tags:
- angular2
- tests
- bug
---
I was working on an angular2 app at work today and stumbled on an error while testing. When I called

{% highlight js %}
fixture.detectChanges();
{% endhighlight %}

it was failing with: 

{% highlight js %}
detectChangesInRecords
runDetectChanges
_detectChangesInViewChildren
runDetectChanges
detectChanges
detectChanges
invoke@G:/Presentation/ShopWebsite/ShopWebsite/node_modules/angular2/bundles/angular2-polyfills.js:390:34
run@G:/Presentation/ShopWebsite/ShopWebsite/node_modules/angular2/bundles/angular2-polyfills.js:283:50
{% endhighlight %}

After two hours of debugging and googling it turned out that I had used component variable in normal style attribute: 

{% highlight html %}
<td id="sliderContainer" style="padding: 0 {{padding}}%;">
{% endhighlight %}

It was working completely fine in the browser, but failing in tests. The correct method is using [ngStyle] attribute: 

{% highlight html %}
<td id="sliderContainer" [ngStyle]="{'padding': '0 ' + padding + '%'}">
{% endhighlight %}

Now all the tests are passing fine :) 
