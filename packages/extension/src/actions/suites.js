import suiteModel from '../models/suite_model';
import {setSuites} from './editor'
import {types as T} from './action_types'


export function addTestToSuite(test) {
  return {
    type: T.ADD_SUITE_TEST,
    test
  }
}

export function removeTestFromSuite(test) {
  return {
    type: T.REMOVE_SUITE_TEST,
    test
  }
}


// Thunk Actions

export function createSuite (newSuite) {
  return (dispatch, getState) => {
    const projectId = getState().editor.project.id
    return suiteModel.insert({...newSuite, projectId})
    .then(() => suiteModel.listByProject(projectId))
    .then(suites => dispatch(setSuites(suites)))
  };
}

export function updateSuite (suite) {
  return (dispatch, getState) => {
    const projectId = getState().editor.project.id
    return suiteModel.update(suite.id, suite)
    .then(() => suiteModel.listByProject(projectId))
    .then(suites => dispatch(setSuites(suites)))

  };
}

export function removeSuite (suite) {
  return (dispatch, getState) => {
    const projectId = getState().editor.project.id
    return suiteModel.remove(suite.id)
    .then(() => suiteModel.listByProject(projectId))
    .then(suites => dispatch(setSuites(suites)))
  };
}
