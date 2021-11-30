const { NODE_ENV } = process.env;

const entry = {
    app: [
        '@babel/polyfill',
        './js/index'
    ]
};

module.exports = entry;
