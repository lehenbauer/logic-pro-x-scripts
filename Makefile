
all:	release/killersolos-pitchcaster.txt release/killersolos-humandoubler.txt

release/killersolos-pitchcaster.txt:	learner-class.js synthetickeyboard.js pitchcaster.js
	cat learner-class.js synthetickeyboard.js pitchcaster.js >release/killersolos-pitchcaster.txt


release/killersolos-humandoubler.txt:	humandoubler.js
	cat humandoubler.js >release/killersolos-humandoubler.txt
