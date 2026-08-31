import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\GoogleCalendarController::redirect
* @see app/Http/Controllers/GoogleCalendarController.php:14
* @route '/calendar/google/connect'
*/
export const redirect = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

redirect.definition = {
    methods: ["get","head"],
    url: '/calendar/google/connect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GoogleCalendarController::redirect
* @see app/Http/Controllers/GoogleCalendarController.php:14
* @route '/calendar/google/connect'
*/
redirect.url = (options?: RouteQueryOptions) => {
    return redirect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GoogleCalendarController::redirect
* @see app/Http/Controllers/GoogleCalendarController.php:14
* @route '/calendar/google/connect'
*/
redirect.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::redirect
* @see app/Http/Controllers/GoogleCalendarController.php:14
* @route '/calendar/google/connect'
*/
redirect.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirect.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::redirect
* @see app/Http/Controllers/GoogleCalendarController.php:14
* @route '/calendar/google/connect'
*/
const redirectForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::redirect
* @see app/Http/Controllers/GoogleCalendarController.php:14
* @route '/calendar/google/connect'
*/
redirectForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::redirect
* @see app/Http/Controllers/GoogleCalendarController.php:14
* @route '/calendar/google/connect'
*/
redirectForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

redirect.form = redirectForm

/**
* @see \App\Http\Controllers\GoogleCalendarController::callback
* @see app/Http/Controllers/GoogleCalendarController.php:22
* @route '/calendar/google/callback'
*/
export const callback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

callback.definition = {
    methods: ["get","head"],
    url: '/calendar/google/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GoogleCalendarController::callback
* @see app/Http/Controllers/GoogleCalendarController.php:22
* @route '/calendar/google/callback'
*/
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GoogleCalendarController::callback
* @see app/Http/Controllers/GoogleCalendarController.php:22
* @route '/calendar/google/callback'
*/
callback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::callback
* @see app/Http/Controllers/GoogleCalendarController.php:22
* @route '/calendar/google/callback'
*/
callback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::callback
* @see app/Http/Controllers/GoogleCalendarController.php:22
* @route '/calendar/google/callback'
*/
const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: callback.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::callback
* @see app/Http/Controllers/GoogleCalendarController.php:22
* @route '/calendar/google/callback'
*/
callbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: callback.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::callback
* @see app/Http/Controllers/GoogleCalendarController.php:22
* @route '/calendar/google/callback'
*/
callbackForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: callback.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

callback.form = callbackForm

/**
* @see \App\Http\Controllers\GoogleCalendarController::update
* @see app/Http/Controllers/GoogleCalendarController.php:41
* @route '/calendar/google/settings'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/calendar/google/settings',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\GoogleCalendarController::update
* @see app/Http/Controllers/GoogleCalendarController.php:41
* @route '/calendar/google/settings'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GoogleCalendarController::update
* @see app/Http/Controllers/GoogleCalendarController.php:41
* @route '/calendar/google/settings'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::update
* @see app/Http/Controllers/GoogleCalendarController.php:41
* @route '/calendar/google/settings'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::update
* @see app/Http/Controllers/GoogleCalendarController.php:41
* @route '/calendar/google/settings'
*/
updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\GoogleCalendarController::sync
* @see app/Http/Controllers/GoogleCalendarController.php:57
* @route '/calendar/google/sync'
*/
export const sync = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(options),
    method: 'post',
})

sync.definition = {
    methods: ["post"],
    url: '/calendar/google/sync',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GoogleCalendarController::sync
* @see app/Http/Controllers/GoogleCalendarController.php:57
* @route '/calendar/google/sync'
*/
sync.url = (options?: RouteQueryOptions) => {
    return sync.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GoogleCalendarController::sync
* @see app/Http/Controllers/GoogleCalendarController.php:57
* @route '/calendar/google/sync'
*/
sync.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::sync
* @see app/Http/Controllers/GoogleCalendarController.php:57
* @route '/calendar/google/sync'
*/
const syncForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sync.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::sync
* @see app/Http/Controllers/GoogleCalendarController.php:57
* @route '/calendar/google/sync'
*/
syncForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sync.url(options),
    method: 'post',
})

sync.form = syncForm

/**
* @see \App\Http\Controllers\GoogleCalendarController::destroy
* @see app/Http/Controllers/GoogleCalendarController.php:65
* @route '/calendar/google'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/calendar/google',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GoogleCalendarController::destroy
* @see app/Http/Controllers/GoogleCalendarController.php:65
* @route '/calendar/google'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GoogleCalendarController::destroy
* @see app/Http/Controllers/GoogleCalendarController.php:65
* @route '/calendar/google'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::destroy
* @see app/Http/Controllers/GoogleCalendarController.php:65
* @route '/calendar/google'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GoogleCalendarController::destroy
* @see app/Http/Controllers/GoogleCalendarController.php:65
* @route '/calendar/google'
*/
destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const google = {
    redirect: Object.assign(redirect, redirect),
    callback: Object.assign(callback, callback),
    update: Object.assign(update, update),
    sync: Object.assign(sync, sync),
    destroy: Object.assign(destroy, destroy),
}

export default google