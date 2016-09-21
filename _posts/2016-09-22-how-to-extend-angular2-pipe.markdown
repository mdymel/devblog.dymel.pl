---
layout: post
title: How to extend Angular2 pipe  
date: '2016-09-22'
featured: /images/posts/2016-09-22-how-to-extend-angular2-pipe/featured.jpg
image: /images/posts/2016-09-22-how-to-extend-angular2-pipe/code.png
tags: 
 - angular2
---
Angular2 comes with some predefined pipes. For those of you, who don't know, pipe is a tool, which allows you to modify output of a property in the template. For example, to format date, price etc. Today, at work I had to come up with a solution, which would allow me to have a `DatePipe`, which format is configured in the application settings - based on a currently selected translation. I could write a new, custom DatePipe, but why should I invent a wheel. I decided to extend the `DatePipe`, which is coming with the angular and change its behaviour to suit my needs. It wasn't as straight forward as I thought it would be, so I am writing this post in case someone else has the same idea. 

First thing I tried was to extend the DatePipe and override the transform method. Unfortunately, it didn't work. Aparently, it stopped working in one of the RC versions. Another idea, which I found somewhere on StackOverflow, was to inject the DatePipe in the constructor of my Pipe and use it in my transform method. That worked fine! :) 

{% highlight typescript %}
@Pipe({
    name: "myDate"
})
export class MyDatePipe {

    constructor(private datePipe: DatePipe) {}

    transform(value: any): string {
        let format = "yyyy-MM-dd";
        return this.datePipe.transform(new Date(value), format);
    }
}
{% endhighlight %}  

The `format` variable is hardcoded here, but you can inject any other service and use it to get some other value. 

When you have your pipe created, there two things you need to modify in your AppModule. One is to add `MyDatePipe` in the `declarations` section, second to add `DatePipe` to `providers` - this is needed to make it available in the Dependency Injection. 

I have created a working example in the Plunker: [https://plnkr.co/edit/xwR4gZTVYJmkbj1NfZ11?p=preview](https://plnkr.co/edit/xwR4gZTVYJmkbj1NfZ11?p=preview). 