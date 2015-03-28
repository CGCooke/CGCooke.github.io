---
layout: post
title: The Lambertian Assumption
---

![_config.yml]({{ site.baseurl }}/images/4/header.png)

> Want to get your hands on 30 meter resolution DEM's for anywhere on earth?

---
Summary
===============

This post is an extension of [256 Shades of Grey](http://cgcooke.github.io/256-Shades-Of-Grey/). 
My previous post used the CGIAR 90 meter resolution DEM as a data source, this week I show you how to get your hands on a 30 meter resolution DEM. 

---

The Data
===============

In the previous post, CGIAR the data had a resolution of 3 second of latitude. 
With the earth having a circumfrance of aproximately 40,075km, each second latitude is : $$\frac{40,075}{360  \times  60 \times  60 }  \approx 30m $$ 
In this post, we look at using a different data source which offers 1 Second/30m resolution.

To really appreciate the difference that the increased resolution makes, compare the images below:
![_config.yml]({{ site.baseurl }}/images/4/combined.png)
The scene on the left is 30m resoltution, and 90m resolution on the right.


---

Downloading data
===============

The datasource is the USGS website,
Each tile covers 1 degree of latitude, with an overlap of 1 sample at the edges. 


At little bit of fidilling is required in order to wrangle the data into a usable form:

* The data needs to be loaded as a sequence of 16 bit integers.
* The data endianess of the data is switched
* The data is reshaped to form a 2D array


{% highlight python %}
heightArray = np.fromstring(string=heightString, dtype='int16')
heightArray = heightArray.byteswap()
heightArray = heightArray.reshape(3601,3601)
{% endhighlight %}


{% highlight python %}

def downloadDEMFromUSGS(lon,lat): 
	
	if lat<0:
		latHemisphere = 'S'
	else:
		latHemisphere ='N'

	if lon<0:
		lonHemisphere = 'W'
	else:
		lonHemisphere = 'E'

	tile =latHemisphere+str(int(abs(math.floor(lat))))+lonHemisphere+str(int(abs(math.floor(lon))))
	fileName = tile+'.SRTMGL1.hgt.zip'

	''' Check to see if we have already downloaded the file '''
	if fileName not in os.listdir('.'):
		os.system('wget  http://e4ftl01.cr.usgs.gov/SRTM/SRTMGL1.003/2000.02.11/'+fileName)
	
	zipPath = tile+'.SRTMGL1.hgt.zip'
	
	zipFile = zipfile.ZipFile(zipPath, 'r') 
	zipFileName = zipFile.namelist()[0] 
	heightString = zipFile.read(zipFileName) 
	zipFile.close()
	
	heightArray = np.fromstring(string=heightString, dtype='int16').byteswap().reshape(3601,3601)
	return(heightArray) 


{% endhighlight %}


---

Converting to a GeoTIFF
===============

The next step is to convert our array into a GeoTIFF.
A GeoTIFF is in image that contains associated information about the image's projection.


{% highlight python %}

def arrayToRaster(array,fileName,xMin,yMax):
   
	# You need to get those values like you did.
    xPixels = 3601  # number of pixels in x
    yPixels = 3601  # number of pixels in y
    pixelXSize = 1.0/xPixels  # size of the pixel.        
    pixelYSize = 1.0/yPixels  # size of the pixel.        
    
    wkt_projection = '''GEOGCS["WGS 84",
    DATUM["WGS_1984",
        SPHEROID["WGS 84",6378137,298.257223563,
            AUTHORITY["EPSG","7030"]],
        AUTHORITY["EPSG","6326"]],
    PRIMEM["Greenwich",0],
    UNIT["degree",0.0174532925199433],
    AUTHORITY["EPSG","4326"]]'''

    driver = gdal.GetDriverByName('GTiff')

    dataset = driver.Create(
        fileName,
        xPixels,
        yPixels,
        1,
        gdal.GDT_Float32, )

    dataset.SetGeoTransform((
        xMin,    # 0
        pixelXSize,  # 1
        0,                      # 2
        yMax,    # 3
        0,                      # 4
        -pixelYSize))  

    dataset.SetProjection(wkt_projection)
    dataset.GetRasterBand(1).WriteArray(array)
    dataset.FlushCache()  # Write to disk.
   
{% endhighlight %}

We can check the 

---

Comparison to CGIAR data
===============

---

Further reading
===============