const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');
const file = require('fs');

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function (options) {

	let config = Object.assign({
		url: 'about:blank',
		width: 1024,
		height: 768,
		delay: 0,
		output: 'output.png',
		chromeOptions: [
			'--headless',
            '--hide-scrollbars',
            '--disable-gpu'
		]
	}, options);

	await chromeLauncher.launch({
		startingUrl: config.url,
		chromeFlags: config.chromeOptions
	}).then(async chrome => {

		try {
			// talk to our instance
			var client = await CDP({ port:chrome.port });

			const {Page, Emulation} = client;

			await Page.enable();
			await Emulation.setDeviceMetricsOverride({
				width: config.width,
				height: config.height,
				deviceScaleFactor: 0,
				mobile: false,
				fitWindow: false
			});
			await Emulation.setVisibleSize({width: config.width, height: config.height});
			await Page.navigate({ url: config.url });
			await Page.loadEventFired();

			// wait the specify time
			if( config.delay ) {
				await wait( config.delay );
			}

			let screenshot = await Page.captureScreenshot({fromSurface: true});
			let buffer = new Buffer(screenshot.data, 'base64');
			file.writeFile(config.output, buffer, 'base64', function(err) {
				// done
			});
		} catch (err) {
			console.error(err);
		} finally {
			await client.close();
			await chrome.kill();
		}

	});

};
