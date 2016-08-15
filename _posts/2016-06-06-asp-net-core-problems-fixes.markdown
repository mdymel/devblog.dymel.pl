---
layout: post
title: ASP.NET Core - problems and fixes
date: '2016-06-06 08:03:15 +0200'
categories:
- .NET
- ASP.NET Core
tags:
- aspnetcore
---
I am working on a project based on ASP.NET Core for few months already. During this time I've had various problems I had to fix. Recently I converted my application to RC2 version release few weeks ago. I thought it might be good idea to write a post listing problems I had with an information how to fix them. I hope there will be some people who will find it useful.

# Problem starting you application
You can build your app, but get an exception when starting it:

{% highlight plaintext %}
An unhandled exception of type 'System.TypeLoadException' occurred in Program.exe

Additional information: Method 'get_Sources' in type
{% endhighlight %}

Solution:

* check if all packages are rc2-final - you might have an old rc1 reference hidden somewhere
* Run dotnet restore --no-cache
* remove configuration packages from %userprofile%\.nuget\packages and run dotnet restore again

# Adding 'old' class library project as a reference
I work on a project where I am using 'old style' class library projects. Visual Studio still has problems adding such references to asp.net core projects and gives you an error 'Unable to resolve dependency'. This is how you can fix this:

1. Close Visual Studio
1. Delete all wrap folders in the solution
1. Delete all global.json files in the solution
1. Temporarily delete all sln files in subfolders of the solution
1. Call dnu wrap ...csproj for all dependency projects
1. Call dnu restore
1. Open Visual Studio again.

# Visual Studio doesn't see referenced class library project
If Visual Studio 2015 doesn't see class library project you have referenced, but building works just fine. It may be a problem with project.lock.json files:

1. close Visual Studio
1. delete all project.lock.json files in solution
1. open VS

# EntityFramework Core migrations in Class Library projects
EF Core preview1 tools don't support running migrations from class library projects. Unfortunately there is no fix for that problem. You need to create a temporary application project, where you will copy your db context and models classes and run your migration commands.

# Other posts
You might also be interested in these posts about ASP.NET Core:

* [Return 401 Unauthorized from ASP.NET Core API](/2016/07/07/return-401-unauthorized-from-asp-net-core-api)
* [Status Code with empty response in ASP.NET Core](/2016/06/29/asp-net-core-status-code-empty-response/)

