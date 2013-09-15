// main script pitchcaster.js
//
// Killer Solos Pitchcaster
//
//

NeedsTimingInfo = true;

var noteCounter = 0;

var minNotesToLearn = 4;

var learner = new Learner();

var syntheticKeyboard = new SyntheticKeyboard();

var keyTranslations = new SyntheticKeyboard();

function Reset() {
	Trace('big Reset invoked');
	syntheticKeyboard.reset();
	keyTranslations.reset();
}

Reset();

function HandleMIDI(event) {
	var mode = GetParameter('Mode');

	// if in learn mode and it's a note on, learn it.
	// also if it's not in learn mode but it has learned less
	//   than 4 notes, learn it
	if (event instanceof NoteOn) {
		if (mode === 0 || learner.uniqueNotesLearned < minNotesToLearn) {
			learner.learn(event.pitch);

			// if it's not in learn mode and it now knows minNotesToLearn notes,
			// generate the probability vector
			if (mode != 0 && learner.uniqueNotesLearned == minNotesToLearn) {
				learner.genprobos();
				Trace('generated probos due to minNotesToLearn');
			}
		}
	}

	// if in Learn or Standby or it's in Run but hasn't learned at least
	// minNotesToLearn notes, send the event downstream and we're done
	if ((mode === 0) || (learner.uniqueNotesLearned < minNotesToLearn)) {
		event.send();
		return;
	}

	// OK, we're in run mode.
	// if it's not a note on or note off, send it along and we're done
	if (!(event instanceof NoteOn) && !(event instanceof NoteOff)) {
		event.send();
		return;
	}

	// ok, we're running and we know it's a note on or note off.

	if (event instanceof NoteOn) {
		// decide if we are going to change the note
		if (!ChangeIt()) {
			var wantNote = event.pitch;
			// logger('keep', wantNote);
		} else {
			var wantNote = learner.pick_note();
			// logger('new', wantNote);
		}

		var success = 0;
		for (var i = 0; i < 20; i++) {
			if (!syntheticKeyboard.is_note_on(wantNote)) {
				success = 1;
				break;
			}
			wantNote = learner.pick_note();
			// logger('repick', wantNote);
		}

		// if we tried and tried and never found a playable note, bail
		// NB not sure about this
		if (!success) {
			return;
		}

		// we picked the note, keep track of the translation
		syntheticKeyboard.note_on(wantNote);
		keyTranslations.store(event.pitch, wantNote);

		event.pitch = wantNote;
		event.send();
		return;
	}

	// ok it's a note off, translate it to what we translated it to,
	// which may be the same as what we start with, send a note off
	// for that, and clear the note on the synthetic keyboard
	if (event instanceof NoteOff) {
		// logger('>off',event.pitch);
		var pitch = keyTranslations.fetch(event.pitch);
		keyTranslations.store(event.pitch,0);
		// logger('off',pitch);
		event.pitch = pitch;
		event.send();
		syntheticKeyboard.note_off(pitch);
	}
}

function ChangeIt() {
	return (Math.random() < (GetParameter('Change') / 100.0));
}

function ParameterChanged(param, value) {
	Trace('parameter ' + param + ' changed to ' + value);
	if (param === 0) {
		if (value === 0) {
			learner.reset();
		}

		// if transitioned to standby or run, they might ended learn mode,
		// generate the probably vector
		if (value > 0) {
			// if they turned off learner mode (turned on run mode), 
			// generate the probability vector
			learner.genprobos();
			Trace('generated probos');
		}
	}
}

var PluginParameters = [
	{name:"Mode", type:'menu', valueStrings:["Learn", "Run"], defaultValue:0},
	{	name:'Change', type:'lin', unit:'percent', 
		minValue:0, maxValue:100, numberOfSteps:100, defaultValue:50},
];


