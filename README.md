# red-snapper

Red Snapper is a simple module that takes a screenshot of a webpage using
headless Chrome and the Chrome Debugging Protocol.

**Important:** This has only been tested on macOS Sierra and Ubuntu 16.04 LTS

## Usage

In the following example, Red Snapper will take a 300px by 600px screenshot of example.com

```
const snap = require('red-snapper');
const fs = require('fs');

snap({
	url: 'https://github.com/',
	width: 300,
	height: 600,
	delay: 500
}).then((data) => {
	fs.writeFileSync('screenshot.png', Buffer.from(data, 'base64'));
}).catch((error) => {
	console.error(error);
});
```
