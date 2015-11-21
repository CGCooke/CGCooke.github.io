---
layout: post
title: A Matter of Perspective
---

![_config.yml]({{ site.baseurl }}/images/AMatterOfPerspective/header.png)

>  How far we can see is only limited by the horizon, which raises the question, how do we see further?

---

The Horizon
===============

The distance to the horizon is a simple matter of geometry, the straight line distance to the horizon (d) is a function of your height above the horizon (h), and the radius of the earth (R), which is ~6,371Km. 

$$ d = \sqrt{h \times (2\times R + h)}$$

This results in a distance along the surface of the earth (s) of : 

$$ s =  R \times tan^{-1} \frac{d}{R}$$

[Thanks Wiki](https://en.wikipedia.org/wiki/Horizon#Geometrical_model)


---

Limitations
===============

The horizon ultimately limits what we can see, and while this sounds rather metaphysical, it has practical real world consequences. Radar is typically limited to line of sight, with some notable [exceptions](https://en.wikipedia.org/wiki/Jindalee_Operational_Radar_Network). This results in what is called a [Radar Horizon](https://en.wikipedia.org/wiki/Radar_horizon).  Ships, aircraft and missiles below the horizon are essentially invisible to the radar. 

One of my projects has been the construction of an ADS-B receiver, using a Airspy SDR.  Through the use of a high gain antenna and a low noise amplifier, it has become apparent that the ultimate limit to detection range of aircraft is the horizon, approximately 225 nautical miles for an aircraft at 45,000 feet. One solution for removing this fundamental limitation, is to dramatically increase the height of the receiver.

---

The Solution
===============

By going to space, it is possible to go arbitrarily high. If you go high enough, then an entire hemisphere of the planet will be visible, with a distance of 20,000km from horizon to horizon. 


![_config.yml]({{ site.baseurl }}/images/AMatterOfPerspective/ViewFromOrbit.png)


From a more practical perspective, a satellite with an orbital height of 400km, or roughly the same orbital height as the ISS will be able to see any point on the earths surface within 2,200Km. From the following figure, we can observe that a single satellite can instantaneously observe either continental Europe, the US or Australia. While this may seem prohibitively expensive proposal, [Aireon](http://aireon.com/) is currently in the process of developing receivers that will fly aboard the next generation of Iridium satellites. 

![_config.yml]({{ site.baseurl }}/images/AMatterOfPerspective/Footprints.png)



---

Further reading
===============
[Obligatory XKCD what if?](https://what-if.xkcd.com/42/)
