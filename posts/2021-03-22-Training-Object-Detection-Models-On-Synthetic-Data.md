---
title: "Training object detection models on synthetic data"
aliases:
- /Blender/Computer Vision/PyTorch/2021/03/22/Training-Object-Detection-Models-On-Synthetic-Data
categories:
- Blender
- Computer Vision
- PyTorch
date: '2021-03-22'
description: Can we train an object detection model on synthetically generated data?
image: images/2021-03-22-Training-Object-Detection-Models-On-Synthetic-Data/header.png
layout: post
toc: true

---

# Introduction



# Training the model

> Note: To be clear, the following section is adapted directly from an example from PyTorch, which you can see [here](https://pytorch.org/tutorials/intermediate/torchvision_tutorial.html).



```python
import os
import numpy as np
import torch
import torch.utils.data
from PIL import Image
import glob
import json

import matplotlib.pyplot as plt
plt.rcParams['figure.figsize'] = [10,10]
```


```python
Image.open('Training_Data/TestImage1.png')
```

![_config.yml]({{ site.baseurl }}/images/2021-03-22-Training-Object-Detection-Models-On-Synthetic-Data/Dragons1.png)


```python
JSON = json.loads(open('Training_Data/image1.json','r').read())

for shape in JSON['shapes']:
  print(shape)
  print(shape['points'])
```

```python
class TrainingDataset(torch.utils.data.Dataset):
    def __init__(self, root, transforms=None):
        self.root = root
        self.transforms = transforms
        # load all image files, sorting them to
        # ensure that they are aligned
        self.imgs = list(sorted(glob.glob(root+'*.png')))
        self.annotations = list(sorted(glob.glob(root+'*.json')))

    def __getitem__(self, idx):
        # load images ad masks
        img_path = self.imgs[idx]
        img = Image.open(img_path).convert("RGB")
        
        # get bounding box coordinates for each mask
        boxes = [[0.0, 0.0, 512.0, 512.0]]
        labels = [0]
        
        JSON = json.loads(open(img_path[:-4]+'.json','r').read())

        num_objs = len(JSON['shapes'])
        for i in range(num_objs):
          shape = JSON['shapes'][i]
          points = shape['points']
          [[x1,y1],[x2,y2]] = points
          xmin = min([x1,x2])
          ymin = min([y1,y2])
          xmax = max([x1,x2])
          ymax = max([y1,y2])

          if (xmax-xmin)*(ymax-ymin)>0:
            boxes.append([xmin, ymin, xmax, ymax])
            labels.append(1)
        
        boxes = torch.as_tensor(boxes, dtype=torch.float32)
        # there is only one class
        labels = torch.as_tensor(labels, dtype=torch.int64)
        
        image_id = torch.tensor([idx])
        area = (boxes[:, 3] - boxes[:, 1]) * (boxes[:, 2] - boxes[:, 0])
        
        # suppose all instances are not crowd
        iscrowd = torch.zeros((len(labels),), dtype=torch.int64)

        target = {}
        target["boxes"] = boxes
        target["labels"] = labels
        target["image_id"] = image_id
        target["area"] = area
        target["iscrowd"] = iscrowd

        if self.transforms is not None:
            img, target = self.transforms(img, target)

        return img, target

    def __len__(self):
        return len(self.imgs)
```

```python
import torchvision
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor

def get_instance_object_detection_model(num_classes):
    # load an instance segmentation model pre-trained on COCO
    model = torchvision.models.detection.fasterrcnn_resnet50_fpn(pretrained = True)
    
    # get the number of input features for the classifier
    in_features = model.roi_heads.box_predictor.cls_score.in_features

    # replace the pre-trained head with a new one
    model.roi_heads.box_predictor = FastRCNNPredictor(in_features, num_classes)
    return model
```

This will make the model ready to be trained and evaluated on our custom dataset.

## Training and evaluation functions

In references/detection/, we have several helper functions to simplify training and evaluating detection models.
Here, we will use references/detection/engine.py, references/detection/utils.py and references/detection/transforms.py.

Let's copy those files (and their dependencies) here, so they are available in the notebook.


```python
%%shell

# Download TorchVision repo to use some files from
# references/detection
git clone https://github.com/pytorch/vision.git
cd vision
git checkout v0.3.0

cp references/detection/utils.py ../
cp references/detection/transforms.py ../
cp references/detection/coco_eval.py ../
cp references/detection/engine.py ../
cp references/detection/coco_utils.py ../
```


Let's write some helper functions for data augmentation/transformation, which leverages the functions in `references/detection` that we have just copied:

```python
from engine import train_one_epoch, evaluate
import utils
import transforms as T

def get_transform(train):
    transforms = []
    # converts the image, a PIL image, into a PyTorch Tensor
    transforms.append(T.ToTensor())
    if train:
        # during training, randomly flip the training images
        # and ground-truth for data augmentation
        transforms.append(T.RandomHorizontalFlip(0.5))
        
    return T.Compose(transforms)
```


### Putting everything together

We now have the dataset class, the models and the data transforms. Let's instantiate them.

```python

# use our dataset and defined transformations
dataset = TrainingDataset('Training_Data/', get_transform(train=True))
dataset_test = TrainingDataset('Training_Data/', get_transform(train=False))


# split the dataset in train and test set
torch.manual_seed(1)
indices = torch.randperm(len(dataset)).tolist()
dataset = torch.utils.data.Subset(dataset, indices[:-50])
dataset_test = torch.utils.data.Subset(dataset_test, indices[-50:])


# define training and validation data loaders
data_loader = torch.utils.data.DataLoader(
    dataset, batch_size=2, shuffle=True, num_workers=4,
    collate_fn=utils.collate_fn)

data_loader_test = torch.utils.data.DataLoader(
    dataset_test, batch_size=1, shuffle=False, num_workers=4,
    collate_fn=utils.collate_fn)
```

Now let's instantiate the model and the optimizer.

```python
device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')

# our dataset has two classes only - background and person
num_classes = 2

# get the model using our helper function
model = get_instance_object_detection_model(num_classes)

# move model to the right device
model.to(device)

# construct an optimizer
params = [p for p in model.parameters() if p.requires_grad]
optimizer = torch.optim.SGD(params, lr=0.005,
                            momentum=0.9, weight_decay=0.0005)

# and a learning rate scheduler which decreases the learning rate by
# 10x every 3 epochs
lr_scheduler = torch.optim.lr_scheduler.StepLR(optimizer,
                                               step_size=3,
                                               gamma=0.1)
```


And now, let's train the model for ten epochs, evaluating at the end of every epoch.

```python
# let's train it for 10 epochs
num_epochs = 10

for epoch in range(num_epochs):
    # train for one epoch, printing every 10 iterations
    train_one_epoch(model, optimizer, data_loader, device, epoch, print_freq=10)
    # update the learning rate
    lr_scheduler.step()
    # evaluate on the test dataset
    evaluate(model, data_loader_test, device=device)
```


Now that training has finished let's look at what it predicts in a test image.

```python
import matplotlib.pyplot as plt
plt.rcParams['figure.figsize'] = [10,10]

for i in range(0,5):
  # pick one image from the test set
  img, _ = dataset_test[i]
  # put the model in evaluation mode
  model.eval()
  with torch.no_grad():
      prediction = model([img.to(device)])
  
  for index in range(len(prediction[0]['boxes'])):

    box = prediction[0]['boxes'][index]
    score = prediction[0]['scores'][index]
    [xmin,ymin,xmax,ymax] = box.cpu().numpy()

    if score.cpu().numpy()>0.5:
      plt.plot([xmin,xmax,xmax,xmin,xmin],[ymin,ymin,ymax,ymax,ymin], color='r', linewidth=2)

  test_image = Image.fromarray(img.mul(255).permute(1, 2, 0).byte().numpy())  
  plt.imshow(test_image)
  plt.show()
```

![_config.yml]({{ site.baseurl }}/images/2021-03-22-Training-Object-Detection-Models-On-Synthetic-Data/Dragons1.png)

![_config.yml]({{ site.baseurl }}/images/2021-03-22-Training-Object-Detection-Models-On-Synthetic-Data/Dragons2.png)

![_config.yml]({{ site.baseurl }}/images/2021-03-22-Training-Object-Detection-Models-On-Synthetic-Data/Dragons3.png)

![_config.yml]({{ site.baseurl }}/images/2021-03-22-Training-Object-Detection-Models-On-Synthetic-Data/Dragons4.png)

![_config.yml]({{ site.baseurl }}/images/2021-03-22-Training-Object-Detection-Models-On-Synthetic-Data/Dragons5.png)



```python
torch.save(model.state_dict(), 'Dragon_Model.tar')
```

# Results


```python
for file_str in ['dragon1.jpeg','dragon2.jpeg','dragon3.jpeg','dragon4.jpeg','dragon5.jpeg']:
  img = Image.open(file_str)
  img = np.array(img)/255.0

  img = torch.tensor(img,dtype=torch.float).permute(2, 0, 1)

  # put the model in evaluation mode
  model.eval()
  with torch.no_grad():
      prediction = model([img.to(device)])


  for index in range(len(prediction[0]['boxes'])):
    box = prediction[0]['boxes'][index]
    score = prediction[0]['scores'][index]
    [xmin,ymin,xmax,ymax] = box.cpu().numpy()

    if score.cpu().numpy()>0.95:
      plt.plot([xmin,xmax,xmax,xmin,xmin],[ymin,ymin,ymax,ymax,ymin], color='r', linewidth=2)
    
  test_image = Image.fromarray(img.mul(255).permute(1, 2, 0).byte().numpy())

  plt.imshow(test_image)
  plt.show()
```


![_config.yml]({{ site.baseurl }}/images/2021-03-22-Training-Object-Detection-Models-On-Synthetic-Data/RealDragon1.png)

![_config.yml]({{ site.baseurl }}/images/2021-03-22-Training-Object-Detection-Models-On-Synthetic-Data/RealDragon2.png)

![_config.yml]({{ site.baseurl }}/images/2021-03-22-Training-Object-Detection-Models-On-Synthetic-Data/RealDragon3.png)

![_config.yml]({{ site.baseurl }}/images/2021-03-22-Training-Object-Detection-Models-On-Synthetic-Data/RealDragon4.png)

![_config.yml]({{ site.baseurl }}/images/2021-03-22-Training-Object-Detection-Models-On-Synthetic-Data/RealDragon5.png)




# Conclusion

