// eslint-disable-next-line no-undef
module.exports = {
    extends       : ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    ignorePatterns: [
        '**/-output',
        '**/-staging',
        '**/-logs',
        'packages/web.resources/fa',
    ],
    parser : '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'align-assignments',
    ],
    root : true,
    rules: {
        'no-multiple-empty-lines'                           : ['error', { 'max': 2, 'maxEOF': 0 }],
        'comma-dangle'                                      : ['error', 'always-multiline'],
        'linebreak-style'                                   : ['error', 'unix'],
        'eol-last'                                          : ['error', 'never'],
        'no-alert'                                          : 'error',
        'no-eval'                                           : 'error',
        'no-tabs'                                           : 'error',
        'quotes'                                            : ['error', 'single'],
        'unicode-bom'                                       : ['error', 'never'],
        'no-restricted-imports'                             : ['error', { 'patterns': ['.*'] }],
        '@typescript-eslint/no-inferrable-types'            : 'off',
        '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
        '@typescript-eslint/no-require-imports'             : 'error',
        '@typescript-eslint/no-explicit-any'                : 'off',
        '@typescript-eslint/no-non-null-assertion'          : 'off',

        'semi'                   : 'off',
        '@typescript-eslint/semi': ['error', 'always'],

        'key-spacing'                   : 'off',
        '@typescript-eslint/key-spacing': ['error', { 'align': 'colon' }],

        'object-curly-spacing'                   : 'off',
        '@typescript-eslint/object-curly-spacing': ['error', 'always'],

        'keyword-spacing'                   : 'off',
        '@typescript-eslint/keyword-spacing': 'error',

        'space-before-function-paren'                   : 'off',
        '@typescript-eslint/space-before-function-paren': ['error', 'never'],

        'space-before-blocks'                   : 'off',
        '@typescript-eslint/space-before-blocks': 'error',

        'space-infix-ops'                   : 'off',
        '@typescript-eslint/space-infix-ops': 'error',

        'semi-spacing': 'error',


        '@typescript-eslint/member-delimiter-style': ['error', {
            'multiline': {
                'delimiter'  : 'comma',
                'requireLast': true,
            },
            'singleline': {
                'delimiter'  : 'comma',
                'requireLast': false,
            },
            'multilineDetection': 'brackets',
        }],


        'align-assignments/align-assignments': 'error',

        'indent': ['error', 4],

        'comma-spacing': ['error', {
            before: false,
            after : true,
        }],

        'array-bracket-spacing': ['error', 'never'],


        // Borked when using key-spacing
        // '@typescript-eslint/type-annotation-spacing': ['error', {
        //     // before: true,
        //     after: true,
        //     // overrides: {
        //     //     property: 'off',
        //     // },
        // }],
    },
};