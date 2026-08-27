import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import verify8ef1b2 from './verify'
import sign from './sign'
/**
* @see \App\Http\Controllers\SignatureVerificationController::verify
* @see app/Http/Controllers/SignatureVerificationController.php:17
* @route '/verify/signature/{verificationCode}'
*/
export const verify = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verify.url(args, options),
    method: 'get',
})

verify.definition = {
    methods: ["get","head"],
    url: '/verify/signature/{verificationCode}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SignatureVerificationController::verify
* @see app/Http/Controllers/SignatureVerificationController.php:17
* @route '/verify/signature/{verificationCode}'
*/
verify.url = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { verificationCode: args }
    }

    if (Array.isArray(args)) {
        args = {
            verificationCode: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        verificationCode: args.verificationCode,
    }

    return verify.definition.url
            .replace('{verificationCode}', parsedArgs.verificationCode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SignatureVerificationController::verify
* @see app/Http/Controllers/SignatureVerificationController.php:17
* @route '/verify/signature/{verificationCode}'
*/
verify.get = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verify.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SignatureVerificationController::verify
* @see app/Http/Controllers/SignatureVerificationController.php:17
* @route '/verify/signature/{verificationCode}'
*/
verify.head = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verify.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SignatureVerificationController::qr
* @see app/Http/Controllers/SignatureVerificationController.php:37
* @route '/verify/signature/{verificationCode}/qr.svg'
*/
export const qr = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})

qr.definition = {
    methods: ["get","head"],
    url: '/verify/signature/{verificationCode}/qr.svg',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SignatureVerificationController::qr
* @see app/Http/Controllers/SignatureVerificationController.php:37
* @route '/verify/signature/{verificationCode}/qr.svg'
*/
qr.url = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { verificationCode: args }
    }

    if (Array.isArray(args)) {
        args = {
            verificationCode: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        verificationCode: args.verificationCode,
    }

    return qr.definition.url
            .replace('{verificationCode}', parsedArgs.verificationCode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SignatureVerificationController::qr
* @see app/Http/Controllers/SignatureVerificationController.php:37
* @route '/verify/signature/{verificationCode}/qr.svg'
*/
qr.get = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SignatureVerificationController::qr
* @see app/Http/Controllers/SignatureVerificationController.php:37
* @route '/verify/signature/{verificationCode}/qr.svg'
*/
qr.head = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: qr.url(args, options),
    method: 'head',
})

const signature = {
    verify: Object.assign(verify, verify8ef1b2),
    qr: Object.assign(qr, qr),
    sign: Object.assign(sign, sign),
}

export default signature