---
layout: post
title: Abstract the data from the API
date: '2016-08-09 08:00:41 +0200'
image: /images/posts/2016-08-09-abstract-data-api/featured.jpg
tags:
- .net
- api
---
Some time ago, I was faced with a problem. I had to import a lot of data from a third party API. It sounds simple and it was, but the API was using a completely flat structure for the data. It was also using a naming convention, which was completely different from the one in my code. To top it up, names it was using were not consistent at all. I didn't want to bring such a mess into my code, so I had to figure out a way to deal with it and transform this data into something nicer. The code I will be showing here was written in c#, but I am sure you can apply this pattern in any platform you are using.
The API was providing me with the information on a certain product. It was used to display a configurator of this product on a website, so I was also getting data about possible values and if some properties should be hidden from the user. Everything was coming as a list of properties looking similar to this class: 

{% highlight csharp %}
public class ProductProperty
{
   public string Name { get; set; }
   public string Value { get; set; }
   public List<string> PossibleValues { get; set; }
   public bool IsVisible { get; set; }


   public ProductProperty(string name, string value, IEnumerable<string> possibleValues = null, bool isVisible = true)
   {
       Name = name;
       Value = value;
       PossibleValues = possibleValues?.ToList();
       IsVisible = isVisible;
   }
}
{% endhighlight %}

Let's imagine, our product is a car and create a default configuration of this product.

{% highlight csharp %}
public static List<ProductProperty> CreateDefaultConfiguration()
{
   return new List<ProductProperty>
   {
       new ProductProperty("ENGINE_FUEL_TYPE", "Diesel", new[] {"Diesel", "Petrol", "Hybrid"}),
       new ProductProperty("ENGINE_TRANS", "Manual", new[] {"Manual", "Auto"}),
       new ProductProperty("EXT_COLOR", "Red", new[] {"Red", "Green", "Blue"}),
       new ProductProperty("RADIO_TYPE", "MP3", new[] {"MP3", "CD", "GPS"}),
       new ProductProperty("RADIO_SPEAKERS", "6", new []{"2", "4", "6", "8"}),
       new ProductProperty("GPS_MAPS", null, null, false),
       new ProductProperty("EXT_HEADLIGHTS", "Normal"),
       new ProductProperty("CONF_NAME", "Michal Dymel"),
   };
}
{% endhighlight %}

As you can see, the configuration we get from the API is flat, contains all the properties in one level. Also property names are not something we could easily transform into class fields. To work with such data we have two choices. One is to use it as is - work on strings and implement many If statements checking their values. The problem with such approach is, we would need to introduce many "magic strings" (evil!). If we make a mistake, it would be very hard to find it. That's why we shouldn't do it. Instead, we should come up with a solution allowing us to convert this data into a well structured class like this one: 

{% highlight csharp %}
public class CarConfiguration
{
   public string CustomerName { get; set; }
   public EngineConfiguration Engine { get; set; }
   public ExteriorConfiguration Exterior { get; set; }
   public InteriorConfiguration Interior { get; set; }
}
public class EngineConfiguration
{
   public EngineType Type { get; set; }
   public TransmissionType Transmission { get; set; }
}
public class ExteriorConfiguration
{
   public ColorType Color { get; set; }
   public HeadLightsType HeadLights { get; set; }
}
public class InteriorConfiguration
{
   public RadioType Radio { get; set; }
   public GpsMapsRegion GpsMaps { get; set; }
   public int NumberOfSpeakers { get; set; }
}
{% endhighlight %}

As you can see, this class contains the same information as our list of properties. The difference is, this data is well structured, works on enums, not strings and is much easier to manage in the code. Now we need to come up with a way to transform one into another. Obviously, we could implement manual mapping and convert each property one by one, but remember this is just an example. In reality, I was facing hundreds of properties. There was no way I would do that manually. What I did instead was use an **Attribute** class. Attribute classes are like tags you can add to other classes, methods or properties. For example, when you're using ASP.NET MVC and want to make a method available only to authorised users, you would decorate it with an _[Authorize]_ attribute. 

My idea was to create a custom attribute and tag all configuration class properties with it, specifying name of the API property it should get data from. With that, I will be able to get all the CarConfiguration properties using reflection, read the attribute data and assign them with the values I got from the API. 

This is the CarProperty class describing the attribute: 

{% highlight csharp %}
public class CarProperty : Attribute
{
   public enum PropertyType
   {
       Value,
       PossibleValues,
       IsVisible
   }
   public CarProperty(string name, PropertyType propertyType = PropertyType.Value)
   {
       Name = name;
       Type = propertyType;
   }
   public string Name { get; }
   public PropertyType Type { get; set; }
}
{% endhighlight %}

Now, I can add this attribute to the CarConfiguration class: 

{% highlight csharp %}
public class CarConfiguration
{
   [CarProperty("CONF_NAME")]
   public string CustomerName { get; set; }
   [CarProperty]
   public EngineConfiguration Engine { get; set; }
   [CarProperty]
   public ExteriorConfiguration Exterior { get; set; }
   [CarProperty]
   public InteriorConfiguration Interior { get; set; }
}
public class EngineConfiguration
{
   [CarProperty("ENGINE_FUEL_TYPE")]
   public EngineType Type { get; set; }
   [CarProperty("ENGINE_TRANS")]
   public TransmissionType Transmission { get; set; }
}
public class ExteriorConfiguration
{
   [CarProperty("EXT_COLOR")]
   public ColorType Color { get; set; }
   [CarProperty("EXT_COLOR", CarProperty.PropertyType.PossibleValues)]
   public ColorType[] ColorsPossible { get; set; }
   [CarProperty("EXT_HEADLIGHTS")]
   public HeadLightsType HeadLights { get; set; }
}
public class InteriorConfiguration
{
   [CarProperty("RADIO_TYPE")]
   public RadioType Radio { get; set; }
   [CarProperty("GPS_MAPS")]
   public GpsMapsRegion GpsMaps { get; set; }
   [CarProperty("GPS_MAPS", CarProperty.PropertyType.IsVisible)]
   public bool GpsMapsVisible { get; set; }
   [CarProperty("RADIO_SPEAKERS")]
   public int NumberOfSpeakers { get; set; }
}
{% endhighlight %}

What's left to do is create a mapper, which will use the CarProperty attribute to map the data. 

{% highlight csharp %}
public static class CarPropertyMapper
{
    public static T Map<T>(List<ProductProperty> properties)
    {
        var model = Activator.CreateInstance<T>();
        foreach (PropertyInfo propertyInfo in model.GetType().GetProperties())
        {
            var attribute =
                (CarProperty)
                    propertyInfo.GetCustomAttributes().FirstOrDefault(a => a.GetType() == typeof(CarProperty));
            if (attribute == null) continue;

            if (attribute.Type == CarProperty.PropertyType.Properties)
            {
                MethodInfo methodInfo = typeof(CarPropertyMapper).GetMethod("Map");
                MethodInfo genericMethod = methodInfo.MakeGenericMethod(propertyInfo.PropertyType);
                object value = genericMethod.Invoke(null, new object[] {properties});
                propertyInfo.SetValue(model, value);
                continue;
            }

            ProductProperty productProperty = properties.FirstOrDefault(p => p.Name == attribute.Name);
            if (productProperty == null) continue;

            switch (attribute.Type)
            {
                case CarProperty.PropertyType.Value:
                    string propertyValue = productProperty.Value;
                    if (propertyValue == null) continue;

                    object targetValue = ParsePropertyValue(propertyInfo.PropertyType, propertyValue);
                    if (targetValue == null)
                    {
                        continue;
                    }
                    propertyInfo.SetValue(model, targetValue);
                    break;

                case CarProperty.PropertyType.PossibleValues:
                    var possibleValues = productProperty.PossibleValues;

                    Type elementType = propertyInfo.PropertyType.GetElementType();
                    Array targetArray = Array.CreateInstance(elementType, possibleValues.Length);

                    var i = 0;
                    foreach (string proposedValue in possibleValues)
                    {
                        if (elementType == typeof(int)) targetArray.SetValue(ParseInt(proposedValue), i++);
                        else if (elementType == typeof(string)) targetArray.SetValue(proposedValue, i++);
                        else if (elementType.IsEnum)
                            targetArray.SetValue(ParseEnum(elementType, proposedValue), i++);
                    }
                    propertyInfo.SetValue(model, targetArray);
                    break;

                case CarProperty.PropertyType.IsVisible:
                    propertyInfo.SetValue(model, productProperty.IsVisible);
                    break;

                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
        return model;
    }

    private static object ParsePropertyValue(Type propertyType, string propertyValue)
    {
        object targetValue = null;
        if (propertyType == typeof(int)) targetValue = ParseInt(propertyValue);
        else if (propertyType == typeof(string)) targetValue = propertyValue;
        else if (propertyType == typeof(bool))
            targetValue = propertyValue.Equals("true", StringComparison.InvariantCultureIgnoreCase);
        else if (propertyType.IsEnum) targetValue = ParseEnum(propertyType, propertyValue);
        return targetValue;
    }

    private static object ParseEnum(Type enumType, string value)
    {
        if (string.IsNullOrEmpty(value)) return Enum.GetValues(enumType).GetValue(0);
        return Enum.Parse(enumType, value, true);
    }

    private static int ParseInt(string value)
    {
        int result;
        if (string.IsNullOrEmpty(value)) return 0;
        if (!int.TryParse(value, out result)) throw new Exception("Int parse unsuccessful");
        return result;
    }
}
{% endhighlight %}

In the first step, mapper gets all CarConfiguration (the generic param T) properties and loops through them. It reads our custom CarProperty attribute and based on its type it either calls Map() method again (if the property contains another object) or copies a value from corresponding API property - based on a PropertyType (Value, PossibleValues, IsVisible). Because the API was returning everything as strings, I had to add a conversion to desired CarConfiguration types (int, string, enum). It might sound complicated, but if you look at the code above, you'll see it's really simple.
Such mapper makes it very easy to add new properties to parse from the API - you just add a new field in CarConfiguration class, decorate it with CarProperty attribute and that's it. 

Whole code is available on [github](https://github.com/mdymel/ApiDataAbstraction). 

These days, very often we need to utilise various third party APIs. Some of these provide data in some weird formats. That doesn't mean you need to break your coding style and adapt to these formats. It's much better to create an adapter, an abstraction layer and hide ugly things beneath it. Using the method above is one way to do it. What are you doing to deal with bad data providers? Answer in comments below. 


