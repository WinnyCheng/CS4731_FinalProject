// for drawing the sphere
var numTimesToSubdivide = 5;
var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
var index = 0;


var a = 22.0; //half the length of the square plane
var planeArray = [
    vec4(-a, -a, 0.0, 1.0),
    vec4(-a, a, 0.0, 1.0),
    vec4(a, a, 0.0, 1.0),
    vec4(a, -a, 0.0, 1.0)];


//helper function get the vertices need for a cube
function quad(a, b, c, d) {
    var verts = [];
    var vertices = [
        vec4(-1.0, -1.0, 1.0, 1.0),
        vec4(-1.0, 1.0, 1.0, 1.0),
        vec4(1.0, 1.0, 1.0, 1.0),
        vec4(1.0, -1.0, 1.0, 1.0),
        vec4(-1.0, -1.0, -1.0, 1.0),
        vec4(-1.0, 1.0, -1.0, 1.0),
        vec4(1.0, 1.0, -1.0, 1.0),
        vec4(1.0, -1.0, -1.0, 1.0)
    ];
    var indices = [a, b, c, a, c, d];
    var ver;

    for (var i = 0; i < indices.length; ++i){
        ver = vertices[indices[i]];
        verts.push(ver);
    }

    return verts;
}

//returns a list of points used to draw a cube
function cube(){
    var verts = [];
    verts = verts.concat(quad( 1, 0, 3, 2 ));
    verts = verts.concat(quad( 2, 3, 7, 6 ));
    verts = verts.concat(quad( 3, 0, 4, 7 ));
    verts = verts.concat(quad( 6, 5, 1, 2 ));
    verts = verts.concat(quad( 4, 5, 6, 7 ));
    verts = verts.concat(quad( 5, 4, 0, 1 ));
    return verts;
}

//divides triangles for a smoother/rounder surface of a sphere
function divideTriangle(a, b, c, count){
    if ( count > 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        pointsArray.push(a);
        pointsArray.push(c);
        pointsArray.push(b);

        // normals are vectors

        gourandNormal.push(a[0],a[1], a[2], 0.0);
        gourandNormal.push(c[0],c[1], c[2], 0.0);
        gourandNormal.push(b[0],b[1], b[2], 0.0);

        index += 3;
    }
}

//creates a sphere and store all its points in an array
function sphere(a, b, c, d, n){
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

//recalculates sphere points and calculates new normals
function resetSphere(){
    pointsArray = [];
    normalsArray = [];
    gourandNormal = [];

    sphere(va, vb, vc, vd, numTimesToSubdivide);

    //calculate normals for flat shading
    normalsArray = calcNormal(pointsArray);

    if(!animate)
        render();
}


