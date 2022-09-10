module.exports = {
    env: {
        esmUnbundled: {
            presets: [
                '@babel/preset-typescript'
            ]
        },
        cjs: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            node: '16.10'
                        },
                        modules: 'commonjs'
                    }
                ],
                '@babel/preset-typescript'
            ],
        }
    }
};
