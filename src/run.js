import readXlsxFile from 'read-excel-file/node/index.commonjs.js'
import { addSurvey, addPlanar, addSound, addRotten, addBark, addTrees, addShrubs1, addShrubs2 } from './xlsx2obj.js'

const modXlsxFileName = '../data/MasterDataSheetFuelInventory.xlsx'

async function createPlotMap (fileName) {
  const [survey, planar, sound, rotten, bark, trees, shrubs1, shrubs2] = await Promise.all([
    readXlsxFile(fileName, { sheet: 1 }),
    readXlsxFile(fileName, { sheet: 2 }),
    readXlsxFile(fileName, { sheet: 3 }),
    readXlsxFile(fileName, { sheet: 4 }),
    readXlsxFile(fileName, { sheet: 5 }),
    readXlsxFile(fileName, { sheet: 6 }),
    readXlsxFile(fileName, { sheet: 7 }),
    readXlsxFile(fileName, { sheet: 7 })
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
  addShrubs1(plotMap, shrubs2)
  return plotMap
}

function displayPlotMap (plotMap) {
  Array.from(plotMap.values()).forEach(plot => {
    console.log(plot)
  })
}

createPlotMap(modXlsxFileName).then(displayPlotMap)
