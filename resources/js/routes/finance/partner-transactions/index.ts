import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:440
* @route '/finance/partner-transactions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/finance/partner-transactions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:440
* @route '/finance/partner-transactions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:440
* @route '/finance/partner-transactions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:440
* @route '/finance/partner-transactions'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:440
* @route '/finance/partner-transactions'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:503
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
export const update = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/finance/partner-transactions/{partnerTransaction}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:503
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
update.url = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { partnerTransaction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { partnerTransaction: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            partnerTransaction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        partnerTransaction: typeof args.partnerTransaction === 'object'
        ? args.partnerTransaction.id
        : args.partnerTransaction,
    }

    return update.definition.url
            .replace('{partnerTransaction}', parsedArgs.partnerTransaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:503
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
update.put = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:503
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
const updateForm = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/FinanceController.php:503
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
updateForm.put = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\FinanceController::destroy
* @see app/Http/Controllers/FinanceController.php:586
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
export const destroy = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/finance/partner-transactions/{partnerTransaction}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FinanceController::destroy
* @see app/Http/Controllers/FinanceController.php:586
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
destroy.url = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { partnerTransaction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { partnerTransaction: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            partnerTransaction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        partnerTransaction: typeof args.partnerTransaction === 'object'
        ? args.partnerTransaction.id
        : args.partnerTransaction,
    }

    return destroy.definition.url
            .replace('{partnerTransaction}', parsedArgs.partnerTransaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::destroy
* @see app/Http/Controllers/FinanceController.php:586
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
destroy.delete = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\FinanceController::destroy
* @see app/Http/Controllers/FinanceController.php:586
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
const destroyForm = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::destroy
* @see app/Http/Controllers/FinanceController.php:586
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
destroyForm.delete = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const partnerTransactions = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default partnerTransactions