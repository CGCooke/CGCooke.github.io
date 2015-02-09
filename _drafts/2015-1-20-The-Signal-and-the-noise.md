---
layout: post
title: The signal and the noise
---

![_config.yml]({{ site.baseurl }}/images/3/header.png)

> What does Sputnik and your 90's cellphone have to do with how GPS works?

---
Summary
===============

How does GPS *actually* work?
Most people know that it invovles by <del>triangulation</del> trilateration, but how does it actually work in practice?

This week we go down deep into the nitty gritty, and hopefully detect a GPS satellite!

Pre-requisites: Anaconda
---

The Satellite
===============

The GPS system currently comprises of 32 satellites which orbit the earth aproximately 20,200km above ground level. 
It's a little hard to concieve of exactly how far away, but the diagram below should make things clearer.

![_config.yml]({{ site.baseurl }}/images/3/Orbit.png)

Each GPS satellite produces a very modest amount of radio power, aproximately 25 watts. 

---

The Signal
===============

Each GPS satellite simultaniously transmits a number of different signals at two frequencies.

The signal of interest to us is called "L1" and is broadcast at 1575.42 MHz.

It is important to note that signal from the satellite that we will be decoding today is made up of three components. Each component is generated at a different rate :

1. Carrier :  1575.42 MHz
2. Chipping :  1.023 MHz
3. Data : 50 Hz

---

The Carrier
===============

The carrier is essentially the part of the signal that determines how it travels. GPS signals behavin in a similar matter to other signals in the Gigahertz band, for example *WiFi*. Like *WiFi*, GPS signal can bend around obsticles and pass through non-conducting surfaces.  

![_config.yml]({{ site.baseurl }}/images/3/CarrierSinewave.png)

---

The Code
===============

All of the satellites are transmitting on the same carrier frequency, which leads to a reasonable question, Won't they all interfere?
The answer of course is *yes*, however by assigning each satellite a unique code, this problem can be bypassed. 

![_config.yml]({{ site.baseurl }}/images/3/header.png)

---

The Data
===============


---

The Reciver
===============


![_config.yml]({{ site.baseurl }}/images/3/IQ.png)

![_config.yml]({{ site.baseurl }}/images/3/IQModulated.png)

![_config.yml]({{ site.baseurl }}/images/3/Local.png)

![_config.yml]({{ site.baseurl }}/images/3/Raw.png)

![_config.yml]({{ site.baseurl }}/images/3/Local.png)





![_config.yml]({{ site.baseurl }}/images/3/DelayDopplerMap.png)

![_config.yml]({{ site.baseurl }}/images/3/DelayDopplerMapSubsection.png)

{% highlight python %}
def integrateAndDump(data,CACode,shift,frequency,reciever):
    
    time_base = np.arange(0,data.size)/reciever.ADC_sampling_frequency
    
    #Create time base for this frequency            
    I_cos = np.cos(2*math.pi*frequency*time_base)
    Q_sin = np.sin(2*math.pi*frequency*time_base)
     
    #create code for this shift
    shifted_CA  = np.roll(CACode,shift)

    modulated_Data = data*shifted_CA

    #modulate signal with local sinusoids
    I_value = modulated_Data  * I_cos
    Q_value = modulated_Data  * Q_sin
    
    #compute lock strength
    lockStrength = np.sum(I_value)**2+np.sum(Q_value)**2
    
    return(lockStrength)
{% endhighlight %}

---

Further reading
===============

A Software-Defined GPS and Galileo Receiver : A Single-Frequency Approach
Kaplan Chapter 5 : Satellite Signal Acquisition, Tracking, and Data Demodulation