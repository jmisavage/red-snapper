# red-snapper

Red Snapper is a simple module that takes a screenshot of a webpage using
headless Chrome and the Chrome Debugging Protocol.

**Important:** This has only been tested on macOS Sierra and Ubuntu 16.04 LTS

## Usage

In the following example, Red Snapper will take a 300px by 600px screenshot of github.com.  If content is outside of that area it is cropped.

```JavaScript
const fs = require('fs');
const snap = require('red-snapper');

snap({
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

To take multiple screenshots specify an array of delays.  The delays happen sequentially.  So for example if you want screenshots at 1 second, 5 seconds, and 8 seconds from a page load use an array with values of [1000,4000,3000];  The return object then becomes an array of buffers.

```JavaScript
snap({
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

- **url** (_string_) - Path to website to screenshot. Use `file:///` to load a local file.
- **width** (_integer_) - Width of the browser. Defaults to 1024px. **(optional)**
- **height** (_integer_) - Height of the browser. Defaults to 768px. **(optional)**
- **delay** (_integer|array_) - Number of milliseconds to wait after page load before taking a screenshot. If an array is specified several screenshots will be taken with delays taking place sequentially. **(optional)**
- **format** (_string_) - File format of the screenshot.  Acceptable values are "png" or "jpeg".  Defaults to PNGs. **(optional)**
- **quality** (_integer_) - Value between [0..100] and only used when format is jpeg.  Defaults to 80. **(optional)**
- **fullPage** (_boolean_) - When set to true the height of the image will grow to expand the content of the page.  Defaults to false. **(optional)**
