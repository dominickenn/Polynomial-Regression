var points;
var radius = 5;
var brain;

function setup() {
	createCanvas(600, 600);
	points = new Array();
	brain = new Brain();
	tf.tidy(() => {
		brain.initialize();
	});
}

function draw() {
	background(0);
	
	if (mouseIsPressed) {
		points.push({x :  map(mouseX, 0, width, -1, 1), y :  map(mouseY, 0, height, 1, -1)});
	} else {		
		tf.tidy(() => {
			brain.train(points);
		});
	}
	showPoints();
	tf.tidy(() => {
		showLine();
	});
}

function showPoints() {
	for (var i = 0; i < points.length; i++) {
		fill(255);
		noStroke();
		let px = map(points[i].x, -1, 1, 0, width);
		let py = map(points[i].y, -1, 1, height, 0);
		ellipse(px, py, radius, radius);
	}
}

function showLine() {
	var curveX = new Array();
	for (var x = -1; x <= 1.01; x += 0.05) {
		curveX.push(x);
	}
	
	var ys = tf.tidy(() => 
		brain.predict(curveX)
	);
	var curveY = ys.dataSync();
	ys.dispose();
	
	beginShape();
	noFill();
	stroke(125, 100, 150);
	strokeWeight(2);
	for(var i = 0; i < curveX.length; i++) {
		let px = map(curveX[i], -1, 1, 0, width);
		let py = map(curveY[i], -1, 1, height, 0);
		vertex(px, py);
	}
	endShape();
}