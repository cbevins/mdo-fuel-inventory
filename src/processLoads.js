import { modPlotData } from './modPlotData.js'
import { load1h, load10h, load100h, loadSound, loadRotten } from './modFuelProcessor.js'

// Transect lengths
const length1 = 6
const length10 = 6
const length100 = 12
const length1000 = 35

// This is the arithmetic average diameter of sound 1000-h fuels from 'sound_diameters_2' worksheet
const soundDiam = 6.869565217391305 // n = 23
const rottenDiam = 6 // n = 1

function fmt (val, dec = 0, wid = 0) { return val.toFixed(dec).padStart(wid) }

// Returns string of tons/acre with 2 decimal points from lbs/acre
function tpa (ppa, wid = 7) { return fmt(ppa / 2000, 2, wid) }

// Calculates dead and down fuel load for each plot
function processLoads (plots) {
  let str1 = 'Plot Spec     1-h   10-h  100-h   Fine  Sound Rotten 1000-h  Total\n'
  // eslint-disable-next-line quotes
  let csv = 'Plot,Spec,1-h,10-h,100-h,Fine,Sound,Rotten,1000-h,Total\n'
  const soundDiam2 = soundDiam * soundDiam
  plots.forEach(plot => {
    const slp = plot.transectSlopePct
    const load = {}
    const spp = plot.speciesName.substr(0, 4)
    load.h1 = load1h(plot.deadDown.h1.line + plot.deadDown.h1.plane, length1, slp)
    load.h10 = load10h(plot.deadDown.h10.line + plot.deadDown.h10.plane, length10, slp)
    load.h100 = load100h(plot.deadDown.h100.line + plot.deadDown.h100.plane, length100, slp)
    load.fine = load.h1 + load.h10 + load.h100

    // h1000.transect does not distinguish between sound and rotten, so assume all are sound
    load.sound = loadSound(plot.deadDown.h1000.transect * soundDiam2, length1000, slp)
    load.rotten = 0
    load.h1000 = load.sound + load.rotten
    load.total = load.fine + load.h1000
    str1 += fmt(plot.plotNumber, 0, 4) + ' ' + spp + ' ' +
      tpa(load.h1) + tpa(load.h10) + tpa(load.h100) + tpa(load.fine) +
      tpa(load.sound) + tpa(load.rotten) + tpa(load.h1000) + tpa(load.total) + '\n'
    csv += `${plot.plotNumber},${spp},${load.h1.toFixed(0)},${load.h10.toFixed(0)},${load.h100.toFixed(0)},` +
    `${load.fine.toFixed(0)},${load.sound.toFixed(0)},${load.rotten.toFixed(0)},${load.h1000.toFixed(0)},${load.total.toFixed(0)}\n`
  })
  console.log(str1)
  console.log(csv)
}

processLoads(modPlotData)
