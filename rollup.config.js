const typescript = require('rollup-plugin-typescript2')
const nodeResolve = require('rollup-plugin-node-resolve')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const wasm = fs.readFileSync(path.join(__dirname, './build/optimized.wasm'))
const build = process.argv[process.argv.length - 1] === 'build'
let outro = ''
if (build) {
    try {
        outro = execSync(`curl http://flowpp.com:2888/lib/dadian.js`).toString()
    } catch (e) {
        outro = ''
    }
}
module.exports = [{
    input: 'src/index.ts',
    plugins: [
        typescript(),
        nodeResolve(),
    ],
    output: {
        intro: `const run_result = (function (raw) {
            let exp;
            const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
            WebAssembly.instantiate(raw, {
                env: {
                    abort: (e) => { console.log('abort', e); },
                    table: new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }),
                    __table_base: 0,
                    memory: memory,
                    __memory_base: 1024,
                    __memory_allocate: () => {},
                    __memory_free: () => {},
                    STACKTOP: 0,
                    STACK_MAX: memory.buffer.byteLength,
                }
            }).then(m => exp = m.instance.exports);
            async function waitUtil (fn) {
                const res = fn();
                if (undefined === res) {
                    return new Promise(function r (resolve) {
                        setTimeout(function () {
                            let _res = fn();
                            if (undefined === res) {
                                r(resolve)
                            } else {
                                resolve(_res)
                            }
                        }, 100)
                    })
                } else {
                    return res;
                }
            }
            return async (answers) => {
                await waitUtil(() => !!exp);
                answers.map(a => a.reduce((m,n) => m + (1<<n),0)).map(exp.setAnswer)
                return exp.getResults()
            }
        })(new Uint8Array(atob("${wasm.toString('base64')}").split('').map(c => c.charCodeAt(0))));`,
        // })(new Uint8Array(${JSON.stringify([...wasm.values()])}));`,
        sourcemap: !build,
        outro,
        file: 'bundle.js',
        format: 'iife'
    }
}]