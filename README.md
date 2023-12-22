# Red Snapper

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

Red Snapper is a simple module that takes a screenshot of a webpage using headless Chrome and the Chrome Debugging Protocol.

## ES Modules
Version 2.x switches from CommonJS to ES Modules. This was unavoidable due to dependencies being upgraded to only support ES6 Modules. If you still need CommonJS support then use the 1.x releases.

## Usage

In the following example, Red Snapper will take a 300px by 600px screenshot of github.com. If any content is outside of that area it will be cropped.

```JavaScript
import fs from 'fs';
import { snapper } from 'red-snapper';

snapper({
    url: 'https://github.com/',
    width: 300,
    height: 600,
    delay: 500,
    format: 'png'
}).then((data) => {
    fs.writeFileSync('screenshot.png', Buffer.from(data, 'base64'));
}).catch((error) => {
    console.error(error);
});
```

In some cases you may need to pass a custom header to bypass bot detection or to get the correct cache version of a page. Use the `headers` object and populate it with the values you need. Warning headers and their values must be strings otherwise you will get a ProtocolError.

To set the user agent string use the separate userAgent config parameter.

```javascript
snapper({
    url: 'https://github.com/',
    width: 300,
    height: 600,
    delay: 500,
    format: 'png',
    headers: {
        'x-custom-header': 'header value'
    },
    userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
}).then((data) => {
    fs.writeFileSync('screenshot.png', Buffer.from(data, 'base64'));
}).catch((error) => {
    console.error(error);
});
```

When capturing multiple screenshots specify an array of delays. These delays will occur sequentially. For instance, if you wish to take screenshots at 1 second, 5 seconds, and 8 seconds after a page loads, create an array with values [1000, 4000, 3000]. The resulting object returned will be an array of buffers.

```JavaScript
snapper({
    url: 'https://github.com/',
    width: 300,
    height: 600,
    delay: [1000,4000,3000],
    format: 'png'
}).then((data) => {
    for(let i = 0; i < data.length; i++) {
        fs.writeFileSync('screenshot'+i+'.png', Buffer.from(data[i], 'base64'));
    }
}).catch((error) => {
    console.error(error);
});
```

### Parameters

-   **url** (_string_) - Path to website to screenshot. Use `file:///` to load a local file.
-   **width** (_integer_) - Width of the browser. Defaults to 1024px. **(optional)**
-   **height** (_integer_) - Height of the browser. Defaults to 768px. **(optional)**
-   **delay** (_integer|array_) - Number of milliseconds to wait after page load before taking a screenshot. If an array is specified several screenshots will be taken with delays taking place sequentially. **(optional)**
-   **format** (_string_) - File format of the screenshot. Acceptable values are "png" or "jpeg". Defaults to PNGs. **(optional)**
-   **quality** (_integer_) - Value between [0..100] and only used when format is jpeg. Defaults to 80. **(optional)**
-   **fullPage** (_boolean_) - When set to true the height of the image will grow to expand the content of the page. Defaults to false. **(optional)**
-   **headers** (_object_) - An object containing key-value pairs. **(optional)**
-   **userAgent** (_string_) - A string representing the user agent to send to a website. **(optional)**

[npm-image]: https://img.shields.io/npm/v/red-snapper.svg?style=flat
[npm-url]: https://npmjs.org/package/red-snapper
[downloads-image]: https://img.shields.io/npm/dm/red-snapper.svg
[downloads-url]: https://npmjs.org/package/red-snapper
