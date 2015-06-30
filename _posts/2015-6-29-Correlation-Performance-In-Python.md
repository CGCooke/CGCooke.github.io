---
layout: post
title: Correlation Performance In Python
---

![_config.yml]({{ site.baseurl }}/images/3/header.png)

> What is the fastest way to correlate two vectors in Python?

---
Introduction
===============
Correlation is a common, and often the most computationally expensive signal processing task encountered. Choosing the correct 'magic' line of code to use can have significant performance implications, today I compare the computational performance of some logical ways to perform correlation in Python.

The idea for this study came about when I noticed that a program I was writing appeared to stall while running using python 2.x, however worked fine with python 3.x. A quick investigation revealed that there was a 700x difference in the runtime between python 2.x and python 3.x. 

I decided only to compare reasonable implementations. I suspect that the *fastest* possible way to correlate two vectors in Python is to use something more exotic like [Cython](http://cython.org/) or [Anaconda](https://store.continuum.io/cshop/accelerate/), however this is not a "drop in" replacement. 

To quote Knuth, "Premature optimization is the root of all evil", so I have decided to assume nothing, and perform a quick experiment : 

---
Method
===============

I decided to compare 3 methods mentioned [here](http://stackoverflow.com/questions/12323959/fast-cross-correlation-method-in-python). Obviously performance of any given method can change with the length of the two vectors being correlated, so a number of different input lengths for each vector were evaluated. 

{% highlight python %}
import time
import numpy as np
import scipy.signal
import matplotlib.pyplot as plt

template = 2*np.random.random(10**2)-1.0

corr1List = []
corr2List = []
corr3List = []
exponentList = []

for exponent in range(20,70):
	data = 2*np.random.random(10**(exponent/10.0))-1.0
	
	startTime = time.time()
	corr1 = scipy.signal.correlate(data,template,mode='valid')
	corr1List.append(np.log10(time.time()-startTime))

	startTime = time.time()
	corr2 = scipy.signal.fftconvolve(data,template[::-1], mode='valid') 
	corr2List.append(np.log10(time.time()-startTime))
	
	startTime = time.time()
	corr3 = np.correlate(data, template, mode='valid')
	corr3List.append(np.log10(time.time()-startTime))
	
	exponentList.append(exponent/10.0)
	assert(np.allclose(corr1, corr2))
	assert(np.allclose(corr2, corr3))

plt.plot(exponentList,corr1List,label='scipy.signal.correlate')
plt.plot(exponentList,corr2List,label='scipy.signal.fftconvolve')
plt.plot(exponentList,corr3List,label='np.correlate')
plt.grid()
plt.title('Runtime : (100 sample template)')
plt.ylabel('Runtime (log10 s)')
plt.xlabel('Data length (log10 samples)')
plt.legend()
plt.savefig('plot1.png')
plt.show()
{% endhighlight %}

---
Results
===============
The results which can be seen below are quite illuminating. For context, I'm running a OSX Macbook Air, 1.3Ghz Core i5, with:

* Python version 3.3.5
* Numpy version 1.9.2
* Scipy version 0.15.1

![_config.yml]({{site.baseurl}}/images/12/plot1.png)

![_config.yml]({{site.baseurl}}/images/12/plot2.png)

![_config.yml]({{site.baseurl}}/images/12/plot3.png)

---
Conclusions
===============

From the results, the following conclusions can be reached:

* Both np.correlate and scipy.signal.fftconvolve are significantly faster than scipy.signal.correlate.
* The choice between np.correlate and scipy.signal.fftconvolve depends on the vector lengths. 
* Assume nothing, test everything. 

Interestingly, there were no significant differences in this suite of examples between Python 2.x and Python 3.x, so I am still trying to distill what exactly causes significant performance differences in my original application. 



