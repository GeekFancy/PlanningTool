module.exports = {
    devServer: {
        disableHostCheck: true,
        proxy: {
            '/api': {
                // target: 'http://localhost:8088',
                target: 'https://sapinternaljiratool-bogus-parrot-wm.cfapps.us10.hana.ondemand.com/',
                changeOrigin: true,
                ws: true,
                secure: false,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
    },
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    // If you are using less-loader@5 please spread the lessOptions to options directly
                    modifyVars: {
                        'primary-color': '#008FD3',
                        'link-color': '#1DA57A',
                        'border-radius-base': '6px',
                        'box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // 浮层阴影
                    },
                    javascriptEnabled: true,
                },
            },
        },
    },
}