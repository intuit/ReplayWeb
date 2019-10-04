
import log from './log'
import { getLocator, xpath, domText } from '@replayweb/utils'
/*
 * Basic tool function
 */
var extend = function () {
  var args = Array.from(arguments)
  var len = args.length

  if (len <= 0) return {}
  if (len === 1) return args[0]

  var head = args[0]
  var rest = args.slice(1)

  return rest.reduce(function (prev, cur) {
    for (var i = 0, keys = Object.keys(cur), len = keys.length; i < len; i++) {
      prev[keys[i]] = cur[keys[i]]
    }

    return prev
  }, head)
}

var isArray = Array.isArray

var id = function (x) { return x }

var trim = function (str) {
  return str.replace(/^\s*|\s*$/g, '')
}

var flatten = function (list) {
  return [].concat.apply([], list)
}

var sum = function () {
  var list = Array.from(arguments)
  return list.reduce(function (prev, cur) {
    return prev + cur
  }, 0)
}

var last = function (list) {
  return list[list.length - 1]
}

var or = function (list) {
  return (list || []).reduce(function (prev, cur) {
    return prev || cur
  }, false)
}

var and = function (list) {
  return (list || []).reduce(function (prev, cur) {
    return prev && cur
  }, true)
}

var zipWith = function (fn) {
  if (arguments.length < 3) return null

  var list = Array.from(arguments).slice(1)
  var len = list.reduce(function (min, cur) {
    return cur.length < min ? cur.length : min
  }, Infinity)
  var ret = []

  for (var i = 0; i < len; i++) {
    ret.push(fn.apply(null, list.map(function (item) { return item[i] })))
  }

  return ret
}

var intersect = function () {
  var list = Array.from(arguments)
  var len = Math.max.apply(null, list.map(function (item) { return item.length }))
  var result = []

  for (var i = 0; i < len; i++) {
    var val = list[0][i]
    var no = list.filter(function (item) {
      return item[i] !== val
    })

    if (no && no.length) break

    result.push(val)
  }

  return result
}

var deepEqual = function (a, b) {
  if (isArray(a) && isArray(b)) {
    return a.length === b.length && and(zipWith(deepEqual, a, b))
  }

  if (typeof a === 'object' && typeof b === 'object') {
    // TODO
    return false
  }

  return a === b
}

/*
 * Dom helper function
 */

var pixel = function (num) {
  if ((num + '').indexOf('px') !== -1) return num
  return (num || 0) + 'px'
}

var getStyle = function (dom, styleName) {
  if (!dom) throw new Error('getStyle: dom not exist')
  return getComputedStyle(dom)[styleName]
}

var setStyle = function (dom, style) {
  if (!dom) throw new Error('setStyle: dom not exist')

  for (var i = 0, keys = Object.keys(style), len = keys.length; i < len; i++) {
    dom.style[keys[i]] = style[keys[i]]
  }

  return dom
}

var cssSum = function (dom, list) {
  var isInline = getStyle(dom, 'display') === 'inline'

  return list.reduce(function (prev, cur) {
    var val = (isInline && ['width', 'height'].indexOf(cur) !== -1)
      ? dom.getClientRects()[0][cur]
      : getStyle(dom, cur)

    return prev + parseInt(val || '0', 10)
  }, 0)
}

var offset = function (dom, noPx) {
  if (!dom) return { left: 0, top: 0 }

  var rect = dom.getBoundingClientRect()
  var fn = noPx ? id : pixel

  return {
    left: fn(rect.left + window.scrollX),
    top: fn(rect.top + window.scrollY)
  }
}

var rect = function (dom, noPx) {
  var pos = offset(dom, noPx)
  var isInline = getStyle(dom, 'display') === 'inline'
  var w = isInline ? dom.getClientRects()[0].width : getStyle(dom, 'width')
  var h = isInline ? dom.getClientRects()[0].height : getStyle(dom, 'height')
  var fn = noPx ? id : pixel

  return extend({ width: fn(w), height: fn(h) }, pos)
}

// Reference: http://ryanve.com/lab/dimensions/
var clientWidth = function (document) {
  return document.documentElement.clientWidth
}

var clientHeight = function (document) {
  return document.documentElement.clientHeight
}

var removeChildren = function (dom, predicate) {
  var pred = predicate || function () { return true }
  var children = dom.childNodes

  for (var i = children.length - 1; i >= 0; i--) {
    if (pred(children[i])) {
      dom.removeChild(children[i])
    }
  }
}

var inDom = function ($outer, $el) {
  if (!$el) return false
  if ($outer === $el) return true
  return inDom($outer, $el.parentNode)
}

var inDomList = function (list, $el) {
  return or(list.map(function ($outer) {
    return inDom($outer, $el)
  }))
}

var parentWithTag = function (tag, $el) {
  var lowerTag = tag.toLowerCase()
  var $dom = $el

  while ($dom) {
    if ($dom.tagName.toLowerCase() === lowerTag) {
      return $dom
    }

    $dom = $dom.parentNode
  }

  return null
}

var selector = function (dom) {
  if (dom.nodeType !== 1) return ''
  if (dom.tagName === 'BODY') return 'body'
  if (dom.id) return '#' + dom.id

  var classes = dom.className.split(/\s+/g)
    .filter(function (item) {
      return item && item.length
    })

  var children = Array.from(dom.parentNode.childNodes).filter(function ($el) {
    return $el.nodeType === 1
  })

  var sameTag = children.filter(function ($el) {
    return $el.tagName === dom.tagName
  })

  var sameClass = children.filter(function ($el) {
    var cs = $el.className.split(/\s+/g)

    return and(classes.map(function (c) {
      return cs.indexOf(c) !== -1
    }))
  })

  var extra = ''

  if (sameTag.length === 1) {
    extra = ''
  } else if (classes.length && sameClass.length === 1) {
    extra = '.' + classes.join('.')
  } else {
    extra = ':nth-child(' + (1 + children.findIndex(function (item) { return item === dom })) + ')'
  }

  var me = dom.tagName.toLowerCase() + extra

  // Note: browser will add an extra 'tbody' when tr directly in table, which will cause an wrong selector,
  // so the hack is to remove all tbody here
  var ret = selector(dom.parentNode) + ' > ' + me
  return ret.replace(/\s*>\s*tbody\s*>?/g, ' ')
}

var atXPath = function (xpath, document) {
  var lower = function (str) { return str && str.toLowerCase() }
  var reg = /^([a-zA-Z0-9]+)(\[(\d+)\])?$/

  return xpath.reduce(function (prev, cur) {
    if (!prev) return prev
    if (!prev.childNodes || !prev.childNodes.length) return null

    var match = cur.match(reg)
    var tag = match[1]
    var index = match[3] ? parseInt(match[3], 10) : 1
    var list = Array.from(prev.childNodes).filter(function (item) {
      return item.nodeType === 1 && lower(item.tagName) === lower(tag)
    })

    return list[index - 1]
  }, document)
}

var checkIframe = (iframeWin) => {
  var key = new Date() * 1 + '' + Math.random()

  try {
    iframeWin[key] = 'asd'
    return iframeWin[key] === 'asd'
  } catch (e) {
    return false
  }
}

// Note: get the locator for frame
var getFrameLocator = (frameWin, win) => {
  if (checkIframe(frameWin)) {
    const frameDom = frameWin.frameElement
    const locator = getLocator(frameDom)

    if (/^id=/.test(locator) || /^name=/.test(locator)) {
      return locator
    }
  }

  // Find frame by checking against all iframes in the page
  // so we can find by selector instead of index in stack
  // which can change
  const frames = Array.from(win.document.querySelectorAll('iframe'))
  const frame = frames.find(f => frameWin === f.contentWindow)
  if (frame) {
    const locator = getLocator(frame)
    if (/^id=/.test(locator) || /^name=/.test(locator)) {
      return locator
    }
  }

  // fall back to finding based on index in frame stack
  for (let i = 0, len = win.frames.length; i < len; i++) {
    if (win.frames[i] === frameWin) {
      return `index=${i}`
    }
  }

  throw new Error('Frame locator not found')
}

/*
 * Mask related
 */

var maskFactory = function () {
  var cache = []
  var prefix = '__mask__' + (new Date() * 1) + Math.round(Math.random() * 1000) + '__'
  var uid = 1
  var defaultStyle = {
    position: 'absolute',
    zIndex: '999',
    display: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'red',
    opacity: 0.3,
    pointerEvents: 'none'
  }

  var genMask = function (style, dom) {
    var mask = document.createElement('div')

    if (dom) {
      style = extend({}, defaultStyle, style || {}, rect(dom))
    } else {
      style = extend({}, defaultStyle, style || {})
    }

    setStyle(mask, style)
    mask.id = prefix + (uid++)
    cache.push(mask)

    return mask
  }

  var clear = function () {
    for (var i = 0, len = cache.length; i < len; i++) {
      var mask = cache[i]

      if (mask && mask.parentNode) {
        mask.parentNode.removeChild(mask)
      }
    }
  }

  return {
    gen: genMask,
    clear: clear
  }
}

var showMaskOver = function (mask, el) {
  var pos = offset(el)
  var w = cssSum(el, ['width', 'paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'])
  var h = cssSum(el, ['height', 'paddingTop', 'paddingBottom', 'borderTopWidth', ' borderBottomWidth'])

  setStyle(mask, extend(pos, {
    width: pixel(w),
    height: pixel(h),
    display: 'block'
  }))
}

export default {
  setStyle,
  selector,
  xpath,
  atXPath,
  domText,
  getLocator,
  getFrameLocator,
  maskFactory,
  showMaskOver,
  inDom,
  parentWithTag
}
