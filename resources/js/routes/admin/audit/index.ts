import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AuditLogController::index
* @see app/Http/Controllers/AuditLogController.php:22
* @route '/admin/audit'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/audit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditLogController::index
* @see app/Http/Controllers/AuditLogController.php:22
* @route '/admin/audit'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditLogController::index
* @see app/Http/Controllers/AuditLogController.php:22
* @route '/admin/audit'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditLogController::index
* @see app/Http/Controllers/AuditLogController.php:22
* @route '/admin/audit'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuditLogController::index
* @see app/Http/Controllers/AuditLogController.php:22
* @route '/admin/audit'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditLogController::index
* @see app/Http/Controllers/AuditLogController.php:22
* @route '/admin/audit'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditLogController::index
* @see app/Http/Controllers/AuditLogController.php:22
* @route '/admin/audit'
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

/**
* @see \App\Http\Controllers\AuditLogController::exportMethod
* @see app/Http/Controllers/AuditLogController.php:50
* @route '/admin/audit/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/admin/audit/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditLogController::exportMethod
* @see app/Http/Controllers/AuditLogController.php:50
* @route '/admin/audit/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditLogController::exportMethod
* @see app/Http/Controllers/AuditLogController.php:50
* @route '/admin/audit/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditLogController::exportMethod
* @see app/Http/Controllers/AuditLogController.php:50
* @route '/admin/audit/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuditLogController::exportMethod
* @see app/Http/Controllers/AuditLogController.php:50
* @route '/admin/audit/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditLogController::exportMethod
* @see app/Http/Controllers/AuditLogController.php:50
* @route '/admin/audit/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuditLogController::exportMethod
* @see app/Http/Controllers/AuditLogController.php:50
* @route '/admin/audit/export'
*/
exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

/**
* @see \App\Http\Controllers\AuditLogController::prune
* @see app/Http/Controllers/AuditLogController.php:117
* @route '/admin/audit/prune'
*/
export const prune = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: prune.url(options),
    method: 'post',
})

prune.definition = {
    methods: ["post"],
    url: '/admin/audit/prune',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuditLogController::prune
* @see app/Http/Controllers/AuditLogController.php:117
* @route '/admin/audit/prune'
*/
prune.url = (options?: RouteQueryOptions) => {
    return prune.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditLogController::prune
* @see app/Http/Controllers/AuditLogController.php:117
* @route '/admin/audit/prune'
*/
prune.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: prune.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuditLogController::prune
* @see app/Http/Controllers/AuditLogController.php:117
* @route '/admin/audit/prune'
*/
const pruneForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: prune.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuditLogController::prune
* @see app/Http/Controllers/AuditLogController.php:117
* @route '/admin/audit/prune'
*/
pruneForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: prune.url(options),
    method: 'post',
})

prune.form = pruneForm

const audit = {
    index: Object.assign(index, index),
    export: Object.assign(exportMethod, exportMethod),
    prune: Object.assign(prune, prune),
}

export default audit