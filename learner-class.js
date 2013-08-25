// include file learner-class.js
//
// Copyright © 2013 Karl Lehenbauer.  All Rights Reserved.
//   
// Released to the public under the Berkeley copyright.
//
// Redistribution and use, with or without modification, is permitted
// provided the copyright notice is maintained.
//
// see the LICENSE file for details
//

//
// Learner class
//
// invoke learn method repeatedly with pitches and the Learner class will
//  count them, learning what notes were struck and how often
//
// Creating an instance of the Learner class also instances an instance of
//  the ProbabilityVector class, which Learner's genprobos method will load
//  up with an object for each note played during the learning period, with
//  the note numbers augmented by the count of that note and a ratio that
//  is used for randomly picking notes with the same distribution.
//
//  the pick_note() method of the ProbabilityVector class, once the Learner
//   and learned and its knowledge passed to the ProbabilityVector, will return
//   random note numbers distributed at about the same rate as during the
//   learning period.
//
function Learner() {
	this.keyboard = new Array(128);
	this.reset();

	this.probo = new ProbabilityVector();
}

Learner.prototype.reset = function() {
	for (var i = 1; i <= 128; i++) {
		this.keyboard[i] = 0;
	}
	this.notesLearned = 0;
	this.uniqueNotesLearned = 0;
}

// learn - learn a note
Learner.prototype.learn = function (pitch) {
	if (this.keyboard[pitch] == 0) {
		this.uniqueNotesLearned++;
	}
	this.keyboard[pitch]++;
	this.notesLearned++;
}

// sum - calculate the number of notes learned
Learner.prototype.sum = function () {
	var sum = 0;
	for (var i = 1; i <= 128; i++) {
		sum += this.keyboard[i];
	}
	return(sum);
}

// genprobos - generate data into the probability vector
Learner.prototype.genprobos = function () {
	this.probo.reset();

	// find all the keys that had notes played on them
	// and stick them into the probability vector object
	// we created when we were instantiated
	for (var i = 1; i <= 128; i++) {
		if (this.keyboard[i] == 0) {
			continue;
		}

		this.probo.addprobo(i, this.keyboard[i]);
	}

	this.probo.calc_ratios();
}

// pick_note - helper function to simplify invoking the pick_note 
// function of the probability ector
Learner.prototype.pick_note = function () {
	return this.probo.pick_note();
}

//
// ProbabilityVector class
//
//  invoke addprobo method with note numbers and counts for each note
//
//  invoke calc_ratios() to prep it
//
//  invoke pick_note() to get note numbers
//

function ProbabilityVector() {
	this.reset();
}

// reset - clear the probability vector
ProbabilityVector.prototype.reset = function () {
	this.vector = [];
	this.sum = 0;
}

// sum - get a note count of learned notes from the probability vector
ProbabilityVector.prototype.sum = function () {
	for (var i = 0, sum = 0; i < this.vector.length; i++) {
		sum += this.vector[i].count;
	}
	return (sum);
}

// create an object with a note and count and push it onto the vector
ProbabilityVector.prototype.addprobo = function (note, count) {
	var probo = new Object();

	probo.note = note;
	probo.count = count;
	this.vector.push(probo);
	this.sum += count;
}

// calc_ratios - run through each note object in the probability vector
// and add a ratio element that transits 0.0 to 1.0
// for each note's probability of being chosen
ProbabilityVector.prototype.calc_ratios = function () {
	var sofar = 0.0;

	for (var i = 0; i < this.vector.length; i++) {
		sofar += (this.vector[i].count / this.sum);
		this.vector[i].ratio = sofar;
	}
}

// pick_note - pick a note following the desired distribution
ProbabilityVector.prototype.pick_note = function () {
	var wantRatio = Math.random();

	// logger('wantRatio', wantRatio);

	for (var i = 0; i < this.vector.length; i++) {
		// logger('this ratio', this.vector[i].ratio);
		if (wantRatio < this.vector[i].ratio) {
			return this.vector[i].note;
		}
	}
}

logger = function (string1, string2) {
	return;
	s = new String();

	Trace(s.concat(string1, ":", string2));
}


// vim: set ts=4 sw=4 sts=4 noet :

if (0) {
x = new ProbabilityVector();

x.addprobo(60,1);
x.addprobo(61,3);
x.addprobo(65,5);
x.addprobo(71,1);
x.addprobo(73,6);
x.addprobo(79,2);

x.calc_ratios();
}
