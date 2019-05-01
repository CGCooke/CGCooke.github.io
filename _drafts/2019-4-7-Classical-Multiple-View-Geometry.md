I've always found classical multiple view geometry to be magic. Starting from a position where we know very little, we can simultaniously infer both 3D scene geometry, as well as camera positions.

Like all good magic tricks, which are simple once you know what is going on, we can use linear algebra to structure what we can mesure (pixel correspondences between images) to infer the 3D structure of the scene.

However, there are limits to this magic trick, without any addional information, we can only reconstruct the scene up to scale. That is, there is still an unknown rotation and translation between what we reconstruct and reality. 


$$ p = K 

\begin{bmatrix} 
R & T
\end{bmatrix}

P
$$

$$r = \sqrt{(x-o_x)^2 + (y-o_y)^2}$$ 

$$x_{corrected} = x (1 + k_1r^2)$$

$$y_{corrected} = y (1 + k_1r^2)$$


$$
\lambda

\begin{bmatrix} 
x\\
y\\
1
\end{bmatrix}

=

\begin{bmatrix} 
fs_{x} & s &  x_o\\
0 & fs_{y} & y_o\\
0 & 0 & 1
\end{bmatrix}

\begin{bmatrix} 
r_{11} & r_{12} & r_{13} & t_{x}\\
r_{21} & r_{22} & r_{23} & t_{y}\\
r_{31} & r_{32} & r_{33} & t_{z}
\end{bmatrix}

\begin{bmatrix} 
X\\
Y\\
Z\\
1
\end{bmatrix}
$$


(Camera Models)[https://web.stanford.edu/class/cs231a/course_notes/01-camera-models.pdf]

The Intrinsic Matrix
===============

One of the current trends is the increasing use of composite materials in the design of aircraft. The higher the strength to weight ratio, allowing the same structural outcomes to be achieved, at a lower weight. 
(Intrinsic matrix)[http://ksimek.github.io/2013/08/13/intrinsic/]


The Extrinsic Matrix
===============

From this, we can see that fuel consumption is intricately linked to both the percentage of the aircraft which can be constructed from composite materials, as well as their strength. 

(Extrinisic matrix)[http://ksimek.github.io/2012/08/22/extrinsic/]


![_config.yml]({{ site.baseurl }}/images/Classical-Multiple-View-Geometry/IMG.jpg)