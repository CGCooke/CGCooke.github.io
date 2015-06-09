---
layout: post
title: A field trip to YSSY
---

![_config.yml]({{ site.baseurl }}/images/10/header.jpg)

> Today I do what all normal people do when they go to the airport: bring a laptop, some antennas and a Software Defined Radio.

---
Summary
===============

I'm looking to acquire a number of signals, in particular, some AM [Airband](http://en.wikipedia.org/wiki/Airband) signals, as well as some 
[ADS-B](http://en.wikipedia.org/wiki/Automatic_dependent_surveillance_%E2%80%93_broadcast) signals. While I already have some ADS-B data from planes flying past my house, I'm interested in what happens when you have a situation with high dynamics range, ie, When you are receiving a signal from a plane 50m away, and simultaneously another signal from a plane 50km away. I'm also interested in frame collision, which occurs when the messages from two planes overlap, and the fastest way to ensure this happens, is to go to the highest concentration of aircraft. 

---

Getting some data
===============

![_config.yml]({{ site.baseurl }}/images/10/Laptop.png)



My first task is to get some data, I'm using airspy_rx, the Airspy command-line tool to grab data using the default sampling rate (10M samples per second, per I and Q channel).
If "I and Q" sounds a bit mysterious, a good place to start is [here](https://www.youtube.com/watch?v=h_7d-m1ehoY). First of all, lets grab 10 seconds worth of data, centred on 120.5Mhz.

{% highlight python %}
import os
import numpy as np
import matplotlib.pyplot as plt

samplingFrequency=1*10**7 #Hz
numSamples = 10*10*10**6 #Samples
targetFreq = 120.5 #Mhz

os.system('airspy_rx -r temp.bin -f '+str(targetFreq-2.5)+'  -n '+str(numSamples))
{% endhighlight %}

---

Loading the data
===============
The Airspy outputs signed 16 bits I and Q samples by default, and we can easily load this data, and split it into a stream of I and Q samples. I think the Airspy takes a small amount of time to stabilise, so I've made a habit of throwing away the first 1000 samples. 

{% highlight python %}
f = open("120_5.bin", "r")
a = np.fromfile(f, dtype=np.int16)

#Split the stream into I and Q
I = a[0::2] 
Q = a[1::2]

#Remove the first 1000 samples
I = I[1000:]
Q = Q[1000:]
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/10/LiftOff2.png)

---

Creating a waterfall display
===============

After you have acquired some data, the next task is to see if anything is there. Typically, you use a SDR in conjunction with some visualisation software like GQRX, SDR# or Baudline. This software uses the Discrete Time Fourier Transform in order to visualise the spectrum of the signal. By breaking the signal up into blocks, and taking the DTFT of each block, and then recombining the spectrums we can visualise the signal over time. This type of visualisation is called a "Waterfall display".

{% highlight python %}
#Create a waterfall display
windowSize = 4096
numWindows = int(I.size/windowSize)
waterfallDisplay = np.zeros((numWindows,(windowSize/2)))
for i in range(0,numWindows):
	IWindowed =I[i*windowSize:(i+1)*windowSize]
	QWindowed =Q[i*windowSize:(i+1)*windowSize]
	spectrum = abs(np.fft.fft(IWindowed+1j*QWindowed))
	waterfallDisplay[i,:] = spectrum[0:windowSize/2]
{% endhighlight %}


The final step is to visualise the waterfall display using imshow.

{% highlight python %}
#Visualize the waterfall display
plt.imshow(waterfallDisplay,aspect='auto',extent=[centerFreq-2.5,centerFreq+2.5,10,0],cmap='Blues_r')
plt.title('Waterfall Display')
plt.xlabel('Frequency (Mhz)')
plt.ylabel('Time (S)')
plt.grid()
plt.show()
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/10/Waterfall.png)

We can see 4 different signals in the waterfall display. The strongest signal at 120Mhz is actually an artefact, produced by the internal 20Mhz clock used by the receiver. From [here](http://www.radioreference.com/apps/db/?aid=1117) we can find that 
the signal with a frequency of 121.7 Mhz is 'Sydney Ground - East of Rwy 16R/34L', and uses AM modulation. The next task, for another day is to hear what the tower has to say. 
![_config.yml]({{ site.baseurl }}/images/10/Tower.png)


