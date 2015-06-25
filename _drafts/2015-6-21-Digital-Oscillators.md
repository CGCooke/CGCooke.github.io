
---
layout: post
title: Digital Oscillators
---

![_config.yml]({{ site.baseurl }}/images/11/header.png)

> Computationally cheap oscillators

---
Summary
===============

Digitally Controlled Oscillators (DCO) are used in a wide range of applications. There are a number of different options for generating a Sine or Cosine wave.

* Look Up Table (LUT)
* Taylor Series
* Digital Oscillator

Look up tables store the value of the sine/cosine function for an array of different values of t. Ultimately there is a tradeoff between the amount of memory taken up by the LUT and the resolution of the table. 

Another option is to approximate the sine/cosine function using a Taylor series. While this is memory efficient, it is computationally inefficient.

Digital oscillators provide a middle path, proving to be both memory and computationally efficient. 

---

The Theory
===============

Starting with an all pole filter, with a pair of complex poles : 

$$ H(z) = \frac{z^2}{z^2  - 2 \, z \, \rho \, cos(\omega) +  \rho^2}$$

$$ \frac{Y(z)}{X(z)} = \frac{z^2}{z^2  - 2 \, z \, \rho \, cos(\omega) +  \rho^2}$$

If we set $\rho$ to 1, then both of the poles lie on the unit circle, this will result in the magnitude of the oscillation remaining constant over time. If the poles lay outside the unit circle, the filter would be unstable, while if the poles lie inside the unit circle, the oscillations would decay away over time. 

Converting from the Z domain, we find that :

$$ y[n] = x[n] + 2 \, \rho \, cos(\omega) 	\cdot y[n] -  \rho^2 \cdot y[n-1]$$

This provides the basis for the implementation.


---


The Implementation
===============

{% highlight python %}
import numpy as np
import matplotlib.pyplot as plt
import scipy.signal
import math
{% endhighlight %}

{% highlight python %}
#http://docs.scipy.org/doc/scipy-0.15.1/reference/generated/scipy.signal.lfilter.html
omega = 0.1
denominator = [1,-2*np.cos(omega),1]
x = np.zeros((100))
x[2]=1
sineOutput = scipy.signal.lfilter([1],denominator, x)
plt.plot(sineOutput,'k',label='Digital Oscillator')
plt.title('Omega = 0.1')
plt.ylabel('Amplitude')
plt.xlabel('Samples')
plt.legend()
plt.savefig('Figure1.png')
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/11/Figure1.png)

{% highlight python %}
timeBase = np.arange(0,100.0)
#Create time base for this frequency            
signal = 10*np.sin(omega*timeBase)
plt.plot(signal,'r',label='Reference')
plt.legend()
plt.savefig('Figure2.png')
plt.show()
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/11/Figure2.png)
