const withSass = require('@zeit/next-sass')

module.exports = withSass({
    cssModules: true,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.node = {
                fs: 'empty'
            }
        }
        return config
    },
    webpackDevMiddleware: config => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        }
        return config
    }
})
