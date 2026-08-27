import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DocumentApprovalController::store
* @see app/Http/Controllers/DocumentApprovalController.php:16
* @route '/documents/{document}/approvals'
*/
export const store = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/documents/{document}/approvals',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentApprovalController::store
* @see app/Http/Controllers/DocumentApprovalController.php:16
* @route '/documents/{document}/approvals'
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
* @see \App\Http\Controllers\DocumentApprovalController::store
* @see app/Http/Controllers/DocumentApprovalController.php:16
* @route '/documents/{document}/approvals'
*/
store.post = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentApprovalController::resolve
* @see app/Http/Controllers/DocumentApprovalController.php:26
* @route '/document-approvals/{approval}'
*/
export const resolve = (args: { approval: string | { id: string } } | [approval: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resolve.url(args, options),
    method: 'patch',
})

resolve.definition = {
    methods: ["patch"],
    url: '/document-approvals/{approval}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\DocumentApprovalController::resolve
* @see app/Http/Controllers/DocumentApprovalController.php:26
* @route '/document-approvals/{approval}'
*/
resolve.url = (args: { approval: string | { id: string } } | [approval: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { approval: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { approval: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            approval: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        approval: typeof args.approval === 'object'
        ? args.approval.id
        : args.approval,
    }

    return resolve.definition.url
            .replace('{approval}', parsedArgs.approval.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentApprovalController::resolve
* @see app/Http/Controllers/DocumentApprovalController.php:26
* @route '/document-approvals/{approval}'
*/
resolve.patch = (args: { approval: string | { id: string } } | [approval: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resolve.url(args, options),
    method: 'patch',
})

const DocumentApprovalController = { store, resolve }

export default DocumentApprovalController