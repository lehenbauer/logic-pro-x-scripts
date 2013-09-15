
include ../Makefile.inc

RELEASEFILE=$(RELEASEDIR)/killersolos-pitchcaster.txt

all:	$(RELEASEFILE)

clean:
	rm -f $(RELEASEFILE)

$(RELEASEFILE):	pitchcaster-blurb.js $(LICENSE) $(LEARNER_CLASS) $(SYNTHETICKEYBOARD_CLASS) pitchcaster.js
	cat pitchcaster-blurb.js $(LICENSE) $(LEARNER_CLASS) $(SYNTHETICKEYBOARD_CLASS) pitchcaster.js >$(RELEASEFILE)


