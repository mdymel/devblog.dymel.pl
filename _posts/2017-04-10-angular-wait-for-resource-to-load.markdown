---
layout: post
title: 'Angular - wait for a resource to load'
date: '2017-04-10'
image: /images/posts/2017-04-10-angular-wait-for-resource-to-load/featured.jpg
tags: 
- angular2
- dajsiepoznac2017
---
I have recently faced an interesting issue in an Angular application. It was an e-commerce solution, where a user could change his currency. I was using a modified price pipe, which had a dependency on settings containing the currency symbol. Because settings could be changed by a user, I had to get them from the server. The problem occurred when angular wanted to use the pipe before it loaded the settings. I had to make the app wait for settings before it rendered the page. 

# Route Guards
The answer to this problem was creating a **Route Guard**. I did use them before - for checking if the user is logged in. It turned out they can also be used to make sure some data is fetched before you display a component. 

The Router supports multiple kinds of guards: 

 * `CanActivate` to mediate navigation to a route.
 * `CanActivateChild` to mediate navigation to a child route.
 * `CanDeactivate` to mediate navigation away from the current route.
 * `Resolve` to perform route data retrieval before route activation.
 * `CanLoad` to mediate navigation to a feature module loaded asynchronously.

# Creating a Route Guard
 
In simple words, `Guard` is a class implementing one of above methods. This method can return either a `boolean` value (for synchronous processing) or an `Observable<boolean` (for asynchronous processing). 

{% highlight typescript %}
import {Injectable} from "@angular/core";
import {CanActivate} from "@angular/router";
import {UsersService} from "./shared/services/usersService";

@Injectable()
export class SettingsGuard implements CanActivate {

    constructor(private usersService: UsersService) {}

    canActivate() {
        // Settings will be cached in UsersService
        return this.usersService
            .getSettings()
            .map(() => true);
    }
}
{% endhighlight %}

If you now add this guard to the route: 

{% highlight typescript %}
    { path: "orders", loadChildren: "app/orders/orders.module#OrdersModule",                            canActivate: [SettingsGuard, AuthGuard] },
{% endhighlight %}

Angular Router will delay rendering of the `OrdersModule` until the settings have been loaded. The `UsersModule` is caching the settings in a backing field so that the request is fired only once. 

# Other use cases for Route Guards
This is just a one way you can use guards in your application. They might be useful in some other situations too: 

 * checking if user is authorised to see the target component 
 * redirecting to login page
 * saving changes before leaving current component 
 * asking user if changes should be saved 

 As you see it's quite a powerful concept, yet I get the impression it's not widely known. I hope you found this post useful. Have you used guards in your application? What was the purpose? 
