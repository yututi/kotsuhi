const path = require('path')

const rootPath = path.resolve(__dirname, '../')

module.exports = {
    mode: 'production',
    entry: path.resolve(rootPath, 'src/worker.js'),
    output: {
        path: path.resolve(rootPath, 'public'),
        filename: 'worker.js',
        libraryTarget: 'self'
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [
    ]
}