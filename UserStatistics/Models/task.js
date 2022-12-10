class Task {

    static TASK = 0;
    static REST = 1;
    static DIVERT = 2;

    constructor (name, start, end, type) {
        this.start = start;
        this.end = end;
        this.type = type;
        this.name = name;
    }
}