// include file synthetickeyboard.js
//
// SyntheticKeyboard class - has methods to turn on and off synthetic keys,
//   and to query to see if a synthetic key is on or not.
//
// Also the fetch and store methods provide a way for arbitrary stuff to
//   be associated with a pitch (like the pitch of another key that the key
//   was translated to)
//
//  define a SyntheticKeyboard object.
//
//  Reset it with the reset method.
//
//  store a value for any pitch using store and fetch it using fetch.
//
//  the convenience functions note_on, note_off, and is_note_on are
//  provided for common use.
//
function SyntheticKeyboard () {
	this.keyboard = new Array(128);

	this.reset();
}

SyntheticKeyboard.prototype.reset = function () {
	for(var i = 1; i <= 128; i++) {
		this.keyboard[i] = 0;
	}
}

SyntheticKeyboard.prototype.store = function (pitch, value) {
	this.keyboard[pitch] = value;
}

SyntheticKeyboard.prototype.fetch = function (pitch) {
	return this.keyboard[pitch];
}


SyntheticKeyboard.prototype.note_on = function (pitch) {
	this.store(pitch,1);
}

SyntheticKeyboard.prototype.note_off = function (pitch) {
	this.store(pitch,0);
}

SyntheticKeyboard.prototype.is_note_on = function (pitch) {
	return this.fetch(pitch);
}


