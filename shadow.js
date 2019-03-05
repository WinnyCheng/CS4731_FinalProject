//shadow implementation

var m;

function shadows(xPos){
    var xTrans = (a-1) * ((xPos*Math.cos(theta*Math.PI/180) - lightPosition[0])) / lightPosition[2];

    stack.push(mvMatrix);
    mvMatrix = mult(mvMatrix, translate(-xTrans, 0, -a+1));
    mvMatrix = mult(mvMatrix, translate(lightPosition[0], lightPosition[1], lightPosition[2]));
    mvMatrix = mult(mvMatrix, m);
    mvMatrix = mult(mvMatrix, translate(-lightPosition[0], -lightPosition[1], -lightPosition[2]));
    mvMatrix = mult(mvMatrix, rotateY(theta));
}

function setShadows(){
    m = mat4();
    m[3][3] = 0;
    m[3][2] = -1/lightPosition[2];

    var flagLoc = gl.getUniformLocation(program, "flag");
    gl.uniform1f(flagLoc, 3.0);

    shadows(0);
    positionObject(drawSphere, pointsArray, vec4(0.0, 1.0, 1.0, 1.0), 0, 5); //cyan sphere
    mvMatrix = stack.pop();

    shadows(4);
    yAxisRotation(4, alpha);
    positionObject(drawCube, cubeVer, vec4(1.0, 0.0, 0.0, 1.0), -4);  //red cube
    mvMatrix = stack.pop();

    shadows(-4);
    yAxisRotation(-4, alpha);
    positionObject(drawSphere, pointsArray, vec4(1.0, 1.0, 0.0, 1.0), 4); //yellow sphere
    mvMatrix = stack.pop();

    shadows(6);
    yAxisRotation(4, alpha);
    yAxisRotation(6, omega);
    positionObject(drawCube, cubeVer, vec4(0.0, 1.0, 0.0, 1.0), -6, -5);  //green cube
    mvMatrix = stack.pop();

    shadows(2);
    yAxisRotation(4, alpha);
    yAxisRotation(2, omega);
    positionObject(drawSphere, pointsArray, vec4(1.0, 0.0, 1.0, 1.0), -2, -5); //magenta sphere
    mvMatrix = stack.pop();

    shadows(-6);
    yAxisRotation(-4, alpha);
    yAxisRotation(-6, omega);
    positionObject(drawSphere, pointsArray, vec4(0.5, 0.5, 0.5, 1.0), 6, -5); //grey sphere
    mvMatrix = stack.pop();

    shadows(-2);
    yAxisRotation(-4, alpha);
    yAxisRotation(-2, omega);
    positionObject(drawCube, cubeVer, vec4(0.0, 0.0, 1.0, 1.0), 2, -5);  //blue cube
    mvMatrix = stack.pop();
}