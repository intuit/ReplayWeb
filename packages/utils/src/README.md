## Constants

<dl>
<dt><a href="#replaceAllFields">replaceAllFields</a> ⇒ <code>Object</code></dt>
<dd><p>Performs replacements on all the fields in an object</p>
</dd>
<dt><a href="#convertStringToTemplate">convertStringToTemplate</a> ⇒</dt>
<dd><p>Used to translate a string that comes from config to a string template by using return a new function.</p>
</dd>
<dt><a href="#setLocalStorage">setLocalStorage</a></dt>
<dd><p>Function to set a value for a key in local storage</p>
</dd>
<dt><a href="#getLocalStorage">getLocalStorage</a></dt>
<dd><p>Function to get a value for a key in local storage</p>
</dd>
<dt><a href="#setSessionStorage">setSessionStorage</a></dt>
<dd><p>Function to set a value for a key in session storage</p>
</dd>
<dt><a href="#getSessionStorage">getSessionStorage</a></dt>
<dd><p>Function to get a value for a key in session storage</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#doReplace">doReplace(string, context, defaults)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Performs string replacements to the given string</p>
</dd>
<dt><a href="#assignABTest">assignABTest(experiment, recipe, authId, prod)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Assigns the given authId to the given AB test</p>
</dd>
<dt><a href="#expandBlocks">expandBlocks(commands, blocks)</a> ⇒ <code>Array</code></dt>
<dd><p>Replaces <code>runBlock</code> commands with their contents</p>
</dd>
<dt><a href="#domText">domText(el)</a> ⇒ <code>string</code></dt>
<dd><p>Gets the text for a given DOM element</p>
</dd>
<dt><a href="#xpath">xpath(dom, cur, list, ignorePatterns)</a> ⇒ <code>string</code></dt>
<dd><p>Gets the xpath for the given DOM element</p>
</dd>
<dt><a href="#getLocator">getLocator(el, withAllOptions, ignorePatterns)</a> ⇒ <code>string</code> | <code>Object</code></dt>
<dd><p>Gets the locator for a given DOM element</p>
</dd>
<dt><a href="#log">log(params, host)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Logs a message to splunk</p>
</dd>
<dt><a href="#regExpMatch">regExpMatch(regex, text)</a> ⇒ <code>string</code></dt>
<dd><p>Retrieves the string match when matching a string against a regular expression.</p>
</dd>
</dl>

<a name="replaceAllFields"></a>

## replaceAllFields ⇒ <code>Object</code>
Performs replacements on all the fields in an object

**Kind**: global constant  
**Returns**: <code>Object</code> - - A copy of the original object fields with the values replaced  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object to perform replacements on |
| context | <code>Object</code> | The context to replace with |

<a name="convertStringToTemplate"></a>

## convertStringToTemplate ⇒
Used to translate a string that comes from config to a string template by using return a new function.

**Kind**: global constant  
**Returns**: Function that returns the parsed string token  

| Param |
| --- |
| params | 
| stringToken | 

<a name="setLocalStorage"></a>

## setLocalStorage
Function to set a value for a key in local storage

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key to set the value for |
| value | <code>string</code> | The value to set for the key |

<a name="getLocalStorage"></a>

## getLocalStorage
Function to get a value for a key in local storage

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key to get the value for |

<a name="setSessionStorage"></a>

## setSessionStorage
Function to set a value for a key in session storage

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key to set the value for |
| value | <code>string</code> | The value to set for the key |

<a name="getSessionStorage"></a>

## getSessionStorage
Function to get a value for a key in session storage

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key to get the value for |

<a name="doReplace"></a>

## doReplace(string, context, defaults) ⇒ <code>Promise.&lt;string&gt;</code>
Performs string replacements to the given string

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - - Returns a promise that resolves to the resulting string  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | The string to perform replacements on |
| context | <code>Object</code> | An object for synchronous replacements |
| defaults | <code>Object</code> | An object for asynchronous replacements, mostly just for dependency injection, should probably not be overridden |

<a name="assignABTest"></a>

## assignABTest(experiment, recipe, authId, prod) ⇒ <code>Promise.&lt;Object&gt;</code>
Assigns the given authId to the given AB test

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Returns a promise that resolves to the wasabi response  

| Param | Type | Description |
| --- | --- | --- |
| experiment | <code>string</code> | The experiment to assign to |
| recipe | <code>string</code> | The recipe to assign to |
| authId | <code>number</code> | The authId to assign the AB test to |
| prod | <code>boolean</code> | True for prod wasabi, false for e2e wasabi |

<a name="expandBlocks"></a>

## expandBlocks(commands, blocks) ⇒ <code>Array</code>
Replaces `runBlock` commands with their contents

**Kind**: global function  
**Returns**: <code>Array</code> - - The commands with the blocks replaced with their contents  

| Param | Type | Description |
| --- | --- | --- |
| commands | <code>Array</code> | The array of commands containing `runBlock` commands |
| blocks | <code>Array</code> | The blocks associated with the commands |

<a name="domText"></a>

## domText(el) ⇒ <code>string</code>
Gets the text for a given DOM element

**Kind**: global function  
**Returns**: <code>string</code> - - The text from the element  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Object</code> | The DOM element to extract text from |

<a name="xpath"></a>

## xpath(dom, cur, list, ignorePatterns) ⇒ <code>string</code>
Gets the xpath for the given DOM element

**Kind**: global function  
**Returns**: <code>string</code> - - The xpath for the given element  

| Param | Type | Description |
| --- | --- | --- |
| dom | <code>string</code> | The dom element to get the xpath for |
| cur | <code>string</code> | The current dom element |
| list | <code>Array</code> | The current list of elements in the xpath |
| ignorePatterns | <code>Array.&lt;string&gt;</code> | An array of regular expression strings to use for ignoring generated identifiers when recording. Does not ignore patterns across several nodes |

<a name="getLocator"></a>

## getLocator(el, withAllOptions, ignorePatterns) ⇒ <code>string</code> \| <code>Object</code>
Gets the locator for a given DOM element

**Kind**: global function  
**Returns**: <code>string</code> \| <code>Object</code> - - Returns the locator or an object with all locator options  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Object</code> | The DOM element to get a locator for |
| withAllOptions | <code>boolean</code> | whether or not to return all the locator options |
| ignorePatterns | <code>Array.&lt;string&gt;</code> | An array of regular expression strings to use for ignoring generated identifiers when recording |

<a name="log"></a>

## log(params, host) ⇒ <code>Promise.&lt;Object&gt;</code>
Logs a message to splunk

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Returns a promise that resolves to the splunk response  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | The parameters for the splunk message |
| host | <code>string</code> | the splunk endpoint to log to (mostly for dependency injection) |

<a name="regExpMatch"></a>

## regExpMatch(regex, text) ⇒ <code>string</code>
Retrieves the string match when matching a string against a regular expression.

**Kind**: global function  
**Returns**: <code>string</code> - - Return a string that contains a matching string from text against regular expression  
**Throws**:

- <code>Error</code> - Thrown if match was not found


| Param | Type | Description |
| --- | --- | --- |
| regex | <code>value</code> | Pass Regular Expresion |
| text | <code>text</code> | The dom get Text by the Locator |

