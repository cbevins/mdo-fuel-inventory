import { modPlotData } from './modPlotData.js'
import { load1h, load10h, load100h } from './modFuelParms.js'

// Transect lengths
const length1 = 6
const length10 = 6
const length100 = 12
const length1000 = 35

function fmt (val, dec = 0, wid = 0) { return val.toFixed(dec).padStart(wid) }

// Returns string of tons/acre with 2 decimal points from lbs/ft2
function tpa (pf2, wid = 6) { return fmt(pf2 / 2000, 2, wid) }

function processLoads (plots) {
  plots.forEach(plot => {
    const slp = plot.transectSlopePct
    const load1 = load1h(plot.deadDown.h1.line + plot.deadDown.h1.plane, length1, slp)
    const load10 = load10h(plot.deadDown.h10.line + plot.deadDown.h10.plane, length10, slp)
    const load100 = load100h(plot.deadDown.h100.line + plot.deadDown.h100.plane, length100, slp)
    const loadFine = load1 + load10 + load100
    console.log(fmt(plot.plotNumber, 0, 2), tpa(load1), tpa(load10), tpa(load100), tpa(loadFine))
  })
}

processLoads(modPlotData)
