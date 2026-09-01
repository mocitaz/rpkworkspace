import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import feed041e10 from './feed'
import exportMethod from './export'
import google from './google'
/**
* @see \App\Http\Controllers\CalendarController::feed
* @see app/Http/Controllers/CalendarController.php:82
* @route '/calendar/feed/{token}.ics'
*/
export const feed = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feed.url(args, options),
    method: 'get',
})

feed.definition = {
    methods: ["get","head"],
    url: '/calendar/feed/{token}.ics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CalendarController::feed
* @see app/Http/Controllers/CalendarController.php:82
* @route '/calendar/feed/{token}.ics'
*/
feed.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        token: args.token,
    }

    return feed.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarController::feed
* @see app/Http/Controllers/CalendarController.php:82
* @route '/calendar/feed/{token}.ics'
*/
feed.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feed.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::feed
* @see app/Http/Controllers/CalendarController.php:82
* @route '/calendar/feed/{token}.ics'
*/
feed.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: feed.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CalendarController::feed
* @see app/Http/Controllers/CalendarController.php:82
* @route '/calendar/feed/{token}.ics'
*/
const feedForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: feed.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::feed
* @see app/Http/Controllers/CalendarController.php:82
* @route '/calendar/feed/{token}.ics'
*/
feedForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: feed.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::feed
* @see app/Http/Controllers/CalendarController.php:82
* @route '/calendar/feed/{token}.ics'
*/
feedForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: feed.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

feed.form = feedForm

/**
* @see \App\Http\Controllers\CalendarController::__invoke
* @see app/Http/Controllers/CalendarController.php:27
* @route '/calendar'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/calendar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CalendarController::__invoke
* @see app/Http/Controllers/CalendarController.php:27
* @route '/calendar'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarController::__invoke
* @see app/Http/Controllers/CalendarController.php:27
* @route '/calendar'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::__invoke
* @see app/Http/Controllers/CalendarController.php:27
* @route '/calendar'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CalendarController::__invoke
* @see app/Http/Controllers/CalendarController.php:27
* @route '/calendar'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::__invoke
* @see app/Http/Controllers/CalendarController.php:27
* @route '/calendar'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::__invoke
* @see app/Http/Controllers/CalendarController.php:27
* @route '/calendar'
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

const calendar = {
    feed: Object.assign(feed, feed041e10),
    index: Object.assign(index, index),
    export: Object.assign(exportMethod, exportMethod),
    google: Object.assign(google, google),
}

export default calendar