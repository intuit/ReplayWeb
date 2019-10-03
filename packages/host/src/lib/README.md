## Functions

<dl>
<dt><a href="#startOrchestrator">startOrchestrator(port)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Finds if the orchestrator exists locally, and either starts it or
pulls the remote version from artifactory and starts it</p>
</dd>
<dt><a href="#getDirectoryContents">getDirectoryContents(filePath)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Gets the contents of a directory, ommitting dot files/dot directories</p>
</dd>
<dt><a href="#makeDirectory">makeDirectory(filePath)</a> ⇒ <code>Promise</code></dt>
<dd><p>Create a given directory if it does not exist</p>
</dd>
<dt><a href="#readFile">readFile(filePath)</a> ⇒ <code>Object</code></dt>
<dd><p>Gets the contents of a file and parses the JSON</p>
</dd>
<dt><a href="#readFiles">readFiles(filePaths)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Read the contents of multiple files</p>
</dd>
<dt><a href="#saveFile">saveFile(folder, fileName, data)</a> ⇒ <code>Object</code></dt>
<dd><p>Write the provided data to a file</p>
</dd>
<dt><a href="#deleteFile">deleteFile(folder, fileName)</a></dt>
<dd><p>Delete the specified file from the filesystem</p>
</dd>
<dt><a href="#getCurrentVersion">getCurrentVersion()</a> ⇒ <code>string</code></dt>
<dd><p>Gets the current version of the repo</p>
</dd>
<dt><a href="#fetchChanges">fetchChanges()</a> ⇒ <code>string</code></dt>
<dd><p>Fetches changes from the remote</p>
</dd>
<dt><a href="#fetchTags">fetchTags()</a> ⇒ <code>Promise.&lt;Array&gt;</code></dt>
<dd><p>Gets the tags for the repo</p>
</dd>
<dt><a href="#checkoutTag">checkoutTag()</a> ⇒ <code>string</code></dt>
<dd><p>Checks out the provided tag</p>
</dd>
<dt><a href="#switchToTag">switchToTag()</a> ⇒ <code>string</code></dt>
<dd><p>Switches to the specified tag if available</p>
</dd>
<dt><a href="#messageHandler">messageHandler(msg, push, done)</a></dt>
<dd><p>Function to be used with <code>chrome-native-messaging</code> Transformer</p>
</dd>
<dt><a href="#whoami">whoami()</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Executes the <code>whoami</code> bash command in the host environment</p>
</dd>
<dt><a href="#checkExecutable">checkExecutable(executable)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Uses <code>which</code> to see if the provided executable is installed on the host</p>
</dd>
<dt><a href="#buildPackage">buildPackage(dir)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Changes directory to the provided path and builds with npm</p>
</dd>
</dl>

<a name="startOrchestrator"></a>

## startOrchestrator(port) ⇒ <code>Promise.&lt;Object&gt;</code>
Finds if the orchestrator exists locally, and either starts it or
pulls the remote version from artifactory and starts it

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Information about the running container  

| Param | Type | Description |
| --- | --- | --- |
| port | <code>number</code> | The port to pass on to the orchestrator to listen on |

<a name="getDirectoryContents"></a>

## getDirectoryContents(filePath) ⇒ <code>Array.&lt;Object&gt;</code>
Gets the contents of a directory, ommitting dot files/dot directories

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - - The contents of the directory  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | The directory to get contents for |

<a name="makeDirectory"></a>

## makeDirectory(filePath) ⇒ <code>Promise</code>
Create a given directory if it does not exist

**Kind**: global function  
**Returns**: <code>Promise</code> - - A promise that resolves on success  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | The directory to create |

<a name="readFile"></a>

## readFile(filePath) ⇒ <code>Object</code>
Gets the contents of a file and parses the JSON

**Kind**: global function  
**Returns**: <code>Object</code> - - An object containing the parsed JSON data and the filename  
**Throws**:

- <code>SyntaxError</code> - Thrown if provided filepath is not a JSON file


| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | The path to the JSON file to read |

<a name="readFiles"></a>

## readFiles(filePaths) ⇒ <code>Array.&lt;Object&gt;</code>
Read the contents of multiple files

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - - Array containing parsed JSON  
**Throws**:

- <code>SyntaxError</code> - Thrown if provided filepath is not a JSON file


| Param | Type | Description |
| --- | --- | --- |
| filePaths | <code>Array.&lt;string&gt;</code> | The file paths to read data for |

<a name="saveFile"></a>

## saveFile(folder, fileName, data) ⇒ <code>Object</code>
Write the provided data to a file

**Kind**: global function  
**Returns**: <code>Object</code> - - Data about the resulting saved file  
**Throws**:

- <code>Error</code> - Thrown if there is a problem writing to the filesystem


| Param | Type | Description |
| --- | --- | --- |
| folder | <code>string</code> | The folder to write to |
| fileName | <code>string</code> | The name of the file to write out to |
| data | <code>Object</code> | Object to JSON.stringify as the contents of the file |

<a name="deleteFile"></a>

## deleteFile(folder, fileName)
Delete the specified file from the filesystem

**Kind**: global function  
**Throws**:

- <code>Error</code> - Thrown if there is a problem deleting from the filesystem


| Param | Type | Description |
| --- | --- | --- |
| folder | <code>string</code> | The folder the file is in |
| fileName | <code>string</code> | The name of the file to delete |

<a name="getCurrentVersion"></a>

## getCurrentVersion() ⇒ <code>string</code>
Gets the current version of the repo

**Kind**: global function  
**Returns**: <code>string</code> - - The version  
<a name="fetchChanges"></a>

## fetchChanges() ⇒ <code>string</code>
Fetches changes from the remote

**Kind**: global function  
**Returns**: <code>string</code> - - stdout from the git command  
<a name="fetchTags"></a>

## fetchTags() ⇒ <code>Promise.&lt;Array&gt;</code>
Gets the tags for the repo

**Kind**: global function  
**Returns**: <code>Promise.&lt;Array&gt;</code> - - An array of the available tags  
<a name="checkoutTag"></a>

## checkoutTag() ⇒ <code>string</code>
Checks out the provided tag

**Kind**: global function  
**Returns**: <code>string</code> - - stdout from the git command  
<a name="switchToTag"></a>

## switchToTag() ⇒ <code>string</code>
Switches to the specified tag if available

**Kind**: global function  
**Returns**: <code>string</code> - - The version  
**Throws**:

- <code>Error</code> - Thrown if the specified tag was not found

<a name="messageHandler"></a>

## messageHandler(msg, push, done)
Function to be used with `chrome-native-messaging` Transformer

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Object</code> | The message from chrome |
| push | <code>function</code> | Function provided by Transformer to push data to stdout |
| done | <code>function</code> | Function provided by Transformer to indicate that we're done handling the messsage |

<a name="whoami"></a>

## whoami() ⇒ <code>Promise.&lt;string&gt;</code>
Executes the `whoami` bash command in the host environment

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - - The username of the host  
<a name="checkExecutable"></a>

## checkExecutable(executable) ⇒ <code>Promise.&lt;string&gt;</code>
Uses `which` to see if the provided executable is installed on the host

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - - The output from `which`  

| Param | Type | Description |
| --- | --- | --- |
| executable | <code>string</code> | The executable to |

<a name="buildPackage"></a>

## buildPackage(dir) ⇒ <code>Promise.&lt;string&gt;</code>
Changes directory to the provided path and builds with npm

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - - The output of the build command  

| Param | Type | Description |
| --- | --- | --- |
| dir | <code>string</code> | The directory to build in |

