---
title: "A playground in Nuketown"
aliases:
- /Computer Vision/Nuketown84/2020/12/18/A-Playground-In-Nuketown
categories:
- Computer Vision
- Nuketown84
date: '2020-12-18'
description: An overview of a new family of posts.
image: images/2020-12-18-A-Playground-In-Nuketown/header.jpg
layout: post
toc: true

---

Computer vision is a powerful way to learn more about the world around us. Deep Learning is powering a renaissance in the field and unlocking powerful new capabilities in *SLAM* (Simultaneous Localisation and Mapping). I want to spend some time exploring this area, and as part of this, I want to work with a source of visually stimulating data. 

One exciting data source is video games, and I've settled on the fast, frantic, mega-franchise *Call of Duty: Black Ops Cold War*. [Nuketown84](https://callofduty.fandom.com/wiki/Nuketown_%2784) is one of the maps/levels, which presents a gritty, decaying ambience, perfect for learning more about how we can apply computer vision in practice. You can see some of the action [here](https://www.youtube.com/watch?v=dozMeWeraFk).

If our goal is to recognise where we are in the world, based on what we can see, then our starting point is having some ground truth data (where we actually are). Capturing this ground truth data is an exciting challenge, which I will slowly build up over the next few posts.

One strategy is to infer the player's position from both the mini-map and the on-screen compass. By combining different measurements over time, we should understand where the player is in the world. 



![_config.yml]({{< var baseurl >}}/images/2020-12-18-A-Playground-In-Nuketown/Nuketown-84-1.jpg)




