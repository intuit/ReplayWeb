## Design

1. When the popup window is launched, `src/index.js` sends a Redux thunk action to load the plugin configuration from the user's disk at `~/.replay/plugins_config.json`. The config defines a list of urls.
1. For each URL, the file at that location is downloaded to a string and then parsed into JavaScript through the `vm` module. Each parse has a `global.reigster` function which takes the plugin object. These plugins are loaded into an object of `<plugin_name>: <plugin JS>`, which is persisted in the Redux store.
1. This plugin object is used to extend the command dropdowns and command documentation popup.
1. When the user runs a test, an object of `<plugin_name>: <plugin_as_string>` is sent via Chrome extension messaging to the content script (along with the other data like the first command to run).
1. When the content script receives this initial test run payload, it:
    1. persists the data to `localStorage`
    1. runs the command - if the command isn't in the list of built-ins, then the plugins are parsed into JS and the command run is reattempted
1. For each subsequent command, the content script will attempt to run the command against the built-ins first and fall back to parsing the plugins from `localStorage` if the command wasn't recognized.

## Rationale

There are a number of drawbacks to needing complex (non-serializeable) data in the popup window and the content script:

* Complex data cannot be passed back and forth between the popup and the content script (though, luckily, serializeable data _can_)
* Data is not persisted between times that Chrome loads the content script into the window
* Complex data cannot be persisted to sessionStorage/localStorage or Chrome's local/sync storage
