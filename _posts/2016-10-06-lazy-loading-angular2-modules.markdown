---
layout: post
title: Lazy loading in Angular2   
date: '2016-10-06'
featured: /images/posts/2016-10-06-lazy-loading-angular2-modules/featured.jpg
image: /images/posts/2016-10-06-lazy-loading-angular2-modules/featured.jpg
tags: 
 - angular2
---


In the [last post](https://devblog.dymel.pl/2016/09/29/angular2-modules/) I have shown you how to split your application into modules. The problem with single-page-applications is the amount of scripts you have to load to the browser to show the first page. With standard configuration you're loading all the framework files, libraries etc., plus your whole application. Even to display a simple homepage, the browser is getting all your components, templates, services. Today you will learn how to setup your modules so that they are only loaded when needed. 



# Lazy loading in Angular 2
Lazy loading makes most sense for complicated components, when they're using various different files. The [application](https://github.com/mdymel/AspNetCoreAngular2) I am working on in [these tutorials](https://devblog.dymel.pl/tags/#angular2) is rather simple. To be able to show you where lazy loading really shines, I have extended it with a new section called Products. I was describing adding components and services in the [first tutorial](/2016/09/08/aspnet-core-with-angular2-tutorial/), so here, I will only give you a link to the changesets:

* [Adding product component](https://github.com/mdymel/AspNetCoreAngular2/commit/c5b488f77655ef0ba3d3319dcf5def10e7102c4e)
* [Product component extensions](https://github.com/mdymel/AspNetCoreAngular2/commit/380f63dab1fcfb4f5d8bb8b068d5830f615daf6b)

At this point our ProductsComponent is a simple page displaying list of products and their details. To make it even more interesting, I have split it into two components, where details are a separate page. So now we have three modules in the application: 

1. HomeModule - HomeComponent, HelloService
1. AboutModule - AboutComponent
1. ProductsModule - ProductsComponent, ProductDetailsComponent, ProductsService 

Because `HomeComponent` and `AboutComponent` are very small, I will leave them as eagerly loaded and only modify `ProductsModule` to be requested when needed. 

# Lazy loading 
In Angular2, lazy loading is built in and managed by the Router. There are few steps needed to set it up: 

1. Specify lazy loaded routes in `app.routing.ts`.
1. Create component routing file. 
1. Modify lazy loaded module. 

## Application routing 
To specify lazy loading you need to create a path object with `loadChildren` property. In it, you have to setup a path and name of the module: 

{% highlight json %} 
{ path: "product", loadChildren: "app/product/product.module#ProductModule"  }
{% endhighlight %}

This means that for Urls starting with `product`, angulars router will get module file `app/product/product.module` and expect a class `ProductModule`. We'll get to this module in a second, first let's prepare a routing file for it. 

## Module routing
The routing for module looks a bit different than the application routing file: 

{% highlight typescript %}
import {RouterModule} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {ProductComponent} from "./product.component";
import {ProductsListComponent} from "./products-list.component";
import {ProductDetailsComponent} from "./product-details.component";

const routes = [
    {
        path: "",
        component: ProductComponent,
        children: [
            {path: "", component: ProductsListComponent},
            {path: ":id", component: ProductDetailsComponent}
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
{% endhighlight %}

The main path remains "". Remember it's appended to the module url from the application routing config. We also define a ProductComponent: 

{% highlight typescript %}
import {Component} from "@angular/core";

@Component({
    template: `
        <my-nav></my-nav>
        <h1>Products</h1>
        <router-outlet></router-outlet>
    `
})
export class ProductComponent {}
{% endhighlight %}

It a contains a navigation and a `<router-outlet>` placeholder for the module content. Next, in the routing config, we define childer paths. Here, the syntax is the same as in the `app.routing` file - you define the url and the component responsible for it. One thing to notice is `:id`, which means the url will capture this part as a parameter. The `ProductDetailsComponent` url might look like this: `/products/123`, where 123 will be passed as an `id` parameter. 

## Lazy loaded module 

{% highlight typescript %}
import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {ProductsService} from "./products.service";
import {ProductsListComponent} from "./products-list.component";
import {ProductDetailsComponent} from "./product-details.component";
import {routing} from "./product.routing";
import {ProductComponent} from "./product.component";

@NgModule({
    declarations: [ProductComponent, ProductsListComponent, ProductDetailsComponent],
    imports: [SharedModule, routing],
    providers: [ProductsService],
})
export class ProductModule {}
{% endhighlight %}

There is only one thing added here - the lazy loaded module has to import `routing` configuration defined above. 

# Test and benefits - 80% improvement on homepage
That's it! This is all you have to do to have your modules loaded when they're requested. It's a huge improvement over angular v1, where you had to play with different hacks to achieve that. 

Before these changes, initial load of the home page needed 378 http requests: 

![loading stats](/images/posts/2016-10-06-lazy-loading-angular2-modules/loading-stats.png)

After lazy loading was added it dropped to 75 - thats __80% less__: 

![lazy loading stats](/images/posts/2016-10-06-lazy-loading-angular2-modules/lazy-loading-stats.png)

*Disclaimer*:
*These results do not take any bundling/webpack solutions into account. This will come in one of the future posts ;)*

# Summary
I am working with Angular2 since January. During this time, there were few RC versions. Some of them required small changes, some bigger. What I didn't use until recently was the Router. At one point, it turned out it was great, because it was changed completely in last few RC versions. When the 2.0 version was released, I thought it's time to dig in. It was a good decision. I split my application into proper modules and implemented the lazy loading technique. As you can see, it's not complicated at all and is adding a huge benefit on the first load. Most of application home pages are very small. If you don't implement lazy loading, you require your users to load much more data to display a first page. It's wrong! Add lazy loading and request only what's needed to save time needed to display first pixels. 