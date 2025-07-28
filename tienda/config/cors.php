
<?php

return [
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'register',
        'check-token',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'Authorization',
        'Content-Type',
        'X-Requested-With',
        'Accept',
        'Access-Control-Allow-Origin',
        '*'
    ],

    'exposed_headers' => [
        'Authorization',
        'Content-Disposition',
    ],

    'max_age' => 86400,

    'supports_credentials' => true,
];
