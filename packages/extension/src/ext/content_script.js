import csIpc from '../common/ipc/ipc_cs'
import { postMessage, onMessage } from '../common/ipc/cs_postmessage'
import inspector from '../common/inspector'
import * as C from '../common/constant'
import { updateIn, until } from '../common/utils'
import { run, getElementByLocator } from '../common/command_runner'
import log from '../common/log'
import { getSelector } from './cssSelector'
import storage from '../common/storage'

console.log('>> CONTENT_SCRIPT TOP LEVEL INIT')
// TODO cannot use: does not persist
// console.log('>>', typeof window.foobar)
// if (window.foobar === undefined) {
//   console.log('>> window.foobar is not set, setting it to 123')
//   window.foobar = 123
// } else {
//   console.log(`>> window.foobar = ${window.foobar}`)
// }

// TODO cannot use: does not persist
// console.log('>> sessionStorage item is', window.sessionStorage.getItem('foobar'))
// if (!window.sessionStorage.getItem('foobar')) {
//   console.log('>> setting sessionStorage item')
//   window.sessionStorage.setItem('foobar', 123)
// } else {
//   console.log('>> sessionStorage item is already set')
// }

// NOTE: this works (I think) but is sandboxed from other parts of the extension
console.log('>> localstorage item is', window.localStorage.getItem('foobar'))
if (!window.localStorage.getItem('foobar')) {
  console.log('>> setting localstorage item')
  window.localStorage.setItem('foobar', 123)
} else {
  console.log('>> localstorage item is already set')
}

// TODO this doesn't work because it blocks and doesn't (?) return
// console.log('>> 1')
// global.chrome.storage.local.setItem('foobar', 123)
// console.log('>> 2')
// console.log('>> HERE', global.chrome.storage.local.getItem('foobar'))
// console.log('>> 3')

const MASK_CLICK_FADE_TIMEOUT = 2000
const oops =
  process.env.NODE_ENV === 'production' ? () => {} : e => log.error(e.stack)

const state = {
  status: C.CONTENT_SCRIPT_STATUS.NORMAL,
  // Note: it decides whether we're running commands
  // in the current window or some iframe/frame
  playingFrame: window,
  // Note: current frame stack when recording, it helps
  // to generate `selectFrame` commands
  recordingFrameStack: []
}

// Note: Whether it's top or inner window, a content script has the need
// to send IPC message to background. But in our design, only the top window
// has access to the real csIpc, while inner frames have to bubble up the messages
// to the top window.
// So inner windows are provided with a fake csIpc, which post messages to its parent
const superCsIpc =
  window.top === window
    ? csIpc
    : {
        ask: (ipcAction, ipcData) => {
          return postMessage(window.parent, window, {
            action: 'IPC_CALL',
            data: { ipcAction, ipcData }
          })
        }
      }

const calcSelectFrameCmds = frameStack => {
  const xs = state.recordingFrameStack
  const ys = frameStack
  const len = Math.min(xs.length, ys.length)
  const tpl = {
    command: 'selectFrame',
    parameters: {
      url: window.location.href
    }
  }
  const ret = []
  let i

  for (i = 0; i < len; i++) {
    if (xs[i] !== ys[i]) {
      break
    }
  }

  if (i === 0) {
    // No need for relative=top, if state.recordingFrameStack is empty
    if (xs.length !== 0) {
      ret.push({
        ...tpl,
        parameters: { ...tpl.parameters, target: 'relative=top' }
      })
    }
  } else if (i < len) {
    for (let j = i; j < xs.length; j++) {
      ret.push({
        ...tpl,
        parameters: { ...tpl.parameters, target: 'relative=parent' }
      })
    }
  }

  for (let j = i; j < ys.length; j++) {
    ret.push({ ...tpl, parameters: { ...tpl.parameters, target: ys[j] } })
  }

  return ret
}

// Two masks to show on page
// 1. mask on click
// 2. mask on hover
const getMask = (function() {
  let mask, factory

  return remove => {
    if (remove && factory) return factory.clear()
    if (mask) return mask

    factory = inspector.maskFactory()

    const maskClick = factory.gen({ background: 'green' })
    const maskHover = factory.gen({ background: '#ffa800' })

    mask = { maskClick, maskHover }

    document.body.appendChild(maskClick)
    document.body.appendChild(maskHover)

    return mask
  }
})()

const addWaitInCommand = cmdObj => {
  const { command } = cmdObj

  switch (command) {
    case 'click':
      return { ...cmdObj, command: 'clickAndWait' }

    case 'select':
      return { ...cmdObj, command: 'selectAndWait' }

    default:
      return cmdObj
  }
}

// report recorded commands to background.
// transform `leave` event to clickAndWait / selectAndWait event based on the last command
const reportCommand = (function() {
  const LEAVE_INTERVAL = 500
  let last = null
  let lastTime = null
  let timer = null

  return obj => {
    obj = { ...obj, url: window.location.href }

    log('to report', obj)

    // Change back to top frame if it was recording inside
    if (state.recordingFrameStack.length > 0) {
      state.recordingFrameStack = []

      superCsIpc
        .ask('CS_RECORD_ADD_COMMAND', {
          command: 'selectFrame',
          parameters: {
            target: 'relative=top',
            url: window.location.href
          }
        })
        .catch(oops)
    }

    switch (obj.command) {
      case 'leave': {
        if (timer) {
          clearTimeout(timer)
        }

        if (new Date() - lastTime < LEAVE_INTERVAL) {
          obj = addWaitInCommand(last)
        } else {
          return
        }

        break
      }
      case 'click': {
        // if the time between the last 2 clicks is less than 50ms
        // ignore it because it is probably a double event firing (fuego)
        if (last && last.time && obj.time && obj.time - last.time < 50) {
          return
        }
        break
      }
      case 'select': {
        // we need to add code here to remove the duplication issue....
        timer = setTimeout(() => {
          superCsIpc.ask('CS_RECORD_ADD_COMMAND', obj).catch(oops)
        }, LEAVE_INTERVAL)

        last = obj
        lastTime = new Date()
        return
      }

      default:
        break
    }

    last = obj
    lastTime = new Date()

    superCsIpc.ask('CS_RECORD_ADD_COMMAND', obj).catch(oops)
  }
})()

const isValidClick = el => {
  // Note: all elements are allowed to be recorded when clicked
  return true

  // if (el === document.body) return false
  //
  // const tag   = el.tagName.toLowerCase()
  // const type  = el.getAttribute('type')
  // const role  = el.getAttribute('role')
  //
  // if (tag === 'a' || tag === 'button')  return true
  // if (tag === 'input' && ['radio', 'checkbox'].indexOf(type) !== -1)  return true
  // if (['link', 'button', 'checkbox', 'radio'].indexOf(role) !== -1)   return true
  //
  // return isValidClick(el.parentNode)
}

const isValidSelect = el => {
  const tag = el.tagName.toLowerCase()

  if (['option', 'select'].indexOf(tag) !== -1) return true
  return false
}

const isValidType = el => {
  const tag = el.tagName.toLowerCase()
  const type = el.getAttribute('type')

  if (tag === 'textarea') return true
  if (tag === 'input' && ['radio', 'checkbox'].indexOf(type) === -1) return true

  return false
}

const highlightDom = ($dom, timeout) => {
  const mask = getMask()

  inspector.showMaskOver(mask.maskClick, $dom)

  setTimeout(() => {
    inspector.setStyle(mask.maskClick, { display: 'none' })
  }, timeout || MASK_CLICK_FADE_TIMEOUT)
}

const onClick = async e => {
  if (!isValidClick(e.target)) return

  const selector = await getDtmSelector(e)
  reportCommand({
    command: 'click',
    time: Date.now(),
    parameters: {
      ...selector
    }
  })
}

const onChange = async e => {
  if (isValidSelect(e.target)) {
    const selector = await getDtmSelector(e)
    const value = e.target.value
    const $option = Array.from(e.target.children).find(
      $op => $op.value === value
    )

    reportCommand({
      command: 'select',
      parameters: {
        value: 'label=' + inspector.domText($option),
        ...selector
      }
    })
  } else if (isValidType(e.target)) {
    const selector = await getDtmSelector(e)
    reportCommand({
      command: 'type',
      parameters: {
        value: (e.target.value || '').replace(/\n/g, '\\n'),
        ...selector
      }
    })
  }
}

const getDtmSelector = async e => {
  const config = await storage.get('config')
  const ignorePatterns = config.ignorePatterns || []
  if (!config.useDtmSelector) {
    return inspector.getLocator(e.target, true, ignorePatterns)
  }

  e.target.setAttribute('data-get-css-for-this', 'myElem')
  const postData = getSelector()
  const dtmResponse = await csIpc.ask('PANEL_GET_SELECTOR', { body: postData })
  if (dtmResponse.state === 'fail') {
    console.log(
      `error while fetching dtm selector--falling back to default getLocator function: ${JSON.stringify(
        dtmResponse
      )}`
    )
    return { target: inspector.getLocator(e.target, false, ignorePatterns) }
  }
  e.target.removeAttribute('data-get-css-for-this')
  if (
    dtmResponse.selectors &&
    dtmResponse.selectors.myElem &&
    dtmResponse.selectors_list &&
    dtmResponse.selectors_list.length > 0
  ) {
    console.log('returning dtm css selector...')
    return {
      target: `css=${dtmResponse.selectors.myElem}`,
      targetOptions: dtmResponse.selectors_list.map(t => 'css=' + t)
    }
  } else {
    console.log('returning replay selector...')
    return { target: inspector.getLocator(e.target, false, ignorePatterns) }
  }
}

const onDragDrop = (function() {
  let dragStart = null

  return e => {
    switch (e.type) {
      case 'dragstart': {
        dragStart = inspector.getLocator(e.target, true)
        break
      }
      case 'drop': {
        if (!dragStart) return
        const tmp = inspector.getLocator(e.target, true)

        reportCommand({
          command: 'dragAndDropToObject',
          parameters: {
            startTarget: dragStart,
            endTarget: tmp.target
          }
        })

        dragStart = null
      }
    }
  }
})()

const onLeave = e => {
  reportCommand({
    command: 'leave'
  })

  setTimeout(() => {
    reportCommand({
      command: 'pullback'
    })
  }, 800)
}

const bindEventsToRecord = () => {
  document.addEventListener('click', onClick, true)
  document.addEventListener('change', onChange, true)
  document.addEventListener('dragstart', onDragDrop, true)
  document.addEventListener('drop', onDragDrop, true)
  window.addEventListener('beforeunload', onLeave, true)
}

const unbindEventsToRecord = () => {
  document.removeEventListener('click', onClick, true)
  document.removeEventListener('change', onChange, true)
  document.removeEventListener('dragstart', onDragDrop, true)
  document.removeEventListener('drop', onDragDrop, true)
  window.removeEventListener('beforeunload', onLeave, true)
}

const waitForDomReady = accurate => {
  return until(
    'dom ready',
    () => {
      return {
        pass:
          ['complete', 'interactive']
            .slice(0, accurate ? 1 : 2)
            .indexOf(document.readyState) !== -1,
        result: true
      }
    },
    1000,
    6000 * 10
  )
}

const updateStatus = args => {
  if (!args.status) {
    throw new Error('SET_STATUS: missing args.status')
  }
  if (!C.CONTENT_SCRIPT_STATUS[args.status]) {
    throw new Error('SET_STATUS: invalid args.status - ' + args.status)
  }

  Object.assign(state, {
    status: args.status
  })

  if (
    args.status === C.CONTENT_SCRIPT_STATUS.NORMAL ||
    args.status === C.CONTENT_SCRIPT_STATUS.RECORDING
  ) {
    bindEventsToRecord()
  } else {
    unbindEventsToRecord()
  }

  // replace alert/confirm/prompt with our version when playing
  // if (args.status === C.CONTENT_SCRIPT_STATUS.PLAYING) {
  //   hackAlertConfirmPrompt()
  // } else {
  //   restoreAlertConfirmPrompt()
  // }

  // IMPORTANT: broadcast status change to all frames inside
  const frames = window.frames

  for (let i = 0, len = frames.length; i < len; i++) {
    postMessage(frames[i], window, {
      action: 'SET_STATUS',
      data: args
    })
  }
}

const bindIPCListener = () => {
  // Note: need to check csIpc in case it's a none-src iframe into which we
  // inject content_script.js. It has no access to chrome api, thus no csIpc available
  if (!csIpc) return

  // Note: csIpc instead of superIpc, because only top window is able
  // to listen to ipc events from bg
  csIpc.onAsk((cmd, args) => {
    log(cmd, args)

    switch (cmd) {
      case 'HEART_BEAT':
        return true

      case 'SET_STATUS': {
        updateStatus(args)
        return true
      }

      case 'DOM_READY':
        return waitForDomReady(true)

      case 'RUN_COMMAND':
        // TODO matt content_script.js listener run_command
        // TODO matt note that this shows up in the console for the tab that's opened
        //    by the extension when running the test
        console.log('>> content_script.js listener run_command')
        return runCommand(args.command)
          .catch(e => {
            log.error(e.stack)
            throw e
          })
          .then(data => {
            if (state.playingFrame !== window) {
              return { data, isIFrame: true }
            }

            return { data }
          })

      case 'FIND_DOM': {
        try {
          getElementByLocator(args.locator)
          return true
        } catch (e) {
          return false
        }
      }

      case 'HIGHLIGHT_DOM': {
        const $el = getElementByLocator(args.locator)
        highlightDom($el)
        return true
      }

      // case 'HACK_ALERT': {
      //   hackAlertConfirmPrompt()
      //   return true
      // }

      default:
        throw new Error('cmd not supported: ' + cmd)
    }
  })
}

const bindEventsToInspect = () => {
  // Bind click events for inspecting
  document.addEventListener('click', e => {
    switch (state.status) {
      case C.CONTENT_SCRIPT_STATUS.INSPECTING: {
        e.preventDefault()

        const mask = getMask()

        inspector.setStyle(mask.maskHover, { display: 'none' })
        inspector.showMaskOver(mask.maskClick, e.target)

        setTimeout(() => {
          inspector.setStyle(mask.maskClick, { display: 'none' })
        }, MASK_CLICK_FADE_TIMEOUT)

        Object.assign(state, {
          status: C.CONTENT_SCRIPT_STATUS.NORMAL
        })
        return superCsIpc
          .ask('CS_DONE_INSPECTING', {
            xpath: inspector.getLocator(e.target)
          })
          .catch(oops)
      }

      default:
        break
    }
  })

  // bind mouse over event for applying for a inspector role
  document.addEventListener('mouseover', e => {
    if (state.status === C.CONTENT_SCRIPT_STATUS.NORMAL) {
      return superCsIpc.ask('CS_ACTIVATE_ME', {}).catch(oops)
    }
  })

  // bind mouse move event to show hover mask in inspecting
  document.addEventListener('mousemove', e => {
    if (state.status !== C.CONTENT_SCRIPT_STATUS.INSPECTING) return

    const mask = getMask()
    inspector.showMaskOver(mask.maskHover, e.target)
  })
}

const bindOnMessage = () => {
  onMessage(window, ({ action, data }, { source }) => {
    switch (action) {
      case 'SET_STATUS':
        updateStatus(data)
        return true

      // inner frames may receive this message when there are
      // some previous `selectFrame` command
      case 'RUN_COMMAND':
        // runCommand will decide whether to run in this window or pass on
        return runCommand(data)

      // inner frames send IPC_CALL to background,
      // It will go step by step up to the topmost frame, which has
      // the access to csIpc
      case 'IPC_CALL':
        // When recording, need to calculate `selectFrame` by ourselves
        // * for inner frames, add current frame locator to frame stack
        // * for top frame, send `selectFrame` commands before the original command
        //   and keep track of the latest frame stack
        if (data.ipcAction === 'CS_RECORD_ADD_COMMAND') {
          // Note: Do not send any RECORD_ADD_COMMAND in playing mode
          if (state.status === C.CONTENT_SCRIPT_STATUS.PLAYING) {
            return false
          }

          data = updateIn(
            ['ipcData', 'frameStack'],
            (stack = []) => [
              inspector.getFrameLocator(source, window),
              ...stack
            ],
            data
          )
          if (window.top === window) {
            calcSelectFrameCmds(data.ipcData.frameStack).forEach(cmd => {
              csIpc.ask('CS_RECORD_ADD_COMMAND', cmd).catch(oops)
            })

            state.recordingFrameStack = data.ipcData.frameStack
          }
        }

        if (window.top === window) {
          return csIpc.ask(data.ipcAction, data.ipcData).catch(oops)
        } else {
          return postMessage(window.parent, window, { action, data })
        }

      case 'RESET_PLAYING_FRAME':
        state.playingFrame = window

        // pass on RESET_PLAYING_FRAME to parent, all the way till top window
        if (data === 'TOP' && window.top !== window) {
          postMessage(window.parent, window, {
            action: 'RESET_PLAYING_FRAME',
            data: 'TOP'
          })
        }

        return true
    }
  })
}

const hackAlertConfirmPrompt = (doc = document) => {
  const script = `
    if (!window.oldAlert)     window.oldAlert   = window.alert
    if (!window.oldConfirm)   window.oldConfirm = window.confirm
    if (!window.oldPrompt)    window.oldPrompt  = window.prompt

    window.alert = function (str) {
      document.body.setAttribute('data-alert', str)
    }

    window.confirm = function (str) {
      document.body.setAttribute('data-confirm', str)
      return true
    }

    window.prompt = function (str) {
      var answer = document.body.getAttribute('data-prompt-answer')
      document.body.setAttribute('data-prompt', str)
      document.body.setAttribute('data-prompt-answer', '')
      return answer
    }
  `
  const s = doc.constructor.prototype.createElement.call(doc, 'script')

  s.setAttribute('type', 'text/javascript')
  s.text = script

  doc.documentElement.appendChild(s)
  s.parentNode.removeChild(s)
}

// const restoreAlertConfirmPrompt = () => {
//   const script = `
//     if (window.oldAlert)    window.alert = window.oldAlert
//     if (window.oldConfirm)  window.confirm = window.oldConfirm
//     if (window.oldPrompt)   window.prompt = window.oldPrompt
//   `
//   const s = document.constructor.prototype.createElement.call(
//     document,
//     'script'
//   )

//   s.setAttribute('type', 'text/javascript')
//   s.text = script

//   document.documentElement.appendChild(s)
//   s.parentNode.removeChild(s)
// }

const init = () => {
  // ** comment these two lines out for test **
  bindEventsToRecord()
  bindEventsToInspect()
  bindOnMessage()

  // Note: only bind ipc events if it's the top window
  if (window.top === window) {
    bindIPCListener()
  }
}

const runCommand = command => {
  if (!command.command) {
    throw new Error('runCommand: must provide command')
  }

  // if it's an 'open' command, it must be executed in the top window
  if (state.playingFrame === window || command.command === 'open') {
    // Note: both top and inner frames could run commands here
    // So must use superCsIpc instead of csIpc
    // TODO matt this is where the command is actually ran
    console.log('>> actually running the command')
    const ret = run(command, superCsIpc, {
      highlightDom,
      hackAlertConfirmPrompt
    })

    // Note: `run` returns the contentWindow of the selected frame
    if (command.command === 'selectFrame') {
      return ret.then(({ frame }) => {
        // let outside window know that playingFrame has been changed, if it's parent or top
        if (
          frame !== window &&
          (frame === window.top || frame === window.parent)
        ) {
          postMessage(window.parent, window, {
            action: 'RESET_PLAYING_FRAME',
            data: frame === window.top ? 'TOP' : 'PARENT'
          })

          // set playingFrame to own window, get ready for later commands if any
          state.playingFrame = window
        } else {
          state.playingFrame = frame
        }

        return Promise.resolve({
          pageUrl: window.location.href,
          extra: command.extra
        })
      })
    }

    // Extra info passed on to background, it contains timeout info
    const wrapResult = ret => {
      return {
        ...(typeof ret === 'object' ? ret : {}),
        pageUrl: window.location.href,
        extra: command.extra
      }
    }

    return Promise.resolve(ret).then(wrapResult)
  } else {
    // log('passing command to frame...', state.playingFrame, '...', window.location.href)
    // Note: pass on the command if our window is not the current playing one
    console.log('>> passing run command to other')
    return postMessage(state.playingFrame, window, {
      action: 'RUN_COMMAND',
      data: command
    })
  }
}

init()
