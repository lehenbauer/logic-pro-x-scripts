// main script humandoubler.js
//
// Killer Solos Human Doubler
//
//

NeedsTimingInfo = true;

function Reset() {
}

function HandleMIDI(event) {
	// if it's not a note, don't randomize it, this can end up with
	// pitches out of order, which leaves the last pitch not centered.
	if (!event instanceof Note) {
		event.send();
		return;
	]

	var delay = GetParameter('Delay');
	var wobble = GetParameter('Wobble');

	var thisDelay = delay + (Math.random() * 2 * wobble) - wobble;
	if (thisDelay < 0) {
		thisDelay = 0;
	}

	event.sendAfterMilliseconds(thisDelay);
}

var PluginParameters = [
	{name:'Delay', type:'lin', unit:'ms', minValue:0, maxValue:100,numberOfSteps:100,defaultValue:10},
	{	name:'Wobble', type:'lin', unit:'ms', 
		minValue:0, maxValue:50, numberOfSteps:50, defaultValue:5},
];


