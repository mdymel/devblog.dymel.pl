---
layout: post
title: 'ASP.NET Core in docker with GitLab Pipelines'
date: '2017-07-11'
featured: /images/posts/2017-07-11-aspnetcore-docker-gitlab/featured.jpg
image: /images/posts/2017-07-11-aspnetcore-docker-gitlab/social.png
tags: 
- aspnetcore
- docker
- gitlab
---
A few months ago I have started working on a new, greenfield, project. Since it's a one-man job, it was crucial for me to have an easy setup without big dev-ops needs - especially in the early beta stage. I decided to use Docker because I could automate the building process using pipelines in GitLab and Docker Cloud for deployment. Today I would like to show you how to setup Continous Integration for an ASP.NET Core project using GitLab pipelines. 

1. TOC
{:toc}

# Creating new app 
To create a new application, you can use `dotnet new web` command. It creates an empty web application, which does one thing - displays famous `Hello World`. To start it you need to first restore all the dependencies with `dotnet restore` and then issue `dotnet run`: 

![dotnet new command](/images/posts/2017-07-11-aspnetcore-docker-gitlab/dotnetnew.png)

# Docker  
You now have an application. Let's containerize it. To build a Docker image, you need to create a `Dockerfile`. It's a set of instructions for Docker so it knows how to create an image. You can read more about Docker files in the [official docs](https://docs.docker.com/engine/reference/builder/). There's also a very nice post by Jakub Skałecki with tips on how to [write better docker files](https://rock-it.pl/how-to-write-excellent-dockerfiles/).


Official Docker images for ASP.NET Core are available on the Docker Hub and there are few options to choose from: 

 * [microsoft/dotnet](https://hub.docker.com/r/microsoft/dotnet/) - this is a base .NET Core image. You can use it to build and run all types of .NET Core applications.
 * [microsoft/aspnetcore](https://hub.docker.com/r/microsoft/aspnetcore/) - this image is optimized for running ASP.NET Core applications. It contains .NET Core and a set of native images for all of the ASP.NET Core libraries, so that these libraries don't have to be compiled by JIT, which gives you faster cold start of your application. 
 * [microsoft/aspnetcore-build](https://hub.docker.com/r/microsoft/aspnetcore-build/) - it also contains all of the ASP.NET Core stuff, but also an SDK, which allows you to build apps in the container. It also has Node.js, Gulp and Bower. 

Because we are going to use GitLab Pipelines, which don't have dotnet SDK preinstalled, you will build the application in the container. Therefore you need the `Microsoft/aspnetcore-build` image. When the application is built you will use simple `Microsoft/aspnetcore` image for running the application. 

## .dockerignore
Format and purpose of this file are identical to `.gitignore`. It's a way to tell Docker, which files or directories you don't want it to copy to your container. In our case, it's just two folders for now. In a real app, you might want to add things like `node_modules` etc. 

{% highlight console %}
bin/
obj/
{% endhighlight %}

## Dockerfile
This is the most important file in the docker world. It tells the Docker engine how to build your image. 

{% highlight dockerfile %}
# Stage 1
FROM microsoft/aspnetcore-build AS builder
WORKDIR /source

# caches restore result by copying csproj file separately
COPY *.csproj .
RUN dotnet restore

# copies the rest of your code
COPY . .
RUN dotnet publish --output /app/ --configuration Release

# Stage 2
FROM microsoft/aspnetcore
WORKDIR /app
COPY --from=builder /app .
ENTRYPOINT ["dotnet", "aspdocker.dll"]
{% endhighlight %}

As you can see, there are two stages. In the stage one we're using the build image and then, when it's done we copy the artefacts to the regular aspnetcore image. 

First, we just copy the `csproj` file and run `dotnet restore`. If you wonder why we don't copy the whole app at once, it's because of the way docker caches stages during the build. If it detects the files didn't change from the last build, it will use the cached image. Project files rarely change, but you probably will have changes in other files. Copying only the project file allows us to use cached stage from the `dotnet restore` command, which is time-consuming. 
Next, we copy the rest of the application and publish it to the `/app` folder. 

The second stage uses plain `aspnetcore` image and gets build artefacts from the `app` folder.

## Running 
You can test your new image by running: `docker run -it -p 5000:80 aspdocker`

# GitLab Pipelines
Gitlab has an amazing feature of pipelines. It allows you to run jobs after each commit. You can use them to build your apps, run tests etc. Read more about them in [their docs](https://docs.gitlab.com/ee/ci/pipelines.html). It's worth to notice it's a free feature. 

You define your build in the `.gitlab-ci.yml`. We will start with something, which will just build our docker image: 

{% highlight yml %}
image: docker:latest

variables:
  DOCKER_DRIVER: overlay
  CONTAINER_TEST_IMAGE: mdymel/aspdocker:$CI_BUILD_REF_NAME

services:
- docker:dind

stages:
- build

build:
  stage: build
  script:
  - docker build -t $CONTAINER_TEST_IMAGE .
{% endhighlight %}

This will simply run the `docker build` command in the context of our repository. When you commit this file to a GitLab repository, you will notice a green check in the commits list: 

![gitlab commit](/images/posts/2017-07-11-aspnetcore-docker-gitlab/gitlab-commit.png)

# Adding tests project
Now, when we have a running CI, which builds our project, it's time to add support for tests. To do that, I have created an `src` directory, where I have moved the `aspdocker` project and added another one called `aspdocker.tests`. I also had to modify the Docker file a little to support different paths, but in general, to support running tests, I had to add one significant line to `Dockerfile`: 

{% highlight dockerfile %}
RUN dotnet test ./src/aspdocker.tests/aspdocker.tests.csproj
{% endhighlight %}

I have added it before the `dotnet publish` command so that if tests fail, the processing will stop and for a change, you will get red cross next to your commit: 

![pipeline failed](/images/posts/2017-07-11-aspnetcore-docker-gitlab/gitlab-commit-failed.png)

You can see all changes made here in the [GitLab commit](https://gitlab.com/mdymel/aspdocker/commit/ae91061fa143a61e52281bf66987676f020af6f4).

# Summary
We now have an ASP.NET Core project, which is built and tested after each commit to the repository. We also have a docker image being built, which in the next post we will push to Docker hub repository and deploy to a Virtual Machine automatically using Docker Cloud. 