// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import * as ActiveStorage from "@rails/activestorage"
import "channels"
import 'bootstrap'
import 'jquery'
global.fetch = require('node-fetch');
const { AbortController } = require('node-fetch');
global.AbortController = AbortController;

Rails.start()
ActiveStorage.start()

// Only run HMR in development
if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept();
  }
}

// ... rest of your JavaScript and React setup
