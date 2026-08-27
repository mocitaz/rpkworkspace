import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:113
* @route '/verify/payslip/{payslipNumber}/qr.svg'
*/
export const qr = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})

qr.definition = {
    methods: ["get","head"],
    url: '/verify/payslip/{payslipNumber}/qr.svg',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:113
* @route '/verify/payslip/{payslipNumber}/qr.svg'
*/
qr.url = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payslipNumber: args }
    }

    if (Array.isArray(args)) {
        args = {
            payslipNumber: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payslipNumber: args.payslipNumber,
    }

    return qr.definition.url
            .replace('{payslipNumber}', parsedArgs.payslipNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:113
* @route '/verify/payslip/{payslipNumber}/qr.svg'
*/
qr.get = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:113
* @route '/verify/payslip/{payslipNumber}/qr.svg'
*/
qr.head = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: qr.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:113
* @route '/verify/payslip/{payslipNumber}/qr.svg'
*/
const qrForm = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: qr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:113
* @route '/verify/payslip/{payslipNumber}/qr.svg'
*/
qrForm.get = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: qr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:113
* @route '/verify/payslip/{payslipNumber}/qr.svg'
*/
qrForm.head = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: qr.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

qr.form = qrForm

const payslip = {
    qr: Object.assign(qr, qr),
}

export default payslip