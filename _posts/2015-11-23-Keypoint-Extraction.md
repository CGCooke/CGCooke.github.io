---
layout: post
title: Keypoint Extraction
---

![_config.yml]({{ site.baseurl }}/images/KeypointExtraction/header.png)

---

Keypoint extraction
===============
Some of the more interesting applications of image processing rely in being able to identify the same point or object in different images. The challenges to being able to achieve this include changes in scale, rotation, lighting and noise. Fortunately a class of algorithms have been developed which can extract "keypoints" or "descriptors" from images. These keypoint extraction algorithms detect corners in the image. From an intuitive point of view, a corner is where two sharp edges meet. each "corner" in the image generates a vector, and by comparing vectors using some similarity metric, for example Euclidean distance, it is possible to work out how similar two points are. If two points in different images have very similar vectors, it is possible to assume that they may represent the same point.

While there are a whole family of keypoint extraction algorithms, of which the most famous is arguable [SIFT](https://en.wikipedia.org/wiki/Scale-invariant_feature_transform) (Scale Invariant Feature Transform). However, SURF, which is included in the [Mahotas](http://mahotas.readthedocs.org/en/latest/) image processing library is an efficient substitute.  


In the example below, we can extract the keypoints from a stunning painting by [Frederic Edwin Church](https://en.wikipedia.org/wiki/Frederic_Edwin_Church). 

![_config.yml]({{ site.baseurl }}/images/KeypointExtraction/Resized.png)

---

A quick example
===============

Using Mahotas:

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

![_config.yml]({{ site.baseurl }}/images/KeypointExtraction/Points.png)


---

Further reading
===============
[Feature detection](https://en.wikipedia.org/wiki/Feature_detection_(computer_vision))