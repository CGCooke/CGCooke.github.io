I've always found classical multiple view geometry to be magic. Starting from a position where we know very little, we use physical constraints to simultaniously infer both 3D scene geometry, as well as camera positions.



$$r = \sqrt{(x-c_x)^2 + (y-c_y)^2}$$ 
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
fs_{x} & fs_{\theta} &  o_{x}\\
0 & fs_{y} & o_{y}\\
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



Reducing the aircraft weight
===============

One of the current trends is the increasing use of composite materials in the design of aircraft. The higher the strength to weight ratio, allowing the same structural outcomes to be achieved, at a lower weight. 

From this, we can see that fuel consumption is intricately linked to both the percentage of the aircraft which can be constructed from composite materials, as well as their strength. 

One other important consideration is mission optimisation. An aircraft which is capable of long range flight needs to be engineered to structurally support the weight of the fuel required for the flight. If the aircraft operates a shorter route, then additional structure, and it's associated weight increases fuel consumption, compared to an aircraft designed for shorter routes.


![_config.yml]({{ site.baseurl }}/images/Classical-Multiple-View-Geometry/IMG.jpg)