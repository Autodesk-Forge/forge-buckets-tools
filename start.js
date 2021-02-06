/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

'use strict';

var expressApp = require('./server/server');

const { app, BrowserWindow } = require('electron');
app.on('ready', function() {
  let mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    },
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: true,
  });
  mainWindow.loadURL('http://localhost:3000/');
  mainWindow.focus();
});

// start server
var server = expressApp.listen(expressApp.get('port'), function () {
  console.log('Starting at ' + (new Date()).toString());
  console.log('Server listening on port ' + server.address().port);
});


