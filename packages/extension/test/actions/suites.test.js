import { addTestToSuite, removeTestFromSuite } from '../../src/actions/suites'

jest.mock('../../src/actions/editor')
jest.mock('../../src/actions/action_types', () => (
    {
        types: {
            ADD_SUITE_TEST: 'MOCK_ADD_SUITE_TEST',
            REMOVE_SUITE_TEST: 'MOCK_REMOVE_SUITE_TEST'
        }
    }
))

describe('action suites utils', () => {
    it('addTestToSuite', () => {
        expect(addTestToSuite('mockTest')).toEqual({
            test: 'mockTest',
            type: 'MOCK_ADD_SUITE_TEST'
        })
    })
    it('removeTestFromSuite', () => {
        expect(removeTestFromSuite('mockTest')).toEqual({
            test: 'mockTest',
            type: 'MOCK_REMOVE_SUITE_TEST'
        })
    })
})
