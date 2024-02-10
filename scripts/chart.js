// @ts-check

/**
 * Allows to controll chart dispalyed on canvas
 * @module chart
 */

/**
 * Additional options passed with creating chart object
 * @typedef ChartOptions
 * @property {number} [MAX_WIDTH] - Maximum canvas width in px
 * @property {number} [MAX_HEIGHT] - Maximum canvas height in px
 * @property {number} [FONT_SIZE] - Font size set for canvas in px
 * @memberof Chart
 */

/**
 * Options passed with drawing chart
 * @typedef DrawChartOptions
 * @property {string} formula - Graphs formula
 * @property {number} stepAmmount - Ammount of points drawed on chart
 * @property {number} stepValue - Distance between points
 * @property {number} pointSize - Size of a point in px
 * @property {number} yZoom - Zoom on y axis
 * @property {boolean} drawAxes - Controls wether to draw axes or not
 * @property {boolean} drawLines - Controls wether to draw lines between points or not
 * @property {string} chartColor - Color of a chart
 * @memberof Chart
 */
/** @type {DrawChartOptions} */
export let DrawChartOptions;

/**
 * Default values for {@link DrawChartOptions}
 * @enum {*}
 * @readonly
 */
export const DefaultDrawChartOptions = {
    formula: "x",
    stepAmmount: 10,
    stepValue: 1,
    pointSize: 2,
    yZoom: 40,
    drawAxes: true,
    drawLines: true,
    chartColor: "#0000FF",
};

/**
 * Allows to controll chart dispalyed on canvas
 * @class
 */
export default class Chart {
    /**
     * Canvas that displays chart
     * @type {HTMLCanvasElement}
     * @private
     * @readonly
     */
    canvas;
    /**
     * Drawing conetxt of canvas
     * @type {CanvasRenderingContext2D}
     * @private
     * @readonly
     */
    ctx;
    /**
     * Maximum canvas width in px
     * @type {number}
     * @private
     * @readonly
     */
    MAX_WIDTH = 500;
    /**
     * Maximum canvas height in px
     * @type {number}
     * @private
     * @readonly
     */
    MAX_HEIGHT = 500;
    /**
     * Font size set for canvas in px
     * @type {number}
     * @private
     * @readonly
     */
    FONT_SIZE = 10;
    /**
     * X coordinates of canvas center in px
     * @type {number}
     * @private
     * @readonly
     */
    CENTER_X;
    /**
     * Y coordinates of canvas center in px
     * @type {number}
     * @private
     * @readonly
     */
    CENTER_Y;

    /**
     * @constructor
     * @param {HTMLCanvasElement} canvas - Canvas element to draw on
     * @param {ChartOptions} [options] - Additional chart option
     */
    constructor(canvas, options) {
        this.canvas = canvas;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Cannot connect to canvas context");
        this.ctx = ctx;

        if (options?.MAX_WIDTH) this.MAX_WIDTH = options?.MAX_WIDTH;
        if (options?.MAX_HEIGHT) this.MAX_HEIGHT = options?.MAX_HEIGHT;
        if (options?.FONT_SIZE) this.FONT_SIZE = options?.FONT_SIZE;

        this.canvas.width = this.MAX_WIDTH;
        this.canvas.height = this.MAX_HEIGHT;
        this.CENTER_X = Math.round(this.MAX_WIDTH / 2);
        this.CENTER_Y = Math.round(this.MAX_HEIGHT / 2);

        ctx.font = `${this.FONT_SIZE}px sans-serif`;
    }

    /**
     * Clears canvas contents
     * @method clearChart
     * @returns {void}
     * @private
     */
    clearChart() {
        this.ctx.clearRect(0, 0, this.MAX_WIDTH, this.MAX_HEIGHT);
    }

    /**
     * Draws a chart axes
     * @method drawAxes
     * @returns {void}
     * @private
     */
    drawChartAxes() {
        // Axis
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.CENTER_Y);
        this.ctx.lineTo(this.MAX_WIDTH, this.CENTER_Y);
        this.ctx.moveTo(this.CENTER_X, 0);
        this.ctx.lineTo(this.CENTER_X, this.MAX_HEIGHT);
        this.ctx.stroke();
        this.ctx.closePath();

        // Naming axis
        this.ctx.fillStyle = "#C6C6C6";
        this.ctx.fillText(
            "x",
            this.MAX_WIDTH - this.FONT_SIZE,
            this.CENTER_Y + this.FONT_SIZE
        );
        this.ctx.fillText("y", this.CENTER_X - this.FONT_SIZE, this.FONT_SIZE);

        this.ctx.fillText(
            "0",
            this.CENTER_X - this.FONT_SIZE,
            this.CENTER_Y + this.FONT_SIZE
        );
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#FFFFFF88";
        this.ctx.moveTo(this.CENTER_X, this.CENTER_Y);
        this.ctx.lineTo(
            this.CENTER_X - this.FONT_SIZE / 2,
            this.CENTER_Y + this.FONT_SIZE / 2
        );
        this.ctx.stroke();
        this.ctx.closePath();
    }

    /**
     * Calculates y value from graph formula
     * @method calculateGraph
     * @param {string} formula - graph formula
     * @param {number} x - x value for graph
     * @returns {number} - y value for graph
     * @private
     */
    calculateGraph(formula, x) {
        "use strict";
        const {
            PI,
            sin,
            cos,
            tan,
            pow,
            abs,
            random,
            sqrt,
            round,
            ceil,
            floor,
        } = Math;
        /**
         * Calculates logarithm
         * @param {number} base - Base of a logarithm
         * @param {number} num - Logarithm number
         * @returns {number}
         */
        const log = (base, num) => Math.log(num) / Math.log(base);

        const result = eval(`"use strict"; (((x) => ${formula})(${x}))`);
        return Number(result);
    }

    /**
     * Draws a graph based on its formula
     * @method drawGraph
     * @param {DrawChartOptions} [options] - Options for drawing chart
     * @returns {void}
     * @private
     */
    drawGraph(options = DefaultDrawChartOptions) {
        const STEP = this.MAX_WIDTH / options.stepAmmount;

        let prevX =
            (-options.stepAmmount / 2 - options.stepAmmount) *
            options.stepValue;
        let prevY = this.calculateGraph(options.formula, prevX);

        for (let i = 0; i <= options.stepAmmount; i++) {
            const x = i * STEP;
            const trueX = (i - options.stepAmmount / 2) * options.stepValue;
            const trueY = this.calculateGraph(options.formula, trueX);
            const y = this.CENTER_Y - trueY * options.yZoom;

            // Drawing
            this.ctx.fillStyle = options.chartColor;
            this.ctx.strokeStyle = options.chartColor;
            // - Point
            this.ctx.beginPath();
            this.ctx.arc(x, y, options.pointSize, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();
            // - Line
            if (options.drawLines) {
                this.ctx.beginPath();
                this.ctx.moveTo(prevX, prevY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            // - Axis value
            // - - X axis
            if (trueX !== 0 && options.drawAxes) {
                this.ctx.strokeStyle = "#FFFFFF88";
                this.ctx.fillStyle = "#C6C6C6";
                this.ctx.beginPath();
                this.ctx.moveTo(x, this.CENTER_Y - this.FONT_SIZE / 2);
                this.ctx.lineTo(x, this.CENTER_Y + this.FONT_SIZE / 2);
                this.ctx.stroke();
                this.ctx.closePath();
                const textX = String(Math.round(trueX * 100) / 100);
                this.ctx.fillText(
                    textX,
                    x,
                    this.CENTER_Y + this.FONT_SIZE * 1.5
                );
            }
            // - - Y axis
            if (trueY !== 0 && options.drawAxes) {
                this.ctx.strokeStyle = "#FFFFFF88";
                this.ctx.fillStyle = "#C6C6C6";
                this.ctx.beginPath();
                this.ctx.moveTo(this.CENTER_X - this.FONT_SIZE / 2, y);
                this.ctx.lineTo(this.CENTER_X + this.FONT_SIZE / 2, y);
                this.ctx.stroke();
                this.ctx.closePath();
                const textY = String(Math.round(trueY * 100) / 100);
                this.ctx.fillText(
                    textY,
                    this.CENTER_X + this.FONT_SIZE * 1.5,
                    y
                );
            }
            // ===
            prevX = x;
            prevY = y;
        }
    }

    /**
     * Draws a chart
     * @method drawChart
     * @param {DrawChartOptions} [options] - Graph options
     * @returns {void}
     * @public
     */
    drawChart(options) {
        this.clearChart();
        this.drawChartAxes();
        this.drawGraph(options);
    }
}
