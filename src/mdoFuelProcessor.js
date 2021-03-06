/**
 * Functions to calculate fuel loads from MOD fuel plot data
 * NOTE: Many of the required parameter values are not yet available
 */

// DUMMY Shrub weights (gm) by stem basal diameter class
// \TODO Get actual values
export const shrubWts = {
  // These are all the shrub species codes recorded in the MOD fuel inventory
  // 0=0-0.5, 1=05.01, 2=1-1.5, 3=1.5-2, 4=2-3, 5=3-5, 6=5-6 cm
  TODI: [1, 2, 3, 4, 5, 6, 7], // 51 occurrences
  UNKNOWN: [1, 2, 3, 4, 5, 6, 7], // 1,
  ARCA: [1, 2, 3, 4, 5, 6, 7], // 1,
  ERPA: [1, 2, 3, 4, 5, 6, 7], // 4,
  SASP: [1, 2, 3, 4, 5, 6, 7], // 1,
  CERI: [1, 2, 3, 4, 5, 6, 7], // 3,
  BAPI: [1, 2, 3, 4, 5, 6, 7], // 3,
  RUUR: [1, 2, 3, 4, 5, 6, 7], // 15,
  'OAK,DIAU': [1, 2, 3, 4, 5, 6, 7], // 1,
  DIAU: [1, 2, 3, 4, 5, 6, 7], // 3,
  HASQ: [1, 2, 3, 4, 5, 6, 7], // 2,
  FRCA: [1, 2, 3, 4, 5, 6, 7], // 2,
  'TODI;RUUR': [1, 2, 3, 4, 5, 6, 7], // 1

  // Here are some representative values from Brown, Oberheu, and Johnston (1982) table 3
  // Low shrubs
  'Blue Huckleberry': [1.0, 12.0, 59.8, 173.0, 531.0, 0, 0],
  'White spirea': [2.2, 17.4, 65.7, 158.0, 399, 0, 0],
  'Combined low': [2.0, 16.4, 64.1, 157.0, 407, 0, 0],
  // Medium shrubs
  'Smooth menziesia': [1.2, 8.7, 43.6, 126, 387, 240, 0],
  'Common Juniper': [7.9, 31.4, 96.8, 203.0, 445, 1010, 0],
  'Combined medium': [2.6, 15.8, 67.8, 177.0, 490, 1410, 0],
  // High shrubs
  Willow: [2.8, 12.3, 50.4, 128.0, 342, 950, 2320],
  'Combined high': [3.6, 15.4, 60.9, 151.0, 394, 1070, 2560]
}

// Small tree weights (pounds) by 1-ft height increments
export const treeWts = {
  // NOTE: OAK is the only small tree recorded on 2 plots in the MOD fuel inventory
  OAK: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 2
  // Here are all the values from Brown, Oberheu, and Johnston (1982) table 4
  DF: [0.03, 0.20, 0.56, 1.18, 2.09, 3.33, 4.94, 6.95, 9.39],
  PP: [0.03, 0.20, 0.56, 1.18, 2.09, 3.33, 4.94, 6.95, 9.39],
  S: [0.03, 0.20, 0.56, 1.18, 2.09, 3.33, 4.94, 6.95, 9.39],
  AF: [0.03, 0.20, 0.56, 1.18, 2.09, 3.33, 4.94, 6.95, 9.39],

  WP: [0.06, 0.25, 0.61, 1.15, 1.87, 2.78, 3.88, 5.19, 6.71, 8.43],
  GF: [0.06, 0.25, 0.61, 1.15, 1.87, 2.78, 3.88, 5.19, 6.71, 8.43],
  WL: [0.06, 0.25, 0.61, 1.15, 1.87, 2.78, 3.88, 5.19, 6.71, 8.43],

  C: [0.02, 0.13, 0.34, 0.69, 1.17, 1.82, 2.62, 3.65, 4.84, 6.24],
  L: [0.02, 0.13, 0.34, 0.69, 1.17, 1.82, 2.62, 3.65, 4.84, 6.24],
  LP: [0.02, 0.13, 0.34, 0.69, 1.17, 1.82, 2.62, 3.65, 4.84, 6.24],

  WH: [0.01, 0.05, 0.16, 0.35, 0.64, 1.05, 1.60, 2.31, 3.18, 4.24]
}

// Calculates transect slope correction factor
// per Brown, Oberheu, and Johnston (1982) equation (6)
export function slopeFactor (slopePercent) {
  const s = 0.01 * slopePercent
  return Math.sqrt(1 + s * s)
}

/**
 * Calculates the lbs/acre for 1-h, 10-h, or 100-h dead and down fuels
 * for mixed coniferous forests of the intermountain west
 * per Brown, Oberheu, and Johnston (1982) equations (1), (2), and (3),
 * and may not be representative of coastal eucalyptus species.
 * @param {number} intersections Total number of fuel particle intersections
 * @param {number} planarLength Total sample plane length for the above intersection count (ft)
 * @param {number} planarSlope Slope of the transect plane (%)
 * @returns {number} Pounds per acre
 */

// t/ac = 11.64 * diamSq * specGrav * nonHorzCorrection * intersections / length
// t/ac = 11.64 * 0.0151 * 0.48 * 1.13 * intersections / length
// t/ac = 0.095334 * intersections / length
// lb/ac = 190.6688 * intersections / length
export function load1h (intersections, planarLength, planarSlope) {
  return 190.7 * intersections * slopeFactor(planarSlope) / planarLength
}

// t/ac = 11.64 * diamSq * specGrav * nonHorzCorrection * intersections / length
// t/ac = 11.64 * 0.289 * 0.48 * 1.13 * intersections / length
// t/ac = 1.824612 * intersections / length
// lb/ac = 3649.22 * intersections / length
export function load10h (intersections, planarLength, planarSlope) {
  return 3650 * intersections * slopeFactor(planarSlope) / planarLength
}

// t/ac = 11.64 * diamSq * specGrav * nonHorzCorrection * intersections / length
// t/ac = 11.64 * 2.76 * 0.40 * 1.13 * intersections / length
// t/ac = 14.5211328 * intersections / length
// lb/ac = 29042.25 * intersections / length
export function load100h (intersections, planarLength, planarSlope) {
  return 29040 * intersections * slopeFactor(planarSlope) / planarLength
}

/**
 * Calculates the lbs/acre for 1000-h rotten and sound dead and down fuels
 * for mixed coniferous forests of the intermountain west
 * per Brown, Oberheu, and Johnston (1982) equations (4) and (5),
 * and may not be representative of coastal eucalyptus species.
 * @param {number} sumDiam2 Sum of squared diameters of all 1000-h fuel particle intersections (in2)
 * @param {number} planarLength Total sample plane length for the above intersection count (ft)
 * @param {number} planarSlope Slope of the transect plane (%)
 * @returns {number} Pounds per acre
 */

export function loadRotten (sumDiam2, planarLength, planarSlope) {
  return 6984 * sumDiam2 * slopeFactor(planarSlope) / planarLength
}

export function loadSound (sumDiam2, planarLength, planarSlope) {
  return 9312 * sumDiam2 * slopeFactor(planarSlope) / planarLength
}
