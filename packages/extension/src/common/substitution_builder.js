import { expandBlocks, doReplace, getAllMatches } from '@replayweb/utils'

// Pull all values from commands
export const getValuesFromCommands = (commands) => {
  // Converted from loop to map
  // Not a simple commands.map because commands is an object
  if (!commands) return []
  return Object.keys(commands).map((key) => commands[key].command === 'type' ? commands[key].parameters.value : null)
}

// Pulls all values of form {thing} from string
export const pullValuesToBeReplaced = (values) => {
  if (!values) return []
  return values.map((value) => value ? [value, getAllMatches(/\{([\w|\.]*?)\}/g, value)] : null)
}
// Formatts list of subs returned from pullValuesToBeReplaced
const getFormattedValues = (subs) => {
  return subs.map(subAr => subAr ? subAr[1] : null)
}
// Builds up context one [command] at a time, recursivly traverses blocks
export const buildContext = (blocks, context, command) => {
  if (!command) {

  } else if (command.command === 'setContext') {
    context[command.parameters.key] = command.parameters.value
  } else if (command.command === 'runBlock') {
    if (!blocks || blocks.length === 0) return
    const expanded = expandBlocks([command], blocks)
    expanded.map((command) => {
      buildContext(blocks, context, command)
    })
  }
}
// Remove duplicate keys from the same value
export const removeDupeReplacements = (ar) => {
  if (!ar) return []
  return ar.map((subAr) => {
    const keys = []
    if (!subAr) return
    return subAr.map((sub) => {
      if (!sub || keys.indexOf(sub[0]) >= 0) return
      keys.push(sub[0])
      return sub
    }).filter((el) => { return Boolean(el) })
  })
}

// Checks if two states are equivalent (So we don't rerender if nothing has changed)
export function isEquivState (n, o) {
  // Not using deep-equal here because we need a special case for ssn, random, and millis
  // Those return a new value each time they are called, and we don't want to rerender in those cases
  // {random} -> 345 is functionally equal to {random} -> 999
  // {toy} -> Ball is not functionally equal to {toy} -> Block , because that means toy was redefined and we should rerender

  if (Boolean(n) != Boolean(o)) return false
  if (!n && !o) return true
  // They both are defined
  if (n.length != o.length) return false
  // Both equal size
  let isEquiv = true
  for (var index in n) {
    if (n[index] instanceof Array && o[index] instanceof Array) {
      isEquiv = isEquivState(n[index], o[index]) && isEquiv
      continue
    }
    if (n[index] == o[index]) continue
    if (n[0] == '{ssn}' || n[0] == '{random}' || n[0] == '{millis}') continue

    isEquiv = false
    break
  }
  return isEquiv
}

//
/**
   * Updates the substitutions being used, including substitutions defined by setContext
   * @param {Array} commands the array of commands to build replacements for
   * @param {Array} blocks the blocks that may be accessed through runBlock
   */
export const updateSubstitutions = async (commands, blocks) => {
  if (!commands || !blocks) return undefined
  const rawValuesFromCommands = getValuesFromCommands(commands)
  const arOfSubs = pullValuesToBeReplaced(rawValuesFromCommands)
  const toBeReplaced = getFormattedValues(arOfSubs)

  const context = {}
  return (await Promise.all(toBeReplaced.map(function (singleRowOfSubs, index) {
    try {
      buildContext(blocks, context, commands[index])
    } catch (e) {
      if (e.message.indexOf('does not exist') === -1) { throw new Error('Error occured when building context for substitutions. Error: ', e) }
    }
    if (!singleRowOfSubs) { return null }
    return Promise.all(singleRowOfSubs.map(function (singleSub) {
      return doReplace(singleSub[0], context)
    }))
  })).then(function (replacements) {
    const formattedReplacements = replacements.map((replacement, valueIndex) => {
      if (!replacement) {
        return null
      }
      return replacement.map((subValue, subIndex) => {
        const tempFormatted = [toBeReplaced[valueIndex][subIndex][0], subValue]
        if (tempFormatted[0] != tempFormatted[1]) { return tempFormatted }
      })
    })
    return removeDupeReplacements(formattedReplacements)
  }))
}
