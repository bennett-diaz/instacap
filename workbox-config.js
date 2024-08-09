module.exports = {
    globDirectory: 'public/',
    globPatterns: [
        '**/*.{ico,png,html,json,txt,js,css}'
    ],
    swDest: 'public/service-worker-workbox.js',
    ignoreURLParametersMatching: [
        /^utm_/,
        /^fbclid$/,
        /^q/
    ]
};
