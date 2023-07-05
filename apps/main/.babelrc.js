const presets = ['next/babel'];

const shouldInstrumentCode = 'INSTRUMENT_CODE' in process.env;

const plugins = Object.assign(
  [
    [
      'babel-plugin-import',
      {
        libraryName: '@mui/material',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'core',
    ],
    [
      'babel-plugin-import',
      {
        libraryName: '@mui/icons-material',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'icons',
    ],
  ],
  shouldInstrumentCode ? ['istanbul'] : []
);

module.exports = { presets, plugins };
