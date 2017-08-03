'use strict';

const CDP = require('chrome-remote-interface');
const { exec, spawn } = require('child_process');
const file = require('fs');

module.exports = function (options) {
	let search,
		chrome,
		instance;
	let config = Object.assign({
		url: 'about:blank',
		width: 1024,
		height: 768,
		delay: 0,
		output: 'output.png',
		chromeOptions: [
			'--headless',
            '--hide-scrollbars',
            '--remote-debugging-port=9222',
            '--disable-gpu'
		],
		instanceOptions: {
			stdio: ['ignore', 'ignore', 'ignore'],
			detached: true
		},
		autoLaunch: false
	}, options);

	// Check for Chrome
	if( process.platform === 'darwin') {
		search = 'ps aux | grep "Google Chrome"';
		chrome = '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome';
	} else {
		search = 'ps aux | grep chrome';
		chrome = 'google-chrome';
	}

	exec(search, (error, stdout, stderr) => {
		// test id the unix/posix process is running with headless
		if( config.autoLaunch && stdout.indexOf('--headless') < 0 ) {
			// try to auto launch chrome
			instance = spawn(chrome, config.chromeOptions, config.instanceOptions);
			instance.unref();
		}

		// Now let's take a screenshot
		CDP(async (client) => {
			const {Page, Emulation} = client;

			await Page.enable();

			const deviceMetrics = {
				width: config.width,
				height: config.height,
				deviceScaleFactor: 0,
				mobile: false,
				fitWindow: false
			};

			await Emulation.setDeviceMetricsOverride(deviceMetrics);
			await Emulation.setVisibleSize({width: config.width, height: config.height});

			await Page.navigate({ url: config.url });

			Page.loadEventFired(async () => {

				let screenshot;
				let buffer;

				setTimeout(async () => {
					screenshot = await Page.captureScreenshot({fromSurface: true});
					buffer = new Buffer(screenshot.data, 'base64');
					file.writeFile(config.output, buffer, 'base64', function(err) {
						client.close();
					});
				}, config.delay);

			}); // Page.loadEventFired

			if( config.autoLaunch ) {
				setTimeout(async () => {
					if(instance) {
						instance.kill();
					}
					return true;
				}, config.delay + 50);
			}


		}).on('error', (err) => {
			console.error(err);
		});
	});
};
