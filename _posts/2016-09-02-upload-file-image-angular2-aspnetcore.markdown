---
layout: post
title: How to upload a file (image) from angular2 to asp.net core
date: '2016-09-02'
image: /images/posts/2016-09-02-upload-file-image-angular2-aspnetcore/featured.jpg
tags: 
 - aspnetcore
 - angular2
---
Today, at work, I spent quite a long time on figuring out, how to handle file upload, image to be exact, from angular2 app to backend in ASP.NET Core. I thought it's a good idea for a post -  maybe it will save you some time. 

# Problem
I want to have a component in angular2 which will display a form with a file selector and the submit button. This form will post the file to a backend in ASP.NET Core, which will handle the file and save it somewhere. 

# Angular2 frontend part 

## Form
First thing you need is a form to select a file:

{% highlight html %}
<input #fileInput type="file"/>
<button (click)="addFile()">Add</button>
{% endhighlight %}

That's all you need - file input and a button to trigger the upload. 

## Angular2 Component
Next, you have to handle the upload in your Angular component: 

{% highlight ts %}
@ViewChild("fileInput") fileInput;

addFile(): void {
    let fi = this.fileInput.nativeElement;
    if (fi.files && fi.files[0]) {
        let fileToUpload = fi.files[0];
        this.uploadService
            .upload(fileToUpload)
            .subscribe(res => {
                console.log(res);
            });
    }
}
{% endhighlight %}

_@ViewChild_ is a reference to the file input in our template. First thing in the _addFile()_ method, we're reading it, selecting a file to upload and passing it to upload service. 

## Angular2 Upload Service

{% highlight ts %}
upload(fileToUpload: any) {
    let input = new FormData();
    input.append("file", fileToUpload);

    return this.http
        .post("/api/uploadFile", input);
}
{% endhighlight %}

This is the part that took me long time to figure (google) out. At first I tried to pass _fileToUpload_ as a param to http POST request, but then it wasn't creating multipart request and ASP.NET wasn't handling it correctly. The _FormData_ is needed for it to happen. I think the rest is self explanatory. 

# Handling upload in ASP.NET Core 
This again looks easy... when you know how to use it :) 

{% highlight c# %}
[HttpPost]
[Route("/api/upload")]
public async Task Upload(IFormFile file)
{
    if (file == null) throw new Exception("File is null");
    if (file.Length == 0) throw new Exception("File is empty");

    using (Stream stream = file.OpenReadStream())
    {
        using (var binaryReader = new BinaryReader(stream))
        {
            var fileContent = binaryReader.ReadBytes((int)file.Length);
            await _uploadService.AddFile(fileContent, file.FileName, file.ContentType);
        }
    }
}
{% endhighlight %}

It is a bit different than how it looked in previous versions of ASP.NET. Instead of working with _HttpContect_, we are using _IFormFile_ object, which contains all the informations about the uploaded file. If you want to handle multiple files, you can change the param to _ICollection&lt;IFormFile&gt;_. The thing which is crucial for it to work is the parameter name. I was banging my head for an hour, because it wasn't working. Turned out, I used __different name__ in Angular and different here. __The input name in POST must be the same as method param in ASP.NET__. The rest is easy - we get the file stream, which we can use to read the files content and other params are available in the __IFormFile__ object. 

# Summary
As you see, it's quite easy to implement, when you know how. I hope this post will save someone time of working out how to accomplish that. 

If you're interested in Angular2 or ASP.NET Core, I will definitely be posting more about these two. Sign up for email newsletter, or follow my twitter or facebook not to miss anything. Next week, I will publish a post on my way of bringing ASP.NET Core and Angular2 together.  