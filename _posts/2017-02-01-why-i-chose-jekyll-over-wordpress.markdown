---
layout: post
title: Why I chose Jekyll over WordPress
date: '2017-02-01'
featured: /images/posts/2017-02-01-why-i-chose-jekyll-over-wordpress/featured.jpg
image: /images/posts/2017-02-01-why-i-chose-jekyll-over-wordpress/featured.jpg
tags: 
 - blogging
 - jekyll
---
I have started this blog nearly a year ago. It was my Nth attempt to start blogging and this time I've decided to take the easiest approach. I've setup bare WordPress instance with a default template. I wanted to start blogging first and then worry about how it looks. After few weeks, when I knew I want to carry on, I decided to take care of the design. I got a better template and added some plugins. After some time of playing with WordPress, I had enough and started looking for alternatives. That's when I found Jekyll. Read on to see why I loved it then and wouldn't go back after 6 months of using it. 

1. TOC
{:toc}

# WordPress is a beast! 
I believe it can be great for big blogs, which do use many options it provides. However, for a small blog, like mine, it was too overwhelming. At a first sight, you feel it gives you everything you need. This moment lasts until you want to make a change or two. I would like to go through some of the problems I've had and contrast it with Jekyll. 

# Setup and hosting  
WordPress was first released in 2003. It is written in PHP and uses MySQL as its main database. So it's a standard LAMP stack. 
Jekyll, on the other hand, is a static site generator. What it means is, that when you're finished working with your blog, you can generate it with Jekyll application and end up with a set of static files (HTML, images, CSS etc.). You can put these files on any HTTP server and you're done. It's also possible to host it on GitHub Pages, which gives you Continous Integration out of the box. When you commit a new post, GitHub automatically builds your site and updates it on the server. One thing to add is, GitHub Pages hosting is completely free! 

# Keeping track of changes 
If you make a change in WordPress setup, it's saved and that's it. You can't revert it from the history. 
Because Jekyll is based on files, you can (and should!) easily track your changes with git (or any other VCS). I host my blog on [GitHub](https://github.com/mdymel/devblog.dymel.pl), where you can easily check the whole history. If I ever want to revert something I did, it's just a matter of finding it in git. 

# Templates 
Keeping track of changes was a great problem in working with templates. When you install a new template in WordPress, it saves as files in your WP directory. You can edit these files via the admin panel, but if you ever update the template, or install another one, all your changes are gone. For example, if you had a Facebook tracking pixel there, it would be gone. 
In Jekyll, there is no such issue. Everything is file based, so if you make a change, it stays forever in git. 

# Performance
My default WordPress installation was very slow. And I mean over a second to get a first response slow. Remember I've had about 10-20 posts then. I had to add a cache plugin to make it reasonable. And you know, what are two most difficult things in IT? Naming things and... cache invalidation. There were always problems. I changed the image and the old version was stuck in cache. 
Jekyll... static files. Nothing can beat that ;) 

# Text Editor
WordPress has it's own WYSIWYG editor built in. I saw two problems with it. First, I never trusted it enough to write posts there. I was afraid it would loose text somehow. Secondly, the editor was acting weird sometimes when I was applying styles to text. 
Jekyll uses markdown, so it's again - everything is just text - plain and simple. 

# Summary - Simplicity of Jekyll 
I have to say, blogging is really more pleasant since I am working with Jekyll. For example, when I was preparing a new blog post, I used to write it in Google Docs, then export to Windows Live Writer - at this point, it was usually losing the styles from Google Docs, so I had to mark headers again. From there I exported posts to WordPress, where I would check if everything is OK and post it. 
Now, I write posts in a simple text editor (VisualStudio Code), push it to GitHub and that's it! If I want to put an image in my post, I save the image in `images` directory, put it in text using markdown syntax and I am sure what size it is going to be. In WordPress, you have an uploader, which scales images to few sizes. 
I think the main thing I love in Jekyll is that I now feel I have complete control over my blog. With WordPress, there was the main application, template, plugins - lots of moving parts.  
Unless you have a big website, which uses lots of WordPress features, Jekyll, or some other static website generator is really a great option, which simplifies a lot of work you have to do with a blog. I highly recommend it. 

# Links

 * [Jekyll](https://jekyllrb.com/) homepage
 * [this blog git repository](https://github.com/mdymel/devblog.dymel.pl) - feel welcome to copy some of my solutions 
 * [Hugo](https://gohugo.io/) - another static website generator
 * [Jekyll Themes](http://jekyllthemes.org/) - library of themes for Jekyll 
 * [Jekyll Plugins](https://jekyllrb.com/docs/plugins/)
 * [Jekyll on GitHub pages](https://help.github.com/articles/using-jekyll-as-a-static-site-generator-with-github-pages/)