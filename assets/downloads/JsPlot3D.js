var JSPLOT3D =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = THREE;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.convertToHeat = convertToHeat;
exports.getColorMap = getColorMap;
exports.getColorObjectFromAnyString = getColorObjectFromAnyString;

var _three = __webpack_require__(0);

var THREE = _interopRequireWildcard(_three);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * converts a number to a heat color and returns a THREE.Color object
 * @param {number} value the number that should be converted to a heat color
 * @param {number} min maximum number present in your dataframe. Default -1
 * @param {number} max minimum number present in your dataframe. Default 1
 * @param {number} hueOffset 0 means no offset. 0.5 means red turns to turqoise. 1 means the offset is so large that red is red again.
 * @return THREE.Color object
 */
function convertToHeat(value) {
    var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
    var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var hueOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    // set color boundaries so that the colors are heatmap like
    var upperColorBoundary = 0 + hueOffset; // equals red // what the highest value will get
    var lowerColorBoundary = 0.65 + hueOffset; // equals blue with a faint purple tone // what the lowest value will get

    value = (value - min) / (max - min); // normalize

    // heatmap
    // make sure all the colors are within the defined range
    value = value * (1 - lowerColorBoundary - (1 - upperColorBoundary)) + lowerColorBoundary;

    // return that color
    return new THREE.Color(0).setHSL(value, 0.95, 0.55);
}

/**
 * returns dfColors. An array, indexes are the same as the vertices of the
 * scatterplot in the geometry.vertices array. dfColors contains THREE.Color objects
 * (supports numbers or color strings (0x...,"#...","rgb(...)","hsl(...)"))
 * The parameters have the same names as in JsPlot3D.js. Just forward them to this function
 * @param {any[][]} df the dataframe without the headers
 * @param {number} colorCol the column index of each datapoint, that is used to calculate/parse the color.
 * Example: colorCol is 3. [1324,0.7653,7,"rgb(128,255,0)"]. When labeled is set to false, the datapoint will be colored in lime
 * @param {any} defaultColor if no varying color can be applied to the data, draw all datapoints in this color. Example: "#ff6600"
 * @param {boolean} labeled if true, treat the column indicated in colorCol as labels.
 * Example: when df[line][colorCol] is "tree" it will be red, flower will be a different color and so on
 * @param {boolean} header true if there are headers in the dataframe ("street","number",...)
 * @param {boolean} filterColor wether or not numbers should be filtered to a headmap
 * @param {number} hueOffset color offset. 0.5 inverts the hue (red goes turqoise)
 * @param {object} labelColorMap .labelColorMap attribute of the return value of this function from the past
 * @param {number} numberOfLabels the number of labels that is stored inside (the old) labelColorMap.
 * This is also returned from getColorMap. Also see the description of the labelColorMap parameter
 * @private
 */
function getColorMap(df, colorCol, defaultColor, labeled, header) {
    var filterColor = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
    var hueOffset = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
    var labelColorMap = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};
    var numberOfLabels = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;

    var dfColors = new Array(df.length); // array of THREE.Color objects that contain the individual color information of each datapoint in the same order as df

    var firstDataPointLine = 0;
    if (header) firstDataPointLine = 1;

    // validating the settings.
    // check for labeled == false, because getColorObjctFromAnyString is only important for unlabeled data.
    if (labeled == false && colorCol != -1 && getColorObjectFromAnyString(df[firstDataPointLine][colorCol]) == undefined) {

        // didn't work. try some stuff
        if (header == false && df.length >= 2) {
            console.warn("the column that is supposed to hold the color information (index " + colorCol + ") contained an unrecognized " + "string (\"" + df[0][colorCol] + "\"). \"labeled\" is set to " + labeled + ", \"header\" is set to " + header + " " + "Now trying with header = true.");
            header = true;
            firstDataPointLine = 1;
        }

        if (getColorObjectFromAnyString(df[firstDataPointLine][colorCol]) == undefined) {
            // assume labels
            console.warn("the column that is supposed to hold the color information (index " + colorCol + ") contained an unrecognized " + "string (\"" + df[0][colorCol] + "\"). \"labeled\" is set to " + labeled + ", \"header\" is set to " + header + " " + "Now assuming labeled = true.");
            labeled = true;
        }
    }

    // if it is not supposed to be rendered as labeled data, avoid
    // printing the old Labels that were eventually passed to this function 
    if (!labeled) labelColorMap = {};

    // now create the dfColors array
    if (colorCol != -1) // does the user even want colors?
        {

            // find out min and max values, so that I can do hsl(clr/clrMax,100%,100%)
            var clrMax = df[firstDataPointLine][colorCol];
            var clrMin = df[firstDataPointLine][colorCol];
            // the following function just updates clrMax and clrMin
            var findHighestAndLowest = function findHighestAndLowest(value) {
                if (filterColor && colorCol != -1) {
                    if (value > clrMax) clrMax = value;
                    if (value < clrMin) clrMin = value;
                }
            };

            // now take care about if the user says it's labeled or not, if it's numbers, hex, rgb, hsl or strings
            // store it inside dfColors[i] if it (can be converted to a number)||(is already a number)

            // parameter. Does the dataset hold classes/labels?
            if (labeled) {

                //------------------------//
                //     string labeled     //
                //------------------------//
                // e.g. "group1" "group2" "tall" "small" "0" "1" "flower" "tree"

                // check the second line, because there might be headers accidentally in the first row
                if ((df[firstDataPointLine][colorCol] + "").startsWith("rgb") || (df[firstDataPointLine][colorCol] + "").startsWith("hsl") || (df[firstDataPointLine][colorCol] + "").startsWith("#") && df[0][colorCol].length === 7) {
                    console.warn(df[0][colorCol] + " might be a color. \"labeled\" is set true. For the stored colors to show up, try \"labeled=false\"");
                }

                // count the ammount of labels here
                var label = void 0;
                for (var i = 0; i < df.length; i++) {
                    label = df[i][colorCol]; // read the label/classification
                    if (!labelColorMap[label]) // is this label still unknown?
                        {
                            labelColorMap[label] = {};
                            labelColorMap[label].number = numberOfLabels; // map it to an unique number
                            labelColorMap[label].color = null;
                            numberOfLabels++; // make sure the next label gets a different number
                        }
                }

                // how much distance between each hue:
                var hueDistance = 1 / numberOfLabels;
                for (var _i = 0; _i < dfColors.length; _i++) {
                    var _label = df[_i][colorCol];
                    var color = void 0;

                    // color not yet added
                    if (labelColorMap[_label].color === null) {
                        color = new THREE.Color(0).setHSL(labelColorMap[_label].number * hueDistance + hueOffset, 0.95, 0.55);
                        labelColorMap[_label].color = color; // store the label name together with the color
                    } else {
                        // in this case it's an old color that got passed to this function in the parameters (labelColorMap is a parameter)
                        color = labelColorMap[_label].color;
                    }
                    dfColors[_i] = color;
                }

                // CASE 1 dfColors now contains labels
                return { labelColorMap: labelColorMap, dfColors: dfColors, numberOfLabels: numberOfLabels };
            } else {

                //------------------------//
                //       color code       //
                //------------------------//
                //#, rgb and hex

                // if it is a string value
                if (isNaN(parseFloat(df[firstDataPointLine][colorCol]))) {
                    filterColor = false; // don't apply normalization and heatmapfilters to it

                    // try to extract color information from the string
                    // check the second line, because there might be headers accidentally in the first row
                    if (getColorObjectFromAnyString(df[firstDataPointLine][colorCol]) != undefined) {
                        for (var _i2 = 0; _i2 < df.length; _i2++) {
                            var clr = getColorObjectFromAnyString(df[_i2][colorCol]);
                            if (!clr) clr = new THREE.Color(0);

                            dfColors[_i2] = clr;
                        }
                    }

                    // CASE 2 dfColors now contains colors created from RGB, # and HSL strings
                    return { labelColorMap: labelColorMap, dfColors: dfColors, numberOfLabels: 0 };
                } else {
                    //------------------------//
                    //         number         //
                    //------------------------//
                    // examples: 0x3a96cd (3839693) 0xffffff (16777215) 0x000000 (0)

                    // it's a number. just copy it over and filter it to a heatmap

                    for (var _i3 = 0; _i3 < df.length; _i3++) {
                        dfColors[_i3] = df[_i3][colorCol];
                        if (!filterColor) dfColors[_i3] = df[_i3][colorCol] | 0;else findHighestAndLowest(dfColors[_i3]); // update clrMin and clrMax
                    }

                    // This is just a preparation for CASE 3 and CASE 4
                }
            }

            // manipulate the color
            if (filterColor) // if filtering is allowed (not the case for rgb, hsl and #hex values)
                {
                    // now apply the filters and create a THREE color from the information stored in dfColors
                    for (var _i4 = 0; _i4 < df.length; _i4++) {
                        var _color = dfColors[_i4];
                        // store that color
                        dfColors[_i4] = convertToHeat(_color, clrMin, clrMax, hueOffset);
                    }

                    // CASE 3 dfColors now contains a heatmap
                    return { labelColorMap: labelColorMap, dfColors: dfColors, numberOfLabels: 0 };
                } else {
                for (var _i5 = 0; _i5 < df.length; _i5++) {
                    var _color2 = dfColors[_i5];
                    // store that color
                    dfColors[_i5] = getColorObjectFromAnyString(_color2);
                }

                // CASE 4 dfColors now contains many colors, copied from the dataframe
                return { labelColorMap: labelColorMap, dfColors: dfColors, numberOfLabels: 0 };
            }
        }

    // this is the default case

    for (var _i6 = 0; _i6 < df.length; _i6++) {
        dfColors[_i6] = getColorObjectFromAnyString(defaultColor);
    } // CASE 5 dfColors now contains all the same color
    return { labelColorMap: {}, dfColors: dfColors, numberOfLabels: 0 };
}

/**
 * converts the param color to a THREE.Color object
 * @param {any} color examples: "rgb(0,0.5,1)" "hsl(0.3,0.4,0.7)" 0xff6600 "#72825a"
 */
function getColorObjectFromAnyString(color) {
    if (typeof color === "number")
        // values with typeof "number" work like this: 0xffffff = 16777215 = white. 0x000000 = 0 = black
        // numbers are supported by three.js by default
        return new THREE.Color(color);

    if (typeof color != "number" && typeof color != "string") return console.error("getColorObjectFromAnyString expected String or Number as parameter but got " + (typeof color === "undefined" ? "undefined" : _typeof(color)));

    // if the code reaches this point, color is a string probably
    // lowercase it to make checking for rgb and hsl simpler
    color = color.toLocaleLowerCase();

    // if it can be parsed, parse it
    var colorNumber = parseFloat(color);
    if (!isNaN(colorNumber)) return new THREE.Color(colorNumber);

    if (color.startsWith("rgb")) {
        // native support by three.js (but make sure it's lowercase, which happens at the beginning of this function)
        return new THREE.Color(color);
    } else if (color.startsWith("#")) {
        // hex strings are supported by three.js right away aswell
        return new THREE.Color(color);
    } else if (color.startsWith("hsl")) {
        // remove "hsl", brackets and split it into an array of [r,g,b]
        var hsl = color.substring(4, color.length - 1).split(",");
        return new THREE.Color(0).setHSL(parseFloat(hsl[0]), parseFloat(hsl[1]), parseFloat(hsl[2]));
    }

    return undefined;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Plot = exports.DEFAULTCAMERA = exports.TOPCAMERA = exports.POLYGON_MODE = exports.LINEPLOT_MODE = exports.BARCHART_MODE = exports.SCATTERPLOT_MODE = exports.ZAXIS = exports.YAXIS = exports.XAXIS = exports.colorLib = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Plots Dataframes and Formulas into a 3D Space
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module JsPlot3D
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _MathParser = __webpack_require__(3);

var _MathParser2 = _interopRequireDefault(_MathParser);

var _SceneHelper = __webpack_require__(4);

var _SceneHelper2 = _interopRequireDefault(_SceneHelper);

var _Scatterplot = __webpack_require__(6);

var _Scatterplot2 = _interopRequireDefault(_Scatterplot);

var _Lineplot = __webpack_require__(7);

var _Lineplot2 = _interopRequireDefault(_Lineplot);

var _Barchart = __webpack_require__(8);

var _Barchart2 = _interopRequireDefault(_Barchart);

var _ColorLib = __webpack_require__(1);

var COLORLIB = _interopRequireWildcard(_ColorLib);

var _three = __webpack_require__(0);

var THREE = _interopRequireWildcard(_three);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// make the COLORLIB available as member of this module
var colorLib = exports.colorLib = COLORLIB;
var XAXIS = exports.XAXIS = 1;
var YAXIS = exports.YAXIS = 2;
var ZAXIS = exports.ZAXIS = 3;
var SCATTERPLOT_MODE = exports.SCATTERPLOT_MODE = "scatterplot";
var BARCHART_MODE = exports.BARCHART_MODE = "barchart";
var LINEPLOT_MODE = exports.LINEPLOT_MODE = "lineplot";
var POLYGON_MODE = exports.POLYGON_MODE = "polygon";
var TOPCAMERA = exports.TOPCAMERA = 1;
var DEFAULTCAMERA = exports.DEFAULTCAMERA = 0;

var Plot = exports.Plot = function () {
    /**
     * Creates a Plot instance, so that a single canvas can be rendered. After calling this constructor, rendering can
     * be done using plotFormula(s), plotCsvString(s) or plotDataFrame(df)
     * @param {object} container html div DOM element which can then be selected using document.getElementById("foobar") with foobar being the html id of the container
     * @param {json} sceneOptions optional. at least one of backgroundColor or axesColor in a Json Format {}. Colors can be hex values "#123abc" or 0x123abc, rgb and hsl (e.g. "rgb(0.3,0.7,0.1)")
     */
    function Plot(container) {
        var sceneOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Plot);

        // parameter checking
        if ((typeof container === "undefined" ? "undefined" : _typeof(container)) != "object") return console.error("second param for the Plot constructor (container) should be a DOM-Object. This can be obtained using e.g. document.getElementById(\"foobar\")");

        // The order of the following tasks is important!

        // initialize cache object
        this.clearOldData();

        // scene helper is needed for setContainer
        this.SceneHelper = new _SceneHelper2.default({ width: container.offsetWidth, height: container.offsetHeight });

        // first set up the container and the dimensions
        this.setContainer(container);
        // don't use setDimensions for the following, as setDimensions is meant
        // to be something to call during runtime and will therefore cause problems
        this.dimensions = { xRes: 20, zRes: 20, xLen: 1, yLen: 1, zLen: 1 };
        this.dimensions.xVerticesCount = this.dimensions.xRes * this.dimensions.xLen;
        this.dimensions.zVerticesCount = this.dimensions.zRes * this.dimensions.zLen;

        // before MathParser, Dimensions have to be called to initialize some stuff (xVerticesCount and zVerticesCount)
        this.MathParser = new _MathParser2.default(this);

        // then setup the children of the scene (camera, light, axes)
        this.SceneHelper.createScene(this.dimensions, sceneOptions, { width: container.offsetWidth, height: container.offsetHeight });
        this.SceneHelper.centerCamera(this.dimensions); // set camera position

        // they need to be updated once setDimensions is called or the mode of the plot changes
        // why on modechange? because barcharts need a different way of displaying them due to the different
        // normalization approach
        this.axesNumbersNeedUpdate = false;

        // initialize the legend variables
        this.initializeLegend();

        // by default disable the benchmark process
        this.benchmark = {};
        this.benchmark.enabled = false;
        this.benchmark.recentTime = 0;

        // start empty
        this.plotmesh = null;

        // no animation by default
        this.animationFunc = null;

        // to trigger rendering every four frames. +1 % 4, do something if 0 or break if not null
        this.fps15 = 0;

        // now render the empty space (axes will be visible)
        this.SceneHelper.render();
    }

    /**
     * plots a formula into the container as 3D Plot
     * @param {string} originalFormula string of formula. example: sin(x1) + x3
     * @param {object} options json object with one or more of the following parameters:
     * - mode {string}: "barchart", "scatterplot", "polygon" or "lineplot"
     * - header {boolean}: a boolean value whether or not there are headers in the first row of the csv file. Default true
     * - colorCol {number}: leave undefined or set to -1, if defaultColor should be applied. Otherwise the index of the csv column that contains color information.
     * (0, 1, 2 etc.). Formats of the column within the .csv file allowed:
     * numbers (normalized automatically, range doesn't matter). Numbers are converted to a heatmap automatically.
     * Integers that are used as class for labeled data would result in various different hues in the same way.
     * hex strings ("#f8e2b9"). "rgb(...)" strings. "hsl(...)" strings. strings as labels (make sure to set labeled = true).
     * - normalizeX1 {boolean}: if false, data will not be normalized. Datapoints with high values will be very far away then on the X1 Axis
     * - normalizeX2 {boolean}: if false, data will not be normalized. Datapoints with high values will be very far away then on the X2 Axis (y)
     * - normalizeX3 {boolean}: if false, data will not be normalized. Datapoints with high values will be very far away then on the X3 Axis
     * - title {string}: title of the data
     * - fraction {number}: between 0 and 1, how much of the dataset should be plotted.
     * - labeled {boolean}: true if colorCol contains labels (such as 0, 1, 2 or frog, cat, dog). This changes the way it is colored.
     * Having it false on string-labeled data will throw a warning, but it will continue as it was true
     * - defaultColor {number or string}: examples: #1a3b5c, 0xfe629a, rgb(0.1,0.2,0.3), hsl(0.4,0.5,0.6). Gets applied when either colorCol is -1, undefined or ""
     * - x1frac {number}: by how much to divide the datapoints x1 value to fit into [-1;1]. will be overwritten if normalization is on
     * - x2frac {number}: by how much to divide the datapoints x2 value (y) to fit into [-1;1]. will be overwritten if normalization is on
     * - x3frac {number}: by how much to divide the datapoints x3 value to fit into [-1;1]. will be overwritten if normalization is on
     * - barchartPadding {number}: how much space should there be between the bars? Example: 0.025
     * - dataPointSize {number}: how large the datapoint should be. Default: 0.04
     * - filterColor {boolean}: true: if the column with the index of the parameter "colorCol" contains numbers they are going to be treated
     * as if it was a color. (converted to hexadecimal then). Default false
     * - x1title {string}: title of the x1 axis
     * - x2title {string}: title of the x2 axis
     * - x3title {string}: title of the x3 axis
     * - hueOffset {number}: how much to rotate the hue of the labels. between 0 and 1. Default: 0
     * - keepOldPlot {boolean}: don't remove the old datapoints/bars/etc. when this is true
     * - updateOldData {boolean}: if false, don't overwrite the dataframe that is stored in the oldData-object
     * - barSizeThreshold {number}: smallest allowed y value for the bars. Smaller than that will be hidden. Between 0 and 1. 1 Hides all bars, 0 shows all. Default 0  
     * - numberDensity {number}: how many numbers to display when the length (xLen, yLen or zLen) equals 1. A smaller axis displays fewer numbers and a larger axis displays more.
     */


    _createClass(Plot, [{
        key: "plotFormula",
        value: function plotFormula(originalFormula) {
            var _this = this;

            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


            var mode = POLYGON_MODE;
            var x2frac = 1;
            var normalizeX2 = true;

            var title = originalFormula;
            var x1title = "x1";
            var x2title = "y(x1,x3)";
            var x3title = "x3";
            if (options.title != undefined) title = options.title;
            if (options.x1title != undefined) x1title = options.x1title;
            if (options.x2title != undefined) x2title = options.x2title;
            if (options.x3title != undefined) x3title = options.x3title;

            if (options.mode != undefined) mode = options.mode;
            if (options.x2frac != undefined) x2frac = options.x2frac;
            if (options.normalizeX2 != undefined) normalizeX2 = options.normalizeX2;

            if (originalFormula == undefined || originalFormula === "") return console.error("first param of plotFormula (originalFormula) is undefined or empty");
            if (typeof originalFormula != "string") return console.error("first param of plotFormula (originalFormula) should be string");

            this.MathParser.resetCalculation();
            this.MathParser.parse(originalFormula); //tell the MathParser to prepare so that f can be executed
            this.oldData.checkstring = ""; // don't fool plotCsvString into believing the oldData-object contains still old csv data

            if (mode === SCATTERPLOT_MODE) {

                //plotFormula
                //-------------------------//
                //       scatterplot       //
                //-------------------------//

                // if scatterplot, create a dataframe and send it to plotDataFrame
                // multiply those two values for the ArraySize because plotFormula will create that many datapoints
                var df = new Array(this.dimensions.xVerticesCount * this.dimensions.zVerticesCount);

                // three values (x, y and z) that are going to be stored in the dataframe

                // line number in the new dataframe
                var i = 0;
                var y = 0;

                for (var x = 0; x < this.dimensions.xVerticesCount; x++) {
                    for (var z = 0; z < this.dimensions.zVerticesCount; z++) {
                        y = this.MathParser.f(x / this.dimensions.xRes, z / this.dimensions.zRes); // calculate y. y = f(x1, x2)
                        df[i] = new Float32Array(3);
                        df[i][0] = x; // store the datapoint
                        df[i][1] = y; // store the datapoint
                        df[i][2] = z; // store the datapoint
                        i++;
                    }
                }

                options.colorCol = 1; // y result of the evaluated formula

                // continue plotting this DataFrame
                this.plotDataFrame(df, 0, 1, 2, options);
            } else if (mode === BARCHART_MODE) {

                //plotFormula
                //-------------------------//
                //        Bar Chart        //
                //-------------------------//


                // if barchart, create a dataframe and send it to plotDataFrame
                var _df = new Array(this.dimensions.xVerticesCount * this.dimensions.zVerticesCount);

                // three values (x, y and z) that are going to be stored in the dataframe

                // line number in the new dataframe
                var _i = 0;
                var _y = 0;

                for (var _x3 = 0; _x3 <= this.dimensions.xVerticesCount; _x3++) {
                    for (var _z = 0; _z <= this.dimensions.zVerticesCount; _z++) {
                        _y = this.MathParser.f(_x3 / this.dimensions.xRes, _z / this.dimensions.zRes); // calculate y. y = f(x1, x2)
                        _df[_i] = new Float32Array(3);
                        _df[_i][0] = _x3; // store the datapoint
                        _df[_i][1] = _y; // store the datapoint
                        _df[_i][2] = _z; // store the datapoint
                        _i++;
                    }
                }

                options.colorCol = 1; // y result of the evaluated formula

                // continue plotting this DataFrame
                this.plotDataFrame(_df, 0, 1, 2, options);
            } else {

                if (mode != POLYGON_MODE) console.warn("mode \"" + mode + "\" unrecognized. Assuming \"" + POLYGON_MODE + "\"");

                //plotFormula
                //-------------------------//
                //         Polygon         //
                //-------------------------//

                // TODO:
                // https://stackoverflow.com/questions/12468906/three-js-updating-geometry-face-materialindex
                // This requires some more work. -inf and +inf values should be indicated by hidden faces around those vertices

                // creating the legend. As this polygon mode does not forward a dataframe to plotDataFrame, creating the legend has to be handled here in plotFormula
                this.populateLegend({ x1title: x1title, x2title: x2title, x3title: x3title, title: title });

                // same goes for colors. plotFormula has to handle them on it's own
                var hueOffset = 0;
                if (this.checkNumber("hueOffset", options.hueOffset)) hueOffset = options.hueOffset;

                var numberDensity = 3;
                if (this.checkNumber("numberDensity", options.numberDensity)) numberDensity = options.numberDensity;

                // might need to recreate the geometry and the matieral
                // is there a plotmesh already? Or maybe a plotmesh that is not created from a 3D Plane (could be a scatterplot or something else)
                // no need to check keepOldPlot because it is allowed to use the old mesh every time (if IsPlotmeshValid says it's valid)
                if (!this.IsPlotmeshValid("polygonFormula")) {
                    this.disposePlotMesh();

                    // create plane, divided into segments
                    var planegeometry = new THREE.PlaneGeometry(this.dimensions.xLen, this.dimensions.zLen, this.dimensions.xVerticesCount, this.dimensions.zVerticesCount);
                    // move it
                    planegeometry.rotateX(Math.PI / 2);
                    planegeometry.translate(this.dimensions.xLen / 2, 0, this.dimensions.zLen / 2);

                    // color the plane
                    var plotmat = [new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        vertexColors: THREE.VertexColors
                    }), new THREE.MeshBasicMaterial({
                        transparent: true,
                        opacity: 0
                    })];

                    for (var _i2 = 0; _i2 < planegeometry.faces.length; _i2++) {
                        var faceColors = planegeometry.faces[_i2].vertexColors;
                        faceColors[0] = new THREE.Color(0);
                        faceColors[1] = new THREE.Color(0);
                        faceColors[2] = new THREE.Color(0);
                    }

                    this.plotmesh = new THREE.Mesh(planegeometry, plotmat);
                    this.plotmesh.name = "polygonFormula";
                }

                // if not, go ahead and manipulate the vertices

                // TODO hiding faces if typeof y is not number:
                // https://stackoverflow.com/questions/11025307/can-i-hide-faces-of-a-mesh-in-three-js

                // modifying vertex positions:
                // https://github.com/mrdoob/three.js/issues/972
                var _y2 = 0;

                var minX2 = this.MathParser.f(0, 0) * this.dimensions.yLen;
                var maxX2 = this.MathParser.f(0, 0) * this.dimensions.yLen;

                /*let faceIndex1 = 0
                let faceIndex2 = 0*/

                for (var vIndex = 0; vIndex < this.plotmesh.geometry.vertices.length; vIndex++) {
                    _y2 = this.MathParser.f(this.plotmesh.geometry.vertices[vIndex].x, this.plotmesh.geometry.vertices[vIndex].z);

                    /*// in each face there are 3 attributes, which stand for the vertex Indices (Which are vIndex basically)
                    // faces are ordered so that the vIndex in .c is in increasing order. If faceIndex.c has an unmatching value, increase
                    // the faceindex and therefore switch to a different face which mathes .c with vIndex.
                    while(faceIndex1 < this.plotmesh.geometry.faces.length && this.plotmesh.geometry.faces[faceIndex1].c < vIndex)
                    {
                        faceIndex1++
                    }
                    // the result of this operation is: faces[faceIndex].c === vIndex
                     // do similar for faceIndex2.
                    while(faceIndex2 < this.plotmesh.geometry.faces.length && this.plotmesh.geometry.faces[faceIndex2].a < vIndex)
                    {
                        faceIndex2++
                    }*/

                    this.plotmesh.geometry.colors[vIndex] = new THREE.Color(0x6600ff);

                    if (!isNaN(_y2) && Math.abs(_y2) != Number.POSITIVE_INFINITY && this.plotmesh.geometry.vertices[vIndex]) {
                        this.plotmesh.geometry.vertices[vIndex].y = _y2;

                        if (_y2 > maxX2) maxX2 = _y2;
                        if (_y2 < minX2) minX2 = _y2;
                    } else {
                        // console.warn("this does not fully work yet. Some vertex are at y = 0 but that face should be invisible")

                        // there are two faces per vertex that have VIndex as face.c
                        /*if(this.plotmesh.geometry.faces[faceIndex1+1] != undefined)
                        {
                            this.plotmesh.geometry.faces[faceIndex1].materialIndex = 1
                            this.plotmesh.geometry.faces[faceIndex1+1].materialIndex = 1
                            this.plotmesh.geometry.faces[faceIndex1+2].materialIndex = 1
                        }
                         //every second face has vIndex as face.a. 0 _ 1 _ 2 _ 3
                        if(this.plotmesh.geometry.faces[faceIndex2] != undefined)
                        {
                            this.plotmesh.geometry.faces[faceIndex2].materialIndex = 1
                        }*/
                        // https://stackoverflow.com/questions/12468906/three-js-updating-geometry-face-materialindex
                    }
                }

                // now colorate higher vertex get a warmer value
                // multiply min and max to lower the hue contrast and make it appear mor friendly
                var maxClrX2 = maxX2 * 1.3;
                var minClrX2 = minX2 * 1.3;
                var getVertexColor = function getVertexColor(v) {
                    var y = _this.plotmesh.geometry.vertices[v].y;
                    return COLORLIB.convertToHeat(y, minClrX2, maxClrX2, hueOffset);
                };

                // update the numbers along the axes. minimum for x1 and x3 are 0, maximum are the length
                // creating and updating textures is a very costly task. Do this in a 15fps cycle
                if (this.fps15 === 0) {
                    for (var _i3 = 0; _i3 < this.plotmesh.geometry.faces.length; _i3++) {
                        var face = this.plotmesh.geometry.faces[_i3];
                        face.vertexColors[0].set(getVertexColor(face.a));
                        face.vertexColors[1].set(getVertexColor(face.b));
                        face.vertexColors[2].set(getVertexColor(face.c));
                    }
                    this.SceneHelper.updateNumbersAlongAxis(numberDensity, this.dimensions.xLen, XAXIS, 0, this.dimensions.xLen);
                    this.SceneHelper.updateNumbersAlongAxis(numberDensity, this.dimensions.yLen, YAXIS, minX2, maxX2);
                    this.SceneHelper.updateNumbersAlongAxis(numberDensity, this.dimensions.zLen, ZAXIS, 0, this.dimensions.zLen);
                }

                if (normalizeX2) {
                    var a = Math.max(Math.abs(maxX2), Math.abs(minX2)); // based on largest |value|
                    var b = Math.abs(maxX2 - minX2); // based on distance between min and max
                    x2frac = Math.max(a, b) / this.dimensions.yLen; // hybrid
                    this.plotmesh.geometry.scale(1, 1 / x2frac, 1);
                }

                // name and write down as children so that it can be rendered
                this.plotmesh.name = "polygonFormula";
                this.SceneHelper.scene.add(this.plotmesh);

                // normals need to be recomputed so that the lighting works after the transformation
                this.plotmesh.geometry.computeFaceNormals();
                this.plotmesh.geometry.computeVertexNormals();
                this.plotmesh.geometry.__dirtyNormals = true;
                // make sure the updated mesh is actually rendered
                this.plotmesh.geometry.verticesNeedUpdate = true;
                this.plotmesh.geometry.colorsNeedUpdate = true;

                this.plotmesh.material.needsUpdate = true;

                this.SceneHelper.makeSureItRenders(this.animationFunc);
            }
        }

        /**
         * plots a .csv string into the container as 3D Plot according to the configuration.
         * @param {string} sCsv string of the .csv file, e.g."a;b;c\n1;2;3\n2;3;4"
         * @param {number} x1col column index used for transforming the x1 axis (x). default: 0
         * @param {number} x2col column index used for transforming the x2 axis (y). default: 1
         * @param {number} x3col column index used for plotting the x3 axis (z). default: 2
         * @param {object} options json object with one or more of the following parameters:
         * - csvIsInGoodShape {boolean}: true if the .csv file is in a good shape. No quotation marks around numbers, no leading and ending whitespaces, no broken numbers (0.123b8),
         * all lines have the same number of columns. true results in more performance. Default: false. If false, the function will try to fix it as good as it can.
         * - separator {string}: separator used in the .csv file. e.g.: "," or ";" as in 1,2,3 or 1;2;3
         * - mode {string}: "barchart" or "scatterplot"
         * - header {boolean}: a boolean value whether or not there are headers in the first row of the csv file. Default true
         * - colorCol {number}: leave undefined or set to -1, if defaultColor should be applied. Otherwise the index of the csv column that contains color information.
         * (0, 1, 2 etc.). Formats of the column within the .csv file allowed:
         * numbers (normalized automatically, range doesn't matter). Numbers are converted to a heatmap automatically.
         * Integers that are used as class for labeled data would result in various different hues in the same way.
         * hex strings ("#f8e2b9"). "rgb(...)" strings. "hsl(...)" strings. strings as labels (make sure to set labeled = true).
         * - normalizeX1 {boolean}: if false, data will not be normalized. Datapoints with high values will be very far away then on the X1 Axis
         * - normalizeX2 {boolean}: if false, data will not be normalized. Datapoints with high values will be very far away then on the X2 Axis (y)
         * - normalizeX3 {boolean}: if false, data will not be normalized. Datapoints with high values will be very far away then on the X3 Axis
         * - title {string}: title of the data
         * - fraction {number}: between 0 and 1, how much of the dataset should be plotted.
         * - labeled {boolean}: true if colorCol contains labels (such as 0, 1, 2 or frog, cat, dog). This changes the way it is colored.
         * Having it false on string-labeled data will throw a warning, but it will continue as it was true
         * - defaultColor {number or string}: examples: #1a3b5c, 0xfe629a, rgb(0.1,0.2,0.3), hsl(0.4,0.5,0.6). Gets applied when either colorCol is -1, undefined or ""
         * - x1frac {number}: by how much to divide the datapoints x1 value to fit into [-1;1]. will be overwritten if normalization is on
         * - x2frac {number}: by how much to divide the datapoints x2 value (y) to fit into [-1;1]. will be overwritten if normalization is on
         * - x3frac {number}: by how much to divide the datapoints x3 value to fit into [-1;1]. will be overwritten if normalization is on
         * - barchartPadding {number}: how much space should there be between the bars? Example: 0.025
         * - dataPointSize {number}: how large the datapoint should be. Default: 0.04
         * - filterColor {boolean}: true: if the column with the index of the parameter "colorCol" contains numbers they are going to be treated
         * as if it was a color. (converted to hexadecimal then). Default false
         * - x1title {string}: title of the x1 axis
         * - x2title {string}: title of the x2 axis
         * - x3title {string}: title of the x3 axis
         * - hueOffset {number}: how much to rotate the hue of the labels. between 0 and 1. Default: 0
         * - keepOldPlot {boolean}: don't remove the old datapoints/bars/etc. when this is true
         * - updateOldData {boolean}: if false, don't overwrite the dataframe that is stored in the oldData-object
         * - barSizeThreshold {number}: smallest allowed y value for the bars. Smaller than that will be hidden. Between 0 and 1. 1 Hides all bars, 0 shows all. Default 0
         * - numberDensity {number}: how many numbers to display when the length (xLen, yLen or zLen) equals 1. A smaller axis displays fewer numbers and a larger axis displays more.
         */

    }, {
        key: "plotCsvString",
        value: function plotCsvString(sCsv, x1col, x2col, x3col) {
            var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

            //---------------------------//
            //  parameter type checking  //
            //---------------------------//

            // a more complete checking will be done in plotDataFrame once the dataframe is generated.
            // only check what is needed in plotCsvString

            if (sCsv === "" || !sCsv) return console.error("dataframe arrived empty");

            // default config
            var separator = ",";
            var title = "";
            var fraction = 1;
            var csvIsInGoodShape = false;
            var header = true; // assume header = true for now so that the parsing is not making false assumptions because it looks at headers

            // make sure options is defined
            if ((typeof options === "undefined" ? "undefined" : _typeof(options)) !== {}) {
                // seems like the user sent some parameters. check them

                // check variables. Overwrite if it's good. If not, default value will remain
                if (this.checkNumber("fraction", options.fraction)) fraction = options.fraction;
                if (this.checkBoolean("csvIsInGoodShape", options.csvIsInGoodShape)) csvIsInGoodShape = options.csvIsInGoodShape;
                if (this.checkBoolean("header", options.header)) header = options.header;

                // check everything else
                if (options.separator != undefined) separator = options.separator;
                if (options.title != undefined) title = options.title;
            } else {
                options = {};
            }

            this.benchmarkStamp("start");

            //plotCsvString
            //-------------------------//
            //         caching         //
            //-------------------------//

            // still the same data?
            // create a very quick checksum sort of string
            var stepsize = sCsv.length / 20 | 0;
            var samples = "";
            for (var i = 0; i < sCsv.length; i += stepsize) {
                samples = samples + sCsv[i];
            } // take everything into account that changes how the dataframe looks after the processing
            var checkstring = (title + sCsv.length + samples + fraction + separator).replace(/[\s\t\n\r]/g, "_");

            // now check if the checksum changed. If yes, remake the dataframe from the input
            if (this.oldData === null || this.oldData.checkstring != checkstring) {

                //plotCsvString
                //-------------------------//
                //       creating df       //
                //-------------------------//
                // and caching it afterwards

                // new csv arrived:

                // transform the sCsv string to a dataframe
                var data = sCsv.split(/[\n\r]+/g);

                if (data[0].trim() === "") // to prevent an error I have encountered when reading a csv from DOM Element innerHTML.
                    // This probably happens when the csv data starts one line below the opening bracket of the Element
                    data = data.slice(-(data.length - 1));
                if (data[data.length - 1].trim() === "") data.pop();

                // now check if the dataframe is empty
                if (data.length === 0) return console.error("dataframe is empty");

                if (fraction < 1) {
                    data = data.slice(0, Math.max(Math.min(3, data.length), data.length * fraction));
                }

                // find out the separator automatically if the user didn't define it
                if (options.separator === undefined || data[0].indexOf(separator) === -1) {
                    // in case of undefined or -1, assume ;
                    separator = ";";

                    if (data[0].indexOf(separator) === -1) separator = ",";

                    if (data[0].indexOf(separator) === -1) separator = /[\s\t]{2,}/g; // tabbed data

                    if (data[0].search(separator) === -1) return console.error("no csv separator/delimiter was detected. Please set separator:\"...\" according to your file format: \"" + data[0] + "\"");

                    console.warn("the specified separator/delimiter was not found. Tried to detect it and came up with \"" + separator + "\". Please set separator =\"...\" according to your file format: \"" + data[0] + "\"");
                }

                if (!csvIsInGoodShape) {
                    // check 5% of the columns to get the highest number of columns available (if not unlucky)
                    var columnCount = 0;
                    for (var _i4 = 0; _i4 < Math.min(data.length, data.length * 0.05 + 10); _i4++) {
                        columnCount = Math.max(columnCount, data[_i4].split(separator).length);
                    }

                    for (var line = 0; line < data.length; line++) {
                        // remove leading and ending whitespaces in data
                        data[line] = data[line].trim().split(separator);

                        // make sure every row has the same number of columns
                        data[line] = data[line].slice(0, columnCount);
                        data[line] = data[line].concat(new Array(columnCount - data[line].length));

                        for (var col = 0; col < data[line].length; col++) {

                            // make sure every column has stored a value. if not (maybe because of faulty csv formats), assume 0
                            if (data[line][col] == undefined) // check for undefined, because slice might create some empty fields if csv is very broken
                                {
                                    data[line][col] = 0;
                                } else {
                                // remove quotation marks "bla";"1";"2"
                                if (data[line][col][0] === "\"") if (data[line][col][data[line][col].length - 1] === "\"") data[line][col] = data[line][col].slice(1, -1);

                                // don't assume that all lines have the same format when looking at the same column
                                // that means every cell has to be parsed

                                // parse if possible. if not leave it as it is
                                var parsed = parseFloat(data[line][col]);
                                if (!isNaN(parsed)) {
                                    data[line][col] = parsed; // number
                                }
                                // check if the recent line was a number. if "", assume 0 then
                                else if (data[line][col] === "" && typeof data[line - 1][col] === "number") {
                                        data[line][col] = 0;
                                    } else {
                                        data[line][col].trim(); // string
                                    }
                            }
                        }
                    }
                } else {
                    // The user trusts the csv and wants maximum performance
                    // that means: no quotation marks and all rows have the same number of columns and contain the same datatypes
                    var startLine = 0;
                    if (header) startLine = 1;

                    // split lines into columns
                    for (var _line = 0; _line < data.length; _line++) {
                        data[_line] = data[_line].split(separator);
                    } // iterate over columns
                    for (var _col = 0; _col < data[0].length; _col++) {
                        // check if that column can be parsed
                        if (!isNaN(parseFloat(data[startLine][_col]))) // if parsable as number 
                            for (var _line2 = 0; _line2 < data.length; _line2++) {
                                // continue like so for all following datapoints/rows/lines without checking again
                                data[_line2][_col] = parseFloat(data[_line2][_col]);
                            }
                    }
                }

                // cache the dataframe. If the same dataframe is used next time, don't parse it again
                this.oldData.dataframe = data;
                this.oldData.checkstring = checkstring;

                this.benchmarkStamp("created the dataframe and cached it");

                // plot the dataframe.
                options.fraction = 1; // Fraction is now 1, because the fraction has already been taken into account

                this.plotDataFrame(data, x1col, x2col, x3col, options);
            } else {
                console.log("using cached dataframe");
                // cached
                // this.oldData != undefined and checkstring is the same
                // same data. Fraction is now 1, because the fraction has already been taken into account
                this.plotDataFrame(this.oldData.dataframe, x1col, x2col, x3col, options);
            }
        }

        /**
         * plots a dataframe on the canvas element which was defined in the constructor of Plot()
         * @param {number[][]} df int[][] of datapoints. [row][column]
         * @param {number} x1col column index used for transforming the x1 axis (x). default: 0
         * @param {number} x2col column index used for transforming the x2 axis (y). default: 1
         * @param {number} x3col column index used for plotting the x3 axis (z). default: 2
         * @param {object} options json object with one or more of the following parameters:
         * - mode {string}: "barchart", "scatterplot" or "lineplot"
         * - header {boolean}: a boolean value whether or not there are headers in the first row of the csv file. Default true
         * - colorCol {number}: leave undefined or set to -1, if defaultColor should be applied. Otherwise the index of the csv column that contains color information.
         * (0, 1, 2 etc.). Formats of the column within the .csv file allowed:
         * numbers (normalized automatically, range doesn't matter). Numbers are converted to a heatmap automatically.
         * Integers that are used as class for labeled data would result in various different hues in the same way.
         * hex strings ("#f8e2b9"). "rgb(...)" strings. "hsl(...)" strings. strings as labels (make sure to set labeled = true).
         * - normalizeX1 {boolean}: if false, data will not be normalized. Datapoints with high values will be very far away then on the X1 Axis
         * - normalizeX2 {boolean}: if false, data will not be normalized. Datapoints with high values will be very far away then on the X2 Axis (y)
         * - normalizeX3 {boolean}: if false, data will not be normalized. Datapoints with high values will be very far away then on the X3 Axis
         * - title {string}: title of the data
         * - fraction {number}: between 0 and 1, how much of the dataset should be plotted.
         * - labeled {boolean}: true if colorCol contains labels (such as 0, 1, 2 or frog, cat, dog). This changes the way it is colored.
         * Having it false on string-labeled data will throw a warning, but it will continue as it was true
         * - defaultColor {number or string}: examples: #1a3b5c, 0xfe629a, rgb(0.1,0.2,0.3), hsl(0.4,0.5,0.6). Gets applied when either colorCol is -1, undefined or ""
         * - x1frac {number}: by how much to divide the datapoints x1 value to fit into [-1;1]. will be overwritten if normalization is on
         * - x2frac {number}: by how much to divide the datapoints x2 value (y) to fit into [-1;1]. will be overwritten if normalization is on
         * - x3frac {number}: by how much to divide the datapoints x3 value to fit into [-1;1]. will be overwritten if normalization is on
         * - barchartPadding {number}: how much space should there be between the bars? Example: 0.025
         * - dataPointSize {number}: how large the datapoint should be. Default: 0.04
         * - filterColor {boolean}: true: if the column with the index of the parameter "colorCol" contains numbers they are going to be treated
         * as if it was a color. (converted to hexadecimal then). Default false
         * - x1title {string}: title of the x1 axis
         * - x2title {string}: title of the x2 axis
         * - x3title {string}: title of the x3 axis
         * - hueOffset {number}: how much to rotate the hue of the labels. between 0 and 1. Default: 0
         * - keepOldPlot {boolean}: don't remove the old datapoints/bars/etc. when this is true
         * - updateOldData {boolean}: if false, don't overwrite the dataframe that is stored in the oldData-object
         * - barSizeThreshold {number}: smallest allowed y value for the bars. Smaller than that will be hidden. Between 0 and 1. 1 Hides all bars, 0 shows all. Default 0
         * - numberDensity {number}: how many numbers to display when the length (xLen, yLen or zLen) equals 1. A smaller axis displays fewer numbers and a larger axis displays more.
         */

    }, {
        key: "plotDataFrame",
        value: function plotDataFrame(df) {
            var x1col = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var x2col = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
            var x3col = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
            var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

            // to optimize for performance, use:
            // {
            //   colorCol: -1 // don't calculate heatmaps
            //   defaultColor: 0xff6600 // whatever you like
            //   normalizeX1: false
            //   normalizeX2: false
            //   normalizeX3: false
            //   updateOldData: true // in addDataPoint this is automatically false, otherwise the oldData-object would be overwritten with a single point
            //   fraction: 0.5 // don't plot everything
            // }
            this.benchmarkStamp("plotDataFrame starts");
            //---------------------------//
            //  parameter type checking  //
            //---------------------------//
            // default config
            var header = false;
            var colorCol = -1;
            var mode = SCATTERPLOT_MODE;
            var normalizeX1 = true;
            var normalizeX2 = true;
            var normalizeX3 = true;
            var title = "";
            var fraction = 1; // TODO
            var labeled = false;
            var defaultColor = 0; // black
            var barchartPadding = 0.5;
            var dataPointSize = 0.04;
            var filterColor = true;
            var x1title = "x1";
            var x2title = "x2";
            var x3title = "x3";
            var hueOffset = 0;
            var keepOldPlot = false;
            var updateOldData = true;
            var barSizeThreshold = 0;
            var x1frac = 1;
            var x2frac = 1;
            var x3frac = 1;
            var numberDensity = 3;

            // TODO probably deprecated won't implement
            // when true, the dataframe is a 2D Array an can be accessed like this: df[x][z] = y
            // it's experiemental and does not work yet for all plotting modes. It's there for performance increasing
            // because sometimes I am calculating a dataframe from a formula and then convert it to that [x][z] shape
            // instead of calculating this shape right away
            // let dfIsA2DMap = false


            // make sure options is defined
            if ((typeof options === "undefined" ? "undefined" : _typeof(options)) === "object") {
                // seems like the user sent some parameters. check them

                // treat empty strings as if it was undefined in those cases:
                if (options.colorCol === "") options.colorCol = undefined;

                // check numbers. Overwrite if it's good. If not, default value will remain
                if (options.colorCol != undefined && options.colorCol >= df[0].length) {
                    console.error("column with index " + options.colorCol + ", used as colorCol, is not existant in the dataframe. Disabling coloration");
                    options.colorCol = -1;
                }

                if (this.checkNumber("fraction", options.fraction)) fraction = options.fraction;
                if (this.checkNumber("barchartPadding", options.barchartPadding)) barchartPadding = options.barchartPadding;
                if (this.checkNumber("hueOffset", options.hueOffset)) hueOffset = options.hueOffset;
                if (this.checkNumber("numberDensity", options.numberDensity)) numberDensity = options.numberDensity;
                if (this.checkNumber("x1frac", options.x1frac)) x1frac = options.x1frac;
                if (this.checkNumber("x2frac", options.x2frac)) x2frac = options.x2frac;
                if (this.checkNumber("x3frac", options.x3frac)) x3frac = options.x3frac;
                if (this.checkNumber("colorCol", options.colorCol)) colorCol = options.colorCol;
                if (this.checkNumber("dataPointSize", options.dataPointSize)) dataPointSize = options.dataPointSize;
                if (this.checkNumber("barSizeThreshold", options.barSizeThreshold)) barSizeThreshold = options.barSizeThreshold;

                if (dataPointSize <= 0) console.error("datapoint size is <= 0. Datapoints will be invisible in scatterplot and lineplot modes");

                if (barchartPadding >= 1 || barchartPadding < 0) {
                    barchartPadding = 0;
                    console.error("barchartPadding is invalid. maximum of 1 and minimum of 0 accepted. Now continuing with barchartPadding = " + barchartPadding);
                }

                // check booleans. Overwrite if it's good. If not, default value will remain
                if (this.checkBoolean("labeled", options.labeled)) labeled = options.labeled;
                if (this.checkBoolean("normalizeX1", options.normalizeX1)) normalizeX1 = options.normalizeX1;
                if (this.checkBoolean("normalizeX2", options.normalizeX2)) normalizeX2 = options.normalizeX2;
                if (this.checkBoolean("normalizeX3", options.normalizeX3)) normalizeX3 = options.normalizeX3;
                if (this.checkBoolean("header", options.header)) header = options.header;
                if (this.checkBoolean("filterColor", options.filterColor)) filterColor = options.filterColor;
                if (this.checkBoolean("keepOldPlot", options.keepOldPlot)) keepOldPlot = options.keepOldPlot;
                if (this.checkBoolean("updateOldData", options.updateOldData)) updateOldData = options.updateOldData;

                // check everything else
                if (options.title != undefined) title = options.title;
                if (options.defaultColor != undefined) defaultColor = options.defaultColor;
                if (options.mode != undefined) mode = options.mode;
                if (options.x1title != undefined) x1title = options.x1title;
                if (options.x2title != undefined) x2title = options.x2title;
                if (options.x3title != undefined) x3title = options.x3title;
            }

            if (!this.checkNumber("x1col", x1col)) x1col = Math.min(0, df[0].length - 1);
            if (!this.checkNumber("x2col", x2col)) x2col = Math.min(1, df[0].length - 1);
            if (!this.checkNumber("x3col", x3col)) x3col = Math.min(2, df[0].length - 1);

            //>= because comparing indices with numbers
            if (x1col >= df[0].length || x2col >= df[0].length || x3col >= df[0].length) {
                console.error("one of the colum indices is out of bounds. The maximum index in this dataframe is " + (df[0].length - 1) + ". x1col: " + x1col + " x2col:" + x2col + " x3col:" + x3col);
                // detct the rightmost column index that contains numberes
                var maximumColumn = 2; // to match the default settings of 0, 1 and 2, start at 2
                var line = 0;

                if (df[1] != undefined) // if possible try to skip the first line, because it might contain a header
                    line = 1;

                for (; maximumColumn >= 0; maximumColumn--) {
                    if (!isNaN(df[line][maximumColumn])) break;
                }x1col = Math.min(x1col, maximumColumn);
                x2col = Math.min(x2col, maximumColumn);
                x3col = Math.min(x3col, maximumColumn);
            }

            if (fraction < 1) {
                // at least 3 rows if possible to support headers and two distinct datapoints
                df = df.slice(0, Math.max(Math.min(3, df.length), df.length * fraction));
            }

            // automatic header detection, if no option was provided and the dataframe has enough rows to support headers and data
            if (options.header === undefined && df.length >= 2) {
                // find out automatically if they are headers or not
                // take x1col, check first line type (string/NaN?) then second line type (number/!NaN?)
                // if both are yes, it's probably header = true
                if (isNaN(df[0][x1col]) && !isNaN(df[1][x1col])) {
                    console.log("detected headers, first csv line is not going to be plotted therefore. To prevent this, set header = false");
                    header = true;
                }
            }

            var headerRow = void 0;
            if (header) {
                if (df.length === 1) return console.error("dataframe is empty besides headers");

                headerRow = df[0];
                // still set to default values?
                if (x1title === "x1") x1title = headerRow[x1col];
                if (x2title === "x2") x2title = headerRow[x2col];
                if (x3title === "x3") x3title = headerRow[x3col];
                // remove the header from the dataframe. Usually you would just change the starting pointer for
                // the array. don't know if something like that exists in javascript
                df = df.slice(1, df.length);
            }

            // after all the modifying, is the dataframe still present?
            if (df.length === 0) return console.error("dataframe is empty");

            this.benchmarkStamp("checked Parameters");

            // only for scatterplot relevant at the moment. Going to be called when the mode is detected as scatterplot

            // plotDataFrame
            //-------------------------//
            //     coloring labels     //
            //-------------------------//
            // creates an array "dfColors" that holds the color information
            //(unnormalized numbers or color strings (#fff, rgb, hsl)) for each vertex (by index)

            // headers are already removed from df by now

            // if this plot is not adding something to an existing plot, don't pass old labels to getColorMap
            if (!keepOldPlot) {
                this.oldData.labelColorMap = {};
                this.oldData.numberOfLabels = 0;
            }

            var colorMap = void 0,
                dfColors = void 0;
            // no animation 15fps reduction here, as this has to happen for every new datapoint
            if (mode !== BARCHART_MODE || labeled) // barcharts can be labeled aswell. if labeled true, get the color map for that.
                {
                    colorMap = COLORLIB.getColorMap(df, colorCol, defaultColor, labeled, header, filterColor, hueOffset, this.oldData.labelColorMap, this.oldData.numberOfLabels);
                    dfColors = colorMap.dfColors;
                    this.oldData.labelColorMap = colorMap.labelColorMap;
                    this.oldData.numberOfLabels = colorMap.numberOfLabels;
                }

            // display information about the labels
            this.populateLegend({ colorMap: colorMap, x1title: x1title, x2title: x2title, x3title: x3title, title: title });

            // by this point only dfColors stays relevant. So the function above can be easily moved to a different class to clear up the code here


            // plotDataFrame
            //-------------------------//
            //       normalizing       //
            //-------------------------//
            // finds out by how much the values (as well as colors) to divide and for the colors also a displacement

            // what is happening here?
            // minX1, maxX2, etc. are being loaded from the oldData object. They initially have 0 values
            // so they are zero now
            // then the dataframe gets analyzed (if enabled) and the min and max values are updated

            // if it is disabled, the old values from the oldData object are not updated. this is the default case for addDataPoint.
            // that means new datapoint might be so far away from the initial plot that they cannot be seen anymore, because it gets scaled according to the old normalization information
            // if the values of that datapoint are so ridiculously large compared to the initial plot
            // what is the initial plot? that's the dataframe one plotted initially (for example using plotCsvString(...) before using addDataPoint

            // normalize, so that the farthest away point is still within the xLen yLen zLen frame
            // TODO logarithmic normalizing (what about the displayed numbers, how are they going to get logarithmic scaling? What about the helper lines)

            var lineToAssumeFirstMinMaxValues = 0;
            if (df.length >= 2)
                // assume second line if possible, because headers might be accidentally still there (because of wrong configuration)
                lineToAssumeFirstMinMaxValues = 1;

            // the default values are 0. after the normalization loops the case of
            // them still being 0 will be handled by assigning 1 to x1-x3frac
            var minX1 = void 0,
                maxX1 = void 0,
                minX2 = void 0,
                maxX2 = void 0,
                minX3 = void 0,
                maxX3 = void 0;
            // don't use deprecated values
            if (!keepOldPlot || !this.IsPlotmeshValid(mode)) {
                this.oldData.normalization.minX1 = 0;
                this.oldData.normalization.maxX1 = 0;
                this.oldData.normalization.minX2 = 0;
                this.oldData.normalization.maxX2 = 0;
                this.oldData.normalization.minX3 = 0;
                this.oldData.normalization.maxX3 = 0;
            }
            minX1 = this.oldData.normalization.minX1;
            maxX1 = this.oldData.normalization.maxX1;
            minX2 = this.oldData.normalization.minX2;
            maxX2 = this.oldData.normalization.maxX2;
            minX3 = this.oldData.normalization.minX3;
            maxX3 = this.oldData.normalization.maxX3;

            // console.error({minX1,maxX1,minX2,maxX2,minX3,maxX3})

            // keep old plot and normalization has not been calculated yet?
            // if(keepOldPlot && this.oldData.normalization === {})
            if (normalizeX1) {
                // if default values are still in the variables, use the first entry in the dataframe
                if (maxX1 === 0 && minX1 === 0) {
                    maxX1 = df[lineToAssumeFirstMinMaxValues][x1col];
                    minX1 = df[lineToAssumeFirstMinMaxValues][x1col];
                }

                // determine min and max for normalisation
                for (var i = 0; i < df.length; i++) {
                    if (df[i][x1col] > maxX1) maxX1 = df[i][x1col];
                    if (df[i][x1col] < minX1) minX1 = df[i][x1col];
                }

                // take care of normalizing it together with the in oldData stored dataframe in case keepOldPlot is true
                if (keepOldPlot) for (var _i5 = 0; _i5 < this.oldData.dataframe.length; _i5++) {
                    var check = this.oldData.dataframe[_i5][x1col];
                    if (check > maxX1) maxX1 = check;
                    if (check < minX1) minX1 = check;
                }
            }

            if (mode !== BARCHART_MODE) // barcharts need their own way of normalizing x2, because they are the sum of closeby datapoints (interpolation) (and also old datapoints, depending on keepOldPlot)
                {
                    if (normalizeX2) {
                        // if default values are still in the variables, use the first entry in the dataframe
                        if (maxX2 === 0 && minX2 === 0) {
                            maxX2 = df[lineToAssumeFirstMinMaxValues][x2col];
                            minX2 = df[lineToAssumeFirstMinMaxValues][x2col];
                        }

                        // determine min and max for normalisation
                        for (var _i6 = 0; _i6 < df.length; _i6++) {
                            if (df[_i6][x2col] > maxX2) maxX2 = df[_i6][x2col];
                            if (df[_i6][x2col] < minX2) minX2 = df[_i6][x2col];
                        }

                        // take care of normalizing it together with the in oldData stored dataframe in case keepOldPlot is true
                        if (keepOldPlot) for (var _i7 = 0; _i7 < this.oldData.dataframe.length; _i7++) {
                            var _check = this.oldData.dataframe[_i7][x2col];
                            if (_check > maxX2) maxX2 = _check;
                            if (_check < minX2) minX2 = _check;
                        }
                    }
                }

            if (normalizeX3) {
                // if default values are still in the variables, use the first entry in the dataframe
                if (maxX3 === 0 && minX3 === 0) {
                    maxX3 = df[lineToAssumeFirstMinMaxValues][x3col];
                    minX3 = df[lineToAssumeFirstMinMaxValues][x3col];
                }

                // determine min and max for normalisation
                for (var _i8 = 0; _i8 < df.length; _i8++) {
                    if (df[_i8][x3col] > maxX3) maxX3 = df[_i8][x3col];
                    if (df[_i8][x3col] < minX3) minX3 = df[_i8][x3col];
                }

                // take care of normalizing it together with the in oldData stored dataframe in case keepOldPlot is true
                if (keepOldPlot) for (var _i9 = 0; _i9 < this.oldData.dataframe.length; _i9++) {
                    var _check2 = this.oldData.dataframe[_i9][x3col];
                    if (_check2 > maxX3) maxX3 = _check2;
                    if (_check2 < minX3) minX3 = _check2;
                }
            }

            //x1frac = Math.max(Math.abs(maxX1), Math.abs(minX1)) // based on largest |value|
            x1frac = Math.abs(maxX1 - minX1); // based on distance between min and max
            if (x1frac === 0) x1frac = 1; // all numbers are the same, therefore maxX1 equals minX1, therefore x1frac is 0. prevent divison by zero

            x2frac = Math.abs(maxX2 - minX2);
            if (x2frac === 0) x2frac = 1;

            x3frac = Math.abs(maxX3 - minX3);
            if (x3frac === 0) x3frac = 1;

            this.benchmarkStamp("normalized the data");

            var colors = { dfColors: dfColors, hueOffset: hueOffset };
            var columns = { x1col: x1col, x2col: x2col, x3col: x3col };
            var normalization = { normalizeX1: normalizeX1, normalizeX2: normalizeX2, normalizeX3: normalizeX3, x1frac: x1frac, x2frac: x2frac, x3frac: x3frac, minX1: minX1, minX2: minX2, minX3: minX3, maxX1: maxX1, maxX2: maxX2, maxX3: maxX3 };
            var appearance = { keepOldPlot: keepOldPlot, barchartPadding: barchartPadding, barSizeThreshold: barSizeThreshold, dataPointSize: dataPointSize, labeled: labeled };
            var dimensions = { xLen: this.dimensions.xLen, yLen: this.dimensions.yLen, zLen: this.dimensions.zLen };

            if (mode === BARCHART_MODE) {

                // plotDataFrame
                //-------------------------//
                //        Bar Chart        //
                //-------------------------//

                (0, _Barchart2.default)(this, df, colors, columns, normalization, appearance, this.SceneHelper.cameraMode);
                // those values got overwritten in barchart(...):
                minX2 = normalization.minX2;
                maxX2 = normalization.maxX2;
                x2frac = normalization.x2frac;

                this.benchmarkStamp("made a barchart");
            }
            /*else if(mode === "polygon")
            {
                 // plotDataFrame
                //-------------------------//
                //       3D-Mesh Plot      //
                //-------------------------//
                 // I unfortunatelly think this can't work
                 //(as long as the datapoint coordinates are not grid like.)
                // if they are, the code would have to detect the resolution and then an easy algorithm can be run over the
                // datapoints to connect triangles with the nearest vertices and leave those out that are not existant
                 // I could try to align the datapoints to a grid and maybe even interpolating it, but when there are only few datapoints
                // in some parts of the "landscape", there won't be a polygon created, because there would still be spaces in the grid
                 // the only way i can think of would be a "density based clustering like with a dynamic radius" kind of approach that checks for intersections
                // because edges should not cross each other. It would be ridiculously complex and I really don't have the time for that during my studies
                 // one could also:
                // 1. align the scattered datapoints to a grid (interpolated, that means add the datapoints y-value to nearby grid positions mulitplied with (1-distance))
                //2. connect triangles when datapoints are directly next to each other (go clockwise around the grid positions that are one step away)
                //3. datapoints that are still don't connected to anything receive a circle sprite OR connect themself to the 2 nearest vertices
                // the grid resolution would determine how well the polygon can connect
              }*/
            else if (mode === LINEPLOT_MODE) {

                    // plotDataFrame
                    //-------------------------//
                    //        lineplot         //
                    //-------------------------//

                    (0, _Lineplot2.default)(this, df, colors, columns, normalization, appearance, dimensions);

                    this.benchmarkStamp("made a lineplot");
                } else {

                    // plotDataFrame
                    //-------------------------//
                    //       scatterplot       //
                    //-------------------------//
                    // This is the default mode

                    if (mode !== SCATTERPLOT_MODE) console.warn("mode \"" + mode + "\" unrecognized. Assuming \"scatterplot\"");

                    (0, _Scatterplot2.default)(this, df, colors, columns, normalization, appearance, dimensions);

                    this.benchmarkStamp("made a scatterplot");
                }

            // plotDataFrame
            //-------------------------//
            //       Axes Numbers      //
            //-------------------------//

            // if the mode changed, recreate the numbers because the normalization might have changed
            if (this.oldData.options.mode !== mode) {
                this.SceneHelper.disposeAllAxesNumbers();
                this.axesNumbersNeedUpdate = true;
            }

            if (this.SceneHelper.axes) {
                // remember that axes get disposed when the dimensions (xLen, yLen, zLen) are changing
                // so updateNumbersAlongAxis should get called (that means updatex_ should be true) when the numbers don't exist or something
                // UPDATE: I think it's best that settings like that have to be done before making the plot

                var xLen = this.dimensions.xLen;
                var yLen = this.dimensions.yLen;
                var zLen = this.dimensions.zLen;

                // decide about the visibility
                var updatex1 = this.axesNumbersNeedUpdate || normalizeX1 && this.oldData.normalization.maxX1 !== maxX1 && this.oldData.normalization.minX1 !== minX1;
                var updatex2 = this.axesNumbersNeedUpdate || normalizeX2 && this.oldData.normalization.maxX2 !== maxX2 && this.oldData.normalization.minX2 !== minX2;
                var updatex3 = this.axesNumbersNeedUpdate || normalizeX3 && this.oldData.normalization.maxX3 !== maxX3 && this.oldData.normalization.minX3 !== minX3;

                this.axesNumbersNeedUpdate = false;

                this.oldData.normalization = {};
                this.oldData.normalization.minX1 = minX1;
                this.oldData.normalization.maxX1 = maxX1;
                this.oldData.normalization.minX2 = minX2;
                this.oldData.normalization.maxX2 = maxX2;
                this.oldData.normalization.minX3 = minX3;
                this.oldData.normalization.maxX3 = maxX3;
                this.oldData.numberDensity = numberDensity;

                // creating and updating textures is a very costly task. Do this in a 15fps cycle
                if (this.fps15 === 0) {
                    if (updatex1) {
                        this.SceneHelper.updateNumbersAlongAxis(numberDensity, xLen, XAXIS, minX1, maxX1, this.animationFunc !== null);
                    }

                    // because barcharts are not normalized in the way, that the highest bar is as high as yLen and that the lowest is flat (0) (like scatterplots)
                    // they have negative bars. So they are normalized a little bit differently. So the axes have to be numbered in a slightly different way
                    // minX2 is important for the positioning of the axis number. But in the case of barcharts, it needs to be 0, because the whole plot is not moved
                    // to the top by minX1. axesNumbersNeedUpdateNumbers basically recreates the height of the highest bar/datapoint in the 3D space.
                    if (updatex2) {
                        var minX2_2 = minX2;
                        var yLen_2 = yLen;
                        if (mode === BARCHART_MODE) {
                            minX2_2 = 0;
                            yLen_2 = yLen * (maxX2 - minX2_2) / x2frac;
                        }
                        this.SceneHelper.updateNumbersAlongAxis(numberDensity, yLen_2, YAXIS, minX2_2, maxX2, this.animationFunc !== null);
                    }

                    if (updatex3) {
                        this.SceneHelper.updateNumbersAlongAxis(numberDensity, zLen, ZAXIS, minX3, maxX3, this.animationFunc !== null);
                    }
                }
            } else {
                // make sure to update those, no matter what's going on with the axis
                // they are needed for addDataPoint, because otherwise one would have
                // to iteate over the complete dataset including the new point again.
                this.oldData.normalization = {};
                this.oldData.normalization.minX1 = minX1;
                this.oldData.normalization.maxX1 = maxX1;
                this.oldData.normalization.minX2 = minX2;
                this.oldData.normalization.maxX2 = maxX2;
                this.oldData.normalization.minX3 = minX3;
                this.oldData.normalization.maxX3 = maxX3;
            }

            this.oldData.options.mode = mode;

            // plotDataFrame
            //-------------------------//
            //         History         //
            //-------------------------//
            // used for addDataPoint to store what was plotted the last time
            // also used to store the material in some cases so that it does not have to be recreated each time

            // now that the script arrived here, store the options to make easy redraws possible
            // update cache

            // those are always handy to remember and they are needed in some cases
            this.oldData.normalization.x1frac = x1frac;
            this.oldData.normalization.x2frac = x2frac;
            this.oldData.normalization.x3frac = x3frac;

            if (updateOldData === true) // if updating is allowed. is only important for the dataframe basically
                {
                    if (headerRow != undefined) this.oldData.dataframe = [headerRow].concat(df);else this.oldData.dataframe = df;

                    this.oldData.x1col = x1col;
                    this.oldData.x2col = x2col;
                    this.oldData.x3col = x3col;

                    this.oldData.options = options;
                }

            this.SceneHelper.makeSureItRenders(this.animationFunc);
        }

        /**
         * repeats the drawing using the dataframe memorized in oldData, but adds a new datapoint to it
         * @param {any} newDatapoint Array that contains the attributes of the datapoints in terms of x1, x2, x3, x4, x5 etc.
         * @param {object} options json object with one or more of the following parameters:
         * - mode {string}: "barchart", "scatterplot" or "lineplot"
         * - colorCol {number}: leave undefined or set to -1, if defaultColor should be applied. Otherwise the index of the csv column that contains color information.
         * (0, 1, 2 etc.). Formats of the column within the .csv file allowed:
         * numbers (normalized automatically, range doesn't matter). Numbers are converted to a heatmap automatically.
         * Integers that are used as class for labeled data would result in various different hues in the same way.
         * hex strings ("#f8e2b9"). "rgb(...)" strings. "hsl(...)" strings. strings as labels (make sure to set labeled = true).
         * - normalizeX1 {boolean}: if false, data will not be normalized. Datapoints with high values will be very far away then on the X1 Axis
         * - normalizeX2 {boolean}: if false, data will not be normalized. Datapoints with high values will be very far away then on the X2 Axis (y)
         * - normalizeX3 {boolean}: if false, data will not be normalized. Datapoints with high values will be very far away then on the X3 Axis
         * - title {string}: title of the data
         * - fraction {number}: between 0 and 1, how much of the dataset should be plotted.
         * - labeled {boolean}: true if colorCol contains labels (such as 0, 1, 2 or frog, cat, dog). This changes the way it is colored.
         * Having it false on string-labeled data will throw a warning, but it will continue as it was true
         * - defaultColor {number or string}: examples: #1a3b5c, 0xfe629a, rgb(0.1,0.2,0.3), hsl(0.4,0.5,0.6). Gets applied when either colorCol is -1, undefined or ""
         * - x1frac {number}: by how much to divide the datapoints x1 value to fit into [-1;1]. will be overwritten if normalization is on
         * - x2frac {number}: by how much to divide the datapoints x2 value (y) to fit into [-1;1]. will be overwritten if normalization is on
         * - x3frac {number}: by how much to divide the datapoints x3 value to fit into [-1;1]. will be overwritten if normalization is on
         * - barchartPadding {number}: how much space should there be between the bars? Example: 0.025
         * - dataPointSize {number}: how large the datapoint should be. Default: 0.04
         * - filterColor {boolean}: true: if the column with the index of the parameter "colorCol" contains numbers they are going to be treated
         * as if it was a color. (converted to hexadecimal then). Default false
         * - x1title {string}: title of the x1 axis
         * - x2title {string}: title of the x2 axis
         * - x3title {string}: title of the x3 axis
         * - hueOffset {number}: how much to rotate the hue of the labels. between 0 and 1. Default: 0
         * - keepOldPlot {boolean}: don't remove the old datapoints/bars/etc. when this is true
         * - barSizeThreshold {number}: smallest allowed y value for the bars. Smaller than that will be hidden. Between 0 and 1. 1 Hides all bars, 0 shows all. Default 0
         * - numberDensity {number}: how many numbers to display when the length (xLen, yLen or zLen) equals 1. A smaller axis displays fewer numbers and a larger axis displays more.
         */

    }, {
        key: "addDataPoint",
        value: function addDataPoint(newDatapoint) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            // overwrite old options
            for (var key in options) {
                this.oldData.options[key] = options[key];
            } // default keepOldPlot, but make it possible to overwrite it.
            this.oldData.options.keepOldPlot = true; // true, so that the old plot gets extended with the new datapoint
            if (options.keepOldPlot != undefined) this.oldData.options.keepOldPlot = options.keepOldPlot;

            // the following have to be like this:
            this.oldData.options.header = false; // no header in newDataPoint
            this.oldData.options.updateOldData = false; // false, because don't delete the original dataframe from cache
            this.oldData.options.maxX1;

            // those default values are important to be like this.
            if (options.normalizeX1 === undefined) this.oldData.options.normalizeX1 = false;
            if (options.normalizeX2 === undefined) this.oldData.options.normalizeX2 = false;
            if (options.normalizeX3 === undefined) this.oldData.options.normalizeX3 = false;
            // if(this.oldData.options.normalizeX1 || this.oldData.options.normalizeX2 || this.oldData.options.normalizeX3)
            //     console.warn("addDataPoint with turned on normalization options will not align the new datapoint with the old plots normalization.")

            // create the datapoint data structure (an array) from this
            if (typeof newDatapoint === "string") {
                newDatapoint = newDatapoint.split(this.oldData.separator);
                for (var i = 0; i < newDatapoint.length; i++) {
                    newDatapoint[i] = newDatapoint[i].trim();
                }
            }

            // create a new dataframe from scratch if non existant
            this.oldData.dataframe[this.oldData.dataframe.length] = newDatapoint;

            if (newDatapoint.length != this.oldData.dataframe[0].length) return console.error("the new datapoint does not match the number of column in the in oldData stored dataframe (" + newDatapoint.length + " != " + this.oldData.dataframe[0].length + ")");

            // because of keepOldPlot, only hand the newDatapoint over to plotDataFrame
            this.plotDataFrame([newDatapoint], this.oldData.x1col, this.oldData.x2col, this.oldData.x3col, this.oldData.options // oldData.options got overwritten in this function
            );

            // destroy the in oldData stored string csv checkstring, indicate that the dataframe has been modified by addDataPoint
            // do this, because otherwise when plotting the same (initial) dataframe again it might not realize that the in oldData stored dataframe has
            // been extended by addDataPoint, so plotCsvString might use the in oldData stored (longer) dataframe than the one passed as parameter
            this.oldData.checkstring += "_addDP";

            // numbers might change
            if (options.normalizeX1 || options.normalizeX2 || options.normalizeX3) {
                this.axesNumbersNeedUpdate = true;
            }

            return 0;
        }

        /**
         * updates the legend with new information. basically recreates the innerHTML of this.legend.element
         * @param {object} colorMap COLORLIB.getColorMap(...) information. can be null
         * @param {object} options json object containing one or more of x1title, x2title, x3title and title
         */

    }, {
        key: "populateLegend",
        value: function populateLegend(options) {
            // update the legend with the label color information
            // open legend, add title
            var legendHTML = "";
            if (options.title && options.title != "") legendHTML += "<h1>" + options.title + "</h1>";

            // add info about the labels and the colors
            if (options.colorMap && options.colorMap.labelColorMap != {}) {
                // label colors:
                legendHTML += "<table class =\"jsP3D_labelColorLegend\"><tbody>"; // can't append to innerHTML directly for some funny reason
                for (var key in options.colorMap.labelColorMap) {
                    legendHTML += "<tr>";
                    legendHTML += "<td><span class =\"jsP3D_labelColor\" style =\"background-color:#" + options.colorMap.labelColorMap[key].color.getHexString() + ";\"></span></td>";
                    legendHTML += "<td>" + key + "</td>";
                    legendHTML += "</tr>";
                }
                legendHTML += "</tbody></table>";
            }

            // axes titles:
            legendHTML += "<table class =\"jsP3D_axesTitleLegend\"><tbody>";
            if (options.x1title) legendHTML += "<tr><td>x:</td><td>" + options.x1title + "</td></tr>";
            if (this.SceneHelper.cameraMode != TOPCAMERA && options.x2title) legendHTML += "<tr><td>y:</td><td>" + options.x2title + "</td></tr>";
            if (options.x3title) legendHTML += "<tr><td>z:</td><td>" + options.x3title + "</td></tr>";
            legendHTML += "</tbody></table>";

            // is the content similar? Then don't overwrite because it will trigger rerenders every time (observed in the chromium Elements view)
            if (this.legend.element.innerHTML.trim() != legendHTML) // for some reason I have to trim the current innerHTML
                this.legend.element.innerHTML = legendHTML;
        }

        /**
         * private method to to initialize the legend variables and creates a dom object for it. Happens in the constructor.
         * @private
         */

    }, {
        key: "initializeLegend",
        value: function initializeLegend() {
            this.legend = {};
            this.legend.element = document.createElement("div");
            this.legend.element.className = "jsP3D_legend";
            this.legend.title = "";
            this.legend.x1title = "";
            this.legend.x2title = "";
            this.legend.x3title = "";
        }

        /**
         * appends the legend to a specific container. It is already generated at this point.
         * 
         * Make sure to style it using the css of your website because otherwise the colored
         * span elements will not be visible.
         * 
         * @param {DOM} container
         * @return returns the dom element of the legend
         */

    }, {
        key: "createLegend",
        value: function createLegend(container) {
            if (container === null) return console.error("container for createLegend not found");
            container.appendChild(this.legend.element);
            return this.legend.element;
        }

        /**
         * if plotmesh is invalid it gets cleared. The point of this is that materials and such don't have to be recreated again and again
         * It checks the mesh.type, mesh.name and mesh.geometry.type if it matches with the parameter check
         * @return returns true if plotmesh is still valid and existant
         * @private
         */

    }, {
        key: "IsPlotmeshValid",
        value: function IsPlotmeshValid(check) {
            var obj = this.plotmesh;

            if (obj === null) {
                this.updatePlotmesh = false;
                return false;
            }

            // it either has children because it's a group it has a geometry. if both are undefined, it's not valid anymore.

            // instead of setting it to true i directly dispose the mesh from now on
            /*if(this.updatePlotmesh === true) // this is the only place where this.updatePlotmesh is taken into account
            {
                // this.SceneHelper.disposeMesh(obj)
                // this.updatePlotmesh = false
                return false
            }*/

            if (obj.name === check) return true;

            if (obj.type === check) return true;

            // this.SceneHelper.disposeMesh(obj)
            // this.updatePlotmesh = false
            return false;
        }

        /**
         * proper plotmesh removal
         */

    }, {
        key: "disposePlotMesh",
        value: function disposePlotMesh() {
            this.SceneHelper.disposeMesh(this.plotmesh);
            // this.clearOldData() // don't do that, because maybe addDataPoint is used afterwards and that relies on oldData
            this.plotmesh = null;
        }

        /**
         * clears the oldData-object and initializes it
         * @private
         */

    }, {
        key: "clearOldData",
        value: function clearOldData() {
            this.oldData = {};

            this.oldData.normalization = {
                minX1: 0,
                maxX1: 0,
                minX2: 0,
                maxX2: 0,
                minX3: 0,
                maxX3: 0
            };

            this.oldData.labelColorMap = {};
            this.oldData.numberOfLabels = 0;
            this.oldData.material = null;
            this.oldData.dataframe = [];
            this.oldData.x1col = 0;
            this.oldData.x2col = 1;
            this.oldData.x3col = 2;
            this.oldData.checkstring = "";
            this.oldData.barsGrid = null;

            this.oldData.options = {};
            this.oldData.options.mode = "";
        }

        /**
         * sets the container of this plot
         * TODO what happens when this function is used during runtime? Can the container be changed? What if the containers have different width and height?
         * @param {object} container DOM-Element of the new container
         */

    }, {
        key: "setContainer",
        value: function setContainer(container) {
            if ((typeof container === "undefined" ? "undefined" : _typeof(container)) != "object") return console.error("param of setContainer (container) should be a DOM-Object. This can be obtained using e.g. document.getElementById(\"foobar\")");

            this.container = container;
            this.SceneHelper.renderer.setSize(container.offsetWidth, container.offsetHeight);

            this.container.appendChild(this.SceneHelper.renderer.domElement);
        }

        /**
         * not used for initialization, but rather for changing dimensions during runtime. will trigger axes recreation
         * Note that this has to be done before creating a plot
         * @param {object} dimensions json object can contain the following:
         * - xRes number of vertices for the x-axis
         * - zRes number of vertices for the z-axis
         * - xLen length of the x-axis. This is for the frame for data normalisation and formula plotting
         * - yLen length of the y-axis. This is for the frame for data normalisation and formula plotting
         * - zLen length of the z-axis. This is for the frame for data normalisation and formula plotting
         */

    }, {
        key: "setDimensions",
        value: function setDimensions(dimensions) {
            if ((typeof dimensions === "undefined" ? "undefined" : _typeof(dimensions)) != "object") return console.error("param of setDimensions (dimensions) should be a json object containing at least one of xRes, zRes, xLen, yLen or zLen");

            // vertices counts changed, so the mesh has to be recreated
            this.disposePlotMesh();
            this.clearOldData();

            if (dimensions.yLen == 0) {
                dimensions.yLen = 0.001; // 0 will cause trouble because determinants become zero
                this.SceneHelper.changeCameraMode(TOPCAMERA); // uses an orthographic camera
            } else {
                this.SceneHelper.changeCameraMode(DEFAULTCAMERA);
            }

            if (dimensions.xRes != undefined) this.dimensions.xRes = Math.max(1, Math.abs(dimensions.xRes | 0));
            if (dimensions.zRes != undefined) this.dimensions.zRes = Math.max(1, Math.abs(dimensions.zRes | 0));
            if (dimensions.xLen != undefined) this.dimensions.xLen = Math.abs(dimensions.xLen);
            if (dimensions.yLen != undefined) this.dimensions.yLen = Math.abs(dimensions.yLen);
            if (dimensions.zLen != undefined) this.dimensions.zLen = Math.abs(dimensions.zLen);

            if (dimensions.xVerticesCount != undefined || dimensions.zVerticesCount != undefined) console.warn("xVerticesCount and zVerticesCount cannot be manually overwritten. They are the product of Length and Resolution.", "Example: setDimensions({xRes:10, xLen:2}) xVerticesCount now has a value of 20");

            // no need to check here if specific parameters were defined in dimensions, because this accesses
            // this.dimensions which contains those values, that were not defined here as parameter
            this.dimensions.xVerticesCount = Math.max(1, this.dimensions.xLen * this.dimensions.xRes | 0);
            this.dimensions.zVerticesCount = Math.max(1, this.dimensions.zLen * this.dimensions.zRes | 0);

            // move
            this.SceneHelper.centerCamera(this.dimensions);
            this.SceneHelper.updateAxesSize(this.dimensions, this.oldData.normalization);

            // axes have to be updates aswellc

            // takes effect once the mesh gets created from new, except for the lengths indicated by the axes. those update immediatelly
            //this.SceneHelper.render()
        }

        /*-- Animations --*/

        /**
         * tells this object to animate this. You can stop the animation using stopAnimation()
         * @example
         * 
         *      var i = 0;
         *      plot.animate(function() {
         *              i += 0.01;
         *              plot.plotFormula("sin(2*x1+i)*sin(2*x2-i)",BARCHART_MODE);
         *      }.bind(this))
         * @param {function} animationFunc
         */

    }, {
        key: "animate",
        value: function animate(animationFunc) {
            this.SceneHelper.onChangeCamera = function () {};
            this.animationFunc = animationFunc;
            this.callAnimation();
        }

        /**
         * stops the ongoing animation. To start an animation, see animate(...)
         */

    }, {
        key: "stopAnimation",
        value: function stopAnimation() {
            this.animationFunc = null;
            this.fps15 = 0;
        }

        /**
         * executes the animation. Use animate(...) if you want to set up an animation
         * @private
         */

    }, {
        key: "callAnimation",
        value: function callAnimation() {
            var _this2 = this;

            this.fps15 += 1;
            this.fps15 = this.fps15 % 4;

            if (this.animationFunc !== null) {
                this.animationFunc();
                this.SceneHelper.render();
            }
            requestAnimationFrame(function () {
                return _this2.callAnimation();
            });
        }

        /*-- Benchmarking --*/

        /**
         * enables benchmarking. Results will be printed into the console.
         * To disable it, use: disableBenchmarking(). To print a timestamp to the console, use benchmarkStamp("foobar")
         */

    }, {
        key: "enableBenchmarking",
        value: function enableBenchmarking() {
            this.benchmark = {};
            this.benchmark.enabled = true;
            this.benchmark.recentTime = window.performance.now();
        }

        /**
         * disables benchmarking. To enable it, use: enableBenchmarking(). To print a timestamp to the console, use benchmarkStamp("foobar")
         */

    }, {
        key: "disableBenchmarking",
        value: function disableBenchmarking() {
            this.benchmark.enabled = false;
        }

        /**
         * prints time and an identifier to the console, if benchmarking is enabled. You can enable it using enableBenchmarking() and stop it using disableBenchmarking()
         * @param {string} identifier printed at the beginning of the line
         */

    }, {
        key: "benchmarkStamp",
        value: function benchmarkStamp(identifier) {
            if (this.benchmark.enabled === false) return;

            console.log(identifier + ": " + (window.performance.now() - this.benchmark.recentTime) + "ms");
            this.benchmark.recentTime = window.performance.now();
        }

        /*-- some public API functions that forward to Scenehelper --*/

        /**
         * changes the background color and triggers a rerender
         * @param {string} color Examples: 0xffffff, "#ff6600", "rgb(1,0.5,0)", "hsl(0.7,0.6,0.3)"
         */

    }, {
        key: "setBackgroundColor",
        value: function setBackgroundColor(color) {
            this.SceneHelper.setBackgroundColor(color);
        }

        /**
         * Creates new axes with the defined color and triggers a rerender. Note that this has to be done before creating a plot
         * @param {String} color axes color. Examples: 0xffffff, "#ff6600", "rgb(1,0.5,0)", "hsl(0.7,0.6,0.3)"
         */

    }, {
        key: "setAxesColor",
        value: function setAxesColor(color) {
            this.SceneHelper.createAxes(color, this.dimensions, this.oldData.normalization);

            this.SceneHelper.makeSureItRenders(this.animationFunc);
        }

        /**
         * resets the camera position
         */

    }, {
        key: "centerCamera",
        value: function centerCamera() {
            this.SceneHelper.centerCamera(this.dimensions);
        }

        /**
         * removes the axes. They can be recreated using createAxes(color)
         */

    }, {
        key: "removeAxes",
        value: function removeAxes() {
            this.SceneHelper.removeAxes();
        }

        /*-- typechecking --*/

        /**
         * prints an error, telling you what went wrong with a variable (expected type is wrong)
         * @param {string} varname 
         * @param {any} variable 
         * @param {string} expectedType 
         */

    }, {
        key: "errorParamType",
        value: function errorParamType(varname, variable, expectedType) {
            console.error("expected '" + expectedType + "' but found '" + (typeof variable === "undefined" ? "undefined" : _typeof(variable)) + "' for " + varname + " (" + variable + ")");
        }

        /**
         * checks if the variable is boolean or not
         * @param {string} varname 
         * @param {any} variable 
         * @return {boolean} true if valid, false if not
         */

    }, {
        key: "checkBoolean",
        value: function checkBoolean(varname, variable) {
            if (variable == undefined) return; // not defined in the (optional) options, don't do anything then
            var a = variable === true || variable === false;
            if (!a) this.errorParamType(varname, variable, "boolean");
            return a; // returns true (valid) or false
        }

        /**
         * checks if the variable is a number or not
         * @param {string} varname 
         * @param {any} variable 
         * @return {boolean} true if valid, false if not
         */

    }, {
        key: "checkNumber",
        value: function checkNumber(varname, variable) {
            if (variable == undefined || variable === "") return; // not defined in the (optional) options, don't do anything then
            if (typeof variable != "number" && isNaN(parseFloat(variable))) return this.errorParamType(varname, variable, "number");else return true; // returns true (valid) or false
        }
    }]);

    return Plot;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//converts mathematical syntax to javascript.

/**
 * @private
 */
var MathParser = function () {
    /**
     * this is the constructor for the class called "MathParser" which is used to handle calculations.
     * There is nothing api relevant here
     * @param {object} parent instance of JsPlot3D 
     */
    function MathParser(parent) {
        _classCallCheck(this, MathParser);

        this.parent = parent;
        this.resetCalculation(); // configures the variables
    }

    /**
     * runs eval
     * @param {Number} x1 first parameter of f(x1,x3) (x)
     * @param {Number} x3 second parameter of f(x1,x3) (z)
     */


    _createClass(MathParser, [{
        key: "eval2",
        value: function eval2(x1, x3) {
            //this.x1 and this.x3 are going to be used during the eval process
            this.x1 = x1;
            this.x3 = x3;
            this.xRes = this.parent.dimensions.xRes;
            this.zRes = this.parent.dimensions.zRes;
            var y = eval(this.parsedFormula);
            return y;
        }

        /**
         * helper for f(x1,x3) in case there is recursion
         * @private
         * @param {number} x1        x1 value in the coordinate system
         * @param {number} x3        x3 value in the coordinate system
         */

    }, {
        key: "frec",
        value: function frec(x1, x3) {
            var x1index = x1 * this.xRes | 0;
            var x3index = x3 * this.zRes | 0;

            if (x1 < 0 || x3 < 0 || x1 >= this.parent.xLen || x3 >= this.parent.zLen) return 0;

            // checking for a point if it has been calculated already increases the performance and
            // reduces the number of recursions.
            // calculatedPoints[x1][x3]
            var val = this.calculatedPoints[x1index];
            if (val) val = val[x3index];

            // unknown
            if (!val) // has this point has already been calculated before?
                {
                    if (!this.stopRecursion)
                        // bind f it to this, so that it can access this.calculatedPoints, this.xLen and this.zLen, this.stopRecursion
                        // another solution would be probably if I would just hand the variables over to MathParser
                        val = this.eval2(this.parsedFormula, x1, x3, this.frec.bind(this));

                    this.calculatedPoints[x1index][x3index] = val;
                }

            // val might return NaN for Math.sqrt(-1)
            // that's fine. Handle this case in the loops that plot the function

            return val;
        }

        /**
         * function that is used when calculating the x3 values f(x1, x3)
         * @private
         * @param {number} x1        x1 value in the coordinate system
         * @param {number} x3        x3 value in the coordinate system
         */

    }, {
        key: "f",
        value: function f(x1, x3) {
            return this.eval2(x1, x3);
        }

        /**
         * reinitializes the variables that are needed for calculating plots, so that a new plot can be started
         * @private
         */

    }, {
        key: "resetCalculation",
        value: function resetCalculation() {
            this.calculatedPoints = new Array(this.parent.dimensions.xVerticesCount);
            for (var i = 0; i < this.calculatedPoints.length; i++) {
                this.calculatedPoints[i] = new Float32Array(this.parent.dimensions.zVerticesCount);
            }this.parsedFormula = "";
            this.stopRecursion = false;
        }

        /**
         * thanks to https://stackoverflow.com/questions/15454183/how-to-make-a-function-that-computes-the-factorial-for-numbers-with-decimals
         * @param z     number to Calculate the gamma of 
         */

    }, {
        key: "gamma",
        value: function gamma(z) {
            var g = 7;
            var C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716 * Math.pow(10, -6), 1.5056327351493116 * Math.pow(10, -7)];

            if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * this.gamma(1 - z));else {
                z -= 1;

                var x = C[0];
                for (var i = 1; i < g + 2; i++) {
                    x += C[i] / (z + i);
                }var t = z + g + 0.5;
                return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
            }
        }

        /**
         * Calculates a factorial
         * @param x     number to Calculate the factorial of "x!"" 
         */

    }, {
        key: "factorial",
        value: function factorial(x) {
            return this.gamma(x + 1);
        }

        /**
         * converts mathematical formulas to javascript syntax
         * @param formula       string of a formula that contains !, ^, sin, cos, etc. expressions 
         * @return              javascript compatible function in a string that can be executed using eval(string)
         */

    }, {
        key: "parse",
        value: function parse(formula) {
            //regex for numbers of x1 and x3: (x1|x3|\d+(\.\d+){0,1})

            formula = formula.toLowerCase();

            //remove whitespaces for easier regex replaces
            formula = formula.replace(/\s+/g, "");

            // MATHEMATICAL CONSTANTS
            // make sure that e.g. the e from exp doesn't get replaced with Math.E
            // going to need some way to indicate the start and end. add some string literals
            formula += "\0";
            formula = "\0" + formula;
            formula = formula.replace(/([\^+-/*(\0]+)(pi|PI|Pi|π)([\^+-/*)\0]+)/g, "$1Math.PI$3");
            formula = formula.replace(/([\^+-/*(\0]+)(e|E)([\^+-/*)\0]+)/g, "$1Math.E$3");
            formula = formula.replace(/\0/g, "");

            formula = formula.replace(/math\./g, "Math.");

            //for recursive calls, make sure that the proper recursive handler is selected
            formula = formula.replace(/f\(/g, "this.frec(");
            if (formula.indexOf("frec") !== -1) console.warn("recursive formulas are not yet supported");

            //x1 and x3 are attributes of this class once eval2 gets called
            formula = formula.replace(/x1/g, "this.x1");
            formula = formula.replace(/x3/g, "this.x3");

            //support powers (to my susprise, current browsers support this (ES7 feature). Testet with firefox and chromium-browser)
            formula = formula.replace(/\^/g, "**");

            //support expressions without Math. as suffix.
            formula = formula.replace(/(sin\(|cos\(|tan\(|log\(|max\(|min\(|abs\(|sinh\(|cosh\(|tanh\(|acos\(|asin\(|atan\(|exp\(|sqrt\()/g, "Math.$1");

            //support ln()
            formula = formula.replace(/ln\(/g, "Math.log(");

            //factorial
            var complete = false;
            while (!complete) {
                //split the formula into the part left of the factorial and the part to the right
                var formulafac = formula.split(/!(.*)/g);
                //console.log("in: "+formula)
                //console.log(formulafac)

                if (formula.indexOf("!") != -1) //if threre is a factorial
                    {
                        //  ( a ( b ( c ) ) ! foobar
                        //      0   1   2 1 | 
                        //          left    | right


                        var left = 0; //counts brackets to the left
                        // start at the end of the string:
                        var j = formulafac[0].length - 1;
                        if (formulafac[0][j] == ")") //if there is a bracket
                            do //find the opening bracket for this closing bracket
                            {
                                if (formulafac[0][j] == ")") left++;else if (formulafac[0][j] == "(") left--;
                                j--;
                            } while (j > 0 && left > 0);else {}
                        //console.log("no bracket to the left")

                        //the variable j will be 1 lower than the actual index of the opening bracket
                        j++;
                        //console.log("opening bracket on index "+j)


                        //check if there is an expression to the left
                        //f(foo)! or Math.sin(bar)!
                        //the regex may also check for dots (Math.bla()), when there is a dot before the brackets it's invalid syntax anyway
                        if (/[A-Za-z0-9_.]/g.test(formulafac[0][j - 1])) {
                            //console.log("found expression")
                            //take that expression into account
                            //check if there is going to be another character for that expression one step to the left
                            while (j > 0 && /[A-Za-z0-9_.]/g.test(formulafac[0][j - 1])) {
                                j--;
                            } //if yes, decrease the index j and check again
                        }

                        //now take j and create the substring that contains the part to be factorialized
                        var leftExpr = formulafac[0].substring(j, formulafac[0].length);
                        //console.log("to be factorized: "+leftExpr)
                        //cut it away from formulapow
                        var cutl = formulafac[0].substring(0, j);

                        //create formula with proper factorial expressions:
                        formula = cutl + "this.factorial(" + leftExpr + ")" + formulafac[1];
                        //console.log("out "+formula)
                        //console.log("")
                    } else {
                    //console.log("no factorial detected")
                    //console.log("")
                    complete = true;
                }
            }

            //Math.Math. could be there a few times at this point. clear that
            formula = formula.replace(/(Math\.)+/g, "Math.");
            formula = formula.replace(/(this\.)+/g, "this."); //in case there are two this.

            this.parsedFormula = formula;
            return formula;
        }
    }]);

    return MathParser;
}();

exports.default = MathParser;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Takes care of rendering, axes, lightening, camera, scene, disposing etc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @private
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _three = __webpack_require__(0);

var THREE = _interopRequireWildcard(_three);

var _ColorLib = __webpack_require__(1);

var COLORLIB = _interopRequireWildcard(_ColorLib);

var _threeOrbitControls = __webpack_require__(5);

var _threeOrbitControls2 = _interopRequireDefault(_threeOrbitControls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SceneHelper = function () {

    /**
     * Constructor for the scene helper. Initializes some variables and creates the WebGL Renderer
     */
    function SceneHelper() {
        _classCallCheck(this, SceneHelper);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.recentlyUsedNormalization = null;
        this.recentlyUsedDimensions = null;
        this.textScale = 1 / 7;
        this.cameraMode = 0; // default 0, which is the default orbitcontrolled perspective mode

        // inside those groups the various numbers that are displayed along the axes are stored as children
        this.xNumbers = new THREE.Group();
        this.xNumbers.name = "xNumbers";

        this.yNumbers = new THREE.Group();
        this.yNumbers.name = "yNumbers";

        this.zNumbers = new THREE.Group();
        this.zNumbers.name = "zNumbers";
    }

    /**
     * scene setup. Szene, Camera, Lighting, Axes
     * @param {object} dimensions the dimensions attribute of the Plot class. Contains xLen, yLen, zLen, xRes, zRes, xVerticesCount, zVerticesCount
     * @param {object} sceneOptions contains the attributes .backgroundColor and .axesColor. Example: {backgroundColor: "#0066ff", axesColor: "#ffffff"}
     * @param {object} cameraOptions object containing "width" and "height" of the canvas on which the plot will be drawn
     */


    _createClass(SceneHelper, [{
        key: "createScene",
        value: function createScene(dimensions, sceneOptions, cameraOptions) {
            var backgroundColor = 0xffffff;
            var axesColor = 0x000000;

            // width and height of the canvas in px
            this.width = cameraOptions.width;
            this.height = cameraOptions.height;

            if (sceneOptions.backgroundColor != undefined) backgroundColor = sceneOptions.backgroundColor;
            if (sceneOptions.axesColor != undefined) axesColor = sceneOptions.axesColor;

            this.scene = new THREE.Scene();
            this.createArcCamera();

            this.setBackgroundColor(backgroundColor);

            this.createLight();

            this.createAxes(axesColor, dimensions);
        }

        /**
         * moves the camera to a good position to watch over the whole plot
         * @param {object} dimensions {xLen, yLen, zLen} 
         */

    }, {
        key: "centerCamera",
        value: function centerCamera(dimensions) {
            var xLen = dimensions.xLen;
            var yLen = dimensions.yLen;
            var zLen = dimensions.zLen;

            // 80 is the default camera.fov value. A less perspectivic view can be achieved using a smaller value, but it has to be moved farther away
            var zoom = 80 / this.camera.fov;

            if (this.camera.type === "OrthographicCamera") zoom = 1;

            var x = void 0,
                y = void 0,
                z = void 0;
            if (this.cameraMode == 0) {
                x = zoom * (xLen / 2);
                y = zoom * Math.max(zLen, yLen);
                z = zoom * (zLen + xLen);
            } else if (this.cameraMode == 1) {
                // topCamera
                x = xLen / 2;
                y = Math.max(xLen, zLen) * 2;
                z = zLen / 2;
                this.camera.initial_y = y;
            }

            this.camera.position.set(x, y, z);
            this.cameraControls.target.set(xLen / 2, yLen / 2, zLen / 2);
            this.camera.lookAt(this.cameraControls.target);
            this.render();
        }

        /**
         * changes the mode of the camera
         * @param {number} mode either JSPLO3D.TOPCAMERA or JSPLOT3D.DEFAULTCAMERA
         */

    }, {
        key: "changeCameraMode",
        value: function changeCameraMode(mode) {
            // already using that mode? Then just return and do nothing
            if (this.cameraMode == mode) return;

            this.cameraControls.dispose();
            // TODO will this cause a memory leak because of cameras not being removed?
            // Can't dispose camera. workaround would be to keep the cameras in the storage and switch them
            if (mode == 1) {
                // orthographic camera looking from the top
                this.createTopCamera();
                this.createAxes(this.axesColor, this.dimensions, this.normalization);
            } else {
                // unkown or 0: default
                this.createArcCamera();
            }
            this.cameraMode = mode;
            this.render();
        }
    }, {
        key: "createTopCamera",
        value: function createTopCamera() {
            var _this = this;

            var width = this.width;
            var height = this.height;
            var near = 0; // when objects start to disappear at zoom-in
            var far = 50; // when objects start to disappear at zoom-out
            var a = Math.min(width, height);
            var camera = new THREE.OrthographicCamera(-width / a, width / a, height / a, -height / a, near, far);

            // helps to control the sprite size to be roughly the same as in the default perspective mode camera
            // camera.scale.set(0.5, 0.5, 0.5)

            var controls = new ((0, _threeOrbitControls2.default)(THREE))(camera, this.renderer.domElement);
            controls.enableKeys = false;

            // the point of this is, that i can disable this by overwriting it
            // when doing animations no need to use the event listener anymore
            this.onChangeCamera = this.render;
            controls.addEventListener("change", function () {
                // change y position, so that the sprite size stays the same. Without the following
                // line the sprites maintain the same size on the screen in px despite zoom factor
                _this.camera.position.y = _this.camera.initial_y / _this.camera.zoom;
                _this.render();
            });

            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.enableZoom = true;
            controls.enableRotate = false;
            // controls.maxDistance = 5
            // controls.minDistance = 0.3

            this.camera = camera;
            this.cameraControls = controls;
        }

        /** 
         * Creates the camera
         */

    }, {
        key: "createArcCamera",
        value: function createArcCamera() {
            var _this2 = this;

            // the cameras position is set in centerCamera, which is called on setDimensions and during the constructor in JsPlot3D.js
            var width = this.width;
            var height = this.height;
            var viewAngle = 40;
            var aspect = width / height;
            var near = 0.05; // when objects start to disappear at zoom-in
            var far = 50; // when objects start to disappear at zoom-out
            var camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);

            var controls = new ((0, _threeOrbitControls2.default)(THREE))(camera, this.renderer.domElement);
            controls.enableKeys = false;

            // the point of this is, that i can disable this by overwriting it
            // when doing animations no need to use the event listener anymore
            this.onChangeCamera = this.render;
            controls.addEventListener("change", function () {
                return _this2.render();
            });

            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.enableZoom = true;
            controls.rotateSpeed = 0.3;
            controls.enableRotate = true;
            // controls.maxDistance = 5
            // controls.minDistance = 0.3

            this.camera = camera;
            this.cameraControls = controls;
        }

        /**
         * takes care of creating the light
         */

    }, {
        key: "createLight",
        value: function createLight() {
            // set a directional light
            var color1 = 0xff9933;
            var color2 = 0x0033ff;

            var directionalLight1 = new THREE.DirectionalLight(color1, 0.4);
            directionalLight1.position.y = 1;
            directionalLight1.name = "lightFromTop";
            this.scene.add(directionalLight1);

            var directionalLight2 = new THREE.DirectionalLight(color2, 0.4);
            directionalLight2.position.y = -1;
            directionalLight2.name = "lightFromBottom";
            this.scene.add(directionalLight2);
        }

        /**
         * removes the axes. They can be recreated using createAxes(color)
         */

    }, {
        key: "removeAxes",
        value: function removeAxes() {
            this.disposeMesh(this.axes);
            this.disposeMesh(this.gridHelper);
            this.axes = null;
            this.gridHelper = null;
        }

        /**
         * creates a THREE.Sprite object that has a canvas as texture that was filled with text. uses createLetterTexture to create the texture.
         * @param {string} letter examples: "a", "lksdfj", 0.546, 91734917, "78n6"
         * @param {Vector3} position Vector3 object {x, y, z}
         * @param {string} align "center", "left" or "right"
         * @param {number} scale scaling of the letter, default is 1
         */

    }, {
        key: "placeLetter",
        value: function placeLetter(letter, position) {
            var align = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "center";
            var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

            letter = "" + letter;
            var canvasToTexture = this.createLetterTexture(letter, align);
            var geometry = new THREE.Geometry();

            // I'm using Points and PointsMaterial instead of SpriteMaterial so that sizeAttenuation: false can be used
            // Sprite and SpriteMaterial zooms the sprites when zooming in
            geometry.vertices.push(new THREE.Vector3(0, 0, 0)); // 0, 0, 0 so that I can move it around using the position.set()
            var textureToSprite = new THREE.Points(geometry, new THREE.PointsMaterial({
                map: canvasToTexture,
                depthTest: true,
                // depthWrite: false,
                sizeAttenuation: false,
                size: canvasToTexture.image.width * this.textScale * scale,
                transparent: true
            }));
            textureToSprite.position.set(position.x, position.y, position.z);

            // make sure it renders on the top
            textureToSprite.renderOrder = Number.MAX_SAFE_INTEGER;

            textureToSprite.name = "sprite_" + letter;

            // transform scale
            // textureToSprite.scale.set(size*Math.pow(2, letter.length),2*size)
            // textureToSprite.scale.set(size,size)


            return textureToSprite;
        }

        /**
         * returns a THREE.Material object that contains text as texture
         * @param {string} letter examples: "a", "lksdfj", 0.546, 91734917, "78n6"
         * @param {string} align "center", "right" or "left"
         */

    }, {
        key: "createLetterTexture",
        value: function createLetterTexture(letter, align) {
            var fontSize = 80;

            letter = "" + letter;
            // write text to a canvas
            var textCanvas = document.createElement("canvas");
            // textCanvas.height = 128

            // textCanvas.width = letter.length * 64
            // the texture size has to be a power of two for each dimension
            // letter.length -> width. 2 -> 2, 3 -> 4, 4 -> 4, 5 -> 8, 6 -> 8, 7 -> 8, etc.
            textCanvas.width = Math.pow(2, (Math.log2(letter.length) | 0) + 2) * 64;
            textCanvas.height = textCanvas.width; // 128 // power of 2 and greater than 80 // will be scaled and distored if not quadratic

            // prepare the textwriting
            var context2d = textCanvas.getContext("2d");

            // IMPRTANT: when editing this, keep in mind that light text produces slight black outlines (because of the nature of THREE.js)
            // the same goes for light outlines drawn on the canvas. They also have some slightly black pixels around them. Even white shadows have some darkish fragments.
            // that means: try to hide those slight black pixels with a bold black outline. If the background is dark, they can't be seen anyway luckily.

            // make sure the text is always readable
            var axL = this.axesColor.getHSL().l;
            context2d.fillStyle = "#" + this.axesColor.getHexString(); // text color is always the axesColor

            // now try to find the best outline color (in case of black text on white background don't draw one)
            if (axL > 0.4) {
                // if axesColor is light, use black outlines
                // always use them, even when the background is black, because white might be hard to make out
                // on top of heatmaps (yellow and turqoise are heatmap colors and very light)

                // outline
                context2d.strokeStyle = "rgba(0,0,0,0.8)";
                context2d.miterLimit = 1; // curved outline edges
                context2d.lineWidth = 10;
            } else {
                var bgL = this.backgroundColor.getHSL().l;
                if (bgL < 0.4) {
                    // if axes are dark and background is dark (that means black outlines would fail)
                    // use white outlines

                    // outline
                    context2d.strokeStyle = "rgba(255,255,255,0.8)";
                    context2d.miterLimit = 1; // curved outline edges
                    context2d.lineWidth = 10;
                } else {
                    // if axesColor is dark and background is light, draw without outlines
                }
            }

            // write it centered
            context2d.font = "Bold " + fontSize + "px sans-serif";
            context2d.textAlign = align;
            context2d.strokeText(letter, textCanvas.width / 2, textCanvas.height / 2 + fontSize / 4); // write outline
            context2d.fillText(letter, textCanvas.width / 2, textCanvas.height / 2 + fontSize / 4); // write text

            // create a texture from the canvas
            var canvasToTexture = new THREE.CanvasTexture(textCanvas);

            // canvasToTexture.needsUpdate = true // canvasTexture has this true by default

            return canvasToTexture;
        }

        /**
         * updates the text shown on a sprite (creates a new lettertexture using createLetterTexture and updates a THREE.Mesh/Sprite/etc.)
         * @param {object} sprite sprite object that contains the text as texture (THREE.Sprite)
         * @param {string} letter new text to be displayed on the sprite
         * @param {string} align "center", "right" or "left"
         */

    }, {
        key: "updateLetterTextureOnSprite",
        value: function updateLetterTextureOnSprite(sprite, letter, align) {
            letter = "" + letter;
            sprite.material.map.dispose();
            sprite.material.map = this.createLetterTexture(letter, align);
            sprite.material.size = sprite.material.map.image.width * this.textScale;
            sprite.material.needsUpdate = true;
        }

        /**
         * creates numbers according to the parameters. They are going to be displayed along the axis.
         * If the number object is already defined, only the texture and position will be updated for performance reasons
         * 
         * This function can create the numbers for all three axes and basically even more than that,
         * it's just a matter of how you define the position lamda function in the parameters
         * 
         * @param {number} numberCount how many numbers to display along the axis
         * @param {number} axisLen length of the axis
         * @param {number} axisNumber JSPLOT3D.XAXIS, JSPLOT3D.YAXIS or JSPLOT3D.ZAXIS
         * @param {number} min the vlaue of the lowest datapoint (as available in the dataframe)
         * @param {number} max the value of the highest datapoint (as available in the dataframe)
         * @param {boolean} animated true if the plot is animated
         * @return {object} with numbers populated group
         */

    }, {
        key: "updateNumbersAlongAxis",
        value: function updateNumbersAlongAxis(numberDensity, axisLen, axisNumber, min, max) {
            if (!this.axes) return;

            //// Selecting parameters

            // get the group that contains the numbers according to axisNumber
            var numbersGroupName = ["xNumbers", "yNumbers", "zNumbers"][axisNumber - 1];
            var numbersGroup = this[numbersGroupName];

            // select the function for updating the number position
            var offset2 = -0.075;
            var position = [function (value) {
                return new THREE.Vector3(value, -offset2, offset2);
            }, // x-Axis
            function (value) {
                return new THREE.Vector3(offset2, value, offset2 / 2);
            }, // y-Axis
            function (value) {
                return new THREE.Vector3(offset2, -offset2, value);
            } // z-Axis
            ][axisNumber - 1];

            // align of the text. the goal is to nicely align it with the axes
            var align = ["center", // x-Axis
            "right", // y-Axis
            "right" // z-Axis
            ][axisNumber - 1];

            var numberCount = numberDensity * axisLen | 0;

            // load the numbers that have already been created at some point:
            var children = numbersGroup.children;
            // the numbers are stored as children inside a group. one group for each axes. (the groups are stored inside this.axes.children)
            // to access the children inside the group, use this index:
            var index = 0;
            // x is the value in terms of the position in the actual 3D space on the axis
            // step indicates how far away the numbers are in terms of the actual 3D space
            var step = axisLen / numberCount;

            for (var x = step; x <= axisLen; x += step) {
                // the higher the index the higher the number

                // this is the number that is going to be displayed
                // max-min results in the range of numbers. divide it by the numberCount to get the step-size for each number
                // multiply it by index+1 to get this stepsize*2. example: min = 0.5, max = 1, numberCount = 3
                // 0.5/3*1+0.5 = 0.666       0.5/3*2+0.5 = 0.833       0.5/3*3+0.5 = 1
                // with 0.5 being left out because it would be where all three axis meet and there is not enough space for numbers
                var number = (max - min) / numberCount * (index + 1) + min;

                // if the number didn't change, don't do anything
                if (children[index] != undefined && children[index].originalNumber === number) {
                    continue;
                }

                var text = number.toPrecision(3);
                var pos = position(x);
                if (children.length - 1 < index) // if children are not yet created
                    {
                        // not yet defined: create from scratch
                        var textObject = this.placeLetter(text, pos, align);
                        textObject.originalNumber = number;
                        numbersGroup.add(textObject);
                    } else {
                    // already defined: update texture and position
                    this.updateLetterTextureOnSprite(children[index], text, align);
                    children[index].originalNumber = number;
                    children[index].position.set(pos.x, pos.y, pos.z);
                }

                // no need to check if there are numbers left over as children, because the amount of numbers (numberCount) only changes
                // when updating the dimensions, and when that happens the whole axes gets disposed
                index++;
            }

            this.axes.add(numbersGroup);

            return numbersGroup;
        }

        /**
         * If axesare available, call createAxes to recreate them. If not, do nothing
         * @param {object} dimensions {xLen, yLen, zLen} 
         * @param {object} normalization {maxX1, maxX2, maxX3} 
         */

    }, {
        key: "updateAxesSize",
        value: function updateAxesSize(dimensions, normalization) {
            if (this.axes === null) return;

            this.disposeAllAxesNumbers();
            this.createAxes(this.axesColor, dimensions, normalization);
        }

        /**
         * removes all the numbers from all three axes
         */

    }, {
        key: "disposeAllAxesNumbers",
        value: function disposeAllAxesNumbers() {
            // not that xNumbers, yNumbers and zNumbers are set in JsPlot3D.js when updateNumbersAlongAxis is called
            if (this.axes !== null) {
                this.disposeMesh(this.xNumbers);
                this.disposeMesh(this.yNumbers);
                this.disposeMesh(this.zNumbers);

                this.xNumbers = new THREE.Group();
                this.xNumbers.name = "xNumbers";

                this.yNumbers = new THREE.Group();
                this.yNumbers.name = "yNumbers";

                this.zNumbers = new THREE.Group();
                this.zNumbers.name = "zNumbers";
            }
        }

        /**
         * creates the lines that point into the three x, y and z directions, adds the arrows at the tips, adds "x" "y" and "z" labels.
         * @private
         * @param {string} color     hex string of the axes color. default black #000000
         * @param {object} dimensions {xLen, yLen, zLen} 
         * @param {object} normalization {maxX1, maxX2, maxX3} 
         */

    }, {
        key: "createAxes",
        value: function createAxes(color, dimensions, normalization) {
            this.dimensions = dimensions;
            this.normalization = normalization;

            this.disposeMesh(this.axes);

            var xLen = dimensions.xLen;
            var yLen = dimensions.yLen;
            var zLen = dimensions.zLen;

            var showx1 = dimensions.xLen != 0 && dimensions.xRes != 0;
            var showx2 = this.cameraMode != 1 && dimensions.yRes != 0;
            var showx3 = dimensions.zLen != 0 && dimensions.zRes != 0;

            var axes = new THREE.Group();
            var percentage = 1.1; // how long the axes are to xLen, yLen and zLen


            // check wether color is a THREE.Color object or not
            var colorObject = void 0;
            if ((typeof color === "undefined" ? "undefined" : _typeof(color)) == "object" && color.r != undefined) {
                colorObject = color; // Three.Color Object
            } else {
                colorObject = COLORLIB.getColorObjectFromAnyString(color);
            }

            // if creating the color was successful
            if (colorObject != undefined) {
                color = colorObject;
            } else {
                color = new THREE.Color(0);
                console.error("unrecognized color", color);
            }

            this.axesColor = colorObject;

            // lines that point into the dimensions
            var axesWireGeom = new THREE.Geometry();
            var cent = new THREE.Vector3(0, 0, 0);
            var xend = new THREE.Vector3(xLen * percentage, 0, 0);
            var yend = new THREE.Vector3(0, yLen * percentage, 0);
            var zend = new THREE.Vector3(0, 0, zLen * percentage);
            axesWireGeom.vertices.push(cent); // 0
            axesWireGeom.vertices.push(xend); // 1
            axesWireGeom.vertices.push(yend); //2
            axesWireGeom.vertices.push(zend); //3
            axesWireGeom.faces.push(new THREE.Face3(0, 0, 1));
            axesWireGeom.faces.push(new THREE.Face3(0, 0, 2));
            axesWireGeom.faces.push(new THREE.Face3(0, 0, 3));
            // wireframe and color those paths
            var axesWireMat = new THREE.MeshBasicMaterial({
                color: color,
                wireframe: true,
                side: THREE.DoubleSide
            });
            var axesWire = new THREE.Mesh(axesWireGeom, axesWireMat);
            axesWire.name = "axesWire";
            axes.add(axesWire);

            // arrows that sit at the end of the lines
            var arrowMat = new THREE.MeshBasicMaterial({
                color: color
            });
            var arrowGeom = new THREE.ConeGeometry(0.02, 0.066, 12);

            if (showx1) {
                var arrowMesh1 = new THREE.Mesh(arrowGeom, arrowMat);
                arrowMesh1.rotateZ(-Math.PI / 2);
                arrowMesh1.position.set(xLen * percentage, 0, 0);
                arrowMesh1.name = "xArrow";
                axes.add(arrowMesh1);
            }

            if (showx2) {
                var arrowMesh2 = new THREE.Mesh(arrowGeom, arrowMat);
                arrowMesh2.position.set(0, yLen * percentage, 0);
                arrowMesh2.name = "yArrow";
                axes.add(arrowMesh2);
            }

            if (showx3) {
                var arrowMesh3 = new THREE.Mesh(arrowGeom, arrowMat);
                arrowMesh3.rotateX(Math.PI / 2);
                arrowMesh3.position.set(0, 0, zLen * percentage);
                arrowMesh3.name = "zArrow";
                axes.add(arrowMesh3);
            }

            // text indicating the dimension name
            var offset = 0.1;

            if (showx1) {
                var xLetter = void 0;
                xLetter = this.placeLetter("x", new THREE.Vector3(xLen * percentage + offset, 0, 0), "center", 1.3);
                axes.add(xLetter);
            }

            if (showx2) {
                var yLetter = void 0;
                yLetter = this.placeLetter("y", new THREE.Vector3(0, yLen * percentage + offset, 0), "center", 1.3);
                axes.add(yLetter);
            }

            if (showx3) {
                var zLetter = void 0;
                zLetter = this.placeLetter("z", new THREE.Vector3(0, 0, zLen * percentage + offset), "center", 1.3);
                axes.add(zLetter);
            }

            // create a new gridHelper that divides the 3Dspace into 9 pieces
            var gridHelper1 = new THREE.GridHelper(1, 3, colorObject, colorObject);
            gridHelper1.geometry.translate(0.5, 0, 0.5);

            if (yLen == 0) gridHelper1.geometry.translate(0, -0.1, 0);

            gridHelper1.geometry.scale(dimensions.xLen, 1, dimensions.zLen);
            // appearance
            gridHelper1.material.transparent = true;
            gridHelper1.material.opacity = 0.2;
            axes.add(gridHelper1);

            // gridhelper on the x-y and z-y planes. But they don't actually look that good I think
            /*let gridHelper2 = new THREE.GridHelper(1, 1, colorObject, colorObject)
            gridHelper2.geometry.translate(0.5,0,0.5)
            gridHelper2.geometry.scale(dimensions.xLen,1,dimensions.yLen)
            gridHelper2.geometry.rotateX(-Math.PI/2)
            // appearance
            gridHelper2.material.transparent = true
            gridHelper2.material.opacity = 0.1
            axes.add(gridHelper2)
             let gridHelper3 = new THREE.GridHelper(1, 1, colorObject, colorObject)
            gridHelper3.geometry.translate(0.5,0,0.5)
            gridHelper3.geometry.scale(dimensions.yLen,1,dimensions.zLen)
            gridHelper3.geometry.rotateZ(Math.PI/2)
            // appearance
            gridHelper3.material.transparent = true
            gridHelper3.material.opacity = 0.1
            axes.add(gridHelper3)*/

            // updateAxesNumbers relies on this.axes, so make sure this is assigned before it
            this.axes = axes;

            // normalization might be undefined when there is no plot yet to show
            // if(normalization != undefined)
            //    this.updateAxesNumbers(dimensions, normalization, numberDensity)

            axes.name = "axesGroup";

            axes.dimensions = dimensions;
            axes.normalization = normalization;

            // add the axes group to the scene and store it locally in the object
            this.scene.add(axes);
        }

        /**
         * frees memory and removes the mesh (by making it available for the garbage collegtor)
         */

    }, {
        key: "disposeMesh",
        value: function disposeMesh(mesh) {
            if (mesh) {
                if (mesh.geometry) mesh.geometry.dispose();

                // disppose material
                if (mesh.material) {
                    if (!mesh.material.length && mesh.material) mesh.material.dispose();

                    if (!isNaN(mesh.material.length)) {
                        // material is an array
                        for (var i = 0; i < mesh.material.length; i++) {
                            mesh.material[i].dispose();
                        }
                    }

                    // for sprites material.map.dispose() seems to be important
                }

                if (mesh.texture) mesh.texture.dispose();

                // recursively clear the children
                for (var _i = 0; _i < mesh.children.length; _i++) {
                    this.disposeMesh(mesh.children[_i]);
                }if (mesh.parent !== null) mesh.parent.remove(mesh);

                mesh.remove();
            }
        }

        /**
         * sometimes it renders sometimes it does not (static images)
         * super problematic. Make sure it gets rendered by using some timeouted renders
         */

    }, {
        key: "makeSureItRenders",
        value: function makeSureItRenders(animationFunc) {
            var _this3 = this;

            // if animated, don't render it here. In callAnimation it's going to render
            if (animationFunc === null) {
                for (var i = 0; i < 5; i++) {
                    window.setTimeout(function () {
                        return _this3.render();
                    }, 100 + i * 33);
                }for (var _i2 = 0; _i2 < 5; _i2++) {
                    window.setTimeout(function () {
                        return _this3.render();
                    }, 100 + 5 * 33 + _i2 * 66);
                }
            }
        }

        /**
         * changes the background color and triggers a rerender. For the axes to update their shadows make sure to call plot.setAxesColor again
         * @param {string} color
         */

    }, {
        key: "setBackgroundColor",
        value: function setBackgroundColor(color) {
            var colorObject = COLORLIB.getColorObjectFromAnyString(color);

            // for later use. shadows of the text letters that are drawn on canvases
            this.backgroundColor = colorObject;

            if (colorObject != undefined) this.renderer.setClearColor(COLORLIB.getColorObjectFromAnyString(color));else this.renderer.setClearColor(color);

            this.render();
        }

        /**
         * updates what is visible on the screen.
         */

    }, {
        key: "render",
        value: function render() {
            this.renderer.render(this.scene, this.camera);
        }
    }]);

    return SceneHelper;
}();

exports.default = SceneHelper;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function( THREE ) {
	/**
	 * @author qiao / https://github.com/qiao
	 * @author mrdoob / http://mrdoob.com
	 * @author alteredq / http://alteredqualia.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author erich666 / http://erichaines.com
	 */

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one finger move
//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
//    Pan - right mouse, or arrow keys / touch: three finter swipe

	function OrbitControls( object, domElement ) {

		this.object = object;

		this.domElement = ( domElement !== undefined ) ? domElement : document;

		// Set to false to disable this control
		this.enabled = true;

		// "target" sets the location of focus, where the object orbits around
		this.target = new THREE.Vector3();

		// How far you can dolly in and out ( PerspectiveCamera only )
		this.minDistance = 0;
		this.maxDistance = Infinity;

		// How far you can zoom in and out ( OrthographicCamera only )
		this.minZoom = 0;
		this.maxZoom = Infinity;

		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		// How far you can orbit horizontally, upper and lower limits.
		// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.25;

		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.enableRotate = true;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.enablePan = true;
		this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

		// Set to false to disable use of the keys
		this.enableKeys = true;

		// The four arrow keys
		this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

		// Mouse buttons
		this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;

		//
		// public methods
		//

		this.getPolarAngle = function () {

			return spherical.phi;

		};

		this.getAzimuthalAngle = function () {

			return spherical.theta;

		};

		this.reset = function () {

			scope.target.copy( scope.target0 );
			scope.object.position.copy( scope.position0 );
			scope.object.zoom = scope.zoom0;

			scope.object.updateProjectionMatrix();
			scope.dispatchEvent( changeEvent );

			scope.update();

			state = STATE.NONE;

		};

		// this method is exposed, but perhaps it would be better if we can make it private...
		this.update = function() {

			var offset = new THREE.Vector3();

			// so camera.up is the orbit axis
			var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
			var quatInverse = quat.clone().inverse();

			var lastPosition = new THREE.Vector3();
			var lastQuaternion = new THREE.Quaternion();

			return function update () {

				var position = scope.object.position;

				offset.copy( position ).sub( scope.target );

				// rotate offset to "y-axis-is-up" space
				offset.applyQuaternion( quat );

				// angle from z-axis around y-axis
				spherical.setFromVector3( offset );

				if ( scope.autoRotate && state === STATE.NONE ) {

					rotateLeft( getAutoRotationAngle() );

				}

				spherical.theta += sphericalDelta.theta;
				spherical.phi += sphericalDelta.phi;

				// restrict theta to be between desired limits
				spherical.theta = Math.max( scope.minAzimuthAngle, Math.min( scope.maxAzimuthAngle, spherical.theta ) );

				// restrict phi to be between desired limits
				spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

				spherical.makeSafe();


				spherical.radius *= scale;

				// restrict radius to be between desired limits
				spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

				// move target to panned location
				scope.target.add( panOffset );

				offset.setFromSpherical( spherical );

				// rotate offset back to "camera-up-vector-is-up" space
				offset.applyQuaternion( quatInverse );

				position.copy( scope.target ).add( offset );

				scope.object.lookAt( scope.target );

				if ( scope.enableDamping === true ) {

					sphericalDelta.theta *= ( 1 - scope.dampingFactor );
					sphericalDelta.phi *= ( 1 - scope.dampingFactor );

				} else {

					sphericalDelta.set( 0, 0, 0 );

				}

				scale = 1;
				panOffset.set( 0, 0, 0 );

				// update condition is:
				// min(camera displacement, camera rotation in radians)^2 > EPS
				// using small-angle approximation cos(x/2) = 1 - x^2 / 8

				if ( zoomChanged ||
					lastPosition.distanceToSquared( scope.object.position ) > EPS ||
					8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

					scope.dispatchEvent( changeEvent );

					lastPosition.copy( scope.object.position );
					lastQuaternion.copy( scope.object.quaternion );
					zoomChanged = false;

					return true;

				}

				return false;

			};

		}();

		this.dispose = function() {

			scope.domElement.removeEventListener( 'contextmenu', onContextMenu, false );
			scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
			scope.domElement.removeEventListener( 'wheel', onMouseWheel, false );

			scope.domElement.removeEventListener( 'touchstart', onTouchStart, false );
			scope.domElement.removeEventListener( 'touchend', onTouchEnd, false );
			scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );

			window.removeEventListener( 'keydown', onKeyDown, false );

			//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

		};

		//
		// internals
		//

		var scope = this;

		var changeEvent = { type: 'change' };
		var startEvent = { type: 'start' };
		var endEvent = { type: 'end' };

		var STATE = { NONE : - 1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };

		var state = STATE.NONE;

		var EPS = 0.000001;

		// current position in spherical coordinates
		var spherical = new THREE.Spherical();
		var sphericalDelta = new THREE.Spherical();

		var scale = 1;
		var panOffset = new THREE.Vector3();
		var zoomChanged = false;

		var rotateStart = new THREE.Vector2();
		var rotateEnd = new THREE.Vector2();
		var rotateDelta = new THREE.Vector2();

		var panStart = new THREE.Vector2();
		var panEnd = new THREE.Vector2();
		var panDelta = new THREE.Vector2();

		var dollyStart = new THREE.Vector2();
		var dollyEnd = new THREE.Vector2();
		var dollyDelta = new THREE.Vector2();

		function getAutoRotationAngle() {

			return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

		}

		function getZoomScale() {

			return Math.pow( 0.95, scope.zoomSpeed );

		}

		function rotateLeft( angle ) {

			sphericalDelta.theta -= angle;

		}

		function rotateUp( angle ) {

			sphericalDelta.phi -= angle;

		}

		var panLeft = function() {

			var v = new THREE.Vector3();

			return function panLeft( distance, objectMatrix ) {

				v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
				v.multiplyScalar( - distance );

				panOffset.add( v );

			};

		}();

		var panUp = function() {

			var v = new THREE.Vector3();

			return function panUp( distance, objectMatrix ) {

				v.setFromMatrixColumn( objectMatrix, 1 ); // get Y column of objectMatrix
				v.multiplyScalar( distance );

				panOffset.add( v );

			};

		}();

		// deltaX and deltaY are in pixels; right and down are positive
		var pan = function() {

			var offset = new THREE.Vector3();

			return function pan ( deltaX, deltaY ) {

				var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

				if ( scope.object instanceof THREE.PerspectiveCamera ) {

					// perspective
					var position = scope.object.position;
					offset.copy( position ).sub( scope.target );
					var targetDistance = offset.length();

					// half of the fov is center to top of screen
					targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

					// we actually don't use screenWidth, since perspective camera is fixed to screen height
					panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
					panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

				} else if ( scope.object instanceof THREE.OrthographicCamera ) {

					// orthographic
					panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
					panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

				} else {

					// camera neither orthographic nor perspective
					console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
					scope.enablePan = false;

				}

			};

		}();

		function dollyIn( dollyScale ) {

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				scale /= dollyScale;

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		function dollyOut( dollyScale ) {

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				scale *= dollyScale;

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		//
		// event callbacks - update the object state
		//

		function handleMouseDownRotate( event ) {

			//console.log( 'handleMouseDownRotate' );

			rotateStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownDolly( event ) {

			//console.log( 'handleMouseDownDolly' );

			dollyStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownPan( event ) {

			//console.log( 'handleMouseDownPan' );

			panStart.set( event.clientX, event.clientY );

		}

		function handleMouseMoveRotate( event ) {

			//console.log( 'handleMouseMoveRotate' );

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			// rotating across whole screen goes 360 degrees around
			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );

			scope.update();

		}

		function handleMouseMoveDolly( event ) {

			//console.log( 'handleMouseMoveDolly' );

			dollyEnd.set( event.clientX, event.clientY );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyIn( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyOut( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			scope.update();

		}

		function handleMouseMovePan( event ) {

			//console.log( 'handleMouseMovePan' );

			panEnd.set( event.clientX, event.clientY );

			panDelta.subVectors( panEnd, panStart );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			scope.update();

		}

		function handleMouseUp( event ) {

			//console.log( 'handleMouseUp' );

		}

		function handleMouseWheel( event ) {

			//console.log( 'handleMouseWheel' );

			if ( event.deltaY < 0 ) {

				dollyOut( getZoomScale() );

			} else if ( event.deltaY > 0 ) {

				dollyIn( getZoomScale() );

			}

			scope.update();

		}

		function handleKeyDown( event ) {

			//console.log( 'handleKeyDown' );

			switch ( event.keyCode ) {

				case scope.keys.UP:
					pan( 0, scope.keyPanSpeed );
					scope.update();
					break;

				case scope.keys.BOTTOM:
					pan( 0, - scope.keyPanSpeed );
					scope.update();
					break;

				case scope.keys.LEFT:
					pan( scope.keyPanSpeed, 0 );
					scope.update();
					break;

				case scope.keys.RIGHT:
					pan( - scope.keyPanSpeed, 0 );
					scope.update();
					break;

			}

		}

		function handleTouchStartRotate( event ) {

			//console.log( 'handleTouchStartRotate' );

			rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		}

		function handleTouchStartDolly( event ) {

			//console.log( 'handleTouchStartDolly' );

			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

			var distance = Math.sqrt( dx * dx + dy * dy );

			dollyStart.set( 0, distance );

		}

		function handleTouchStartPan( event ) {

			//console.log( 'handleTouchStartPan' );

			panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		}

		function handleTouchMoveRotate( event ) {

			//console.log( 'handleTouchMoveRotate' );

			rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			// rotating across whole screen goes 360 degrees around
			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );

			scope.update();

		}

		function handleTouchMoveDolly( event ) {

			//console.log( 'handleTouchMoveDolly' );

			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

			var distance = Math.sqrt( dx * dx + dy * dy );

			dollyEnd.set( 0, distance );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyOut( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyIn( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			scope.update();

		}

		function handleTouchMovePan( event ) {

			//console.log( 'handleTouchMovePan' );

			panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

			panDelta.subVectors( panEnd, panStart );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			scope.update();

		}

		function handleTouchEnd( event ) {

			//console.log( 'handleTouchEnd' );

		}

		//
		// event handlers - FSM: listen for events and reset state
		//

		function onMouseDown( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

			if ( event.button === scope.mouseButtons.ORBIT ) {

				if ( scope.enableRotate === false ) return;

				handleMouseDownRotate( event );

				state = STATE.ROTATE;

			} else if ( event.button === scope.mouseButtons.ZOOM ) {

				if ( scope.enableZoom === false ) return;

				handleMouseDownDolly( event );

				state = STATE.DOLLY;

			} else if ( event.button === scope.mouseButtons.PAN ) {

				if ( scope.enablePan === false ) return;

				handleMouseDownPan( event );

				state = STATE.PAN;

			}

			if ( state !== STATE.NONE ) {

				document.addEventListener( 'mousemove', onMouseMove, false );
				document.addEventListener( 'mouseup', onMouseUp, false );

				scope.dispatchEvent( startEvent );

			}

		}

		function onMouseMove( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

			if ( state === STATE.ROTATE ) {

				if ( scope.enableRotate === false ) return;

				handleMouseMoveRotate( event );

			} else if ( state === STATE.DOLLY ) {

				if ( scope.enableZoom === false ) return;

				handleMouseMoveDolly( event );

			} else if ( state === STATE.PAN ) {

				if ( scope.enablePan === false ) return;

				handleMouseMovePan( event );

			}

		}

		function onMouseUp( event ) {

			if ( scope.enabled === false ) return;

			handleMouseUp( event );

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );

			scope.dispatchEvent( endEvent );

			state = STATE.NONE;

		}

		function onMouseWheel( event ) {

			if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;

			event.preventDefault();
			event.stopPropagation();

			handleMouseWheel( event );

			scope.dispatchEvent( startEvent ); // not sure why these are here...
			scope.dispatchEvent( endEvent );

		}

		function onKeyDown( event ) {

			if ( scope.enabled === false || scope.enableKeys === false || scope.enablePan === false ) return;

			handleKeyDown( event );

		}

		function onTouchStart( event ) {

			if ( scope.enabled === false ) return;

			switch ( event.touches.length ) {

				case 1:	// one-fingered touch: rotate

					if ( scope.enableRotate === false ) return;

					handleTouchStartRotate( event );

					state = STATE.TOUCH_ROTATE;

					break;

				case 2:	// two-fingered touch: dolly

					if ( scope.enableZoom === false ) return;

					handleTouchStartDolly( event );

					state = STATE.TOUCH_DOLLY;

					break;

				case 3: // three-fingered touch: pan

					if ( scope.enablePan === false ) return;

					handleTouchStartPan( event );

					state = STATE.TOUCH_PAN;

					break;

				default:

					state = STATE.NONE;

			}

			if ( state !== STATE.NONE ) {

				scope.dispatchEvent( startEvent );

			}

		}

		function onTouchMove( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();
			event.stopPropagation();

			switch ( event.touches.length ) {

				case 1: // one-fingered touch: rotate

					if ( scope.enableRotate === false ) return;
					if ( state !== STATE.TOUCH_ROTATE ) return; // is this needed?...

					handleTouchMoveRotate( event );

					break;

				case 2: // two-fingered touch: dolly

					if ( scope.enableZoom === false ) return;
					if ( state !== STATE.TOUCH_DOLLY ) return; // is this needed?...

					handleTouchMoveDolly( event );

					break;

				case 3: // three-fingered touch: pan

					if ( scope.enablePan === false ) return;
					if ( state !== STATE.TOUCH_PAN ) return; // is this needed?...

					handleTouchMovePan( event );

					break;

				default:

					state = STATE.NONE;

			}

		}

		function onTouchEnd( event ) {

			if ( scope.enabled === false ) return;

			handleTouchEnd( event );

			scope.dispatchEvent( endEvent );

			state = STATE.NONE;

		}

		function onContextMenu( event ) {

			event.preventDefault();

		}

		//

		scope.domElement.addEventListener( 'contextmenu', onContextMenu, false );

		scope.domElement.addEventListener( 'mousedown', onMouseDown, false );
		scope.domElement.addEventListener( 'wheel', onMouseWheel, false );

		scope.domElement.addEventListener( 'touchstart', onTouchStart, false );
		scope.domElement.addEventListener( 'touchend', onTouchEnd, false );
		scope.domElement.addEventListener( 'touchmove', onTouchMove, false );

		window.addEventListener( 'keydown', onKeyDown, false );

		// force an update at start

		this.update();

	};

	OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
	OrbitControls.prototype.constructor = OrbitControls;

	Object.defineProperties( OrbitControls.prototype, {

		center: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .center has been renamed to .target' );
				return this.target;

			}

		},

		// backward compatibility

		noZoom: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
				return ! this.enableZoom;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
				this.enableZoom = ! value;

			}

		},

		noRotate: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
				return ! this.enableRotate;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
				this.enableRotate = ! value;

			}

		},

		noPan: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
				return ! this.enablePan;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
				this.enablePan = ! value;

			}

		},

		noKeys: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
				return ! this.enableKeys;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
				this.enableKeys = ! value;

			}

		},

		staticMoving : {

			get: function () {

				console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
				return ! this.enableDamping;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
				this.enableDamping = ! value;

			}

		},

		dynamicDampingFactor : {

			get: function () {

				console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
				return this.dampingFactor;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
				this.dampingFactor = value;

			}

		}

	} );

	return OrbitControls;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = scatterplot;

var _three = __webpack_require__(0);

var THREE = _interopRequireWildcard(_three);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * called from within JsPlot3D.js class plot
 * @param {object} parent this
 * @param {object} df df
 * @param {object} colors {dfColors, hueOffset}
 * @param {object} columns {x1col, x2col, x3col}
 * @param {object} normalization {normalizeX1, normalizeX2, normalizeX3, x1frac, x2frac, x3frac, minX1, minX2, minX3, maxX1, maxX2, maxX3}
 * @param {object} appearance {keepOldPlot, barchartPadding, barSizeThreshold, dataPointSize}
 * @param {object} dimensions {xLen, yLen, zLen}
 * @private
 */
function scatterplot(parent, df, colors, columns, normalization, appearance, dimensions) {
    var dfColors = colors.dfColors;

    var x1col = columns.x1col;
    var x2col = columns.x2col;
    var x3col = columns.x3col;

    var x1frac = normalization.x1frac;
    var x2frac = normalization.x2frac;
    var x3frac = normalization.x3frac;
    var minX1 = normalization.minX1;
    var minX2 = normalization.minX2;
    var minX3 = normalization.minX3;

    var keepOldPlot = appearance.keepOldPlot;
    var dataPointSize = appearance.dataPointSize;

    var xLen = dimensions.xLen;
    var yLen = dimensions.yLen;
    var zLen = dimensions.zLen;

    var isItValid = parent.IsPlotmeshValid("scatterplot");

    // dispose the old mesh if it is not used/valid anymore
    if (!keepOldPlot || !isItValid) {
        parent.disposePlotMesh();

        parent.plotmesh = new THREE.Group();
        parent.plotmesh.name = "scatterplot";
        parent.SceneHelper.scene.add(parent.plotmesh);
    }

    // laod the recently used material from the cache
    var material = parent.oldData.material;

    // the material is created here
    if (material === null || !isItValid || material !== null && material != dataPointSize) {

        // base64 created using tools/getBase64.html and tools/sprite.png
        var circle = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAQMAAACQp+OdAAAABlBMVEUAAAD///+l2Z/" + "dAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfhChkUDA4mTwuUAAAAHWlUWHR" + "Db21tZW50AAAAAABDcmVhdGVkIHdpdGggR0lNUGQuZQcAAACJSURBVCjPvZK7DcAgDESJUlAyAqMwGhktozACJUWEE+fQORJSlCp" + "ueJI/wnd27hHpwLuK7DcEkYqMCHJyxShBkVcoqEV1VGhoQltW6KNb+xfAhjE6iOABxSAAqkEENIMEON4gA/of8OU/8xbzprMas2I" + "Uk/Ka4LSAptAmGkcraa7ZzQPgSfBIECf/CnPyltYpaAAAAABJRU5ErkJggg==";
        // advantages over canvas: alpha pixels are not black. no need to redraw the circle

        var datapointSprite = new THREE.TextureLoader().load(circle);
        //let datapointSprite = new THREE.ImageUtils.loadTexture(circle)
        datapointSprite.needsUpdate = true;
        // plot it using circle sprites

        datapointSprite.magFilter = THREE.NearestFilter;
        datapointSprite.minFilter = THREE.NearestFilter;

        // https:// github.com/mrdoob/three.js/issues/1625
        // alphaTest = 1 causes errors
        // alphaTest = 0.9 edgy picture
        // alphaTest = 0.1 black edges on the sprite
        // alphaTest = 0 not transparent infront of other sprites anymore
        // sizeAttenuation: false, sprites don't change size in distance and size is in px
        material = new THREE.PointsMaterial({
            size: dataPointSize,
            map: datapointSprite,
            transparent: true,
            alphaTest: 0.5,
            vertexColors: true,
            sizeAttenuation: true
        });

        parent.oldData.material = material;
    }

    var group = parent.plotmesh;
    var geometry = new THREE.Geometry();

    for (var i = 0; i < df.length; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = df[i][x1col];
        vertex.y = df[i][x2col];
        vertex.z = df[i][x3col];

        // three.js handles invalid vertex already by skipping them
        geometry.vertices.push(vertex);
        geometry.colors.push(dfColors[i]);
    }

    geometry.verticesNeedUpdate = true;

    var newDataPointSprites = new THREE.Points(geometry, material);

    group.add(newDataPointSprites);

    // normalize
    parent.plotmesh.scale.set(xLen / x1frac, yLen / x2frac, zLen / x3frac);
    parent.plotmesh.position.set(-minX1 / x1frac * xLen, -minX2 / x2frac * yLen, -minX3 / x3frac * zLen);

    parent.benchmarkStamp("made a scatterplot");
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = lineplot;

var _three = __webpack_require__(0);

var THREE = _interopRequireWildcard(_three);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * called from within JsPlot3D.js class plot
 * @param {object} parent this
 * @param {object} df df
 * @param {object} colors {dfColors, hueOffset}
 * @param {object} columns {x1col, x2col, x3col}
 * @param {object} normalization {normalizeX1, normalizeX2, normalizeX3, x1frac, x2frac, x3frac, minX1, minX2, minX3, maxX1, maxX2, maxX3}
 * @param {object} appearance {keepOldPlot, barchartPadding, barSizeThreshold, dataPointSize}
 * @private
 */
function lineplot(parent, df, colors, columns, normalization, appearance) {
    var dfColors = colors.dfColors;

    var x1col = columns.x1col;
    var x2col = columns.x2col;
    var x3col = columns.x3col;

    var x1frac = normalization.x1frac;
    var x2frac = normalization.x2frac;
    var x3frac = normalization.x3frac;
    var minX1 = normalization.minX1;
    var minX2 = normalization.minX2;
    var minX3 = normalization.minX3;

    var keepOldPlot = appearance.keepOldPlot;
    var dataPointSize = appearance.dataPointSize;

    // iterate over dataframe datapoints, connect the latest point with the new one
    //  +---+---+---+--> +   +   +
    // it goes zig zag through the 3D Space

    // Based on scatterplot

    var wireframeLinewidth = dataPointSize * 100;

    var isItValid = parent.IsPlotmeshValid("lineplot");
    var isOldMaterialSimilar = parent.oldData != undefined && parent.oldData.material != undefined && wireframeLinewidth === parent.oldData.material.wireframeLinewidth;

    if (!keepOldPlot || !isItValid || !isOldMaterialSimilar) {
        parent.disposePlotMesh();

        var _material = new THREE.LineBasicMaterial({
            vertexColors: THREE.VertexColors,
            linewidth: wireframeLinewidth,
            linecap: "round",
            linejoin: "round"
        });

        parent.oldData.material = _material;
        parent.plotmesh = new THREE.Group();
        parent.plotmesh.name = "lineplot";
        parent.SceneHelper.scene.add(parent.plotmesh);
    }

    var material = parent.oldData.material;
    var group = parent.plotmesh;
    var geometry = new THREE.Geometry();

    for (var i = 0; i < df.length; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = (df[i][x1col] - minX1) / x1frac * parent.dimensions.xLen;
        vertex.y = (df[i][x2col] - minX2) / x2frac * parent.dimensions.yLen;
        vertex.z = (df[i][x3col] - minX3) / x3frac * parent.dimensions.zLen;

        // three.js handles invalid vertex already by skipping them
        geometry.vertices.push(vertex);
        /*if(i > 1)
        {
            let newFace = new THREE.Face3(i-1, i-1, i)
            newFace.vertexColors[0] = dfColors[i-1]
            newFace.vertexColors[1] = dfColors[i-1]
            newFace.vertexColors[2] = dfColors[i]
            geometry.faces.push(newFace)
        }*/

        geometry.colors.push(dfColors[i]);
    }

    var newDataPointSprites = new THREE.Line(geometry, material);

    group.add(newDataPointSprites);
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = barchart;

var _three = __webpack_require__(0);

var THREE = _interopRequireWildcard(_three);

var _ColorLib = __webpack_require__(1);

var COLORLIB = _interopRequireWildcard(_ColorLib);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * called from within JsPlot3D.js class plot. The parameters from this function have the same names as the variables in JsPlot3D.
 * @param {object} parent this
 * @param {object} df df
 * @param {object} colors {dfColors, hueOffset}
 * @param {object} columns {x1col, x2col, x3col}
 * @param {object} normalization {normalizeX1, normalizeX2, normalizeX3, x1frac, x2frac, x3frac, minX1, minX2, minX3, maxX1, maxX2, maxX3}
 * @param {object} appearance {keepOldPlot, barchartPadding, barSizeThreshold, dataPointSize}
 * @param {object} mode 0 or 1 (JSPLOT3D.DEFAULTCAMERA or JSPLOT3D.TOPCAMERA)
 * @private
 */
function barchart(parent, df, colors, columns, normalization, appearance, mode) {

    var dfColors = colors.dfColors;
    var hueOffset = colors.hueOffset;

    var x1col = columns.x1col;
    var x2col = columns.x2col;
    var x3col = columns.x3col;

    var normalizeX1 = normalization.normalizeX1;
    var normalizeX2 = normalization.normalizeX2;
    var normalizeX3 = normalization.normalizeX3;
    var x1frac = normalization.x1frac;
    var x2frac = normalization.x2frac;
    var x3frac = normalization.x3frac;
    var minX1 = normalization.minX1;
    var minX2 = normalization.minX2;
    var minX3 = normalization.minX3;
    var maxX2 = normalization.maxX2;

    var keepOldPlot = appearance.keepOldPlot;
    var barchartPadding = appearance.barchartPadding;
    var barSizeThreshold = appearance.barSizeThreshold;
    var labeled = appearance.labeled;

    // parent.oldData.previousX2frac = 1 // for normalizationSmoothing. Assume that the data does not need to be normalized at first
    // let xBarOffset = 1/parent.dimensions.xRes/2
    // let zBarOffset = 1/parent.dimensions.zRes/2

    if (mode == 1) console.warn("scatterplot mode is recommended"); // much more performance

    // if normalization is on, make sure that the bars at x=0 or z=0 don't intersect the axes
    var xOffset = 0;
    var zOffset = 0;
    // don't exceed the space as shown by the gridHelper
    if (normalizeX1) {
        xOffset = 1 / parent.dimensions.xRes / 2; //only half of the bar has to be moved away
    }
    if (normalizeX3) {
        zOffset = 1 / parent.dimensions.zRes / 2;
    }

    // helper function
    var createBar = function createBar(x, z) {
        // create the bar
        // I can't put 0 into the height parameter of the CubeGeometry constructor because if I do it will not construct as a cube
        var shape = void 0;
        var height = 1; // default is always 1. The height is changed using scale at a later point
        if (mode == 1) // topcamera
            height = 0; // in this case create is as planes with only 4 vertex (i don't need more than that, a + for performance)

        shape = new THREE.CubeGeometry((1 - barchartPadding) / parent.dimensions.xRes, height, (1 - barchartPadding) / parent.dimensions.zRes);

        // use translate when the position property should not be influenced
        // shape.translate(xBarOffset,0, zBarOffset)

        var plotmat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0,
            emissiveIntensity: 0.98,
            roughness: 1
        });

        var bar = new THREE.Mesh(shape, plotmat);
        bar.position.set(x / parent.dimensions.xRes + xOffset, 0, z / parent.dimensions.zRes + zOffset);
        bar.geometry.translate(0, 0.5, 0); // move it so that the bottom plane is at y=0
        parent.plotmesh.add(bar);

        // normalize scaling
        // the plot is basically built inside a 1x1x1 space. now it becomes the xLen, yLen and zLen space
        parent.plotmesh.scale.set(parent.dimensions.xLen, parent.dimensions.yLen, parent.dimensions.zLen);

        return bar;
    };

    // if needed, reconstruct the complete barchart
    var valid = parent.IsPlotmeshValid("barchart") && parent.oldData.barsGrid !== null && barchartPadding == parent.oldData.barchartPadding;
    // shape of bars changed? recreate from scratch
    // let paddingValid = (options.barchartPadding === undefined && parent.oldData.options.barchartPadding === undefined) || (barchartPadding === parent.oldData.options.barchartPadding)

    // load what is stored
    var barsGrid = parent.oldData.barsGrid;

    if (!valid) {
        parent.disposePlotMesh();

        barsGrid = {};
        parent.oldData.barsGrid = barsGrid;
        parent.oldData.barchartPadding = barchartPadding;

        // into this group fill the bars
        var cubegroup = new THREE.Group();
        cubegroup.name = "barchart";

        parent.plotmesh = cubegroup;
        parent.SceneHelper.scene.add(cubegroup);
    } else {
        // reset all the heights. for key in loops are horribly slow,
        // but still better than resetting the complete grid and creating it from scratch
        // because this way the bars don't have to be recreated again
        if (!keepOldPlot) {
            for (var x in barsGrid) {
                for (var z in barsGrid[x]) {
                    barsGrid[x][z].y = 0;
                    barsGrid[x][z].count = 0;
                }
            }
        }
    }

    // fill the barsGrid array with the added heights of the bars
    // get a point from the dataframe. Calculate the coordinates from that.
    // to do this, the value has to be brought down to the normalized value (/x1frac). It now has maximum values of [-1, +1].
    // multiply by xVerticesCount, to get maximum values of [-xVerticesCount, +xVerticesCount]. Now apply the offset of +xVerticesCount to transform it to
    //[0, 2*xVerticesCount]
    // afterwards get that to an array index. remember, that the array has some parts reserved for negative x and z values by using an offset
    // so, divide x_float by x1frac and multiply it by xVerticesCount.
    // x_float = df[i][x1col]/x1frac*xVerticesCount = df[i][x1col]/(x1frac/xVerticesCount) = df[i][x1col]*(xVerticesCount/x1frac) = df[i][x1col]*xVerticesCount/x1frac
    var factorX1 = (parent.dimensions.xRes - 1) / x1frac;
    var factorX3 = (parent.dimensions.zRes - 1) / x3frac;

    // use the maximums from the recent run if keepOldPlot
    maxX2 = parent.oldData.normalization.maxX2;
    minX2 = parent.oldData.normalization.minX2;
    if (!keepOldPlot) {
        // bars all start at y = 0 and grow towards -inf and +inf, so 0 is safe to assume
        maxX2 = 0;
        minX2 = 0;
    }

    // helper function for interpolation
    var addToHeights = function addToHeights(x, y, z, x_float, z_float, i) {
        /*
         *       a +----------+ b
         *         |     |    |
         *         |-----+    |
         *         |     e    |
         *         |          |
         *       c +----------+ d
         */
        // example: calculate how much to add of y to pixel d. e has the coordinates x_float and z_float
        // calculate the area of the rectangle (called let oppositeSquare) between a (coordinates x and z) and e and multiply that by y
        // that result can be added to [value y of d]
        // small rectangle => small area => small change for d
        // large rectangle => large area => change value at d by a lot

        var oppositeSquareArea = Math.abs(1 - Math.abs(x - x_float)) * (1 - Math.abs(z - z_float));

        if (oppositeSquareArea === 0) return;

        // create x and z indices if needed
        if (!barsGrid[x]) {
            barsGrid[x] = {};
        }
        if (!barsGrid[x][z]) {
            barsGrid[x][z] = {}; // holds the bar object and y for this x, z position
            barsGrid[x][z].y = 0;
            barsGrid[x][z].count = 0;
        }

        // update the heights
        barsGrid[x][z].y += y * oppositeSquareArea; // initialized with 0, now +=

        // +=, because otherwise it won't interpolate. It has to add the value to the existing value

        // find the highest bar
        // even in case of normalizeX2 being false, do this, so that the heatmapcolor can be created
        if (barsGrid[x][z].y > maxX2) maxX2 = barsGrid[x][z].y;
        if (barsGrid[x][z].y < minX2) minX2 = barsGrid[x][z].y;

        // if needed create the bar. Don't set the height yet
        // the height gets set once maxX2 and minX2 are ready
        if (!barsGrid[x][z].bar) {
            barsGrid[x][z].bar = createBar(x, z);
            // initial color approximation
            barsGrid[x][z].bar.material.emissive.set(COLORLIB.convertToHeat(y, minX2, maxX2, hueOffset));
        }

        // LABELS:
        if (labeled) {
            var count = barsGrid[x][z].count;
            var w = oppositeSquareArea;

            // THREE.Color object that represents the label from the datapoint that is being interpolated
            var newc = new THREE.Color(0).copy(dfColors[i]);

            var avg = void 0;
            if (count == 0) {
                avg = newc;
            } else {
                var oldc = void 0;
                oldc = barsGrid[x][z].bar.material.emissive;

                var average = function average(newc, old, weight) {
                    return (newc * weight + old * (count + (1 - weight))) / (count + 1);
                };

                avg = new THREE.Color(average(newc.r, oldc.r, w), average(newc.g, oldc.g, w), average(newc.b, oldc.b, w));
                // ((new*weight) + old*(count+(1-weight))))/(count+1) = avgWeighted 

                // for weight=0 it turns to avg = old*(count+1)/(count+1)
                // for weight=1 it turns to avg = (new + old*count)/(count+1)

                // for count=1 and weight=1 it turns to avg = (new + old*1)/2
                // for count=1 and weight=0 it turns to avg = (new*0 + old*2)/2

                // for count=1 and weight=0.5 it turns to avg = (new*0.5 + old*1.5)/2
            }

            barsGrid[x][z].bar.material.emissive.set(avg);

            barsGrid[x][z].count++;
        }

        return;
    }; // end function declaration of addToHeights

    // don't get fooled and write code here and suspect it to run after the
    // normalization. Write it below the loop that calls addToHeights. Code below this comment
    // is for preparation of the normalization

    for (var i = 0; i < df.length; i++) {

        // INTERPOLATE

        // get coordinates that can fit into an array
        // interpolate. When x and z is at (in case of parseFloat) e.g. 2.5,1. Add one half to 2,1 and the other hald to 3,1 

        // when normalizing, the data gets moved from the negative space to the positive space that the axes define
        // Data will then touch the x1x3, x1x2 and x3x2 planes instead of being somewhere far off at negative spaces
        // does this description make sense? i hope so.
        var x_float = (df[i][x1col] - minX1) * factorX1;
        var z_float = (df[i][x3col] - minX3) * factorX3;

        var x_le = x_float | 0; // left
        var z_ba = z_float | 0; // back

        var y = df[i][x2col]; // don't normalize yet

        //handle invalid datapoints
        if (isNaN(y)) {
            console.warn("the dataframe contained a non-number value at", i, x2col, "called \"", y, "\". skipping that datapoint now");
            continue; //skip
        }

        // if x_float and z_float it somewhere inbewteen
        if (x_float != x_le || z_float != z_ba) {
            var x_ri = x_le + 1; // right
            var z_fr = z_ba + 1; // front

            addToHeights(x_le, y, z_ba, x_float, z_float, i);
            addToHeights(x_ri, y, z_ba, x_float, z_float, i);
            addToHeights(x_le, y, z_fr, x_float, z_float, i);
            addToHeights(x_ri, y, z_fr, x_float, z_float, i);
        } else {
            // otherwise I can just plot it a little bit cheaper,
            // when x_float and z_float perfectly aligns with the grid
            addToHeights(x_le, y, z_ba, x_float, z_float, i);
        }
    }

    // percent of largest bar
    barSizeThreshold = barSizeThreshold * Math.max(Math.abs(maxX2), Math.abs(minX2));

    if (normalizeX2 === true) {
        // let a = Math.max(Math.abs(maxX2), Math.abs(minX2)) // based on largest |value|
        // let b = Math.abs(maxX2-minX2) // based on distance between min and max
        // x2frac = Math.max(a, b) // hybrid

        x2frac = Math.abs(maxX2 - minX2); // based on distance between min and max

        // If I should ever want to reimplement the normalizationSmoothing (decided against it because I didn't want the code to get more complex):
        // a lower value of normalizationSmoothing will result in faster jumping around plots. 0 Means no smoothing this happens, because 
        // sometimes the plot might be close to 0 everywhere. This is not visible because of the normalization though one the sign
        // changes, it will immediatelly jump to be normalized with a different sign. To prevent this one can smoothen the variable x2frac
        // x2frac = (x2frac + normalizationSmoothing*parent.oldData.previousX2frac)/(normalizationSmoothing+1)
        // parent.oldData.previousX2frac = x2frac
        // this is a little bit too experimental at the moment. Once everything runs properly stable it's worth thinking about it
    }

    // now color the children & normalize
    var factor = 1 / x2frac; // normalize y
    for (var _x in barsGrid) {
        for (var _z in barsGrid[_x]) {

            var bar = barsGrid[_x][_z].bar;

            var _y = barsGrid[_x][_z].y;

            // hide that bar if it's smaller than or equal to the threshold
            // y is now normalized (|y| is never larger than 1), so barSizeThreshold acts like a percentage value
            if (Math.abs(_y) > barSizeThreshold && _y !== 0) {
                // update colos in a 15fps cycle for better performance
                if (!labeled && parent.fps15 === 0) {
                    // HEATMAP:
                    var color = COLORLIB.convertToHeat(_y, minX2, maxX2, hueOffset);
                    // bar.material.color.set(color) // .color property should stay the way it is defined (0xffffff), it's important for proper lighting
                    bar.material.emissive.set(color);
                }

                _y = _y * factor;

                if (_y < 0) {
                    // don't make the scaling negative, because otherwise the faces at the top receive light from the bottom
                    // scale them in a positive way and move them to the bottom so that the top face of the bar is at y=0
                    bar.scale.set(1, -_y, 1);
                    bar.position.set(bar.position.x, _y, bar.position.z);
                } else {
                    bar.scale.set(1, _y, 1);
                    // reset position by moving the bottom face of the bar to y=0
                    bar.position.set(bar.position.x, 0, bar.position.z);
                }

                // make sure the updated vertex actually display
                bar.geometry.verticesNeedUpdate = true;
            } else {
                parent.SceneHelper.disposeMesh(bar);
                barsGrid[_x][_z].bar = null;
            }
        }
    }

    // write back. as normalization points to the object in the Plot class, it will be overwritten there
    normalization.minX2 = minX2;
    normalization.maxX2 = maxX2;
    normalization.x2frac = x2frac;
}

/***/ })
/******/ ]);