import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ClientController::index
* @see app/Http/Controllers/ClientController.php:26
* @route '/clients'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/clients',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClientController::index
* @see app/Http/Controllers/ClientController.php:26
* @route '/clients'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientController::index
* @see app/Http/Controllers/ClientController.php:26
* @route '/clients'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ClientController::index
* @see app/Http/Controllers/ClientController.php:26
* @route '/clients'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ClientController::create
* @see app/Http/Controllers/ClientController.php:44
* @route '/clients/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/clients/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClientController::create
* @see app/Http/Controllers/ClientController.php:44
* @route '/clients/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientController::create
* @see app/Http/Controllers/ClientController.php:44
* @route '/clients/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ClientController::create
* @see app/Http/Controllers/ClientController.php:44
* @route '/clients/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ClientController::store
* @see app/Http/Controllers/ClientController.php:56
* @route '/clients'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/clients',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClientController::store
* @see app/Http/Controllers/ClientController.php:56
* @route '/clients'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientController::store
* @see app/Http/Controllers/ClientController.php:56
* @route '/clients'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ClientController::show
* @see app/Http/Controllers/ClientController.php:79
* @route '/clients/{client}'
*/
export const show = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/clients/{client}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClientController::show
* @see app/Http/Controllers/ClientController.php:79
* @route '/clients/{client}'
*/
show.url = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientController::show
* @see app/Http/Controllers/ClientController.php:79
* @route '/clients/{client}'
*/
show.get = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ClientController::show
* @see app/Http/Controllers/ClientController.php:79
* @route '/clients/{client}'
*/
show.head = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ClientController::edit
* @see app/Http/Controllers/ClientController.php:111
* @route '/clients/{client}/edit'
*/
export const edit = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/clients/{client}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClientController::edit
* @see app/Http/Controllers/ClientController.php:111
* @route '/clients/{client}/edit'
*/
edit.url = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientController::edit
* @see app/Http/Controllers/ClientController.php:111
* @route '/clients/{client}/edit'
*/
edit.get = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ClientController::edit
* @see app/Http/Controllers/ClientController.php:111
* @route '/clients/{client}/edit'
*/
edit.head = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ClientController::update
* @see app/Http/Controllers/ClientController.php:128
* @route '/clients/{client}'
*/
export const update = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/clients/{client}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ClientController::update
* @see app/Http/Controllers/ClientController.php:128
* @route '/clients/{client}'
*/
update.url = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientController::update
* @see app/Http/Controllers/ClientController.php:128
* @route '/clients/{client}'
*/
update.put = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ClientController::update
* @see app/Http/Controllers/ClientController.php:128
* @route '/clients/{client}'
*/
update.patch = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ClientController::storeComplianceDocument
* @see app/Http/Controllers/ClientController.php:149
* @route '/clients/{client}/compliance-documents'
*/
export const storeComplianceDocument = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeComplianceDocument.url(args, options),
    method: 'post',
})

storeComplianceDocument.definition = {
    methods: ["post"],
    url: '/clients/{client}/compliance-documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClientController::storeComplianceDocument
* @see app/Http/Controllers/ClientController.php:149
* @route '/clients/{client}/compliance-documents'
*/
storeComplianceDocument.url = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return storeComplianceDocument.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientController::storeComplianceDocument
* @see app/Http/Controllers/ClientController.php:149
* @route '/clients/{client}/compliance-documents'
*/
storeComplianceDocument.post = (args: { client: string | { id: string } } | [client: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeComplianceDocument.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ClientController::updateComplianceDocument
* @see app/Http/Controllers/ClientController.php:177
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
export const updateComplianceDocument = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateComplianceDocument.url(args, options),
    method: 'put',
})

updateComplianceDocument.definition = {
    methods: ["put"],
    url: '/clients/{client}/compliance-documents/{complianceDocument}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ClientController::updateComplianceDocument
* @see app/Http/Controllers/ClientController.php:177
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
updateComplianceDocument.url = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions) => {
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

    return updateComplianceDocument.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace('{complianceDocument}', parsedArgs.complianceDocument.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientController::updateComplianceDocument
* @see app/Http/Controllers/ClientController.php:177
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
updateComplianceDocument.put = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateComplianceDocument.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ClientController::destroyComplianceDocument
* @see app/Http/Controllers/ClientController.php:201
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
export const destroyComplianceDocument = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyComplianceDocument.url(args, options),
    method: 'delete',
})

destroyComplianceDocument.definition = {
    methods: ["delete"],
    url: '/clients/{client}/compliance-documents/{complianceDocument}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ClientController::destroyComplianceDocument
* @see app/Http/Controllers/ClientController.php:201
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
destroyComplianceDocument.url = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions) => {
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

    return destroyComplianceDocument.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace('{complianceDocument}', parsedArgs.complianceDocument.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientController::destroyComplianceDocument
* @see app/Http/Controllers/ClientController.php:201
* @route '/clients/{client}/compliance-documents/{complianceDocument}'
*/
destroyComplianceDocument.delete = (args: { client: string | { id: string }, complianceDocument: string | { id: string } } | [client: string | { id: string }, complianceDocument: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyComplianceDocument.url(args, options),
    method: 'delete',
})

const ClientController = { index, create, store, show, edit, update, storeComplianceDocument, updateComplianceDocument, destroyComplianceDocument }

export default ClientController