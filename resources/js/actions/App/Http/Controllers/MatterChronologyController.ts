import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\MatterChronologyController::store
* @see app/Http/Controllers/MatterChronologyController.php:16
* @route '/matters/{matter}/chronologies'
*/
const storeForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterChronologyController::store
* @see app/Http/Controllers/MatterChronologyController.php:16
* @route '/matters/{matter}/chronologies'
*/
storeForm.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

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
* @see \App\Http\Controllers\MatterChronologyController::destroy
* @see app/Http/Controllers/MatterChronologyController.php:42
* @route '/matters/{matter}/chronologies/{chronology}'
*/
const destroyForm = (args: { matter: string | { id: string }, chronology: string | { id: string } } | [matter: string | { id: string }, chronology: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterChronologyController::destroy
* @see app/Http/Controllers/MatterChronologyController.php:42
* @route '/matters/{matter}/chronologies/{chronology}'
*/
destroyForm.delete = (args: { matter: string | { id: string }, chronology: string | { id: string } } | [matter: string | { id: string }, chronology: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\MatterChronologyController::exportPdf
* @see app/Http/Controllers/MatterChronologyController.php:57
* @route '/matters/{matter}/chronologies/pdf'
*/
export const exportPdf = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(args, options),
    method: 'get',
})

exportPdf.definition = {
    methods: ["get","head"],
    url: '/matters/{matter}/chronologies/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MatterChronologyController::exportPdf
* @see app/Http/Controllers/MatterChronologyController.php:57
* @route '/matters/{matter}/chronologies/pdf'
*/
exportPdf.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return exportPdf.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterChronologyController::exportPdf
* @see app/Http/Controllers/MatterChronologyController.php:57
* @route '/matters/{matter}/chronologies/pdf'
*/
exportPdf.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterChronologyController::exportPdf
* @see app/Http/Controllers/MatterChronologyController.php:57
* @route '/matters/{matter}/chronologies/pdf'
*/
exportPdf.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportPdf.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MatterChronologyController::exportPdf
* @see app/Http/Controllers/MatterChronologyController.php:57
* @route '/matters/{matter}/chronologies/pdf'
*/
const exportPdfForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportPdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterChronologyController::exportPdf
* @see app/Http/Controllers/MatterChronologyController.php:57
* @route '/matters/{matter}/chronologies/pdf'
*/
exportPdfForm.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportPdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterChronologyController::exportPdf
* @see app/Http/Controllers/MatterChronologyController.php:57
* @route '/matters/{matter}/chronologies/pdf'
*/
exportPdfForm.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportPdf.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportPdf.form = exportPdfForm

const MatterChronologyController = { store, destroy, exportPdf }

export default MatterChronologyController