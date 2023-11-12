/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
var Cancel = __webpack_require__(/*! ../cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || defaults.transitional;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new Cancel('canceled') : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
axios.VERSION = (__webpack_require__(/*! ./env/data */ "./node_modules/axios/lib/env/data.js").version);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
var Cancel = __webpack_require__(/*! ../cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new Cancel('canceled');
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/env/data.js ***!
  \********************************************/
/***/ ((module) => {

module.exports = {
  "version": "0.24.0"
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var VERSION = (__webpack_require__(/*! ../env/data */ "./node_modules/axios/lib/env/data.js").version);

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./node_modules/clone/clone.js":
/*!*************************************!*\
  !*** ./node_modules/clone/clone.js ***!
  \*************************************/
/***/ ((module) => {

var clone = (function() {
'use strict';

function _instanceof(obj, type) {
  return type != null && obj instanceof type;
}

var nativeMap;
try {
  nativeMap = Map;
} catch(_) {
  // maybe a reference error because no `Map`. Give it a dummy value that no
  // value will ever be an instanceof.
  nativeMap = function() {};
}

var nativeSet;
try {
  nativeSet = Set;
} catch(_) {
  nativeSet = function() {};
}

var nativePromise;
try {
  nativePromise = Promise;
} catch(_) {
  nativePromise = function() {};
}

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
 * @param `includeNonEnumerable` - set to true if the non-enumerable properties
 *    should be cloned as well. Non-enumerable properties on the prototype
 *    chain will be ignored. (optional - false by default)
*/
function clone(parent, circular, depth, prototype, includeNonEnumerable) {
  if (typeof circular === 'object') {
    depth = circular.depth;
    prototype = circular.prototype;
    includeNonEnumerable = circular.includeNonEnumerable;
    circular = circular.circular;
  }
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined')
    circular = true;

  if (typeof depth == 'undefined')
    depth = Infinity;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      return null;

    if (depth === 0)
      return parent;

    var child;
    var proto;
    if (typeof parent != 'object') {
      return parent;
    }

    if (_instanceof(parent, nativeMap)) {
      child = new nativeMap();
    } else if (_instanceof(parent, nativeSet)) {
      child = new nativeSet();
    } else if (_instanceof(parent, nativePromise)) {
      child = new nativePromise(function (resolve, reject) {
        parent.then(function(value) {
          resolve(_clone(value, depth - 1));
        }, function(err) {
          reject(_clone(err, depth - 1));
        });
      });
    } else if (clone.__isArray(parent)) {
      child = [];
    } else if (clone.__isRegExp(parent)) {
      child = new RegExp(parent.source, __getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (clone.__isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      if (Buffer.allocUnsafe) {
        // Node.js >= 4.5.0
        child = Buffer.allocUnsafe(parent.length);
      } else {
        // Older Node.js versions
        child = new Buffer(parent.length);
      }
      parent.copy(child);
      return child;
    } else if (_instanceof(parent, Error)) {
      child = Object.create(parent);
    } else {
      if (typeof prototype == 'undefined') {
        proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
      }
      else {
        child = Object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    if (_instanceof(parent, nativeMap)) {
      parent.forEach(function(value, key) {
        var keyChild = _clone(key, depth - 1);
        var valueChild = _clone(value, depth - 1);
        child.set(keyChild, valueChild);
      });
    }
    if (_instanceof(parent, nativeSet)) {
      parent.forEach(function(value) {
        var entryChild = _clone(value, depth - 1);
        child.add(entryChild);
      });
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = Object.getOwnPropertyDescriptor(proto, i);
      }

      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(parent);
      for (var i = 0; i < symbols.length; i++) {
        // Don't need to worry about cloning a symbol because it is a primitive,
        // like a number or string.
        var symbol = symbols[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
        if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
          continue;
        }
        child[symbol] = _clone(parent[symbol], depth - 1);
        if (!descriptor.enumerable) {
          Object.defineProperty(child, symbol, {
            enumerable: false
          });
        }
      }
    }

    if (includeNonEnumerable) {
      var allPropertyNames = Object.getOwnPropertyNames(parent);
      for (var i = 0; i < allPropertyNames.length; i++) {
        var propertyName = allPropertyNames[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
        if (descriptor && descriptor.enumerable) {
          continue;
        }
        child[propertyName] = _clone(parent[propertyName], depth - 1);
        Object.defineProperty(child, propertyName, {
          enumerable: false
        });
      }
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function clonePrototype(parent) {
  if (parent === null)
    return null;

  var c = function () {};
  c.prototype = parent;
  return new c();
};

// private utility functions

function __objToStr(o) {
  return Object.prototype.toString.call(o);
}
clone.__objToStr = __objToStr;

function __isDate(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Date]';
}
clone.__isDate = __isDate;

function __isArray(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Array]';
}
clone.__isArray = __isArray;

function __isRegExp(o) {
  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
}
clone.__isRegExp = __isRegExp;

function __getRegExpFlags(re) {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
}
clone.__getRegExpFlags = __getRegExpFlags;

return clone;
})();

if ( true && module.exports) {
  module.exports = clone;
}


/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./node_modules/node-cache/index.js":
/*!******************************************!*\
  !*** ./node_modules/node-cache/index.js ***!
  \******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*
 * node-cache 5.1.2 ( 2020-07-01 )
 * https://github.com/node-cache/node-cache
 *
 * Released under the MIT license
 * https://github.com/node-cache/node-cache/blob/master/LICENSE
 *
 * Maintained by  (  )
*/
(function() {
  var exports;

  exports = module.exports = __webpack_require__(/*! ./lib/node_cache */ "./node_modules/node-cache/lib/node_cache.js");

  exports.version = '5.1.2';

}).call(this);


/***/ }),

/***/ "./node_modules/node-cache/lib/node_cache.js":
/*!***************************************************!*\
  !*** ./node_modules/node-cache/lib/node_cache.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*
 * node-cache 5.1.2 ( 2020-07-01 )
 * https://github.com/node-cache/node-cache
 *
 * Released under the MIT license
 * https://github.com/node-cache/node-cache/blob/master/LICENSE
 *
 * Maintained by  (  )
*/
(function() {
  var EventEmitter, NodeCache, clone,
    splice = [].splice,
    boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } },
    indexOf = [].indexOf;

  clone = __webpack_require__(/*! clone */ "./node_modules/clone/clone.js");

  EventEmitter = (__webpack_require__(/*! events */ "./node_modules/events/events.js").EventEmitter);

  // generate superclass
  module.exports = NodeCache = (function() {
    class NodeCache extends EventEmitter {
      constructor(options = {}) {
        super();
        // ## get

        // get a cached key and change the stats

        // **Parameters:**

        // * `key` ( String | Number ): cache key

        // **Example:**

        //	myCache.get "myKey", ( err, val )

        this.get = this.get.bind(this);
        // ## mget

        // get multiple cached keys at once and change the stats

        // **Parameters:**

        // * `keys` ( String|Number[] ): an array of keys

        // **Example:**

        //	myCache.mget [ "foo", "bar" ]

        this.mget = this.mget.bind(this);
        // ## set

        // set a cached key and change the stats

        // **Parameters:**

        // * `key` ( String | Number ): cache key
        // * `value` ( Any ): A element to cache. If the option `option.forceString` is `true` the module trys to translate it to a serialized JSON
        // * `[ ttl ]` ( Number | String ): ( optional ) The time to live in seconds.

        // **Example:**

        //	myCache.set "myKey", "my_String Value"

        //	myCache.set "myKey", "my_String Value", 10

        this.set = this.set.bind(this);
        
        // ## mset

        // set multiple keys at once

        // **Parameters:**

        // * `keyValueSet` ( Object[] ): an array of object which includes key,value and ttl

        // **Example:**

        //	myCache.mset(
        //		[
        //			{
        //				key: "myKey",
        //				val: "myValue",
        //				ttl: [ttl in seconds]
        //			}
        //		])

        this.mset = this.mset.bind(this);
        // ## del

        // remove keys

        // **Parameters:**

        // * `keys` ( String | Number | String|Number[] ): cache key to delete or a array of cache keys

        // **Return**

        // ( Number ): Number of deleted keys

        // **Example:**

        //	myCache.del( "myKey" )

        this.del = this.del.bind(this);
        // ## take

        // get the cached value and remove the key from the cache.
        // Equivalent to calling `get(key)` + `del(key)`.
        // Useful for implementing `single use` mechanism such as OTP, where once a value is read it will become obsolete.

        // **Parameters:**

        // * `key` ( String | Number ): cache key

        // **Example:**

        //	myCache.take "myKey", ( err, val )

        this.take = this.take.bind(this);
        // ## ttl

        // reset or redefine the ttl of a key. `ttl` = 0 means infinite lifetime.
        // If `ttl` is not passed the default ttl is used.
        // If `ttl` < 0 the key will be deleted.

        // **Parameters:**

        // * `key` ( String | Number ): cache key to reset the ttl value
        // * `ttl` ( Number ): ( optional -> options.stdTTL || 0 ) The time to live in seconds

        // **Return**

        // ( Boolen ): key found and ttl set

        // **Example:**

        //	myCache.ttl( "myKey" ) // will set ttl to default ttl

        //	myCache.ttl( "myKey", 1000 )

        this.ttl = this.ttl.bind(this);
        // ## getTtl

        // receive the ttl of a key.

        // **Parameters:**

        // * `key` ( String | Number ): cache key to check the ttl value

        // **Return**

        // ( Number|undefined ): The timestamp in ms when the key will expire, 0 if it will never expire or undefined if it not exists

        // **Example:**

        //	myCache.getTtl( "myKey" )

        this.getTtl = this.getTtl.bind(this);
        // ## keys

        // list all keys within this cache

        // **Return**

        // ( Array ): An array of all keys

        // **Example:**

        //     _keys = myCache.keys()

        //     # [ "foo", "bar", "fizz", "buzz", "anotherKeys" ]

        this.keys = this.keys.bind(this);
        // ## has

        // Check if a key is cached

        // **Parameters:**

        // * `key` ( String | Number ): cache key to check the ttl value

        // **Return**

        // ( Boolean ): A boolean that indicates if the key is cached

        // **Example:**

        //     _exists = myCache.has('myKey')

        //     # true

        this.has = this.has.bind(this);
        // ## getStats

        // get the stats

        // **Parameters:**

        // -

        // **Return**

        // ( Object ): Stats data

        // **Example:**

        //     myCache.getStats()
        //     # {
        //     # hits: 0,
        //     # misses: 0,
        //     # keys: 0,
        //     # ksize: 0,
        //     # vsize: 0
        //     # }

        this.getStats = this.getStats.bind(this);
        // ## flushAll

        // flush the whole data and reset the stats

        // **Example:**

        //     myCache.flushAll()

        //     myCache.getStats()
        //     # {
        //     # hits: 0,
        //     # misses: 0,
        //     # keys: 0,
        //     # ksize: 0,
        //     # vsize: 0
        //     # }

        this.flushAll = this.flushAll.bind(this);
        
        // ## flushStats

        // flush the stats and reset all counters to 0

        // **Example:**

        //     myCache.flushStats()

        //     myCache.getStats()
        //     # {
        //     # hits: 0,
        //     # misses: 0,
        //     # keys: 0,
        //     # ksize: 0,
        //     # vsize: 0
        //     # }

        this.flushStats = this.flushStats.bind(this);
        // ## close

        // This will clear the interval timeout which is set on checkperiod option.

        // **Example:**

        //     myCache.close()

        this.close = this.close.bind(this);
        // ## _checkData

        // internal housekeeping method.
        // Check all the cached data and delete the invalid values
        this._checkData = this._checkData.bind(this);
        // ## _check

        // internal method the check the value. If it's not valid any more delete it
        this._check = this._check.bind(this);
        // ## _isInvalidKey

        // internal method to check if the type of a key is either `number` or `string`
        this._isInvalidKey = this._isInvalidKey.bind(this);
        // ## _wrap

        // internal method to wrap a value in an object with some metadata
        this._wrap = this._wrap.bind(this);
        // ## _getValLength

        // internal method to calculate the value length
        this._getValLength = this._getValLength.bind(this);
        // ## _error

        // internal method to handle an error message
        this._error = this._error.bind(this);
        // ## _initErrors

        // internal method to generate error message templates
        this._initErrors = this._initErrors.bind(this);
        this.options = options;
        this._initErrors();
        // container for cached data
        this.data = {};
        // module options
        this.options = Object.assign({
          // convert all elements to string
          forceString: false,
          // used standard size for calculating value size
          objectValueSize: 80,
          promiseValueSize: 80,
          arrayValueSize: 40,
          // standard time to live in seconds. 0 = infinity;
          stdTTL: 0,
          // time in seconds to check all data and delete expired keys
          checkperiod: 600,
          // en/disable cloning of variables. If `true` you'll get a copy of the cached variable. If `false` you'll save and get just the reference
          useClones: true,
          // whether values should be deleted automatically at expiration
          deleteOnExpire: true,
          // enable legacy callbacks
          enableLegacyCallbacks: false,
          // max amount of keys that are being stored
          maxKeys: -1
        }, this.options);
        // generate functions with callbacks (legacy)
        if (this.options.enableLegacyCallbacks) {
          console.warn("WARNING! node-cache legacy callback support will drop in v6.x");
          ["get", "mget", "set", "del", "ttl", "getTtl", "keys", "has"].forEach((methodKey) => {
            var oldMethod;
            // reference real function
            oldMethod = this[methodKey];
            this[methodKey] = function(...args) {
              var cb, err, ref, res;
              ref = args, [...args] = ref, [cb] = splice.call(args, -1);
              // return a callback if cb is defined and a function
              if (typeof cb === "function") {
                try {
                  res = oldMethod(...args);
                  cb(null, res);
                } catch (error1) {
                  err = error1;
                  cb(err);
                }
              } else {
                return oldMethod(...args, cb);
              }
            };
          });
        }
        // statistics container
        this.stats = {
          hits: 0,
          misses: 0,
          keys: 0,
          ksize: 0,
          vsize: 0
        };
        // pre allocate valid keytypes array
        this.validKeyTypes = ["string", "number"];
        // initalize checking period
        this._checkData();
        return;
      }

      get(key) {
        var _ret, err;
        boundMethodCheck(this, NodeCache);
        // handle invalid key types
        if ((err = this._isInvalidKey(key)) != null) {
          throw err;
        }
        // get data and incremet stats
        if ((this.data[key] != null) && this._check(key, this.data[key])) {
          this.stats.hits++;
          _ret = this._unwrap(this.data[key]);
          // return data
          return _ret;
        } else {
          // if not found return undefined
          this.stats.misses++;
          return void 0;
        }
      }

      mget(keys) {
        var _err, err, i, key, len, oRet;
        boundMethodCheck(this, NodeCache);
        // convert a string to an array of one key
        if (!Array.isArray(keys)) {
          _err = this._error("EKEYSTYPE");
          throw _err;
        }
        // define return
        oRet = {};
        for (i = 0, len = keys.length; i < len; i++) {
          key = keys[i];
          // handle invalid key types
          if ((err = this._isInvalidKey(key)) != null) {
            throw err;
          }
          // get data and increment stats
          if ((this.data[key] != null) && this._check(key, this.data[key])) {
            this.stats.hits++;
            oRet[key] = this._unwrap(this.data[key]);
          } else {
            // if not found return a error
            this.stats.misses++;
          }
        }
        // return all found keys
        return oRet;
      }

      set(key, value, ttl) {
        var _err, err, existent;
        boundMethodCheck(this, NodeCache);
        // check if cache is overflowing
        if (this.options.maxKeys > -1 && this.stats.keys >= this.options.maxKeys) {
          _err = this._error("ECACHEFULL");
          throw _err;
        }
        // force the data to string
        if (this.options.forceString && !typeof value === "string") {
          value = JSON.stringify(value);
        }
        // set default ttl if not passed
        if (ttl == null) {
          ttl = this.options.stdTTL;
        }
        // handle invalid key types
        if ((err = this._isInvalidKey(key)) != null) {
          throw err;
        }
        // internal helper variables
        existent = false;
        // remove existing data from stats
        if (this.data[key]) {
          existent = true;
          this.stats.vsize -= this._getValLength(this._unwrap(this.data[key], false));
        }
        // set the value
        this.data[key] = this._wrap(value, ttl);
        this.stats.vsize += this._getValLength(value);
        // only add the keys and key-size if the key is new
        if (!existent) {
          this.stats.ksize += this._getKeyLength(key);
          this.stats.keys++;
        }
        this.emit("set", key, value);
        // return true
        return true;
      }

      mset(keyValueSet) {
        var _err, err, i, j, key, keyValuePair, len, len1, ttl, val;
        boundMethodCheck(this, NodeCache);
        // check if cache is overflowing
        if (this.options.maxKeys > -1 && this.stats.keys + keyValueSet.length >= this.options.maxKeys) {
          _err = this._error("ECACHEFULL");
          throw _err;
        }

// loop over keyValueSet to validate key and ttl
        for (i = 0, len = keyValueSet.length; i < len; i++) {
          keyValuePair = keyValueSet[i];
          ({key, val, ttl} = keyValuePair);
          // check if there is ttl and it's a number
          if (ttl && typeof ttl !== "number") {
            _err = this._error("ETTLTYPE");
            throw _err;
          }
          // handle invalid key types
          if ((err = this._isInvalidKey(key)) != null) {
            throw err;
          }
        }
        for (j = 0, len1 = keyValueSet.length; j < len1; j++) {
          keyValuePair = keyValueSet[j];
          ({key, val, ttl} = keyValuePair);
          this.set(key, val, ttl);
        }
        return true;
      }

      del(keys) {
        var delCount, err, i, key, len, oldVal;
        boundMethodCheck(this, NodeCache);
        // convert keys to an array of itself
        if (!Array.isArray(keys)) {
          keys = [keys];
        }
        delCount = 0;
        for (i = 0, len = keys.length; i < len; i++) {
          key = keys[i];
          // handle invalid key types
          if ((err = this._isInvalidKey(key)) != null) {
            throw err;
          }
          // only delete if existent
          if (this.data[key] != null) {
            // calc the stats
            this.stats.vsize -= this._getValLength(this._unwrap(this.data[key], false));
            this.stats.ksize -= this._getKeyLength(key);
            this.stats.keys--;
            delCount++;
            // delete the value
            oldVal = this.data[key];
            delete this.data[key];
            // return true
            this.emit("del", key, oldVal.v);
          }
        }
        return delCount;
      }

      take(key) {
        var _ret;
        boundMethodCheck(this, NodeCache);
        _ret = this.get(key);
        if ((_ret != null)) {
          this.del(key);
        }
        return _ret;
      }

      ttl(key, ttl) {
        var err;
        boundMethodCheck(this, NodeCache);
        ttl || (ttl = this.options.stdTTL);
        if (!key) {
          return false;
        }
        // handle invalid key types
        if ((err = this._isInvalidKey(key)) != null) {
          throw err;
        }
        // check for existent data and update the ttl value
        if ((this.data[key] != null) && this._check(key, this.data[key])) {
          // if ttl < 0 delete the key. otherwise reset the value
          if (ttl >= 0) {
            this.data[key] = this._wrap(this.data[key].v, ttl, false);
          } else {
            this.del(key);
          }
          return true;
        } else {
          // return false if key has not been found
          return false;
        }
      }

      getTtl(key) {
        var _ttl, err;
        boundMethodCheck(this, NodeCache);
        if (!key) {
          return void 0;
        }
        // handle invalid key types
        if ((err = this._isInvalidKey(key)) != null) {
          throw err;
        }
        // check for existant data and update the ttl value
        if ((this.data[key] != null) && this._check(key, this.data[key])) {
          _ttl = this.data[key].t;
          return _ttl;
        } else {
          // return undefined if key has not been found
          return void 0;
        }
      }

      keys() {
        var _keys;
        boundMethodCheck(this, NodeCache);
        _keys = Object.keys(this.data);
        return _keys;
      }

      has(key) {
        var _exists;
        boundMethodCheck(this, NodeCache);
        _exists = (this.data[key] != null) && this._check(key, this.data[key]);
        return _exists;
      }

      getStats() {
        boundMethodCheck(this, NodeCache);
        return this.stats;
      }

      flushAll(_startPeriod = true) {
        boundMethodCheck(this, NodeCache);
        // parameter just for testing

        // set data empty
        this.data = {};
        // reset stats
        this.stats = {
          hits: 0,
          misses: 0,
          keys: 0,
          ksize: 0,
          vsize: 0
        };
        // reset check period
        this._killCheckPeriod();
        this._checkData(_startPeriod);
        this.emit("flush");
      }

      flushStats() {
        boundMethodCheck(this, NodeCache);
        // reset stats
        this.stats = {
          hits: 0,
          misses: 0,
          keys: 0,
          ksize: 0,
          vsize: 0
        };
        this.emit("flush_stats");
      }

      close() {
        boundMethodCheck(this, NodeCache);
        this._killCheckPeriod();
      }

      _checkData(startPeriod = true) {
        var key, ref, value;
        boundMethodCheck(this, NodeCache);
        ref = this.data;
        // run the housekeeping method
        for (key in ref) {
          value = ref[key];
          this._check(key, value);
        }
        if (startPeriod && this.options.checkperiod > 0) {
          this.checkTimeout = setTimeout(this._checkData, this.options.checkperiod * 1000, startPeriod);
          if ((this.checkTimeout != null) && (this.checkTimeout.unref != null)) {
            this.checkTimeout.unref();
          }
        }
      }

      // ## _killCheckPeriod

      // stop the checkdata period. Only needed to abort the script in testing mode.
      _killCheckPeriod() {
        if (this.checkTimeout != null) {
          return clearTimeout(this.checkTimeout);
        }
      }

      _check(key, data) {
        var _retval;
        boundMethodCheck(this, NodeCache);
        _retval = true;
        // data is invalid if the ttl is too old and is not 0
        // console.log data.t < Date.now(), data.t, Date.now()
        if (data.t !== 0 && data.t < Date.now()) {
          if (this.options.deleteOnExpire) {
            _retval = false;
            this.del(key);
          }
          this.emit("expired", key, this._unwrap(data));
        }
        return _retval;
      }

      _isInvalidKey(key) {
        var ref;
        boundMethodCheck(this, NodeCache);
        if (ref = typeof key, indexOf.call(this.validKeyTypes, ref) < 0) {
          return this._error("EKEYTYPE", {
            type: typeof key
          });
        }
      }

      _wrap(value, ttl, asClone = true) {
        var livetime, now, oReturn, ttlMultiplicator;
        boundMethodCheck(this, NodeCache);
        if (!this.options.useClones) {
          asClone = false;
        }
        // define the time to live
        now = Date.now();
        livetime = 0;
        ttlMultiplicator = 1000;
        // use given ttl
        if (ttl === 0) {
          livetime = 0;
        } else if (ttl) {
          livetime = now + (ttl * ttlMultiplicator);
        } else {
          // use standard ttl
          if (this.options.stdTTL === 0) {
            livetime = this.options.stdTTL;
          } else {
            livetime = now + (this.options.stdTTL * ttlMultiplicator);
          }
        }
        // return the wrapped value
        return oReturn = {
          t: livetime,
          v: asClone ? clone(value) : value
        };
      }

      // ## _unwrap

      // internal method to extract get the value out of the wrapped value
      _unwrap(value, asClone = true) {
        if (!this.options.useClones) {
          asClone = false;
        }
        if (value.v != null) {
          if (asClone) {
            return clone(value.v);
          } else {
            return value.v;
          }
        }
        return null;
      }

      // ## _getKeyLength

      // internal method the calculate the key length
      _getKeyLength(key) {
        return key.toString().length;
      }

      _getValLength(value) {
        boundMethodCheck(this, NodeCache);
        if (typeof value === "string") {
          // if the value is a String get the real length
          return value.length;
        } else if (this.options.forceString) {
          // force string if it's defined and not passed
          return JSON.stringify(value).length;
        } else if (Array.isArray(value)) {
          // if the data is an Array multiply each element with a defined default length
          return this.options.arrayValueSize * value.length;
        } else if (typeof value === "number") {
          return 8;
        } else if (typeof (value != null ? value.then : void 0) === "function") {
          // if the data is a Promise, use defined default
          // (can't calculate actual/resolved value size synchronously)
          return this.options.promiseValueSize;
        } else if (typeof Buffer !== "undefined" && Buffer !== null ? Buffer.isBuffer(value) : void 0) {
          return value.length;
        } else if ((value != null) && typeof value === "object") {
          // if the data is an Object multiply each element with a defined default length
          return this.options.objectValueSize * Object.keys(value).length;
        } else if (typeof value === "boolean") {
          return 8;
        } else {
          // default fallback
          return 0;
        }
      }

      _error(type, data = {}) {
        var error;
        boundMethodCheck(this, NodeCache);
        // generate the error object
        error = new Error();
        error.name = type;
        error.errorcode = type;
        error.message = this.ERRORS[type] != null ? this.ERRORS[type](data) : "-";
        error.data = data;
        // return the error object
        return error;
      }

      _initErrors() {
        var _errMsg, _errT, ref;
        boundMethodCheck(this, NodeCache);
        this.ERRORS = {};
        ref = this._ERRORS;
        for (_errT in ref) {
          _errMsg = ref[_errT];
          this.ERRORS[_errT] = this.createErrorMessage(_errMsg);
        }
      }

      createErrorMessage(errMsg) {
        return function(args) {
          return errMsg.replace("__key", args.type);
        };
      }

    };

    NodeCache.prototype._ERRORS = {
      "ENOTFOUND": "Key `__key` not found",
      "ECACHEFULL": "Cache max keys amount exceeded",
      "EKEYTYPE": "The key argument has to be of type `string` or `number`. Found: `__key`",
      "EKEYSTYPE": "The keys argument has to be an array.",
      "ETTLTYPE": "The ttl argument has to be a number."
    };

    return NodeCache;

  }).call(this);

}).call(this);


/***/ }),

/***/ "?e4dd":
/*!********************!*\
  !*** os (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "./node_modules/aggregate-error/index.js":
/*!***********************************************!*\
  !*** ./node_modules/aggregate-error/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AggregateError)
/* harmony export */ });
/* harmony import */ var indent_string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! indent-string */ "./node_modules/indent-string/index.js");
/* harmony import */ var clean_stack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! clean-stack */ "./node_modules/clean-stack/index.js");



const cleanInternalStack = stack => stack.replace(/\s+at .*aggregate-error\/index.js:\d+:\d+\)?/g, '');

class AggregateError extends Error {
	#errors;

	name = 'AggregateError';

	constructor(errors) {
		if (!Array.isArray(errors)) {
			throw new TypeError(`Expected input to be an Array, got ${typeof errors}`);
		}

		errors = errors.map(error => {
			if (error instanceof Error) {
				return error;
			}

			if (error !== null && typeof error === 'object') {
				// Handle plain error objects with message property and/or possibly other metadata
				return Object.assign(new Error(error.message), error);
			}

			return new Error(error);
		});

		let message = errors
			.map(error => {
				// The `stack` property is not standardized, so we can't assume it exists
				return typeof error.stack === 'string' && error.stack.length > 0 ? cleanInternalStack((0,clean_stack__WEBPACK_IMPORTED_MODULE_1__["default"])(error.stack)) : String(error);
			})
			.join('\n');
		message = '\n' + (0,indent_string__WEBPACK_IMPORTED_MODULE_0__["default"])(message, 4);
		super(message);

		this.#errors = errors;
	}

	get errors() {
		return this.#errors.slice();
	}
}


/***/ }),

/***/ "./node_modules/clean-stack/index.js":
/*!*******************************************!*\
  !*** ./node_modules/clean-stack/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ cleanStack)
/* harmony export */ });
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! os */ "?e4dd");
/* harmony import */ var escape_string_regexp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! escape-string-regexp */ "./node_modules/escape-string-regexp/index.js");



const extractPathRegex = /\s+at.*[(\s](.*)\)?/;
const pathRegex = /^(?:(?:(?:node|node:[\w/]+|(?:(?:node:)?internal\/[\w/]*|.*node_modules\/(?:babel-polyfill|pirates)\/.*)?\w+)(?:\.js)?:\d+:\d+)|native)/;
const homeDir = typeof os__WEBPACK_IMPORTED_MODULE_0__.homedir === 'undefined' ? '' : os__WEBPACK_IMPORTED_MODULE_0__.homedir().replace(/\\/g, '/');

function cleanStack(stack, {pretty = false, basePath} = {}) {
	const basePathRegex = basePath && new RegExp(`(at | \\()${(0,escape_string_regexp__WEBPACK_IMPORTED_MODULE_1__["default"])(basePath.replace(/\\/g, '/'))}`, 'g');

	if (typeof stack !== 'string') {
		return undefined;
	}

	return stack.replace(/\\/g, '/')
		.split('\n')
		.filter(line => {
			const pathMatches = line.match(extractPathRegex);
			if (pathMatches === null || !pathMatches[1]) {
				return true;
			}

			const match = pathMatches[1];

			// Electron
			if (
				match.includes('.app/Contents/Resources/electron.asar') ||
				match.includes('.app/Contents/Resources/default_app.asar') ||
				match.includes('node_modules/electron/dist/resources/electron.asar') ||
				match.includes('node_modules/electron/dist/resources/default_app.asar')
			) {
				return false;
			}

			return !pathRegex.test(match);
		})
		.filter(line => line.trim() !== '')
		.map(line => {
			if (basePathRegex) {
				line = line.replace(basePathRegex, '$1');
			}

			if (pretty) {
				line = line.replace(extractPathRegex, (m, p1) => m.replace(p1, p1.replace(homeDir, '~')));
			}

			return line;
		})
		.join('\n');
}


/***/ }),

/***/ "./node_modules/escape-string-regexp/index.js":
/*!****************************************************!*\
  !*** ./node_modules/escape-string-regexp/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ escapeStringRegexp)
/* harmony export */ });
function escapeStringRegexp(string) {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
}


/***/ }),

/***/ "./node_modules/indent-string/index.js":
/*!*********************************************!*\
  !*** ./node_modules/indent-string/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ indentString)
/* harmony export */ });
function indentString(string, count = 1, options = {}) {
	const {
		indent = ' ',
		includeEmptyLines = false
	} = options;

	if (typeof string !== 'string') {
		throw new TypeError(
			`Expected \`input\` to be a \`string\`, got \`${typeof string}\``
		);
	}

	if (typeof count !== 'number') {
		throw new TypeError(
			`Expected \`count\` to be a \`number\`, got \`${typeof count}\``
		);
	}

	if (count < 0) {
		throw new RangeError(
			`Expected \`count\` to be at least 0, got \`${count}\``
		);
	}

	if (typeof indent !== 'string') {
		throw new TypeError(
			`Expected \`options.indent\` to be a \`string\`, got \`${typeof indent}\``
		);
	}

	if (count === 0) {
		return string;
	}

	const regex = includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;

	return string.replace(regex, indent.repeat(count));
}


/***/ }),

/***/ "./node_modules/p-map/index.js":
/*!*************************************!*\
  !*** ./node_modules/p-map/index.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortError: () => (/* binding */ AbortError),
/* harmony export */   "default": () => (/* binding */ pMap),
/* harmony export */   pMapSkip: () => (/* binding */ pMapSkip)
/* harmony export */ });
/* harmony import */ var aggregate_error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aggregate-error */ "./node_modules/aggregate-error/index.js");


/**
An error to be thrown when the request is aborted by AbortController.
DOMException is thrown instead of this Error when DOMException is available.
*/
class AbortError extends Error {
	constructor(message) {
		super();
		this.name = 'AbortError';
		this.message = message;
	}
}

/**
TODO: Remove AbortError and just throw DOMException when targeting Node 18.
*/
const getDOMException = errorMessage => globalThis.DOMException === undefined
	? new AbortError(errorMessage)
	: new DOMException(errorMessage);

/**
TODO: Remove below function and just 'reject(signal.reason)' when targeting Node 18.
*/
const getAbortedReason = signal => {
	const reason = signal.reason === undefined
		? getDOMException('This operation was aborted.')
		: signal.reason;

	return reason instanceof Error ? reason : getDOMException(reason);
};

async function pMap(
	iterable,
	mapper,
	{
		concurrency = Number.POSITIVE_INFINITY,
		stopOnError = true,
		signal,
	} = {},
) {
	return new Promise((resolve, reject_) => {
		if (iterable[Symbol.iterator] === undefined && iterable[Symbol.asyncIterator] === undefined) {
			throw new TypeError(`Expected \`input\` to be either an \`Iterable\` or \`AsyncIterable\`, got (${typeof iterable})`);
		}

		if (typeof mapper !== 'function') {
			throw new TypeError('Mapper function is required');
		}

		if (!((Number.isSafeInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency >= 1)) {
			throw new TypeError(`Expected \`concurrency\` to be an integer from 1 and up or \`Infinity\`, got \`${concurrency}\` (${typeof concurrency})`);
		}

		const result = [];
		const errors = [];
		const skippedIndexesMap = new Map();
		let isRejected = false;
		let isResolved = false;
		let isIterableDone = false;
		let resolvingCount = 0;
		let currentIndex = 0;
		const iterator = iterable[Symbol.iterator] === undefined ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();

		const reject = reason => {
			isRejected = true;
			isResolved = true;
			reject_(reason);
		};

		if (signal) {
			if (signal.aborted) {
				reject(getAbortedReason(signal));
			}

			signal.addEventListener('abort', () => {
				reject(getAbortedReason(signal));
			});
		}

		const next = async () => {
			if (isResolved) {
				return;
			}

			const nextItem = await iterator.next();

			const index = currentIndex;
			currentIndex++;

			// Note: `iterator.next()` can be called many times in parallel.
			// This can cause multiple calls to this `next()` function to
			// receive a `nextItem` with `done === true`.
			// The shutdown logic that rejects/resolves must be protected
			// so it runs only one time as the `skippedIndex` logic is
			// non-idempotent.
			if (nextItem.done) {
				isIterableDone = true;

				if (resolvingCount === 0 && !isResolved) {
					if (!stopOnError && errors.length > 0) {
						reject(new aggregate_error__WEBPACK_IMPORTED_MODULE_0__["default"](errors));
						return;
					}

					isResolved = true;

					if (skippedIndexesMap.size === 0) {
						resolve(result);
						return;
					}

					const pureResult = [];

					// Support multiple `pMapSkip`'s.
					for (const [index, value] of result.entries()) {
						if (skippedIndexesMap.get(index) === pMapSkip) {
							continue;
						}

						pureResult.push(value);
					}

					resolve(pureResult);
				}

				return;
			}

			resolvingCount++;

			// Intentionally detached
			(async () => {
				try {
					const element = await nextItem.value;

					if (isResolved) {
						return;
					}

					const value = await mapper(element, index);

					// Use Map to stage the index of the element.
					if (value === pMapSkip) {
						skippedIndexesMap.set(index, value);
					}

					result[index] = value;

					resolvingCount--;
					await next();
				} catch (error) {
					if (stopOnError) {
						reject(error);
					} else {
						errors.push(error);
						resolvingCount--;

						// In that case we can't really continue regardless of `stopOnError` state
						// since an iterable is likely to continue throwing after it throws once.
						// If we continue calling `next()` indefinitely we will likely end up
						// in an infinite loop of failed iteration.
						try {
							await next();
						} catch (error) {
							reject(error);
						}
					}
				}
			})();
		};

		// Create the concurrent runners in a detached (non-awaited)
		// promise. We need this so we can await the `next()` calls
		// to stop creating runners before hitting the concurrency limit
		// if the iterable has already been marked as done.
		// NOTE: We *must* do this for async iterators otherwise we'll spin up
		// infinite `next()` calls by default and never start the event loop.
		(async () => {
			for (let index = 0; index < concurrency; index++) {
				try {
					// eslint-disable-next-line no-await-in-loop
					await next();
				} catch (error) {
					reject(error);
					break;
				}

				if (isIterableDone || isRejected) {
					break;
				}
			}
		})();
	});
}

const pMapSkip = Symbol('skip');


/***/ }),

/***/ "./node_modules/pokedex-promise-v2/dist/src/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/pokedex-promise-v2/dist/src/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Pokedex)
/* harmony export */ });
/* harmony import */ var p_map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! p-map */ "./node_modules/p-map/index.js");
/* harmony import */ var node_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node-cache */ "./node_modules/node-cache/index.js");
/* harmony import */ var _interfaces_PokeAPIOptions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interfaces/PokeAPIOptions.js */ "./node_modules/pokedex-promise-v2/dist/src/interfaces/PokeAPIOptions.js");
/* harmony import */ var _utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/ErrorHandler.js */ "./node_modules/pokedex-promise-v2/dist/src/utils/ErrorHandler.js");
/* harmony import */ var _utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/Getter.js */ "./node_modules/pokedex-promise-v2/dist/src/utils/Getter.js");
/* eslint-disable */
/*
* DO NOT MODIFY, THIS IS AUTO GENERATED
* Execute `npm run generate` to regenerate
*/





class Pokedex {
    constructor(options) {
        this.options = new _interfaces_PokeAPIOptions_js__WEBPACK_IMPORTED_MODULE_2__["default"](options, new node_cache__WEBPACK_IMPORTED_MODULE_1__());
    }
    async getResource(endpoint, callback) {
        try {
            // Fail if the endpoint is not supplied
            if (!endpoint) {
                throw new Error('Param "endpoint" is required needs to be a string or array of strings');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(endpoint) && typeof endpoint !== 'string') {
                throw new Error('Param "endpoint" needs to be a string or array of strings');
            }
            /// If the user has submitted a string, return the JSON promise
            if (typeof endpoint === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, endpoint, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (endpoints) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, endpoints);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(endpoint, mapper, { concurrency: 4 });
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    /** @deprecated - will be removed on the next version. Use {@link getResource} instead */
    async resource(endpoint, callback) {
        try {
            // Fail if the endpoint is not supplied
            if (!endpoint) {
                throw new Error('Param "endpoint" is required needs to be a string or array of strings');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(endpoint) && typeof endpoint !== 'string') {
                throw new Error('Param "endpoint" needs to be a string or array of strings');
            }
            /// If the user has submitted a string, return the JSON promise
            if (typeof endpoint === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, endpoint, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (endpoints) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, endpoints);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(endpoint, mapper, { concurrency: 4 });
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getBerryByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}berry/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}berry/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getBerryFirmnessByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}berry-firmness/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}berry-firmness/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getBerryFlavorByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}berry-flavor/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}berry-flavor/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getContestTypeByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}contest-type/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}contest-type/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getContestEffectById(id, callback) {
        try {
            // Fail if the param is not supplied
            if (!id) {
                throw new Error('Param "id" is required (Must be a number or array of numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(id) && typeof id !== 'number' && typeof id !== 'string') {
                throw new Error('Param "id" must be a number or array of numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof id === 'number' || typeof id === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}contest-effect/${id}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (ids) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}contest-effect/${ids}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(id, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getSuperContestEffectById(id, callback) {
        try {
            // Fail if the param is not supplied
            if (!id) {
                throw new Error('Param "id" is required (Must be a number or array of numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(id) && typeof id !== 'number' && typeof id !== 'string') {
                throw new Error('Param "id" must be a number or array of numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof id === 'number' || typeof id === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}super-contest-effect/${id}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (ids) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}super-contest-effect/${ids}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(id, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getEncounterMethodByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}encounter-method/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}encounter-method/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getEncounterConditionByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}encounter-condition/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}encounter-condition/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getEncounterConditionValueByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}encounter-condition-value/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}encounter-condition-value/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getEvolutionChainById(id, callback) {
        try {
            // Fail if the param is not supplied
            if (!id) {
                throw new Error('Param "id" is required (Must be a number or array of numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(id) && typeof id !== 'number' && typeof id !== 'string') {
                throw new Error('Param "id" must be a number or array of numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof id === 'number' || typeof id === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}evolution-chain/${id}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (ids) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}evolution-chain/${ids}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(id, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getEvolutionTriggerByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}evolution-trigger/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}evolution-trigger/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getGenerationByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}generation/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}generation/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokedexByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokedex/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokedex/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getVersionByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}version/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}version/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getVersionGroupByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}version-group/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}version-group/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getItemByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}item/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}item/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getItemAttributeByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}item-attribute/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}item-attribute/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getItemCategoryByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}item-category/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}item-category/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getItemFlingEffectByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}item-fling-effect/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}item-fling-effect/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getItemPocketByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}item-pocket/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}item-pocket/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMachineById(id, callback) {
        try {
            // Fail if the param is not supplied
            if (!id) {
                throw new Error('Param "id" is required (Must be a number or array of numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(id) && typeof id !== 'number' && typeof id !== 'string') {
                throw new Error('Param "id" must be a number or array of numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof id === 'number' || typeof id === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}machine/${id}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (ids) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}machine/${ids}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(id, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMoveByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMoveAilmentByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-ailment/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-ailment/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMoveBattleStyleByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-battle-style/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-battle-style/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMoveCategoryByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-category/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-category/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMoveDamageClassByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-damage-class/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-damage-class/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMoveLearnMethodByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-learn-method/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-learn-method/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMoveTargetByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-target/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-target/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getLocationByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}location/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}location/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getLocationAreaByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}location-area/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}location-area/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPalParkAreaByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pal-park-area/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pal-park-area/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getRegionByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}region/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}region/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getAbilityByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}ability/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}ability/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getCharacteristicById(id, callback) {
        try {
            // Fail if the param is not supplied
            if (!id) {
                throw new Error('Param "id" is required (Must be a number or array of numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(id) && typeof id !== 'number' && typeof id !== 'string') {
                throw new Error('Param "id" must be a number or array of numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof id === 'number' || typeof id === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}characteristic/${id}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (ids) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}characteristic/${ids}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(id, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getEggGroupByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}egg-group/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}egg-group/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getGenderByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}gender/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}gender/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getGrowthRateByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}growth-rate/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}growth-rate/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getNatureByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}nature/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}nature/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokeathlonStatByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokeathlon-stat/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokeathlon-stat/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokemonByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokemonColorByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon-color/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon-color/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokemonFormByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon-form/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon-form/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokemonHabitatByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon-habitat/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon-habitat/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokemonShapeByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon-shape/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon-shape/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokemonSpeciesByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon-species/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon-species/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getStatByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}stat/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}stat/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getTypeByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}type/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}type/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getLanguageByName(nameOrId, callback) {
        try {
            // Fail if the param is not supplied
            if (!nameOrId) {
                throw new Error('Param "nameOrId" is required (Must be a string, array of strings or array of string and/or numbers )');
            }
            // Fail if the input types aren't accepted
            if (!Array.isArray(nameOrId) && typeof nameOrId !== 'number' && typeof nameOrId !== 'string') {
                throw new Error('Param "nameOrId" must be a string, array of strings or array of string and/or numbers');
            }
            // If the user has submitted a Name or an ID, return the JSON promise
            if (typeof nameOrId === 'number' || typeof nameOrId === 'string') {
                return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}language/${nameOrId}/`, callback);
            }
            // If the user has submitted an Array return a new promise which will resolve when all getJSON calls are ended
            const mapper = async (nameOrIds) => {
                const queryRes = await (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}language/${nameOrIds}/`);
                return queryRes;
            };
            // Fetch data asynchronously to be faster
            const mappedResults = await (0,p_map__WEBPACK_IMPORTED_MODULE_0__["default"])(nameOrId, mapper, { concurrency: 4 });
            // Invoke the callback if we have one
            if (callback) {
                callback(mappedResults);
            }
            return mappedResults;
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getBerriesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}berry/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getBerriesFirmnessList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}berry-firmness/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    /** @deprecated will be removed on a future version. Use {@link getBerriesFirmnessList} instead */
    async getBerriesFirmnesssList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}berry-firmness/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getBerriesFlavorsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}berry-flavor/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getContestTypesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}contest-type/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getContestEffectsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}contest-effect/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getSuperContestEffectsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}super-contest-effect/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getEncounterMethodsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}encounter-method/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getEncounterConditionsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}encounter-condition/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getEncounterConditionValuesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}encounter-condition-value/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getEvolutionChainsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}evolution-chain/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getEvolutionTriggersList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}evolution-trigger/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getGenerationsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}generation/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    /** @deprecated will be removed on a future version. Use {@link getPokedexList} instead */
    async getPokedexsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokedex/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokedexList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokedex/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getVersionsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}version/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getVersionGroupsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}version-group/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getItemsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}item/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getItemAttributesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}item-attribute/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getItemCategoriesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}item-category/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getItemFlingEffectsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}item-fling-effect/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getItemPocketsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}item-pocket/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMachinesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}machine/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMovesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMoveAilmentsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-ailment/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMoveBattleStylesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-battle-style/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMoveCategoriesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-category/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMoveDamageClassesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-damage-class/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMoveLearnMethodsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-learn-method/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getMoveTargetsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}move-target/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getLocationsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}location/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getLocationAreasList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}location-area/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPalParkAreasList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pal-park-area/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getRegionsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}region/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getAbilitiesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}ability/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getCharacteristicsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}characteristic/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getEggGroupsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}egg-group/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getGendersList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}gender/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getGrowthRatesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}growth-rate/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getNaturesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}nature/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokeathlonStatsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokeathlon-stat/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokemonsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokemonColorsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon-color/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokemonFormsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon-form/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokemonHabitatsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon-habitat/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokemonShapesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon-shape/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getPokemonSpeciesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}pokemon-species/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getStatsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}stat/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getTypesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}type/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getLanguagesList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}language/?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    async getEndpointsList(interval, callback) {
        try {
            let { limit, offset } = this.options;
            if (interval) {
                if (interval.hasOwnProperty('limit')) {
                    limit = interval.limit;
                }
                if (interval.hasOwnProperty('offset')) {
                    offset = interval.offset;
                }
            }
            return (0,_utils_Getter_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.options, `${this.options.protocol}${this.options.hostName}${this.options.versionPath}?limit=${limit}&offset=${offset}`, callback);
        }
        catch (error) {
            (0,_utils_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_3__["default"])(error, callback);
        }
    }
    /** Retrieve the configs used */
    getConfig() {
        return this.options;
    }
    /** Retuns the current number of entries in the cache */
    getCachedItemsCount() {
        return this.options.cache.stats.keys;
    }
    /** @deprecated use {@link getCachedItemsCount} */
    cacheSize() {
        return this.options.cache.stats.keys;
    }
    /** Deletes all keys in cache */
    clearCache() {
        this.options.cache.flushAll();
    }
}


/***/ }),

/***/ "./node_modules/pokedex-promise-v2/dist/src/interfaces/PokeAPIOptions.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/pokedex-promise-v2/dist/src/interfaces/PokeAPIOptions.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class PokeAPIOptions {
    /* eslint-disable default-param-last */
    constructor(config = {}, cache) {
        this.protocol = 'https';
        this.hostName = '://pokeapi.co';
        this.versionPath = '/api/v2/';
        this.offset = 0;
        this.limit = 100000;
        this.timeout = 10 * 1000; // 10 seconds
        this.cacheLimit = 1000000 * 1000; // 11 days
        this.cache = cache;
        if (config.protocol) {
            this.protocol = config.protocol;
        }
        if (config.hostName) {
            this.hostName = `://${config.hostName}`;
        }
        if (config.versionPath) {
            this.versionPath = config.versionPath;
        }
        if (config.offset) {
            this.offset = config.offset - 1;
        }
        if (config.limit) {
            this.limit = config.limit;
        }
        if (config.timeout) {
            this.timeout = config.timeout;
        }
        if (config.cacheLimit) {
            this.cacheLimit = config.cacheLimit;
        }
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PokeAPIOptions);


/***/ }),

/***/ "./node_modules/pokedex-promise-v2/dist/src/utils/ErrorHandler.js":
/*!************************************************************************!*\
  !*** ./node_modules/pokedex-promise-v2/dist/src/utils/ErrorHandler.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
function handleError(error, callback) {
    if (callback) {
        callback('Pokedex-promise-v2 error', error);
    }
    else {
        throw error;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handleError);


/***/ }),

/***/ "./node_modules/pokedex-promise-v2/dist/src/utils/Getter.js":
/*!******************************************************************!*\
  !*** ./node_modules/pokedex-promise-v2/dist/src/utils/Getter.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var _ErrorHandler_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ErrorHandler.js */ "./node_modules/pokedex-promise-v2/dist/src/utils/ErrorHandler.js");
/* eslint-disable import/no-unresolved */


async function getJSON(values, url, 
// eslint-disable-next-line no-unused-vars
callback) {
    const options = {
        baseURL: `${values.protocol}${values.hostName}/`,
        timeout: values.timeout,
    };
    try {
        // Retrieve possible content from memory-cache
        const cachedResult = values.cache.get(url);
        // If we have in cache
        if (callback && cachedResult) {
            // Call callback without errors
            callback(cachedResult);
        }
        // Return the cache
        if (cachedResult) {
            return cachedResult;
        }
        // If we don't have in cache
        // get the data from the API
        const response = await axios__WEBPACK_IMPORTED_MODULE_0__.get(url, options);
        // If there is an error on the request
        if (response.status !== 200) {
            throw response;
        }
        // If everything was good
        // set the data
        const responseData = response.data;
        // Cache the object in memory-cache
        // only if cacheLimit > 0
        if (values.cacheLimit > 0) {
            values.cache.set(url, responseData, values.cacheLimit);
        }
        // If a callback is present
        if (callback) {
            // Call it, without errors
            callback(responseData);
        }
        return responseData;
    }
    catch (error) {
        (0,_ErrorHandler_js__WEBPACK_IMPORTED_MODULE_1__["default"])(error, callback);
    }
    // If we return nothing and the error handler fails
    // reject the promise
    return Promise.reject();
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getJSON);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************************!*\
  !*** ./src/pokemon-server.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var pokedex_promise_v2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pokedex-promise-v2 */ "./node_modules/pokedex-promise-v2/dist/src/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var P = new pokedex_promise_v2__WEBPACK_IMPORTED_MODULE_0__["default"]();
var PokemonHTML = /*#__PURE__*/function () {
  function PokemonHTML(pokemon) {
    _classCallCheck(this, PokemonHTML);
    Object.defineProperties(this, {
      name: {
        enumerable: true,
        configurable: false,
        value: pokemon
      }
    });
  }
  _createClass(PokemonHTML, [{
    key: "pokemonCatalogue",
    get: function get() {
      var _this = this;
      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var species;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return P.getPokemonByName(_this.name);
            case 3:
              species = _context.sent;
              return _context.abrupt("return", [species.name, species.types, species.stats, species.forms, species.abilities]);
            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              console.log('ERR >>> ', _context.t0);
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 7]]);
      }))();
    }
  }, {
    key: "evolutionChain",
    get: function get() {
      var _this2 = this;
      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var pokemonsToEvolve, species, evolution, evolutionList, _iterator, _step, pokemon;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              pokemonsToEvolve = [];
              _context2.next = 4;
              return P.getPokemonSpeciesByName(_this2.name);
            case 4:
              species = _context2.sent;
              _context2.next = 7;
              return P.resource(species.evolution_chain.url);
            case 7:
              evolution = _context2.sent;
              evolutionList = evolution.chain.evolves_to;
              _iterator = _createForOfIteratorHelper(evolutionList);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  pokemon = _step.value;
                  pokemonsToEvolve.push(pokemon.species.name);
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              return _context2.abrupt("return", pokemonsToEvolve);
            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](0);
              console.log('ERR >>> ', _context2.t0);
            case 17:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[0, 14]]);
      }))();
    }
  }, {
    key: "sprite",
    get: function get() {
      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              try {
                // Make a request to the pokemon sprite from front.
              } catch (error) {
                console.log('ERR >>>', error);
              }
            case 1:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }))();
    }
  }]);
  return PokemonHTML;
}(); // const setHTMLsprite = () => {
//     // Set the sprite into a HTML <img> tag.
// };
var eevee = new PokemonHTML('eevee');
_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
  var eevolutions, pokemonFilterVaporeon, vaporeon, infoV;
  return _regeneratorRuntime().wrap(function _callee4$(_context4) {
    while (1) switch (_context4.prev = _context4.next) {
      case 0:
        _context4.prev = 0;
        _context4.next = 3;
        return eevee.evolutionChain;
      case 3:
        eevolutions = _context4.sent;
        pokemonFilterVaporeon = eevolutions.filter(function (pokemon) {
          return pokemon === 'vaporeon';
        }).join('');
        vaporeon = new PokemonHTML(pokemonFilterVaporeon);
        _context4.next = 8;
        return vaporeon.pokemonCatalogue;
      case 8:
        infoV = _context4.sent;
        console.log(infoV);
        _context4.next = 15;
        break;
      case 12:
        _context4.prev = 12;
        _context4.t0 = _context4["catch"](0);
        console.log(_context4.t0);
      case 15:
      case "end":
        return _context4.stop();
    }
  }, _callee4, null, [[0, 12]]);
}))();
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map