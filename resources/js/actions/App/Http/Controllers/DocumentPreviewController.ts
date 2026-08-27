import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DocumentPreviewController::show
* @see app/Http/Controllers/DocumentPreviewController.php:17
* @route '/documents/{document}/versions/{version}/preview'
*/
export const show = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/documents/{document}/versions/{version}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentPreviewController::show
* @see app/Http/Controllers/DocumentPreviewController.php:17
* @route '/documents/{document}/versions/{version}/preview'
*/
show.url = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            document: args[0],
            version: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        document: typeof args.document === 'object'
        ? args.document.id
        : args.document,
        version: typeof args.version === 'object'
        ? args.version.id
        : args.version,
    }

    return show.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace('{version}', parsedArgs.version.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentPreviewController::show
* @see app/Http/Controllers/DocumentPreviewController.php:17
* @route '/documents/{document}/versions/{version}/preview'
*/
show.get = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentPreviewController::show
* @see app/Http/Controllers/DocumentPreviewController.php:17
* @route '/documents/{document}/versions/{version}/preview'
*/
show.head = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DocumentPreviewController::process
* @see app/Http/Controllers/DocumentPreviewController.php:43
* @route '/documents/{document}/versions/{version}/process'
*/
export const process = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(args, options),
    method: 'post',
})

process.definition = {
    methods: ["post"],
    url: '/documents/{document}/versions/{version}/process',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentPreviewController::process
* @see app/Http/Controllers/DocumentPreviewController.php:43
* @route '/documents/{document}/versions/{version}/process'
*/
process.url = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            document: args[0],
            version: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        document: typeof args.document === 'object'
        ? args.document.id
        : args.document,
        version: typeof args.version === 'object'
        ? args.version.id
        : args.version,
    }

    return process.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace('{version}', parsedArgs.version.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentPreviewController::process
* @see app/Http/Controllers/DocumentPreviewController.php:43
* @route '/documents/{document}/versions/{version}/process'
*/
process.post = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(args, options),
    method: 'post',
})

const DocumentPreviewController = { show, process }

export default DocumentPreviewController