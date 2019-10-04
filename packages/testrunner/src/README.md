## Functions

<dl>
<dt><a href="#getSeleniumConfig">getSeleniumConfig(options, port)</a> ⇒ <code>Object</code></dt>
<dd><p>Generates a config for @wdio/selenium-standalone-service</p>
</dd>
<dt><a href="#getEnvironment">getEnvironment(port)</a> ⇒ <code>Object</code></dt>
<dd><p>Generates an environment config for webdriverio
Switches environment using an environment variable ENV so it works in child processes of wdio</p>
</dd>
<dt><a href="#getServices">getServices(selenium, applitoolsWhether)</a> ⇒ <code>Array</code></dt>
<dd><p>Generates an array of services for selenium and applitools if configured</p>
</dd>
<dt><a href="#getCapabilities">getCapabilities(capabilities, flag)</a> ⇒ <code>Array</code></dt>
<dd><p>Generates an array of capability objects to use for the test run</p>
</dd>
<dt><a href="#runCommands">runCommands(testDef, implicitWait, plugins)</a> ⇒ <code>Promise</code></dt>
<dd><p>Runs commands for the given test definition object</p>
</dd>
<dt><a href="#makeHooks">makeHooks(pluginData)</a></dt>
<dd><p>Creates the hooks for running tests and registers plugins</p>
</dd>
<dt><a href="#removeTemporaryFiles">removeTemporaryFiles()</a></dt>
<dd><p>This function is used to clean up the temporary folders created by the
<code>runInParallel</code> function</p>
</dd>
<dt><a href="#getJsonFiles">getJsonFiles()</a></dt>
<dd><ul>
<li><ul>
<li>Searches directory tree for JSON files.</li>
<li><ul>
<li>@param {string} dir - The parent directory representing the tree to search.</li>
</ul>
</li>
<li><ul>
<li>@param {function} callback - This function will report a sub-directory when found.</li>
</ul>
</li>
<li><ul>
<li>@returns {Array<String>} - If directory exists, then returns an array of full path names to all JSON files found. Otherwise, returns an empty array.
+</li>
</ul>
</li>
</ul>
</li>
</ul>
</dd>
<dt><a href="#runInParallel">runInParallel(filePath, options)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Generates mocha/webdriverio test files at runtime in the current working
directory. Creating these files allows the <code>wdio</code> testrunner to execute them
in parallel</p>
</dd>
<dt><a href="#runInParallelAllRegions">runInParallelAllRegions(filePath, options)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Generates mocha/webdriverio test files by adding each of the login blocks to all the tests
at runtime in the current working directory. Creating these files allows the <code>wdio</code> testrunner 
to execute them in parallel</p>
</dd>
<dt><a href="#loadFromConfig">loadFromConfig(folderPath)</a> ⇒ <code>Object</code></dt>
<dd><p>Reads configuration file information and returns an object with relevant information
to be consumed by webdriverio in a wdio.conf.js</p>
</dd>
<dt><a href="#getDefaults">getDefaults(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Returns a default webdriverio configuration</p>
</dd>
<dt><a href="#getDefaultsVideoPlusAllure">getDefaultsVideoPlusAllure()</a></dt>
<dd><p>overrides default and returns webdriverio configuration to capture video and generate allure reporting for workflows</p>
</dd>
<dt><a href="#tryRequire">tryRequire(packageName, parameters)</a> ⇒</dt>
<dd><p>Wrapper for dynamic importing of plugins</p>
</dd>
<dt><a href="#loadPlugin">loadPlugin(data)</a> ⇒</dt>
<dd><p>Wrapper to parse plugins with and without parameters</p>
</dd>
</dl>

<a name="getSeleniumConfig"></a>

## getSeleniumConfig(options, port) ⇒ <code>Object</code>

Generates a config for @wdio/selenium-standalone-service

**Kind**: global function  
**Returns**: <code>Object</code> - A config object for @wdio/selenium-standalone-service

| Param                        | Type                | Description                              |
| ---------------------------- | ------------------- | ---------------------------------------- |
| options                      | <code>Object</code> | An options object with version overrides |
| options.seleniumVersion      | <code>string</code> | The version of selenium to use           |
| options.chromedriverVersion  | <code>string</code> | The version of selenium to use           |
| options.firefoxdriverVersion | <code>string</code> | The version of firefoxdriver to use      |
| options.iedriverVersion      | <code>string</code> | The version of iedriver to use           |
| port                         | <code>number</code> | The port to start selenium on            |

<a name="getEnvironment"></a>

## getEnvironment(port) ⇒ <code>Object</code>

Generates an environment config for webdriverio
Switches environment using an environment variable ENV so it works in child processes of wdio

**Kind**: global function  
**Returns**: <code>Object</code> - An environment config

| Param | Type                | Description             |
| ----- | ------------------- | ----------------------- |
| port  | <code>number</code> | The port to use locally |

<a name="getServices"></a>

## getServices(selenium, applitoolsWhether) ⇒ <code>Array</code>

Generates an array of services for selenium and applitools if configured

**Kind**: global function  
**Returns**: <code>Array</code> - An array of strings with service names

| Param             | Type                 | Description                                               |
| ----------------- | -------------------- | --------------------------------------------------------- |
| selenium          | <code>boolean</code> | Whether or not to add selenium-standalone to the services |
| applitoolsWhether | <code>boolean</code> | or not to add applitools to the services                  |

<a name="getCapabilities"></a>

## getCapabilities(capabilities, flag) ⇒ <code>Array</code>

Generates an array of capability objects to use for the test run

**Kind**: global function  
**Returns**: <code>Array</code> - Array of capability objects

| Param        | Type                | Description                                                                                          |
| ------------ | ------------------- | ---------------------------------------------------------------------------------------------------- |
| capabilities | <code>Object</code> | Additional capabilities to add to the defaults so they can be accessed with --capabilities           |
| flag         | <code>string</code> | The string flag from the command line, comma separated names of capabilities to use for the test run |

<a name="runCommands"></a>

## runCommands(testDef, implicitWait, plugins) ⇒ <code>Promise</code>

Runs commands for the given test definition object

**Kind**: global function  
**Returns**: <code>Promise</code> - - A promise chain of webdriverio commands  
**Access**: public

| Param                         | Type                                                                  | Description                                           |
| ----------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------- |
| testDef                       | <code>Object</code>                                                   | The test object to run, from the replay extension     |
| testDef.commands              | <code>Array</code>                                                    | An array of commands                                  |
| testDef.commands[].command    | <code>string</code>                                                   | The command to execute                                |
| testDef.commands[].parameters | <code>Object</code>                                                   | The parameters for the command                        |
| implicitWait                  | <code>number</code>                                                   | The value to use when implicitly waiting for elements |
| plugins                       | <code>Array.&lt;string&gt;</code> \| <code>Array.&lt;array&gt;</code> | Array of plugins from config file to load             |

<a name="makeHooks"></a>

## makeHooks(pluginData)

Creates the hooks for running tests and registers plugins

**Kind**: global function

| Param      | Type                                                                  | Description                           |
| ---------- | --------------------------------------------------------------------- | ------------------------------------- |
| pluginData | <code>Array.&lt;string&gt;</code> \| <code>Array.&lt;array&gt;</code> | Array of plugin data from config file |

<a name="removeTemporaryFiles"></a>

## removeTemporaryFiles()

This function is used to clean up the temporary folders created by the
`runInParallel` function

**Kind**: global function  
**Access**: public  
<a name="getJsonFiles"></a>

## getJsonFiles()

- - Searches directory tree for JSON files.
- - @param {string} dir - The parent directory representing the tree to search.
- - @param {function} callback - This function will report a sub-directory when found.
- - @returns {Array<String>} - If directory exists, then returns an array of full path names to all JSON files found. Otherwise, returns an empty array.
-

**Kind**: global function  
<a name="runInParallel"></a>

## runInParallel(filePath, options) ⇒ <code>Array.&lt;string&gt;</code>

Generates mocha/webdriverio test files at runtime in the current working
directory. Creating these files allows the `wdio` testrunner to execute them
in parallel

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - - Array of filepaths to the generated files  
**Access**: public

| Param             | Type                | Description                                                  |
| ----------------- | ------------------- | ------------------------------------------------------------ |
| filePath          | <code>string</code> | Path to the folder of tests                                  |
| options           | <code>Object</code> | Additional options for configuration                         |
| options.blockPath | <code>string</code> | The path to a folder of blocks to associate with these tests |
| options.timeout   | <code>number</code> | Sets the timeout for mocha for these tests                   |
| options.retries   | <code>number</code> | Sets the retries for mocha for these tests                   |
| options.delay     | <code>number</code> | Delay to add between each command being processed            |

<a name="runInParallelAllRegions"></a>

## runInParallelAllRegions(filePath, options) ⇒ <code>Array.&lt;string&gt;</code>

Generates mocha/webdriverio test files by adding each of the login blocks to all the tests
at runtime in the current working directory. Creating these files allows the `wdio` testrunner
to execute them in parallel

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - - Array of filepaths to the generated files  
**Access**: public

| Param             | Type                | Description                                                  |
| ----------------- | ------------------- | ------------------------------------------------------------ |
| filePath          | <code>string</code> | Path to the folder of tests                                  |
| options           | <code>Object</code> | Additional options for configuration                         |
| options.blockPath | <code>string</code> | The path to a folder of blocks to associate with these tests |
| options.timeout   | <code>number</code> | Sets the timeout for mocha for these tests                   |
| options.retries   | <code>number</code> | Sets the retries for mocha for these tests                   |
| options.delay     | <code>number</code> | Delay to add between each command being processed            |

<a name="loadFromConfig"></a>

## loadFromConfig(folderPath) ⇒ <code>Object</code>

Reads configuration file information and returns an object with relevant information
to be consumed by webdriverio in a wdio.conf.js

**Kind**: global function  
**Returns**: <code>Object</code> - An object with specs, and suites  
**Access**: public

| Param      | Type                | Description                                                            |
| ---------- | ------------------- | ---------------------------------------------------------------------- |
| folderPath | <code>string</code> | An optional argument to specify the folder where the config is located |

<a name="getDefaults"></a>

## getDefaults(options) ⇒ <code>Object</code>

Returns a default webdriverio configuration

**Kind**: global function  
**Returns**: <code>Object</code> - An object that is a webdriverio config without specs or suites  
**Access**: public

| Param                | Type                 | Description                                                                             |
| -------------------- | -------------------- | --------------------------------------------------------------------------------------- |
| options              | <code>Object</code>  | An options object to set the nested properties of some generated objects                |
| options.selenium     | <code>Object</code>  | Version overrides for selenium, and the drivers                                         |
| options.applitools   | <code>boolean</code> | Flag to include the applitools service                                                  |
| options.capabilities | <code>Object</code>  | Object to add more capabilities to the defaults, so the --capabilities flag can be used |

<a name="getDefaultsVideoPlusAllure"></a>

## getDefaultsVideoPlusAllure()

overrides default and returns webdriverio configuration to capture video and generate allure reporting for workflows

**Kind**: global function  
<a name="tryRequire"></a>

## tryRequire(packageName, parameters) ⇒

Wrapper for dynamic importing of plugins

**Kind**: global function  
**Returns**: Constructed Plugin

| Param       | Type                | Description                                         |
| ----------- | ------------------- | --------------------------------------------------- |
| packageName | <code>string</code> | The name of the plugin package to attempt to import |
| parameters  | <code>any</code>    | The parameters to construct the plugin with         |

<a name="loadPlugin"></a>

## loadPlugin(data) ⇒

Wrapper to parse plugins with and without parameters

**Kind**: global function  
**Returns**: Constructed Plugin

| Param | Type                                      | Description                              |
| ----- | ----------------------------------------- | ---------------------------------------- |
| data  | <code>string</code> \| <code>array</code> | String or object representing the plugin |
