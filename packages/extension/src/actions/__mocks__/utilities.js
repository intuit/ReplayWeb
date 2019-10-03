let fail = false
let ret = {}
export function nativeMessage(msg) {
  return fail ? Promise.reject(new Error()) : Promise.resolve(ret[msg.type])
}

export function logMessage() {
  return {
    type: 'LOG_MESSAGE'
  }
}
const __setReturn = (k,v) => {
  ret[k] = v
}
const __setFail = f => {
  fail = f
}
const __reset = () => {
  fail = false
  ret = {}
}
export default {
  __setFail,
  __setReturn,
  __reset
}
