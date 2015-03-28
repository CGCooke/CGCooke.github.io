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
The answer of course is *yes*, the signals from each of the visilble satellites are mixed in together, however by assigning each satellite a unique code, this problem can be bypassed. 

![_config.yml]({{ site.baseurl }}/images/3/header.png)

---

The Data
===============


---

The Reciver
===============
At its heart, GPS signal aquisitino is a search problem. 
In the most general case, when  GPS reciever powers up, It doesn't know which satellites will be visible, what their doppler shift is, or their C/A Code phase. 

A doppler shift in the recieved frequency is induced by the relative motion of the satellite and the reciever. 
The size of the shift can be computed as follows, where v is the relative velocity between reciever and satellite, c is the speed of light. 
On thing to keep in mind is that f refers to the L1 transmission frequency 1575.42 MHz, as opposed to the IF frequency of the reciever. 

$$ \Delta f = f\frac{v}{c}$$

As a rule of thumb, the shift is 5.25 Hz per m/s of velocity between the satellite and the reciver. 

The C/A code phase is unknown because initially the GPS reciever does not know the range to each satellite. Each C/A code takes 1ms to trasmit, and is aproximately 0.001 * 3*10**8 m, or 300km long. In general, with the satellites apoximately 20,000km away, each signal takes 60-70ms to travel from the GPS satellite to the reciever.

The reciever can try to identify visible satellites by doing a brute force search, checking each satellites C/A code, for each possible doppler shift, for each possible C/A code shift. 

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

* A Software-Defined GPS and Galileo Receiver : A Single-Frequency Approach
* Kaplan Chapter 5 : Satellite Signal Acquisition, Tracking, and Data Demodulation