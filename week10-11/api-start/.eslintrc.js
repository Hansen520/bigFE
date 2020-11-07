module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": ["eslint:recommended"],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
        'no-console': process.env.NODE_ENV === 'production' ? 'error': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error': 'off',
        'error': 'off',
        'require-atomic-updates': 'off'
    }
};
