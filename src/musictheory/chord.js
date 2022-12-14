import { ChordConstants } from './chordconstants';
import { Note } from './note.js';

/**
 * chord constructor
 * @constructor
 * @param {number} sampleRate
 * @param {string} notation
 */
export class Chord {
    constructor(notation, octave) {
        /** @type {string} root note of chord */
        this._root = "C";

        /** octave of root */
        if (octave) {
            this._rootOctave = octave;
        } else {
            this._rootOctave = null;
        }

        /** @type {string} chord notation */
        this._notation = notation ? notation : "Cmaj";

        /** @type {Array.<string>} notes in built chord */
        this._notes = [];
        this.buildChord();
        this._root = this._notes[0];
    }

    inversionNotation(num) {
        if (num === 0) {
            return this.notation + (this.rootOctave ? this.rootOctave : '');
        }
        const possibleOctave = this._notes[0].charAt(this._notes.length - 2);
        const rootOctave = possibleOctave == Number(possibleOctave) ? possibleOctave : undefined;
        // strip octaves if present
        const inversion = rootOctave ? this.notes.slice().map(note => note.substr(0, note.length - 1)) : this.notes.slice();
        return this.notation + (this.rootOctave ? this.rootOctave : '') + '/' + inversion[num];
    }

    /**
     * get chord inversion
     * @param inversion
     *
     * @return {Array.<string>} notes
     */
    inversion(num) {
        const possibleOctave = this._notes[0].charAt(this._notes.length - 2);
        const rootOctave = possibleOctave == Number(possibleOctave) ? possibleOctave : undefined;

        // strip octaves if present
        const inversion = rootOctave ? this.notes.slice().map(note => note.substr(0, note.length - 1)) : this.notes.slice();

        for (let c = 0; c < num; c ++) {
            const result = inversion.shift();
            inversion.push(result);
        }

        let positionInScale;
        let octave = rootOctave;
        if (rootOctave) {
            inversion.forEach((note, index) => {
                if (!positionInScale) {
                    positionInScale = Note.sharpNotations.indexOf(inversion[index]);
                } else {
                    if (positionInScale > Note.sharpNotations.indexOf(inversion[index])) {
                        octave ++;
                    }
                    positionInScale = Note.sharpNotations.indexOf(inversion[index]);
                }
                inversion[index] += octave;
            });
        }
        return inversion;
    }

    /**
     * get notes from built chords
     *
     * @return {Array.<string>} notes
     */
    get notes() {
        return this._notes;
    }

    /**
     * notation getter
     * @return {string|*}
     */
    get notation() {
        return this._notation;
    }

    /**
     * chord notation setter
     *
     * @param {string} notation
     */
    set notation(value) {
        this._notation = value;
        this.buildChord();
    }

    /**
     * root note setter
     *
     * @param {string} root
     */
    set root(value) {
        this._root = value;
        this.buildChord();
    }

    /**
     * root note getter
     *
     * @return {string} root note
     */
    get root() {
        return this._root;
    }

    /**
     * root octave setter
     *
     * @param {number} octave
     */
    set rootOctave(value) {
        this._rootOctave = value;
        this.buildChord();
    }

    /**
     * root octave getter
     *
     * @return {number} root octave
     */
    get rootOctave() {
        return this._rootOctave;
    }

    /**
     * get notes in major triad
     *
     * @param {string} major triad root note
     * @param {number} major triad root octave
     * @return {Array.<string>} notes
     */
    majorTriad(root, rootOctave) {
        return this.getStandardNotesInChordMakeup(root, true, false, rootOctave).slice(0,3);
    }

    /**
     * get notes in minor triad
     *
     * @param {string} minor triad root note
     * @param {number} minor triad root octave
     * @return {Array.<string>} notes
     */
    minorTriad(root, rootOctave) {
        return this.getStandardNotesInChordMakeup(root, false, false, rootOctave).slice(0,3);
    }

    /**
     * get notes in seventh chord
     *
     * @param {string} seventh chord root note
     * @param {number} seventh chord root octave
     * @return {Array.<string>} notes
     */
    seventh(root, rootOctave) {
        return this.getStandardNotesInChordMakeup(root, true, false, rootOctave).slice(0,4);
    }

    /**
     * get notes in major seventh chord
     *
     * @param {string} major seventh chord root note
     * @param {number} major seventh chord root octave
     * @return {Array.<string>} notes
     */
    majorSeventh(root, rootOctave) {
        return this.getStandardNotesInChordMakeup(root, true, true, rootOctave).slice(0,4);
    }

    /**
     * get notes in minor seventh chord
     *
     * @param {string} minor seventh chord root note
     * @param {number} minor seventh chord root octave
     * @return {Array.<string>} notes
     */
    minorSeventh(root, rootOctave) {
        return this.getStandardNotesInChordMakeup(root, false, false, rootOctave).slice(0,4);
    }

    /**
     * get notes in ninth chord
     *
     * @param {string} ninth chord root note
     * @param {number} ninth chord root octave
     * @return {Array.<string>} notes
     */
    ninth(root, rootOctave) {
        return this.getStandardNotesInChordMakeup(root, true, false, rootOctave).slice(0,5);
    }

    /**
     * get notes in major ninth chord
     *
     * @param {string} major ninth chord root note
     * @param {number} major ninth chord root octave
     * @return {Array.<string>} notes
     */
    majorNinth(root, rootOctave) {
        return this.getStandardNotesInChordMakeup(root, true, false, rootOctave).slice(0,5);
    }

    /**
     * get notes in minor ninth chord
     *
     * @param {string} minor ninth chord root note
     * @param {number} minor ninth chord root octave
     * @return {Array.<string>} notes
     */
    minorNinth(root, rootOctave) {
        return this.getStandardNotesInChordMakeup(root, false, false, rootOctave).slice(0,5);
    }

    /**
     * get notes in eleventh chord
     *
     * @param {string} eleventh chord root note
     * @param {number} eleventh chord root octave
     * @return {Array.<string>} notes
     */
    eleventh(root, rootOctave) {
        return this.getStandardNotesInChordMakeup(root, true, false, rootOctave).slice(0,6);
    }

    /**
     * get notes in major eleventh chord
     *
     * @param {string} major eleventh chord root note
     * @param {number} major eleventh chord root octave
     * @return {Array.<string>} notes
     */
    majorEleventh(root, rootOctave) {
        return this.getStandardNotesInChordMakeup(root, true, false, rootOctave).slice(0,6);
    }

    /**
     * get notes in minor eleventh chord
     *
     * @param {string} minor eleventh chord root note
     * @param {number} minor eleventh chord root octave
     * @return {Array.<string>} notes
     */
    minorEleventh(root, rootOctave) {
        return this.getStandardNotesInChordMakeup(root, false, false, rootOctave).slice(0,6);
    }

    /**
     * get notes in thirteenth chord
     *
     * @param {string} thirteenth chord root note
     * @param {number} thirteenth chord root octave
     * @return {Array.<string>} notes
     */
    thirteenth(root, rootOctave) {
        return this.getStandardNotesInChordMakeup(root, true, false, rootOctave).slice(0,7);
    }

    /**
     * get notes in major thirteenth chord
     *
     * @param {string} major thirteenth chord root note
     * @param {number} major thirteenth chord root octave
     * @return {Array.<string>} notes
     */
    majorThirteenth(root, rootOctave) {
        return this.getStandardNotesInChordMakeup(root, true, false, rootOctave).slice(0,7);
    }

    /**
     * get notes in minor thirteenth chord
     *
     * @param {string} minor thirteenth chord root note
     * @param {number} minor thirteenth chord root octave
     * @return {Array.<string>} notes
     */
    minorThirteenth(root, rootOctave) {
        return this.getStandardNotesInChordMakeup(root, false, false, rootOctave).slice(0,7);
    }


    /**
     * get notes in sixth chord
     *
     * @param {string} sixth chord root note
     * @param {number} sixth chord root octave
     * @return {Array.<string>} notes
     */
    sixth(root, rootOctave) {
        var keySig = Note.notesInKeySignature(root, true, rootOctave);
        var keys = [];
        keys.push(keySig[0], keySig[2], keySig[4], keySig[5]);
        return keys;
    }

    /**
     * get notes in minor sixth chord
     *
     * @param {string} minor sixth chord root note
     * @param {number} minor sixth chord root octave
     * @return {Array.<string>} notes
     */
    minorSixth(root, rootOctave) {
        var keySig = Note.notesInKeySignature(root, false, rootOctave);
        var keys = [];
        keys.push(keySig[0], keySig[2], keySig[4], keySig[5]);
        return keys;
    }

    /**
     * sustain chord
     *
     * @param {string} sustain root note
     * @param {string} direction to sustain
     * @return {Array.<string>} notes
     */
    sustain(notes, sus) {
        sus = (sus == undefined) ? 4 : sus;
        // grab the third in the chord
        var third = notes[1];
        var notations = Note.sharpNotations;
        var thirdIndex = Note.sharpNotations.indexOf(third);
        if (thirdIndex == -1) {
            notations = Note.flatNotations;
            thirdIndex = Note.flatNotations.indexOf(third);
        }

        if (sus==2) {
            // lower the third one half step
            if (thirdIndex-1 < 0) {
                notes[1] = notations[notations.length-1];
            } else {
                notes[1] = notations[thirdIndex-1];
            }
        } else { // assume sus == 4
            // raise the third one half step
            if (thirdIndex+1 >= notations.length) {
                notes[1] = notations[0];
            } else {
                notes[1] = notations[thirdIndex+1];
            }
        }
        return notes;
    }

    /**
     * augment chord
     *
     * @param {Array.<string>} notes
     * @return {Array.<string>} notes
     */
    augment(notes) {
        // grab the fifth in the chord
        var fifth = notes[2];
        var notations = Note.sharpNotations;
        var fifthIndex = Note.sharpNotations.indexOf(fifth);
        if (fifthIndex == -1) {
            notations = Note.flatNotations;
            fifthIndex = Note.flatNotations.indexOf(fifth);
        }

        // raise the fifth one half step
        if (fifthIndex+1 >= notations.length) {
            notes[2] = notations[0];
        } else {
            notes[2] = notations[fifthIndex+1];
        }
        return notes;
    }

    /**
     * get all standard notes in a chord, from triad to thirteenth
     *
     * @param {string} root note
     * @param {boolean} major key (true/false)
     * @param {boolean} major chord (true/false)
     * @param {number} root octave
     * @return {Array.<string>} notes array
     */
    getStandardNotesInChordMakeup(root, majorKey, majorChord, octave) {
        majorKey = (majorKey == undefined) ? true : majorKey;
        majorChord = (majorChord == undefined) ? false : majorChord;

        var majKeySig = Note.notesInKeySignature(root, true, octave);
        var minKeySig = Note.notesInKeySignature(root, false, octave);

        // grab the next octave if we need it
        var majKeySig2 = Note.notesInKeySignature(root, true, octave+1);
        var minKeySig2 = Note.notesInKeySignature(root, false, octave+1);
        var notes;
        if (majorKey && majorChord) {
            // C Major Seventh for example
            notes = [ majKeySig[0], majKeySig[2], majKeySig[4], majKeySig[6], majKeySig2[1], majKeySig2[3] ];
        } else if (!majorKey && majorChord) {
            // C Minor Seventh for example
            notes = [ minKeySig[0], minKeySig[2], minKeySig[4], minKeySig[6], minKeySig2[1], minKeySig2[3] ];
        } else if (majorKey && !majorChord) {
            // C Seventh for example
            notes = [ majKeySig[0], majKeySig[2], majKeySig[4], minKeySig[6], majKeySig2[1], minKeySig2[3] ];
        } else if (!majorKey && !majorChord) {
            // C Seventh for example
            notes = [ majKeySig[0], minKeySig[2], majKeySig[4], minKeySig[6], majKeySig2[1], minKeySig2[3] ];
        }
        return notes;
    }

    /**
     * convert notation to note list
     *
     * @param {string} notation
     * @param {boolean} use the octave in the notation
     * @return {Array.<string>} note list
     */
    notesFromChordNotation(notation, octave) {
        var root;
        var major = 0;
        var chordType;

        // find root
        if (notation.charAt(1) == "#" || notation.charAt(1) == "b") {
            root = notation.substring(0, 2);
            notation = notation.substring(2);
        } else {
            root = notation.substring(0, 1);
            notation = notation.substring(1);
        }

        // major or minor? (3 states - 1 is on, -1 is off, 0 is unspecified)
        if ( notation.substr(0, 3) == "maj") {
            major = 1;
            notation = notation.substring(3);
        } else if (notation.substr(0, 1) == "m") {
            major = -1;
            notation = notation.substring(1);
        }

        // set chord type
        if ( notation.charAt(0) == "6" ) {
            if (major == -1) {
                chordType = ChordConstants.MINOR_SIXTH;
            } else {
                chordType = ChordConstants.SIXTH;
            }
            notation = notation.substring(2);
        } else if ( notation.charAt(0) == "7" ) {
            if (major == 0) {
                chordType = ChordConstants.SEVENTH;
            } else if (major == 1) {
                chordType = ChordConstants.MAJOR_SEVENTH;
            } else if (major == -1) {
                chordType = ChordConstants.MINOR_SEVENTH;
            }
            notation = notation.substring(1);
        } else if ( notation.charAt(0) == "9" ) {
            if (major == 0) {
                chordType = ChordConstants.NINTH;
            } else if (major == 1) {
                chordType = ChordConstants.MAJOR_NINTH;
            } else if (major == -1) {
                chordType = ChordConstants.MINOR_NINTH;
            }
            notation = notation.substring(1);
        } else if ( notation.substr(0,2) == "11" ) {
            chordType = ChordConstants.ELEVENTH;
            notation = notation.substring(2);
        } else if ( notation.substr(0,2) == "13" ) {
            chordType = ChordConstants.THIRTEENTH;
            notation = notation.substring(2);
        } else {
            if (major == 1 || major == 0) {
                chordType = ChordConstants.MAJOR_TRIAD;
            } else {
                chordType = ChordConstants.MINOR_TRIAD;
            }
        }
        var notes = this.notesFromChordType(chordType, root, octave);

        // modify note set if needed
        var mod = notation;
        switch ( mod.substr(0,3) ) {
            case ChordConstants.AUGMENTED:
                notes = this.augment(notes);
                break;

            case ChordConstants.DIMINISHED:
                // to do
                break;

            case ChordConstants.SUSTAIN:
                var param = parseInt(mod.charAt(3));
                notes = this.sustain(notes, param);
                break;
        }

        return notes;
    }

    /**
     * get notes from chord types
     *
     * @param {string} type
     * @param {string} chord root
     * @return {Array.<string>} notes
     */
    notesFromChordType(type, root, rootOctave) {
        switch ( type ) {
            case ChordConstants.SIXTH:
                return this.sixth(root, rootOctave);

            case ChordConstants.MINOR_SIXTH:
                return this.minorSixth(root, rootOctave);

            case ChordConstants.SEVENTH:
                return this.seventh(root, rootOctave);

            case ChordConstants.MINOR_SEVENTH:
                return this.minorSeventh(root, rootOctave);

            case ChordConstants.MAJOR_SEVENTH:
                return this.majorSeventh(root, rootOctave);

            case ChordConstants.NINTH:
                return this.ninth(root, rootOctave);

            case ChordConstants.MINOR_NINTH:
                return this.minorNinth(root, rootOctave);

            case ChordConstants.MAJOR_NINTH:
                return this.majorNinth(root, rootOctave);

            case ChordConstants.ELEVENTH:
                return this.eleventh(root, rootOctave);

            case ChordConstants.THIRTEENTH:
                return this.thirteenth(root, rootOctave);

            case ChordConstants.MAJOR_TRIAD:
                return this.majorTriad(root, rootOctave);

            case ChordConstants.MINOR_TRIAD:
                return this.minorTriad(root, rootOctave);

            default:
                return this.majorTriad(root, rootOctave);
        }
    }

    /**
     * build the chord given the parameters set in this class
     */
    buildChord() {
        this._notes = [];
        var notations = this.notesFromChordNotation(this._notation, this._rootOctave);
        for (var c = 0; c < notations.length; c++) {
            this._notes.push(notations[c]);
        }
    }
}