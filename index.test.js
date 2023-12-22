import { writeFileSync } from 'fs';
import { snapper } from './index.js';

test('takes screenshot of github', async () => {
    return snapper({
        url: 'https://github.com/',
        width: 300,
        height: 600,
        delay: 1,
        format: 'jpeg',
        quality: 70,
    }).then(data => {
        writeFileSync('screenshot.jpg', Buffer.from(data, 'base64'));
        expect(data).toBeTruthy();
    }).catch((error) => {
        // eslint-disable-next-line
        console.error(error);
    });
});
