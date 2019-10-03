/**
 * Created by nhuang on 12/13/17.
 */
const localStorageAdapter = {

  get (key) {
    const data = localStorage.getItem(key)
    const parsed = JSON.parse(data)
    return Promise.resolve({ [key]: parsed })
  },

  set (kvp) {
    Object.keys(kvp).forEach((key) => {
      localStorage.setItem(key, JSON.stringify(kvp[key]))
    })
    return Promise.resolve(true)
  },

  remove (key) {
    localStorage.removeItem(key)
    return Promise.resolve(true)
  },

  clear () {
    localStorage.clear()
    return Promise.resolve(true)
  },

  addListener (fn) { }
}

export default localStorageAdapter
