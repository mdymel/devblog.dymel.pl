---
layout: post
title: Using Angular2 CLI tool   
date: '2016-10-20'
featured: /images/posts/2016-10-20-using-angular2-cli/featured.jpg
image: /images/posts/2016-10-20-using-angular2-cli/featured.jpg
tags: 
 - angular2
---
Some time ago, Angular team introduced a CLI (Command Line Interface) tool for Angular2. It was created to help in development of ng2 applications. It can initialize a fresh app and serve it. It also has a support for webpack, so you can use it to build your applications. Today, I would like to have some play with it and show you how to make some use of this tool. 

1. [What it is and what is it capable of](#what-is-it)
1. [Creating a new applications](#new-app)
1. [Working with the application](#working)
 * [Adding a component](#adding-component)
 * [Adding a service](#adding-service)
 * [Adding routing](#adding-routing)
1. [Building the application](#building)
1. [Adding a lazy loaded route](#lazy-loaded)
1. [Summary - Pros & Cons](#summary)

Code on [GitHub](https://github.com/mdymel/angular2-cli-test)

# <a name="what-is-it"></a>What it is and what is it capable of
When you go to the [projects repository](https://github.com/angular/angular-cli), you'll learn it's still a beta version, so you can expect some issues. 
You install the CLI tool with the npm using this command: `npm install -g angular-cli`. It will make it globally available on your system. After that you can check its help with `ng --help`. You'll see a big list of commands with their possible parameters: 

![ng help](/images/posts/2016-10-20-using-angular2-cli/ng-help.png)

The list goes on... You can check all the options in the mentioned github repository.

# <a name="new-app"></a>Creating a new applications
I said, you can initialize an empty application with the cli tool. Lets try it out: `ng new CliTest`. This command will create a directory CliTest and bootstrap an application in it: 

1. Create applications
1. Setup CLI commands
1. Setup e2e tests with protractor
1. Setup unit tests with karma 
1. Initialize a git repository
1. Install all the dependencies via npm

When it's finished, you can serve the application with `ng serve`. It will first build the app and then serve it using a development server: 

![ng serve](/images/posts/2016-10-20-using-angular2-cli/ng-serve.png)

![app works](/images/posts/2016-10-20-using-angular2-cli/app-works.png)

As you see, we have a working angular application now. The `ng serve` functionality as a cool additional feature. It is watching for changes you make in the files when it detects some, it **rebuilds** the app and **refreshes** the browser, so you always have a fresh version running. 

# <a name="working"></a>Working with the application
Let's look into the code that was generated: 

![ng help](/images/posts/2016-10-20-using-angular2-cli/source-code.png)

We have one component, which is the root of the application and displays the "App Works" message. We don't have any services, pipes or routes. Apert from the routes, which generation was temporarily disabled, you can use the ng tool to add them to your application. 

## <a name="adding-component"></a>Adding a component
To generate a new component you run `ng generate component my-new-component`:

![ng help](/images/posts/2016-10-20-using-angular2-cli/generate-component.png)

As you see, it has added a new directory with all the files, including tests. It has also added it to the declarations section of the AppModule.

## <a name="adding-service"></a>Adding a service
Now, lets try to add a service with `ng generate service my-new-service`:

![ng help](/images/posts/2016-10-20-using-angular2-cli/generate-service.png)

Again, service file was added along with the spec.ts, but this time the CLI didn't add newly generated class to AppModule. Instead, it is showing a warning you have to do it yourself. 

## <a name="adding-routing"></a>Adding routing 
As I said above, routes are not supported by cli tool yet. 

# <a name="building"></a>Building the application
Applications generated with the CLI tool, have support for 2 environments: development and production. When you run `npm build`, the dev one is used by default. It analyses the application and builds it to dist directory: 

![ng build](/images/posts/2016-10-20-using-angular2-cli/ng-build.png)

The `main.bundle.js` file has over 2.5MB, but remember it's just a dev build - the file has comments and is not minified at all. Whole application was combined into 4 files. That's very useful, because, without bundling, Angular2 apps are loading hundreds of files! 

Now let's try the production build with `ng build --prod`:

![ng build contents prod](/images/posts/2016-10-20-using-angular2-cli/ng-build-prod.png)

Now, this looks much better! The whole app is just over 800KB. I know it's not really 'just', but remember it contains everything needed to render it and Angular2 is quite a heavy framework:

![ng build prod load results](\images\posts\2016-10-20-using-angular2-cli\ng-build-prod-load.png)

# <a name="lazy-loaded"></a>Adding a lazy loaded route
As I mentioned above, the current version of the CLI does not support adding routes. I was interested to see, how can I add a new, lazy loaded route and how cli would handle the build process. It turned out to be really simple. I have pushed my test repository to and you can see these changes in [one commit here](https://github.com/mdymel/angular2-cli-test/commit/27df9e577dd02f898ab4918a3ffa9a2f470a2308). In general, I have added a new module with `ng g module lazy` command. This has added a module and a component. After that I only had to modify the app routing: 

{% highlight typescript %}
import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "./home/home.component";

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "lazy", loadChildren: "app/lazy/lazy.module#LazyModule" },
];

export const routing = RouterModule.forRoot(appRoutes);
{% endhighlight %}

And create a `lazy.routing.ts': 

{% highlight typescript %}
import {Routes, RouterModule} from "@angular/router";
import {LazyComponent} from "./lazy.component";

const appRoutes: Routes = [
  { path: "", component: LazyComponent }
];

export const routing = RouterModule.forChild(appRoutes);
{% endhighlight %}

Next, I added these routing definitions to `AppModule` and `LazyModule`, built it and it worked straight away. The CLI tool instructed webpack there is new module and it should be processed as a separate bundle: 

![ng build with lazy module](\images\posts\2016-10-20-using-angular2-cli\ng-build-with-module.png) 

# <a name="summary"></a>Summary - pros & cons
After these few simple tasks with cli, I am sure it makes a lot of sense to use it. It's not just a tool creating files for you. For me, its biggest selling point is the building process. Here is my list of its pros & cons: 

## Pros 
 * ng init - very easy way to bootstrap a project with everything you need
 * ng generate - useful, but nothing special 
 * ng build - pure magic - one command and you get a dist folder with your files bundled and minified 

## Cons
 * lack of control - you might run into problems of not knowing what is going on in your build. Everything happens automagically - it's great when it works, but hard to debug in case something goes wrong 
 * no support for routes (**temporarily**)
 * hard to introduce to 'old' projects - I think the only solution is to bootstrap a new project and move all your files there 

 All in all - it's a great tool and will definitely simplify your daily work.  