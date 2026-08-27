import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MatterChronologyController::store
* @see app/Http/Controllers/MatterChronologyController.php:16
* @route '/matters/{matter}/chronologies'
*/
export const store = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/matters/{matter}/chronologies',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MatterChronologyController::store
* @see app/Http/Controllers/MatterChronologyController.php:16
* @route '/matters/{matter}/chronologies'
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
* @see \App\Http\Controllers\MatterChronologyController::store
* @see app/Http/Controllers/MatterChronologyController.php:16
* @route '/matters/{matter}/chronologies'
*/
store.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterChronologyController::destroy
* @see app/Http/Controllers/MatterChronologyController.php:42
* @route '/matters/{matter}/chronologies/{chronology}'
*/
export const destroy = (args: { matter: string | { id: string }, chronology: string | { id: string } } | [matter: string | { id: string }, chronology: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/matters/{matter}/chronologies/{chronology}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MatterChronologyController::destroy
* @see app/Http/Controllers/MatterChronologyController.php:42
* @route '/matters/{matter}/chronologies/{chronology}'
*/
destroy.url = (args: { matter: string | { id: string }, chronology: string | { id: string } } | [matter: string | { id: string }, chronology: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            matter: args[0],
            chronology: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
        chronology: typeof args.chronology === 'object'
        ? args.chronology.id
        : args.chronology,
    }

    return destroy.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{chronology}', parsedArgs.chronology.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterChronologyController::destroy
* @see app/Http/Controllers/MatterChronologyController.php:42
* @route '/matters/{matter}/chronologies/{chronology}'
*/
destroy.delete = (args: { matter: string | { id: string }, chronology: string | { id: string } } | [matter: string | { id: string }, chronology: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MatterChronologyController::pdf
* @see app/Http/Controllers/MatterChronologyController.php:57
* @route '/matters/{matter}/chronologies/pdf'
*/
export const pdf = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/matters/{matter}/chronologies/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MatterChronologyController::pdf
* @see app/Http/Controllers/MatterChronologyController.php:57
* @route '/matters/{matter}/chronologies/pdf'
*/
pdf.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return pdf.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterChronologyController::pdf
* @see app/Http/Controllers/MatterChronologyController.php:57
* @route '/matters/{matter}/chronologies/pdf'
*/
pdf.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterChronologyController::pdf
* @see app/Http/Controllers/MatterChronologyController.php:57
* @route '/matters/{matter}/chronologies/pdf'
*/
pdf.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

const chronologies = {
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
    pdf: Object.assign(pdf, pdf),
}

export default chronologies