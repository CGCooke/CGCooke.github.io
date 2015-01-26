---
layout: post
title: 256 Shades of Grey
---

![_config.yml]({{ site.baseurl }}/images/1_header.png)

The inspiration for this post came from [here] (http://blog.thematicmapping.org/2012/06/creating-color-relief-and-slope-shading.html), and is well worth a read.

[Interferometric synthetic aperture radar] (http://en.wikipedia.org/wiki/Interferometric_synthetic_aperture_radar)

The full source code for this project is avalible [here](
https://github.com/CGCooke/Marinus/tree/master) on GitHub.

More information about the CGIAR dataset can be found [here]
(http://www.cgiar-csi.org/data/srtm-90m-digital-elevation-database-v4-1)


{% highlight python %}
def downloadDEMFromCGIAR(lat,lon):
	''' Download a DEM from CGIAR FTP repository '''
	fileName = lonLatToFileName(lon,lat)+'.zip'
	
	''' Check to see if we have already downloaded the file '''
	if fileName not in os.listdir('.'):
		os.system('''wget --user=data_public --password='GDdci' http://data.cgiar-csi.org/srtm/tiles/GeoTIFF/'''+fileName)
	os.system('unzip '+fileName)
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



{% highlight python %}
os.system('gdaldem hillshade -q -az 45 -alt 45 -of PNG warped.tif hillshade.tif')
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/1_hillshade.png)

{% highlight python %}
os.system('gdaldem color-relief -q warped.tif color_relief.txt color_relief.tif')
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


$$ \frac{v}{c}*f $$

Further reading
===============
* http://en.wikipedia.org/wiki/Shuttle_Radar_Topography_Mission
* http://blog.thematicmapping.org/2012/06/creating-color-relief-and-slope-shading.html
* http://linfiniti.com/2010/12/a-workflow-for-creating-beautiful-relief-shaded-dems-using-gdal/
* http://www.geophysique.be/2014/02/25/shaded-relief-map-in-python/