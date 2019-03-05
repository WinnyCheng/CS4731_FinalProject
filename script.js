var aspect;

//for animation toggle, turning animation on and off
// initially animation is off
var id;
var animate = true;

// boolean for toggling features on and off
var shadowOn = true;
var textureOn = true;
var reflectOn = false;
var refractOn = false;

//lighting
var lightPosition = vec4(0.0, 0.0, 15.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialDiffuse;
var materialAmbient;
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0;
var spotLightLimit = 0.95;

function main(){
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = WebGLUtils.setupWebGL(canvas, undefined);

    //Check that the return value is not null.
    if (!gl)
    {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    program = initShaders(gl, "vshader", "fshader");
    gl.useProgram(program);

    //Set up the viewport
    gl.viewport( 0, 0, canvas.width, canvas.height);
    aspect = canvas.width/canvas.height;

    // Set clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas> by clearing the color buffer
    gl.enable(gl.DEPTH_TEST);

    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

    points = [];
    pointsArray = [];
    normalsArray = [];
    normalsArray2 = [];
    gourandNormal = [];
    gourandNormal2 = [];

    //creates a generic sphere
    sphere(va, vb, vc, vd, numTimesToSubdivide);

    //calculate normals for flat shading
    normalsArray = calcNormal(pointsArray);

    //creates cubes
    cubeVer = cube();

    //calculate cube normals for flat shading
    normalsArray2 = calcNormal(cubeVer);

    //normal values of cube for gouraud shading
    var vertex = [];
    for(var i = 0; i < cubeVer.length; i++){
        vertex = cubeVer[i];
        gourandNormal2.push(vertex[0], vertex[1], vertex[2], 0.0);
    }

    projection = gl.getUniformLocation(program, "projectionMatrix");
    modelView = gl.getUniformLocation(program, "modelMatrix");

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //gl.enable(gl.CULL_FACE);
    //gl.cullFace(gl.BACK);

    pMatrix = perspective(45, aspect, .1, 60);
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );

    var eye = vec3(0, 0, 30);
    var at = vec3(0, 0, 0);
    var up = vec3(0, 1, 0);
    mvMatrix = lookAt(eye, at , up);

    setEnv();
    setImage();
    render();
}

function render(){

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    setBackground();

    gl.uniform1f(gl.getUniformLocation(program, "limit"), spotLightLimit);

    var flagLoc = gl.getUniformLocation(program, "flag");
    gl.uniform1f(flagLoc, 0.0);

    //Top Level
    stack.push(mvMatrix);
        mvMatrix = mult(mvMatrix, rotateY(theta));
        positionObject(drawSphere, pointsArray, vec4(0.0, 1.0, 1.0, 1.0), 0, 5); //cyan sphere

        // lines that branch from top level to middle level
        positionObject(drawLine, "h", 8, 0, 2.5);
        positionObject(drawLine, "v", 2.5, 0, 3.75);
        positionObject(drawLine, "v", 2.5, -4, 1.25);
        positionObject(drawLine, "v", 2.5, 4, 1.25);

        //Middle Level
        //Left Branch
        stack.push(mvMatrix);
            yAxisRotation(4, alpha);
            positionObject(drawCube, cubeVer, vec4(1.0, 0.0, 0.0, 1.0), -4);  //red cube

            // lines that branch from middle level to bottom level
            positionObject(drawLine, "h", 4, -4, -2.5);
            positionObject(drawLine, "v", 2.5, -4, -1.25);
            positionObject(drawLine, "v", 2.5, -6, -3.75);
            positionObject(drawLine, "v", 2.5, -2, -3.75);

            //Bottom Left Level
            stack.push(mvMatrix);
                yAxisRotation(6, omega);
                positionObject(drawCube, cubeVer, vec4(0.0, 1.0, 0.0, 1.0), -6, -5);  //green cube
            mvMatrix = stack.pop();

            stack.push(mvMatrix);
                yAxisRotation(2, omega);
                positionObject(drawSphere, pointsArray, vec4(1.0, 0.0, 1.0, 1.0), -2, -5); //magenta sphere
            mvMatrix = stack.pop();
        mvMatrix = stack.pop();

        //Right Branch
        stack.push(mvMatrix);
            yAxisRotation(-4, alpha);
            positionObject(drawSphere, pointsArray, vec4(1.0, 1.0, 0.0, 1.0), 4); //yellow sphere

            // lines that branch from middle level to bottom level
            positionObject(drawLine, "h", 4, 4, -2.5);
            positionObject(drawLine, "v", 2.5, 4, -1.25);
            positionObject(drawLine, "v", 2.5, 6, -3.75);
            positionObject(drawLine, "v", 2.5, 2, -3.75);

            //Bottom Right Level
            stack.push(mvMatrix);
                yAxisRotation(-2, omega);
                positionObject(drawCube, cubeVer, vec4(0.0, 0.0, 1.0, 1.0), 2, -5);  //blue cube
            mvMatrix = stack.pop();

            stack.push(mvMatrix);
                yAxisRotation(-6, omega);
                positionObject(drawSphere, pointsArray, vec4(0.5, 0.5, 0.5, 1.0), 6, -5); //grey sphere
            mvMatrix = stack.pop();
        mvMatrix = stack.pop();
    mvMatrix = stack.pop();

    window.onkeypress = keyEvent;

    if(shadowOn)
        setShadows();

    if(animate) {
        //rotation speed and direction
        theta += 3.0;  //counter clockwise
        alpha -= 6.0;  //clockwise
        omega += 9.0;  //counter clockwise

        id = requestAnimationFrame(render);
    }
    else
        cancelAnimationFrame(id);
}

//calculates normal per face
function calcNormal(vertices){
    var ver;
    var nArray = [];
    // x, y, z, component of normal
    var mx = 0, my = 0, mz = 0;
    var x1, y1, z1, x2, y2, z2;

    var magnitude, normal;

    for(var k = 0; k < vertices.length; k+=3){

        ver = [];

        ver.push(vertices[k]);
        ver.push(vertices[k+1]);
        ver.push(vertices[k+2]);
        ver.push(vertices[k]);

        mx = 0; my = 0; mz = 0;

        //using Newell's Method to find x, y, z component of normal
        for(var i = 0; i < ver.length - 1; i++){
            x1 = ver[i][0]; x2 = ver[i+1][0];
            y1 = ver[i][1]; y2 = ver[i+1][1];
            z1 = ver[i][2]; z2 = ver[i+1][2];

            mx += (y1 - y2) * (z1 + z2);   //x, (yi - ynext)*(zi + znext)
            my += (z1 - z2) * (x1 + x2);   //y, (zi - znext)*(xi + xnext)
            mz += (x1 - x2) * (y1 + y2);   //z, (xi - xnext)*(yi + ynext)
        }

        magnitude = Math.sqrt(mx*mx + my*my + mz*mz);   //magnitude of normal vector
        normal = vec3(mx/magnitude, my/magnitude, mz/magnitude);   //normalize normal vector

        nArray.push(normal[0], normal[1], normal[2], 0.0);
        nArray.push(normal[0], normal[1], normal[2], 0.0);
        nArray.push(normal[0], normal[1], normal[2], 0.0);
    }
    return nArray;
}

//translation to move an object to drawn at the origin to it's proper position
function positionObject(draw, param1, param2, xPos = 0, yPos = 0, zPos = 0){
    stack.push(mvMatrix);
        mvMatrix = mult(mvMatrix, translate(xPos, yPos, zPos));  //translates the object to position given in parameter
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        draw(param1, param2); //draws a line, cube, or sphere depending on what is passes in through draw
    mvMatrix = stack.pop();
}

//rotate around the y axis about the object's center
function yAxisRotation(xPos, angle){
    var rotMatrix = mult(translate(-xPos, 0, 0), mult(rotateY(angle), translate(xPos, 0, 0)));
    mvMatrix = mult(mvMatrix, rotMatrix);
}

//handles all keyboard events
function keyEvent(){
    var key = event.key;
    switch(key){
        case 'f': //turn off animation
            animate = false;
            break;
        case 'n': //turn animation on
            if(!animate) {
                animate = true;
                render();
            }
            break;
        case 'p': // increase spotlight
            if(spotLightLimit < 1.0) {
                spotLightLimit += 0.005;
                if(!animate)
                    render();
            }
            break;
        case 'P': // decrease spotlight
            if(spotLightLimit > 0.8) {
                spotLightLimit -= 0.005;
                if(!animate)
                    render();
            }
            break;
        case "m": // shaded using Gouraud shading
            smoothShading = true;
            if(!animate)
                render();
            break;
        case 'M': // shaded using flat shading
            smoothShading = false;
            if(!animate)
                render();
            break;
        case 's':
            if(numTimesToSubdivide > 0) {
                numTimesToSubdivide--;
                resetSphere();
            }
            break;
        case 'S':
            if(numTimesToSubdivide < 8){
                numTimesToSubdivide++;
                resetSphere();
            }
            break;
        case 'A': // toggle shadows on and off
            shadowOn = !shadowOn;
            if(!animate)
                render();
            break;
        case 'B': // toggle texture on and off
            textureOn = !textureOn;
            if(!animate)
                render();
            break;
        case 'C': // toggle reflection on and off
            reflectOn = !reflectOn;

            if(refractOn && reflectOn)
                gl.uniform1f(gl.getUniformLocation(program, "reflectRefract"), 3.0);
            else if(refractOn)
                gl.uniform1f(gl.getUniformLocation(program, "reflectRefract"), 2.0);
            else if(reflectOn)
                gl.uniform1f(gl.getUniformLocation(program, "reflectRefract"), 1.0);
            else
                gl.uniform1f(gl.getUniformLocation(program, "reflectRefract"), 0.0);

            if(!animate)
                render();
            break;
        case 'D': //toggle refraction on and off
            refractOn = !refractOn;

            if(refractOn && reflectOn)
                gl.uniform1f(gl.getUniformLocation(program, "reflectRefract"), 3.0);
            else if(refractOn)
                gl.uniform1f(gl.getUniformLocation(program, "reflectRefract"), 2.0);
            else if(reflectOn)
                gl.uniform1f(gl.getUniformLocation(program, "reflectRefract"), 1.0);
            else
                gl.uniform1f(gl.getUniformLocation(program, "reflectRefract"), 0.0);
            if(!animate)
                render();
            break;
    }
}

//creates background plane and sets a texture to the background planes
function setBackground(){

    stack.push(mvMatrix);
    mvMatrix = mult(mvMatrix, mult(translate(0, -15, 0), rotateX(90)));
    drawPlane(vec4(0.5, 0.5, 0.5, 1.0), grass);
    mvMatrix = stack.pop();

    stack.push(mvMatrix);
    mvMatrix = mult(mvMatrix, mult(translate(-a,  0, 0), rotateY(90)));
    drawPlane(vec4(0.5, 0.0, 0.5, 1.0), stone);
    mvMatrix = stack.pop();

    stack.push(mvMatrix);
    mvMatrix = mult(mvMatrix, mult(translate(a, 0, 0), rotateY(-90)));
    drawPlane(vec4(0.5, 0.0, 0.5, 1.0), stone);
    mvMatrix = stack.pop();

    stack.push(mvMatrix);
    mvMatrix = mult(mvMatrix, translate(0, 0, -a));
    drawPlane(vec4(0.5, 0.5, 1.0, 1.0), stone);
    mvMatrix = stack.pop();
}


