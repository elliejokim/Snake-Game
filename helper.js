(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/stacktrace-js/stacktrace.js
  var require_stacktrace = __commonJS({
    "node_modules/stacktrace-js/stacktrace.js"(exports, module) {
      (function(root, factory) {
        "use strict";
        if (typeof define === "function" && define.amd) {
          define("stacktrace", ["error-stack-parser", "stack-generator", "stacktrace-gps"], factory);
        } else if (typeof exports === "object") {
          module.exports = factory(require_error_stack_parser(), require_stack_generator(), require_stacktrace_gps());
        } else {
          root.StackTrace = factory(root.ErrorStackParser, root.StackGenerator, root.StackTraceGPS);
        }
      })(exports, /* @__PURE__ */ __name(function StackTrace2(ErrorStackParser, StackGenerator, StackTraceGPS) {
        var _options = {
          filter: function(stackframe) {
            return (stackframe.functionName || "").indexOf("StackTrace$$") === -1 && (stackframe.functionName || "").indexOf("ErrorStackParser$$") === -1 && (stackframe.functionName || "").indexOf("StackTraceGPS$$") === -1 && (stackframe.functionName || "").indexOf("StackGenerator$$") === -1;
          },
          sourceCache: {}
        };
        var _generateError = /* @__PURE__ */ __name(function StackTrace$$GenerateError() {
          try {
            throw new Error();
          } catch (err) {
            return err;
          }
        }, "StackTrace$$GenerateError");
        function _merge(first, second) {
          var target = {};
          [first, second].forEach(function(obj) {
            for (var prop in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                target[prop] = obj[prop];
              }
            }
            return target;
          });
          return target;
        }
        __name(_merge, "_merge");
        function _isShapedLikeParsableError(err) {
          return err.stack || err["opera#sourceloc"];
        }
        __name(_isShapedLikeParsableError, "_isShapedLikeParsableError");
        function _filtered(stackframes, filter) {
          if (typeof filter === "function") {
            return stackframes.filter(filter);
          }
          return stackframes;
        }
        __name(_filtered, "_filtered");
        return {
          get: /* @__PURE__ */ __name(function StackTrace$$get(opts) {
            var err = _generateError();
            return _isShapedLikeParsableError(err) ? this.fromError(err, opts) : this.generateArtificially(opts);
          }, "StackTrace$$get"),
          getSync: /* @__PURE__ */ __name(function StackTrace$$getSync(opts) {
            opts = _merge(_options, opts);
            var err = _generateError();
            var stack = _isShapedLikeParsableError(err) ? ErrorStackParser.parse(err) : StackGenerator.backtrace(opts);
            return _filtered(stack, opts.filter);
          }, "StackTrace$$getSync"),
          fromError: /* @__PURE__ */ __name(function StackTrace$$fromError(error, opts) {
            opts = _merge(_options, opts);
            var gps = new StackTraceGPS(opts);
            return new Promise(function(resolve) {
              var stackframes = _filtered(ErrorStackParser.parse(error), opts.filter);
              resolve(Promise.all(stackframes.map(function(sf) {
                return new Promise(function(resolve2) {
                  function resolveOriginal() {
                    resolve2(sf);
                  }
                  __name(resolveOriginal, "resolveOriginal");
                  gps.pinpoint(sf).then(resolve2, resolveOriginal)["catch"](resolveOriginal);
                });
              })));
            }.bind(this));
          }, "StackTrace$$fromError"),
          generateArtificially: /* @__PURE__ */ __name(function StackTrace$$generateArtificially(opts) {
            opts = _merge(_options, opts);
            var stackFrames = StackGenerator.backtrace(opts);
            if (typeof opts.filter === "function") {
              stackFrames = stackFrames.filter(opts.filter);
            }
            return Promise.resolve(stackFrames);
          }, "StackTrace$$generateArtificially"),
          instrument: /* @__PURE__ */ __name(function StackTrace$$instrument(fn, callback, errback, thisArg) {
            if (typeof fn !== "function") {
              throw new Error("Cannot instrument non-function object");
            } else if (typeof fn.__stacktraceOriginalFn === "function") {
              return fn;
            }
            var instrumented = (/* @__PURE__ */ __name(function StackTrace$$instrumented() {
              try {
                this.get().then(callback, errback)["catch"](errback);
                return fn.apply(thisArg || this, arguments);
              } catch (e) {
                if (_isShapedLikeParsableError(e)) {
                  this.fromError(e).then(callback, errback)["catch"](errback);
                }
                throw e;
              }
            }, "StackTrace$$instrumented")).bind(this);
            instrumented.__stacktraceOriginalFn = fn;
            return instrumented;
          }, "StackTrace$$instrument"),
          deinstrument: /* @__PURE__ */ __name(function StackTrace$$deinstrument(fn) {
            if (typeof fn !== "function") {
              throw new Error("Cannot de-instrument non-function object");
            } else if (typeof fn.__stacktraceOriginalFn === "function") {
              return fn.__stacktraceOriginalFn;
            } else {
              return fn;
            }
          }, "StackTrace$$deinstrument"),
          report: /* @__PURE__ */ __name(function StackTrace$$report(stackframes, url, errorMsg, requestOptions) {
            return new Promise(function(resolve, reject) {
              var req = new XMLHttpRequest();
              req.onerror = reject;
              req.onreadystatechange = /* @__PURE__ */ __name(function onreadystatechange() {
                if (req.readyState === 4) {
                  if (req.status >= 200 && req.status < 400) {
                    resolve(req.responseText);
                  } else {
                    reject(new Error("POST to " + url + " failed with status: " + req.status));
                  }
                }
              }, "onreadystatechange");
              req.open("post", url);
              req.setRequestHeader("Content-Type", "application/json");
              if (requestOptions && typeof requestOptions.headers === "object") {
                var headers = requestOptions.headers;
                for (var header in headers) {
                  if (Object.prototype.hasOwnProperty.call(headers, header)) {
                    req.setRequestHeader(header, headers[header]);
                  }
                }
              }
              var reportPayload = { stack: stackframes };
              if (errorMsg !== void 0 && errorMsg !== null) {
                reportPayload.message = errorMsg;
              }
              req.send(JSON.stringify(reportPayload));
            });
          }, "StackTrace$$report")
        };
      }, "StackTrace"));
    }
  });

  // helper.ts
  var import_stacktrace_js = __toModule(require_stacktrace());
  window.addEventListener("error", (e) => {
    import_stacktrace_js.default.fromError(e.error).then((stack) => {
      fetch("/error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          msg: e.error.message,
          stack: stack.slice(0, 4).map((step) => {
            return __spreadProps(__spreadValues({}, step), {
              file: step.fileName.replace(location.origin + "/", ""),
              line: step.lineNumber,
              col: step.columnNumber
            });
          })
        })
      });
    }).catch(() => console.error("failed to parse err"));
  });
  const replit = {
    getUser() {
      return fetch("/user").then((res) => res.json()).then((user) => {
        if (user) {
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      });
    },
    auth() {
      return new Promise((resolve, reject) => {
        const authComplete = /* @__PURE__ */ __name((e) => {
          if (e.data !== "auth_complete") {
            resolve(null);
            return;
          }
          window.removeEventListener("message", authComplete);
          authWindow.close();
          this.getUser().then(resolve);
        }, "authComplete");
        window.addEventListener("message", authComplete);
        const w = 320;
        const h = 480;
        const left = screen.width / 2 - w / 2;
        const top = screen.height / 2 - h / 2;
        const authWindow = window.open(`https://repl.it/auth_with_repl_site?domain=${location.host}`, "_blank", `modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`);
      });
    },
    getUserOrAuth() {
      return new Promise((resolve, reject) => {
        this.getUser().then((user) => {
          if (user) {
            resolve(user);
          } else {
            this.auth().then((user2) => {
              resolve(user2);
            });
          }
        });
      });
    },
    getData(key, def) {
      return fetch(`/db/${key}`).then((res) => res.json()).then((val) => {
        if (val == null && def !== void 0) {
          return this.setData(key, def);
        }
        return Promise.resolve(val);
      });
    },
    setData(key, val) {
      return fetch(`/db/${key}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(val)
      }).then(() => Promise.resolve(val));
    },
    delData(key) {
      return fetch(`/db/${key}`, {
        method: "DELETE"
      }).then(() => {
      });
    },
    listData() {
      return fetch(`/db`).then((res) => res.json());
    },
    clearData() {
      return fetch(`/db`, {
        method: "DELETE"
      }).then((res) => {
      });
    }
  };
  window.replit = replit;
})();
//# sourceMappingURL=helper.js.map