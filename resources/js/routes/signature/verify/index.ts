import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SignatureVerificationController::downloadSigned
* @see app/Http/Controllers/SignatureVerificationController.php:45
* @route '/verify/signature/{verificationCode}/download-signed'
*/
export const downloadSigned = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadSigned.url(args, options),
    method: 'get',
})

downloadSigned.definition = {
    methods: ["get","head"],
    url: '/verify/signature/{verificationCode}/download-signed',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SignatureVerificationController::downloadSigned
* @see app/Http/Controllers/SignatureVerificationController.php:45
* @route '/verify/signature/{verificationCode}/download-signed'
*/
downloadSigned.url = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return downloadSigned.definition.url
            .replace('{verificationCode}', parsedArgs.verificationCode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SignatureVerificationController::downloadSigned
* @see app/Http/Controllers/SignatureVerificationController.php:45
* @route '/verify/signature/{verificationCode}/download-signed'
*/
downloadSigned.get = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadSigned.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SignatureVerificationController::downloadSigned
* @see app/Http/Controllers/SignatureVerificationController.php:45
* @route '/verify/signature/{verificationCode}/download-signed'
*/
downloadSigned.head = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadSigned.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SignatureVerificationController::downloadCertificate
* @see app/Http/Controllers/SignatureVerificationController.php:76
* @route '/verify/signature/{verificationCode}/download-certificate'
*/
export const downloadCertificate = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadCertificate.url(args, options),
    method: 'get',
})

downloadCertificate.definition = {
    methods: ["get","head"],
    url: '/verify/signature/{verificationCode}/download-certificate',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SignatureVerificationController::downloadCertificate
* @see app/Http/Controllers/SignatureVerificationController.php:76
* @route '/verify/signature/{verificationCode}/download-certificate'
*/
downloadCertificate.url = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return downloadCertificate.definition.url
            .replace('{verificationCode}', parsedArgs.verificationCode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SignatureVerificationController::downloadCertificate
* @see app/Http/Controllers/SignatureVerificationController.php:76
* @route '/verify/signature/{verificationCode}/download-certificate'
*/
downloadCertificate.get = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadCertificate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SignatureVerificationController::downloadCertificate
* @see app/Http/Controllers/SignatureVerificationController.php:76
* @route '/verify/signature/{verificationCode}/download-certificate'
*/
downloadCertificate.head = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadCertificate.url(args, options),
    method: 'head',
})

const verify = {
    downloadSigned: Object.assign(downloadSigned, downloadSigned),
    downloadCertificate: Object.assign(downloadCertificate, downloadCertificate),
}

export default verify