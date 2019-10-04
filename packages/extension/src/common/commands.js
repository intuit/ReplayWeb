export const newCommand = {
  command: '',
  parameters: {}
}

/*
 * Parameter Object schema
 * name: the name of the parameter
 * type: the type to use when rendering the field in the UI
 * description: parameter description for UI + auto generated docs
 * example: example value for parameter for generated docs
 * optional: whether or not the parameter is optional (false if not defined)
 * canTarget: whether or not the element picker button should be allowed for this parameter (false if not defined)
 * key: for object types, the key can be defined to show the value of that key in the object in the UI preview
 * data: a collection to show as options when the parameter has a finite selection for values
 */
const availableCommands = [
  {
    name: 'assertAttribute',
    description:
      'Assert that a given element has an attribute of the expected value',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      },
      {
        name: 'attribute',
        type: 'string',
        description: 'The attribute of the element to assert against',
        example: 'href'
      },
      {
        name: 'expected',
        type: 'string',
        description: 'The expected value for the attribute',
        example: 'https://example.com'
      }
    ]
  },
  {
    name: 'assertCheckboxState',
    description: 'Assert that a given checkbox is either checked or not',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      },
      {
        name: 'expected',
        type: 'checkbox',
        optional: true,
        description: 'Whether the given checkbox should be checked or not',
        example: false
      }
    ]
  },
  {
    name: 'assertClassDoesNotExist',
    description:
      'Assert that a given element does not have a specific classname',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      },
      {
        name: 'class',
        type: 'string',
        description: 'The class name to assert does not exist on the element',
        example: 'col-md-5'
      }
    ]
  },
  {
    name: 'assertClassExists',
    description: 'Assert that a given element has a specific classname',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      },
      {
        name: 'class',
        type: 'string',
        description: 'The class name to assert exists on the element',
        example: 'col-md-5'
      }
    ]
  },
  {
    name: 'assertElementPresent',
    description: 'Assert that a given element exists on the page',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      },
      {
        name: 'timeout',
        type: 'string',
        description: 'The maximum time to wait for the element to exist',
        example: 6000
      }
    ]
  },
  {
    name: 'assertElementNotPresent',
    description: 'Assert that a given element does not exist on the page',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      },
      {
        name: 'timeout',
        type: 'string',
        description: 'The maximum time to wait for the element to not exist',
        example: 6000
      }
    ]
  },
  {
    name: 'assertElementVisible',
    description: 'Assert that a given element is visible on the page',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      },
      {
        name: 'timeout',
        type: 'string',
        description: 'The maximum time to wait for the element to be visible',
        example: 6000
      }
    ]
  },
  {
    name: 'assertElementNotVisible',
    description: 'Assert that a given element is not visible on the page',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      },
      {
        name: 'timeout',
        type: 'string',
        description:
          'The maximum time to wait for the element to not be visible',
        example: 6000
      }
    ]
  },
  {
    name: 'assertLocalStorage',
    description:
      'Assert that a given key has an expected value in local storage',
    comment: '',
    parameters: [
      {
        name: 'key',
        type: 'string',
        description: 'The key to access in local storage',
        example: 'versionOverride'
      },
      {
        name: 'expected',
        type: 'string',
        description: 'The expected value for the key in local storage',
        example: '1.0.23'
      }
    ]
  },
  {
    name: 'assertSessionStorage',
    description:
      'Assert that a given key has an expected value in session storage',
    comment: '',
    parameters: [
      {
        name: 'key',
        type: 'string',
        description: 'The key to access in session storage',
        example: 'versionOverride'
      },
      {
        name: 'expected',
        type: 'string',
        description: 'The expected value for the key in session storage',
        example: '1.0.23'
      }
    ]
  },
  {
    name: 'assertStyle',
    description: 'Assert that a given element has a specific computed style',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      },
      {
        name: 'property',
        type: 'string',
        description: 'The style property to assert against',
        example: 'width'
      },
      {
        name: 'expected',
        type: 'string',
        description: 'The expected value for the style property',
        example: '200px'
      }
    ]
  },
  {
    name: 'assertTableNotEmpty',
    description: 'Assert that table has some data',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      }
    ]
  },
  {
    name: 'assertText',
    description:
      'Assert that the text of a given element matches the expected value',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      },
      {
        name: 'expected',
        type: 'string',
        description:
          'The expected value for the text, can also be a regular expression in the format: /regex/',
        example: '/example.*/'
      }
    ]
  },
  {
    name: 'assertTitle',
    description:
      'Assert that the title of the current page matches the expected value',
    comment: '',
    parameters: [
      {
        name: 'expected',
        type: 'string',
        description: 'The expected value for the title of the page',
        example: 'Example Site'
      }
    ]
  },
  {
    name: 'assertUrl',
    description:
      'Assert that the URL of the current page matches the expected value',
    comment: '',
    parameters: [
      {
        name: 'expected',
        type: 'string',
        description: 'The expected value for the URL of the page',
        example: 'https://example.com'
      }
    ]
  },
  {
    name: 'assertJsonInContext',
    description: 'Assert that JSON value in context matches the expected value',
    comment:
      'The expected value can be json or any left node value (e.g., string, boolean, etc.)',
    parameters: [
      {
        name: 'key',
        type: 'string',
        extra: 'The context key name where JSON was stored earlier',
        description: 'The variable name where JSON is located',
        example: 'postResponse'
      },
      {
        name: 'expected',
        type: 'object',
        description: 'The expected value for the URL of the page',
        example: '{"apple" : {"color": "red", "type": "pome"}}'
      }
    ]
  },
  {
    name: 'captureScreenshot',
    description: 'Captures a screenshot of the entire page',
    comment: '',
    parameters: []
  },
  {
    name: 'click',
    description: 'Clicks on a given element',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      }
    ]
  },
  {
    name: 'comment',
    description: 'Adds a comment to the test',
    comment: '',
    parameters: [
      {
        name: 'message',
        type: 'string',
        description: 'The comment to add',
        example: 'Start of Assertion Section'
      }
    ]
  },
  {
    name: 'clearValue',
    description: 'Clear the value in an input field',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      }
    ]
  },
  {
    name: 'debug',
    description:
      '@replayweb/testrunner specific command to pause execution in selenium for debugging',
    comment: '',
    parameters: []
  },
  {
    name: 'deleteAllCookies',
    description: 'Deletes all the cookies for the current session',
    comment: '',
    parameters: []
  },
  {
    name: 'dragAndDropToObject',
    description: 'Drags a given element onto another given element',
    comment: '',
    parameters: [
      {
        name: 'startTarget',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element to drag',
        example: 'id=startElement'
      },
      {
        name: 'endTarget',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element to drop onto',
        example: 'id=endElement'
      }
    ]
  },
  {
    name: 'http',
    description: 'Makes an HTTP call and retrieves the result as JSON',
    comment:
      'Set the `key` property to put the response into the context for later user, set the text property to retrieve the result as plain text',
    parameters: [
      {
        name: 'url',
        type: 'string',
        description: 'The URL to make the request to',
        example: 'https://example.com'
      },
      {
        name: 'method',
        type: 'select',
        data: ['GET', 'POST', 'PUT', 'DELETE'],
        optional: true,
        description: 'The method to use for the request',
        example: 'POST'
      },
      {
        name: 'body',
        type: 'object',
        optional: true,
        description:
          'A JSON object to send as the body for requests with a body',
        example: {
          exampleKey: 'value'
        }
      },
      {
        name: 'headers',
        type: 'object',
        optional: true,
        description: 'A JSON Object of headers to use for the request',
        example: {
          example_tid: 'XXXXX-XXXXX-XXXXX'
        }
      },
      {
        name: 'key',
        type: 'string',
        extra: 'The key to store the response in the context under',
        optional: true,
        description: 'The variable name to store the response in for later use',
        example: 'postResponse'
      },
      {
        name: 'text',
        type: 'checkbox',
        extra: 'Retrieve the result as plaintext instead of JSON',
        description: 'Whether or not to retrieve the result as plaintext',
        optional: true,
        example: false
      }
    ]
  },
  {
    name: 'mouseOver',
    description:
      'Moves the mouse over the given element to trigger hover events',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      }
    ]
  },
  {
    name: 'mouseEvent',
    description:
      'Triggers the full mouseEvent sequence instead of just clicking',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      }
    ]
  },
  {
    name: 'open',
    description: 'Navigate to the provided URL',
    comment:
      'The open command supports environment variables, to make tests reusable across environments, and making URLs more dynamic To set this up, the target portion of the open command can have any parts replaced with braces, and in the braces, the name of the environment variable.',
    parameters: [
      {
        name: 'url',
        type: 'string',
        description: 'The URL to navigate to',
        example: 'https://example.com'
      }
    ]
  },
  {
    name: 'pause',
    description: 'Pauses the test for the specified amount of milliseconds',
    comment: '',
    parameters: [
      {
        name: 'millis',
        type: 'string',
        description: 'The number of milliseconds to pause for',
        example: 3000
      }
    ]
  },
  {
    name: 'refresh',
    description: 'Refreshes the current page',
    comment: '',
    parameters: []
  },
  {
    name: 'select',
    description: 'Selects the provided value from a dropdown',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      },
      {
        name: 'value',
        type: 'string',
        description: 'The value to select',
        example: 'label=3'
      }
    ]
  },
  {
    name: 'selectFrame',
    description: 'Selects an iFrame to interact with',
    comment:
      'This command is recorded automatically in most cases, it may need to be added when adding asserts',
    parameters: [
      {
        name: 'target',
        type: 'string',
        description: 'The locator for the iFrame',
        example: 'id=iframe1'
      },
      {
        name: 'url',
        type: 'string',
        description: 'The URL of the iFrame content',
        example: 'https://iframeorigin.com'
      }
    ]
  },
  {
    name: 'setContext',
    description: 'Stores a value into the provided key for later use',
    comment:
      'This is processed at runtime, so text substitutions in the value parameter will be processed',
    parameters: [
      {
        name: 'key',
        type: 'string',
        description: 'The name of the variable to store in',
        example: 'ARTIFACTVERSION'
      },
      {
        name: 'value',
        type: 'string',
        description: 'The value to store into the variable',
        example: '1.0.23-SNAPSHOT'
      }
    ]
  },
  {
    name: 'filterJsonInContext',
    description: 'Filters JSON value in context variable',
    comment:
      'To pick sub-node in JSON pass property-chain in locateNode. Use deleteNodes (list of property-chain) to locate nodes that needs to be deleted',
    parameters: [
      {
        name: 'key',
        type: 'string',
        description: 'The name of the variable in store to read JSON from',
        example: 'postResponse'
      },
      {
        name: 'resultKey',
        type: 'string',
        description: 'The name of the variable to store filtered JSON into',
        example: 'filteredPostResponse'
      },
      {
        name: 'locateNode',
        type: 'object',
        optional: true,
        description: 'The property-chain list',
        example: '["apple", "color"]'
      },
      {
        name: 'deleteNodes',
        type: 'object',
        optional: true,
        description: 'The list of property-chain list',
        example: '[["apple"]]'
      }
    ]
  },
  {
    name: 'setCookie',
    description: 'Sets a cookie',
    comment:
      'In some cases, you will need to refresh the page for cookie changes to be picked up by your app',
    parameters: [
      {
        name: 'name',
        type: 'string',
        description: 'The name of the cookie',
        example: 'BYPASS_BROWSER_COMPATIBILITY'
      },
      {
        name: 'value',
        type: 'string',
        description: 'The value of the cookie',
        example: true
      },
      {
        name: 'domain',
        type: 'string',
        optional: true,
        description: 'The domain of the cookie (defaults to: .example.com)',
        example: '.example.com'
      }
    ]
  },
  {
    name: 'setEnvironment',
    description:
      'Set multiple variable values at once as a comma separated list',
    comment: 'Ex: dev=dev.example.com,PROD=example.com',
    parameters: null
  },
  {
    name: 'setLocalStorage',
    description: 'Sets a value in local storage',
    comment: '',
    parameters: [
      {
        name: 'key',
        type: 'string',
        description: 'The key to set in local storage',
        example: 'versionOverride'
      },
      {
        name: 'value',
        type: 'string',
        description: 'The value to set for the key',
        example: '1.0.23-SNAPSHOT'
      }
    ]
  },
  {
    name: 'setSession',
    description: 'Sets a value in session storage',
    comment: '',
    parameters: [
      {
        name: 'key',
        type: 'string',
        description: 'The key to set in session storage',
        example: 'versionOverride'
      },
      {
        name: 'value',
        type: 'string',
        description: 'The value to set for the key',
        example: '1.0.23-SNAPSHOT'
      }
    ]
  },
  {
    name: 'storeValue',
    description:
      'Retrieves the text from an element, and stores it in a variable for later use',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      },
      {
        name: 'key',
        type: 'string',
        description: 'The name of the variable to store the value in',
        example: 'exampleVariable'
      }
    ]
  },
  {
    name: 'type',
    description: 'Types the given text into the element',
    comment: '',
    parameters: [
      {
        name: 'target',
        type: 'string',
        canTarget: true,
        description: 'The locator for the element',
        example: 'id=myElement'
      },
      {
        name: 'value',
        type: 'string',
        description: 'The value to type into the element',
        example: 'Hello World'
      }
    ]
  },
  {
    name: 'runBlock',
    description: 'Runs a block of commands',
    comment: '',
    parameters: [
      {
        name: 'block',
        type: 'select',
        data: 'blocks',
        description: 'The name of the block to run',
        example: 'LoginBlock'
      }
    ]
  }
]

// Map commands array to Object with command names as keys, and the command objects as values
export const commandsMap = availableCommands
  .map(c => ({ [c.name]: c }))
  .reduce((acc, cv) => ({ ...acc, ...cv }), {})

export default availableCommands
