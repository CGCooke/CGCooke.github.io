---
layout: post
title: The Dopler Shift
---

![_config.yml]({{ site.baseurl }}/images/SydneyVancouverGlobe.png)

{% highlight python %}
def heightToDelay(height,elevationAngle,reciever):
    path = 2*height/math.sin(math.radians(elevationAngle))
    delay = path*(reciever.CA_chip_frequency/reciever.speedOfLight)
    return(delay)
{% endhighlight %}

$$ \frac{v}{c}*f $$

