---
layout: post
title: Stop VisualStudio transpiling TypeScript on build
date: '2016-08-11 08:00:30 +0200'
image: /images/posts/2016-08-11-stop-visualstudio-compiling-typescript-on-build/featured.jpg
tags:
- angular2
- visualstudio
- typescript
---
I am currently working on an ASP.NET Core project, which also contains angular2 on the front end. As much as I like Visual Studio as a C# IDE (especially with Resharper), there are much better solutions for writing frontend code. I personally am using [WebStorm](https://www.jetbrains.com/webstorm/). I think it's amazing, especially with support from Angular2. To have a nice build package, I am using gulp to compile all the code and copy to wwwroot directory. I keep all the files frontend related (ts, scss, html, images etc.) in separate directory - gulp is processing everything and saves results to wwwroot. The problem is, by default Visual Studio will try to compile your typescript files and place result JS in the same directory it have found the ts file. Today I just wanted to quickly share a tip how to disable that feature.

You have to open xproj project file in some text editor and insert this xml there:

{% highlight plaintext %}
<PropertyGroup>
  <VisualStudioVersion Condition="'$(VisualStudioVersion)' == ''">14.0</VisualStudioVersion>
  <VSToolsPath Condition="'$(VSToolsPath)' == ''">$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)</VSToolsPath>
  <TypeScriptCompileBlocked>true</TypeScriptCompileBlocked>
</PropertyGroup>
{% endhighlight %}
After that, VS will reload your project and stop compiling your TS files automatically.

