Promettez
=========

A promise based script loader. Heavily influenced by [Brad Berger's blog post](https://bradb.net/blog/promise-based-js-script-loader/).

## Adding to the page

```html
<script src="node_modules/promettez/promettez.js"></script>

<!-- or -->

<script src="node_modules/promettez/promettez.min.js"></script>
```

This will add a global variable to the page to called `promettez`. This has a method called `addScript` which takes a string with a script url, or an array of url strings. This returns a promise, so we can run some code that depends on the script(s) after they have loaded:

```javascript
promettez.addScript('https://d3js.org/d3.v4.min.js')
  .then(function() {
    console.log('Yay! D3 has loaded!');
    d3.selectAll("p").style("color", function() {
      return "hsl(" + Math.random() * 360 + ",100%,50%)";
    });
  });
```

If some code has multiple dependancies, an array of strings can be passed to the addScript method, which will only resolve once all the scripts have loaded.

The `promettez` variable holds an array of all the scripts that have been queued to load, and will only load the script once. The `addScript` promise will reject, so you can handle this with the promise's `catch` method:

```javascript
promettez.addScript('/scripts/someAwesomeThing.js')
  .then(function() {
    // good to go
  })
  .catch(function() {
    console.log('this has either already been queued to load or 404ing...');
    // do something to handle this
  })
```

## Polyfill

As this script uses [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), you will probably want to use a polyfill to load promise functionality if the broweser doesn't support it. I use [Polyfill.io](https://polyfill.io/v2/docs/), which does feature detection then adds polyfills if necessary.

```html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Promise&flags=gated"></script>
```

## ES2015

If you want to use the full ES2015 version of the promettez, load it with:

```html
<script src="node_modules/promettez/promettez.es2015.js"></script>
```

__Note__: this uses the ES2015 [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) and [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) syntax, and no browsers currently implement this (at time of writing!).
