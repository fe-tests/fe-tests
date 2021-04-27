const typescript = require('rollup-plugin-typescript2')
const nodeResolve = require('rollup-plugin-node-resolve')
const build = process.argv[process.argv.length - 1] === 'build'
let outro = ''
module.exports = [{
    input: 'src/index.ts',
    plugins: [
        typescript(),
        nodeResolve(),
    ],
    output: {
        sourcemap: !build,
        outro,
        file: 'bundle.js',
        format: 'iife'
    }
}]