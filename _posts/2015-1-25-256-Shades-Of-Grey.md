---
layout: post
title: 256 Shades of Grey
---

![_config.yml]({{ site.baseurl }}/images/1_header.png)

>On Febuary 22, 2000, after 11 days of measurmenets, the most comprehensive map ever created of the earth's topography was complete. 

An insturment called an [Interferometric synthetic aperture radar] (http://en.wikipedia.org/wiki/Interferometric_synthetic_aperture_radar) was carried aboard the space shuttle Endeavour. The radar system consisted of a transmitter, and two recieving antennas, one of whcih was mounted on a 60 meter long antenna. By comparing the phase of the returning radar signal, a highly accurate terrain model was produced. 

The Digital Elevation Map (DEM) produced by this mission is in the public domain, and provides the measured terrain high at ~90 meter resolution. The mission mapped 99.98% of the area between 60 degrees North and 56 degrees South.  

In this post, I will examine how to process the raw DEM so that it is more intuitively interperted, through the use of *slope shading* and *hyposomatic tinting*. 
The GDAL aspects of this post came from the [Thematic mapping blog] (http://blog.thematicmapping.org/2012/06/creating-color-relief-and-slope-shading.html), and is a very informative read.

---

The full source code for this project is avalible [here](
https://github.com/CGCooke/Marinus/tree/master) on GitHub.


A number of different DEM's have been created from the data collected on the SRTM mission, in this post I will use the CGIAR [SRTM 90m Digital Elevation Database](http://www.cgiar-csi.org/data/srtm-90m-digital-elevation-database-v4-1). Data is provided in 5x5 degree tiles, with each degree of lattitude equal to aproximately 111Km. 

Our first task is to acquire a tile. Tiles can be downloaded from http://data.cgiar-csi.org/srtm/tiles/GeoTIFF/ using wget. 

{% highlight python %}
def downloadDEMFromCGIAR(lat,lon):
	''' Download a DEM from CGIAR FTP repository '''
	fileName = lonLatToFileName(lon,lat)+'.zip'
	
	''' Check to see if we have already downloaded the file '''
	if fileName not in os.listdir('.'):
		os.system('''wget --user=data_public --password='GDdci' http://data.cgiar-csi.org/srtm/tiles/GeoTIFF/'''+fileName)
	os.system('unzip '+fileName)
{% endhighlight %}


{% highlight python %}
def lonLatToFileName(lon,lat):
	''' Compute the input file name '''
	tileX = int(math.ceil((lon+180)/5.0))
	tileY = -1*int(math.ceil((lat-65)/5.0))
	inputFileName = 'srtm_'+str(tileX).zfill(2)+'_'+str(tileY).zfill(2)
	return(inputFileName)
{% endhighlight %}


The tile I have chosen to render covers Washington State and British Columbia, the topograpy 

Lets use [GDAL](http://www.gdal.org/) to extract a subsection of the tile covering Vancouver Island and the Pacific Ranges stretching from 125ºW - 122ºW & 48ºN - 50ºN can be extracted by using gdalwarp. 


{% highlight python %}
os.system('gdalwarp -q -te -125 48 -122 50 '+inputFileName+' subset.tif')
{% endhighlight %}


Our next step is to transform the subsection of the tile to a different projection. Currently the location of the points in the subsection are located on a grid 1/1200th of a degree apart. While degrees of lattitude are always ~110Km in size, resulting in ~92.5M resolution, degrees of longitude decrease in size, from ~111Km at the equator to 0Km at the poles. A deferent scale exists between the lattitude & longitude axis, as well as a longitude scale that depends on the latitude. This effect can clearly be seen in the image below, with the lines of longitude and latitude forming trapozoidal shapes. 

![_config.yml]({{ site.baseurl }}/images/1_Globe.png)


Our solution is to project that points so that there is a consistant and equal scale in the X/Y plane. One choice is to use a family of projections called [Universal Transverse Mercator](http://en.wikipedia.org/wiki/Universal_Transverse_Mercator_coordinate_system). Each UTM projection can map points from longitude & latitude to X & Y coordinates in meters. The UTM projection is useful because it locally preserves both shapes and distances, over a distances of up to several hundred kilometers.

The tradeoff is that a number of different UTM projections are required for different points on earth, 120 to be precise. 
Fortunately it is relatively trivial to work out the required projection based on the longitude and lattitude. Almost every conceivable projection has been assigned a code by the European Petroleum Survey Group (EPSG). This EPSG code can be used to quickly and unambigiously specify the projection being used, and in the case of UTM, each code starts with either 327 or 326, depending on the hemisphere of the projection. 

{% highlight python %}
utmZone = int((math.floor((lon + 180)/6) % 60) + 1)

''' Check to see if file is in northern or southern hemisphere '''
if lat<0:
	EPSGCode = 'EPSG:327'+str(utmZone)
else:
	EPSGCode = 'EPSG:326'+str(utmZone)
{% endhighlight %}


Once we have identified the correct EPSG code to use, the process of warping the subset to a new projection is relatively straightforward.
In the following system call to gdalwarp, *t_srs* denotes the target projection, and *tr* specifies the resolution in the X and Y plane. The Y resolution is negative because the in the GDAL file uses a row, column based coordinate system. In this coordinate system, the origin is in the top left hand corner of the file. The row value increases as you move down the file, like an excel spreadsheet, however the UTM Y coordinate decreases. This results in the negative sign in the resolution. The net result of this call is the production of warped.tif.

{% highlight python %}
os.system('gdalwarp -q -t_srs '+EPSGCode+' -tr 100 -100 -r cubic -srcnodata -32768  subset.tif warped.tif')
{% endhighlight %}



{% highlight python %}
os.system('gdaldem hillshade -q -az 45 -alt 45 warped.tif hillshade.tif')
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/1_hillshade.png)

{% highlight python %}
os.system('gdaldem color-relief -q warped.tif color_relief.txt color_relief.tif')
{% endhighlight %}


You can choose any colormap from [here] (http://wiki.scipy.org/Cookbook/Matplotlib/Show_colormaps?action=AttachFile&do=get&target=colormaps3.png) 
{% highlight python %}
def createColorMapLUT(minHeight,maxHeight,cmap = cm.jet,numSteps=256):
	'''
	Create a colormap for visualization
	Pro tip : tacking on _r to the end of the name of any color map reverses it,
	for example, YlGn -> YlGn_r 
	'''
	
	f =open('color_relief.txt','w')
	for i in range(0,numSteps):
		r,g,b,a= cmap(i/float(numSteps))
		height = minHeight + (maxHeight-minHeight)*(i/numSteps)
		f.write(str(height)+','+str(int(255*r))+','+str(int(255*g))+','+str(int(255*b))+'\n')
	f.write(str(-1)+','+str(int(255*r))+','+str(int(255*g))+','+str(int(255*b))+'\n')
	
	''' Set sea level to be blue '''
	f.write('-0.1,135,206,250 \n')
	f.write('0.1,135,206,250 \n')
	f.close()
{% endhighlight %}








![_config.yml]({{ site.baseurl }}/images/1_color_relief.png)

{% highlight python %}
os.system('gdaldem slope -q warped.tif slope.tif')
os.system('gdaldem color-relief -q slope.tif color_slope.txt slopeshade.tif')
{% endhighlight %}


![_config.yml]({{ site.baseurl }}/images/1_slopeshade.png)



{% highlight python %}
''' Merge components using Python Image Lib '''
slopeshade = Image.open("slopeshade.tif").convert('L')
hillshade = Image.open("hillshade.tif")
colorRelief = Image.open("color_relief.tif")

shading = ImageChops.multiply(slopeshade, hillshade).convert('RGB')
merged = ImageChops.multiply(shading,colorRelief)

''' Adjust the brightness to take into account the reduction caused by hillshading'''
enhancer = ImageEnhance.Brightness(merged)
img_enhanced = enhancer.enhance(1.4)
img_enhanced.save(outFileName)
{% endhighlight %}


![_config.yml]({{ site.baseurl }}/images/1_blended.png)


Further reading
===============
* http://en.wikipedia.org/wiki/Shuttle_Radar_Topography_Mission
* http://blog.thematicmapping.org/2012/06/creating-color-relief-and-slope-shading.html
* http://linfiniti.com/2010/12/a-workflow-for-creating-beautiful-relief-shaded-dems-using-gdal/
* http://www.geophysique.be/2014/02/25/shaded-relief-map-in-python/
