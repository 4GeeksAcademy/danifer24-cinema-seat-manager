import "./style.css";

type SeatMatrix = number[][];

// Crea una matriz de asientos con filas y columnas definidas, inicializando todo en 0 (libre).
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

// Imprime en consola el estado actual de la sala con numeracion y marcas L/X.
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

// Intenta reservar un asiento validando formato, rango y disponibilidad.
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

// Cuenta asientos libres y ocupados y devuelve un resumen en texto.
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

// Busca dos asientos libres consecutivos en una misma fila y devuelve un mensaje.
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

function renderSeatMap(container: HTMLElement, seats: SeatMatrix, onSeatClick: (row: number, col: number) => void): void {
  container.innerHTML = "";

  for (let rowIndex = 0; rowIndex < seats.length; rowIndex += 1) {
    const rowWrapper = document.createElement("div");
    rowWrapper.className = "mb-2 flex items-center gap-2";

    const rowLabel = document.createElement("span");
    rowLabel.className = "w-8 text-right text-xs font-semibold text-slate-300";
    rowLabel.textContent = String(rowIndex + 1).padStart(2, "0");
    rowWrapper.appendChild(rowLabel);

    for (let columnIndex = 0; columnIndex < seats[rowIndex].length; columnIndex += 1) {
      const seat = seats[rowIndex][columnIndex];
      const button = document.createElement("button");

      button.type = "button";
      button.dataset.row = String(rowIndex + 1);
      button.dataset.column = String(columnIndex + 1);
      button.textContent = seat === 1 ? "X" : "L";
      button.className =
        "h-9 w-9 rounded-lg border text-sm font-bold transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 " +
        (seat === 1
          ? "cursor-not-allowed border-rose-400/70 bg-rose-500/80 text-white"
          : "border-emerald-300/70 bg-emerald-500/80 text-slate-950 hover:bg-emerald-400");

      if (seat === 1) {
        button.disabled = true;
      } else {
        button.addEventListener("click", () => {
          onSeatClick(rowIndex + 1, columnIndex + 1);
        });
      }

      rowWrapper.appendChild(button);
    }

    container.appendChild(rowWrapper);
  }
}

function mountSeatManager(root: HTMLElement, seats: SeatMatrix): void {
  root.innerHTML = `
    <div class="space-y-5">
      <div class="grid gap-3 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 sm:grid-cols-3">
        <div class="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">Libre: L</div>
        <div class="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">Ocupado: X</div>
        <div id="seat-count" class="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100"></div>
      </div>

      <div class="mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-center text-sm font-semibold tracking-wide text-slate-200">
        Pantalla
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
        <div class="mb-3 ml-10 flex min-w-max gap-2">
          ${seats[0].map((_, colIndex) => `<span class="w-9 text-center text-xs font-semibold text-slate-400">${String(colIndex + 1).padStart(2, "0")}</span>`).join("")}
        </div>
        <div id="seat-map" class="min-w-max"></div>
      </div>

      <div id="seat-advice" class="rounded-2xl border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-200"></div>
    </div>
  `;

  const seatMap = root.querySelector<HTMLElement>("#seat-map");
  const seatCount = root.querySelector<HTMLElement>("#seat-count");
  const seatAdvice = root.querySelector<HTMLElement>("#seat-advice");

  if (!seatMap || !seatCount || !seatAdvice) {
    return;
  }

  const refresh = (): void => {
    renderSeatMap(seatMap, seats, (rowNumber, columnNumber) => {
      reserveSeat(seats, rowNumber, columnNumber);
      refresh();
    });

    seatCount.textContent = countSeats(seats);
    seatAdvice.textContent = findTwoContiguousFreeSeats(seats);
  };

  refresh();
}

printRoomStatus(seats);

const app = document.querySelector<HTMLElement>("#app");

if (app) {
  mountSeatManager(app, seats);
}

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
