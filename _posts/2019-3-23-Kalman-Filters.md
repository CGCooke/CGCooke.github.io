
Kalman Filters are magic. While they take 5 minutes to explain at a basic level, you can work with them for a career and always be learning more. I think there is something philosophically satisfying about the way that they innately combine what we already believe and what we perceive in order to come to a new belief about the world.

While this sounds somewhat abstract, Kalman Filters provide a concrete mathematical formulation for fusing data from different sources, as well as physical models to provide (potentially) optimum estimates of the state of a system.

For less philosophy, and more maths, I strongly recommend stopping at this point and giving [this](https://www.bzarg.com/p/how-a-kalman-filter-works-in-pictures/) incredible post a read. Afterwards, let's talk about Kalman filters in a concrete way,  


Creating a Kalman Filter in 7 easy steps:
===============
One of the challenges with Kalman filters is that it's easy to be initially overwhelmed by the mathematical background, and loose sight of what their implementation looks like in practice. In reality, it's possible to break the implementation down into a series of discrete steps, which come together to fully describe the filter.


[FilterPy](https://filterpy.readthedocs.io/en/latest/) is a fantastic Python library for creating Kalman filters, and has an accompanying book, which takes a deep dive into the mathematical theory of Kalman filters. Lets initially discuss the general process for defining a Kalman filter, before applying it to practical application.



1. *x*, our filter state estimate, what we want to estimate.
If we want to track an object moving an a video, this could be it's pixel coordinates, as well as it's velocity in pixels per second.
[x,y,vx,vy]

x : ndarray (dim_x, 1), default = [0,0,0…0]
filter state estimate

2. *P*, the covariance matrix. Encodes how certain the filter is about it's estimates, evolves over time. In the object tracking example, how "confident" the filter is about the position of an object and it's velocity.  As the filter receives more measurements, the values in the covariance matrix are "washed out", and so there the filter tends to be insensitive to the values used.

P : ndarray (dim_x, dim_x), default eye(dim_x)

3. *Q* The process uncertinty. How large is the error associated with the system doing something unexpected between measurements? I find this the hardest to set, as it requires careful thought about the process. For example, if we are tracking the position and velocity of an object once a second, we would have more uncertitny if we were tracking the position of a fruit fly than an oil tanker. 

Q : ndarray (dim_x, dim_x), default eye(dim_x)
Process uncertainty/noise

4. *R* How uncertain each of our measurements are. This can be determined either through reading sensor datasheets or educated guesses.
R : ndarray (dim_z, dim_z), default eye(dim_x)
measurement uncertainty/noise.

5. *H* How to each measurement is related to the internal state of our system, in addition to scaling measurements. IE, If we have a GPS receiver, it tells us about our position, while an accelerometer tells us about our position.
H : ndarray (dim_z, dim_x)
measurement function

6. *F*, How the system evolves over time. IE, if we know the position and velocity of an object, then in the absence of any error or external influence we can predict it's next position from it's current position and velocity.
F : ndarray (dim_x, dim_x)
state transition matrix

7. *B* A control matrix. This matrix allows us to tell the filter about how we expect any inputs we provide the system to update the state of the system. 
B : ndarray (dim_x, dim_u), default 0
control transition matrix


At this point, I think it's worthwhile considering how all of these matrices are related to each other.
*Tim Babb* of Bzarg, has a fantastic diagram, which sets out how information flows through all of the filters mentioned above. 
![_config.yml]({{ site.baseurl }}/images/Kalman-Filters/kalflow.png)








A real world example:
===============


(Simple Online and Realtime Tracking)[https://arxiv.org/abs/1602.00763]
(Alex Bewley)[https://github.com/abewley/sort]

```python
    self.kf = KalmanFilter(dim_x=7, dim_z=4)
    self.kf.F = np.array([[1,0,0,0,1,0,0],[0,1,0,0,0,1,0],[0,0,1,0,0,0,1],[0,0,0,1,0,0,0],  [0,0,0,0,1,0,0],[0,0,0,0,0,1,0],[0,0,0,0,0,0,1]])
    self.kf.H = np.array([[1,0,0,0,0,0,0],[0,1,0,0,0,0,0],[0,0,1,0,0,0,0],[0,0,0,1,0,0,0]])

    self.kf.R[2:,2:] *= 10.
    self.kf.P[4:,4:] *= 1000. #give high uncertainty to the unobservable initial velocities
    self.kf.P *= 10.
    self.kf.Q[-1,-1] *= 0.01
    self.kf.Q[4:,4:] *= 0.01
```


Further reading
===============
Control theory is a broad an intellectually stimulating area, with broad applications.  (Brian Douglas)[https://www.youtube.com/user/ControlLectures] has an incredible YouTube channel which I strongly recommend. 


