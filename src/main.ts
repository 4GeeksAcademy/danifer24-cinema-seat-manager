type SeatMatrix = number[][];

function initializeSeatMatrix(rows = 8, columns = 10): SeatMatrix {
  // 0 = libre, 1 = ocupado
  const matrix: SeatMatrix = [];

  for (let row = 0; row < rows; row += 1) {
    const rowSeats: number[] = [];

    for (let column = 0; column < columns; column += 1) {
      rowSeats.push(0);
    }

    matrix.push(rowSeats);
  }

  return matrix;
}

function printRoomStatus(seats: SeatMatrix): void {
  if (seats.length === 0 || seats[0].length === 0) {
    console.log("La sala no tiene asientos para mostrar.");
    return;
  }

  const columnHeader = ["   ", ...seats[0].map((_, colIndex) => String(colIndex + 1).padStart(2, "0"))].join(" ");

  console.log("Estado actual de la sala:");
  console.log(columnHeader);

  seats.forEach((row, rowIndex) => {
    const rowNumber = String(rowIndex + 1).padStart(2, "0");
    const seatRow = row.map((seat) => (seat === 1 ? " X" : " L")).join(" ");
    console.log(`${rowNumber} ${seatRow}`);
  });
}

function reserveSeat(seats: SeatMatrix, rowNumber: number, columnNumber: number): boolean {
  if (!Number.isInteger(rowNumber) || !Number.isInteger(columnNumber)) {
    console.log("Reserva fallida: fila y columna deben ser numeros enteros.");
    return false;
  }

  const rowIndex = rowNumber - 1;
  const columnIndex = columnNumber - 1;

  if (rowIndex < 0 || rowIndex >= seats.length || columnIndex < 0 || columnIndex >= seats[0].length) {
    console.log(`Reserva fallida: posicion invalida (fila ${rowNumber}, columna ${columnNumber}).`);
    return false;
  }

  if (seats[rowIndex][columnIndex] === 1) {
    console.log(`Reserva fallida: el asiento fila ${rowNumber}, columna ${columnNumber} ya estaba ocupado.`);
    return false;
  }

  seats[rowIndex][columnIndex] = 1;
  console.log(`Reserva exitosa: asiento fila ${rowNumber}, columna ${columnNumber}.`);
  return true;
}

function countSeats(seats: SeatMatrix): string {
  let free = 0;
  let occupied = 0;

  seats.forEach((row) => {
    row.forEach((seat) => {
      if (seat === 1) {
        occupied += 1;
      } else {
        free += 1;
      }
    });
  });

  return `Asientos libres: ${free} | Asientos ocupados: ${occupied}`;
}

function findTwoContiguousFreeSeats(seats: SeatMatrix): string {
  for (let rowIndex = 0; rowIndex < seats.length; rowIndex += 1) {
    const row = seats[rowIndex];

    for (let columnIndex = 0; columnIndex < row.length - 1; columnIndex += 1) {
      if (row[columnIndex] === 0 && row[columnIndex + 1] === 0) {
        const firstColumn = columnIndex + 1;
        const secondColumn = columnIndex + 2;
        const row = rowIndex + 1;
        return `En la fila ${row}, están libres los asientos ${firstColumn} y ${secondColumn}.`;
      }
    }
  }

  return "No hay dos asientos contiguos libres en la misma fila.";
}

const seats = initializeSeatMatrix();

printRoomStatus(seats);

if (typeof window !== "undefined") {
  const browserApi = {
    seats,
    reserveSeat: (rowNumber: number, columnNumber: number) => reserveSeat(seats, rowNumber, columnNumber),
    printRoomStatus: () => printRoomStatus(seats),
    countSeats: () => countSeats(seats),
    findTwoContiguousFreeSeats: () => findTwoContiguousFreeSeats(seats),
  };

  Object.assign(window, browserApi);
  console.log(
    "API disponible en consola: seats, reserveSeat(fila, columna), printRoomStatus(), countSeats(), findTwoContiguousFreeSeats()",
  );
}

export { initializeSeatMatrix, printRoomStatus, reserveSeat, countSeats, findTwoContiguousFreeSeats };
