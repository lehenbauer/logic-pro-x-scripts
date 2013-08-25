// main script pitchcaster.js
//
// Killer Solos Pitchcaster
//
//

NeedsTimingInfo = true;

var noteCounter = 0;

learner = new Learner();

syntheticKeyboard = new SyntheticKeyboard();

keyTranslations = new SyntheticKeyboard();

function Reset() {
	syntheticKeyboard.reset();
	keyTranslations.reset();
	learner.reset();
}

Reset();

function HandleMIDI(event) {
	if (event instanceof NoteOn) {
		// it's a note on. if we're learning, learn it
		if (GetParameter('Mode') == 0) {
			learner.learn(event.pitch);

			// since we're learning, we're done, just send
			// the event
			event.send();
			return;
		}
	}

	// if it's not a note on or note off, we're done
	if (!(event instanceof NoteOn) && !(event instanceof NoteOff)) {
		event.send();
		return;
	}

	// ok, we're running and it's a note on or note off.

	if (event instanceof NoteOn) {
		if (!ChangeIt()) {
			wantNote = event.pitch;
			logger('keep', wantNote);
		} else {
			wantNote = learner.pick_note();
			logger('new', wantNote);
		}

		while (1) {
			if (!syntheticKeyboard.is_note_on(wantNote)) {
				break;
			}
			wantNote = learner.pick_note();
			logger('repick', wantNote);
		}

		syntheticKeyboard.note_on(wantNote);
		keyTranslations.store(event.pitch, wantNote);

		event.pitch = wantNote;
		event.send();
		return;
	}

	// ok it's a note off
	if (event instanceof NoteOff) {
		logger('>off',event.pitch);
		pitch = keyTranslations.fetch(event.pitch);
		keyTranslations.store(event.pitch,0);
		logger('off',pitch);
		event.pitch = pitch;
		event.send();
		syntheticKeyboard.note_off(pitch);
	}
}

function ChangeIt() {
	return (Math.random() < (GetParameter('Change') / 100.0));
}

function ParameterChanged(param, value) {
	if (param == 0) {
		if (value == 0) {
			learner.reset();
		}

		if (value == 1) {
			// if they turned off learner mode (turned on run mode), 
			// generate the probability vector
			learner.genprobos();
		}
	}
}

var PluginParameters = [
	{name:"Mode", type:'menu', valueStrings:["Learn", "Run"], defaultValue:0},
	{	name:'Change', type:'lin', unit:'percent', 
		minValue:0, maxValue:100, numberOfSteps:100, defaultValue:50},
];


