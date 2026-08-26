import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:34
* @route '/matters/{matter}/deadlines'
*/
export const store = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/matters/{matter}/deadlines',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:34
* @route '/matters/{matter}/deadlines'
*/
store.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { matter: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { matter: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            matter: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
    }

    return store.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:34
* @route '/matters/{matter}/deadlines'
*/
store.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:34
* @route '/matters/{matter}/deadlines'
*/
const storeForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:34
* @route '/matters/{matter}/deadlines'
*/
storeForm.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:165
* @route '/matters/{matter}/deadlines/{deadline}'
*/
export const destroy = (args: { matter: string | { id: string }, deadline: string | { id: string } } | [matter: string | { id: string }, deadline: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/matters/{matter}/deadlines/{deadline}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:165
* @route '/matters/{matter}/deadlines/{deadline}'
*/
destroy.url = (args: { matter: string | { id: string }, deadline: string | { id: string } } | [matter: string | { id: string }, deadline: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            matter: args[0],
            deadline: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
        deadline: typeof args.deadline === 'object'
        ? args.deadline.id
        : args.deadline,
    }

    return destroy.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{deadline}', parsedArgs.deadline.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:165
* @route '/matters/{matter}/deadlines/{deadline}'
*/
destroy.delete = (args: { matter: string | { id: string }, deadline: string | { id: string } } | [matter: string | { id: string }, deadline: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:165
* @route '/matters/{matter}/deadlines/{deadline}'
*/
const destroyForm = (args: { matter: string | { id: string }, deadline: string | { id: string } } | [matter: string | { id: string }, deadline: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:165
* @route '/matters/{matter}/deadlines/{deadline}'
*/
destroyForm.delete = (args: { matter: string | { id: string }, deadline: string | { id: string } } | [matter: string | { id: string }, deadline: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const deadlines = {
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default deadlines