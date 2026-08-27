import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:157
* @route '/verify/quotation/{quotationNumber}/qr.svg'
*/
export const qr = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})

qr.definition = {
    methods: ["get","head"],
    url: '/verify/quotation/{quotationNumber}/qr.svg',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:157
* @route '/verify/quotation/{quotationNumber}/qr.svg'
*/
qr.url = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { quotationNumber: args }
    }

    if (Array.isArray(args)) {
        args = {
            quotationNumber: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        quotationNumber: args.quotationNumber,
    }

    return qr.definition.url
            .replace('{quotationNumber}', parsedArgs.quotationNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:157
* @route '/verify/quotation/{quotationNumber}/qr.svg'
*/
qr.get = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:157
* @route '/verify/quotation/{quotationNumber}/qr.svg'
*/
qr.head = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: qr.url(args, options),
    method: 'head',
})

const quotation = {
    qr: Object.assign(qr, qr),
}

export default quotation