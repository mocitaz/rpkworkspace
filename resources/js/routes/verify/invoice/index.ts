import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:41
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
export const qr = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})

qr.definition = {
    methods: ["get","head"],
    url: '/verify/invoice/{invoiceNumber}/qr.svg',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:41
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
qr.url = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoiceNumber: args }
    }

    if (Array.isArray(args)) {
        args = {
            invoiceNumber: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invoiceNumber: args.invoiceNumber,
    }

    return qr.definition.url
            .replace('{invoiceNumber}', parsedArgs.invoiceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:41
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
qr.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:41
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
qr.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: qr.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:41
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
const qrForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: qr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:41
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
qrForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: qr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:41
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
qrForm.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: qr.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

qr.form = qrForm

const invoice = {
    qr: Object.assign(qr, qr),
}

export default invoice