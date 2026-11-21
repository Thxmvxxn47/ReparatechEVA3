module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: ['src/tests/**/*.spec.js'],
    browsers: ['ChromeHeadless'],
    reporters: ['progress'],
    singleRun: true,
  })
}
