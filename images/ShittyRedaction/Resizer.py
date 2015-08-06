import os
from PIL import Image,ImageChops,ImageEnhance


for image in os.listdir('.'):
	if '.jpg' in image:
		print(image)
		img = Image.open(image)
		img.thumbnail((720,img.size[1]*720/img.size[0]), Image.ANTIALIAS)
		img.save('3_'+image[:-4]+'.jpg')
