import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:76
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
* @see app/Http/Controllers/MatterOperationController.php:76
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
* @see app/Http/Controllers/MatterOperationController.php:76
* @route '/matters/{matter}/evidences'
*/
store.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:76
* @route '/matters/{matter}/evidences'
*/
const storeForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::store
* @see app/Http/Controllers/MatterOperationController.php:76
* @route '/matters/{matter}/evidences'
*/
storeForm.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MatterOperationController::update
* @see app/Http/Controllers/MatterOperationController.php:106
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
* @see app/Http/Controllers/MatterOperationController.php:106
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
* @see app/Http/Controllers/MatterOperationController.php:106
* @route '/matters/{matter}/evidences/{evidence}'
*/
update.put = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MatterOperationController::update
* @see app/Http/Controllers/MatterOperationController.php:106
* @route '/matters/{matter}/evidences/{evidence}'
*/
const updateForm = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::update
* @see app/Http/Controllers/MatterOperationController.php:106
* @route '/matters/{matter}/evidences/{evidence}'
*/
updateForm.put = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:133
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
* @see app/Http/Controllers/MatterOperationController.php:133
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
* @see app/Http/Controllers/MatterOperationController.php:133
* @route '/matters/{matter}/evidences/{evidence}'
*/
destroy.delete = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroy
* @see app/Http/Controllers/MatterOperationController.php:133
* @route '/matters/{matter}/evidences/{evidence}'
*/
const destroyForm = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/MatterOperationController.php:133
* @route '/matters/{matter}/evidences/{evidence}'
*/
destroyForm.delete = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const evidences = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default evidences