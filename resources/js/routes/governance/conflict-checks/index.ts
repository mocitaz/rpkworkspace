import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:152
* @route '/governance/conflict-checks'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/governance/conflict-checks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:152
* @route '/governance/conflict-checks'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:152
* @route '/governance/conflict-checks'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:152
* @route '/governance/conflict-checks'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:152
* @route '/governance/conflict-checks'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\GovernanceController::resolve
* @see app/Http/Controllers/GovernanceController.php:168
* @route '/governance/conflict-checks/{conflictCheck}'
*/
export const resolve = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resolve.url(args, options),
    method: 'patch',
})

resolve.definition = {
    methods: ["patch"],
    url: '/governance/conflict-checks/{conflictCheck}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\GovernanceController::resolve
* @see app/Http/Controllers/GovernanceController.php:168
* @route '/governance/conflict-checks/{conflictCheck}'
*/
resolve.url = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conflictCheck: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { conflictCheck: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            conflictCheck: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        conflictCheck: typeof args.conflictCheck === 'object'
        ? args.conflictCheck.id
        : args.conflictCheck,
    }

    return resolve.definition.url
            .replace('{conflictCheck}', parsedArgs.conflictCheck.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::resolve
* @see app/Http/Controllers/GovernanceController.php:168
* @route '/governance/conflict-checks/{conflictCheck}'
*/
resolve.patch = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resolve.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\GovernanceController::resolve
* @see app/Http/Controllers/GovernanceController.php:168
* @route '/governance/conflict-checks/{conflictCheck}'
*/
const resolveForm = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::resolve
* @see app/Http/Controllers/GovernanceController.php:168
* @route '/governance/conflict-checks/{conflictCheck}'
*/
resolveForm.patch = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

resolve.form = resolveForm

const conflictChecks = {
    store: Object.assign(store, store),
    resolve: Object.assign(resolve, resolve),
}

export default conflictChecks