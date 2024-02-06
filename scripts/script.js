const canvas = document.querySelector("#chart");
if (!canvas.getContext) throw new Error("Cannot connect to canvas element");
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("Cannot connect to canvas context");

const btnReset = document.querySelector("#btnReset");
const inpGraph = document.querySelector("#inpGraph");
const inpPointSize = document.querySelector("#inpPointSize");
const inpStepValue = document.querySelector("#inpStepValue");
const inpStepAmmount = document.querySelector("#inpStepAmmount");
const inpYZoom = document.querySelector("#inpYZoom");
const inpDrawAxes = document.querySelector("#inpDrawAxes");
const inpDrawLines = document.querySelector("#inpDrawLines");
const inpChartColor = document.querySelector("#inpChartColor");
const errorMsg = document.querySelector("#errorMsg");

// SETUP

const MAX_WIDTH = 500;
const MAX_HEIGHT = 500;

canvas.width = MAX_WIDTH;
canvas.height = MAX_HEIGHT;

const CENTER_X = Math.round(MAX_WIDTH / 2);
const CENTER_Y = Math.round(MAX_HEIGHT / 2);
const FONT_SIZE = 10;

ctx.font = `${FONT_SIZE}px sans-serif`;

// FUNCTIONS

function calculateGraph(input, x) {
    "use strict";
    const {
        PI,
        sin,
        cos,
        tan,
        pow,
        abs,
        floor,
        round,
        random,
        log,
        log10,
        log2,
        sqrt,
        ceil,
    } = Math;

    const result = eval(`"use strict"; (((x) => ${input})(${x}))`);
    return Number(result);
}

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

function drawGraph(input = "x") {
    errorMsg.classList.add("hidden");

    const STEP = MAX_WIDTH / stepAmmount;

    let prevY, prevX;

    for (let i = 0; i <= stepAmmount; i++) {
        const x = i * STEP;
        const trueX = (i - stepAmmount / 2) * stepValue;

        // Calculating y;
        let calc = 0;
        try {
            calc = calculateGraph(input, trueX);
        } catch (error) {
            errorMsg.classList.remove("hidden");
            return;
        }
        const trueY = calc;
        calc = undefined;
        // ---

        const y = CENTER_Y - trueY * yZoom;

        // Drawing
        ctx.fillStyle = chartColor;
        ctx.strokeStyle = chartColor;
        // - Point
        ctx.beginPath();
        ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        // - Line
        if (drawLines) {
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.closePath();
        }
        // - Axis value
        // - - X axis
        if (trueX !== 0 && drawAxes) {
            ctx.strokeStyle = "#FFFFFF88";
            ctx.fillStyle = "#C6C6C6";
            ctx.beginPath();
            ctx.moveTo(x, CENTER_Y - FONT_SIZE / 2);
            ctx.lineTo(x, CENTER_Y + FONT_SIZE / 2);
            ctx.stroke();
            ctx.closePath();
            const textX = String(Math.round(trueX * 100) / 100);
            ctx.fillText(textX, x, CENTER_Y + FONT_SIZE * 1.5);
        }
        // - - Y axis
        if (trueY !== 0 && drawAxes) {
            ctx.strokeStyle = "#FFFFFF88";
            ctx.fillStyle = "#C6C6C6";
            ctx.beginPath();
            ctx.moveTo(CENTER_X - FONT_SIZE / 2, y);
            ctx.lineTo(CENTER_X + FONT_SIZE / 2, y);
            ctx.stroke();
            ctx.closePath();
            const textY = String(Math.round(trueY * 100) / 100);
            ctx.fillText(textY, CENTER_X + FONT_SIZE * 1.5, y);
        }
        // ===
        prevX = x;
        prevY = y;
    }
}

// MAIN

let graph = "x";

let stepAmmount = 10;
let stepValue = 1;
let pointSize = 2;
let yZoom = 1;

let drawAxes = true;
let drawLines = true;
let chartColor = "#0000FF";

inpGraph.value = graph;
inpPointSize.value = inpPointSize.dataset.original = pointSize;
inpStepAmmount.value = inpStepAmmount.dataset.original = stepAmmount;
inpStepValue.value = inpStepValue.dataset.original = stepValue;
inpYZoom.value = inpYZoom.dataset.original = yZoom;
inpChartColor.value = inpChartColor.dataset.original = chartColor;
inpDrawAxes.checked = inpDrawAxes.dataset.original = drawAxes;
inpDrawLines.checked = inpDrawLines.dataset.original = drawLines;

// DRAWING

drawChartOutlines();
drawGraph(graph);

// REACTIVE

function refreschChart() {
    clearChart();
    drawChartOutlines();
    drawGraph(graph);
}

btnReset.onclick = (e) => {
    pointSize = inpPointSize.value = inpPointSize.dataset.original;
    stepAmmount = inpStepAmmount.value = inpStepAmmount.dataset.original;
    stepValue = inpStepValue.value = inpStepValue.dataset.original;
    yZoom = inpYZoom.value = inpYZoom.dataset.original;
    drawAxes = inpDrawAxes.checked = inpDrawAxes.dataset.original;
    drawLines = inpDrawLines.checked = inpDrawLines.dataset.original;
    chartColor = inpChartColor.value = inpChartColor.dataset.original;

    refreschChart();
};

inpGraph.oninput = (e) => {
    graph = e.target.value;
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
inpYZoom.oninput = (e) => {
    yZoom = Number(e.target.value);
    refreschChart();
};

inpDrawAxes.onclick = (e) => {
    drawAxes = Boolean(e.target.checked);
    refreschChart();
};
inpDrawLines.onclick = (e) => {
    drawLines = Boolean(e.target.checked);
    refreschChart();
};
inpChartColor.oninput = (e) => {
    chartColor = e.target.value;
    refreschChart();
};
