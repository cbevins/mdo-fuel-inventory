/**
 * Functions to convert MOD Fuel Inventory worksheets into a map of Javascript objects
 *
 * These are the fields that link spreadsheet records by plot:
 * - survey_0:B 'GlobalID'
 * - planar_1:F 'ParentGlobalID'
 * - sound_diameters_2:D 'ParentGlobalID'
 * - rotten_diameters_3:D 'ParentGlobalID'
 * - Bark_measurements_4:F 'ParentGlobalID'
 * - small_trees_5:F 'ParentGlobalID'
 * - Shrub_plot_1_stem_count_6:F 'ParentGlobalID'
 * - Shrub_plot_2_stem_count_7:F 'ParentGlobalID'
 *
 * @param {array} rows  Array of spreadsheet rows as returned by readXlsxFile(),
 * where each row is an array of cell values.
 * @returns
 */

export const shrubMap = new Map()
export const overstoryMap = new Map()
export const treeMap = new Map()

function num (n) { return n === null ? 0 : +n }

/**
 * Creates the plotMap and initializes it with 'survey_0' worksheet data
 * @param {array} rows  Array of survey_0 spreadsheet rows as returned by readXlsxFile(),
 * @returns {Map} Newly created Javascript Map of plot GlobalID => plotObject
 */
export function addSurvey (rows) {
  const plotMap = new Map()
  rows.forEach((c, idx) => {
    const plot = {
      // objectId: c[0], // survey_0:A 'ObjectID'
      gid: c[1], // survey_0:B 'GlobalID'
      plotNumber: c[2], // survey_0:C 'Plot Number'
      // date: c[3], // survey_0:D 'Date'
      // surveyor: c[4], // survey_0:E 'Surveyor Initials'
      speciesName: c[5] === null ? 'NONE' : c[5], // survey_0:F 'Dominant eucalyptus species'
      azimuth: num(c[6]), // survey_0:G 'Azimuth', degrees
      terrainSlopePct: num(c[7]), // survey_0:H 'Terrain Slope %'
      aspectCode: c[8], // survey_0:I 'Aspect' alpha code
      elevationFt: num(c[9]), // survey_0:J 'Elevation (ft)'
      transectSlopePct: num(c[10]), // survey_0:K 'Transect % slope'
      deadDown: {
        h1: {
          line: num(c[14]), // survey_0:O '1-hr fuels that intersect transect line (0-6)'
          plane: 0 // planar_1:C '1-hr fuels that cross planar intersect'
        },
        h10: {
          line: num(c[13]), // survey_0:N '10-hr fuels that intersect transect line (0-6)'
          plane: 0 // planar_1:D '10-hr fuels that cross planar intersect'
        },
        h100: {
          line: num(c[12]), // survey_0:M '100-hr fuels that intersect transect line (0-12ft)'
          plane: 0 // planar_1:E '100-hr fuels that cross planar intersect'
        },
        h1000: {
          transect: num(c[11]), // survey_0:L '1000-hr fuels that intesect transect line (0-35ft)'
          rottenDiam: [], // rotten_diameters_3:C 'All fuel diameters >3" round to nearest .25 inch. (i.e. .25, .5 .75)'
          soundDiam: [] // sound_diameters_2:C 'All fuel diameters >3" round to nearest .25 inch. (i.e. .25, .5 .75)'
        }
      },
      duff: {
        depthAt1Ft: num(c[15]), // survey_0:P 'Duff Depth (in) at 1 ft mark (in)'
        depthAt6Ft: num(c[16]), // survey_0:Q 'Duff Depth at 6ft mark (in)'
        avgCalc: num(c[17]), // survey_0:R 'average_duff_calc'
        avg: num(c[18]) // survey_0:S 'Average Duff'
      },
      litter: {
        depthAt1Ft: num(c[19]), // survey_0:T 'Litter depth at the 1 ft mark (in)'
        depthAt12Ft: num(c[20]), // survey_0:U 'Litter depth at the 12 ft mark (in)'
        depthAt30Ft: num(c[21]), // survey_0:V 'Litter depth at the 30 ft mark (in)'
        avgCalc: num(c[22]), // survey_0:W 'average_litter_calc'
        avg: num(c[23]) // survey_0:X 'Average Litter'
      },
      bark: { // Bark_measurements_4:F 'ParentGlobalID'
        count: num(c[24]), // survey_0:Y 'Bark Count (6-7' range)'
        thickness: [], // Bark_measurements_4:C 'Bark thickness (cm)'
        width: [], // Bark_measurements_4:D 'bark width (cm)'
        length: [] // Bark_measurements_4:E 'Bark length (cm)'
      },
      trees: {
        species: [], // small_trees_5:C 'Species'
        number: [], // small_trees_5:D 'Number'
        avgHeight: [] // small_trees_5:E 'Average Height (ft)'
      },
      shrub: {
        plot1: {
          liveDeadCoverPct: num(c[25]), // survey_0:Z 'Shrub Percent cover live and dead' (code)
          deadCoverPct: num(c[26]), // survey_0:AA 'Plot 1Shrub percent cover dead' (code)
          avgHeight: num(c[27]), // survey_0:AB 'Plot 1 Shrub Average Height'
          stems: {
            species: [], // Shrub_plot_1_stem_count_6:C 'Shrub Species' (alpha code)
            number: [], // Shrub_plot_1_stem_count_6:D 'Number of Stems' (integer)
            sizeClass: [] // Shrub_plot_1_stem_count_6:E 'Size class' (number range)
          }
        },
        plot2: {
          liveDeadCoverPct: num(c[28]), // survey_0:AC 'Plot 2 Shrub Percent cover live and dead'
          deadCoverPct: num(c[29]), // survey_0:AD 'Plot 2 Shrub percent cover dead'
          avgHeight: num(c[30]), // survey_0:AE 'Plot 2 ShrubAverage Height'
          stems: {
            species: [], // Shrub_plot_2_stem_count_7:C 'Shrub Species' (alpha code)
            number: [], // Shrub_plot_2_stem_count_7:D 'Number of Stems' (integer)
            sizeClass: [] // Shrub_plot_2_stem_count_7:E 'Size class' (number range)
          }
        }
      },
      liveDeadHerb: {
        subPlot1: num(c[31]), // survey_0:AF 'Live and Dead Herbaceous subplot 1'
        subPlot2: num(c[32]), // survey_0:AG 'Live and Dead Herbaceous subplot 2'
        subPlot3: num(c[33]), // survey_0:AH 'Live and Dead Herbaceous subplot 3'
        subPlot4: num(c[34]) // survey_0:AI 'Live and Dead Herbaceous subplot 4'
      },
      deadHerb: {
        subPlot1: num(c[35]), // survey_0:AJ 'Dead Herceous subplot 1'
        subPlot2: num(c[36]), // survey_0:AK 'Dead Herceous subplot 2'
        subPlot3: num(c[37]), // survey_0:AL 'Dead Herceous subplot 3'
        subPlot4: num(c[38]) // survey_0:AM 'Dead Herceous subplot 4'
      },
      herbCoverPct: {
        subPlot1: num(c[39]), // survey_0:AN 'Percent Cover Herbaceous subplot 1'
        subPlot2: num(c[40]) // survey_0:AO 'Percent Cover Herbaceous subplot 2'
      },
      // creationDate: c[41], // survey_0:AP 'Creation Date'
      // creator: c[42], // survey_0:AQ 'Creator'
      // editDate: c[43], // survey_0:AR 'EditDate'
      // editor: c[44], // survey_0:AS 'Editor'
      notes: c[45] === null ? '' : c[45], // survey_0:AT 'Notes'
      x: num(c[46]), // survey_0:AU 'x' (degrees longitude))
      y: num(c[47]) // survey_0:AV 'y' (degrees latitude)
    }
    // skip header row and disturbed/managed plots
    if (idx && plot.plotNumber !== 9 && plot.plotNumber !== 10) {
      plotMap.set(plot.gid, plot)
      // Generate a list of overstory species counts
      if (!overstoryMap.has(plot.speciesName)) overstoryMap.set(plot.speciesName, 0)
      const n = overstoryMap.get(plot.speciesName)
      overstoryMap.set(plot.speciesName, n + 1)
    }
  })
  return plotMap
}

export function addPlanar (plotMap, rows) {
  rows.forEach((c, idx) => {
    if (idx) { // skip header record
      const key = c[5] // F: 'ParentGlobalId'
      if (plotMap.has(key)) {
        const plot = plotMap.get(key)
        plot.deadDown.h1.plane = num(c[2]) // C: '1-hr fuels that cross planar intersect'
        plot.deadDown.h10.plane = num(c[3]) // D: '10-hr fuels that cross planar intersect'
        plot.deadDown.h100.plane = num(c[4]) // E: '100-hr fuels that cross planar intersect'
      } else {
        throw Error(`planar_1 row ${idx} ParentGlobalID ${key} not found`)
      }
    }
  })
}

export function addSound (plotMap, rows) {
  let sum = 0
  let n = 0
  rows.forEach((c, idx) => {
    if (idx) { // skip header record
      const key = c[3] // D: 'ParentGlobalId'
      if (plotMap.has(key)) {
        const plot = plotMap.get(key)
        // sound_diameters_2:C 'All fuel diameters >3" round to nearest .25 inch. (i.e. .25, .5 .75)'
        plot.deadDown.h1000.soundDiam.push(num(c[2]))
        sum += num(c[2])
        n++
      } else {
        throw Error(`sound_diameters_2 row ${idx} ParentGlobalID ${key} not found`)
      }
    }
  })
  console.log(`Sound 1000-h avg diam = ${sum / n} (n=${n})`)
}

export function addRotten (plotMap, rows) {
  let sum = 0
  let n = 0
  rows.forEach((c, idx) => {
    if (idx) { // skip header record
      const key = c[3] // D: 'ParentGlobalId'
      if (plotMap.has(key)) {
        const plot = plotMap.get(key)
        // sound_diameters_2:C 'All fuel diameters >3" round to nearest .25 inch. (i.e. .25, .5 .75)'
        plot.deadDown.h1000.rottenDiam.push(num(c[2]))
        sum += num(c[2])
        n++
      } else {
        throw Error(`rotten_diameters_3 row ${idx} ParentGlobalID ${key} not found`)
      }
    }
  })
  console.log(`Rotten 1000-h avg diam = ${sum / n} (n=${n})`)
}

export function addBark (plotMap, rows) {
  rows.forEach((c, idx) => {
    if (idx) { // skip header record
      const key = c[5] // F: 'ParentGlobalId'
      if (plotMap.has(key)) {
        const plot = plotMap.get(key)
        plot.bark.thickness.push(num(c[2])) // Bark_measurements_4:C 'Bark thickness (cm)'
        plot.bark.width.push(num(c[3])) // Bark_measurements_4:D 'bark width (cm)'
        plot.bark.length.push(num(c[4])) // Bark_measurements_4:E 'bark length (cm)'
      } else {
        throw Error(`bark_measurements_4 row ${idx} ParentGlobalID ${key} not found`)
      }
    }
  })
}

export function addTrees (plotMap, rows) {
  rows.forEach((c, idx) => {
    if (idx) { // skip header record
      const key = c[5] // F: 'ParentGlobalId'
      if (plotMap.has(key)) {
        const plot = plotMap.get(key)
        const spp = c[2].toUpperCase() // small_trees_5:C 'Species'
        plot.trees.species.push(spp)
        plot.trees.number.push(num(c[3])) // small_trees_5:D 'Number'
        plot.trees.avgHeight.push(num(c[4])) // small_trees_5:E 'Average Height (ft)'
        // Generate a list of small tree species counts
        if (!treeMap.has(spp)) treeMap.set(spp, 0)
        const n = treeMap.get(spp)
        treeMap.set(spp, n + 1)
      } else {
        throw Error(`small_trees_5 row ${idx} ParentGlobalID ${key} not found`)
      }
    }
  })
}

export function addShrubs1 (plotMap, rows) { return addShrubs(plotMap, rows, 'plot1') }

export function addShrubs2 (plotMap, rows) { return addShrubs(plotMap, rows, 'plot2') }

export function addShrubs (plotMap, rows, prop) {
  rows.forEach((c, idx) => {
    if (idx) { // skip header record
      const key = c[5] // F: 'ParentGlobalId'
      if (plotMap.has(key)) {
        const plot = plotMap.get(key)
        const shrub = plot.shrub[prop].stems
        const spp = c[2].toUpperCase() // Shrub_plot_1_stem_count_6:C 'Shrub Species' (alpha code)
        shrub.species.push(spp)
        shrub.number.push(num(c[3])) // Shrub_plot_1_stem_count_6:D 'Number of Stems' (integer)
        shrub.sizeClass.push(c[4]) // Shrub_plot_1_stem_count_6:E 'Size class' (number range)
        // Generate a list of shrub species counts
        if (!shrubMap.has(spp)) shrubMap.set(spp, 0)
        const n = shrubMap.get(spp)
        shrubMap.set(spp, n + 1)
      } else {
        throw Error(`Shrub_${prop}_stem_count row ${idx} ParentGlobalID ${key} not found`)
      }
    }
  })
}
