# An adventure in markerless camera calibration
> It's Febrary 1972, the A300 airline is being unvailed in Toulouse, France.


It's Febrary 1972, the [A300](https://en.wikipedia.org/wiki/Airbus_A300) airliner is being unviled in Toulouse, France. Let's go on an adventure (In markerless camera calibration!).

![_config.yml]({{ site.baseurl }}/images/2020-2-23-An-Adventure-In-Markerless-Camera-Calibration_files/A300.jpg)


Let's keep things interesting, and pretend that we work for an aircraft manufacturer, Norton Aircraft, headquartered in Burbank, California. Let's say we have seen this photo published in a magazine, and we want to try and learn as much about the dimensions of Airbus's new aircraft as possible. In order to do so, we will need to mathematically reconstruct the camera used to take the photo, as well as the scene itself.

Now, In this case, we are lucky, because we notice the hexagonal pattern on the floor. In particular, we notice that it's a tessellating hexagonal pattern, which can only happen if all the hexagons have identical dimensions.

While we don't know the dimensions of the hexagon, we guess that each side is approximately 1.6m long, based on the high of the people in the photo. If we assume some point on the ground, say the center of a polygon is the point 0,0, we can work out the X & Y location of each other polygon vertex we can see. Furthermore, we could also assume that the factory floor is flat and level. Hence the Z coordinate of each point is 0.

Let's spend ±5 minutes annotating the image, using an annotation tool like labelme.

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
