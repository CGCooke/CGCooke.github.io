---
layout: post
title: Sh***y Redaction
---

![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/header.png)

> Reaction is meant to prevent your secrets being revealed, this is what happens when it is done wrong.

---
Summary
===============

Redaction is a process of obscuring parts of a document or image, in order to obscure key contents. There are a number of ways to achieve this, blurring, pixilating and replacing a section of the image with a uniform color, usually black. In this post, I investigate the potential for security to be merely an illusion when blurring is used. 

What really is blurring?
===============

Before we continue, there are a number of terms to define:

* Input image : Input image we want to redact by blurring  
* Output image : Blurred image
* Kernel : Array that desrcibes the type of blurring that is going to occour.

The first thing we need to understand, is what does blurring really achive? There are a number of different perspectives we can take, all of which are equivilant.

1. Each pixel in the output iamge is a weighted average of a set of pixels from the input image. The pixels used are determined using the kernel.
2. The contribution of each input pixel to the output image is formed by multiplying the kernel by the input pixel, and centering it on the input pixel.
3. The output image is formed by filtering the input image with the kernel.
4. The output image is formed by pointwise multiplication of the frequency domain representation of the input image, with the frequency domain representation of the kernel.

Of these perspectives, the first or second are the most probably methods of implementation, however the most illuminating perspective is probably the frequency domain method. This raises the question, if we can blur an image by pointwise multiplication in the frequency domain, can we recover it by pointwise division in the frequency domain?

---

Deconvolution
===============

The answer to the question of "Can we undo the blurring?" is a complex one. In short, the answer is "yes, with an number of astrisks". The more information we have regarding the situation, then the more impressive the results.  

In the most trivial situation, There is no noise, and we know the kernel, in reality there will be noise from a nubmer of different sources, and the kernal will be unknown.

---

A toy example
===============

{% highlight python %}
from scipy import mgrid,exp
import numpy as np
from numpy.fft import *
from PIL import Image
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/Input.jpg)

![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/Deconvolved.png)


{% highlight python %}
def makeGaussianPSF(radius,sizeX,sizeY):
    """ Returns a normalized 2D gauss kernel array for convolutions """   
    x,y = mgrid[-sizeY/2:sizeY/2, -sizeX/2:sizeX/2]
    g = exp(-(x**2/float(radius)+y**2/float(radius)))
    return(g / g.sum())
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/GaussianPSF.png)


{% highlight python %}
def convolve(Input, psf, epsilon):
    InputFFT = fftn(Input)
    psfFFT = fftn(psf)+epsilon
    convolved = ifftn(InputFFT*psfFFT)
    convolved = np.abs(convolved)
    return(convolved)
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/GuassianBlur.png)

{% highlight python %}
def deconvolve(Input, psf, epsilon):
    InputFFT = fftn(Input)
    psfFFT = fftn(psf)+epsilon
    deconvolved = ifftn(InputFFT/psfFFT)
    deconvolved = np.abs(deconvolved)
    return(deconvolved)
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/Deconvolved.png)


{% highlight python %}
def makeMotionPSF(length,sizeX,sizeY):
    psf = np.zeros((sizeY,sizeX))
    psf[sizeY/2:sizeY/2+1,sizeX/2-length/2:sizeX/2+length/2] = 1
    return(psf/psf.sum())
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/MotionBlurPSF.png)

![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/MotionBlur.png)

![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/Deconvolved.png)

We can convert the array to a black and white image as follows : 

{% highlight python %}
def exportArrayAsImage(img,fileName):
    img = np.abs(img)
    img = np.where(img > 255, 255, img) 
    img = np.where(img < 0, 0, img) 
    img = img.astype(np.uint8)
    img = Image.fromarray(img)
    img.save(fileName)
{% endhighlight %}

All together, we have : 

{% highlight python %}
epsilon = 0.00001
r=1000
Input = np.asarray(Image.open('Input.jpg').convert('L'))
sizeY,sizeX = Input.shape
psf = makeGaussianPSF(r,sizeX,sizeY)

#Visualize the PSF
exportArrayAsImage(psf*255.0/psf.max(),'PSF.png')

#Convolve the input
InputConv = np.abs(convolve(Input, psf, epsilon))

#Deconvolve the input
InputDeconv = deconvolve(InputConv, psf, epsilon)

#Visualize the convolved and deconvolved images
exportArrayAsImage(fftshift(InputConv),'Convolved.png')
exportArrayAsImage(InputDeconv,'Deconvolved.png')
{% endhighlight %}










---

Further reading
===============