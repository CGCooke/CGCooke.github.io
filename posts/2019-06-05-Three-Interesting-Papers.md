---
title: "Three Interesting papers"
aliases:
- /Computer Vision/Deep Learning/2019/06/05/Three-Interesting-Papers
categories:
- Deep Learning
- Computer Vision
date: '2019-06-05'
description: Three Interesting Papers
image: images/2019-06-05-Three-Interesting-Papers/header.jpg
layout: post
toc: true

---

Over the past couple of months, three inspiring papers have come out, and I want to take the opportunity to share them with you.

The papers, in no particular order, are [MixMatch](https://arxiv.org/abs/1905.02249), [Selfie](https://arxiv.org/abs/1906.02940) and [Unsupervised Data Augmentation](https://arxiv.org/abs/1904.12848), however, let's first discuss why they are exciting.

In my daily work, I'm faced with an avalanche of data. Raw data may be cheap, but labelled data is precious, often relying on expensive experiments or busy experts. Even then, when labelled data is available, there is an insatiable demand to do more with it.

Semi-supervised learning allows us to leverage the raw, unlabelled data to improve our models, reducing the barriers to building a model and democratising AI.

I'm not going to discuss how the papers are implemented in detail, but I will say that the papers are very promising. They will be rapidly implemented and adapted as a standard part of deep learning workflows.   

In a sentence, *MixMatch* uses [MixUp](https://arxiv.org/abs/1710.09412) and label sharpening (A fancy way of saying "Artificially boosting your model's confidence") to propagate labels effectively. My first impression was, "I can't believe that works, " but then I saw that it decreases error rates 4x when training with small samples on *CIFAR-10*.

Conversely, *Selfie*  is inspired by the pre-training method in [BERT](https://arxiv.org/abs/1810.04805) and extends it to CNN's. At a high level, the pre-training task is analogous to removing pieces from a jigsaw puzzle and asking, "what piece should go in each hole?". Given the power of transfer learning, this is hugely exciting for many problems where the data you want to train on is very different to what is found in *ImageNet*. 

Finally, *Unsupervised* *Data* *Augmentation* (*UDA*) prosecutes the thesis that "better data augmentation can lead to significantly better semi-supervised learning". As with *Selfie* and *MixMatch*, You can apply the techniques used in this paper to image data.

Deep learning is built on a history of rapidly evolving best practices, including *Xavier initialisation*, Data Augmentation, *One Cycle Policy* and *MixUp*. I hope that adoptions of that *MixMatch*, *Selfie* and *UDA* will soon join this grab bag of best practices. 