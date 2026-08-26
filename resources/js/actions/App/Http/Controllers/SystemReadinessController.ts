import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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

/**
* @see \App\Http\Controllers\SystemReadinessController::__invoke
* @see app/Http/Controllers/SystemReadinessController.php:11
* @route '/admin/system-readiness'
*/
const SystemReadinessControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: SystemReadinessController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SystemReadinessController::__invoke
* @see app/Http/Controllers/SystemReadinessController.php:11
* @route '/admin/system-readiness'
*/
SystemReadinessControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: SystemReadinessController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SystemReadinessController::__invoke
* @see app/Http/Controllers/SystemReadinessController.php:11
* @route '/admin/system-readiness'
*/
SystemReadinessControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: SystemReadinessController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

SystemReadinessController.form = SystemReadinessControllerForm

export default SystemReadinessController