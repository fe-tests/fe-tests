function fib (n: i32): i32 {
  if (n < 2) {
    return 1
  }
  return fib(n - 2) + fib(n - 1)
}
fib(40)
// for waste time

let ANS: Array<u8> = <Array<u8>>[1,4,4,1,12,8,9,8,4,14,4,14,2,2,8,4,4,2,8,8,7,12,4,15,6];
let times = 0;
const N = 25;
export function setAnswer(value: u8, index: u32): void {
  times++;
  if (times > N) throw new Error('overflow times.')
  store<u8>(index + N << 2, value)
}

export function getResults (): u32 {
  let result: u32 = <u32>0
  for (let i = 0; i < N; i++) {
    if (load<u8>(i + N << 2) === ANS[i]) {
      result = <u32>(result + (1 << i))
    }
  }
  return result
}