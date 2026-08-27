import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:102
* @route '/matters/{matter}/evidences'
*/
export const store = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/matters/{matter}/evidences',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:102
* @route '/matters/{matter}/evidences'
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
* @see app/Http/Controllers/MatterOperationController.php:102
* @route '/matters/{matter}/evidences'
*/
store.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::update
* @see app/Http/Controllers/MatterOperationController.php:132
* @route '/matters/{matter}/evidences/{evidence}'
*/
export const update = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/matters/{matter}/evidences/{evidence}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\MatterOperationController::update
* @see app/Http/Controllers/MatterOperationController.php:132
* @route '/matters/{matter}/evidences/{evidence}'
*/
update.url = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            matter: args[0],
            evidence: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
        evidence: typeof args.evidence === 'object'
        ? args.evidence.id
        : args.evidence,
    }

    return update.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{evidence}', parsedArgs.evidence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::update
* @see app/Http/Controllers/MatterOperationController.php:132
* @route '/matters/{matter}/evidences/{evidence}'
*/
update.put = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:159
* @route '/matters/{matter}/evidences/{evidence}'
*/
export const destroy = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/matters/{matter}/evidences/{evidence}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:159
* @route '/matters/{matter}/evidences/{evidence}'
*/
destroy.url = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            matter: args[0],
            evidence: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
        evidence: typeof args.evidence === 'object'
        ? args.evidence.id
        : args.evidence,
    }

    return destroy.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{evidence}', parsedArgs.evidence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:159
* @route '/matters/{matter}/evidences/{evidence}'
*/
destroy.delete = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const evidences = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default evidences