---
layout: post
title: How to create a category RSS feed in Jekyll
date: '2017-02-09'
featured: /images/posts/2017-02-09-category-rss-feed-in-jekyll/featured.jpg
image: /images/posts/2017-02-09-category-rss-feed-in-jekyll/featured.jpg
tags: 
 - blogging
 - jekyll
---
Initial Jekyll installation comes with a predefined RSS feed for your last 10 posts. Sometimes, you might need a feed for a single category. It's very simple and I will show you how to do it. 

# RSS with all posts in category "Jekyll"

When you create a new Jekyll site, it contains a `feed.xml` file: 

{% highlight liquid %}
{% raw %}
---
layout: null
---
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{{ site.title | xml_escape }}</title>
    <description>{{ site.description | xml_escape }}</description>
    <link>{{ site.url }}{{ site.baseurl }}/</link>
    <atom:link href="{{ "/feed.xml" | prepend: site.baseurl | prepend: site.url }}" rel="self" type="application/rss+xml"/>
    <pubDate>{{ site.time | date_to_rfc822 }}</pubDate>
    <lastBuildDate>{{ site.time | date_to_rfc822 }}</lastBuildDate>
    <generator>Jekyll v{{ jekyll.version }}</generator>

    ...

  </channel>
</rss>
{% endraw %}
{% endhighlight %}

As you see, it's a simple XML file using `Liquid` templates features. 

The main part of this file is a `for` loop, which generates all the feed items: 

{% highlight liquid %}
{% raw %}
    {% for post in site.posts limit:10 %}
      <item>
        <title>{{ post.title | xml_escape }}</title>
        <description>{{ post.content | xml_escape }}</description>
        <pubDate>{{ post.date | date_to_rfc822 }}</pubDate>
        <link>{{ post.url | prepend: site.baseurl | prepend: site.url }}</link>
        <guid isPermaLink="true">{{ post.url | prepend: site.baseurl | prepend: site.url }}</guid>
        {% for tag in post.tags %}
        <category>{{ tag | xml_escape }}</category>
        {% endfor %}
        {% for cat in post.categories %}
        <category>{{ cat | xml_escape }}</category>
        {% endfor %}
      </item>
    {% endfor %}
{% endraw %}
{% endhighlight %}

To have a category RSS feed, you need to create a copy of this file with a different name, for example, `feed.jekyll.xml` and modify the `for` statement: 

{% highlight liquid %}
{% raw %}
    {% for post in site.tags["jekyll"] %}
{% endraw %}
{% endhighlight %}

This will create an RSS feed with all posts (not limited to 10) in the `jekyll` category. 

[Here](https://github.com/mdymel/devblog.dymel.pl/blob/master/feed.jekyll.xml) you can find the whole file in my blog. 


# One more thing - faster serve generation
If your Jekyll site or blog grows, you might have noticed, it takes more and more time to generate the site. It's very inconvienient, when you test changes in the browser using `jekyll serve` command. There are two very useful parameters to speed it up: 

{% highlight bash %}
jekyll serve --future --limit_posts=10 --incremental
{% endhighlight %}

 * `--limit_posts=10` - tells jekyll to generate only the last 10 posts 
 * `--incremental` - makes it process just the changed files

For me (about 50 posts) it improves generating time from more than 25 seconds to less than 1 second.

I hope you find it useful. 