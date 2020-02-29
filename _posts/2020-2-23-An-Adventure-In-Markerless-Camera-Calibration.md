# Title
> summary


```python
from __future__ import print_function
```

```python
import time
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from scipy.optimize import least_squares
from scipy.sparse import lil_matrix
from scipy.spatial.transform import Rotation as Rot

%matplotlib inline

plt.rcParams["figure.figsize"] = (20,20)
```

```python
camera_params = np.zeros(12)
#camera_matrix
#T
camera_params[3] = 0
camera_params[4] = 0
camera_params[5] = 5

#f,k1,k2,c_x,c_y
camera_params[6] = 1000
camera_params[7] = 0
camera_params[8] = 0
camera_params[9] = 0

camera_params[10] = 2251/2.0
camera_params[11] = 1508/2.0


df = pd.read_csv('COORDS_A300.CSV', sep=',')

points_2d = df.values[:,0:2]
points_3d = df.values[:,2:5]


#Flip up down
points_2d[:,1] = 2251 - points_2d[:,1]

#Set origin to be middle of the image.
plt.scatter(points_2d[:,0],points_2d[:,1])
plt.xlim(0,2251)
plt.xlim(0,1508)
plt.show()


X_mean = points_3d[:,0].mean()
Y_mean = points_3d[:,1].mean()

points_3d[:,0] -= X_mean
points_3d[:,1] -= Y_mean

```


![png](/images/A300_files/output_2_0.png)


```python
n_cameras = camera_params.shape[0]
n_points = points_3d.shape[0]

n = 10 * n_cameras
m = 2 * points_2d.shape[0]

print("n_cameras: {}".format(n_cameras))
print("n_points: {}".format(n_points))
print("Total number of parameters: {}".format(n))
print("Total number of residuals: {}".format(m))

```

    n_cameras: 12
    n_points: 60
    Total number of parameters: 120
    Total number of residuals: 120


```python
def project(points, camera_params):
    """Convert 3-D points to 2-D by projecting onto images."""
    #Rotation
    R = Rot.from_rotvec(camera_params[:3]).as_matrix()
    
    #Translation 
    T = camera_params[3:6].reshape(3,1)
    
    #Composing RT Matrix
    RT = np.hstack([R,T])
    
    #Make points Homogeneous
    points = np.hstack([points,np.ones((points.shape[0],1))])
    
    #Perform projective transform
    #(n,k), (k,m) -> (n,m)
    points_proj = np.matmul(points,RT.T)
    
    #perspective divide 
    points_proj = points_proj[:, :2] / points_proj[:, 2, np.newaxis]
    
    f  = camera_params[6]
    k1 = camera_params[7]
    k2 = camera_params[8]
    k3 = camera_params[9]
    
    c_x = camera_params[10]
    c_y = camera_params[11]
    
    #Radial distortion
    r_squared = np.sum(points_proj**2, axis=1)
    r = 1 + k1 * r_squared + k2 * r_squared**2 + k3 * r_squared**3
    
    points_proj *= r[:, np.newaxis]
    
    points_proj = np.hstack([points_proj, np.ones((points_proj.shape[0],1))])
    
    K = np.asarray([[f, 0, c_x],
                    [0, f, c_y],
                    [0, 0,   1.0]])
    
    points_proj = np.dot(points_proj,K.T)
    points_proj = points_proj[:,:2]
    
    return(points_proj)
```

```python
def fun(camera_params, points_2d, points_3d):
    #Compute residuals.
    points_proj = project(points_3d, camera_params)
    return(points_proj - points_2d).ravel()
```

```python
x0 = camera_params.ravel()
res = least_squares(fun, x0,  verbose=1, x_scale='jac', ftol=1e-4, method='lm',loss='linear',
                    args=(points_2d, points_3d))
```

    `ftol` termination condition is satisfied.
    Function evaluations 362, initial cost 3.3946e+07, final cost 1.2265e+02, first-order optimality 1.08e+02.


```python

params_per_camera = 9
x = res.x
R_Rodrigues = x[0:3]
T = x[3:6]
intrinsic = x[6:params_per_camera]

print(intrinsic)
r = Rot.from_rotvec(R_Rodrigues)
R_matrix = r.as_matrix()


C = -np.dot(np.linalg.inv(R_matrix),T)

print('centroid of camera in world coordinates')
print(C[0]+X_mean,C[1]+Y_mean,C[2])

print('quatonians')
print(r.as_quat())

print(res.cost/points_2d.shape[0])

```

    [1.69657784e+03 2.23353222e-03 7.34040220e-02]
    centroid of camera in world coordinates
    -8.978834938543706 -15.150961972229053 -6.072551195042725
    quatonians
    [ 0.37018863 -0.1863872   0.37792249  0.82788573]
    2.0441718675933784


```python
plt.plot(res.fun)
plt.show()

plt.hist(res.fun)
plt.show()

```


![png](/images/A300_files/output_8_0.png)



![png](/images/A300_files/output_8_1.png)


```python
points_2d_proj = project(points_3d, res.x)

img = plt.imread('A300.jpg')        
plt.imshow(img)
plt.scatter(points_2d[:,0],points_2d[:,1],label='Actual')
plt.scatter(points_2d_proj[:,0],points_2d[:,1],label='Optimised')
plt.savefig('A300_points.png',dpi = 900)           

```


![png](/images/A300_files/output_9_0.png)


```python
img = plt.imread('A300.jpg')        
plt.imshow(img)

def plot_verticies(row,col):
    x_vertex = 0.5 * np.array([1,2,1,-1,-2,-1,1])
    y_vertex = 0.5 * np.array([np.sqrt(3),0,-np.sqrt(3),-np.sqrt(3),0,np.sqrt(3),np.sqrt(3)])

    x = row * 1.5 + x_vertex
    y = col * 0.5 * np.sqrt(3) + y_vertex

    x*=1.67
    y*=1.67

    points_3d = np.vstack([x,y,np.zeros(7)]).T
    
    points_3d[:,0] -= X_mean
    points_3d[:,1] -= Y_mean
    
    points_2d_proj = project(points_3d, res.x)
    
    
    points_2d_proj[:,1] = 2251 - points_2d_proj[:,1]
    
    
    return(points_2d_proj)
        


for row in range(0,10,2):
    for col in range(0,10,2):
        points_2d_proj = plot_verticies(row,col)
        plt.plot(points_2d_proj[:,0],points_2d_proj[:,1],color='B',alpha=0.25)
        plt.text(np.mean(points_2d_proj[:,0]), np.mean(points_2d_proj[:,1]), str(row)+','+str(col), horizontalalignment='center',verticalalignment='center')
        

for row in range(1,11,2):
    for col in range(1,11,2):
        points_2d_proj = plot_verticies(row,col)
        plt.plot(points_2d_proj[:,0],points_2d_proj[:,1],color='R',alpha=0.25)
        plt.text(np.mean(points_2d_proj[:,0]), np.mean(points_2d_proj[:,1]), str(row)+','+str(col), horizontalalignment='center',verticalalignment='center')


plt.savefig('A300.png',dpi = 900,bbox_inches='tight')           

```

    /Users/cooke_c/.local/lib/python3.7/site-packages/ipykernel_launcher.py:43: MatplotlibDeprecationWarning: Support for uppercase single-letter colors is deprecated since Matplotlib 3.1 and will be removed in 3.3; please use lowercase instead.



![png](/images/A300_files/output_10_1.png)

