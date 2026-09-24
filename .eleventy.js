module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    'styles.css': 'styles.css',
    'script.js': 'script.js',
    'src/img': 'src/img',
  })

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
  }
}