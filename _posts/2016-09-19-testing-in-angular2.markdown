---
layout: post
title: Testing in Angular2 
date: '2016-09-19'
featured: /images/posts/2016-09-19-testing-in-angular2/featured.jpg
image: /images/posts/2016-09-19-testing-in-angular2/code.png
tags: 
 - angular2
 - testing
---
In this post, I will show you how to test Angular2 application using Karma runner and Jasmine framework. You will learn how to setup the environment, configure dependencies in [TestBed](https://angular.io/docs/ts/latest/testing/#!#atp-api) and test your services and components. 

The code here is based on the [tutorial](/2016/09/08/aspnet-core-with-angular2-tutorial/) I posted before and is available on [GitHub](https://github.com/mdymel/AspNetCoreAngular2/).

1. TOC
{:toc}

# Installing dependencies 
First of all, you need to install karma and all other dependencies: 

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

You need to add these to the project.json file and run `npm install`.

# KarmaJS
Karma is a test runner. It is designed to find the tests in your code base, execute them and write a report. It can use regular browsers (chrome, firefox etc.) or PhantomJs - a headless browser written in JavaScript. PhantomJS is generally a great option - you don't have any windows opened and everything happens in the background. The problem is, it's much slower than, for example Chrome. When you start karma it opens the browser you have chosen in the config, acts as a webserver for this browser and initializes a test framework, jasmine. 

## Karma configuration
There are two files needed for the karma setup. First one is karma.conf.js. You guessed it right - it's a config file for karma. The whole file is available on [GitHub](https://github.com/mdymel/AspNetCoreAngular2/blob/master/src/AspNetCoreAngular2/karma.conf.js). There are two parts - one is setting up paths to all files needed by the tests and the other is just the options for karma (browser, type of report etc). 

## test-main.js
This file is responsible for initializing the Angular2 application and loading all the tests. Again - whole file is available on [GitHub](https://github.com/mdymel/AspNetCoreAngular2/blob/master/src/AspNetCoreAngular2/Frontend/test-main.js). 

## Running karma 
To test the whole setup, run a command window and cd into the project directory. First, build the frontend application with `gulp build` (or have a watch running all the time with `gulp watch`):

![gulp build](/images/posts/2016-09-19-testing-in-angular2/gulp-build.png)

Then, run `karma start --single-run`. This should start the karma runner, open chrome and show a message it didn't find any tests (unless you already have some):

![karma start](/images/posts/2016-09-19-testing-in-angular2/karma-start.png)

# Writing first test
Our first test will check if the whole setup works fine. Such tests are called sanity tests and they check for the known truths. Like that 2+2 is 4 :). Let's get to it! 

## Sanity tests
Add a file `sanityTests.spec.ts` somewhere in the Frontend folder. I created `tests` directory and keep it there. All test files must end with spec.ts - that is how, karma will know it has to run them. 

{% highlight typescript %}
describe("universal truths", () => {
    it("should do math", () => {
        expect(1 + 1).toEqual(2);

        expect(5).toBeGreaterThan(4);
    });
});
{% endhighlight %}  

So this is it - we have our first test, let's run it! (remember about `gulp build`)

![sanity checks](/images/posts/2016-09-19-testing-in-angular2/sanity-checks.png)

Now, when we are sure, our setup works fine, we can start testing our application. 

# Testing angular2 application
The Angular team prepared a framework to make it easy to test it. The whole concept uses a `TestBed` class. You need it to setup the test environment and create components to be tested. I will now demonstrate how to do it, by adding tests to the demo app I prepared for the [tutorial](/2016/09/08/aspnet-core-with-angular2-tutorial/), I posted before.

## Services
In the demo application we've had a [HelloService](https://github.com/mdymel/AspNetCoreAngular2/blob/master/src/AspNetCoreAngular2/Frontend/app/home/hello.service.ts) class. It was using HTTP protocol to communicate with the API and get the greeting message. 

First step is to setup `TestBed` for our tests: 

{% highlight typescript %}
beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            {
                provide: Http,
                useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                    return new Http(backend, defaultOptions);
                }, deps: [MockBackend, BaseRequestOptions]
            },
            HelloService,
            MockBackend,
            BaseRequestOptions
        ]
    });
});
{% endhighlight %}

What happens here is, we tell the `TestBed` to use a `MockBackend` for the `Http` class dependencies. `MockBackend` doesn't send real http requests. Instead it allows us to modify its behaviour in the test. 

{% highlight typescript %}
it("call the greet url",
    inject([HelloService, MockBackend], fakeAsync((helloService: HelloService, mockBackend: MockBackend) => {

        let name: string = "Michal";
        let response: string;
        mockBackend.connections.subscribe(c => {
            expect(c.request.url).toBe("/api/hello?name=" + name);
            c.mockRespond(new Response(new ResponseOptions({body: "Hello " + name})));
        });
        helloService.greet(name).subscribe(data => {
            response = data;
        });
        tick();
        expect(response).toBe("Hello " + name);
    }))
);
{% endhighlight %}

This is an example test for our `HelloService`. As you can see, it tells the mockBackend to response with "Hello Michal" string when the request comes. Then we run the service method and check if the result is what it should be. 

## Components
Now, it's the time to test `HomeComponent`. First, we need to prepare the `TestBed`:

{% highlight typescript %}
let greet = "Hello Asd123";
let helloService;

beforeEach(() => {
    helloService = {
        greet: jasmine.createSpy("greet").and.returnValue(Observable.of(greet))
    };

    TestBed.configureTestingModule({
        declarations: [
            HomeComponent
        ],
        providers: [
            {provide: HelloService, useValue: helloService}
        ]
    });
});
{% endhighlight %}

Here, we're creating a mock for the `HelloService`. It's using a Spy from jasmine framework, which will return configured greet as an `Observable`. The mock is specified as a value for `HelloService` dependency. 

{% highlight typescript %}
it("can initialize", async(() => {
    TestBed.compileComponents().then(() => {
        const fixture = TestBed.createComponent(HomeComponent);
        let element = fixture.nativeElement;
        let component = fixture.componentInstance;

        fixture.detectChanges();

        expect(element).not.toBeNull();
        expect(component).not.toBeNull();

        expect(helloService.greet).toHaveBeenCalled();

        let header = element.querySelector("h1");
        expect(header).not.toBeNull();
        expect(header.textContent).toBe("Greeting test");

        let greeting = element.querySelector("#greeting");
        expect(greeting).not.toBeNull();
        expect(greeting.textContent).toBe(greet);
    });
}));
{% endhighlight %}

This is a test for our component. We check if angular can initialize it and also if the page contains elements it should. 

# Summary
Now the output from karma runner looks better: 

![karma](/images/posts/2016-09-19-testing-in-angular2/karma-full.png)

As you see, testing angular apps is not very complicated. You just have to remember how to setup TestBed and use it in the tests. As before, the whole code for this post is available on [GitHub](https://github.com/mdymel/AspNetCoreAngular2/), so go ahead, fork and have a play with it! 