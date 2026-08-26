import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ClientController::store
* @see app/Http/Controllers/ClientController.php:149
* @route '/clients/{client}/compliance-documents'
*/
export const store = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/clients/{client}/compliance-documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClientController::store
* @see app/Http/Controllers/ClientController.php:149
* @route '/clients/{client}/compliance-documents'
*/
store.url = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { client: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { client: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            client: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        client: typeof args.client === 'object'
        ? args.client.id
        : args.client,
    }

    return store.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientController::store
* @see app/Http/Controllers/ClientController.php:149
* @route '/clients/{client}/compliance-documents'
*/
store.post = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ClientController::store
* @see app/Http/Controllers/ClientController.php:149
* @route '/clients/{client}/compliance-documents'
*/
const storeForm = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ClientController::store
* @see app/Http/Controllers/ClientController.php:149
* @route '/clients/{client}/compliance-documents'
*/
storeForm.post = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ClientController::update
* @see app/Http/Controllers/ClientController.php:177
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
export const update = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/clients/{client}/compliance-documents/{complianceDocument}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ClientController::update
* @see app/Http/Controllers/ClientController.php:177
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
update.url = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            client: args[0],
            complianceDocument: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        client: typeof args.client === 'object'
        ? args.client.id
        : args.client,
        complianceDocument: typeof args.complianceDocument === 'object'
        ? args.complianceDocument.id
        : args.complianceDocument,
    }

    return update.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace('{complianceDocument}', parsedArgs.complianceDocument.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientController::update
* @see app/Http/Controllers/ClientController.php:177
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
update.put = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ClientController::update
* @see app/Http/Controllers/ClientController.php:177
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
const updateForm = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ClientController::update
* @see app/Http/Controllers/ClientController.php:177
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
updateForm.put = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ClientController::destroy
* @see app/Http/Controllers/ClientController.php:201
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
export const destroy = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/clients/{client}/compliance-documents/{complianceDocument}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ClientController::destroy
* @see app/Http/Controllers/ClientController.php:201
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
destroy.url = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            client: args[0],
            complianceDocument: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        client: typeof args.client === 'object'
        ? args.client.id
        : args.client,
        complianceDocument: typeof args.complianceDocument === 'object'
        ? args.complianceDocument.id
        : args.complianceDocument,
    }

    return destroy.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace('{complianceDocument}', parsedArgs.complianceDocument.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientController::destroy
* @see app/Http/Controllers/ClientController.php:201
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
destroy.delete = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ClientController::destroy
* @see app/Http/Controllers/ClientController.php:201
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
const destroyForm = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ClientController::destroy
* @see app/Http/Controllers/ClientController.php:201
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
destroyForm.delete = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const compliance = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default compliance