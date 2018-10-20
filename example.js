const fs = require('fs');
const snap = require('./index');

snap({
	url: 'https://github.com/',
	width: 300,
	height: 600,
	delay: 500,
	format: 'jpeg',
	quality: 70,
}).then((data) => {
	fs.writeFileSync('screenshot.jpg', Buffer.from(data, 'base64'));
}).catch((error) => {
	// eslint-disable-next-line
	console.error(error);
});
