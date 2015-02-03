---
layout: post
title: The Big Picture
---

![_config.yml]({{ site.baseurl }}/images/2_header.png)

>[Matplotlib] (http://matplotlib.org/) is an incredible libuary for visualizing data using python. While they have comprehnsive documentation, 90% of the plots I do fall into one of a few cases. This week I step through some common visualizations tasks using Matplotlib. 

---
Summary
===============

The full source code for this project is available [here](
https://github.com/CGCooke/Marinus/blob/master/Cartographer.py) on GitHub.

Pre-requisites: Anaconda
---

Line Chart
===============

Matplotlib includes a number of modules. I need to use the pyplot module, so I'm importing it, and renaming it 'plt'.
{% highlight python %}
import matplotlib.pyplot as plt
import numpy as np
{% endhighlight %}

Lets start off by creating some dummy data that we can visualize. 
The data is a sine wave & some noise, sampled at 100Hz.
{% highlight python %}
'''Create a timebase'''
t = np.arange(0,1,0.01)
''' Create sine wave '''
data = np.sin(2*np.pi*t)
''' Add some random noise '''
data += 0.25*(np.random.random(100)-0.5)
{% endhighlight %}

Plotting and displaying the data can be carried out in just two lines. When only one list or array of values is passed to plot, it assumes the values represent the y coordinates. The x coordinate of each point is equal to its index in the list/array.

{% highlight python %}
plt.plot(data)
plt.show()
{% endhighlight %}

{% highlight python %}
plt.plot(t,data)
plt.savefig('plot1.png')
{% endhighlight %}


![_config.yml]({{ site.baseurl }}/images/2_plot1.png)


This plot has several deficiencies, notably lacking a title, labels and a legend. 
First, we need to close our old plot, so that we can start a new one.
{% highlight python %}
plt.close()
{% endhighlight %}

Our first task is to plot the actual data. A key change is that we provided a list of x coordinates, as well as a list of y coordinates. Hence the plot has a proper time base. We can also change the color and the opacity (alpha) of the plotted line. A list of all of the possible color names can be found [here] (http://matplotlib.org/examples/color/named_colors.html).

{% highlight python %}
plt.plot(t,data,color='k',alpha=0.7,label='Sine Wave')
{% endhighlight %}



We can then label the axis and add in a title and legend.

{% highlight python %}
plt.xlabel('Time (S)')
plt.ylabel('Voltage (V)')
plt.title('Voltage vs Time')
plt.legend()
plt.savefig('plot2.png')
{% endhighlight %}


![_config.yml]({{ site.baseurl }}/images/2_plot2.png)


Something that is implicit, is that the plot function can be used to draw arbitary shapes.  The shapes we can draw range from the simple: 

{% highlight python %}
t = np.linspace(0,1,100)
X = np.cos(2*np.pi*t)
Y = np.sin(2*np.pi*t)

plt.plot(X,Y,color='k')
plt.axis('equal')
plt.savefig('plot3.png')
plt.close()
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/2_plot3.png)

To the complex, in this case an array of latitude values and longitude values representing the flightpath of an aircraft can be plotted.

{% highlight python %}
plt.plot(lon,lat,color='k')
plt.xlabel('Longitude')
plt.ylabel('Latitude')
plt.title('Flightpath')
plt.grid()
plt.savefig('Flightpath.png')
{% endhighlight %}


![_config.yml]({{ site.baseurl }}/images/2_Flightpath.png)



---

Image Plots
===============




---

Colormaps 
===============

A list of all of the possible maptlotlib colormaps can be found [here](http://matplotlib.org/examples/color/colormaps_reference.html). Any colormap can be reversed by appending "_r" to the colorname. For example "RdYlGn" 
Careful consideration should be made in choice of colorscheme. Issues to consider include if the plot is displaying sequential, divirging or catagorical data. 

Another issue to consider: In general, humans are more sensitive to changes in lightness than hue. Hence good colormaps should have linearly and monotonically changing lightness. Consideration should be given to how the colormap will be interpreted by those suffering from color-blindness. [This](http://matplotlib.org/users/colormaps.html) excellent article outlines the issues mentioned in more detail.



{% highlight python %}
cmap = cm.jet,numSteps=256)


f =open('color_relief.txt','w')
for i in range(0,numSteps):
	r,g,b,a= cmap(i/float(numSteps))
{% endhighlight %}
---

Other
===============

A number of other useful modules exist in matplotilb.

Bizarely, there is a fantastic libuary for acquiring stockprice data included in matplotlib. 
The chart at the head of this article is actually the stockprice of Westpac Banking Corporation over the 2014 calandar year.

{% highlight python %}
from matplotlib import finance
import datetime

d1 = datetime.datetime(2014, 1, 1)
d2 = datetime.datetime(2015, 1, 1)
WBC = finance.quotes_historical_yahoo('WBC.AX', d1, d2,asobject=True, adjusted=True)
plt.plot(WBC.open,color='k',alpha=0.7)
plt.ylim(0.5,2)
plt.show()
{% endhighlight %}


Another useful module is Basemap.
The chart of the globe centered Vancouver in the previous post was created using the folowing code:

{% highlight python %}
from mpl_toolkits.basemap import Basemap
import matplotlib.pyplot as plt

Map= Basemap(projection='ortho',lat_0=49,lon_0=-123,resolution='l')
# draw coastlines, country boundaries, fill continents.
Map.drawcoastlines(linewidth=0.25)
Map.drawcountries(linewidth=0.25)
Map.fillcontinents()
# draw the edge of the map projection region (the projection limb)
Map.drawmapboundary()
# draw lat/lon grid lines every 30 degrees.
Map.drawmeridians(np.arange(0,360,30))
Map.drawparallels(np.arange(-90,90,30))
plt.show()
{% endhighlight %}


Finally, a disturbing amount of time and effort appears to have been expended to create the option to "XKCDfy" plots.
To enable the efect, simply place the following line before any other calls to pyplot.
{% highlight python %}
plt.xkcd()
{% endhighlight %}

Applying this to our plot from before, we get the following:

![_config.yml]({{ site.baseurl }}/images/2_plot4.png)





Further reading
===============