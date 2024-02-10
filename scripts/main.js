// @ts-check
import Chart, { DefaultDrawChartOptions, DrawChartOptions } from "./chart.js";

/**
 * Global canvas element for displaying chart
 * @type {?HTMLCanvasElement}
 */
const canvas = document.querySelector("#chart");
if (!canvas?.getContext) throw ReferenceError("HTML element is missing");

/**
 * Global chart object for frawing on canvas
 */
const chart = new Chart(canvas);

/** @type {HTMLButtonElement?} */
const btnReset = document.querySelector("#btnReset");
if (!btnReset) throw ReferenceError("HTML element is missing");
/** @type {HTMLInputElement?} */
const inpGraph = document.querySelector("#inpGraph");
if (!inpGraph) throw ReferenceError("HTML element is missing");
/** @type {HTMLInputElement?} */
const inpPointSize = document.querySelector("#inpPointSize");
if (!inpPointSize) throw ReferenceError("HTML element is missing");
/** @type {HTMLInputElement?} */
const inpStepValue = document.querySelector("#inpStepValue");
if (!inpStepValue) throw ReferenceError("HTML element is missing");
/** @type {HTMLInputElement?} */
const inpStepAmmount = document.querySelector("#inpStepAmmount");
if (!inpStepAmmount) throw ReferenceError("HTML element is missing");
/** @type {HTMLInputElement?} */
const inpYZoom = document.querySelector("#inpYZoom");
if (!inpYZoom) throw ReferenceError("HTML element is missing");
/** @type {HTMLInputElement?} */
const inpDrawAxes = document.querySelector("#inpDrawAxes");
if (!inpDrawAxes) throw ReferenceError("HTML element is missing");
/** @type {HTMLInputElement?} */
const inpDrawLines = document.querySelector("#inpDrawLines");
if (!inpDrawLines) throw ReferenceError("HTML element is missing");
/** @type {HTMLInputElement?} */
const inpChartColor = document.querySelector("#inpChartColor");
if (!inpChartColor) throw ReferenceError("HTML element is missing");
/** @type {HTMLElement?} */
const errorMsg = document.querySelector("#errorMsg");
if (!errorMsg) throw ReferenceError("HTML element is missing");

// Setting up default values
inpGraph.value = DefaultDrawChartOptions.formula;
inpPointSize.value = DefaultDrawChartOptions.pointSize.toString();
inpStepAmmount.value = DefaultDrawChartOptions.stepAmmount.toString();
inpStepValue.value = DefaultDrawChartOptions.stepValue.toString();
inpYZoom.value = DefaultDrawChartOptions.yZoom.toString();
inpDrawAxes.checked = DefaultDrawChartOptions.drawAxes;
inpDrawLines.checked = DefaultDrawChartOptions.drawLines;
inpChartColor.value = DefaultDrawChartOptions.chartColor;

/**
 * Extracts draw chart options object
 * @returns {DrawChartOptions}
 */
function getGraphOptions() {
    return {
        formula: inpGraph?.value ?? DefaultDrawChartOptions.formula,
        stepAmmount:
            Number(inpStepAmmount?.value) ??
            DefaultDrawChartOptions.stepAmmount,
        stepValue:
            Number(inpStepValue?.value) ?? DefaultDrawChartOptions.stepValue,
        pointSize:
            Number(inpPointSize?.value) ?? DefaultDrawChartOptions.pointSize,
        yZoom: Number(inpYZoom?.value) ?? DefaultDrawChartOptions.yZoom,
        drawAxes: inpDrawAxes?.checked ?? DefaultDrawChartOptions.drawAxes,
        drawLines: inpDrawLines?.checked ?? DefaultDrawChartOptions.drawLines,
        chartColor: inpChartColor?.value ?? DefaultDrawChartOptions.chartColor,
    };
}

/**
 * Calls {@link Chart.drawChart} on main {@link chart} object
 * @returns {void}
 */
function drawChartWithValues() {
    if (!errorMsg) throw ReferenceError("HTML element is missing");

    errorMsg.classList.add("hidden");
    try {
        chart.drawChart(getGraphOptions());
    } catch (error) {
        errorMsg.classList.remove("hidden");
    }
}

btnReset.onclick = () => {
    inpPointSize.value = DefaultDrawChartOptions.pointSize.toString();
    inpStepAmmount.value = DefaultDrawChartOptions.stepAmmount.toString();
    inpStepValue.value = DefaultDrawChartOptions.stepValue.toString();
    inpYZoom.value = DefaultDrawChartOptions.yZoom.toString();
    inpDrawAxes.checked = DefaultDrawChartOptions.drawAxes;
    inpDrawLines.checked = DefaultDrawChartOptions.drawLines;
    inpChartColor.value = DefaultDrawChartOptions.chartColor;

    drawChartWithValues();
};

inpGraph.oninput = drawChartWithValues;
inpPointSize.oninput = drawChartWithValues;
inpStepAmmount.oninput = drawChartWithValues;
inpStepValue.oninput = drawChartWithValues;
inpYZoom.oninput = drawChartWithValues;
inpDrawAxes.onclick = drawChartWithValues;
inpDrawLines.onclick = drawChartWithValues;
inpChartColor.oninput = drawChartWithValues;

drawChartWithValues();
