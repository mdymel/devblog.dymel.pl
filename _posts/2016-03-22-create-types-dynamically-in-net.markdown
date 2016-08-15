---
layout: post
title: 'MiSeCo #3: Create types dynamically in C# .NET'
date: '2016-03-22 18:15:24 +0100'
categories:
- DajSiePoznac
- MiSeCo
tags:
- dajsiepoznac
- miseco
- c#
- runtime
- .net
---
In the last post, I wrote about the structure of a MiSeCo project and how I am going to implement the base functionality. Today I would like to show you how I managed to create my first **interface implementation dynamically** in runtime. Just to remind you, I need them to be able to proxy the calls between microservices through some (to be defined) protocol - probably over HTTP connections. Services will be able to communicate with each other even though they won't know where the other service is being hosted or even if it's currently operating. If it's not operating, **MiSeCo will be able to queue requests **and fire them later, when the problem is resolved.

Last week I have completed the following code:

{% highlight csharp %}
var miseco = new MiSeCo();
var service1 = miseco.CreateServiceObject();
Console.WriteLine($"2+2={service1.Add(2, 2)}");
{% endhighlight %}

The second line is responsible for creating a new type based on a given interface. Every type in .NET is part of an assembly - assemblies are the building blocks of all .NET applications. You can easily create new assemblies at runtime.

# Creating assembly

{% highlight csharp %}
public MiSeCo()
{
    Type myType = GetType();
    _myName = myType.Name;

    string guid = Guid.NewGuid().ToString();
    var assemblyName = new AssemblyName(string.Concat(myType.Namespace, ".", myType.Name, "_", guid));

    AssemblyBuilder ab = AppDomain.CurrentDomain.DefineDynamicAssembly(assemblyName, AssemblyBuilderAccess.RunAndSave);
    _moduleBuilder = ab.DefineDynamicModule(assemblyName.Name, string.Concat(assemblyName.Name, ".dll"));
}
{% endhighlight %}

As you can see, I am generating a new name from a MiSeCo type name and random Guid value. This will allow many services to use the same name. Next, I am creating a dynamic assembly and a module builder, which will be needed shortly.

# Creating new type

{% highlight csharp %}
public T CreateServiceObject() where T:IContractInterface
{
    Type type = typeof (T);
    string typeName = string.Concat(_myName, "+", type.FullName);

    TypeBuilder typeBuilder = _moduleBuilder.DefineType(typeName, TypeAttributes.Public);
    Type parent = typeof(DynamicProxy);

    typeBuilder.SetParent(parent);
    typeBuilder.AddInterfaceImplementation(type);

    var baseConstructor = parent.GetConstructors(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).First();
    SetConstructor(typeBuilder, baseConstructor);

    Type newType = typeBuilder.CreateType();
    return (T) Activator.CreateInstance(newType);
}
{% endhighlight %}

All dynamic implementations will have a parent class of DynamicProxy. It will provide a default constructor and method implementation acting as a proxy. For now it only has an empty constructor. In the above code a new type is being created. It has a defined parent class and an interface which it implements. Next I get a default constructor from the parent class and set the same implementation in the new types constructor.

# Setting constructor

{% highlight csharp %}
private void SetConstructor(TypeBuilder typeBuilder, ConstructorInfo baseConstructor)
{
    var constructor = typeBuilder.DefineConstructor(MethodAttributes.Public, baseConstructor.CallingConvention, null);

    ILGenerator ilGenerator = constructor.GetILGenerator();
    ilGenerator.Emit(OpCodes.Nop);
    ilGenerator.Emit(OpCodes.Ldarg_0);
    ilGenerator.Emit(OpCodes.Call, baseConstructor);
    ilGenerator.Emit(OpCodes.Ret);
}
{% endhighlight %}

To create a new constructor having the same implementation as the one in the DynamicProxy base class, we need to get an Intermediate Language generator (ILGenerator) and set the constructor to call the base implementation.

> Intermediate language (IL) is an object-oriented programming language designed to be used by compilers for the .NET Framework before static or dynamic compilation to machine code. The IL is used by the .NET Framework to generate machine-independent code as the output of compilation of the source code written in any .NET programming language..
> [https://www.techopedia.com/definition/24290/intermediate-language-il-net](https://www.techopedia.com/definition/24290/intermediate-language-il-net)

# Next...
This code returns an object of a new, dynamically defined type which is a valid implementation of a given interface. For now this interface is empty - the next step will be to add interface methods to the object.

You can find the MiSeCo source code on [github](https://github.com/mdymel/miseco). Go ahead and star it to get updates about new changes.

PS. I found a lot of information about Dymanic Interfaces in an article by Kemeny Attila on CodeProject: [http://www.codeproject.com/Articles/742788/Dynamic-Interface-Implementation](http://www.codeproject.com/Articles/742788/Dynamic-Interface-Implementation)
