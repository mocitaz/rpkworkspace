import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FinanceDetailController::paymentReceipt
* @see app/Http/Controllers/FinanceDetailController.php:14
* @route '/finance/payments/{payment}/receipt'
*/
export const paymentReceipt = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentReceipt.url(args, options),
    method: 'get',
})

paymentReceipt.definition = {
    methods: ["get","head"],
    url: '/finance/payments/{payment}/receipt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceDetailController::paymentReceipt
* @see app/Http/Controllers/FinanceDetailController.php:14
* @route '/finance/payments/{payment}/receipt'
*/
paymentReceipt.url = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: typeof args.payment === 'object'
        ? args.payment.id
        : args.payment,
    }

    return paymentReceipt.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceDetailController::paymentReceipt
* @see app/Http/Controllers/FinanceDetailController.php:14
* @route '/finance/payments/{payment}/receipt'
*/
paymentReceipt.get = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentReceipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::paymentReceipt
* @see app/Http/Controllers/FinanceDetailController.php:14
* @route '/finance/payments/{payment}/receipt'
*/
paymentReceipt.head = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: paymentReceipt.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::paymentReceipt
* @see app/Http/Controllers/FinanceDetailController.php:14
* @route '/finance/payments/{payment}/receipt'
*/
const paymentReceiptForm = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: paymentReceipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::paymentReceipt
* @see app/Http/Controllers/FinanceDetailController.php:14
* @route '/finance/payments/{payment}/receipt'
*/
paymentReceiptForm.get = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: paymentReceipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::paymentReceipt
* @see app/Http/Controllers/FinanceDetailController.php:14
* @route '/finance/payments/{payment}/receipt'
*/
paymentReceiptForm.head = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: paymentReceipt.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

paymentReceipt.form = paymentReceiptForm

const FinanceDetailController = { paymentReceipt }

export default FinanceDetailController