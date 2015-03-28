---
layout: post
title: The Big Picture II
---

![_config.yml]({{ site.baseurl }}/images/6/header.png)

>The post is a follow on from my previous post. Because I'm often working with Geospatial data, I make much use of Matplotlib's two dimensional visualization capabilities. In this post, I look at the methods I use to communicate my message. 

---
Summary
===============

Scattered geophysical m


---

The Data
===============

https://www.dropbox.com/s/inw6rr9bflkkgfi/coordinates.csv?dl=0


{% highlight python %}
import numpy as np
from matplotlib.mlab import griddata
import matplotlib.pyplot as plt
import gdal
import osr
from pyproj import Proj
from PIL import Image
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

{% highlight python %}
fig = plt.figure()
fig.set_size_inches(10, 10)
ax = plt.Axes(fig, [0., 0., 1., 1.])
ax.set_axis_off()
fig.add_axes(ax)
{% endhighlight %}

{% highlight python %}
plt.contour(DEM, levels,linewidths=0.2,colors='k')
plt.imshow(DEM,cmap ='RdYlGn_r',origin='lower')
plt.scatter(numIndexes*xArrayNormalized,numIndexes*yArrayNormalized,color='k',alpha=0.25)
plt.savefig('ContourMapTight.png',dpi=900)
plt.close()
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/6/ContourMapTight.png)

---

GeoTIFFs
===============


{% highlight python %}
img  = np.asarray(Image.open('ContourMapTight.png'))
EPSGCode = 4326
numBands = 3
arrayToRaster(img,'OUT.TIF',EPSGCode,np.min(xArray),np.max(xArray),np.min(yArray),np.max(yArray),numBands)
{% endhighlight %}


{% highlight python %}
def arrayToRaster(array,fileName,EPSGCode,xMin,xMax,yMin,yMax,numBands):
    xPixels = array.shape[1]  # number of pixels in x
    yPixels = array.shape[0]  # number of pixels in y
    pixelXSize =(xMax-xMin)/xPixels # size of the pixel in X direction     
    pixelYSize = -(yMax-yMin)/yPixels # size of the pixel in Y direction

    driver = gdal.GetDriverByName('GTiff')
    dataset = driver.Create(fileName,xPixels,yPixels,numBands,gdal.GDT_Byte, options = [ 'PHOTOMETRIC=RGB' ])
    dataset.SetGeoTransform((xMin,pixelXSize,0,yMax,0,pixelYSize))  

    datasetSRS = osr.SpatialReference()
    datasetSRS.ImportFromEPSG(EPSGCode)
    dataset.SetProjection(datasetSRS.ExportToWkt())
    
    for i in range(0,numBands):
        dataset.GetRasterBand(i+1).WriteArray(array[:,:,i])

    dataset.FlushCache()  # Write to disk.
{% endhighlight %}


![_config.yml]({{ site.baseurl }}/images/6/GoogleEarth.png)

Further reading
===============