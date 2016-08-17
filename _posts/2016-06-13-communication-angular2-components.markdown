---
layout: post
title: Communication between Angular2 Components
date: '2016-06-13 07:57:23 +0200'
image: /images/posts/2016-06-13-communication-angular2-components/featured.jpg
categories:
- Web
- Angular2
tags:
- angular2
- observable
---
If you have done some work with Angular2, you know, you organize your page in components. For example, you might have a component with a login form and another showing the login status - like a top menu or something like that. When you have that, you need a way to allow communication between these components so the login form can let the other ones know the login status has changed. That's where the Observable classes come in handy.

# What is an Observable? 
Observable class is a part of the [rxJS library](http://reactivex.io/intro.html) - The Reactive Extensions for JavaScript. Apart from JS it is also available for Java, C#, Scala, Ruby, Python and many others.

>It extends the observer pattern to support sequences of data and/or events and adds operators that allow you to compose sequences together declaratively while abstracting away concerns about things like low-level threading, synchronization, thread-safety, concurrent data structures, and non-blocking I/O. Angular2 uses this library, so it is encouraged to follow this pattern in your applications. 

# Problem to solve
To demonstrate how you can implement Observables in your application, I will create a prototype of a problem I mentioned above. It will be a simple angular page with three boxes - components. One will have two buttons - login and logout - second will be showing the login status and the third will change its background color with the status change. You can see full demo code here: [https://plnkr.co/edit/0c9xQRHBgMrtsJXCZC3T?p=preview](https://plnkr.co/edit/0c9xQRHBgMrtsJXCZC3T?p=preview)

# Main app component
I have created an entry point of the application: 

{% highlight js %}
@Component({
  selector: 'my-app',
  providers: [],
  template: `

<div>
# Observables demo

      <login-form></login-form>

<hr>
      <login-status></login-status>

<hr>
      <login-background></login-background>

    </div>
  `,
  directives: [LoginForm, LoginStatus, LoginBackground]
})
export class App {

}
{% endhighlight %}

As you can see, it just adds three components as mentioned above. 

# Login Form
This is a very simple component with two buttons which are being shown based on loginStatus variable: 

{% highlight js %}
@Component({
  selector: "login-form",
  template: `
    LoginForm: 
    <button *ngIf="!loggedIn" (click)='login()'>Login</button>
    <button *ngIf="loggedIn" (click)='logout()'>Logout</button>
  `,
  directives: [NgIf]
})
export class LoginForm {
  loggeIn: boolean;

  login() {
    this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
  }
}
{% endhighlight %}

# LoginStatus
This one just shows if the user is logged in or not.

{% highlight js %}
@Component({
  selector: "login-status",
  template: `
    LoginStatus:
    <span *ngIf='loggedIn'>In</span>
    <span *ngIf='!loggedIn'>Out</span>
  `,
  directives: [NgIf]
})
export class LoginStatus {
  loggedIn: boolean = false;
}
{% endhighlight %}

I won't be pasting login-background source code as it's nearly the same as this one and just serves a purpose of showing you there can be many components using the observable, which I will create in a moment. 

# Adding service with an Observable
With the current code we got an application which allows user to log in and two other components which should show the login status. The only problem is they don't know this status. To solve this problem, I have created a LoginService class: 

{% highlight js %}
@Injectable()
export class LoginService {

    status: Observable<boolean>;
    private observer: Observer<boolean>;

    constructor() {
        this.status = new Observable(observer =>
            this.observer = observer
        ).share();
    }

    changeState(newState: boolean) {
      if (this.observer !== undefined) this.observer.next(newState);
    }
}
{% endhighlight %}

As you can see, the code is quite simple. There are two fields - status and observer. Observer is a private property holding... an Observer :) Status is a public one, which allows other components to subscribe to the observer. There is also a changeState function, which components can call to let others know something has changed. Few things to notice here:

* share() - creates a subscription, which can be consumed by others
* this.observer.next(newState) - sends a new value to all objects subscribed to the observer

# Using LoginService in LoginForm
First of all we need to add LoginService to providers section of bootstrap call in main.ts: 

{% highlight js %}
bootstrap(App, [LoginService])
 .catch(err => console.error(err));
{% endhighlight %}

This is needed by Angular to wire up the dependency injection properly. If you'd forget to do it, you'd get an 'No provider for LoginService!' exception. 

Next, we need to modify LoginForm class: 

{% highlight js %}
export class LoginForm {
  loggeIn: boolean;

  constructor(private loginService: LoginService) {
  }

  login() {
    this.loggedIn = true;
    this.loginService.changeState(true);
  }

  logout() {
    this.loggedIn = false;
    this.loginService.changeState(false);
  }
} 
{% endhighlight %}

I have added LoginService as a dependency in the controller - this way it will be injected into our class and allow us to use it. It's important, because this way we will get the same instance of the service in all components, so they can communicate with each other. 

I have also added calls to changeState function in login() and logout() methods. 

# Subscribing to an Observer
The only part left is to subscribe to LoginService Observer: 

{% highlight js %}
export class LoginStatus {
  loggedIn: boolean = false;
  subscription: any;

  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
        this.subscription = this.loginService.status.subscribe(status => {
            this.loggedIn = status;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
{% endhighlight %}


