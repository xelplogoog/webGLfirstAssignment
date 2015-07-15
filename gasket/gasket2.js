"use strict";

var canvas;
var gl;
var divisionsElement;
var degreesElement;
var program;
var points = [];

window.onload = function()
{
    canvas = document.getElementById( "gl-canvas" );
	degreesElement = document.getElementById("degrees");
	divisionsElement = document.getElementById("divisions");

    init();
}

function init() {
	gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	run();
}

function run() {
	devide(parseInt(divisionsElement.value));
	
	var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	var uDegree = gl.getUniformLocation(program, "uDegree");
	gl.uniform1f(uDegree, (parseFloat(degreesElement.value)));
	
    render();
};

function onCanged() {
	run();
}

function devide(number) {
	points = [];
	var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    divideTriangle( vertices[0], vertices[1], vertices[2], number);
					
	var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
}

function divideTriangle( a, b, c, count)
{
    // check for end of recursion
    if ( count === 0 ) {
        points.push( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
		
		// center triangle
		divideTriangle( ab, bc, ac, count );
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
