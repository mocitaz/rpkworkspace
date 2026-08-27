import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SystemReadinessController::__invoke
* @see app/Http/Controllers/SystemReadinessController.php:11
* @route '/admin/system-readiness'
*/
const SystemReadinessController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SystemReadinessController.url(options),
    method: 'get',
})

SystemReadinessController.definition = {
    methods: ["get","head"],
    url: '/admin/system-readiness',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SystemReadinessController::__invoke
* @see app/Http/Controllers/SystemReadinessController.php:11
* @route '/admin/system-readiness'
*/
SystemReadinessController.url = (options?: RouteQueryOptions) => {
    return SystemReadinessController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemReadinessController::__invoke
* @see app/Http/Controllers/SystemReadinessController.php:11
* @route '/admin/system-readiness'
*/
SystemReadinessController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SystemReadinessController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SystemReadinessController::__invoke
* @see app/Http/Controllers/SystemReadinessController.php:11
* @route '/admin/system-readiness'
*/
SystemReadinessController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: SystemReadinessController.url(options),
    method: 'head',
})

export default SystemReadinessController