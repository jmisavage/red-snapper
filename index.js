const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function (options) {

	let buffer, client;

	let config = Object.assign({
		url: 'about:blank',
		width: 1024,
		height: 768,
		delay: 0,
		format: 'png',
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
			client = await CDP({ port:chrome.port });

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

			let screenshot = await Page.captureScreenshot({format: config.format, fromSurface: true});
			buffer = new Buffer(screenshot.data, 'base64');
		} catch (err) {
			console.error(err);
		} finally {
			await client.close();
			await chrome.kill();
		}

	});

	return buffer;

};
