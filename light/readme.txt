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
	The object contains cannon, 3 cretes and ammo. The ammo is made by sphere. The cretes is made by cube. The cannon is made by cube(between the wheels), cylinder(wheels and the body of the cannon) and the sphere(the bottom of the cannon). The model could be rotated by pressing the left mouse and draging. The model could be also scaled by pressing the right button of mouse and draging. 

How to run program:
1. Open the file lab2.html with browser. Firefox is recommended. 
2. The model and camera are controlled by html button.

Develop Environment:
OS: Ubuntu
Browser: Firefox

The program is also tested under Windows 8 and it works fine.
