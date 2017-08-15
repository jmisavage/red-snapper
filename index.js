const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');
const file = require('fs');

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = function (options) {

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

	chromeLauncher.launch({
		startingUrl: config.url,
		chromeFlags: config.chromeOptions
	}).then(chrome => {

		// Now let's take a screenshot
		CDP({port:chrome.port}, async (client) => {
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

			Page.navigate({ url: config.url });
			Page.loadEventFired(async () => {
				
				await wait( config.delay );

				let screenshot = await Page.captureScreenshot({fromSurface: true});
				let buffer = new Buffer(screenshot.data, 'base64');
				file.writeFile(config.output, buffer, 'base64', function(err) {
					client.close();
				});

				chrome.kill().catch( (err) => {
					console.error(err);
				});

			}); // Page.loadEventFired

		}).on('error', (err) => {
			console.error(err);
		});

	});

};
