# Dysis Client
### The extension for order in general and natural justice in online communities.

This is the frontend of the Dysis App and has been implemented as a Google Chrome Extension with Manifest Version 3.

## Purpose

The client is responsible for enriching user profiles in supported online communities (such as reddit). It injects code into the respective pages to append user profiles with certain information which it gets from a server. Furthermore, optionally the usage time is tracked for academic purposes.

## Getting Started

1. `npm i` to install dependencies
2. `npm run dev` to start running the fast development mode Webpack build process that bundle files into the `dist` folder
3. `npm i --save-dev <package_name>` to install new packages

## Loading The Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle on `Developer mode` in the top right corner
3. Click `Load unpacked`
4. Select the entire `dist` folder

## Production Build

1. `npm run build` to generate a minimized production build in the `dist` folder
2. ZIP the entire `dist` folder (e.g. `dist.zip`)
3. Publish the ZIP file on the Chrome Web Store Developer Dashboard

## Default Notes

- Folders get flattened, static references to images from HTML do not need to be relative (i.e. `icon.png` instead of `../static/icon.png`)
- Importing local ts/tsx/css files should be relative, since Webpack will build a dependancy graph using these paths
- Update the manifest file as per usual for chrome related permissions, references to files in here should also be flattened and not be relative

## Configurations

Multiple configurations can be set in the file `DysisConfig.js` such as (excerpt):
- The `baseUrl` for the backend server
- The `defaultMaxIdleTimeInSeconds` which defines after how many seconds a user is assumed to be idle (and usage time is not further increased)
- The `defaultSyncIntervalInMinutes` which defines the interval in minutes to sync the usage time to the server
- Numerous settings on how often and after how many seconds to retry after a request failed
- Numerous frontend variables such as the `maxNumberOfDisplayedInterests` which defines how many interest tags 

Copyright (c) 2022 Simon Höferlin