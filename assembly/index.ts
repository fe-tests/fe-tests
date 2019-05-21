let ANS: Array<u8> = <Array<u8>>[1,4,4,1,12,8,9,8,4,14,4,14,2,2,8,4,4,2,8,8,7,12,4,15,6];
let times: u8 = <u8>0;
export function getResult(value: u8, index: u8): u8 {
  times++;
  if (times > <u8>25) throw new Error('overflow times.')
  return <u8>((value === ANS[index]) ? 1 : 0)
}
