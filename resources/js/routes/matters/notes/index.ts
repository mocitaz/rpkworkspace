import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:66
* @route '/matters/{matter}/notes'
*/
export const store = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/matters/{matter}/notes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:66
* @route '/matters/{matter}/notes'
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
* @see app/Http/Controllers/MatterOperationController.php:66
* @route '/matters/{matter}/notes'
*/
store.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:66
* @route '/matters/{matter}/notes'
*/
const storeForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:66
* @route '/matters/{matter}/notes'
*/
storeForm.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:197
* @route '/matters/{matter}/notes/{note}'
*/
export const destroy = (args: { matter: string | { id: string }, note: string | { id: string } } | [matter: string | { id: string }, note: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/matters/{matter}/notes/{note}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:197
* @route '/matters/{matter}/notes/{note}'
*/
destroy.url = (args: { matter: string | { id: string }, note: string | { id: string } } | [matter: string | { id: string }, note: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            matter: args[0],
            note: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
        note: typeof args.note === 'object'
        ? args.note.id
        : args.note,
    }

    return destroy.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{note}', parsedArgs.note.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:197
* @route '/matters/{matter}/notes/{note}'
*/
destroy.delete = (args: { matter: string | { id: string }, note: string | { id: string } } | [matter: string | { id: string }, note: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:197
* @route '/matters/{matter}/notes/{note}'
*/
const destroyForm = (args: { matter: string | { id: string }, note: string | { id: string } } | [matter: string | { id: string }, note: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/MatterOperationController.php:197
* @route '/matters/{matter}/notes/{note}'
*/
destroyForm.delete = (args: { matter: string | { id: string }, note: string | { id: string } } | [matter: string | { id: string }, note: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const notes = {
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default notes