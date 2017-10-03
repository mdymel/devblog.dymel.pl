---
layout: post
title: 'Angular app in docker'
date: '2017-10-04'
featured: /images/posts/2017-10-04-angular-in-docker/featured.jpg
image: /images/posts/2017-10-04-angular-in-docker/social.png
tags: 
- angular2
- docker
---
Last two posts were about docker and ASP.NET Core. Since my focus is now split between those two and Angular, I thought I would write a post about how to create a docker image with an Angular app. You will learn how to create an efficient Dockerfile, which will run tests and build your app using the Angular CLI. 

If you follow my blog, you know I am a fan of the Angular CLI. I delivers all I need in terms of testing and building my apps out of the box. The only thing which not supported is Universal apps, but that's coming soon too. So I really encourage you - if you don't have a good reason not to, just make use of the CLI. Life is better this way. 

I won't go through details of how Docker works or how to create Dockerfile. If you don't have this knowledge, you can go through official docs or various posts touching this topic. 

# What makes a good Dockerfile?
For me, there are few things I want my Dockerfiles to accomplish: 
 1. Fast build process - each time I commit a change, the CI is building a new Docker image. I want this to be as quick as possible. 
 1. No dependencies - it should be possible to build with just the source code from git. 
 1. The build should fail if there are tests that do not pass.
 1. Resulting Docker image should be as small as possible - if I need chrome for running tests, I don't want it ending up in the final image.  

 # Speed 
 Each time you build an image, docker is trying to use cached layers to speed things up. Before executing each step (line of Dockerfile) it checks if anything has changed since the last time you built this image. For example, if the first step of your Dockerfile is `COPY . /app`, docker will probably have to run the whole process from scratch. If you first copy just `package.json` file, the `npm install` step will only be executed if you installed or upgraded some packages. 

# Running tests (and speed again)
You can use PhantomJS here, but I find Chrome much faster in executing Karma tests. With these few lines you can install Chrome in your Docker image: 

{% highlight dockerfile %}
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y google-chrome-stable
{% endhighlight %}

This is how you can instruct Karma to execute your tests in Chrome (`karma.conf.js`): 

{% highlight json %}
    customLaunchers: {
      'ChromeHeadless': { base: 'Chrome', flags: ['--no-sandbox', '--lang=EN-US', '--headless', '--disable-gpu', '--remote-debugging-port=9222'] }
    },
    browsers: ['ChromeHeadless'],
{% endhighlight %}

# Small docker image 
When I was starting using docker, it wasn't clear for me, how to achieve this. I needed nginx to host the app, nodejs to build it, Chrome to test... It all takes space. That's when I found out this little trick. You can use few base images in one Docker file. You will see in a moment, I am using node image for building the application and when it's done, I just get nginx image and copy build artifacts over. This way, my resulting images are really small. 

# My Dockerfile for Angular CLI apps
Enough said. Here is the Dockerfile I use for my apps: 

{% highlight docker %}
FROM node:8.1.4 AS builder

# --------------------------------------
# Install Chrome for testing
# --------------------------------------
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y google-chrome-stable

# --------------------------------------
# Install npm packages
# --------------------------------------

WORKDIR /app
COPY package.json ./package.json
RUN yarn && yarn global add @angular/cli

COPY . /app

# --------------------------------------
# Run Tests
# --------------------------------------
RUN ng test --progress false --single-run

# --------------------------------------
# Build PROD & BETA
# --------------------------------------
RUN ng build --prod --no-progress && \
    ng build --environment beta  --no-progress --prod --output-path dist-beta

# --------------------------------------
# Create final image
# --------------------------------------
FROM nginx:1.13.1

WORKDIR /app
COPY --from=builder /app/dist .

WORKDIR /app-beta
COPY --from=builder /app/dist-beta .

RUN  rm -rf /usr/share/nginx/html/* && \
	 cp -R /app/* /usr/share/nginx/html/  && \
	 mkdir /usr/share/nginx/html-beta/  && \
	 cp -R /app-beta/* /usr/share/nginx/html-beta/

COPY nginx.conf /etc/nginx/conf.d/default.conf

{% endhighlight %}

You can see, the last step copies the nginx.conf file. It's just a place where you can add specific config for the http server. Here is mine: 

{% highlight nginx %}
server {
    listen       80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html =404;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
{% endhighlight %}

# Summary
By using those few trics I presented above, you get fast build process with testing and small images. Everything you need while working with Docker. 