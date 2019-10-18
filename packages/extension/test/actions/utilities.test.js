import {
  validatedBlockShareConfig,
  getBlockShareConfig,
  getGithubRepoFromBlockShareConfig,
  __RewireAPI__ as utilitiesRewire,
  nativeMessage,
} from '../../src/actions/utilities'

import Github from 'github-api'

const A_VALID_BLOCK_SHARE_CONFIG = {
  blockStore: {
    authUsername: 'auth_user',
    authToken: 'auth_token',
    repoUsername: 'repo_user',
    repo: 'repo',
    github_api_url: 'https://github.company.com/api/v3'
  }
}

describe('action utilities', () => {
  it('should pass validation on valid blockShareConfig', async () => {
    const validConfig = A_VALID_BLOCK_SHARE_CONFIG
    await expect(
      validatedBlockShareConfig(validConfig, 'prefix')
    ).resolves.toEqual(validConfig)
  })

  it('should fail validation on an invalid blockShareConfig without repoUsername', async () => {
    const invalidConfig = {
      blockStore: {
        authUsername: 'auth_user',
        authToken: 'auth_token',
        repo: 'repo',
        github_api_url: 'some_url'
      }
    }

    await expect(
      validatedBlockShareConfig(invalidConfig, 'prefix')
    ).rejects.toEqual(
      new Error(
        'prefix: blockStore.repoUsername must be present and be a string'
      )
    )
  })

  it('should fail validation on an invalid blockShareConfig without blockStore', async () => {
    const invalidConfig = {}
    await expect(
      validatedBlockShareConfig(invalidConfig, 'prefix')
    ).rejects.toEqual(new Error(`prefix: Object blockStore is not present`))
  })

  it('should fail validation on an invalid blockShareConfig with a non-string repoUsername', async () => {
    const invalidConfig = {
      blockStore: {
        authUsername: 'auth_user',
        authToken: 'auth_token',
        repoUsername: [],
        repo: 'repo',
        github_api_url: 'some_url'
      }
    }

    await expect(
      validatedBlockShareConfig(invalidConfig, 'prefix')
    ).rejects.toEqual(
      new Error(
        `prefix: blockStore.repoUsername must be present and be a string`
      )
    )
  })

  it('should fail validation on an invalid blockShareConfig without repo', async () => {
    const invalidConfig = {
      blockStore: {
        authUsername: 'auth_user',
        authToken: 'auth_token',
        repoUsername: 'repo_user',
        github_api_url: 'some_url'
      }
    }

    await expect(
      validatedBlockShareConfig(invalidConfig, 'prefix')
    ).rejects.toEqual(
      new Error(`prefix: blockStore.repo must be present and be a string`)
    )
  })

  it('should fail validation on an invalid blockShareConfig with a non-string repo', async () => {
    const invalidConfig = {
      blockStore: {
        authUsername: 'auth_user',
        authToken: 'auth_token',
        repoUsername: 'repo_user',
        repo: [],
        github_api_url: 'some_url'
      }
    }

    await expect(
      validatedBlockShareConfig(invalidConfig, 'prefix')
    ).rejects.toEqual(
      new Error(`prefix: blockStore.repo must be present and be a string`)
    )
  })

  it('should fail validation on an invalid blockShareConfig without github_api_url', async () => {
    const invalidConfig = {
      blockStore: {
        authUsername: 'auth_user',
        authToken: 'auth_token',
        repoUsername: 'repo_user',
        repo: 'repo'
      }
    }

    await expect(
      validatedBlockShareConfig(invalidConfig, 'prefix')
    ).rejects.toEqual(
      new Error(
        `prefix: blockStore.github_api_url must be present and be a string`
      )
    )
  })

  it('should fail validation on an invalid blockShareConfig with a non-string repo', async () => {
    const invalidConfig = {
      blockStore: {
        authUsername: 'auth_user',
        authToken: 'auth_token',
        repoUsername: 'repo_user',
        repo: 'repo',
        github_api_url: []
      }
    }

    await expect(
      validatedBlockShareConfig(invalidConfig, 'prefix')
    ).rejects.toEqual(
      new Error(
        `prefix: blockStore.github_api_url must be present and be a string`
      )
    )
  })

  it('should fail validation on an invalid blockShareConfig with a non-string authUsername', async () => {
    const invalidConfig = {
      blockStore: {
        authUsername: [],
        authToken: 'auth_token',
        repoUsername: 'repo_user',
        repo: 'repo',
        github_api_url: 'some_url'
      }
    }

    await expect(
      validatedBlockShareConfig(invalidConfig, 'prefix')
    ).rejects.toEqual(new Error(`prefix: blockStore.username is not a string`))
  })

  it('should fail validation on an invalid blockShareConfig with a non-string authToken', async () => {
    const invalidConfig = {
      blockStore: {
        authUsername: 'auth_user',
        authToken: [],
        repoUsername: 'repo_user',
        repo: 'repo',
        github_api_url: 'some_url'
      }
    }

    await expect(
      validatedBlockShareConfig(invalidConfig, 'prefix')
    ).rejects.toEqual(new Error(`prefix: blockStore.authToken is not a string`))
  })

  it('should get valid github object from a valid config', () => {
    const gh = new Github(
      {
        username: A_VALID_BLOCK_SHARE_CONFIG.blockStore.authUsername,
        token: A_VALID_BLOCK_SHARE_CONFIG.blockStore.authToken
      },
      A_VALID_BLOCK_SHARE_CONFIG.blockStore.github_api_url
    )
    const expected = gh.getRepo(
      A_VALID_BLOCK_SHARE_CONFIG.blockStore.repoUsername,
      A_VALID_BLOCK_SHARE_CONFIG.blockStore.repo
    )

    expect(
      getGithubRepoFromBlockShareConfig(A_VALID_BLOCK_SHARE_CONFIG)
    ).toEqual(expected)
  })

  describe('with mocked readFile native messaging passing', () => {
    afterEach(() => utilitiesRewire.__ResetDependency__('nativeMessage'))
    beforeEach(() =>
      utilitiesRewire.__Rewire__('nativeMessage', () =>
        Promise.resolve({ data: A_VALID_BLOCK_SHARE_CONFIG })
      )
    )

    it('getBlockShareConfig returns proper results on valid config', async () => {
      await expect(getBlockShareConfig()).resolves.toEqual(
        A_VALID_BLOCK_SHARE_CONFIG
      )
    })
  })

  describe('with mocked readFile native messaging passing but without data', () => {
    afterEach(() => utilitiesRewire.__ResetDependency__('nativeMessage'))
    beforeEach(() =>
      utilitiesRewire.__Rewire__('nativeMessage', () => Promise.resolve({}))
    )

    it('getBlockShareConfig returns a rejected promise', async () => {
      await expect(getBlockShareConfig()).rejects.toEqual(
        new Error('Internal error - Could not read block share config')
      )
    })
  })

  describe('with mocked readFile native messaging failing', () => {
    afterEach(() => utilitiesRewire.__ResetDependency__('nativeMessage'))
    beforeEach(() =>
      utilitiesRewire.__Rewire__('nativeMessage', () =>
        Promise.reject(Error('some_error'))
      )
    )

    it('getBlockShareConfig returns a rejected promise', async () => {
      await expect(getBlockShareConfig()).rejects.toEqual(
        new Error(
          'Block share config must be present and a valid JSON file at ~/.replay/block_share_config.json'
        )
      )
    })
  })

  describe('nativeMessage', () => {
      afterEach(() => {
        jest.clearAllMocks()
      })

    it('nativeMessage should call chrome.runtime.sendNativeMessage with correct params and return Promise which resolves if response.success is true', async () => {
        const sendNativeMessageMock = jest.fn().mockImplementation((arg1, arg2, responseHandler) => {
            responseHandler({success: true, data: 'mock_success_data'})
        })
        const chromeMock = {
            runtime: {
                sendNativeMessage: sendNativeMessageMock
            }
        }
        global.chrome = chromeMock
        const messageRequest = nativeMessage('mockPayload')
        expect(sendNativeMessageMock).toHaveBeenCalled()
        expect(sendNativeMessageMock.mock.calls[0][0]).toEqual("com.intuit.replayweb")
        expect(sendNativeMessageMock.mock.calls[0][1]).toEqual("mockPayload")
        await expect(messageRequest).resolves.toEqual('mock_success_data')
    })

    it('nativeMessage should return Promise which rejects if response success is not true', async () => {
        const sendNativeMessageMock = jest.fn().mockImplementation((arg1, arg2, responseHandler) => {
            responseHandler({success: false, data: 'mock_failure_data'})
        })
        const chromeMock = {
            runtime: {
                sendNativeMessage: sendNativeMessageMock
            }
        }
        global.chrome = chromeMock
        const messageRequest = nativeMessage('mockPayload')
        expect(sendNativeMessageMock).toHaveBeenCalled()
        expect(sendNativeMessageMock.mock.calls[0][0]).toEqual("com.intuit.replayweb")
        expect(sendNativeMessageMock.mock.calls[0][1]).toEqual("mockPayload")
        await expect(messageRequest).rejects.toEqual('mock_failure_data')
    })
  })
})
