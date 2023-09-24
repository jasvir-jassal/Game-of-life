import { Cell } from "../models/Cell";

export class CellArray {
    static reduceCells = (cellsNotReduced: Cell[]): Cell[] => {
        return cellsNotReduced.reduce((array: Cell[], item) => {
            let exists = !!array.find(c => c.id === item.id);
            if (!exists) {
                array.push(item);
            }
            return array;
        }, []);
    }
}