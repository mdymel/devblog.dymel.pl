---
layout: post
title: Angular2 and i18n - translating your application
date: '2016-11-03'
featured: /images/posts/2016-11-03-angular2-and-i18n-translate-your-app/featured.jpg
image: /images/posts/2016-11-03-angular2-and-i18n-translate-your-app/featured.jpg
tags: 
 - angular2
---
Continuing, what has become, an Angular2 series on my blog, today I would like to show you, how to internationalise your Angular2 application. You will learn how to tag your messages, how to build xlf files for translation and to configure your application. 

1. TOC
{:toc}

Code: [GitHub](https://github.com/mdymel/ng2-i18n)

# Internationalization (i18n) vs localization (l10n)
The first thing I would like to cover is the difference between the terms above. This is an explanation you can find on w3c service: 

> Localisation refers to the adaptation of a product, application or document content to meet the language, cultural and other requirements of a specific target market (a "locale").
> 
> Internationalisation is the design and development of a product, application or document content that enables easy localisation for target audiences that vary in culture, region, or language.

In short, we will focus on making your app translatable. 

# Installing the tools your need 
The angular team has prepared a tool, which extracts messages for translation. It is a part of angular compiler CLI. You install it with the angular compiler using following command: `npm install @angular/compiler-cli @angular/platform-server --save`.  

# Generating your app
As I mentioned before in the [tutorial](/2016/10/25/angular2-cli-with-aspnet-core-application-tutorial/) and [post](/2016/10/20/angular2-cli/) about Angular CLI, when you starting a new project, in my opinion, you should use the CLI. Unfortunately, right now, you can't use the CLI in translated applications. It's because the CLI compiles your templates while doing the build. The problem with that is, the translations are applied during the compilation. This means the CLI would have to generate one build per language... Currently, maintainers of i18n are discussing possibilities, how to merge these two worlds. Until it's resolved, if you want to translate your application, you have to stick to a traditional approach. 

You can check, how to prepare a project in the [tutorial](/2016/09/08/aspnet-core-with-angular2-tutorial/) I have written a few weeks ago. For this post, I have used the [quickstart guide](https://angular.io/docs/ts/latest/quickstart.html) available on angular site.  

Now, when you have a working project, we're ready to put some translatable content there. 

# Translating app content
To mark text for translation, you need to add i18n attribute to the html tag surrounding this text. Look at the examples here: 

{% highlight html %}
<h2 i18n="header">Login form</h2>
<div>
  <span i18n>Email</span>
  <input type="text" placeholder="Your email" i18n-placeholder>
</div>
<div>
  <span i18n>Password</span>
  <input type="password" placeholder="Password" i18n-placeholder>
</div>

<hr>

<div i18n>If you want to search something, go to <a href="http://google.com">Google</a></div>
{% endhighlight %}

You can translate tag contents and also values in other attributes (`i18n placeholder`). You can also assign a comment to i18n attribute, which will be stored also in the files with all your messages. It also works if you have other tags inside (like with the google link example). 

# Creating language files 
To parse your app and generate messages.xlf file, you need to run the `ng-xi18n` tool. It's located in `node_modules/.bin` directory: 
`node_modules\.bin\ng-xi18n`. It analyses all your templates, extracts messages to be translated and creates a messages.xlf file. 

The i18n support is still in the beta stage. The `ng-xi18n` will probably output some error messages, but your can ignore them. 

After a while, messages.xlf file is generated: 

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="cee9a1765db9ad1b440406cee88f743bad1f93e0" datatype="html">
        <source>Login form</source>
        <target/>
        <note priority="1" from="description">header</note>
      </trans-unit>
      <trans-unit id="244aae9346da82b0922506c2d2581373a15641cc" datatype="html">
        <source>Email</source>
        <target/>
      </trans-unit>
      <trans-unit id="0b892c7805a1c5afc0b7c21c3449760860fe7f3d" datatype="html">
        <source>Your email</source>
        <target/>
      </trans-unit>
      <trans-unit id="c32ef07f8803a223a83ed17024b38e8d82292407" datatype="html">
        <source>Password</source>
        <target/>
      </trans-unit>
      <trans-unit id="656891694a50cdda356e1bdeaef520fe7f6604f9" datatype="html">
        <source>If you want to search something, go to <x id="START_LINK" ctype="x-a"/>Google<x id="CLOSE_LINK" ctype="x-a"/></source>
        <target/>
      </trans-unit>
    </body>
  </file>
</xliff>
{% endhighlight %}

Now, you need to move this file to `/src/lang` folder, create a copy for every language you want to use. I have created files for English and Polish. The latter looks like this (`messages_pl.xlf`). **Notice, the translations in the `target` tags**.

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="cee9a1765db9ad1b440406cee88f743bad1f93e0" datatype="html">
        <source>Login form</source>
        <target>Formularz logowania</target>
        <note priority="1" from="description">header</note>
      </trans-unit>
      <trans-unit id="244aae9346da82b0922506c2d2581373a15641cc" datatype="html">
        <source>Email</source>
        <target>Email</target>
      </trans-unit>
      <trans-unit id="0b892c7805a1c5afc0b7c21c3449760860fe7f3d" datatype="html">
        <source>Your email</source>
        <target>Twój email</target>
      </trans-unit>
      <trans-unit id="c32ef07f8803a223a83ed17024b38e8d82292407" datatype="html">
        <source>Password</source>
        <target>Hasło</target>
      </trans-unit>
      <trans-unit id="656891694a50cdda356e1bdeaef520fe7f6604f9" datatype="html">
        <source>If you want to search something, go to <x id="START_LINK" ctype="x-a"/>Google<x id="CLOSE_LINK" ctype="x-a"/></source>
        <target>Jeśli chcesz czegoś poszukać, spróbuj w <x id="START_LINK" ctype="x-a"/>Google<x id="CLOSE_LINK" ctype="x-a"/></target>
      </trans-unit>
    </body>
  </file>
</xliff>
{% endhighlight %}

# Making angular use the translation files
Now, all files are setup - we need to let angular know it should use them. 

## SystemJS plugin to read files text content
Because we will use SystemJS to load xlf files, we need to make it possible to load pure text with it. Create a file `systemjs-text-plugin.js`: 

{% highlight js %}
/*
  SystemJS Text plugin from
  https://github.com/systemjs/plugin-text/blob/master/text.js
*/
exports.translate = function(load) {
  if (this.builder && this.transpiler) {
    load.metadata.format = 'esm';
    return 'exp' + 'ort var __useDefault = true; exp' + 'ort default ' + JSON.stringify(load.source) + ';';
  }

  load.metadata.format = 'amd';
  return 'def' + 'ine(function() {\nreturn ' + JSON.stringify(load.source) + ';\n});';
}
{% endhighlight %}

## Configuring the application
First, we need to load the text plugin and setup the language to use. The latter can be done using cookies or read from some sort of API. For the purpose of this post, I simply hardcoded it. The code below has to be added to `index.html`, before the app initialization.

{% highlight js %} 
// Get the locale id somehow
document.locale = 'fr';

// Map to the text plugin
System.config({
map: {
    text: 'systemjs-text-plugin.js'
}
});
{% endhighlight %}

Next, we need to add a script, which will generate translation providers: 

{% highlight js %} 
import { TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID } from '@angular/core';

export function getTranslationProviders(): Promise<Object[]> {
  // Get the locale id from the global
  const locale = document['locale'] as string;
  // return no providers if fail to get translation file for locale
  const noProviders: Object[] = [];
  // No locale or U.S. English: no translation providers
  if (!locale || locale === 'en') {
    return Promise.resolve(noProviders);
  }
  // Ex: 'locale/messages.fr.xlf`
  const translationFile = `./lang/messages_${locale}.xlf`;
  return getTranslationsWithSystemJs(translationFile)
    .then( (translations: string ) => [
      { provide: TRANSLATIONS, useValue: translations },
      { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
      { provide: LOCALE_ID, useValue: locale }
    ])
    .catch(() => noProviders); // ignore if file not found
}
declare var System: any;
function getTranslationsWithSystemJs(file: string) {
  return System.import(file + '!text'); // relies on text plugin
}
{% endhighlight %}

It's checking `document['locale']`, getting a file with translations and passing it in the array with providers. 

Now, we have to modify `main.ts` file to use these providers: 

{% highlight js %} 
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { getTranslationProviders } from './i18n-providers';

getTranslationProviders().then(providers => {
  const options = { providers };
  platformBrowserDynamic().bootstrapModule(AppModule, options);
});
{% endhighlight %}

After these changes, we have an application available in two languages and a possibility to add as many others as you need. 

![app translated to Polish](/images/posts/2016-11-03-angular2-and-i18n-translate-your-app/app-i18n.png)

# Summary
Even though the internationalisation for Angular2 is still in beta, it seems to be working quite well. It's simple to use and covers pretty much everything you might need. The only downside for me is you can't use it with projects generated with the CLI tool, but that should be solved soon, I hope. 

As always, you can get the code for this post from [GitHub](https://github.com/mdymel/ng2-i18n).