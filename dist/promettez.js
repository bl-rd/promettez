'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Container class for dynamically and asynchrously loading scripts. Uses promises to load scripts and handle events when post-load code needs to be run.
 * There should only ever be one on a page, using it's addScript method to add scripts.
 */
var Promettez = function () {

  /**
   * The constructor for the ScriptHandler class. Sets an array (keys) which will store urls of scripts that have either already been loaded or queued to load.
   */
  function Promettez() {
    _classCallCheck(this, Promettez);

    this.keys = [];
  }

  /**
   * Adds a script to the page. First checks if the script has already been queued, if not it will add it to the keys array and attempt to load it.
   * @return {Promise} Either a single promise or an array of promises with the script element(s)
   */


  _createClass(Promettez, [{
    key: 'addScript',
    value: function addScript(url) {

      // the array that will contain the script urls that are safe to be loaded
      var urls = [];

      // if the url is an array, check the keys array for duplicates
      if (Array.isArray(url)) {
        for (var i = 0; i < url.length; i++) {
          var match = false;
          for (var j = 0; j < this.keys.length; j++) {
            if (this.keys[j] === url[i]) {
              match = true;
            }
          }

          // if there is no match, add to the the keys array and the safe urls array
          if (!match) {
            urls.push(url[i]);
            this.keys.push(url[i]);
          }
        }
      } else {
        if (this.keys.length > 0) {
          var _match = false;
          this.keys.forEach(function (key) {
            if (key === url) {
              _match = true;
            }
          });

          // if there is no match, add to the the keys array and the safe urls array
          if (!_match) {
            urls.push(url);
            this.keys.push(url);
          }
        } else {
          urls.push(url);
          this.keys.push(url);
        }
      }

      // if there are some safe script urls to load, return a new PromettezLoader instance
      if (urls.length > 0) {
        return new PromettezLoader(urls);
      }
      // otherwise, return a rejected promise as the script(s) has/are already been loaded/queued.
      else {
          var msg = 'already added to queue: ';
          if (Array.isArray(url)) {
            msg += url.join('\n' + msg);
          } else {
            msg += url;
          }
          return Promise.reject(msg);
        }
    }
  }]);

  return Promettez;
}();

/**
 * Class to handle the actual loading of scripts. For each script url, it will attempt to inject an async script element onto the page.
 */


var PromettezLoader = function () {

  /**
   * The constructor for the PromettezLoader class.
   * @return {Promise} The promise object. It will resolve on successful loading of the script.
   */
  function PromettezLoader(url) {
    _classCallCheck(this, PromettezLoader);

    this.url = url;
    this.urls = this.createUrlArray(url);
    var promises = this.createScripts();
    return Promise.all(promises);
  }

  /**
   * Helper method to create useable array for handling the url argument
   * @return {array} The array of strings containing the urls
   */


  _createClass(PromettezLoader, [{
    key: 'createUrlArray',
    value: function createUrlArray(url) {
      var urls = [];
      if (Array.isArray(url)) {
        url.forEach(function (_url) {
          urls.push(_url);
        });
      } else {
        urls = [url];
      }
      return urls;
    }

    /**
     * Creates the script elements and adds the necessary attributes. Wraps the logic within promises that resolve on successful loading
     * @return {array} an array of promises that will attempt to inject and load the scripts from this.urls
     */

  }, {
    key: 'createScripts',
    value: function createScripts() {
      var promises = [];
      var complete = false;
      this.urls.forEach(function (url) {
        promises.push(new Promise(function (resolve, reject) {
          var script = document.createElement('script');
          script.src = url;
          script.async = true;
          if (script.readyState) {
            script.onreadystatechange = function () {
              if (script.readyState === 'loaded' || script.readystate === 'complete') {
                script.onreadystatechange = null;
                resolve(this);
              }
            };
          } else {
            script.onload = function () {
              resolve(this);
            };
          }

          script.onerror = script.onabort = reject;

          var parent = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0];
          parent.appendChild(script);
        }));
      });
      return promises;
    }
  }]);

  return PromettezLoader;
}();

var promettez = new Promettez();
window.promettez = promettez;
console.log('%c%s', 'color: steelblue', '==> loaded Promettez.js');
