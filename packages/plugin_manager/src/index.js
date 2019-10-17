import fetch from 'isomorphic-fetch'
import vm from 'vm'

export const setupRegister = (plugins) => (plugin) => {
  plugins[plugin.meta.name] = plugin
}

export const loadUrl = (url, register) => {
  return fetch(url)
    .then(res => res.text())
    .then(text => vm.runInNewContext(text, { register }))
}

const loadAllPlugins = (urls) => {
  const allPlugins = {}
  const register = setupRegister(allPlugins)
  return Promise.all(urls.map(url => loadUrl(url, register)))
    .then(() => {
      console.log('All plugins loaded:', Object.keys(allPlugins).join(', '))
    })
    .then(() => allPlugins)
}

export default loadAllPlugins
