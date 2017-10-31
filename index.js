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

			if(config.fullPage) {
				const {root: {nodeId: documentNodeId}} = await DOM.getDocument();
				const {nodeId: bodyNodeId} = await DOM.querySelector({
					selector: 'body',
					nodeId: documentNodeId
				});

				const {model: {height}} = await DOM.getBoxModel({nodeId: bodyNodeId});
				await Emulation.setVisibleSize({width: config.width, height: height});
				await Emulation.setDeviceMetricsOverride({
					width: config.width,
					height:height,
					screenWidth: config.width,
					screenHeight: height,
					deviceScaleFactor: 1,
					fitWindow: false,
					mobile: false
				});
				await Emulation.setPageScaleFactor({pageScaleFactor:1});
			}

			// wait the specify time
			if( config.delay ) {
				await wait( config.delay );
			}

			// set JPG compression
			let screenshotOptions = {
				format: config.format,
				fromSurface: true
			}
			if(config.format === 'jpeg') {
				screenshotOptions.quality = config.quality;
			}

			// take a screenshot
			let screenshot = await Page.captureScreenshot(screenshotOptions);
			buffer = new Buffer(screenshot.data, 'base64');
		} catch (err) {
			console.error(err);
		} finally {
			await browser.close();
			await chrome.kill();
		}

	});

	return buffer;

};
