---
layout: post
title: Interpolating scattered data in Python
---

![_config.yml]({{ site.baseurl }}/images/6/header.png)

> Scattered points in, pretty pictures out. Let's talk about two dimensional interpolation. 

---
Summary
===============

Geospatial data often comes in the forms of samples taken at different points, when this occours a common next step is interpolation. 
An example of this is Airbourne LiDAR, where a laser range finder is scanned over the ground underneath the aircraft. The produces a cloud of scattered points, and often the next step is build a Digital Elevation Model (DEM) from these scattered points.  There are a number of different options for interpolation in python, the correct choice of method is often task specific, so its good to have some options at your disposal.

---

The Data
===============

I've created a test dataset, by sampling randomly sampling the SRTM 90M DEM, the points can be found [here](https://www.dropbox.com/s/msds7t2ilb0lzb4/coordinates.csv?dl=0).

Our first tast is to import the libuaries that we will need later. 

{% highlight python %}
import numpy as np
from matplotlib.mlab import griddata
import matplotlib.pyplot as plt
from pyproj import Proj
{% endhighlight %}

We can quickly load the data from a csv using numpy's 'loadtext' function.

{% highlight python %}
xArray = np.loadtxt('coordinates.csv',delimiter=',',usecols=(0,))
yArray = np.loadtxt('coordinates.csv',delimiter=',',usecols=(1,))
heightArray = np.loadtxt('coordinates.csv',delimiter=',',usecols=(2,))
{% endhighlight %}


We can quickly get a rough overview of what the dataset looks like by creating a scatter plot. 

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

Ultimately, there is no universally correct choice of interpolation method to use. However it is useful to know the mechanics associated with going from scattered points to an interpolated array for a number of different methods. 


{% highlight python %}
numIndexes = 500
xi = np.linspace(np.min(xArray), np.max(xArray),numIndexes)
yi = np.linspace(np.min(yArray), np.max(yArray),numIndexes)
{% endhighlight %}

The first method we can try is Delaunay triangulation, which can be found in matplotlib.mlab. 
{% highlight python %}
DEM = griddata(xArray, yArray, heightArray, xi, yi)
{% endhighlight %}


Another option is linear interpolation, which can be performed using scipy.interpolate.
{% highlight python %}
XI, YI = np.meshgrid(xi, yi)
points = np.asarray(points)
values = np.asarray(estimatedHeightList)
DEM =scipy.interpolate.griddata(points, values, (XI,YI), method='linear')
{% endhighlight %}

http://wiki.scipy.org/Cookbook/Matplotlib/Gridding_irregularly_spaced_data

"IDW is a terrible choice in almost every case. It assumes that all of your input data points are local minimums or maximums! I'm not sure at all people use it as a general interpolation technique... (Lots of people certainly do, though!)"

---

Contour plots
===============

Contour plots are useful for visualzing Digital Elevation Models, Our first step is to create the contour lines, with a 25m contour interval as follows :

{% highlight python %}
levels = np.arange(np.min(DEM),np.max(DEM),25)
plt.contour(DEM, levels,linewidths=0.2,colors='k')
{% endhighlight %}


We can map the array to an image using imshow, an alternative is to use plt.contourf, to "fill in" the contours.

{% highlight python %}
plt.imshow(DEM,cmap ='RdYlGn_r',origin='lower')
plt.colorbar()
{% endhighlight %}

In this case, it is also useful to draw the location of each point. 
We first need to normalize the points to be in the range [0-1].

{% highlight python %}
xArrayNormalized=xArray/(np.max(xArray)-np.min(xArray))
xArrayNormalized-=np.min(xArrayNormalized)
yArrayNormalized=yArray/(np.max(yArray)-np.min(yArray))
yArrayNormalized-=np.min(yArrayNormalized)
plt.scatter(numIndexes*xArrayNormalized,numIndexes*yArrayNormalized,color='k',alpha=0.25)
{% endhighlight %}

Finally we can save the plot,

{% highlight python %}
plt.title('Height in meters')
plt.savefig('ContourMap.png',dpi=900)
plt.close()
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/6/ContourMap.png)

---

In the next post, I will discuss how you can create a GeoTiff, so you can overlay a plot in Google Earth.
