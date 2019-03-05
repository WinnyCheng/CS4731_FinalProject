
var min = 0.0;
var max = 5.0;
var textCoord = [
    vec2(min, min),
    vec2(min, max),
    vec2(max, max),
    vec2(max, min)];

var vTexCoord;
var texture;

var grassSrc = "http://web.cs.wpi.edu/~jmcuneo/grass.bmp";
var stoneSrc = "http://web.cs.wpi.edu/~jmcuneo/stones.bmp";

//create default texture with given colour
function createTexture(colour){
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([colour[0]*255, colour[1]*255, colour[2]*255, 255]));

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

function configureTexture( image ) {
    //Create a texture object
    texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);

    //Bind it as the current two-dimensional texture
    gl.bindTexture( gl.TEXTURE_2D, texture );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    //Specify the array of the two-dimensional texture elements
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    //Link the texture object we create in the application to the sampler in the fragment shader
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

var grass;
var stone;
var loadImage1 = false;
var loadImage2 = false;

//set image for texturing background
function setImage(){
    stone = new Image();
    stone.crossOrigin = "";
    stone.src = stoneSrc;

    grass = new Image();
    grass.crossOrigin = "";
    grass.src = grassSrc;

    grass.onload = function () {
        loadImage1 = true;
    };
    stone.onload = function () {
        loadImage2 = true;
    };

    createTexture(vec4(0.5, 0.5, 0.5, 1.0));
}