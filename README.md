logic-pro-x-scripts
===================

Scripter plug-in scripts for Logic Pro X

Logic Pro X has an exciting new capability, the Scripter plug-in, which provides a way to write scripts that can manipulate and create MIDI data in realtime.

There's a MIDI plugin, now, in the channel strip, so any or all MIDI channels can have scripts active that are doing things to the MIDI data streams.

The technology is a little basic as far as developer infrastructure is concerned, like the save format that Logic uses has some binary doodads and it doesn't have a way to include files.

I've already got like three class libraries that are gonna get used for a number of scripts I have in mind, so I went ahead and made the files reasonable and then use a makefile to cat them together to produce the file that can be copied and pasted into Logic's script editor and then saved as a project or a patch in the library or whatever.

