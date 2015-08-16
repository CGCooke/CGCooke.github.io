---
layout: post
title: Image Deconvolution
---

![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/header.png)

> An introduction to Image Deconvolution
---
Summary
===============
In this post, I have a look at image deconvolution in python.


What really is convolution in practice?
===============

In reality, convolution in images appears as some some kind of blurring. The type of blurring is described by the kernel of the convolution. When convolution is carried out in software, the kernel is typically and array. 

There are a number of different perspectives we can take, all of which are equivilant, for how convolution occours. 

1. Each pixel in the output iamge is a weighted average of a set of pixels from the input image. The pixels used are determined using the kernel.
2. The contribution of each input pixel to the output image is formed by multiplying the kernel by the input pixel, and centering it on the input pixel.
3. The output image is formed by filtering the input image with the kernel.
4. The output image is formed by pointwise multiplication of the frequency domain representation of the input image, with the frequency domain representation of the kernel.

Of these perspectives, the first or second are the most probably methods of implementation, however the most illuminating perspective is the frequency domain method. This raises the question, if we can blur an image by pointwise multiplication in the frequency domain, can we recover it by pointwise division in the frequency domain? 

---

Deconvolution
===============

The answer to the question of "Can we undo the blurring?" is a complex one. In short, the answer is "yes, with an number of astrisks". 

In the most trivial situation, There is no noise, and we know the kernel that was using during convolution, in reality there will be noise from a nubmer of different sources, and the kernal will be unknown.

---

A toy example
===============

We can generate a toy example in Python, where we know the Kernel exactly. The image I've used is from [here] (http://www.spacex.com/sites/spacex/files/styles/media_gallery_large/public/dragon_in_orbit_crs5_.jpg?itok=XVn1uhhg)


First off, lets import all the stuff we will need.

{% highlight python %}
from scipy import mgrid,exp
import numpy as np
from numpy.fft import *
from PIL import Image
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/Input.jpg)

Using PIL we can open the image and convert it to black and white (Luminance). This simplifies the processing later. 

{% highlight python %}
Input = np.asarray(Image.open('Input.jpg').convert('L'))
{% endhighlight %}

![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/Deconvolved.png)

Now the fun starts, lets create a Gaussian Kernel, which results in a [gaussian blur] (https://en.wikipedia.org/wiki/Gaussian_blur).

{% highlight python %}
def makeGaussianPSF(radius,sizeX,sizeY):
    """ Returns a normalized 2D gauss kernel array for convolutions """   
    x,y = mgrid[-sizeY/2:sizeY/2, -sizeX/2:sizeX/2]
    g = exp(-(x**2/float(radius)+y**2/float(radius)))
    return(g / g.sum())
{% endhighlight %}

We can see the point spread function (PSF) of the gaussian kernel below:

![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/GaussianPSF.png)

The next step is to convolve the image. Using the [convolution theorm](https://en.wikipedia.org/wiki/Convolution_theorem), we can perform the convolution using pointwise multiplication. To make the deconvolution easier we add a small value epislon to the frequency domain representation of the PSF. 

{% highlight python %}
def convolve(Input, psf, epsilon):
    InputFFT = fftn(Input)
    psfFFT = fftn(psf)+epsilon
    convolved = ifftn(InputFFT*psfFFT)
    convolved = np.abs(convolved)
    return(convolved)
{% endhighlight %}


The results of the convolution can be seen below : 
![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/GuassianBlur.png)


Now it's time to deconvolve the original image. By doing pointwise division in the frequency domain, we are able to undo the original convolution. It is now clear why a small value epislon was applied during convolution. Because we are dividing using the frequency domain representation of the point spread function, the result would be undefined wherever the denominator was zero. The application of epsilon prevents the eventuality. 

{% highlight python %}
def deconvolve(Input, psf, epsilon):
    InputFFT = fftn(Input)
    psfFFT = fftn(psf)+epsilon
    deconvolved = ifftn(InputFFT/psfFFT)
    deconvolved = np.abs(deconvolved)
    return(deconvolved)
{% endhighlight %}

Finally, we can see the recovered image. Obviously this is an artificially engineered situation, and in a real world situation, this simplistic approach is likely to fail, due to either noise, or impferfect knowlege of the PSF.
![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/Deconvolved.png)

Motion blur is another type of blur that is commonly experienced. The kernel of motion blur is most commonly a stright line, which we can generate as follows : 

{% highlight python %}
def makeMotionPSF(length,sizeX,sizeY):
    psf = np.zeros((sizeY,sizeX))
    psf[sizeY/2:sizeY/2+1,sizeX/2-length/2:sizeX/2+length/2] = 1
    return(psf/psf.sum())
{% endhighlight %}

The kernel : 
![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/MotionBlurPSF.png)

Applying the kernel to the original image using convolution : 

![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/MotionBlur.png)

Finally, we can again recover the initial image perfectly. 
![_config.yml]({{ site.baseurl }}/images/ShittyRedaction/Deconvolved.png)

In order to output the arrays as images, I created the following function : 
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

Hope you enjoyed!,
Cameron

---

Further reading
===============
[https://en.wikipedia.org/wiki/Point_spread_function](PSF)