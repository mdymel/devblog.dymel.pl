---
layout: post
title: Tabs vs spaces? EditorConfig to the rescue!
date: '2018-01-29'
featured: /images/posts/2018-01-29-tabs-vs-spaces-editorconfig/featured.jpg
image: /images/posts/2018-01-29-tabs-vs-spaces-editorconfig/social.jpg
tags: 
 - tools
---
When you work in a team, you all have to decide, how you are going to format your code in the project. Everyone has their own favourite editor, IDE and own preferences regarding tabs, sometimes even charsets. Very often it's hard to convince everyone to change settings in their editors. That's when EditorConfig comes in handy. 

# What is EditorConfig? 
> EditorConfig helps developers define and maintain consistent coding styles between different editors and IDEs. The EditorConfig project consists of a file format for defining coding styles and a collection of text editor plugins that enable editors to read the file format and adhere to defined styles. EditorConfig files are easily readable and they work nicely with version control systems.

In simple words... You can have a file in your project, which describes the style you agreed to write the project in. 

# What can you specify? 
There are many properties you can use. All are described in the [projects wiki](https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties). Most common allow you to specify indent size and style (tab or space), charset, end of line (lf, cr or crlf). You can also have separate setup for different types of files (ex. different indent size for C# and JS files). 

# Which editors support the config files? 
Most of editors come with EditorConfig support built in. These include Visual Studio, IntelliJ IDEA, WebStorm. For others, there's usually a plugin available (AppCode, Coda, Eclipse, Emacs, Sublime Text, Visual Studio Code). Head to the [projects website](http://editorconfig.org/#download) to check if you need a plugin. 

# How to...?
To enable editor config in your project you just have to place `.editorconfig` file in your projects top directory. You put all the rules there and check it in to the repository, so your team mates can use it too. This is an example config file: 

{% highlight yml %}
# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
indent_style = tab
indent_size = 4

# Set default charset
[*.js]
indent_size = 2
{% endhighlight %}

This config sets some common properties for all files (`*`) and then specifies indent size of 2 chars for `*.js` files. Again - head over to [projects website](http://editorconfig.org/#file-format-details) to see all possible settings. 

# Summary
One of the more annoying things when you work on a project in a team is when you have one member with some weird editor config. For example who uses tabs instead of spaces (like a normal human being ;)). With `.editorconfig` file you can all agree the format you're going to use and automatically make all editors in the team use it. What other tools do you use to make team work better? 