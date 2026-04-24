type SeatMatrix = string[][];

function initializeSeatMatrix(rows = 8, columns = 10): SeatMatrix {
  return Array.from({ length: rows }, () => Array(columns).fill("L"));
}

const seats = initializeSeatMatrix();

console.log("Matriz de asientos inicializada (8x10):");
console.table(seats);

export { initializeSeatMatrix };
