"use strict"
/* live example */

let plot = new JSPLOT3D.Plot(document.getElementById("threecanvas"), {
    backgroundColor:"#293542",
    axesColor:"#ffffff"
})
plot.createLegend(document.getElementById("Legend"))

let data = ""
let cached = false
let fname = ""
let recentplot = function(){} // stores the event that was used recently to plot (formula or csv)
let recentplote = null // so that it can be easily repeated


main()




/**
 * returns the value of a settings input
 * @param {string} id id of the input element that contains a value
 */
function getVal(id)
{
    let elem = document.getElementById(id)
    let value = elem.value
    // undefined by default
    if(value == "")
        return undefined

    // boolean
    if(value == "true")
    {
        return true
    }
    else if(value == "false")
    {
        return false
    }
    else
    {
        // 0xhex
        let parsed
        if(value && value.startsWith("0x"))
        {
            parsed = parseInt(value)
        }
        else
        {
            parsed = parseFloat(value)
        }

        if(!isNaN(parsed))
        {
            value = parsed
        }
    }

    return value
}



/**
 * returns a json object that contains all the settings. compatible to JsPlot3D
 */
function getOptions()
{

    let mode = getVal("mode")
    let normalizeX1 = getVal("normalizeX1")
    let normalizeX2 = getVal("normalizeX2")
    let normalizeX3 = getVal("normalizeX3")
    let xRes = getVal("xRes")
    let zRes = getVal("zRes")
    let barchartPadding = getVal("barchartPadding")
    let barSizeThreshold = getVal("barSizeThreshold")
    let defaultColor = getVal("defaultColor")
    let hueOffset = getVal("hueOffset")
    let title = getVal("title")
    let x1title = getVal("x1title")
    let x2title = getVal("x2title")
    let x3title = getVal("x3title")
    let fraction = getVal("fraction")
    let keepOldPlot = getVal("keepOldPlot")
    let colorCol = getVal("colorCol")
    let dataPointSize = getVal("dataPointSize")
    let header = getVal("header")
    let separator = getVal("separator")
    let labeled = getVal("labeled")
    let filterColor = getVal("filterColor")
    
    return {
        mode: mode,
        normalizeX1: normalizeX1,
        normalizeX2: normalizeX2,
        normalizeX3: normalizeX3,
        xRes: xRes,
        zRes: zRes,
        barchartPadding: barchartPadding,
        barSizeThreshold: barSizeThreshold,
        defaultColor: defaultColor,
        hueOffset: hueOffset,
        title: title,
        x1title: x1title,
        x2title: x2title,
        x3title: x3title,
        fraction: fraction,
        keepOldPlot: keepOldPlot,
        colorCol: colorCol,
        dataPointSize: dataPointSize,
        header: header,
        separator: separator,
        labeled: labeled,
        filterColor: filterColor,    
    }
}



/**
 * plots a .csv file using the contents of the decodedData letiable
 */
function plotcsv()
{
    // (calling it function plot() throws an error)

    let x1 = document.getElementById("x1").value
    let x2 = document.getElementById("x2").value
    let x3 = document.getElementById("x3").value
    if(x1 == "") x1 = undefined
    if(x2 == "") x2 = undefined
    if(x3 == "") x3 = undefined

    let options = getOptions()
    if(options.title == undefined)
        options.title = fname

    plot.plotCsvString(data, x1, x2, x3, options)

    // display the dataframes head
    if(plot.oldData.dataframe != undefined)
    {
        let tableData = plot.oldData.dataframe.slice(0, 19)
        let table = "<table>"

        table += "<tr><td>indices:</td></tr><tr>"
        let i
        for(i = 0;i < tableData[0].length; i++)
            table += "<td>"+i+"</td>"
        table += "</tr><tr><td>data:</td></tr>"

        for(i = 0;i < tableData.length; i++)
            tableData[i] = "<td>"+tableData[i].join("</td><td>")+"</td>"

        table += "<tr>"+tableData.join("</tr><tr>")+"</tr>"
        table += "</table>"

        document.getElementById("csvhead").innerHTML = "head of dataframe:<br/><br/>"+table
    }
}



/**
 * entrypoint
 */
function main()
{
    // plot the formula
    let formulaFormSubmit = function(e)
    {
        e.preventDefault()
        cached = false
        recentplot = formulaFormSubmit
        recentplote = e
        let formula = document.getElementById("formulaText").value
        let options = getOptions()
        plot.plotFormula(formula, {}, options)
    }


    // plot the csv
    let csvFormSubmit = function(e)
    {
        e.preventDefault()
        recentplot = csvFormSubmit
        recentplote = e
        // read file only if it has changed (event on fileup "change")
        if(!cached)
        {
            let reader = new FileReader()
            let file = document.getElementById("fileup").files[0]

            if(!file) {
                console.error("Something went wrong while processing your file using a JavaScript FileReader, because the file is undefined. Here is some debug information:")
                console.error(document.getElementById("fileup"))
                console.error(reader)
                return window.alert("please reupload your file")
            }

            reader.readAsText(file)
            reader.onload = function(e)
            {
                data = e.target.result

                fname = file.name

                cached = true
                plotcsv()
            }
        }
        else
        {
            console.log("using cached data")
            plotcsv()
        }
    }



    // add those two functions to the event listeners
    // I'm doing this because i want to keep track of the recently used function using recentplot and recentplote
    document.getElementById("formulaForm").addEventListener("submit", function(e){formulaFormSubmit(e)})
    document.getElementById("csvform").addEventListener("submit", function(e){csvFormSubmit(e)})


    document.getElementById("setDimensions").addEventListener("submit", function(e)
    {
        e.preventDefault()
        plot.setDimensions({
            xRes: getVal("xRes"),
            zRes: getVal("zRes"),
            xLen: getVal("xLen"),
            yLen: getVal("yLen"),
            zLen: getVal("zLen")
        })
        recentplot(recentplote)
    })


    document.getElementById("setBackgroundColor").addEventListener("submit", function(e)
    {
        e.preventDefault()
        plot.setBackgroundColor(getVal("backgroundColor"))
        recentplot(recentplote)
    })
    
    
    document.getElementById("setAxesColor").addEventListener("submit", function(e)
    {
        e.preventDefault()
        plot.setAxesColor(getVal("axesColor"))
        recentplot(recentplote)
    })


    // add the filename as string next to the button
    document.getElementById("fileup").addEventListener("change", function(e)
    {
        cached = false
        data = ""
        document.getElementById("fileuplabel").innerHTML = e.target.files[0].name
        document.getElementById("submitcsv").style.display = "inline"
    })



    // repeat the recent plot when hitting enter in the settings form
    document.getElementById("settings").addEventListener("submit", function(e)
    {
        e.preventDefault()
        recentplot(recentplote)
    })
    
    let showtooltips = document.getElementById("showtooltips")
    showtooltips.addEventListener("click", function(e)
    {
        let mainelement = document.getElementById("main")
        if(showtooltips.className === "checked")
        {
            mainelement.className = "tooltipsdisabled"
            showtooltips.className = ""
        }
        else
        {
            mainelement.className = ""
            showtooltips.className = "checked"
        }
    })
}





















