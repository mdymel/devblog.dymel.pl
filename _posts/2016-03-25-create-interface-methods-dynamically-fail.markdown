---
layout: post
title: 'MiSeCo #4: Create interface methods dynamically - #fail'
date: '2016-03-25 08:00:23 +0100'
image: /images/posts/2016-03-25-create-interface-methods-dynamically-fail/featured.jpg
tags:
- dajsiepoznac
- miseco
- .net
---
In my [last post](/2016/03/22/create-types-dynamically-in-net) I have demonstrated a function generating a proxy object implementing an empty interface and a constructor from a base class. Now I will try to extend it to implement interface methods. First we need to list the interface methods we need to implement. We also have to remember our interface may inherit from other interfaces, so we need to scan it recursively.

To make things simpler and easier to follow, I will split the whole process into many small methods.

# Implement interface
As the first step let's create an entry point implementing an interface:

{% highlight csharp %}
private void ImplementInterface(TypeBuilder typeBuilder, Type type)
{
    ImplementMethods(typeBuilder, type);
    foreach (Type parentInterface in type.GetInterfaces())
    {
        ImplementInterface(typeBuilder, parentInterface);
    }
}
{% endhighlight %}

This method calls ImplementMethods() on our main interface and all parent interfaces.

# Get Methods
We need to iterate through all the methods in the interface and implement all of them:

{% highlight csharp %}
private void ImplementMethods(TypeBuilder typeBuilder, Type type)
{
    foreach (MethodInfo methodInfo in type.GetMethods())
    {
        GenerateMethod(typeBuilder, methodInfo);
    }
}
{% endhighlight %}


# Generate Method
Finally - the main event of the evening - we are ready to generate a single method!

{% highlight csharp %}
private void GenerateMethod(TypeBuilder typeBuilder, MethodInfo methodInfo)
{
    if (typeBuilder.GetMethods().Any(m => m.Name == methodInfo.Name))
    {
			//method already implemented
			return;
	}
	throw new NotImplementedException();
}
{% endhighlight %}

Now the fun part begins... We want our method to call other method(s) from the base class (DynamicProxy) and pass information about the call (name, parameters, return type etc.). There are few steps we need to take to do that:

* Prepare a list of method parameters
* Define a method with the typebuilder
* Use IL Generator to create a method body, which calls the DynamicProxy method

For now I will Ignore the problem of generic parameters and overloading methods with the same names. Let's leave that for later ;)

---

![traffic sign](/images/posts/2016-03-25-create-interface-methods-dynamically-fail/traffic_sign.jpg)

I will stop here. I spent two evenings analyzing the code that generates a method proxy:

{% highlight csharp %}
// Source: http://www.codeproject.com/Articles/742788/Dynamic-Interface-Implementation

private void EmitInvokeMethod(MethodInfo mi, MethodBuilder mb)
        {
            ILGenerator ilGenerator = mb.GetILGenerator();

            string methodName = mb.Name;
            LocalBuilder typeLb = ilGenerator.DeclareLocal(typeof(Type), true);
            LocalBuilder paramsLb = ilGenerator.DeclareLocal(typeof(List<object width="300" height="150">), true);
            LocalBuilder resultLb = ilGenerator.DeclareLocal(typeof(object), true);
            LocalBuilder retLb = ilGenerator.DeclareLocal(typeof(bool), true);

            //C#: Type.GetTypeFromHandle(interfaceType)
            EmitAndStoreGetTypeFromHandle(ilGenerator, mi.DeclaringType, OpCodes.Stloc_0);

            //C#: params = new List<object>()
            ilGenerator.Emit(OpCodes.Newobj, typeof(List<object>).GetConstructor(Type.EmptyTypes));
            ilGenerator.Emit(OpCodes.Stloc_1);

            int i = 0;
            foreach (ParameterInfo pi in mi.GetParameters())
            {
                //C#: params.Add(param[i])
                i++;
                ilGenerator.Emit(OpCodes.Ldloc_1);
                ilGenerator.Emit(OpCodes.Ldarg, i);
                if (pi.ParameterType.IsValueType)
                {
                    ilGenerator.Emit(OpCodes.Box, pi.ParameterType);
                }
                ilGenerator.EmitCall(OpCodes.Callvirt, listAddMethodInfo, null);
            }
            //C#: ret = DynamicProxy.TryInvokeMember(interfaceType, propertyName, params, out result)
            ilGenerator.Emit(OpCodes.Ldarg_0);
            ilGenerator.Emit(OpCodes.Ldloc_0);
            ilGenerator.Emit(OpCodes.Ldstr, methodName);
            ilGenerator.Emit(OpCodes.Ldloc_1);
            ilGenerator.EmitCall(OpCodes.Callvirt, listToArrayMethodInfo, null);
            ilGenerator.Emit(OpCodes.Ldloca_S, 2);
            ilGenerator.EmitCall(OpCodes.Callvirt, tryInvokeMemberInfo, null);
            ilGenerator.Emit(OpCodes.Stloc_3);

            if (mi.ReturnType != typeof(void))
            {
                ilGenerator.Emit(OpCodes.Ldloc_2);
                //C#: if(ret == ValueType && ret == null){
                //    ret = Activator.CreateInstance(returnType) }
                if (mi.ReturnType.IsValueType)
                {
                    Label retisnull = ilGenerator.DefineLabel();
                    Label endofif = ilGenerator.DefineLabel();

                    ilGenerator.Emit(OpCodes.Ldnull);
                    ilGenerator.Emit(OpCodes.Ceq);
                    ilGenerator.Emit(OpCodes.Brtrue_S, retisnull);
                    ilGenerator.Emit(OpCodes.Ldloc_2);
                    ilGenerator.Emit(OpCodes.Unbox_Any, mi.ReturnType);
                    ilGenerator.Emit(OpCodes.Br_S, endofif);
                    ilGenerator.MarkLabel(retisnull);
                    ilGenerator.Emit(OpCodes.Ldtoken, mi.ReturnType);
                    ilGenerator.EmitCall(OpCodes.Call, getTypeFromHandleMethodInfo, null);
                    ilGenerator.EmitCall(OpCodes.Call, activatorCreateInstanceMethodInfo, null);
                    ilGenerator.Emit(OpCodes.Unbox_Any, mi.ReturnType);
                    ilGenerator.MarkLabel(endofif);
                }
            }
            //C#: return ret
            ilGenerator.Emit(OpCodes.Ret);
        }


{% endhighlight %}


And all I could do is copy it to my project and try to get it running. I would have to spend much more time on reading and learning IL to understand what is going on here. Let alone writing&nbsp;a blog post about it :). This is not the goal of this project or blog, so I decided to give up and take a different path.

No, no. I am not giving up on the project! I was lucky enough to get some helpful comments with suggestions to a previous post. Some people recommended [Castle DynamicProxy](http://www.castleproject.org/projects/dynamicproxy/) - a framework doing just what I tried to solve here. It's being used in NHibernate and a few mocking libraries. If these guys didn't bother to do it manually, I think I am well excused from doing the same ;)

Sorry if you were hoping to learn how to grasp IL here. Maybe I will get back to it one day. For now I want to move forward with the project and I think sometimes it's better to take the safer path than spend two weeks on a problem and end up with code you don't fully understand. Especially that such code is much more prone to bugs.

# Next...

I hope I will be able to show you a basic proxy implementation using DynamicProxy in the next post. 