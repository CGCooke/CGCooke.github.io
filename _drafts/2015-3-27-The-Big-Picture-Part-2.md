---
layout: post
title: Interpolating scattered data
---

![_config.yml]({{ site.baseurl }}/images/6/header.png)

> Scattered points in, pretty pictures out. Let's talk about two dimensional interpolation.

---
Summary
===============

Geospatial data often comes in the forms of samples taken at different points, when this occours a common next step is interpolation. 
There are a number of different loptions for interpolation in python, lets exemaine what they are, and how they behave!

---

The Data
===============

I've created a test dataset, by sampling randomly sampling the SRTM 90M DEM, the points can be found [here](https://www.dropbox.com/s/inw6rr9bflkkgfi/coordinates.csv?dl=0).

Our first tast is to import the libuaries that we will need later. 
{% highlight python %}
import numpy as np
from matplotlib.mlab import griddata
import matplotlib.pyplot as plt
from pyproj import Proj
{% endhighlight %}


{% highlight python %}
xArray = np.loadtxt('coordinates.csv',delimiter=',',usecols=(0,))
yArray = np.loadtxt('coordinates.csv',delimiter=',',usecols=(1,))
heightArray = np.loadtxt('coordinates.csv',delimiter=',',usecols=(2,))
{% endhighlight %}


{% highlight python %}
plt.scatter(xArray,yArray,c=heightArray,cmap ='RdYlGn_r',alpha=0.75)
plt.title('Scatter Plot')
plt.savefig('ScatterPlot.png')
plt.close()
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/6/ScatterPlot.png)


---

Interpolation
===============

{% highlight python %}
numIndexes = 500
xi = np.linspace(np.min(xArray), np.max(xArray),numIndexes)
yi = np.linspace(np.min(yArray), np.max(yArray),numIndexes)
DEM = griddata(xArray, yArray, heightArray, xi, yi)
{% endhighlight %}

---

Contour plots
===============

{% highlight python %}
levels = np.arange(np.min(DEM),np.max(DEM),25)
plt.contour(DEM, levels,linewidths=0.2,colors='k')
{% endhighlight %}

{% highlight python %}
plt.imshow(DEM,cmap ='RdYlGn_r',origin='lower')
plt.colorbar()
{% endhighlight %}

{% highlight python %}
xArrayNormalized=xArray/(np.max(xArray)-np.min(xArray))
xArrayNormalized-=np.min(xArrayNormalized)
yArrayNormalized=yArray/(np.max(yArray)-np.min(yArray))
yArrayNormalized-=np.min(yArrayNormalized)
plt.scatter(numIndexes*xArrayNormalized,numIndexes*yArrayNormalized,color='k',alpha=0.25)
{% endhighlight %}

{% highlight python %}
plt.title('Height in meters')
plt.savefig('ContourMap.png',dpi=900)
plt.close()
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/6/ContourMap.png)

---

Further reading
===============