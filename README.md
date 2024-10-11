# ElectronJS Tutorial via Notes App

Make boilerplate code for electron app

```
yarn create @quick-start/electron
```

## Processes in Electron

If you look at the src folder, you will find that there are three processes in Electron: main, renderer and preload. Main process is the node part of the application and is the entry point. It performs previlaged tasks like reading a file and creating a file. Renderer process if the browser part of the application and is spawned by main process. It renders the UI of the application. Code ran inside a renderer process is exactly the same as code ran in a browser, so it should behave according to web standards and use the same tools and paradigms that you use on the web, outside of Electron.

Learn more about this [here](https://www.jsgarden.co/blog/electron-process-model).

## Main Process

This process is responsible for starting the application, creating the browser window and managing the application lifecycle. It is the entry point of the application and is responsible for creating the renderer process. If you go to the index.ts file in main subfolder, you will find the codes for spawing the browser window.

Do note that we have made sandbox attribute and contextIsolation to be true in the webPreferences object. This is to ensure that the renderer process is isolated from the main process and the preload script is used to expose the APIs to the renderer process.

Learn more about contextIsolation [here](https://www.electronjs.org/docs/latest/api/browser-window)

## Using the file system for the app.

To store the files in the system, we will use the node.js file system module. Specifically, we will use fs-extra that has additional functionalities that are not present in the original fs. Since it can only be used in the node js application, we will have to set it up in the main process. In particuar, we will put the functions that will interact with the file system in the lib subdirectory inside the main folder.
