const typescript = require('rollup-plugin-typescript2')
const nodeResolve = require('rollup-plugin-node-resolve')
const fs = require('fs')
const path = require('path')
const wasm = fs.readFileSync(path.join(__dirname, './build/optimized.wasm'))
const build = process.argv[process.argv.length - 1] === 'build'
module.exports = [{
    input: 'src/index.ts',
    plugins: [
        typescript(),
        nodeResolve(),
    ],
    output: {
        intro: `const run_result = (function (raw) {
            const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
            return async (answers) => {
                const m = await WebAssembly.instantiate(raw, {
                    env: {
                        abort: () => { throw new Error('overflow'); },
                        table: new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }),
                        __table_base: 0,
                        memory: memory,
                        __memory_base: 1024,
                        __memory_allocate: () => {},
                        __memory_free: () => {},
                        STACKTOP: 0,
                        STACK_MAX: memory.buffer.byteLength,
                    }
                })
                const rm = answers.map(a => a.reduce((m,n) => m + (1<<n),0))
                return rm.map(m.instance.exports.getResult).map(r => !!r)
            }
        })(new Uint8Array(${JSON.stringify([...wasm.values()])}));`,
        sourcemap: !build,
        file: 'bundle.js',
        format: 'iife'
    }
}]