const mapDOM = (element, json) => {
  var treeObject = {}

  // If string convert to document Node
  if (typeof element === 'string') {
    const parser = new DOMParser()
    const docNode = parser.parseFromString(element, 'text/xml')
    element = docNode.firstChild
  }

  // Recursively loop through DOM elements and assign properties to object
  const treeHTML = (element, object) => {
    object.data = {}
    object.data.nn = element.nodeName.toLowerCase()
    object.data.classValue = ''
    object.data.classList = []
    object.data.attrs = {}
    var nodeList = element.childNodes
    if (nodeList != null) {
      if (nodeList.length) {
        object.children = []
        for (var i = 0; i < nodeList.length; i++) {
          if (nodeList[i].nodeType == 3) {
            const nodeValue = nodeList[i].nodeValue.trim()
            if (nodeValue && object.data.nn !== 'script')
              object.text = nodeValue
          } else {
            object.children.push({})
            treeHTML(
              nodeList[i],
              object.children[object.children.length - 1]
            )
          }
        }
      }
    }
    if (element.attributes != null) {
      if (element.attributes.length) {
        for (var i = 0; i < element.attributes.length; i++) {
          const attrName = element.attributes[i].nodeName
          const attrValue = element.attributes[i].nodeValue
          if (attrName === 'class') {
            object.data.classValue = attrValue
            object.data.classList = attrValue
              .split(' ')
              .filter(value => !!value.trim())
          } else if (attrName === 'style') {
            continue
          } else {
            object.data.attrs[attrName] = attrValue
          }
        }
      }
    }

    let sibCount = 0
    let sibIndex = 0
    for (let i = 0; i < element.parentNode.childNodes.length; i++) {
      const sib = element.parentNode.childNodes[i]
      if (sib.nodeName === element.nodeName) {
        if (sib === element) {
          sibIndex = sibCount
          break
        }
        sibCount++
      }
    }
    object.data.sibIndex = sibIndex
  }

  treeHTML(element, treeObject)

  return json ? JSON.stringify(treeObject) : treeObject
}

export const getSelector = () => {
  const initElement = document.getElementsByTagName('body')[0]
  const json = mapDOM(initElement, true)
  const postData = JSON.stringify({
    html: JSON.parse(json)
  })
  return postData
}
