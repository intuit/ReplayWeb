import {log as splunkLog} from '@replayweb/utils'
import github from 'github-api'

const repos = [
  'BLOCK_STORE'
].reduce((prev, cur) => {
  prev[cur] = cur;
  return prev;
}, {});

/**
 * Sends a message to the native host
 * @param {Object} payload - The javascript object payload to send to the host
 * @return {Promise<Object>} - Returns a promise that resolves with the response from the host
 */
export function nativeMessage (payload) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendNativeMessage(
      'com.intuit.replayweb',
      payload,
      response => {
        console.log('payload', payload);
        console.log('res', response);
        if (response.success) {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      }
    );
  });
}

/**
 * Logs the message to splunk
 * @param {Object} message - The javascript object to log to splunlk
 * @return {Promise<Object>} - Returns a promise that resolves when successful
 */
export function logMessage(message) {
  return (dispatch, getState) => {
    console.log('LOGGING MESSAGE TO SPLUNK', getState());
    const userName = getState().app.userName
    if (getState().app.config.logging === false) {
      return null
    }
    return splunkLog({message: JSON.stringify(message), authId: userName})
  }
}

/**
 * Returns Github repo object from the given block share config object
 * @returns Github repo object
 */
export function getGithubRepoFromBlockShareConfig(config) {
    const githubAuth = getGithubAuthFromBlockShareConfig(config);
    const gh = new github(githubAuth, config.blockStore.github_api_url);
    return gh.getRepo(config.blockStore.repoUsername, config.blockStore.repo);
}

/**
 * Returns Block share config from file system
 * @returns {Promise} the github configuration for the resolve path and an error message for the reject path
 */
export function getBlockShareConfig() {
    const BLOCK_SHARE_CONFIG_PATH = "~/.replay/block_share_config.json";
    const BLOCK_SHARE_CONFIG_FILE_ERROR = `Block share config must be present and a valid JSON file at ${BLOCK_SHARE_CONFIG_PATH}`;
    const BLOCK_SHARE_INVALID_CONFIG_ERROR = `Invalid block sharing config at ${BLOCK_SHARE_CONFIG_PATH}`;
    return nativeMessage({
        type: 'readFile',
        filepath: BLOCK_SHARE_CONFIG_PATH
    }).then(
        (response) => {
           if (!("data" in response)) {
               return Promise.reject(new Error("Internal error - Could not read block share config"));
           }
           return validatedBlockShareConfig(response.data, BLOCK_SHARE_INVALID_CONFIG_ERROR + ": ");
        },
        () => Promise.reject(new Error(BLOCK_SHARE_CONFIG_FILE_ERROR))
    )
}

function getGithubAuthFromBlockShareConfig(config) {
    // Add auth related keys to the object only if config has them
    return {
        ...(config.blockStore.authUsername && {username: config.blockStore.authUsername}),
        ...(config.blockStore.authToken && {token: config.blockStore.authToken}),
    }
}

export function validatedBlockShareConfig(configFileObject, errorPrefix) {
    // Config structure expected:
    // {
    //   blockStore: {
    //     authUsername: <string>,
    //     authToken: <string>,
    //     repoUsername: <string>,
    //     repo: <string>,
    //     github_api_url: <string>
    //   }
    // }
    if (!("blockStore" in configFileObject)) {
        return Promise.reject(new Error(errorPrefix + ": Object blockStore is not present"));
    }

    const blockStoreConfig = configFileObject.blockStore;

    // Validate block store config specified for they key "blockStore"
    if (("authUsername" in blockStoreConfig) && typeof(blockStoreConfig.authUsername) !== "string") {
        return Promise.reject(new Error(errorPrefix + ": blockStore.username is not a string"));
    }
    if (("authToken" in blockStoreConfig) && typeof(blockStoreConfig.authToken) !== "string") {
        return Promise.reject(new Error(errorPrefix + ": blockStore.authToken is not a string"));
    }
    if (!("repoUsername" in blockStoreConfig) || typeof(blockStoreConfig.repoUsername) !== "string") {
        return Promise.reject(new Error(errorPrefix + ": blockStore.repoUsername must be present and be a string"));
    }
    if (!("repo" in blockStoreConfig) || typeof(blockStoreConfig.repo) !== "string") {
        return Promise.reject(new Error(errorPrefix + ": blockStore.repo must be present and be a string"));
    }
    if (!("github_api_url" in blockStoreConfig) || typeof(blockStoreConfig.github_api_url) !== "string") {
        return Promise.reject(new Error(errorPrefix + ": blockStore.github_api_url must be present and be a string"));
    }
    return Promise.resolve(configFileObject)
}


export const allRepos = {...repos};