---
title: "Robotic Blender"
aliases:
- /Blender/Computer Vision/2020/10/14/Robotic-Blender
categories:
- Computer Vision
- Blender
date: '2020-10-14'
description: Let's learn how we can create synthetic imagery for training machine
  learning models.
image: images/2020-10-14-Robotic-Blender/header.png
layout: post
toc: true

---

What is Blender?
-------------

[Blender](https://www.blender.org/) is a software application for open source 3D scene creation and rendering. 

Why would we want to automate Blender?
-------------
I have many reasons, but my real focus is on creating synthetic data to train new machine learning algorithms. I'm interested in trying to do more with less annotated data, and mixing real data with synthetic data is an up-and-coming solution. 

Using *Blender*, we can generate arbitrary amounts of synthetic data, where we can precisely control the scene. Because of this, we can create metadata simultaneously and try to generate data that better covers the available input space. 

A classic example of this is the [CLEVR](https://github.com/facebookresearch/clevr-dataset-gen) dataset, used for *Visual Reasoning*.

How can we automate Blender?
-------------
*Blender* has a [comprehensively documented](https://docs.blender.org/api/current/index.html) API. However, I love using *Blender*'s [scripting mode](https://www.youtube.com/watch?v=5e56gdHZtB0) to experiment.

In short, we can create a python script, which we can then run using *Blender*.

`blender --background --python myscript.py`

Hello World 
-------------

Let's walk through what `myscript.py` 
could look like:

```python
import os
import bpy
```

### Objects

When *Blender* loads, the default scene contains a cube, called *Cube*. 
Let's adjust its position and scale.

```python 
cube_scale = 0.5
bpy.data.objects["Cube"].scale = (cube_scale,cube_scale,cube_scale)
bpy.data.objects["Cube"].location = (0,0,cube_scale)
```

Now we can alos create a ground plane, and add that to the scene.
```python 
bpy.ops.mesh.primitive_plane_add(size=1000, enter_editmode=False, align='WORLD', location=(0, 0, 0), scale=(1, 1, 1))
```


Our next task is to create materials for the objects we have added to the scene. 

### Material

```python
def create_material(object_name,material_name, rgba):
        mat = bpy.data.materials.new(name=material_name)
        bpy.data.objects[object_name].active_material = mat
        
        mat.use_nodes = True
        nodes = mat.node_tree.nodes

        nodes["Principled BSDF"].inputs['Base Color'].default_value = rgba
        nodes["Principled BSDF"].inputs['Specular'].default_value = 1
        nodes["Principled BSDF"].inputs['Roughness'].default_value = 0.1

```

```python 
create_material("Cube","Cube_material",(3/255.0, 223/255.0, 252/255.0,1))
create_material("Plane","Plane_material",(252/255.0, 3/255.0, 235/255.0,1))
```


### Lights

```python
def configure_light():
        bpy.data.objects["Light"].data.type = 'AREA'
        bpy.data.objects["Light"].scale[0] = 10
        bpy.data.objects["Light"].scale[1] = 10

configure_light()
```

### Camera

Now let's configure the camera's position and orientation/attitude (Using quaternions).

```python
def configure_camera():
        bpy.data.objects["Camera"].location = (5, -5, 4)
        bpy.data.objects["Camera"].rotation_mode = 'QUATERNION'
        bpy.data.objects["Camera"].rotation_quaternion = (0.892399, 0.369644, 0.099046, 0.239118_

configure_camera()
```


### Action! (Renderer)

Finally, let's configure the renderer. I've chosen to use *Cycles*, a physically-based renderer/ray tracer.

```python 
def configure_render():
        bpy.context.scene.render.engine = 'CYCLES'
        bpy.context.scene.render.filepath = os.getcwd()+"/render.png"
        bpy.context.scene.render.resolution_x = 1920
        bpy.context.scene.render.resolution_y = 1080

configure_render()
```

And we can finish by rendering the image and writing it out as *render.png*.

```python 
bpy.ops.render.render(write_still=True)
```


The Results
-------------

![_config.yml]({{ site.baseurl }}/images/2020-10-14-Robotic-Blender/render.png)


