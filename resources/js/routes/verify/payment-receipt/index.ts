import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:201
* @route '/verify/payment-receipt/{referenceNumber}/qr.svg'
*/
export const qr = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})

qr.definition = {
    methods: ["get","head"],
    url: '/verify/payment-receipt/{referenceNumber}/qr.svg',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:201
* @route '/verify/payment-receipt/{referenceNumber}/qr.svg'
*/
qr.url = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { referenceNumber: args }
    }

    if (Array.isArray(args)) {
        args = {
            referenceNumber: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        referenceNumber: args.referenceNumber,
    }

    return qr.definition.url
            .replace('{referenceNumber}', parsedArgs.referenceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:201
* @route '/verify/payment-receipt/{referenceNumber}/qr.svg'
*/
qr.get = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:201
* @route '/verify/payment-receipt/{referenceNumber}/qr.svg'
*/
qr.head = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: qr.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:201
* @route '/verify/payment-receipt/{referenceNumber}/qr.svg'
*/
const qrForm = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: qr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:201
* @route '/verify/payment-receipt/{referenceNumber}/qr.svg'
*/
qrForm.get = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: qr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:201
* @route '/verify/payment-receipt/{referenceNumber}/qr.svg'
*/
qrForm.head = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: qr.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

qr.form = qrForm

const paymentReceipt = {
    qr: Object.assign(qr, qr),
}

export default paymentReceipt