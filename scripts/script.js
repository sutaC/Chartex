const canvas = document.querySelector("#chart");
if (!canvas.getContext) throw new Error("Cannot connect to canvas element");
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("Cannot connect to canvas context");

const btnReset = document.querySelector("#btnReset");
const inpPointSize = document.querySelector("#inpPointSize");
const inpStepValue = document.querySelector("#inpStepValue");
const inpStepAmmount = document.querySelector("#inpStepAmmount");

// SETUP

const MAX_WIDTH = 500;
const MAX_HEIGHT = 500;

canvas.width = MAX_WIDTH;
canvas.height = MAX_HEIGHT;

const CENTER_X = Math.round(MAX_WIDTH / 2);
const CENTER_Y = Math.round(MAX_HEIGHT / 2);
const FONT_SIZE = 14;

ctx.font = `${FONT_SIZE}px sans-serif`;

// FUNCTIONS

function drawChartOutlines() {
    // Axis
    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(0, CENTER_Y);
    ctx.lineTo(MAX_WIDTH, CENTER_Y);
    ctx.moveTo(CENTER_X, 0);
    ctx.lineTo(CENTER_X, MAX_HEIGHT);
    ctx.stroke();
    ctx.closePath();

    // Naming axis
    ctx.fillStyle = "#C6C6C6";
    ctx.fillText("x", MAX_WIDTH - FONT_SIZE, CENTER_Y + FONT_SIZE);
    ctx.fillText("y", CENTER_X - FONT_SIZE, FONT_SIZE);

    ctx.fillText("0", CENTER_X - FONT_SIZE, CENTER_Y + FONT_SIZE);
    ctx.beginPath();
    ctx.strokeStyle = "#FFFFFF88";
    ctx.moveTo(CENTER_X, CENTER_Y);
    ctx.lineTo(CENTER_X - FONT_SIZE / 2, CENTER_Y + FONT_SIZE / 2);
    ctx.stroke();
    ctx.closePath();
}

function clearChart() {
    ctx.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
}

function drawGraph(
    func = (x) => x,
    stepAmmount = 10,
    stepValue = 5,
    pointSize = 4
) {
    ctx.strokeStyle = "#0000FF";
    ctx.fillStyle = "#0000FF";
    const STEP = MAX_WIDTH / stepAmmount;

    let prevY, prevX;

    for (let i = 0; i <= stepAmmount; i++) {
        const x = i * STEP;
        const trueX = (i - stepAmmount / 2) * stepValue;
        const trueY = func(trueX);
        const y = CENTER_Y - trueY;

        // Line
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
        // Point
        ctx.beginPath();
        ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // ===
        prevX = x;
        prevY = y;
    }
}

// MAIN

const graph = (x) => x;
let stepAmmount = 10;
let stepValue = 50;
let pointSize = 2;

inpPointSize.value = inpPointSize.dataset.original = pointSize;
inpStepAmmount.value = inpStepAmmount.dataset.original = stepAmmount;
inpStepValue.value = inpStepValue.dataset.original = stepValue;

// DRAWING

drawChartOutlines();
drawGraph(graph, stepAmmount, stepValue, pointSize);

// REACTIVE

function refreschChart() {
    clearChart();
    drawChartOutlines();
    drawGraph(graph, stepAmmount, stepValue, pointSize);
}

btnReset.onclick = (e) => {
    pointSize = inpPointSize.value = inpPointSize.dataset.original ?? 1;
    stepAmmount = inpStepAmmount.value = inpStepAmmount.dataset.original ?? 1;
    stepValue = inpStepValue.value = inpStepValue.dataset.original ?? 1;

    refreschChart();
};

inpPointSize.oninput = (e) => {
    pointSize = Number(e.target.value);
    refreschChart();
};
inpStepAmmount.oninput = (e) => {
    stepAmmount = Number(e.target.value);
    refreschChart();
};
inpStepValue.oninput = (e) => {
    stepValue = Number(e.target.value);
    refreschChart();
};
