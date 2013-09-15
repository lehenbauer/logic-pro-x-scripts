
include ../Makefile.inc

BLURB=pitchcaster2-blurb.js
PLUGIN=pitchcaster2.js
RELEASEFILE=$(RELEASEDIR)/killersolos-pitchcaster2.txt

all:	$(RELEASEFILE)

clean:
	rm -f $(RELEASEFILE)

$(RELEASEFILE):	$(BLURB) $(LICENSE) $(LEARNER_CLASS) $(SYNTHETICKEYBOARD_CLASS) $(PLUGIN)
	cat $(BLURB) $(LICENSE) $(LEARNER_CLASS) $(SYNTHETICKEYBOARD_CLASS) $(PLUGIN) >$(RELEASEFILE)


