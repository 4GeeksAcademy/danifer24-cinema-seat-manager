type SeatMatrix = number[][];

function initializeSeatMatrix(rows = 8, columns = 10): SeatMatrix {
  // 0 = libre, 1 = ocupado
  return Array.from({ length: rows }, () => Array(columns).fill(0));
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

const seats = initializeSeatMatrix();

printRoomStatus(seats);

export { initializeSeatMatrix, printRoomStatus };
