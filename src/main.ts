import "./style.css";

type SeatMatrix = number[][];
type ReservationResult = {
  success: boolean;
  message: string;
};

// Creates a seat matrix with the requested size, initializing all seats as free (0).
function initializeSeatMatrix(rows = 8, columns = 10): SeatMatrix {
  // 0 = free, 1 = occupied
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

// Prints the current room status in the console with row/column numbering and L/X marks.
function printRoomStatus(seats: SeatMatrix): void {
  if (seats.length === 0 || seats[0].length === 0) {
    console.log("There are no seats to display.");
    return;
  }

  const columnHeader = ["   ", ...seats[0].map((_, colIndex) => String(colIndex + 1).padStart(2, "0"))].join(" ");

  console.log("Current room status:");
  console.log(columnHeader);

  seats.forEach((row, rowIndex) => {
    const rowNumber = String(rowIndex + 1).padStart(2, "0");
    const seatRow = row.map((seat) => (seat === 1 ? " X" : " L")).join(" ");
    console.log(`${rowNumber} ${seatRow}`);
  });
}

function reserveSeatWithResult(seats: SeatMatrix, rowNumber: number, columnNumber: number): ReservationResult {
  if (!Number.isInteger(rowNumber) || !Number.isInteger(columnNumber)) {
    return {
      success: false,
      message: "Reservation failed: row and column must be integers.",
    };
  }

  const rowIndex = rowNumber - 1;
  const columnIndex = columnNumber - 1;

  if (rowIndex < 0 || rowIndex >= seats.length || columnIndex < 0 || columnIndex >= seats[0].length) {
    return {
      success: false,
      message: `Reservation failed: invalid position (row ${rowNumber}, column ${columnNumber}).`,
    };
  }

  if (seats[rowIndex][columnIndex] === 1) {
    return {
      success: false,
      message: `Reservation failed: seat row ${rowNumber}, column ${columnNumber} is already occupied.`,
    };
  }

  seats[rowIndex][columnIndex] = 1;
  return {
    success: true,
    message: `Reservation successful: seat row ${rowNumber}, column ${columnNumber}.`,
  };
}

// Tries to reserve one seat, validating input format, bounds and availability.
function reserveSeat(seats: SeatMatrix, rowNumber: number, columnNumber: number): boolean {
  const result = reserveSeatWithResult(seats, rowNumber, columnNumber);
  console.log(result.message);
  return result.success;
}

// Counts free and occupied seats and returns a readable summary.
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

  return `Free seats: ${free} | Occupied seats: ${occupied}`;
}

// Finds two contiguous free seats in the same row and returns a message.
function findTwoContiguousFreeSeats(seats: SeatMatrix): string {
  for (let rowIndex = 0; rowIndex < seats.length; rowIndex += 1) {
    const row = seats[rowIndex];

    for (let columnIndex = 0; columnIndex < row.length - 1; columnIndex += 1) {
      if (row[columnIndex] === 0 && row[columnIndex + 1] === 0) {
        const firstColumn = columnIndex + 1;
        const secondColumn = columnIndex + 2;
        const row = rowIndex + 1;
        return `Found two contiguous free seats in row ${row}, columns ${firstColumn} and ${secondColumn}.`;
      }
    }
  }

  return "There are no two contiguous free seats in the same row.";
}

function resetSeats(seats: SeatMatrix): void {
  for (let rowIndex = 0; rowIndex < seats.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < seats[rowIndex].length; columnIndex += 1) {
      seats[rowIndex][columnIndex] = 0;
    }
  }
}

const seats = initializeSeatMatrix();

function renderSeatMap(container: HTMLElement, seats: SeatMatrix, onSeatClick: (row: number, col: number) => void): void {
  container.innerHTML = "";

  for (let rowIndex = 0; rowIndex < seats.length; rowIndex += 1) {
    const rowWrapper = document.createElement("div");
    rowWrapper.className = "mb-2 flex items-center justify-center gap-2";

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
        <div class="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">Free: L</div>
        <div class="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">Occupied: X</div>
        <div id="seat-count" class="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100"></div>
      </div>

      <div class="grid gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 p-4 md:grid-cols-5">
        <input id="reserve-row" type="number" min="1" max="8" placeholder="Row" class="rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400" />
        <input id="reserve-column" type="number" min="1" max="10" placeholder="Column" class="rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400" />
        <button id="reserve-button" type="button" class="rounded-xl border border-emerald-400/60 bg-emerald-500/30 px-3 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/45">Reserve</button>
        <button id="find-pair-button" type="button" class="rounded-xl border border-cyan-400/60 bg-cyan-500/20 px-3 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-500/35">Find Pair</button>
        <button id="reset-button" type="button" class="rounded-xl border border-fuchsia-300/60 bg-fuchsia-500/20 px-3 py-2 text-sm font-semibold text-fuchsia-100 hover:bg-fuchsia-500/35">Reset Room</button>
      </div>

      <div id="action-message" class="rounded-2xl border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-200">Ready to receive reservations.</div>

      <div class="mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-center text-sm font-semibold tracking-wide text-slate-200">
        Screen
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
        <div class="mb-3 flex min-w-max justify-center gap-2">
          ${seats[0].map((_, colIndex) => `<span class="w-9 text-center text-xs font-semibold text-slate-400">${String(colIndex + 1).padStart(2, "0")}</span>`).join("")}
        </div>
        <div id="seat-map" class="min-w-max"></div>
      </div>
    </div>
  `;

  const seatMap = root.querySelector<HTMLElement>("#seat-map");
  const seatCount = root.querySelector<HTMLElement>("#seat-count");
  const reserveRowInput = root.querySelector<HTMLInputElement>("#reserve-row");
  const reserveColumnInput = root.querySelector<HTMLInputElement>("#reserve-column");
  const reserveButton = root.querySelector<HTMLButtonElement>("#reserve-button");
  const findPairButton = root.querySelector<HTMLButtonElement>("#find-pair-button");
  const resetButton = root.querySelector<HTMLButtonElement>("#reset-button");
  const actionMessage = root.querySelector<HTMLElement>("#action-message");

  if (
    !seatMap ||
    !seatCount ||
    !reserveRowInput ||
    !reserveColumnInput ||
    !reserveButton ||
    !findPairButton ||
    !resetButton ||
    !actionMessage
  ) {
    return;
  }

  const setActionMessage = (message: string, success = true): void => {
    actionMessage.textContent = message;
    actionMessage.className =
      "rounded-2xl border p-3 text-sm " +
      (success
        ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-100"
        : "border-rose-400/50 bg-rose-500/10 text-rose-100");
  };

  const refresh = (): void => {
    renderSeatMap(seatMap, seats, (rowNumber, columnNumber) => {
      const result = reserveSeatWithResult(seats, rowNumber, columnNumber);
      setActionMessage(result.message, result.success);
      refresh();
    });

    seatCount.textContent = countSeats(seats);
  };

  reserveButton.addEventListener("click", () => {
    const rowNumber = Number(reserveRowInput.value);
    const columnNumber = Number(reserveColumnInput.value);
    const result = reserveSeatWithResult(seats, rowNumber, columnNumber);

    setActionMessage(result.message, result.success);
    refresh();
  });

  findPairButton.addEventListener("click", () => {
    const message = findTwoContiguousFreeSeats(seats);
    setActionMessage(message, !message.startsWith("There are no"));
  });

  resetButton.addEventListener("click", () => {
    resetSeats(seats);
    setActionMessage("Room reset: all seats are available again.");
    refresh();
  });

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
    "API available in browser console: seats, reserveSeat(row, column), printRoomStatus(), countSeats(), findTwoContiguousFreeSeats()",
  );
}

export { initializeSeatMatrix, printRoomStatus, reserveSeat, countSeats, findTwoContiguousFreeSeats };
