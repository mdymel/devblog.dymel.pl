---
layout: post
title: ASP.NET Core with Angular2 - tutorial
date: '2016-09-08'
featured: /images/posts/2016-09-08-aspnet-core-with-angular2-tutorial/featured.jpg
image: /images/posts/2016-09-08-aspnet-core-with-angular2-tutorial/code.png
tags: 
 - aspnetcore
 - angular2
 - tutorial
---
In this tutorial, I would like to show you, how to set up an application using ASP.NET Core as an API for Angular2 frontend. You will read about Startup class in the new ASP, setting up Angular2 dependencies with NPM, configuring SystemJS, Angular2 components and services and how to connect it all together. 
 
The whole project, which you can use as a template, can be found on [GitHub](https://github.com/mdymel/AspNetCoreAngular2). 

---

**UPDATE:** _There is a new tutorial available showing [how to use Angular2 CLI with ASP.NET Core](/2016/10/25/angular2-cli-with-aspnet-core-application-tutorial/). I recommend using the CLI tool as it has a lot of useful features._

---

1. TOC
{:toc}

# Backend - ASP.NET Core based API

I will start with preparing our backend service. For that, open up a Visual Studio and create an empty ASP.NET Core web project. After that, you should have a simple app ready to print “Hello World”. Let’s modify it to suit our needs. 

![New ASP.NET Core project](/images/posts/2016-09-08-aspnet-core-with-angular2-tutorial/vs-new-project.png)

Since we want to use MVC for the API and serve static files, you need to add following package as a dependency in the project.json file:

{% highlight conf %}
"Microsoft.AspNetCore.Mvc": "1.0.0",
"Microsoft.AspNetCore.StaticFiles": "1.0.0"
{% endhighlight %}

## Startup class
Now, let's modify the Startup class, to tell asp.net to use MVC: 

{% highlight csharp %}
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc()
            .AddMvcOptions(options =>
            {
                options.CacheProfiles.Add("NoCache", new CacheProfile
                {
                    NoStore = true,
                    Duration = 0
                });
            });
    }
    
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
        loggerFactory.AddConsole();

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseMvcWithDefaultRoute();
    }
}
{% endhighlight %}


As you can see, I’ve added MVC setup in two places. First one is adding MVC services and second is running them. I have also added NoCache headers to everything that is run by MVC. That way I am preventing caching of API calls (common problem in IE). 

Now, let’s add an index.html file, which will host the Angular2 app. It’s easily done by this piece of code added to Configure method of Startup class: 

{% highlight csharp %}
app.Use(async (context, next) =>
{
    await next();

    if (context.Response.StatusCode == 404 &&
        !Path.HasExtension(context.Request.Path.Value) &&
        !context.Request.Path.Value.StartsWith("/api/"))
    {
        context.Request.Path = "/index.html"; 
        await next();
    }
});
{% endhighlight %}

What it does is, if MVC returns 404 response and the request path does not have an extension (ex. html, jpg etc.), it will return the index.html file. It’s like a catch all, so whenever some will browse to urls for example: 

* /home
* /product/123
* /contact

It will serve this index file and angular app will pick up from there. 

# Frontend - Angular2 Single Page Application

## NPM packages 
At this point, we have our backend part ready. Let’s setup the frontend. First, we need to get all the packages Angular2 needs from npm. For this, you need to add a package.json file with such dependencies: 

{% highlight json %}
"dependencies": {
    "@angular/common": "2.0.0",
    "@angular/compiler": "2.0.0",
    "@angular/core": "2.0.0",
    "@angular/forms": "2.0.0",
    "@angular/http": "2.0.0",
    "@angular/platform-browser": "2.0.0",
    "@angular/platform-browser-dynamic": "2.0.0",
    "@angular/router": "3.0.0",

    "core-js": "2.4.1",
    "reflect-metadata": "0.1.3",
    "rxjs": "5.0.0-beta.12",
    "systemjs": "0.19.27",
    "zone.js": "0.6.23"
}
{% endhighlight %}

_If there is a new angular version released, you can always get current package versions here: [https://angular.io/docs/ts/latest/quickstart.html](https://angular.io/docs/ts/latest/quickstart.html)_

We'll also need some development tools to build our application: 

{% highlight json %}
"devDependencies": {
    "del": "latest",
    "gulp": "latest",
    "gulp-sass": "latest",
    "gulp-sourcemaps": "latest",
    "gulp-tslint": "latest",
    "gulp-typescript": "latest",
    "jasmine-core": "latest",
    "karma": "latest",
    "karma-chrome-launcher": "latest",
    "karma-coverage": "latest",
    "karma-jasmine": "latest",
    "karma-mocha-reporter": "latest",
    "karma-phantomjs2-launcher": "latest",
    "karma-story-reporter": "latest",
    "lite-server": "latest",
    "path": "latest",
    "phantomjs2": "latest",
    "require-dir": "latest",
    "systemjs-builder": "latest",
    "tslint": "latest",
    "typescript": "latest"
}
{% endhighlight %}

To download all these packages, you need to run: 

{% highlight conf %}
npm install --save-dev
{% endhighlight %}

After that, you should have a folder named *node_modules* with the JavaScript packages and tools installed in your profile directory. Now, we need to tell MVC it should serve this folder. By default, MVC uses only _wwwroot_ folder to serve static files. 

{% highlight csharp %}
string libPath = Path.GetFullPath(Path.Combine(env.WebRootPath, @"..\node_modules\"));
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(libPath),
    RequestPath = new PathString("/node_modules")
});
{% endhighlight %}

It's also worth to add *node_modules* to the part setting up our index.html file, so that we get normal 404 error if there is a request for a nonexisting file in the *node_modules* directory: 

{% highlight csharp %}
if (context.Response.StatusCode == 404 &&
    !Path.HasExtension(context.Request.Path.Value) &&
    !context.Request.Path.Value.StartsWith("/node_modules/") &&
    !context.Request.Path.Value.StartsWith("/api/"))
{
    context.Request.Path = "/index.html"; 
    await next();
}
{% endhighlight %}

## Index.html

At this point we have everything ready to start building our angular2 app. As a first step, let's create an index.html file. The whole file is available on [GitHub](https://github.com/mdymel/AspNetCoreAngular2/blob/master/src/AspNetCoreAngular2/Frontend/index.html). In general, there are two important parts to this file. 

### HEAD section 
Scripts references and base header: 

{% highlight html %} 
<script src="/node_modules/core-js/client/shim.min.js"></script>
<script src="/node_modules/zone.js/dist/zone.js"></script>
<script src="/node_modules/reflect-metadata/Reflect.js"></script>
<script src="/node_modules/systemjs/dist/system.src.js"></script>

<script src="/app/systemjs.config.js"></script>

<base href="/">
{% endhighlight %}

### BODY section  
Two things are happening here. One of the script imports in the head section was systemjs config file. We'll get to it in a moment, but it's basically a setup for all JS modules. The statement below is initialziing our application by importing it's main file. After that, there's a placeholder for our application. 

{% highlight html %}
<script>
    System.import('/app/main')
        .then(null, console.error.bind(console));
</script>

<app>Loading...</app>
{% endhighlight %}

## SystemJS config file
By default, angular2 uses SystemJS module loader to manage dependencies. I won't be going into details of how it works, because it's not the topic of this post. The config file contains a list of packages with properties telling it, how to load these packages: 

{% highlight js %}
(function(global) {

    var map = {
        'rxjs': '/node_modules/rxjs',
        '@angular': '/node_modules/@angular',
        'app': "/app"
    };

    var packages = {
        'app':                        { main: 'main.js',  defaultExtension: 'js' },
        'rxjs':                       { defaultExtension: 'js' }
    };

    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'http',
        'forms',
        'platform-browser',
        'platform-browser-dynamic',
        'router',
        'testing',
        'upgrade'
    ];

    // Individual files (~300 requests):
    function packIndex(pkgName) {
        packages['@angular/' + pkgName] = { main: 'index.js', defaultExtension: 'js' };
    }

    // Bundled (~40 requests):
    function packUmd(pkgName) {
        packages['@angular/' + pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
    }
    // Most environments should use UMD; some (Karma) need the individual index files
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
    // Add package entries for angular packages
    ngPackageNames.forEach(setPackageConfig);
    var config = {
        map: map,
        packages: packages
    };
    System.config(config);

})(this);
{% endhighlight %}

## Bootstrapping the AppModule

Now, it's time to prepare and bootstrap our application. First task is to create an app.module.ts file: 

{% highlight ts %}
@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports:      [
        BrowserModule,
        HttpModule,
        routing
    ],
    providers: [
    ],
    bootstrap:    [AppComponent],
})
export class AppModule {}
{% endhighlight %}

It's basically telling Angular, which components, modules and services you're going to use in your app. 

With that done, we can bootstrap our application in the main.ts file: 

{% highlight ts %}
platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
{% endhighlight %}

Now, we can create an AppComponent.ts: 

{% highlight ts %}
@Component({
    selector: "app",
    template: `<router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES]
})
export class AppComponent { }
{% endhighlight %}

This is going to be the main component of our app. As you see, it's template contains only the **router-outlet** - it's a place, where all our content will be rendered. That said, we can now create routes definition in the *app.routes.ts* file: 

{% highlight ts %}
const appRoutes: Routes  = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: HomeComponent }
];

export const routing = RouterModule.forRoot(appRoutes);
{% endhighlight %}

For now, I have added just one route, to the home component we're going to create in a moment. 

## Extending the app with new components
If you want to add new routes in future you just have to complete these steps: 

1. Create a component, for example ProductListComponent
1. Add a new component in the declarations section of the main.ts file 
1. Add new route in the _app.routes.ts_ file

## HomeComponent
We now have everthing wired, it's time to create a HomeComponent:

{% highlight typescript %}
@Component({
    selector: 'app-home',
    template: `Hello World`
})
export class HomeComponent {
    
}
{% endhighlight %}

It's as simple as it can get. We will add something extra later on :) 

# Running the app! 

Previous step was the last one needed before we could run our small application. To do that, we need to first build the Frontend part. If you look into GitHub repository, you will find a [gulpfile.js](https://github.com/mdymel/AspNetCoreAngular2/blob/master/src/AspNetCoreAngular2/gulpfile.js) file. Because we were using TypeScript for angular2 code, we need to transpile it to JavaScript. We have to also copy all other files from Frontend folder to wwwroot, which will be served by ASP.NET Core API. There are two commands useful at this stage: 

* *gulp build* - builds everything and quits 
* *gulp watch* - fires up the build command and watches for new changes. Whenever you change any file in Frondend folder, it will run build again. 

I am using gulp for file processing for two reasons. First of all, it's very fast. The watch mode is perfect for development. Files are processed in miliseconds, so when you refresh your browser, you always get new files. Secondly, it allows great control over what should be done, so it's easy to keep your source in one folder and build to another. 

When you've built your frontend part, you can start the application in VisualStudio. If everything went fine, you should be seeing this: 

![Hello World](/images/posts/2016-09-08-aspnet-core-with-angular2-tutorial/hello-world.png)

We have a ASP.NET Core application serving Angular2 app. Next step is to add an Angular2 service which will get some data from the API. 

# Adding a service 
The best way to implement communication with the API is through the services. This way you make the app modular and much easier to test. To add a service, create a file named hello.service.ts: 

{% highlight typescript %}
@Injectable()
export class HelloService {

    constructor(private http: Http) {
    }

    greet(name: string): Observable<string> {
        return this.http
            .get(`/api/hello?name=${name}`)
            .map(res => <string> res.text());
    }
}
{% endhighlight %}

You have to remmeber about few things here: 

 * @Injectable() decorator informs the DI system that you will require this class as a dependency in other classes 
 * Inject Http module in constructor
 * return an Observable from the method

The greet method does not return a string - it returns an Observable of type string. This is because, all communication done with the Http module is made asynchronously. So in order to use, what was returned from the API you need to subscribe to this Observable. This is how I modified the home.component.ts: 

{% highlight typescript %}
export class HomeComponent {
    constructor(private helloService: HelloService) {
    }

    ngOnInit() {
        this.greet("Michal");
    }

    greeting: string;

    greet(name: string): void {
        this.helloService
            .greet(name)
            .subscribe(data => this.greeting = data);
    }
}
{% endhighlight %}

Few things were added here: 
 
 * constructor, which gets HelloService as a dependency
 * ngOnInit() - it's a method, which is fired when the component is ready to be used. In this case it's just invoking the greet method
 * greet method - it's using the greet method of HelloService and subscribe to it's result. 

The subscribe method of Observable get's a function, which is invoked, when the result of an Observable is ready to be used. It's typical way of doing things asynchronously - in other words it's a callback method. 

# ApiController

For all of it to work, we also need a simple API controller in our backend: 

{% highlight c# %}
public class ApiController : Controller
{
    [HttpGet]
    [Route("/api/hello")]
    public string Hello(string name)
    {
        return $"Hello {name}";
    }
}
{% endhighlight %}

With all these changes, our app prints very nice greeting: 

![Greetings from ASP.NET Core and Angular2](/images/posts/2016-09-08-aspnet-core-with-angular2-tutorial/greeting.png)

# Summary

I think that it's enough to digest for one post, so I will finish now. If you go to [GitHub](https://github.com/mdymel/AspNetCoreAngular2), you can see the whole project, clone it and have a play with it yourself. If you like this post and would like to see more like that, please let me know in comments below what specific subject you are interested in.

Next parts:
 
* [Testing in Angular2](/2016/09/19/testing-in-angular2/)
* [Angular2 Modules](https://devblog.dymel.pl/2016/09/29/angular2-modules/)
* [Lazy loading in Angular2](/2016-10-06-lazy-loading-angular2-modules)