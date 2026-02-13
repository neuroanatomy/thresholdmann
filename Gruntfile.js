const webpackDevConfig = require('./config/webpack.dev.js');
const webpackProdConfig = require('./config/webpack.prod');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    webpack: {
      prod: webpackProdConfig,
      dev: webpackDevConfig
    },
    "webpack-dev-server": {
      dev: webpackDevConfig
    },
    downloadfile: {
      options: {
        dest: './vendor'
      },
      files: {
        'mriviewer.js': 'https://cdn.jsdelivr.net/gh/r03ert0/mriviewerjs@v0.1.8/mriviewer.js',
        'mui.js': 'https://cdn.jsdelivr.net/gh/r03ert0/muijs/mui.js',
        'mui.css': 'https://cdn.jsdelivr.net/gh/r03ert0/muijs/mui.css'
      }
    },

  });
  grunt.loadNpmTasks('grunt-downloadfile');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.registerTask('serve', ['downloadfile', 'webpack-dev-server:dev'] )
  grunt.registerTask('build', ['downloadfile', 'webpack:prod'] )
};
