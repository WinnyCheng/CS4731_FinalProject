//draws a cube with given vertices and a color
function drawCube(vertices, objColor){

    var pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program,  "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    materialAmbient = vec4(0.5, 0.5, 0.5, 1.0);
    materialDiffuse = objColor;

    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    var ambientProduct = mult(lightAmbient, materialAmbient);

    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));

    var vBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    if(smoothShading)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(gourandNormal2), gl.STATIC_DRAW);
    else
        gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray2), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation( program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    gl.disableVertexAttribArray( vTexCoord );

    gl.drawArrays( gl.TRIANGLES, 0, 36);
}

//draws a sphere with given vertices and a color
function drawSphere(vertices, objColor){

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    materialAmbient = vec4(0.5, 0.5, 0.5, 1.0);
    materialDiffuse = objColor;

    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    var ambientProduct = mult(lightAmbient, materialAmbient);

    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));

    var vBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    if(smoothShading)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(gourandNormal), gl.STATIC_DRAW);
    else
        gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation( program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    gl.disableVertexAttribArray( vTexCoord );

    for( var j=0; j<vertices.length; j+=3)
        gl.drawArrays( gl.TRIANGLES, j, 3 );
}

//draws a vertical line if direction is 'v' and horizontal line if direction is 'h' with given length
function drawLine(direction, length){

    var linePoints = [];

    if(direction === "v"){  //vertical line
        linePoints.push(vec4(0.0, length/2, 0.0, 1.0));
        linePoints.push(vec4(0.0, -length/2, 0.0, 1.0));
    }
    else{ //horizontal line
        linePoints.push(vec4(length/2, 0.0, 0.0, 1.0));
        linePoints.push(vec4(-length/2, 0.0, 0.0, 1.0));
    }

    var pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(linePoints), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.disableVertexAttribArray( vTexCoord );

    var flagLoc = gl.getUniformLocation(program, "flag");
    gl.uniform1f(flagLoc, 1.0);

    gl.drawArrays( gl.LINE_STRIP, 0, 2);

    gl.uniform1f(flagLoc, 0.0);
}

//draws a plane
function drawPlane(colour, image){
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));

    var pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(planeArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program,  "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(textCoord), gl.STATIC_DRAW );

    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    var flagLoc = gl.getUniformLocation(program, "flag");
    gl.uniform1f(flagLoc, 2.0);

    if(textureOn && loadImage1 && loadImage2)
        configureTexture(image);
    else
        createTexture(colour);

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4);
}