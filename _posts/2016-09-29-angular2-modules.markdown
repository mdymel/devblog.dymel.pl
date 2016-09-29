---
layout: post
title: Angular2 modules  
date: '2016-09-29'
featured: /images/posts/2016-09-29-angular2-modules/featured.jpg
image: /images/posts/2016-09-29-angular2-modules/featured.jpg
tags: 
 - angular2
---
Angular2 introduces the concept of Modules (NgModule). Every angular2 application need to have at least one module, conventionally named AppModule. As the name suggests, module groups a part (or a whole) of application into a unit, which is easier to maintain. In this post I would like to show you, how modules work, how to split your application into modules and how to add a shared module with common components. 

1. [NgModule](#ngmodule)
1. [HomeModule](#home-module)
1. [Adding new page in a separate module](#new-page)
1. [Navigation component in a shared module](#shared-module)
1. [Summary](#summary)

# <a name="ngmodule"></a>NgModule
An Angular Module is a class decorated with the `@NgModule`. As all other decorators, `@NgModule` takes an object telling Angular how to build the module. There are four arrays in the object: 

 * declarations: list of View classes (components, directives and pipes), which this component is using,
 * providers: list of service providers needed by the module
 * imports: other modules needed by this module, 
 * exports: View classes and modules, which may be used by other modules 

With this simple theory covered, let's add a first module. 

Few weeks ago, I have posted a tutorial on [how to set up Angular2 application with ASP.NET Core](/2016/09/08/aspnet-core-with-angular2-tutorial/). I will be extending the application started there. It's all available on [GitHub](https://github.com/mdymel/AspNetCoreAngular2)

# <a name="home-module"></a>HomeModule
The application I will be working on is very simple and contains one view component `HomeComponent` and one service `HelloService`, which is used only by this component. I will create a `HomeModule` class and import it in `AppModule`. This way, `AppModule` won't have to declare provider for `HelloService`. 

{% highlight typescript %}
@NgModule({
     declarations: [
         HomeComponent
     ],
     providers: [
         HelloService
     ],
     exports: [
         HomeComponent
     ]
 })
 export class HomeModule {}
{% endhighlight %}

This is our `HomeModule` class. As you can see, it declares HomeComponent and a provider for `HelloService`. 

Now, the only thing we need to do, is to modify `AppModule`, so it uses our new module: 

{% highlight typescript %}
@NgModule({
    declarations: [
        AppComponent
    ],
    imports:      [
        BrowserModule,
        HttpModule,
        routing,

        HomeModule
    ],
    bootstrap:    [AppComponent],
})
export class AppModule {}
{% endhighlight %}

Now, `AppModule` only needs `HomeModule` to be able to serve it. It seems useless in such small application, but imagine a bigger one, with 10 pages, each using different components and services. It's really important to keep your application tidy since the day you start developing it. If you don't do it right from the beginning, it will catch you at one point with an AppModule class declaring 100 Views and 30 services ;)  

Changes for this section on [GitHub](https://github.com/brianlowe/AspNetCoreAngular2/commit/407a7b50c19e42c5ebfa79b0ad3026ab727df4b0)

# <a name="new-page"></a>Adding new page in a separate module

In the [tutorial](/2016/09/08/aspnet-core-with-angular2-tutorial/) I have shown how to add a new page - you add a component, route and declare it in the `AppModule`. Today, I will show you how to use a separate module to do it. 

We will add an About page, which will be shown on URL `/about`. First, we add a component: 

{% highlight typescript %}
@Component({
    template: `
        <h1>About us</h1>
        <p>Here you can learn everything about us.</p>
        <p>Date: {{today | date: short}}</p>`
})
export class AboutComponent {
    today: Date;

    ngOnInit() {
        this.today = new Date();
    }
}
{% endhighlight %}

As you can see, the component is using a `DatePipe` - it allows you to customise the format of the date in the template. We will have to declare the use of it in the `AboutModule`:

{% highlight typescript %}
@NgModule({
     declarations: [
         AboutComponent
     ],
     imports: [
         CommonModule
     ],
     exports: [
         AboutComponent
     ]
 })
 export class AboutModule {}
{% endhighlight %}

`DatePipe` amongst many others is declared in the `CommonModule`. This is why we don't declare it directly in the `declarations` section. 

Last thing to do is to add new route in the `app.routes.ts` file: 

{% highlight typescript %}
const appRoutes: Routes  = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "about", component: AboutComponent }
];

export const routing = RouterModule.forRoot(appRoutes);
{% endhighlight %}

With these few steps, we have added new page to our application. Now we need some way of navigating between them. Let's add a navigation component and let's use a shared module for it. 

Changes for this section on [GitHub](https://github.com/brianlowe/AspNetCoreAngular2/commit/d89ef1008bd0aa56b8fbfd8c992e2c11763aa882)

# <a name="shared-module"></a>Navigation component in a shared module

Most of applications have some common components. One of them may be a navigation bar displayed on top of every page. You need to separate it and then use everywhere. This is where a shared module come in handy. 

Again, our first step will be to add a `NavComponent`: 

{% highlight typescript %}
@Component({
    selector: "my-nav",
    template: `
        <a routerLink="/home">Home</a> |
        <a routerLink="/about">About</a>
        <hr>`
})
export class NavComponent {

}
{% endhighlight %}

Next, we need to create a `SharedModule`: 

{% highlight typescript %}
@NgModule({
    declarations: [
        NavComponent
    ],
    imports: [
        CommonModule, routing
    ],
    exports: [
        CommonModule,
        NavComponent
    ]
})
export class SharedModule {}
{% endhighlight %}

Because, most of pages will also use stuff hidden in the `CommonModule` coming with Angular, I have indluded it here. We also need `routing` module to support `routerlink` directive in navigation links. 

Now, we need to add `<nav></nav>` in home and about component templates and import `SharedModule` in both modules. 

Changes for this section on [GitHub](https://github.com/brianlowe/AspNetCoreAngular2/commit/482cf9dcab98839e67ed76b0ff6ee03819b05937).

# <a name="summary"></a>Summary

Angular2 modules are very good way to organize code in your applications. Technically, you can keep everything in the AppModule file, but it will get cluttered very fast and make your app harder to maintain. NgModules seem to be complicated at first, but I hope I have shown you, there really easy to use. 