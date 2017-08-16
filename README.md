# red-snapper

Red Snapper is a simple module that takes a screenshot of a webpage using
headless Chrome and the Chrome Debugging Protocol.

**Important:** This has only been tested on macOS Sierra and Ubuntu 16.04 LTS

## Usage

In the following example, Red Snapper will take a 300px by 600px screenshot of example.com

```JavaScript
const snap = require('red-snapper');
const fs = require('fs');

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

### Parameters

- **url** (_string_) - Path to website to screenshot. Use `file:///` to load a local file.
- **width** (_integer_) - Width of the browser. Defaults to 1024px. **(optional)**
- **height** (_integer_) - Height of the browser. Defaults to 768px. **(optional)**
- **delay** (_integer_) - Number of milliseconds to wait after page load before taking a screenshot. **(optional)**
- **format** (_string_) - File format of the screenshot.  Acceptable values are "png" or "jpg".  Defaults to PNGs. **(optional)**
