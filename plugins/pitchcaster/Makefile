
include ../Makefile.inc

RELEASEFILE=$(RELEASEDIR)/killersolos-pitchcaster.txt

BLURB=pitchcaster-blurb.js
PLUGIN=pitchcaster.js

all:	$(RELEASEFILE)

clean:
	rm -f $(RELEASEFILE)

$(RELEASEFILE):	$(BLURB) $(LICENSE) $(LEARNER_CLASS) $(SYNTHETICKEYBOARD_CLASS) $(PLUGIN)
	cat $(BLURB) $(LICENSE) $(LEARNER_CLASS) $(SYNTHETICKEYBOARD_CLASS) $(PLUGIN) >$(RELEASEFILE)

open:
	open $(RELEASEFILE)

