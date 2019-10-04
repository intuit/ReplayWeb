
const DragDropAction = require('./DragDropAction')

function call (instance, methodName, args) {
  return instance[methodName].apply(instance, args)
}

const dragMock = {
  dragStart (targetElement, eventProperties, configCallback) {
    return call(new DragDropAction(), 'dragStart', arguments)
  },
  dragEnter (targetElement, eventProperties, configCallback) {
    return call(new DragDropAction(), 'dragEnter', arguments)
  },
  dragOver (targetElement, eventProperties, configCallback) {
    return call(new DragDropAction(), 'dragOver', arguments)
  },
  dragLeave (targetElement, eventProperties, configCallback) {
    return call(new DragDropAction(), 'dragLeave', arguments)
  },
  drop (targetElement, eventProperties, configCallback) {
    return call(new DragDropAction(), 'drop', arguments)
  },
  delay (targetElement, eventProperties, configCallback) {
    return call(new DragDropAction(), 'delay', arguments)
  },

  // Just for unit testing:
  DataTransfer: require('./DataTransfer'),
  DragDropAction: require('./DragDropAction'),
  eventFactory: require('./eventFactory')
}

module.exports = dragMock
