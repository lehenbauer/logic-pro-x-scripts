// main script pitchcaster.js
//
// Killer Solos Pitchcaster 2
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
			// learn the pitch modulo 12, in other words strip the octave
			// and normalize all notes between 0 and 11.
			// 0 turns out to be C; the guys who invented MIDI were really smart.
			learner.learn(event.pitch % 12);

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
		var baseNote = event.pitch;
		// decide if we are going to change the note
		if (!ChangeIt()) {
			var wantNote = event.pitch;
			// logger('keep', wantNote);
		} else {
			var wantNote = PickNote(baseNote);
			// logger('new', wantNote);
		}

		var success = 0;
		for (var i = 0; i < 20; i++) {
			if (!syntheticKeyboard.is_note_on(wantNote)) {
				success = 1;
				break;
			}
			wantNote = PickNote(baseNote);
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

// ChangeIt - based on a random number and the change parameter, tell
// us if the note should change (1) or not change (0)
function ChangeIt() {
	return (Math.random() < (GetParameter('Change') / 100.0));
}

// AboveBelow - return 0 if note should be below the base note, 1 if above
function AboveBelow() {
	return (Math.random() < (GetParameter('Below-Above') / 100.0));
}

// PickNote - pick a note
//
// in this case learner.picknote() is only returning values from 0 to 11, so
// we need to look at our above/below parameters and octave parameters to
// come up with a relevant note
function PickNote(baseNote) {
	var wantNote = learner.pick_note();

	if (!AboveBelow()) {
		return baseNote - wantNote;
	} else {
		return baseNote + wantNote;
	}
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
	{	name:'Below-Above', type:'lin', unit:'percent', 
		minValue:0, maxValue:100, numberOfSteps:100, defaultValue:50},
	{	name:'Octave-Affinity', type:'log', unit:'percent', 
		minValue:0, maxValue:100, numberOfSteps:100, defaultValue:50},
];

