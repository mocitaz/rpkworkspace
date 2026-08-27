import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\FinanceDetailController::show
* @see app/Http/Controllers/FinanceDetailController.php:39
* @route '/finance/payments/{payment}'
*/
export const show = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/finance/payments/{payment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceDetailController::show
* @see app/Http/Controllers/FinanceDetailController.php:39
* @route '/finance/payments/{payment}'
*/
show.url = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceDetailController::show
* @see app/Http/Controllers/FinanceDetailController.php:39
* @route '/finance/payments/{payment}'
*/
show.get = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::show
* @see app/Http/Controllers/FinanceDetailController.php:39
* @route '/finance/payments/{payment}'
*/
show.head = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::show
* @see app/Http/Controllers/FinanceDetailController.php:39
* @route '/finance/payments/{payment}'
*/
const showForm = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::show
* @see app/Http/Controllers/FinanceDetailController.php:39
* @route '/finance/payments/{payment}'
*/
showForm.get = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::show
* @see app/Http/Controllers/FinanceDetailController.php:39
* @route '/finance/payments/{payment}'
*/
showForm.head = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\FinanceDetailController::receipt
* @see app/Http/Controllers/FinanceDetailController.php:51
* @route '/finance/payments/{payment}/receipt'
*/
export const receipt = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipt.url(args, options),
    method: 'get',
})

receipt.definition = {
    methods: ["get","head"],
    url: '/finance/payments/{payment}/receipt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceDetailController::receipt
* @see app/Http/Controllers/FinanceDetailController.php:51
* @route '/finance/payments/{payment}/receipt'
*/
receipt.url = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return receipt.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceDetailController::receipt
* @see app/Http/Controllers/FinanceDetailController.php:51
* @route '/finance/payments/{payment}/receipt'
*/
receipt.get = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::receipt
* @see app/Http/Controllers/FinanceDetailController.php:51
* @route '/finance/payments/{payment}/receipt'
*/
receipt.head = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: receipt.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::receipt
* @see app/Http/Controllers/FinanceDetailController.php:51
* @route '/finance/payments/{payment}/receipt'
*/
const receiptForm = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: receipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::receipt
* @see app/Http/Controllers/FinanceDetailController.php:51
* @route '/finance/payments/{payment}/receipt'
*/
receiptForm.get = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: receipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceDetailController::receipt
* @see app/Http/Controllers/FinanceDetailController.php:51
* @route '/finance/payments/{payment}/receipt'
*/
receiptForm.head = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: receipt.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

receipt.form = receiptForm

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:324
* @route '/finance/payments'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/finance/payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:324
* @route '/finance/payments'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:324
* @route '/finance/payments'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:324
* @route '/finance/payments'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:324
* @route '/finance/payments'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\FinanceController::reverse
* @see app/Http/Controllers/FinanceController.php:360
* @route '/finance/payments/{payment}/reverse'
*/
export const reverse = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

reverse.definition = {
    methods: ["post"],
    url: '/finance/payments/{payment}/reverse',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::reverse
* @see app/Http/Controllers/FinanceController.php:360
* @route '/finance/payments/{payment}/reverse'
*/
reverse.url = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return reverse.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::reverse
* @see app/Http/Controllers/FinanceController.php:360
* @route '/finance/payments/{payment}/reverse'
*/
reverse.post = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::reverse
* @see app/Http/Controllers/FinanceController.php:360
* @route '/finance/payments/{payment}/reverse'
*/
const reverseForm = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::reverse
* @see app/Http/Controllers/FinanceController.php:360
* @route '/finance/payments/{payment}/reverse'
*/
reverseForm.post = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reverse.url(args, options),
    method: 'post',
})

reverse.form = reverseForm

/**
* @see \App\Http\Controllers\FinanceController::refund
* @see app/Http/Controllers/FinanceController.php:372
* @route '/finance/payments/{payment}/refund'
*/
export const refund = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refund.url(args, options),
    method: 'post',
})

refund.definition = {
    methods: ["post"],
    url: '/finance/payments/{payment}/refund',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::refund
* @see app/Http/Controllers/FinanceController.php:372
* @route '/finance/payments/{payment}/refund'
*/
refund.url = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return refund.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::refund
* @see app/Http/Controllers/FinanceController.php:372
* @route '/finance/payments/{payment}/refund'
*/
refund.post = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refund.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::refund
* @see app/Http/Controllers/FinanceController.php:372
* @route '/finance/payments/{payment}/refund'
*/
const refundForm = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: refund.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::refund
* @see app/Http/Controllers/FinanceController.php:372
* @route '/finance/payments/{payment}/refund'
*/
refundForm.post = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: refund.url(args, options),
    method: 'post',
})

refund.form = refundForm

const payments = {
    show: Object.assign(show, show),
    receipt: Object.assign(receipt, receipt),
    store: Object.assign(store, store),
    reverse: Object.assign(reverse, reverse),
    refund: Object.assign(refund, refund),
}

export default payments