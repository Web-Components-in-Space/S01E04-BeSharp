import { Chord, Note } from '../musictheory';

export class Question {
    /** chord for question */
    chord = undefined;

    /** answer notes (with potential inversion) */
    notes = [];

    /** answer notes (with potential inversion) */
    lastAttempt = [];

    /** boolean to indicate if order of notes is important */
    enforceOrder = false;

    /** inversion of answer */
    inversion = 0;

    /** question display message */
    questionText = '';

    /** answer display message */
    answerText = '';

    /** inversion label for the user to know what order to play */
    inversionLabel = 'any';

    constructor(bar, possibleinversions) {
        this.chord = new Chord(bar.chord);
        this.notes = this._getNotesWithInversion(this.chord, possibleinversions);
        if (possibleinversions && possibleinversions.length > 0) {
            this.enforceOrder = true;
        }
        if (possibleinversions === undefined) {
            this.questionText = bar.chord;
        }
        if (possibleinversions) {
            this.questionText = `${bar.chord} in ${this.inversionLabel} position`;
        }
    }

    hasCommonality(inputnotes) {
        let inCommon = 0;
        inputnotes.forEach(note => {
            const n = Note.parseNotation(note);
            if (this.notes.indexOf(n.notation) !== -1) {
                inCommon ++;
            }
        });
        return inCommon;
    }

    isCorrect(inputnotes) {
        const nooctave = inputnotes.map(note => note.substr(0, note.length - 1));
        const uniquenooctave = nooctave.filter((v, i, a) => a.indexOf(v) === i);
        this.lastAttempt = uniquenooctave;
        if (uniquenooctave.length < this.notes.length) {
            // check for partial correct and end attempt early if wrong already
            for (let c = 0; c < uniquenooctave.length; c++) {
                if (this.notes.indexOf(uniquenooctave[c]) === -1) {
                    this.answerText = `Sorry, you played ${this.lastAttempt.join(', ')}. The correct answer is ${this.notes.join(', ')}`;
                    return false;
                }
            }
            return undefined;
        }

        if (this.enforceOrder) {
            const correct = this.notes.join(',') === uniquenooctave.join(',');
            this.answerText = correct ? 'Correct!' : `Sorry, you played ${uniquenooctave.join(', ')}. The correct answer is ${this.notes.join(', ')}`;
            return correct;
        } else {
            for (let c = 0; c < uniquenooctave.length; c++) {
                if (this.notes.indexOf(uniquenooctave[c]) === -1) {
                    this.answerText = `Sorry, you played ${this.lastAttempt.join(', ')}. The correct answer is ${this.notes.join(', ')}`;
                    return false;
                }
            }
            this.answerText = 'Correct!'
            return true;
        }
    }

    _getNotesWithInversion(chord, possibleInversions) {
        if (possibleInversions && possibleInversions.length > 0) {
            const randominversion = possibleInversions[Math.floor(Math.random() * possibleInversions.length)];
            this.inversionLabel = `the ${randominversion}`;
            switch (randominversion) {
                case 'root':
                    this.inversion = 0;
                    return chord.inversion(0);

                case 'first':
                    this.inversion = 1;
                    return chord.inversion(1);

                case 'second':
                    this.inversion = 2;
                    return chord.inversion(2);

                case 'third':
                    this.inversion = 3;
                    if (chord.notes.length < 4) {
                        this.inversion = 0;
                        this.inversionLabel = 'the root';
                    }
                    return chord.getInversion(3);
            }
        } else {
            return chord.notes;
        }
    }

}
