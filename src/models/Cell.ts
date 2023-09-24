export class Cell {
    constructor(x: number, y: number, id: number, enabled: boolean) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.enabled = enabled;
    }

    x: number
    y: number
    id: number
    enabled: boolean
}