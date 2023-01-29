const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function snapper(options) {
    let buffer;
    let browser;

    const config = Object.assign(
        {
            url: 'about:blank',
            width: 1024,
            height: 768,
            delay: 0,
            format: 'png',
            quality: 80,
            fullPage: false,
            engine: 'chrome',
            chromeOptions: ['--headless', '--hide-scrollbars', '--disable-gpu'],
            headers: null,
            userAgent: null
        },
        options
    );

    await chromeLauncher
        .launch({
            startingUrl: config.url,
            chromeFlags: config.chromeOptions,
        })
        .then(async chrome => {
            try {
                // talk to our instance
                browser = await CDP({ port: chrome.port });

                const { Network, Page, Emulation } = browser;

                await Network.enable();
                await Page.enable();
                await Emulation.setDeviceMetricsOverride({
                    width: config.width,
                    height: config.height,
                    deviceScaleFactor: 0,
                    mobile: false,
                    fitWindow: false,
                });
                await Emulation.setVisibleSize({
                    width: config.width,
                    height: config.height,
                });

                // Set extra network settings like custom headers, user agent, etc...
                if (config.headers) {
                    await Network.setExtraHTTPHeaders({ headers: config.headers });
                }
                if (config.userAgent) {
                    await Network.setUserAgentOverride({ userAgent: config.userAgent });
                }

                // Load the page
                await Page.navigate({ url: config.url });
                await Page.loadEventFired();

                // set JPG compression
                const screenshotOptions = {
                    format: config.format,
                    fromSurface: true,
                };

                if (config.format === 'jpeg') {
                    screenshotOptions.quality = config.quality;
                }

                // wait specified times
                if (config.delay && Array.isArray(config.delay)) {
                    buffer = [];

                    config.delay.forEach(async delay => {
                        await wait(delay);

                        // take a screenshot
                        const screenshot = await Page.captureScreenshot(
                            screenshotOptions
                        );
                        buffer.push(Buffer.from(screenshot.data, 'base64'));
                    });
                } else if (config.delay) {
                    await wait(config.delay);

                    // take a screenshot
                    const screenshot = await Page.captureScreenshot(
                        screenshotOptions
                    );
                    buffer = Buffer.from(screenshot.data, 'base64');
                }
            } catch (err) {
                // eslint-disable-next-line
                console.error(err);
            } finally {
                await browser.close();
                await chrome.kill();
            }
        });

    return buffer;
};
