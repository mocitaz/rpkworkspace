import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import conflictChecks from './conflict-checks'
import parties from './parties'
import deadlines from './deadlines'
import events from './events'
import notes from './notes'
import evidences from './evidences'
import chronologies from './chronologies'
import statusReport from './status-report'
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

const matters = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    conflictChecks: Object.assign(conflictChecks, conflictChecks),
    parties: Object.assign(parties, parties),
    deadlines: Object.assign(deadlines, deadlines),
    events: Object.assign(events, events),
    notes: Object.assign(notes, notes),
    evidences: Object.assign(evidences, evidences),
    chronologies: Object.assign(chronologies, chronologies),
    statusReport: Object.assign(statusReport, statusReport),
}

export default matters