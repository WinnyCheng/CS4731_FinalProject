var points;

var gl;
var program;

var mvMatrix, pMatrix;
var modelView, projection;

var pointsArray;
var normalsArray;   //normals for the sphere per face
var normalsArray2;  //normals for the cube per face
var gourandNormal;   //normals for sphere per vertex
var gourandNormal2;  //normals for cube per vertex
var smoothShading = true;   //Gouraud Shading if true, flat shading if false



var cubeVer;  //Vertices to draw a cube

var stack = [];

//for rotation
var theta = 0; //first level
var alpha = 0; //second level
var omega = 0; //third level

