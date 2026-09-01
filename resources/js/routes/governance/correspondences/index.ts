import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import attachments from './attachments'
/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:101
* @route '/governance/correspondences'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/governance/correspondences',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:101
* @route '/governance/correspondences'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:101
* @route '/governance/correspondences'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:101
* @route '/governance/correspondences'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:101
* @route '/governance/correspondences'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\GovernanceController::show
* @see app/Http/Controllers/GovernanceController.php:113
* @route '/governance/correspondences/{correspondence}'
*/
export const show = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/governance/correspondences/{correspondence}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GovernanceController::show
* @see app/Http/Controllers/GovernanceController.php:113
* @route '/governance/correspondences/{correspondence}'
*/
show.url = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { correspondence: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { correspondence: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            correspondence: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        correspondence: typeof args.correspondence === 'object'
        ? args.correspondence.id
        : args.correspondence,
    }

    return show.definition.url
            .replace('{correspondence}', parsedArgs.correspondence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::show
* @see app/Http/Controllers/GovernanceController.php:113
* @route '/governance/correspondences/{correspondence}'
*/
show.get = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::show
* @see app/Http/Controllers/GovernanceController.php:113
* @route '/governance/correspondences/{correspondence}'
*/
show.head = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GovernanceController::show
* @see app/Http/Controllers/GovernanceController.php:113
* @route '/governance/correspondences/{correspondence}'
*/
const showForm = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::show
* @see app/Http/Controllers/GovernanceController.php:113
* @route '/governance/correspondences/{correspondence}'
*/
showForm.get = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::show
* @see app/Http/Controllers/GovernanceController.php:113
* @route '/governance/correspondences/{correspondence}'
*/
showForm.head = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\GovernanceController::destroy
* @see app/Http/Controllers/GovernanceController.php:148
* @route '/governance/correspondences/{correspondence}'
*/
export const destroy = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/governance/correspondences/{correspondence}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GovernanceController::destroy
* @see app/Http/Controllers/GovernanceController.php:148
* @route '/governance/correspondences/{correspondence}'
*/
destroy.url = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { correspondence: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { correspondence: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            correspondence: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        correspondence: typeof args.correspondence === 'object'
        ? args.correspondence.id
        : args.correspondence,
    }

    return destroy.definition.url
            .replace('{correspondence}', parsedArgs.correspondence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::destroy
* @see app/Http/Controllers/GovernanceController.php:148
* @route '/governance/correspondences/{correspondence}'
*/
destroy.delete = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\GovernanceController::destroy
* @see app/Http/Controllers/GovernanceController.php:148
* @route '/governance/correspondences/{correspondence}'
*/
const destroyForm = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::destroy
* @see app/Http/Controllers/GovernanceController.php:148
* @route '/governance/correspondences/{correspondence}'
*/
destroyForm.delete = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const correspondences = {
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    destroy: Object.assign(destroy, destroy),
    attachments: Object.assign(attachments, attachments),
}

export default correspondences