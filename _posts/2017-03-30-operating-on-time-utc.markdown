---
layout: post
title: 'Operating on time - why UTC'
date: '2017-03-30'
image: /images/posts/2017-03-30-operating-on-time-utc/featured.jpg
tags: 
- dajsiepoznac2017
---
Last weekend, we've had to adjust all of our watches in Europe to the Daylight Saving Time. On this occasion, we were moving an hour forward, which is not a big deal for IT systems. It's much worse in October when you move back in time and have 2.30 two times during one night. I won't be disputing if we should get rid of DST. Instead, I would like to show you how to deal with it in IT properly. 

1. TOC
{:toc}

# Time continuity problems 
In IT, you want things to be precise. If a user places an order, you want to know exactly when he did that. When there is an error, you need to know the time it happened. Same with various events in the system. Imagine banks, hospitals, trading systems. Time is very important information. There are concepts that make it harder to keep track of time for developers. 

## Daylight Saving Time
For one, it is the DST problem I mentioned in the introduction to this post.

> Daylight saving time (DST) is the practice of advancing clocks during summer months by one hour so that evening daylight lasts an hour longer while sacrificing normal sunrise times. Typically, regions that use Daylight Savings Time adjust clocks forward one hour close to the start of spring and adjust them backwards in the autumn to standard time.
>
> Wikipedia

 If something happens between 2 and 3 on the last Saturday of October (in Europe), you can not be sure, in exactly which moment it did happen. I once had a problem, I wanted to deserialize date stored in the database and .NET threw an exception saying it was ambiguous. It was during the time change... 

## Time zones
If you write a system, which is used around the globe, you have to deal with time zones. Let's say you are running Facebook and a user in the Philippines adds a comment at 0.30AM. At the same time, his friend from London reads it. Facebook tells the London fella the comment was written at 5.30PM. Because they do track time zones between users. It's even more tricky if you add DST problem here because different countries deal with it differently. 

Even you don't have users around the world, imagine you have a site, which is hosted in the cloud in another time zone. If you save the date using local time (in .NET that would be `DateTime.Now()`), you have to adjust this date to the timezone your users are living in. Situation complicates more if your database does not store information about the time zone for DateTime (for example, older versions of MS SQL). Then you're in the dark and have to adjust times by adding hours. Don't go this road...

# UTC to the rescue
Fortunately, there is a concept of the **Coordinated Universal Time**. It is the primary time standard by which the world regulates clocks and time. It does not observe daylight saving time and, by its nature, does not have time zones. What it means is, if you save an event with the time in the UTC format, you will always know the exact moment it took place. If you have users from around the world, you can adjust the time you display to their timezone. 

So I advice you to forget about `DateTime.Now()` (if you're using .NET) and switch entirely to `DateTime.UtcNow()`. This can save you some trouble in future. There is also a `DateTimeOffset` structure in .NET, which is supported by EntityFramework and SQL Server (from the 2008 version), in my opinion, every system should use UTC in the backend. It's the only way to be certain about time. You can worry about timezones and DST in the frontend. But servers should operate on Universal Time.

I think it's also worth to mention two libraries, which are very helpful when working with time: 

 * for .NET it's [Noda Time](http://nodatime.org/) - a better date and time API for .NET
 * for Java equivalent - [Joda Time](http://www.joda.org/joda-time/)
 * for JavaScript - [Moment.js](https://momentjs.com/) - very helpful in parsing and working with dates and times

How do you deal with time and these problems? 