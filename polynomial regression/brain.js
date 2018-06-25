function Brain() {
	
	var functionDegree = 20;
	var learningRate = 0.15;
	var testInputs;
	var testOutputs;
	var coefficients;
	var totalCoefficients;
	var numCoefficientsInUse;
	var optimizer;
	
	this.initialize = function() {
		this.coefficients = new Array();
		this.totalCoefficients = functionDegree;
		for(var i = 0; i < this.totalCoefficients; i++) {
			this.coefficients.push(tf.variable(tf.scalar(random(-1, 1))));
		}
		
		this.optimizer = tf.train.adam(learningRate);
	}
	
	this.predict = function(x) {
		var xs = tf.tensor1d(x);
		
		var tempArray = new Array();
		for(var i = 0; i < x.length; i++) {
			tempArray.push(0);
		}
		var result = tf.variable(tf.tensor1d(tempArray));
		for(var i = 0; i < this.totalCoefficients; i++) {
			result = result.add(xs.pow(tf.scalar(i)).mul(this.coefficients[i]));
		}
		
		return result;
	}
	
	this.loss = function(prediction, expected) {
		return tf.squaredDifference(prediction, expected).mean();
	}
	
	this.train = function(data) {
		if (data.length <= 0) {
			return;
		}
		
		var xArray = new Array();
		var yArray = new Array();
		for(var i = 0; i < data.length; i++) {
			xArray.push(data[i].x);
			yArray.push(data[i].y);
		}
		this.optimizer.minimize(() => this.loss(this.predict(xArray), tf.tensor1d(yArray)), false, this.coefficients);
	}
}