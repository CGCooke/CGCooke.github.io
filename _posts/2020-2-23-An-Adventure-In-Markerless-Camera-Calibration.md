# An adventure in markerless camera calibration
> It's Febrary 1972, the A300 airline is being unvailed in Toulouse, France.


It's Febrary 1972, the [A300](https://en.wikipedia.org/wiki/Airbus_A300) airliner is being unviled in Toulouse, France. Let's go on an adventure (In markerless camera calibration!).

![_config.yml]({{ site.baseurl }}/images/2020-2-23-An-Adventure-In-Markerless-Camera-Calibration_files/A300.jpg)


Let's keep things interesting, and pretend that we work for an aircraft manufacturer, Norton Aircraft, headquartered in Burbank, California. Let's say we have seen this photo published in a magazine, and we want to try and learn as much about the dimensions of Airbus's new aircraft as possible. In order to do so, we will need to mathematically reconstruct the camera used to take the photo, as well as the scene itself.

Now, In this case, we are lucky, because we notice the hexagonal pattern on the floor. In particular, we notice that it's a tessellating hexagonal pattern, which can only happen if all the hexagons have identical dimensions.

While we don't know the dimensions of the hexagon, we guess that each side is approximately 1.6m long, based on the high of the people in the photo. If we assume some point on the ground, say the center of a polygon is the point 0,0, we can work out the X & Y location of each other polygon vertex we can see. Furthermore, we could also assume that the factory floor is flat and level. Hence the Z coordinate of each point is 0.

Let's spend ±5 minutes annotating the image, using an annotation tool like label me. I've generated a file, which you can find attached here: 

![_config.yml]({{ site.baseurl }}/images/2020-2-23-An-Adventure-In-Markerless-Camera-Calibration_files/Hexagons.png)


