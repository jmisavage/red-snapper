# red-snapper

Red Snapper is a simple module that takes a screenshot of a webpage using
headless Chrome and the Chrome Debugging Protocol.

**Important:** This has only been tested on macOS Sierra and Ubuntu 16.04 LTS

## Usage

In the following example, Red Snapper will take a 300px by 600px screenshot of example.com

```
const snap = require('red-snapper');

snap({
	url: 'http://example.com/',
	width: 300,
	height: 600,
	delay: 5
});
```

## Roadmap

A few things I need to do:

- [ ] Smarter Chrome process detection and launch
- [ ] Have snapshot work as a stream instead of export directly to a file
- [ ] Do screen recordings in addition to screenshots
