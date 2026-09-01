import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\GovernanceController::download
* @see app/Http/Controllers/GovernanceController.php:295
* @route '/governance/exports/{matterExport}/download'
*/
export const download = (args: { matterExport: string | { id: string } } | [matterExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/governance/exports/{matterExport}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GovernanceController::download
* @see app/Http/Controllers/GovernanceController.php:295
* @route '/governance/exports/{matterExport}/download'
*/
download.url = (args: { matterExport: string | { id: string } } | [matterExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { matterExport: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { matterExport: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            matterExport: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matterExport: typeof args.matterExport === 'object'
        ? args.matterExport.id
        : args.matterExport,
    }

    return download.definition.url
            .replace('{matterExport}', parsedArgs.matterExport.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::download
* @see app/Http/Controllers/GovernanceController.php:295
* @route '/governance/exports/{matterExport}/download'
*/
download.get = (args: { matterExport: string | { id: string } } | [matterExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::download
* @see app/Http/Controllers/GovernanceController.php:295
* @route '/governance/exports/{matterExport}/download'
*/
download.head = (args: { matterExport: string | { id: string } } | [matterExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GovernanceController::download
* @see app/Http/Controllers/GovernanceController.php:295
* @route '/governance/exports/{matterExport}/download'
*/
const downloadForm = (args: { matterExport: string | { id: string } } | [matterExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::download
* @see app/Http/Controllers/GovernanceController.php:295
* @route '/governance/exports/{matterExport}/download'
*/
downloadForm.get = (args: { matterExport: string | { id: string } } | [matterExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::download
* @see app/Http/Controllers/GovernanceController.php:295
* @route '/governance/exports/{matterExport}/download'
*/
downloadForm.head = (args: { matterExport: string | { id: string } } | [matterExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

const exports = {
    download: Object.assign(download, download),
}

export default exports