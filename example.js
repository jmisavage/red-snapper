const snap = require('./index');
const fs = require('fs');

snap({
    url: 'https://github.com/',
    width: 300,
    height: 600,
    delay: 500,
    format: 'jpeg',
    quality: 70
}).then((data) => {
    fs.writeFileSync('screenshot.jpg', Buffer.from(data, 'base64'));
}).catch((error) => {
    console.error(error);
});
