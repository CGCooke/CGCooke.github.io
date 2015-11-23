---
layout: post
title: Image Deconvolution
---

![_config.yml]({{ site.baseurl }}/images/KeypointExtraction/header.png)

> Keypoint extraction

---
Summary
===============

Deconvolution
===============

The answer to the question of "Can we undo the blurring?" is a complex one. In short, the answer is "yes, with an number of astrisks". 

In the most trivial situation, There is no noise, and we know the kernel that was using during convolution, in reality there will be noise from a nubmer of different sources, and the kernal will be unknown.

---

A toy example
===============

We can generate a toy example in Python, where we know the Kernel exactly. The image I've used is from [here] (http://www.spacex.com/sites/spacex/files/styles/media_gallery_large/public/dragon_in_orbit_crs5_.jpg?itok=XVn1uhhg)


First off, lets import all the stuff we will need.

{% highlight python %}
import mahotas as mh
from mahotas.features import surf
from PIL import Image,ImageDraw

def findPoints(fString):
    f = mh.imread(fString)
    f = mh.colors.rgb2grey(f)
    points = surf.surf(f,threshold=0.0001)
    return(points)

fString = 'MyImage.png'

points = findPoints(fString)
#Each point is represented as (y,x,scale,score,laplacian,angle, D_0,...,D_63) 
#where y,x,scale is the position, angle the orientation, score and laplacian 
#the score and sign of the detector; and D_i is the descriptor


img = Image.open(fString)
draw = ImageDraw.Draw(img)
for i in range(0,points.shape[0]):  
    point = points[i]
    y,x = point[0],point[1]
    draw.point((x, y),fill='red')
    
img.save('Points.png')
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/KeypointExtraction/Resized.png)
![_config.yml]({{ site.baseurl }}/images/KeypointExtraction/Points.png)


---

Further reading
===============
[https://en.wikipedia.org/wiki/Point_spread_function](PSF)