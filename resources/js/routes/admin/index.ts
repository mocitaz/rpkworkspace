import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import audit from './audit'
import users from './users'
import roles from './roles'
/**
* @see \App\Http\Controllers\SystemReadinessController::__invoke
* @see app/Http/Controllers/SystemReadinessController.php:11
* @route '/admin/system-readiness'
*/
export const systemReadiness = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: systemReadiness.url(options),
    method: 'get',
})

systemReadiness.definition = {
    methods: ["get","head"],
    url: '/admin/system-readiness',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SystemReadinessController::__invoke
* @see app/Http/Controllers/SystemReadinessController.php:11
* @route '/admin/system-readiness'
*/
systemReadiness.url = (options?: RouteQueryOptions) => {
    return systemReadiness.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemReadinessController::__invoke
* @see app/Http/Controllers/SystemReadinessController.php:11
* @route '/admin/system-readiness'
*/
systemReadiness.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: systemReadiness.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SystemReadinessController::__invoke
* @see app/Http/Controllers/SystemReadinessController.php:11
* @route '/admin/system-readiness'
*/
systemReadiness.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: systemReadiness.url(options),
    method: 'head',
})

const admin = {
    audit: Object.assign(audit, audit),
    systemReadiness: Object.assign(systemReadiness, systemReadiness),
    users: Object.assign(users, users),
    roles: Object.assign(roles, roles),
}

export default admin