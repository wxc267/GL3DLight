
//////////////////////////////////////////////////////////////////


var gl;
var shaderProgram;
var draw_type=2; 





//////////// Init OpenGL Context etc. ///////////////

    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }

    var mvMatrixStack = [];

    function PushMatrix(matrix) {
        var copy = mat4.create();
        mat4.set(matrix, copy);
        mvMatrixStack.push(copy);
    }

    function PopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        var copy = mvMatrixStack.pop();
	return copy; 
    }

    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////
    //cube buffer - between wheel.
    var cubeBuffer;
    //sphere buffer - for cannon bottom
    var sphereBuffer;  
    //cylinder buffer - for cannon body
    var cylinderBuffer;
    //4 - crete
    var crete1Buffer;
    var crete2Buffer;
    var crete3Buffer;
    var crete4Buffer;
 
    //wheel
    var leftWheelBuffer;
    var rightWheelBuffer;

    //ammo	
    var ammoBuffer;

   ////////////////    Initialize VBO  ////////////////////////

    function initCubeBuffers(size,color) {

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	var length=size/2.0;
	var p1=[length,  length,  -length];
	var p2=[-length,  length,  -length];
	var p3=[ - length, -length,  -length];
	var p4=[length, -length,  -length];
	var p5=[length,  length,  length];
	var p6=[-length,  length,  length];
	var p7=[-length, -length,  length];
	var p8=[length, -length,  length];

        var vertices = [];
	//front
	vertices=vertices.concat(p1);
	vertices=vertices.concat(p2);
	vertices=vertices.concat(p3);
	vertices=vertices.concat(p4);

	//right
	vertices=vertices.concat(p5);
	vertices=vertices.concat(p1);
	vertices=vertices.concat(p4);
	vertices=vertices.concat(p8);

	//top
	vertices=vertices.concat(p5);
	vertices=vertices.concat(p6);
	vertices=vertices.concat(p2);
	vertices=vertices.concat(p1);

	//bottom
	vertices=vertices.concat(p4);
	vertices=vertices.concat(p3);
	vertices=vertices.concat(p7);
	vertices=vertices.concat(p8);
	
	//left
	vertices=vertices.concat(p2);
	vertices=vertices.concat(p6);
	vertices=vertices.concat(p3);
	vertices=vertices.concat(p7);	

	//back
	vertices=vertices.concat(p5);
	vertices=vertices.concat(p6);
	vertices=vertices.concat(p7);
	vertices=vertices.concat(p8);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        positionBuffer.itemSize = 3;
        positionBuffer.numItems = 24;

	var indices = [0,1,2, 0,2,3, 4,5,6, 4,6,7, 8,9,10,8,10,11, 12,13,14, 12,14,15, 16,17,18,16,18,19, 20,21,22,20,22,23];
	var indexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);  
        indexBuffer.itemsize = 1;
        indexBuffer.numItems = 36;  

        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	var colorVertex=[];
	for(var i=0;i<24;i++)
	{
		colorVertex=colorVertex.concat(color);
	}
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorVertex), gl.STATIC_DRAW);
        colorBuffer.itemSize = 4;
        colorBuffer.numItems = 8;


	
	var normal = [
	  // Front
	   0.0,  0.0,  -1.0,
	   0.0,  0.0,  -1.0,
	   0.0,  0.0,  -1.0,
	   0.0,  0.0,  -1.0,
	  // Right
	   1.0,  0.0,  0.0,
	   1.0,  0.0,  0.0,
	   1.0,  0.0,  0.0,
	   1.0,  0.0,  0.0,
	   // Top
	   0.0,  1.0,  0.0,
	   0.0,  1.0,  0.0,
	   0.0,  1.0,  0.0,
	   0.0,  1.0,  0.0,

	  // Bottom
	   0.0, -1.0,  0.0,
	   0.0, -1.0,  0.0,
	   0.0, -1.0,  0.0,
	   0.0, -1.0,  0.0,


	  // Left
	  -1.0,  0.0,  0.0,
	  -1.0,  0.0,  0.0,
	  -1.0,  0.0,  0.0,
	  -1.0,  0.0,  0.0,
	  // Back
	   0.0,  0.0,1.0,
	   0.0,  0.0, 1.0,
	   0.0,  0.0, 1.0,
	   0.0,  0.0, 1.0, 

	];
        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
        normalBuffer.itemSize = 3;
        normalBuffer.numItems = 24;    

	var buffer=[positionBuffer,colorBuffer,normalBuffer,indexBuffer];
	return buffer;
    }
    function initSphereBuffers(radius,num_slices, num_stacks, color)
    {
      
	var degree_between_slices=360.0/num_slices;
	var degree_between_stacks=180.0/(num_stacks+1);
        var vertices = [];
	var colorVertex = [];
	var num_vertices=0;
	var num_colors=0;
	var normal=[];
	//add vertices on the north polar
	for(var i=0;i<=num_stacks+1;i++)
	{
		var theta=degToRad(degree_between_stacks*i);
		var y=radius*Math.cos(theta);	
		var r=radius*Math.sin(theta);	
		for(var j=0;j<=num_slices;j++)
		{
			var phi=degToRad(degree_between_slices*j);
			var x=r*Math.cos(phi);
			var z=r*Math.sin(phi);
			vertices.push(x);
			vertices.push(y);
			vertices.push(z);
			normal.push(x);
			normal.push(y);
			normal.push(z);
			
			colorVertex=colorVertex.concat(color);
			num_vertices++;
			num_colors++;
		}

	}		

  	var nindices = (num_stacks+1)*6*(num_slices+1); 
	var index=[];
  	for (var i =0; i<num_stacks+1; i++){
   		for (var j=0; j<=num_slices; j++) {
      			var mi = j % num_slices;
      			var mi2 = (j+1) % num_slices;
      			var idx = (i+1) * num_slices + mi;	
      			var idx2 = i*num_slices + mi; // mesh[j][mi] 
      			var idx3 = (i) * num_slices + mi2;
      			var idx4 = (i+1) * num_slices + mi;
      			var idx5 = (i) * num_slices + mi2;
      			var idx6 = (i+1) * num_slices + mi2;
	
		      index.push(idx); 
		      index.push(idx2);
		      index.push(idx3); 
		      index.push(idx4);
		      index.push(idx5); 
		      index.push(idx6);
	    	}
	}

	var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        positionBuffer.itemSize = 3;
        positionBuffer.numItems = num_vertices;

 	var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
        normalBuffer.itemSize = 3;
        normalBuffer.numItems = num_vertices;

        colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorVertex), gl.STATIC_DRAW);
        colorBuffer.itemSize = 4;
        colorBuffer.numItems = num_colors;

	var indexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);  
        indexBuffer.itemsize = 1;
        indexBuffer.numItems = nindices;

	var buffer=[positionBuffer,colorBuffer,normalBuffer,indexBuffer];
	return buffer;
    }
    function initCylinderBuffers(bottom_radius,top_radius,height,number_stacks,number_slices,color)
    {
	
	var delta_r=(top_radius-bottom_radius)/number_stacks;
	var delta_h=height*1.0/number_stacks;
	var degree=360.0/number_slices;
	var colorVertex=[];
	var vertices=[];
	var num_vertices=0;
	var num_colors=0;
	var normal=[];

	var Dangle = 2*Math.PI/(number_slices-1);
	for(var i=0;i<number_stacks;i++)
	{
		for (var j=0; j<number_slices; j++) {
			var angle = Dangle * j; 
			var r=top_radius-delta_r*i;
			var h=height-delta_h*i
      			vertices.push(r*Math.cos(angle)); 
      			vertices.push(r*Math.sin(angle)); 
      			vertices.push(height-delta_h*i);

      			normal.push(r*Math.cos(angle)); 
      			normal.push(r*Math.sin(angle));
      			normal.push(0.0); 
			/*
      			colorVertex.push(color[0]*Math.cos(angle)); 
      			colorVertex.push(color[1]*Math.sin(angle)); 
      			colorVertex.push(color[2]*i*1.0/(number_stacks-1));	
      			colorVertex.push(color[3]);*/
			colorVertex=colorVertex.concat(color); 
    		}
	}


  	var nindices = (number_stacks-1)*6*(number_slices+1); 
	var index=[];
  	for (var i =0; i<number_stacks-1; i++){
   		for (var j=0; j<=number_slices; j++) {
      			var mi = j % number_slices;
      			var mi2 = (j+1) % number_slices;
      			var idx = (i+1) * number_slices + mi;	
      			var idx2 = i*number_slices + mi; // mesh[j][mi] 
      			var idx3 = (i) * number_slices + mi2;
      			var idx4 = (i+1) * number_slices + mi;
      			var idx5 = (i) * number_slices + mi2;
      			var idx6 = (i+1) * number_slices + mi2;
	
		      index.push(idx); 
		      index.push(idx2);
		      index.push(idx3); 
		      index.push(idx4);
		      index.push(idx5); 
		      index.push(idx6);
	    	}
	}

	var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        positionBuffer.itemSize = 3;
        positionBuffer.numItems = num_vertices;

	var indexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);  
        indexBuffer.itemsize = 1;
        indexBuffer.numItems = (number_stacks-1)*6*(number_slices+1); 

	var normalBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
        normalBuffer.itemSize = 3;
        normalBuffer.numItems = num_vertices;  

	var indexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);  
       indexBuffer.itemsize = 1;
        indexBuffer.numItems = (number_stacks-1)*6*(number_slices+1);

        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorVertex), gl.STATIC_DRAW);
        colorBuffer.itemSize = 4;
        colorBuffer.numItems = num_colors;
	var buffer=[positionBuffer,colorBuffer,normalBuffer,indexBuffer];
	return buffer;

    }

    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////

    var mMatrix = mat4.create();  // model matrix
    var vMatrix = mat4.create(); // view matrix
    var pMatrix = mat4.create();  //projection matrix 
    var nMatrix = mat4.create();  // normal matrix
    var Z_angle = 0.0;
    var scale=1;

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
        gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	
        gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);
    }

     function degToRad(degrees) {
        return degrees * Math.PI / 180;
     }

    ///////////////////////////////////////////////////////////////
  	// set up the parameters for lighting 
	  var light_ambient = [0,0,0,1]; 
	  var light_diffuse = [.8,.8,.8,1];
	  var light_specular = [1.3,1.3,1.3,1]; 
	  var light_pos = [0,0,0,1];   // eye space position 

	  var mat_ambient = [0.2, 0.2, 0.2, 1]; 
	  var mat_diffuse= [0.6, 0.6, 0.6, 1]; 
	  var mat_specular = [0.9,0.9, 0.9,1]; 
	  var mat_shine = [100]; 

    function lightManagement()
    {
        shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");

	gl.uniform4f(shaderProgram.light_posUniform,light_pos[0], light_pos[1], light_pos[2], light_pos[3]); 	
	gl.uniform4f(shaderProgram.ambient_coefUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2], 1.0); 
	gl.uniform4f(shaderProgram.diffuse_coefUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], 1.0); 
	gl.uniform4f(shaderProgram.specular_coefUniform, mat_specular[0], mat_specular[1], mat_specular[2],1.0); 
	gl.uniform1f(shaderProgram.shininess_coefUniform, mat_shine[0]); 

	gl.uniform4f(shaderProgram.light_ambientUniform, light_ambient[0], light_ambient[1], light_ambient[2], 1.0); 
	gl.uniform4f(shaderProgram.light_diffuseUniform, light_diffuse[0], light_diffuse[1], light_diffuse[2], 1.0); 
	gl.uniform4f(shaderProgram.light_specularUniform, light_specular[0], light_specular[1], light_specular[2],1.0); 


    }


    function drawObject(buffer)
    {

	
	mat4.identity(nMatrix); 
	nMatrix = mat4.multiply(nMatrix, vMatrix);
	nMatrix = mat4.multiply(nMatrix, mMatrix); 	
	nMatrix = mat4.inverse(nMatrix);
	nMatrix = mat4.transpose(nMatrix); 

	lightManagement();
	
	var position=buffer[0];
	var color=buffer[1];
	var normal=buffer[2];
	var index=buffer[3];
	gl.bindBuffer(gl.ARRAY_BUFFER, position);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, position.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, color);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,color.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, normal);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normal.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index); 

        setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 

	if (draw_type ==1) gl.drawArrays(gl.LINE_LOOP, 0, position.numItems);	
        else if (draw_type ==0) gl.drawArrays(gl.POINTS, 0, position.numItems);
	else if (draw_type==2) gl.drawElements(gl.TRIANGLES, index.numItems , gl.UNSIGNED_SHORT, 0); 
    }


    var cylinderMatrix, cubeMatrix,sphereMatrix,crete1Matrix,crete2Matrix,crete3Matrix;
    var	crete4Matrix,leftWheelMatrix,rightWheelMatrix,ammoMatrix;

function initPosition()
{
	mat4.identity(mMatrix);
	mat4.identity(sphereMatrix);
	mat4.identity(cubeMatrix);
	mat4.identity(cylinderMatrix);
	mat4.identity(leftWheelMatrix);
	mat4.identity(rightWheelMatrix);
	mat4.identity(crete1Matrix);
	mat4.identity(crete2Matrix);
	mat4.identity(crete3Matrix);
	mat4.identity(crete4Matrix);
	mat4.identity(ammoMatrix);
	
	cubeMatrix = mat4.translate(cubeMatrix, [0.35, 0.2, 0]);
	cubeMatrix = mat4.scale(cubeMatrix,[0.1,0.1,0.4]);
	sphereMatrix = mat4.translate(sphereMatrix, [0.8, 0.4, 0.05]);
	cylinderMatrix=mat4.translate(cylinderMatrix,[0.85,0.4,0.05]);
	cylinderMatrix=mat4.rotate(cylinderMatrix,degToRad(-90),[0,1,0]);
	leftWheelMatrix=mat4.translate(leftWheelMatrix,[0.35,0.2,0.2]);
	leftWheelMatrix=mat4.rotate(leftWheelMatrix,degToRad(90),[0,0,1]);
	rightWheelMatrix=mat4.translate(rightWheelMatrix,[0.35,0.2,-0.2]);
	rightWheelMatrix=mat4.rotate(rightWheelMatrix,degToRad(-90),[0,0,1]);

	crete1Matrix=mat4.translate(crete1Matrix,[0.35,0.2,0.25]);
	crete1Matrix = mat4.scale(crete1Matrix,[0.58,0.1,0.1]);
	crete2Matrix=mat4.translate(crete2Matrix,[0.35,0.2,-0.15]);
	crete2Matrix = mat4.scale(crete2Matrix,[0.58,0.1,0.1]);
	crete3Matrix=mat4.translate(crete3Matrix,[0.35,0.2,0.25]);
	crete3Matrix = mat4.scale(crete3Matrix,[0.1,0.58,0.1]);
	crete4Matrix=mat4.translate(crete4Matrix,[0.35,0.2,-0.15]);
	crete4Matrix = mat4.scale(crete4Matrix,[0.1,0.58,0.1]);
	
	
	ammoMatrix=mat4.translate(ammoMatrix,[-0.3,0.1,0.3]);
}

  function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	var cameraPosition=[u_x,u_y,u_z];
	var centerInterest=[v_x,v_y,v_z];
	var loopUp=[n_x,n_y,n_z];
	vMatrix = mat4.lookAt(cameraPosition, centerInterest, loopUp, vMatrix);	// set up the view matrix

    	mat4.identity(mMatrix);
 	mMatrix = mat4.rotate(mMatrix, degToRad(Z_angle), [0, 1, 0]);   // now set up the model matrix 




	
	for(var i=0;i<9;i++){
		PushMatrix(mMatrix);
	}
	//draw cube
	mMatrix=mat4.multiply(mMatrix,cubeMatrix);        	
	drawObject(cubeBuffer);	
	//draw sphere 
	mMatrix=PopMatrix();
	mMatrix=mat4.multiply(mMatrix,sphereMatrix);
	drawObject(sphereBuffer);
	//draw cylinder
	mMatrix=PopMatrix();
	mMatrix=mat4.multiply(mMatrix,cylinderMatrix);	
	drawObject(cylinderBuffer);
	//draw wheels
	mMatrix=PopMatrix();
	mMatrix=mat4.multiply(mMatrix,leftWheelMatrix);
	drawObject(leftWheelBuffer);
	mMatrix=PopMatrix();
	mMatrix=mat4.multiply(mMatrix,rightWheelMatrix);
	drawObject(rightWheelBuffer);
	//draw cretes
	mMatrix=PopMatrix();
	mMatrix=mat4.multiply(mMatrix,crete1Matrix);
	drawObject(crete1Buffer);
	mMatrix=PopMatrix();
	mMatrix=mat4.multiply(mMatrix,crete2Matrix);
	drawObject(crete2Buffer);        
	mMatrix=PopMatrix();
	mMatrix=mat4.multiply(mMatrix,crete3Matrix);
	drawObject(crete3Buffer);   
	mMatrix=PopMatrix();
	mMatrix=mat4.multiply(mMatrix,crete4Matrix);
	drawObject(crete4Buffer); 
	//draw ammo
	mMatrix=PopMatrix();
	mMatrix=mat4.multiply(mMatrix,ammoMatrix);
	drawObject(ammoBuffer); 
		
    }


    ///////////////////////////////////////////////////////////////

     var lastMouseX = 0, lastMouseY = 0;
     var mouseButton=0;

    ///////////////////////////////////////////////////////////////
 
     function onDocumentMouseDown( event ) {
          event.preventDefault();
          canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
          canvas.addEventListener( 'mouseup', onDocumentMouseUp, false );
          canvas.addEventListener( 'mouseout', onDocumentMouseOut, false );
          var mouseX = event.clientX;
          var mouseY = event.clientY;
	  mouseButton=event.button;
          lastMouseX = mouseX;
          lastMouseY = mouseY; 

      }

     function onDocumentMouseMove( event ) {
          var mouseX = event.clientX;
          var mouseY = event.clientY; 

          var diffX = mouseX - lastMouseX;
          var diffY = mouseY - lastMouseY;
	  if(mouseButton === 0){
          	Z_angle = Z_angle + diffX/5;
	  }
	  else if(mouseButton===2)
	  {
		if(diffX>0)
		{
			scale=scale+diffX/5;
		}
		else if(diffX==0)
		{
			scale=1;
		}
		else
		{
			scale=-(1/scale)+diffX/5;
			scale=-(1/scale);
		}
	  }
          lastMouseX = mouseX;
          lastMouseY = mouseY;

          drawScene();
     }

     function onDocumentMouseUp( event ) {
          canvas.removeEventListener( 'mousemove', onDocumentMouseMove, false );
          canvas.removeEventListener( 'mouseup', onDocumentMouseUp, false );
          canvas.removeEventListener( 'mouseout', onDocumentMouseOut, false );
     }

     function onDocumentMouseOut( event ) {
          canvas.removeEventListener( 'mousemove', onDocumentMouseMove, false );
          canvas.removeEventListener( 'mouseup', onDocumentMouseUp, false );
          canvas.removeEventListener( 'mouseout', onDocumentMouseOut, false );
     }

    ///////////////////////////////////////////////////////////////
    var canvas
    function webGLStart() {
        canvas = document.getElementById("code03-canvas");
        initGL(canvas);
        initShaders();

	gl.enable(gl.DEPTH_TEST); 

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute)	
        shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
        shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");	

        shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");
        shaderProgram.ambient_coefUniform = gl.getUniformLocation(shaderProgram, "ambient_coef");	
        shaderProgram.diffuse_coefUniform = gl.getUniformLocation(shaderProgram, "diffuse_coef");
        shaderProgram.specular_coefUniform = gl.getUniformLocation(shaderProgram, "specular_coef");
        shaderProgram.shininess_coefUniform = gl.getUniformLocation(shaderProgram, "mat_shininess");

        shaderProgram.light_ambientUniform = gl.getUniformLocation(shaderProgram, "light_ambient");	
        shaderProgram.light_diffuseUniform = gl.getUniformLocation(shaderProgram, "light_diffuse");
        shaderProgram.light_specularUniform = gl.getUniformLocation(shaderProgram, "light_specular");	


        cubeBuffer=initCubeBuffers(1,[0.8,0.4,0,1]);
	sphereBuffer=initSphereBuffers(0.15,50,50,[0.65,0.6,0.5,1]);
	cylinderBuffer=initCylinderBuffers(0.15, 0.15, 1.3, 20, 20, [0.75,0.75,0.5,1]);
	crete1Buffer=initCubeBuffers(1,[0.75,0.5,0,1]);
	crete2Buffer=initCubeBuffers(1,[0.75,0.5,0,1]);
	crete3Buffer=initCubeBuffers(1,[0.75,0.5,0,1]);
	crete4Buffer=initCubeBuffers(1,[0.75,0.5,0,1]);
	leftWheelBuffer=initCylinderBuffers(0.3, 0.3, 0.1, 20, 20, [0.5,0.25,0,1]);
	rightWheelBuffer=initCylinderBuffers(0.3, 0.3, 0.1, 20, 20, [0.5,0.25,0,1]);
	ammoBuffer=initSphereBuffers(0.13,50,50,[0.25,0.25,0.25,1]);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        canvas.addEventListener('mousedown', onDocumentMouseDown,false); 
        canvas.addEventListener('contextmenu', onDocumentMouseDown, false);
	pMatrix = mat4.perspective(60, 1.0, 0.1, 100, pMatrix);  // set up the projection matrix 

	sphereMatrix=mat4.create();
	cubeMatrix=mat4.create();
	cylinderMatrix=mat4.create();
	leftWheelMatrix=mat4.create();
	rightWheelMatrix=mat4.create();
	crete1Matrix=mat4.create();
	crete2Matrix=mat4.create();
	crete3Matrix=mat4.create();
	crete4Matrix=mat4.create();
	ammoMatrix=mat4.create();



	initPosition();
        drawScene();
}



function redraw() {
    Z_angle = 0; 
    scale=1;
    u_x=0;
    u_y=0;
    u_z=3;
    v_x=0;
    v_y=0;
    v_z=0;
    n_x=0;
    n_y=1;
    n_z=0;
    light_ambient = [0,0,0,1]; 
    light_diffuse = [.8,.8,.8,1];
    light_specular = [1.3,1.3,1.3,1]; 
    light_pos = [0,0,0,1];   // eye space position 
    initPosition();
    drawScene();

}
    

function geometry(type) {

    draw_type = type;
    drawScene();

} 

//camera position changing
var u_x=0;
var u_y=0;
var u_z=3;
var v_x=0;
var v_y=0;
var v_z=0;
var n_x=0;
var n_y=1;
var n_z=0;
var delta=0.5;
function moveDown()
{
	u_y-=delta;
	v_y-=delta;
	drawScene();
}
function moveUp()
{
	u_y+=delta;
	v_y+=delta;
	drawScene();
}
function moveLeft()
{
	u_x-=delta;
	v_x-=delta;
	drawScene();
}
function moveRight()
{
	u_x+=delta;
	v_x+=delta;
	drawScene();
}
//camera center of interest change

function centerUp()
{
	v_y+=delta;
	drawScene();
}

function centerDown()
{
	v_y-=delta;
	drawScene();
}
function centerLeft()
{
	v_x-=delta;
	drawScene();
}
function centerRight()
{
	v_x+=delta;
	drawScene();
}

function centerPanClockwise()
{
	
	n_x=n_x*Math.cos(degToRad(roll_angle))-n_y*Math.sin(degToRad(roll_angle));
	n_y=n_x*Math.sin(degToRad(roll_angle))+n_y*Math.cos(degToRad(roll_angle));
	drawScene();
}
function centerPanCounterClockwise()
{

	n_x=n_x*Math.cos(degToRad(-1*roll_angle))-n_y*Math.sin(degToRad(-1*roll_angle));
	n_y=n_x*Math.sin(degToRad(-1*roll_angle))+n_y*Math.cos(degToRad(-1*roll_angle));
	drawScene();
}
//light position control
function lightUp()
{
	light_pos[1]+=0.5;
	drawScene();
}
function lightDown()
{
	light_pos[1]-=0.5;
	drawScene();
}
function lightLeft()
{
	light_pos[0]-=0.5;
	drawScene();
}
function lightRight()
{
	light_pos[0]+=0.5;
	drawScene();
}
function lightForward()
{
	light_pos[2]-=0.5;
	drawScene();
}
function lightBackward()
{
	light_pos[2]+=0.5;
	drawScene();
}
//light intensity control

function ambientLightUp()
{
	light_ambient[0]+=0.1;
	light_ambient[1]+=0.1;
	light_ambient[2]+=0.1; 
	drawScene();
}
function ambientLightDown()
{
	if(light_ambient[0]>0)
		light_ambient[0]-=0.1;
	if(light_ambient[1]>0)
		light_ambient[1]-=0.1;
	if(light_ambient[2]>0)
		light_ambient[2]-=0.1; 
	drawScene();
}
function diffuseLightUp()
{
	light_diffuse[0]+=0.1;
	light_diffuse[1]+=0.1;
	light_diffuse[2]+=0.1; 
	drawScene();
}
function diffuseLightDown()
{
	if(light_diffuse[0]>0)
		light_diffuse[0]-=0.1;
	if(light_diffuse[1]>0)
		light_diffuse[1]-=0.1;
	if(light_diffuse[2]>0)
		light_diffuse[2]-=0.1; 
	drawScene();
}
function specularLightUp()
{
	light_specular[0]+=0.1;
	light_specular[1]+=0.1;
	light_specular[2]+=0.1; 
	drawScene();
}
function specularLightDown()
{
	if(light_specular[0]>0)
		light_specular[0]-=0.1;
	if(light_specular[1]>0)
		light_specular[1]-=0.1;
	if(light_specular[2]>0)
		light_specular[2]-=0.1; 
	drawScene();
}
