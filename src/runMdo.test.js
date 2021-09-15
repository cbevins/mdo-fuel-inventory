/* eslint-disable no-undef */
import 'regenerator-runtime/runtime'
import { load1h, load10h, load100h } from './mdoFuelProcessor.js'

// processData(mdoXlsxFileName)
test('import test', () => {
  expect(load1h(1, 1, 0)).toEqual(190.7)
  expect(load10h(1, 1, 0)).toEqual(3650)
  expect(load100h(1, 1, 0)).toEqual(29040)
})
