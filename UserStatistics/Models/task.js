export class Taks {

    static TASK = 0;
    static REST = 1;
    static DIVERT = 3;

    constructor (start, end, type) {
        this.start = start;
        this.end = end;
        this.type = type;
    }
}