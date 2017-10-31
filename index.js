const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function (options) {

	let buffer, browser;

	let config = Object.assign({
		url: 'about:blank',
		width: 1024,
		height: 768,
		delay: 0,
		format: 'png',
		quality: 80,
		fullPage: false,
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
			browser = await CDP({ port:chrome.port });

			const {DOM, Page, Emulation} = browser;

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

			// set JPG compression
			let screenshotOptions = {
				format: config.format,
				fromSurface: true
			}

			if(config.format === 'jpeg') {
				screenshotOptions.quality = config.quality;
			}

			// wait specified times
			if( config.delay && Array.isArray(config.delay) ) {
				buffer = [];

				for(let i = 0; i < config.delay.length; i++) {
					await wait( config.delay[i] );

					// take a screenshot
					let screenshot = await Page.captureScreenshot(screenshotOptions);
					buffer.push( new Buffer(screenshot.data, 'base64') );
				}
			} else if( config.delay ) {
				await wait( config.delay );

				// take a screenshot
				let screenshot = await Page.captureScreenshot(screenshotOptions);
				buffer = new Buffer(screenshot.data, 'base64');
			}

		} catch (err) {
			console.error(err);
		} finally {
			await browser.close();
			await chrome.kill();
		}

	});

	return buffer;

};
