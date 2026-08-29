import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:673
* @route '/finance/payrolls'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/finance/payrolls',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:673
* @route '/finance/payrolls'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:673
* @route '/finance/payrolls'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:673
* @route '/finance/payrolls'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:673
* @route '/finance/payrolls'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:724
* @route '/finance/payrolls/{payroll}'
*/
export const update = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/finance/payrolls/{payroll}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:724
* @route '/finance/payrolls/{payroll}'
*/
update.url = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payroll: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payroll: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payroll: typeof args.payroll === 'object'
        ? args.payroll.id
        : args.payroll,
    }

    return update.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:724
* @route '/finance/payrolls/{payroll}'
*/
update.put = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:724
* @route '/finance/payrolls/{payroll}'
*/
const updateForm = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:724
* @route '/finance/payrolls/{payroll}'
*/
updateForm.put = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\FinanceController::status
* @see app/Http/Controllers/FinanceController.php:795
* @route '/finance/payrolls/{payroll}/status'
*/
export const status = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: status.url(args, options),
    method: 'patch',
})

status.definition = {
    methods: ["patch"],
    url: '/finance/payrolls/{payroll}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\FinanceController::status
* @see app/Http/Controllers/FinanceController.php:795
* @route '/finance/payrolls/{payroll}/status'
*/
status.url = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payroll: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payroll: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payroll: typeof args.payroll === 'object'
        ? args.payroll.id
        : args.payroll,
    }

    return status.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::status
* @see app/Http/Controllers/FinanceController.php:795
* @route '/finance/payrolls/{payroll}/status'
*/
status.patch = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: status.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\FinanceController::status
* @see app/Http/Controllers/FinanceController.php:795
* @route '/finance/payrolls/{payroll}/status'
*/
const statusForm = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: status.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::status
* @see app/Http/Controllers/FinanceController.php:795
* @route '/finance/payrolls/{payroll}/status'
*/
statusForm.patch = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: status.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

status.form = statusForm

/**
* @see \App\Http\Controllers\FinanceController::slip
* @see app/Http/Controllers/FinanceController.php:817
* @route '/finance/payrolls/{payroll}/slip'
*/
export const slip = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: slip.url(args, options),
    method: 'get',
})

slip.definition = {
    methods: ["get","head"],
    url: '/finance/payrolls/{payroll}/slip',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceController::slip
* @see app/Http/Controllers/FinanceController.php:817
* @route '/finance/payrolls/{payroll}/slip'
*/
slip.url = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payroll: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payroll: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payroll: typeof args.payroll === 'object'
        ? args.payroll.id
        : args.payroll,
    }

    return slip.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::slip
* @see app/Http/Controllers/FinanceController.php:817
* @route '/finance/payrolls/{payroll}/slip'
*/
slip.get = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: slip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::slip
* @see app/Http/Controllers/FinanceController.php:817
* @route '/finance/payrolls/{payroll}/slip'
*/
slip.head = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: slip.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FinanceController::slip
* @see app/Http/Controllers/FinanceController.php:817
* @route '/finance/payrolls/{payroll}/slip'
*/
const slipForm = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: slip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::slip
* @see app/Http/Controllers/FinanceController.php:817
* @route '/finance/payrolls/{payroll}/slip'
*/
slipForm.get = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: slip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::slip
* @see app/Http/Controllers/FinanceController.php:817
* @route '/finance/payrolls/{payroll}/slip'
*/
slipForm.head = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: slip.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

slip.form = slipForm

const payrolls = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    status: Object.assign(status, status),
    slip: Object.assign(slip, slip),
}

export default payrolls