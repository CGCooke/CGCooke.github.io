I've always found classical multiple view geometry to be magic. Starting from a position where we know very little, we use physical constraints to simultaniously infer both 3D scene geometry, as well as camera positions.

$$
\begin{bmatrix} 
r_{11} & r_{12} & r_{13} & t_{x}\\
r_{21} & r_{22} & r_{23} & t_{y}\\
r_{31} & r_{32} & r_{33} & t_{z}\\
\end{bmatrix}
$$



$$L=W$$

$$T=D$$


From this, we can also derive:

$$\frac{L}{D} = \frac{W}{T}$$


$$T = W \frac{D}{L}$$


So, from this we can see that we can reduce the thrust required, by 

1. Reducing the aircraft weight.

2. Reducing the drag.

3. Improving the lift to drag ratio.


Lets look at each of these aspects in a little more detail,

Reducing the aircraft weight
===============

One of the current trends is the increasing use of composite materials in the design of aircraft. The higher the strength to weight ratio, allowing the same structural outcomes to be achieved, at a lower weight. 

From this, we can see that fuel consumption is intricately linked to both the percentage of the aircraft which can be constructed from composite materials, as well as their strength. 

One other important consideration is mission optimisation. An aircraft which is capable of long range flight needs to be engineered to structurally support the weight of the fuel required for the flight. If the aircraft operates a shorter route, then additional structure, and it's associated weight increases fuel consumption, compared to an aircraft designed for shorter routes.



Reducing the drag
===============
Fundamentally there are two sources of drag, *Parasitic  drag*, and *Lift induced drag*. 

Parasitic drag is a byproduct of the motion of the aircraft through the air,

Conversely, Lift induced drag is a byproduct of generating lift using the wings of the aircraft.

Together they sum to form total drag:

$$D_{Total} = D_{Parasitic } + D_{Lift Induced}$$

Minimising the Parasitic drag in turn reduces the total drag, minimising fuel burn.


Improving the lift to drag ratio.
===============
Finally, maximising the lift to drag ratio, effectively means that aircraft wing can generate the required amount of lift, while minimising drag. 

To provide a practical worked example, 

Taking the case of an A330, weighing 200,000 kg, with an  L/D ratio of approximately 18,  then:

$$D_{Lift Induced}  = \frac{2\times10^{6}  \times 9.81}{18}$$


If the L/D ratio could be doubled, then the thrust, and fuel burn required to support the weight of the aircraft would halve.


Unconstrained Optimisation: The Virgin Atlantic GlobalFlyer
===============

Optimising purely for minimum thrust, and thus fuel consumption, we end up with an aircraft with a fuselage made entirely out of composite materials, with minimal drag, and long slender wings, in order to maximise the L/D ratio. This is the design used by the Virgin Atlantic GlobalFlyer, with a L/D ratio of 37,  which holds the FAI record for longest flight by an aircraft ever at 41,466 km.


Obviously the GlobalFlyer represents optimisation towards a singular goal, without consideration for other goals, like passenger comfort, however that doesn't stop me loving it for it's pure design.


![_config.yml]({{ site.baseurl }}/images/The-Differentiable-Airliner/Virgin-globalflyer-040408-06cr.jpg)