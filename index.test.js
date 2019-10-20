const fs = require('fs');
const snap = require('./index');

test('takes screenshot of github', () => {
    return snap({
        url: 'https://github.com/',
        width: 300,
        height: 600,
        delay: 1,
        format: 'jpeg',
        quality: 70,
    }).then(data => {
        expect(data).toBeTruthy();
    });
});
