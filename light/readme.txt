Overview:
1.Camera:
	Camera is controlled by the html button. 
	a. Position Changing:
		The position is changed by changing the value of U(position vector). The position coordinator is changed according to the world coordinator instead of depending on the center of view or lookUp vector. Thus, sometimes when move up position of camera is pressed, the camera went down since the camera is rotated 180 degrees. Meanwhile, changing points of interest could also make some difference. For example, when the move right of center has been pressed and the move left button is pressed, the camera gose backwards since the camera look to the right and the left of world is back to where the camera is looking at.

	b. Center of Interest changing:
		The center of interest is changed by modification of V(center of interest). The center coordiante is changed according to the world coordinate, which is same as the position changing. The maximum of camera rotating left/right, up/down is 180 degree so that the center of interest could keep moving in one direction. Rotating camera could change the center of interest moving. For example, when the camera is rolling 180 degree and move up center of interest is pressed, the camera may look down but the center of interest is acutally moving up.

	c. Rolling
		Rolling is controlled by rotating lookup vector.

2. Object
	The object contains cannon, ammo and a big crete. The ammo is made by sphere. The cretes is made by cube. The cannon is made by cube(between the wheels and in the wheels), cylinder(wheels and the body of the cannon) and the sphere(the bottom of the cannon). The model could be rotated by pressing the left mouse and draging. Compared with last lab, the cylinder is empty inside as it is supposed to. Meanwhile, I add some cubes inside the wheels so that they could look more like real wheels. The crete is made by cube

3. light
	The light could be controlled by the html button. You could move the light by the html button as well as the light intensity. The specular could appear when move the camera to the certain position. The light is independent to the camera and thus changing the light position is changing the light according to the position of the camera. To make light follow to the camera, remove the comment and make the code "nMatrix = mat4.multiply(nMatrix, vMatrix)" work in line 464.

4. Keyboard controls
To make it convenience to control and see the light effect, here is keyboard control:
W/w: make the light move forward
S/s: make the light move backward
A/a: make the light move left
D/d: make the light move right
Q/q: make the light move up
E/e: make the light move down
1: increase the intensity of ambient light
2: decrease the intensity of ambient light
3: increase the intensity of diffuse light
4: decrease the intensity of diffuse light
5: increase the intensity of specular light
6: decrease the intensity of specular light
Note: those key controls are not on the numpad.

Also to make it easy to look around the object, I make some keyboard control to camera as well:
Note: it is recommended to resume to initial position to check those functions!
R/r: make the camera rotate around y axis.
F/f: make the camera roate around x axis.(might be buggy but it won't effect the light)

5. Mouse control
Press and hold the left button to rotate the object(not move around the camera).


How to run program:
1. Open the file lab4.html with browser. Firefox is recommended. 
2. The model, camera and light system are controlled by html button.

Develop Environment:
OS: Ubuntu
Browser: Firefox

