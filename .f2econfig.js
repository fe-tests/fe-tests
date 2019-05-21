const { argv } = process
const build = argv[argv.length - 1] === 'build'
module.exports = {
    livereload: !build,
    build,
    gzip: true,
    useLess: true,
    buildFilter: p => !p || /^(sw|src(\/index)?|index)/.test(p),
    middlewares: [
        { middleware: 'rollup' },
        {
            middleware: 'template',
            test: /\.html?/
        }
    ],
    output: require('path').join(__dirname, './output')
}
