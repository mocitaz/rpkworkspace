import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MatterController::index
* @see app/Http/Controllers/MatterController.php:30
* @route '/matters'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/matters',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MatterController::index
* @see app/Http/Controllers/MatterController.php:30
* @route '/matters'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterController::index
* @see app/Http/Controllers/MatterController.php:30
* @route '/matters'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterController::index
* @see app/Http/Controllers/MatterController.php:30
* @route '/matters'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MatterController::index
* @see app/Http/Controllers/MatterController.php:30
* @route '/matters'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterController::index
* @see app/Http/Controllers/MatterController.php:30
* @route '/matters'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterController::index
* @see app/Http/Controllers/MatterController.php:30
* @route '/matters'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\MatterController::create
* @see app/Http/Controllers/MatterController.php:53
* @route '/matters/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/matters/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MatterController::create
* @see app/Http/Controllers/MatterController.php:53
* @route '/matters/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterController::create
* @see app/Http/Controllers/MatterController.php:53
* @route '/matters/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterController::create
* @see app/Http/Controllers/MatterController.php:53
* @route '/matters/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MatterController::create
* @see app/Http/Controllers/MatterController.php:53
* @route '/matters/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterController::create
* @see app/Http/Controllers/MatterController.php:53
* @route '/matters/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterController::create
* @see app/Http/Controllers/MatterController.php:53
* @route '/matters/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\MatterController::store
* @see app/Http/Controllers/MatterController.php:76
* @route '/matters'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/matters',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MatterController::store
* @see app/Http/Controllers/MatterController.php:76
* @route '/matters'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterController::store
* @see app/Http/Controllers/MatterController.php:76
* @route '/matters'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterController::store
* @see app/Http/Controllers/MatterController.php:76
* @route '/matters'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterController::store
* @see app/Http/Controllers/MatterController.php:76
* @route '/matters'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MatterController::show
* @see app/Http/Controllers/MatterController.php:103
* @route '/matters/{matter}'
*/
export const show = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/matters/{matter}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MatterController::show
* @see app/Http/Controllers/MatterController.php:103
* @route '/matters/{matter}'
*/
show.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterController::show
* @see app/Http/Controllers/MatterController.php:103
* @route '/matters/{matter}'
*/
show.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterController::show
* @see app/Http/Controllers/MatterController.php:103
* @route '/matters/{matter}'
*/
show.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MatterController::show
* @see app/Http/Controllers/MatterController.php:103
* @route '/matters/{matter}'
*/
const showForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterController::show
* @see app/Http/Controllers/MatterController.php:103
* @route '/matters/{matter}'
*/
showForm.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterController::show
* @see app/Http/Controllers/MatterController.php:103
* @route '/matters/{matter}'
*/
showForm.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MatterController::edit
* @see app/Http/Controllers/MatterController.php:138
* @route '/matters/{matter}/edit'
*/
export const edit = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/matters/{matter}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MatterController::edit
* @see app/Http/Controllers/MatterController.php:138
* @route '/matters/{matter}/edit'
*/
edit.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterController::edit
* @see app/Http/Controllers/MatterController.php:138
* @route '/matters/{matter}/edit'
*/
edit.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterController::edit
* @see app/Http/Controllers/MatterController.php:138
* @route '/matters/{matter}/edit'
*/
edit.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MatterController::edit
* @see app/Http/Controllers/MatterController.php:138
* @route '/matters/{matter}/edit'
*/
const editForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterController::edit
* @see app/Http/Controllers/MatterController.php:138
* @route '/matters/{matter}/edit'
*/
editForm.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterController::edit
* @see app/Http/Controllers/MatterController.php:138
* @route '/matters/{matter}/edit'
*/
editForm.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\MatterController::update
* @see app/Http/Controllers/MatterController.php:162
* @route '/matters/{matter}'
*/
export const update = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/matters/{matter}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MatterController::update
* @see app/Http/Controllers/MatterController.php:162
* @route '/matters/{matter}'
*/
update.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterController::update
* @see app/Http/Controllers/MatterController.php:162
* @route '/matters/{matter}'
*/
update.put = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MatterController::update
* @see app/Http/Controllers/MatterController.php:162
* @route '/matters/{matter}'
*/
update.patch = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MatterController::update
* @see app/Http/Controllers/MatterController.php:162
* @route '/matters/{matter}'
*/
const updateForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterController::update
* @see app/Http/Controllers/MatterController.php:162
* @route '/matters/{matter}'
*/
updateForm.put = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterController::update
* @see app/Http/Controllers/MatterController.php:162
* @route '/matters/{matter}'
*/
updateForm.patch = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\MatterController::storeConflictCheck
* @see app/Http/Controllers/MatterController.php:87
* @route '/matters/conflict-checks'
*/
export const storeConflictCheck = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConflictCheck.url(options),
    method: 'post',
})

storeConflictCheck.definition = {
    methods: ["post"],
    url: '/matters/conflict-checks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MatterController::storeConflictCheck
* @see app/Http/Controllers/MatterController.php:87
* @route '/matters/conflict-checks'
*/
storeConflictCheck.url = (options?: RouteQueryOptions) => {
    return storeConflictCheck.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterController::storeConflictCheck
* @see app/Http/Controllers/MatterController.php:87
* @route '/matters/conflict-checks'
*/
storeConflictCheck.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConflictCheck.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterController::storeConflictCheck
* @see app/Http/Controllers/MatterController.php:87
* @route '/matters/conflict-checks'
*/
const storeConflictCheckForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeConflictCheck.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterController::storeConflictCheck
* @see app/Http/Controllers/MatterController.php:87
* @route '/matters/conflict-checks'
*/
storeConflictCheckForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeConflictCheck.url(options),
    method: 'post',
})

storeConflictCheck.form = storeConflictCheckForm

const MatterController = { index, create, store, show, edit, update, storeConflictCheck }

export default MatterController