# An adventure in markerless camera calibration
> It's Febrary 1972, the A300 airliner is being unvailed in Toulouse, France.


It's Febrary 1972, the [A300](https://en.wikipedia.org/wiki/Airbus_A300) airliner is being unviled in Toulouse, France. Let's go on an adventure (In markerless camera calibration!).

![_config.yml]({{ site.baseurl }}/images/2020-2-23-An-Adventure-In-Markerless-Camera-Calibration_files/A300.jpg)


Let's keep things interesting, and pretend that we work for an aircraft manufacturer, Norton Aircraft, headquartered in Burbank, California. Let's say we have seen this photo published in a magazine, and we want to try and learn as much about the dimensions of Airbus's new aircraft as possible. In order to do so, we will need to mathematically reconstruct the camera used to take the photo, as well as the scene itself.

Now, In this case, we are lucky, because we notice the hexagonal pattern on the floor. In particular, we notice that it's a tessellating hexagonal pattern, which can only happen if all the hexagons have identical dimensions.

While we don't know the dimensions of the hexagon, we guess that each side is approximately 1.6m long, based on the high of the people in the photo. If we assume some point on the ground, say the center of a polygon is the point 0,0, we can work out the X & Y location of each other polygon vertex we can see. Furthermore, we could also assume that the factory floor is flat and level. Hence the Z coordinate of each point is 0.

Let's spend ±5 minutes annotating the image, using an annotation tool like label me. I've generated a file, which you can find attached here: 

![_config.yml]({{ site.baseurl }}/images/2020-2-23-An-Adventure-In-Markerless-Camera-Calibration_files/Hexagons.png)



Firstly, lets load in all of the x and y points:

```python
import json
import numpy as np

JSON = json.loads(open('A300.json','r').read())
polygons = {}
for shape in JSON['shapes']:
    coords = shape['label'].split(',')
    x,y = int(coords[0]),int(coords[1])
    polygons[x,y] = shape['points']    
```

Ok, now doing some maths, and work out the locations of each vertex of our hexagons.

```python
from sklearn.neighbors import KDTree

points = []
keys = sorted(polygons.keys())

for key in keys:
    poly = polygons[key]    
    (pts_x, pts_y) = zip(*poly)
    
    pts_x = list(pts_x)
    pts_y = list(pts_y)
    
    #Magic analytic formula for working out the location of each point, based on which vertex, of which polygon it is.
    x_vertex = 0.5 * np.array([1,2,1,-1,-2,-1])
    y_vertex = 0.5 * np.array([np.sqrt(3),0,-np.sqrt(3),-np.sqrt(3),0,np.sqrt(3)])
    
    row,col = key
    x = row * 1.5 + x_vertex
    y = col * 0.5 * np.sqrt(3) + y_vertex
    
    #From before, we assume the sides of each polygon is 1.6m
    x*=1.6 #meters
    y*=1.6 #meters
    
    for idx in range(0,6):
        point = []
        i = pts_x[idx]
        j = pts_y[idx]
        X = x[idx]
        Y = y[idx]
        Z = 0.0
        points.append([i,j,X,Y,Z])
        
```

Now we are presented with a minor problem, in many cases, we have annotated the same point up to 3 times, where the vertices of the hexagons meet. So let's go and find points that are within 10 pixels, and then take their average. If we don't do this, then we effectively over-weight some points in the image, at the expense of others.

```python
points = np.asarray(points)

tree = KDTree(points[:,0:2], leaf_size=5)

merged_indicies = []
unique_points = []
for i in range(0,points.shape[0]):
    if i not in merged_indicies:
        dist, ind = tree.query(points[i,0:2].reshape(-1, 2), k=3)
        
        indicies_to_merge = []
        for j in range(0,3):
            if dist[0][j]<10:
                indicies_to_merge.append(ind[0][j]) 
                merged_indicies.append(ind[0][j])

        mean_points = np.mean(points[indicies_to_merge,:],axis=0)
        unique_points.append(mean_points)
        

unique_points = np.asarray(unique_points)
```

So, now we have a bunch of 3D points, and corresponding 2D points in the photo.

Now it's time to turn to the real magic, bundle adjustment. Basically, our task at hand, is to find a camera, which best fits the data we have measured. 

Let's talk more about cameras.
{% include important.html content='There are many correct ways to model a camera mathematically. This is one way.' %}

Mathematically, cameras are are composed of two types of parameters, *Intrinsic* and *Extrinsic*.
The *Extrinsic* parameters define the position and rotation of the camera, with respect to the origin of the points it's observing.

The *Intrinsic* parameters define the parameters of the camera itself, for example the Focal length, the location of the camera's radial center, as well as distortion induced by the lens.


The *Extrinisic* parameters are comprised of 6 degrees of freedom, given our world is 3 dimensional, and there are 3 dimensions which to rotate around. 

The *Intrinsic* parameters are more complex. There are a number of great resources, for example *Multiple View Computer Vision*, or the OpenCV documentation. However, In this case, I am assuming that the principal point, the focal length, and the radial parameters are unknown.
{% include note.html content='To be clear, I&#8217;m building on the shoulders of giants, I&#8217;ve heavily adapted this example from this incredible demo by *Nikolay Mayorov* which you can find here: https://scipy-cookbook.readthedocs.io/items/bundle_adjustment.html' %}

Firstly, let's go and import a bunch of stuff we will need later
