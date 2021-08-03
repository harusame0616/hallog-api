import { ValidationError } from "../error/validation-error";

export class Pagination {
    readonly size: number;
    readonly index: number;
    constructor(size: number, index: number) {
        if (size < 1) {
            throw new ValidationError('sizeは1以上です');
        }

        if (index < 0) {
            throw new ValidationError('indexは0以上です')
        }

        this.size = size;
        this.index = index;
    }

    get skip() {
        return this.size * this.index;
    }
}
