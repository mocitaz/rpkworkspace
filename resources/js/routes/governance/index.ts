import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import correspondences from './correspondences'
import conflictChecks from './conflict-checks'
import matters from './matters'
import exports from './exports'
/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:35
* @route '/governance'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/governance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:35
* @route '/governance'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:35
* @route '/governance'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:35
* @route '/governance'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:35
* @route '/governance'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:35
* @route '/governance'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:35
* @route '/governance'
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

const governance = {
    index: Object.assign(index, index),
    correspondences: Object.assign(correspondences, correspondences),
    conflictChecks: Object.assign(conflictChecks, conflictChecks),
    matters: Object.assign(matters, matters),
    exports: Object.assign(exports, exports),
}

export default governance