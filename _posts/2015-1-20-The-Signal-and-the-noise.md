---
layout: post
title: The signal and the noise.
---

![_config.yml]({{ site.baseurl }}/images/config.png)

The easiest way to make your first post is to edit this one. Go into /_posts/ and update the Hello World markdown file. For more instructions head over to the [Jekyll Now repository](https://github.com/barryclark/jekyll-now) on GitHub.



{% highlight python %}
def heightToDelay(height,elevationAngle,reciever):
    path = 2*height/math.sin(math.radians(elevationAngle))
    delay = path*(reciever.CA_chip_frequency/reciever.speedOfLight)
    return(delay)
{% endhighlight %}