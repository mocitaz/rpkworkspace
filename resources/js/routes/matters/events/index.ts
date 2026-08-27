import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import checklist from './checklist'
/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:46
* @route '/matters/{matter}/events'
*/
export const store = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/matters/{matter}/events',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:46
* @route '/matters/{matter}/events'
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
* @see app/Http/Controllers/MatterOperationController.php:46
* @route '/matters/{matter}/events'
*/
store.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::update
* @see app/Http/Controllers/MatterOperationController.php:68
* @route '/matters/{matter}/events/{event}'
*/
export const update = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/matters/{matter}/events/{event}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\MatterOperationController::update
* @see app/Http/Controllers/MatterOperationController.php:68
* @route '/matters/{matter}/events/{event}'
*/
update.url = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            matter: args[0],
            event: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
        event: typeof args.event === 'object'
        ? args.event.id
        : args.event,
    }

    return update.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::update
* @see app/Http/Controllers/MatterOperationController.php:68
* @route '/matters/{matter}/events/{event}'
*/
update.put = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:207
* @route '/matters/{matter}/events/{event}'
*/
export const destroy = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/matters/{matter}/events/{event}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:207
* @route '/matters/{matter}/events/{event}'
*/
destroy.url = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            matter: args[0],
            event: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
        event: typeof args.event === 'object'
        ? args.event.id
        : args.event,
    }

    return destroy.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:207
* @route '/matters/{matter}/events/{event}'
*/
destroy.delete = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MatterOperationController::outcome
* @see app/Http/Controllers/MatterOperationController.php:242
* @route '/matters/{matter}/events/{event}/outcome'
*/
export const outcome = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: outcome.url(args, options),
    method: 'post',
})

outcome.definition = {
    methods: ["post"],
    url: '/matters/{matter}/events/{event}/outcome',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MatterOperationController::outcome
* @see app/Http/Controllers/MatterOperationController.php:242
* @route '/matters/{matter}/events/{event}/outcome'
*/
outcome.url = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            matter: args[0],
            event: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
        event: typeof args.event === 'object'
        ? args.event.id
        : args.event,
    }

    return outcome.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::outcome
* @see app/Http/Controllers/MatterOperationController.php:242
* @route '/matters/{matter}/events/{event}/outcome'
*/
outcome.post = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: outcome.url(args, options),
    method: 'post',
})

const events = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    checklist: Object.assign(checklist, checklist),
    outcome: Object.assign(outcome, outcome),
}

export default events