export const config = {
    webpackDevMiddleware: (config)  => {
        config.watchOptions.poll = 300;
        return config;
    }
}