import React, { useState } from 'react'
import { Cell } from '../../models/Cell';
import { CellArray } from '../../utils/CellArrayUtiity';
import './grid.css';

const Grid: React.FC = () => {
    const [buttonEnabled, setButtonEnabled] = useState<boolean>(false)
    let [cells, setCells] = useState<Cell[]>([])
    let [gameIntervalId, setGameIntervalId] = useState<any>(1)
    let [count, setCount] = useState<number>(0)

    const CELL_WIDTH = 32;

    const rows = Math.floor(window.innerWidth / CELL_WIDTH);
    const columns = Math.floor(window.innerHeight / CELL_WIDTH);
    
    const initializeCells = () => {
        let id = 0;
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                cells.push(new Cell(i, j, id++, false))
            }
        }
    }

    const startGame = () => {
        setGameIntervalId(setInterval(() => {
            let newCells: Cell[] = [];
            let firstEnabledCell = cells.find(c => c.enabled) as Cell;
            let cellsReversed = [...cells].reverse();
            let lastEnabledCell = cellsReversed.find(c => c.enabled) as Cell;

            if (firstEnabledCell && lastEnabledCell) {
                for (let i = firstEnabledCell?.id; i <= lastEnabledCell?.id; i++) {
                    let found = cells.find(c => c.id === i);
                    if (found && found.enabled) {
                        let neighboursCells = countNeighboursCells(found);

                        if (neighboursCells === 0 || neighboursCells === 1 || neighboursCells >= 4) {
                            newCells.push(new Cell(found.x, found.y, found.id, false));
                        }
                    }
                }

                let previousCell = cells.find(c => c.x === (firstEnabledCell?.x - 1 <= 0 ? 0 : firstEnabledCell?.x - 1) && c.y === (firstEnabledCell?.y - 1 <= 0 ? 0 : firstEnabledCell?.y - 1));
                let nextCell = cells.find(c => c.x === lastEnabledCell?.x + 1 && c.y === lastEnabledCell?.y + 1);
                if (previousCell && nextCell) {
                    for (let i = previousCell?.id; i <= nextCell?.id; i++) {
                        let found = cells.find(c => c.id === i);
                        if (found && !found.enabled) {
                            let neighboursCells = countNeighboursCells(found);

                            if (neighboursCells !== 3) {
                                continue;
                            }

                            newCells.push(new Cell(found.x, found.y, found.id, true));
                        }
                    }
                }

                newCells.forEach(cell => {
                    let found = cells.find(c => c.id === cell.id);
                    if (found) {
                        found.enabled = cell.enabled;
                    }
                });
                
                if (newCells) {
                    setCount(count++)
                }
                
                setCells(cells);
                
                cells = CellArray.reduceCells(cells)
            }
        }, 500))
    }

    const stopGame = () => {
        clearInterval(gameIntervalId)
    }

    const countNeighboursCells = (cell: Cell): number => {
        return findNeighbourCell(cell.x - 1, cell.y - 1) +
            findNeighbourCell(cell.x, cell.y - 1) +
            findNeighbourCell(cell.x + 1, cell.y - 1) +
            findNeighbourCell(cell.x - 1, cell.y) +
            findNeighbourCell(cell.x + 1, cell.y) +
            findNeighbourCell(cell.x - 1, cell.y + 1) +
            findNeighbourCell(cell.x, cell.y + 1) +
            findNeighbourCell(cell.x + 1, cell.y + 1);
    }

    const findNeighbourCell = (x: number, y: number): number => {
        let found = cells.find(c => c.x === x && c.y === y);
        if (found && found.enabled) {
            return 1;
        }
        return 0;
    }
    
    const enableCell = (cell: Cell) => {
        let newCell = cells.find(c => c.id === cell.id);
        if (newCell) {
            newCell.enabled = !cell.enabled;
            setCells([...cells, newCell]);
        }
    }

    const renderGrid = () => {
        cells = CellArray.reduceCells(cells)

        return (
            <div className="grid-container">
                {cells.map((cell, index) => {
                    return <div key={index} onClick={() => enableCell(cell)}>
                        {cell.enabled ? <div className="cellEnabled"></div> : <div className="cellDisabled"></div>}
                    </div>
                })}
            </div>
        )
    }

    initializeCells();

    return (
        <>
            <div>{renderGrid()}</div>
            {buttonEnabled
                ? <button className="stopButton" onClick={() => { setButtonEnabled(false); stopGame(); }}>STOP</button>
                : <button className="startButton" onClick={() => { setButtonEnabled(true); startGame(); }}>START</button>}
            <button className="clearButton" onClick={()=> window.location.reload()}>RESET</button>
            <div className="countText">GENERATION: {count}</div>
        </>
    )
}

export default Grid
