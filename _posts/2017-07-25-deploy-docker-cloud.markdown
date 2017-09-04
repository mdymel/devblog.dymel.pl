---
layout: post
title: 'Orchestrate containers with Docker Cloud'
date: '2017-09-05'
featured: /images/posts/2017-09-05-deploy-docker-cloud/featured.jpg
image: /images/posts/2017-09-05-deploy-docker-cloud/social.png
tags: 
- docker
- gitlab
---
In the last post, I have shown how you can build an ASP.NET Core app in the Docker container. Today I will introduce you to Docker Cloud - a service for orchestrating your containers. It's working directly with Docker Hub (images registry) and is free for public containers. In the end of the post, we'll have an application created last time running on the virtual machine, managed by Docker Cloud. 

# Docker Hub and Docker Cloud
[Docker Hub](https://hub.docker.com/) is to Docker images like GitHub is to code. It hosts images for many open source projects. You can find [dotnet](https://hub.docker.com/r/microsoft/dotnet/), [nginx](https://hub.docker.com/_/nginx/), [Ubuntu](https://hub.docker.com/_/ubuntu/) or [MySQL](https://hub.docker.com/_/mysql/) images. You can host images of your projects there too. The service is free for public images. You also get one private repo for free. If you need more, you have to pay ($7 a month for 5 repositories). 
[Docker Cloud](https://cloud.docker.com/) is a companion service to Docker Hub. It allows building a complete CI for Docker. It can build docker images, execute tests and deploy images to your virtual machines. Here the pricing is based on nodes (servers, or VMs). Again, the first one is free. Then you pay $15 for each node. 

# Pushing a docker image to Docker Hub
The benefit of using services provided by docker is, `docker` CLI has built in support for it. If you want to push an image, let's say tagged as `mdymel/d-test-01` you just have to *login* and *push* the image: 

![docker login and push](/images/posts/2017-09-05-deploy-docker-cloud/docker-push.png)

When it's done, your image is available from docker hub to be pulled on other systems. If the repository is private, you're going to need to execute `docker login` there too. 

# Docker Cloud agent on a Ubuntu VM
For Docker Cloud to be able to orchestrate your containers it needs an agent app on the server. There are two ways to accomplish that. You can either execute a command provided in the Docker Cloud interface on your server or have Docker Cloud create and setup a VM for you. The latter option works Amazon, Digital Ocean, Azure and others. 

For the needs of this article, I will create a new node. To do that I go to Nodes section of [docker cloud](https://cloud.docker.com) interface, select params and launch it: 

![docker node](/images/posts/2017-09-05-deploy-docker-cloud/docker-node.png)

After a few moments you should see your node with status *deployed*: 

![docker node deployed](/images/posts/2017-09-05-deploy-docker-cloud/docker-node-deployed.png)

# Adding a service 
I have the node, so now I can deploy a service on it. To do this, I go to Services section and select my repositories (the third icon): 

![creating a service](/images/posts/2017-09-05-deploy-docker-cloud/creating-service-1.png)

When you click the Select button, you can modify a lot of settings. I will just change AutoRedeploy to true so that if I publish a new image to Docker hub, service is automatically upgraded: 

![creating a service](/images/posts/2017-09-05-deploy-docker-cloud/creating-service-2.png)

I hit Create button and my app is running on the server: 

![running app](/images/posts/2017-09-05-deploy-docker-cloud/running-service.png)

## Exposing ports
I now have the app running, but it's not available to the outside world. To do that, I need to map the application port in docker cloud. To do that, you need to Edit the service and go to Ports section: 

![exposing ports](/images/posts/2017-09-05-deploy-docker-cloud/service-ports.png)

I needed to make one more change in the project: 

 * Make sure AspNet app runs on port 5000 by adding `UseUrls("http://0.0.0.0:5000")` to the `WebHostBuilder()` config in `Program.cs`.
 * Add `EXPOSE 5000/tcp` instruction to `Dockerfile` so that docker knows this port should be made available. 

After these 3 changes my application is available on the hosts IP address: 

![working app](/images/posts/2017-09-05-deploy-docker-cloud/working-app.png)


# Other options 
Docker Cloud has a lot of possibilities to setup your architecture: 

 * scaling - it's very easy to set number of containers that should run for each service
 * environment variables - very good option for passing settings you don't want to store in the repository 
 * service links - you can deploy few services which will be able to communicate with each other 
 * API - allows you to manage the configuration 

# Summary
For me, Docker Cloud is an interesting option. It's not as powerful as Rancher (based on Kubernetes) but is completely enough for smaller setups. I encourage you to give it a try for some personal project - especially open source, for which you can use it for free. 