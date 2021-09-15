/**
 * Driver program that reads the MasterDataSheetFuelInventory.xlsx
 * and converts it into an array of Javascript MOD plot data in modPlotData.js.
 */
import readXlsxFile from 'read-excel-file/node/index.commonjs.js'
import {
  addSurvey, addPlanar, addSound, addRotten, addBark, addTrees, addShrubs1, addShrubs2,
  overstoryMap, shrubMap, treeMap
} from './xlsx2obj.js'
import fs from 'fs'

const inputFile = './MasterDataSheetFuelInventory.xlsx'
const outputJsFile = './mdoPlotData.js'
// const outputJsonFile = './mdoPlotData.json'

async function createPlotMap (fileName) {
  const [survey, planar, sound, rotten, bark, trees, shrubs1, shrubs2] = await Promise.all([
    readXlsxFile(fileName, { sheet: 1 }),
    readXlsxFile(fileName, { sheet: 2 }),
    readXlsxFile(fileName, { sheet: 3 }),
    readXlsxFile(fileName, { sheet: 4 }),
    readXlsxFile(fileName, { sheet: 5 }),
    readXlsxFile(fileName, { sheet: 6 }),
    readXlsxFile(fileName, { sheet: 7 }),
    readXlsxFile(fileName, { sheet: 8 })
  ])
  // The following list the column headers from row 0 of each worksheet
  // console.log('survey', survey[0])
  // console.log('planar', planar[0])
  // console.log('sound', sound[0])
  // console.log('rotten', rotten[0])
  // console.log('bark', bark[0])
  // console.log('trees', trees[0])
  // console.log('shrub1', shrub1[0])
  // console.log('shrub2', shrub2[0])
  const plotMap = addSurvey(survey)
  addPlanar(plotMap, planar)
  addSound(plotMap, sound)
  addRotten(plotMap, rotten)
  addBark(plotMap, bark)
  addTrees(plotMap, trees)
  addShrubs1(plotMap, shrubs1)
  addShrubs2(plotMap, shrubs2)
  return plotMap
}

function displayPlotMap (plotMap) {
  let str = '[\n'
  Array.from(plotMap.values()).forEach(plot => {
    str += JSON.stringify(plot, null, 2)
    str += ',\n'
  })
  str += ']\n'
  // console.log(str)
  // fs.writeFileSync(outputJsonFile, str)
  str = 'export const mdoPlotData = ' + str
  fs.writeFileSync(outputJsFile, str)

  console.log(`There are ${plotMap.size} valid plots`)
  console.log('Overstory Species:', overstoryMap)
  console.log('Shrub Species:', shrubMap)
  console.log('Tree Species:', treeMap)
}

createPlotMap(inputFile)
  .then(displayPlotMap)
