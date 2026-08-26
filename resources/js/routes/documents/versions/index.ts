import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DocumentVersionController::store
* @see app/Http/Controllers/DocumentVersionController.php:18
* @route '/documents/{document}/versions'
*/
export const store = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/documents/{document}/versions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentVersionController::store
* @see app/Http/Controllers/DocumentVersionController.php:18
* @route '/documents/{document}/versions'
*/
store.url = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { document: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            document: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        document: typeof args.document === 'object'
        ? args.document.id
        : args.document,
    }

    return store.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentVersionController::store
* @see app/Http/Controllers/DocumentVersionController.php:18
* @route '/documents/{document}/versions'
*/
store.post = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentVersionController::store
* @see app/Http/Controllers/DocumentVersionController.php:18
* @route '/documents/{document}/versions'
*/
const storeForm = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentVersionController::store
* @see app/Http/Controllers/DocumentVersionController.php:18
* @route '/documents/{document}/versions'
*/
storeForm.post = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\DocumentVersionController::download
* @see app/Http/Controllers/DocumentVersionController.php:30
* @route '/documents/{document}/versions/{version}/download'
*/
export const download = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/documents/{document}/versions/{version}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentVersionController::download
* @see app/Http/Controllers/DocumentVersionController.php:30
* @route '/documents/{document}/versions/{version}/download'
*/
download.url = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions) => {
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

    return download.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace('{version}', parsedArgs.version.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentVersionController::download
* @see app/Http/Controllers/DocumentVersionController.php:30
* @route '/documents/{document}/versions/{version}/download'
*/
download.get = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentVersionController::download
* @see app/Http/Controllers/DocumentVersionController.php:30
* @route '/documents/{document}/versions/{version}/download'
*/
download.head = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DocumentVersionController::download
* @see app/Http/Controllers/DocumentVersionController.php:30
* @route '/documents/{document}/versions/{version}/download'
*/
const downloadForm = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentVersionController::download
* @see app/Http/Controllers/DocumentVersionController.php:30
* @route '/documents/{document}/versions/{version}/download'
*/
downloadForm.get = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentVersionController::download
* @see app/Http/Controllers/DocumentVersionController.php:30
* @route '/documents/{document}/versions/{version}/download'
*/
downloadForm.head = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

/**
* @see \App\Http\Controllers\DocumentPreviewController::preview
* @see app/Http/Controllers/DocumentPreviewController.php:17
* @route '/documents/{document}/versions/{version}/preview'
*/
export const preview = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/documents/{document}/versions/{version}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentPreviewController::preview
* @see app/Http/Controllers/DocumentPreviewController.php:17
* @route '/documents/{document}/versions/{version}/preview'
*/
preview.url = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions) => {
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

    return preview.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace('{version}', parsedArgs.version.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentPreviewController::preview
* @see app/Http/Controllers/DocumentPreviewController.php:17
* @route '/documents/{document}/versions/{version}/preview'
*/
preview.get = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentPreviewController::preview
* @see app/Http/Controllers/DocumentPreviewController.php:17
* @route '/documents/{document}/versions/{version}/preview'
*/
preview.head = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DocumentPreviewController::preview
* @see app/Http/Controllers/DocumentPreviewController.php:17
* @route '/documents/{document}/versions/{version}/preview'
*/
const previewForm = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentPreviewController::preview
* @see app/Http/Controllers/DocumentPreviewController.php:17
* @route '/documents/{document}/versions/{version}/preview'
*/
previewForm.get = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentPreviewController::preview
* @see app/Http/Controllers/DocumentPreviewController.php:17
* @route '/documents/{document}/versions/{version}/preview'
*/
previewForm.head = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

preview.form = previewForm

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

/**
* @see \App\Http\Controllers\DocumentPreviewController::process
* @see app/Http/Controllers/DocumentPreviewController.php:43
* @route '/documents/{document}/versions/{version}/process'
*/
const processForm = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: process.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentPreviewController::process
* @see app/Http/Controllers/DocumentPreviewController.php:43
* @route '/documents/{document}/versions/{version}/process'
*/
processForm.post = (args: { document: string | { id: string }, version: string | { id: string } } | [document: string | { id: string }, version: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: process.url(args, options),
    method: 'post',
})

process.form = processForm

const versions = {
    store: Object.assign(store, store),
    download: Object.assign(download, download),
    preview: Object.assign(preview, preview),
    process: Object.assign(process, process),
}

export default versions