import { addTestToSuite, removeTestFromSuite, createSuite, updateSuite, removeSuite } from '../../src/actions/suites'
import { mockStore } from '../utils'

jest.mock('../../src/models/suite_model', () => ({
    insert: jest.fn().mockResolvedValue(),
    listByProject: jest.fn().mockResolvedValue([{id: 1}, {id: 2}]),
    remove: jest.fn().mockResolvedValue(),
    update: jest.fn().mockResolvedValue()
}))

jest.mock('../../src/actions/editor', () => ({
    setSuites: () => ({type: 'SET_SUITE_MOCK'})
}))
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

describe('action suites thunk utils', () => {
    let store
    beforeEach(() => {
        store = mockStore({
            editor: {
                project: {
                    id: 1
                }
            }
        })
    })

    it('createSuite', () => {
        return store.dispatch(createSuite({id: 1}))
            .then(() => {
                expect(store.getActions()).toEqual([{type: 'SET_SUITE_MOCK'}])
            })
    })

    it('updateSuite', () => {
        return store.dispatch(updateSuite({id: 1}))
            .then(() => {
                expect(store.getActions()).toEqual([{type: 'SET_SUITE_MOCK'}])
            })
    })

    it('removeSuite', () => {
        return store.dispatch(removeSuite({id: 1}))
            .then(() => {
                expect(store.getActions()).toEqual([{type: 'SET_SUITE_MOCK'}])
            })
    })
})
