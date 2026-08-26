import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FinanceDetailController::invoice
* @see app/Http/Controllers/FinanceDetailController.php:17
* @route '/finance/invoices/{invoice}'
*/
export const invoice = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})

invoice.definition = {
    methods: ["get","head"],
    url: '/finance/invoices/{invoice}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceDetailController::invoice
* @see app/Http/Controllers/FinanceDetailController.php:17
* @route '/finance/invoices/{invoice}'
*/
invoice.url = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invoice: typeof args.invoice === 'object'
        ? args.invoice.id
        : args.invoice,
    }

    return invoice.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceDetailController::invoice
* @see app/Http/Controllers/FinanceDetailController.php:17
* @route '/finance/invoices/{invoice}'
*/
invoice.get = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::invoice
* @see app/Http/Controllers/FinanceDetailController.php:17
* @route '/finance/invoices/{invoice}'
*/
invoice.head = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: invoice.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::invoice
* @see app/Http/Controllers/FinanceDetailController.php:17
* @route '/finance/invoices/{invoice}'
*/
const invoiceForm = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: invoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::invoice
* @see app/Http/Controllers/FinanceDetailController.php:17
* @route '/finance/invoices/{invoice}'
*/
invoiceForm.get = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: invoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::invoice
* @see app/Http/Controllers/FinanceDetailController.php:17
* @route '/finance/invoices/{invoice}'
*/
invoiceForm.head = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: invoice.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

invoice.form = invoiceForm

/**
* @see \App\Http\Controllers\FinanceDetailController::payment
* @see app/Http/Controllers/FinanceDetailController.php:35
* @route '/finance/payments/{payment}'
*/
export const payment = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payment.url(args, options),
    method: 'get',
})

payment.definition = {
    methods: ["get","head"],
    url: '/finance/payments/{payment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceDetailController::payment
* @see app/Http/Controllers/FinanceDetailController.php:35
* @route '/finance/payments/{payment}'
*/
payment.url = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return payment.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceDetailController::payment
* @see app/Http/Controllers/FinanceDetailController.php:35
* @route '/finance/payments/{payment}'
*/
payment.get = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::payment
* @see app/Http/Controllers/FinanceDetailController.php:35
* @route '/finance/payments/{payment}'
*/
payment.head = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payment.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::payment
* @see app/Http/Controllers/FinanceDetailController.php:35
* @route '/finance/payments/{payment}'
*/
const paymentForm = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::payment
* @see app/Http/Controllers/FinanceDetailController.php:35
* @route '/finance/payments/{payment}'
*/
paymentForm.get = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::payment
* @see app/Http/Controllers/FinanceDetailController.php:35
* @route '/finance/payments/{payment}'
*/
paymentForm.head = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

payment.form = paymentForm

/**
* @see \App\Http\Controllers\FinanceDetailController::paymentReceipt
* @see app/Http/Controllers/FinanceDetailController.php:47
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
* @see app/Http/Controllers/FinanceDetailController.php:47
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
* @see app/Http/Controllers/FinanceDetailController.php:47
* @route '/finance/payments/{payment}/receipt'
*/
paymentReceipt.get = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentReceipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::paymentReceipt
* @see app/Http/Controllers/FinanceDetailController.php:47
* @route '/finance/payments/{payment}/receipt'
*/
paymentReceipt.head = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: paymentReceipt.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::paymentReceipt
* @see app/Http/Controllers/FinanceDetailController.php:47
* @route '/finance/payments/{payment}/receipt'
*/
const paymentReceiptForm = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: paymentReceipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::paymentReceipt
* @see app/Http/Controllers/FinanceDetailController.php:47
* @route '/finance/payments/{payment}/receipt'
*/
paymentReceiptForm.get = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: paymentReceipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::paymentReceipt
* @see app/Http/Controllers/FinanceDetailController.php:47
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

const FinanceDetailController = { invoice, payment, paymentReceipt }

export default FinanceDetailController