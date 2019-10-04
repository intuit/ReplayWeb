import {
  getValuesFromCommands,
  pullValuesToBeReplaced,
  removeDupeReplacements,
  isEquivState,
  updateSubstitutions,
  buildContext
} from './../../src/common/substitution_builder'

const noTypeCommands = [
  {
    command: '',
    parameters: {}
  },
  {
    command: 'setContext',
    parameters: {
      key: 'guy',
      value: 'boy'
    }
  },
  {
    command: 'click',
    parameters: {
      target: 'idk',
      value: '{guy}'
    }
  }
]

const noSetContextCommands = [
  {
    command: 'open',
    parameters: {
      url: 'https://www.google.com/'
    }
  },
  {
    command: 'click',
    parameters: {
      target: 'name=q'
    }
  },
  {
    command: 'type',
    parameters: {
      target: 'name=q',
      value: 'best {topic}verere {random}'
    }
  },
  {
    command: 'click',
    parameters: {
      target: 'name=btnK'
    }
  },
  {
    command: 'type',
    parameters: {
      target: 'name=q',
      value: '{fName} {lName} enjoys {random} on {todaysDate}'
    }
  },
  {
    command: 'type',
    parameters: {
      target: 'name=q',
      value: '{ssn} {random} {ssn} {ssn}'
    }
  },
  {
    command: 'click',
    parameters: {
      target: '//*[@id="tsf"]/div[2]'
    }
  },
  {
    command: 'type',
    parameters: {
      target: 'name = q',
      value: '{ssn}'
    }
  },
  {
    command: 'click',
    parameters: {
      target: 'css=div.FPdoLc.VlcLAe'
    }
  },
  {
    command: 'type',
    parameters: {
      target: 'name = q',
      value: '{game} {ssn} sadfadfas {random} {millis}'
    }
  }
]

describe('substitution builder', () => {
  describe('getValuesFromCommands', () => {
    it('should handle null paramaters', () => {
      expect(getValuesFromCommands()).toEqual([])
    })
    it('should return list of nulls if there are no type commands', () => {
      const values = getValuesFromCommands(noTypeCommands)
      var allNulls = true
      for (var v in values) {
        if (values[v] != null) allNulls = false
      }
      expect(allNulls).toEqual(true)
    })
    it('should pull out values from type commands', () => {
      const expected = [
        null,
        null,
        'best {topic}verere {random}',
        null,
        '{fName} {lName} enjoys {random} on {todaysDate}',
        '{ssn} {random} {ssn} {ssn}',
        null,
        '{ssn}',
        null,
        '{game} {ssn} sadfadfas {random} {millis}'
      ]
      const retrieved = getValuesFromCommands(noSetContextCommands)
      var correct = true
      for (var index in expected) {
        correct = correct && expected[index] === retrieved[index]
      }
      expect(correct).toEqual(true)
    })
  })

  describe('pullValuesToBeReplaced', () => {
    it('should handle null paramaters', () => {
      expect(pullValuesToBeReplaced()).toEqual([])
    })
    it('should return list of nulls if there are no type commands', () => {
      const values = getValuesFromCommands(noTypeCommands) //We assume getValuesFromCommands to be safe due to above tests
      const replacements = pullValuesToBeReplaced(values)
      var allNulls = true
      for (var v in replacements) {
        if (replacements[v] != null) allNulls = false
      }
      expect(allNulls).toEqual(true)
    })
  })

  describe('removeDupeReplacements', () => {
    it('should handle null paramaters', () => {
      expect(removeDupeReplacements()).toEqual([])
    })
    it('should remove duplicate keys', () => {
      var ar = [[['a', 'A'], ['b', 'B'], ['a', 'A']], [['a', 'A']]]
      var cleaned = removeDupeReplacements(ar)
      expect(
        cleaned.length == 2 &&
          cleaned[0].length == 2 &&
          cleaned[0][0][0] == 'a' &&
          cleaned[0][1][0] == 'b'
      ).toEqual(true)
    })
  })
  describe('isEquivState', () => {
    it('should handle empty paramaters', () => {
      expect(isEquivState([], [])).toEqual(true)
    })
    it('should notice these values are the different', () => {
      var state1 = [[['a', 1], ['b', 2]][('c', 3)], [['d', 4]]]
      var state2 = [[['a', 1], ['b', 2]][('c', 3)], [['d', 23452345]]]
      expect(isEquivState(state1, state2)).toEqual(false)
    })
    it('should notice these keys are the different', () => {
      var state1 = [[['a', 1], ['bfasdfasd', 2]][('c', 3)], [['d', 4]]]
      var state2 = [[['a', 1], ['b', 2]][('c', 3)], [['', 4]]]
      expect(isEquivState(state1, state2)).toEqual(false)
    })

    it('should think these states are the equal', () => {
      var state1 = [[['a', 1], ['b', 2]][('c', 3)], [['d', 4]]]
      var state2 = [[['a', 1], ['b', 2]][('c', 3)], [['d', 4]]]
      expect(isEquivState(state1, state2)).toEqual(true)
    })
    it('should think these states are the equal, despite the random', () => {
      var state1 = [[['a', 1], ['b', 2]][('{random}', 456)], [['d', 4]]]
      var state2 = [[['a', 1], ['b', 2]][('{random}', 1245)], [['d', 4]]]
      expect(isEquivState(state1, state2)).toEqual(true)
    })
  })
  describe('buildContext', () => {
    it('should handle null paramaters', function() {
      expect(buildContext()).toEqual(undefined)
    })

    it('should handle empty paramaters', function() {
      expect(buildContext([], [], {})).toEqual(undefined)
    })
  })

  describe('updateSubstitutions', () => {
    it('should handle null paramaters', async function() {
      const subs = await updateSubstitutions()
      expect(subs).toEqual(undefined)
    })

    it('should handle no type commands', async function() {
      const subs = await updateSubstitutions(noTypeCommands, [])
      expect(subs.filter(d => Boolean(d)).length).toEqual(0)
    })
  })
})
