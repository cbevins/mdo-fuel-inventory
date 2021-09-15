#  ![](favicon.png) cbevins/mdo-fuel-inventory

A small Node JS project to process fuel inventory data from Montana d Oro State Park, California.

## Installation Requirements

This project requires *NodeJS* Javascript runtime and the *read-excel-file* NPM package.

## Manifest

There are currently 2 main programs.

- *createMdoPlotData.js*:
  - reads the Excel workbook file *MasterDataSheetFuelInventory.xlsx*;
  - reassembles the individual work sheet data into an array of plot-by-plot data objects (see *xlsx2obj.js*); and
  - writes the plot data as a Javascript file *mdoPlotData.js* for use by subsequent processing programs.
- *processLoads.js*:
  - reads the plot-by-plot Javascript data array from *mdoPlotData.js*;
  - imports the fuel parameters and load functions from *mdoFuelProcessor.js*;
  - calculates plot-by-plot fuel loads and writes them in comma-separated value (CSV) format to the console.
- *mdoFuelLoads.csv* contains the output from *processLoads.js*.
- *mdoFuelLoads.xlsx* contains the output after loading it into an excel workbook.

