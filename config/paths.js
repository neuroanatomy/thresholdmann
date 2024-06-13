const path = require('path')

module.exports = {
  // Source files
  src: path.resolve(__dirname, '../'),

  // Production build files
  build: path.resolve(__dirname, '../dist'),

  // Static files that get copied to build folder
  img: path.resolve(__dirname, '../img'),
}
