---
layout: post
title: 'Preload data before app init in Angular'
date: '2017-10-17'
featured: /images/posts/2017-10-17-angular-preload/featured.jpg
image: /images/posts/2017-10-17-angular-preload/social.png
tags: 
- angular2
---
Sometimes you need to load data from an API before your Angular application can be initialized. I recently had such problem - in this case I had to get settings from the backend server. You may load the data in main component, but then it's hard to make it available for all other components. It's much better to hook into initialization process. Let's see how to do it. 

# What is an APP_INITIALIZER in Angular
`APP_INITIALIZER` is described in the [documentation](https://angular.io/api/core/APP_INITIALIZER) as a function, which will be executed when application is initialized. It means you can set it up as a factory in `providers` section of your `AppModule` class and the application will wait until it completes. 

# Example
I will create a simple app, that will load a random Chuck Norris joke from [http://www.icndb.com/api](http://www.icndb.com/api/) (yes, there is an API for that!) and make it available for all other components. 

{% highlight console %}
ng new chuck
{% endhighlight %}

## Joke Provider
First we need a provider, which will return a `Promise`, which will be resolved when the joke request completed: 

{% highlight ts %}
@Injectable()
export class JokesProvider {

    private joke: JokeModel = null;

    constructor(private http: Http) {

    }

    public getJoke(): JokeModel {
        return this.joke;
    }

    load() {
        return new Promise((resolve, reject) => {
            this.http
                .get('https://api.icndb.com/jokes/random')
                .map(res => res.json())
                .subscribe(response => {
                    this.joke = response['value'];
                    resolve(true);
                })
        })
    }
}
{% endhighlight %}

You can read more about `Promise` object in the [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). 

There are three interesting things here: 

 1. private property `joke` - it will store the current joke 
 1. public function `getJoke()` - it makes the current joke available for other parts of the application
 1. `load()` - it's a function, which we will execute in a moment from the app init process 

 ## AppModule - creating jokes factory
 We need to hook into application init process and load the random joke using `JokesProvider`. To do that, we have to create `jokesProviderFactory` in the `app.module.ts` file: 

{% highlight ts %}
export function jokesProviderFactory(provider: JokesProvider) {
  return () => provider.load();
}
{% endhighlight %}

Now, it's time to instruct Angular to use it in the init process. I have added `APP_INITIALIZER` to providers section of `@NgModule`: 

{% highlight ts %}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    JokesProvider, 
    { provide: APP_INITIALIZER, useFactory: jokesProviderFactory, deps: [JokesProvider], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
{% endhighlight %}

Now, if you start the application, you can see the request is being made to get the random joke: 

![app init process](/images/posts/2017-10-17-angular-preload/app-init.png)

## Using loaded joke in component 
If you want to use the data we have loaded, you simply inject the JokesProvider in the components constructor and use the `getJoke()` function: 

{% highlight ts %}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  jokeModel: JokeModel;
  
  constructor(jokesProvider: JokesProvider) {
    this.jokeModel = jokesProvider.getJoke();
  }

  ngOnInit() {
    console.log("AppComponent: OnInit()");
  }
}
{% endhighlight %}

Next, let's modify the template to show random joke: 

{% raw %}
```html
<h1>Joke of the day:</h1>
<p>{{jokeModel.joke}}</p>
```
{% endraw %}

And here's the result: 

![Joke of the day](/images/posts/2017-10-17-angular-preload/joke-of-the-day.png)

# Project on Github
Whole code for this project is available on [Github](https://github.com/mdymel/chuck). Let me know if something is not clear. 