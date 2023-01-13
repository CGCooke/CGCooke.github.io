---
title: "Velodyne Interface Box"
aliases:
- /Blender/Blog/2023/01/12/Velodyne-Interface-Box.
categories:
- Electronics
- LiDAR
date: '2023-01-12'
description: Designing a replacement for the Velodyne Interface Box.
image: images/2023-01-12-Velodyne-Interface-Box/header.png
layout: post
toc: true

---

# Introduction

I recently purchased a discount VLP-32 LiDAR sensor off eBay.

Unfortunately, the sensor didn't come with the [Interface box](https://velodynelidar.com/wp-content/uploads/2019/08/63-9259-REV-C-MANUALINTERFACE-BOXHDL-32EVLP-16VLP-32_Web-S.pdf) required to communicate with the sensor.

I could spend another USD 200 on a new one or design one of my own.

While this was a relatively simple project, it's helpful to talk through the steps I took to go from an idea to a working solution.
The schematics and PCB layout are available [here](https://github.com/CGCooke/VLP-LiDAR-Interface-Box).

# Requirements

Starting with the [documentation]((https://velodynelidar.com/wp-content/uploads/2019/08/63-9259-REV-C-MANUALINTERFACE-BOXHDL-32EVLP-16VLP-32_Web-S.pdf)) provided by Velodyne, I identified the critical components, which I needed,  in order of priority. 

Protect the LiDAR using a fuse and a Transient Voltage Suppression (TVS) Diode.
Provide power to the LiDAR.
Connect the LiDAR to Ethernet.

Velodyne's circuit design includes a 5V voltage regulator so that a GPS receiver can easily be integrated to provide precision timing. I removed this functionality to reduce complexity and risk.

Before starting, I laid out a potential circuit with wires and plywood as a sanity check.

![]({{< var baseurl >}}/images/2023-01-12-Velodyne-Interface-Box/Wiring.png)

# Design

## Schematic 
I used the open source [KiCAD](https://www.kicad.org/) to sketch a schematic, a logical representation of how all the different components are connected.

At this stage, I used [Mouser](https://www.mouser.fr/electronic-components/) to find components that suited my needs, and then [SnapEDA](https://www.snapeda.com/) to download the symbols, footprint and 3D model of the component.
![]({{< var baseurl >}}/images/2023-01-12-Velodyne-Interface-Box/Schematic.png)

## Layout
Now that we have a completed logical circuit with components, we have to lay them out on a PCB. The PCB is the physical manifestation of our schematic, physically connecting the components. 

This is a fascinating exercise because we are simultaneously balancing many different constraints. If you want to learn more, the 
[Routing](https://en.wikipedia.org/wiki/Routing_(electronic_design_automation)) page on Wikipedia is a great place to start.

![]({{< var baseurl >}}/images/2023-01-12-Velodyne-Interface-Box/PCB.png)

Once the layout is completed, we can visualise the layout of all the different physical components. 

![]({{< var baseurl >}}/images/2023-01-12-Velodyne-Interface-Box/Rendering.png)

# Fabrication
Now that we have a design for our PCB, it's time to get it fabricated. I chose [JLCPCB](https://jlcpcb.com/). Total cost ±2 euros per PCB, shipping and taxes included. 

For components, I used [Mouser](https://www.mouser.fr/electronic-components/). The total cost for the components was approximately ±10 euros per PCB.

Finally, it's time to solder the components to the board, giving us our finished product. 

![]({{< var baseurl >}}/images/2023-01-12-Velodyne-Interface-Box/Completed.png)

# Conclusion
The PCB was functionally a success, but I want to reflect on what I got wrong:
The size of the PCB: I should have targeted a standard enclosure size.
The size of the text on the PCB. It's too small, an error I have now fixed.
Using different-sized wiring blocks.

The PCB and Components are available [here](https://github.com/CGCooke/VLP-LiDAR-Interface-Box); if you have a VLP series LiDAR, you feel very trusting, please go ahead and make your own interface circuits. 