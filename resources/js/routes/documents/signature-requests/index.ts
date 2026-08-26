import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SignatureRequestController::store
* @see app/Http/Controllers/SignatureRequestController.php:13
* @route '/documents/{document}/signature-requests'
*/
export const store = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/documents/{document}/signature-requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SignatureRequestController::store
* @see app/Http/Controllers/SignatureRequestController.php:13
* @route '/documents/{document}/signature-requests'
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
* @see \App\Http\Controllers\SignatureRequestController::store
* @see app/Http/Controllers/SignatureRequestController.php:13
* @route '/documents/{document}/signature-requests'
*/
store.post = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SignatureRequestController::store
* @see app/Http/Controllers/SignatureRequestController.php:13
* @route '/documents/{document}/signature-requests'
*/
const storeForm = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SignatureRequestController::store
* @see app/Http/Controllers/SignatureRequestController.php:13
* @route '/documents/{document}/signature-requests'
*/
storeForm.post = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const signatureRequests = {
    store: Object.assign(store, store),
}

export default signatureRequests