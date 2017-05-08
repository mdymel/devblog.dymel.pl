---
layout: post
title: 'Creating nuget packages in .NET Core'
date: '2017-05-09'
featured: /images/posts/2017-05-09-creating-nuget-packages/featured.jpg
image: /images/posts/2017-05-09-creating-nuget-packages/social.png
tags: 
- dajsiepoznac2017
- netcore
---
Since last week, my [Stactive](https://github.com/mdymel/stactive) library is functional. It learned how to log request information to MongoDb. I decided, it is time to make it available as Nuget packages - partially to learn how to do it and write this blog post. If you want to see how easy it is, read on. 

# Project structure 
Stactive is currently split into 3 parts: 
 
 * **Stactive.Core**, which contains models and shared interfaces, for example, `IPersistence`
 * **Stactive** - main project, where all the magic happens
 * **Stactive.MongoDbPersistance** - currently the only implementation of the persistence layer

Such layout allows me to create many packages implementing persistence and adding only the needed ones to the target project. Thanks to that, when I decide to use SQL Server to storing logs and events, I don't add MongoDb driver dependency. I discussed plugins in ASP.NET Core Middlewares in the [previous post](/2017/05/03/aspnetcore-middleware-plugins/).

# Building packages 
The latest version of VisualStudio 2017, can produce NuGet packages when you build the project. It's very handy at the beginning. Later on, I will maybe add some sort of Continous Delivery, but for now, this will do the job. I definitely don't want to post a new package version with each commit. 

To enable this feature, you need to select the **Generate NuGet package on build** checkbox in the project properties: 

![genearate package](/images/posts/2017-05-09-creating-nuget-packages/generate-package.png)

Then you should fill all the information about the project, like the description, author, project URLs etc. 

An important bit is a version number. You have to decide, which system you want to use. You can read more about, how NuGet reads version numbers [here](https://docs.microsoft.com/en-us/nuget/create-packages/dependency-versions), but the important thing is, it's best to keep the system consistent throughout all packages used by the project. So, in my case, all 3 packages have now version number 0.1.1.

# Fixing dependency versions 
After I filled everything in and built my projects (remember to set the configuration to **Release**),the `bin/Release` folder contained a file `Stactive.0.1.1.nupkg`. You can view contents of this file, using a very nice tool called [Nuget Package Explorer](https://github.com/NuGetPackageExplorer/NuGetPackageExplorer): 

![Nuget Package Explorer](/images/posts/2017-05-09-creating-nuget-packages/package-explorer.png)

There was one problem with my package. The reference to `Stactive.Core` project was set to version `1.0.0`. As I said before, I wanted it to be `0.1.1`, so the package manager would not find version `1.0.0`. I didn't manage to get it to build the package with a correct version number, but you can easily edit this with **Nuget Package Explorer**: 

![Edit dependencies](/images/posts/2017-05-09-creating-nuget-packages/edit-dependencies.png)

After I fixed it, the package was ready to be uploaded. 

# Publishing 
There are few options here. You can use the official [nuget.org](https://www.nuget.org/) repository, others, like [myget](https://www.myget.org/) (it has an option of creating a private feed). You can also create your own, [private NuGet server](https://docs.microsoft.com/en-us/nuget/hosting-packages/overview). 

I want my project to be easily accessible, so I chose the official repository. To use it, you need to create an account (free) and you're ready to [upload your first package](https://www.nuget.org/packages/manage/upload). After you do that, the package is available but will be searchable after few hours, when it's indexed. 

![Manage packages](/images/posts/2017-05-09-creating-nuget-packages/manage-packages.png)

As you see, the `Stactive.Core` package is not listed in searches. It's because it is not useful on its own - it's just needed by other packages. 

# Summary
If you have and open source .NET Project, which is some kind of a library and it's in a usable state, it's worth to make it available as a NuGet package. As you've seen here, it's very easy to create and upload them to the repository. You spent a lot of time developing your projects - in these few steps you can allow others to use then easily. 