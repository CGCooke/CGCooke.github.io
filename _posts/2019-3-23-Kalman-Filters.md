
Kalman Filters are magic. While they take 5 minutes to explain at a basic level, you can work with them for a career and always be learning more. I think there is something philosophically satisfying about the way that they innately combine what we already believe and what we perceive in order to come to a new belief about the world.

While this sounds somewhat abstract, Kalman Filters provide a concrete mathematical formulation for fusing data from different sources, as well as physical models to provide (potentially) optimum estimates of the state of a system.

I'm far from an authority on vanilla Kalman filters, let alone more exotic variants like Extended Kalman Filters (EKF's) or Unscented Kalman Filters (UKF's). However I've learned enough to enthusiastically apply them whenever I have the chance. 

For less philosophy, and more maths, I strongly recommend giving [this](https://www.bzarg.com/p/how-a-kalman-filter-works-in-pictures/) post a read.

However, in the meantime, let's talk about Kalman filters in a concrete way, 


A concrete example:
===============

[FilterPy](https://filterpy.readthedocs.io/en/latest/) is a fantastic Python library for creating Kalman filters, and has an accompanying book, which takes a deep dive into the mathematical theory of Kalman filters. 

One of the challenges with Kalman filters is that it's easy to be initially overwhelmed by the mathematical background, and loose sight of what their implementation looks like in practice.


1. 
x : ndarray (dim_x, 1), default = [0,0,0…0]
filter state estimate

2.
P : ndarray (dim_x, dim_x), default eye(dim_x)
covariance matrix

3.
Q : ndarray (dim_x, dim_x), default eye(dim_x)
Process uncertainty/noise

4.
R : ndarray (dim_z, dim_z), default eye(dim_x)
measurement uncertainty/noise

5.
H : ndarray (dim_z, dim_x)
measurement function

6.
F : ndarray (dim_x, dim_x)
state transition matrix

7.
B : ndarray (dim_x, dim_u), default 0
control transition matrix




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


![_config.yml]({{ site.baseurl }}/images/256_Shades_of_Grey/blended.png)


(Brian Douglas)[https://www.youtube.com/user/ControlLectures] 