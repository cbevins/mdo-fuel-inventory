/**
 * Converts a MOD Fuel Inventory planar_1 spreadsheet into an array of Javascript objects
 * @param {array} rows  Array of planar_1 spreadsheet rows as returned by readXlsxFile(),
 * where each row is an array of cell values.
 * @returns
 */
export function convertPlanarRows (rows) {
  const data = []
  rows.forEach(c => {
    data.push({
      objectId: c[0], // a
      globalId: c[1], // B
      n1: c[2], // C: 1-hr fuels that cross planar intersect
      n10: c[3], // D: 10-hr fuels that cross planar intersect
      n100: c[4], // E: 100-hr fuels that cross planar intersect
      parentGlobalId: c[5], // F
      creationDate: c[6], // G
      creator: c[7], // H
      editDate: c[8], // I
      editor: c[9] // J
    })
  })
  return data
}
