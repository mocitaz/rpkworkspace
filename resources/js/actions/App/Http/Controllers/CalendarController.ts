import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
const CalendarController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CalendarController.url(options),
    method: 'get',
})

CalendarController.definition = {
    methods: ["get","head"],
    url: '/calendar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CalendarController::__invoke
* @see app/Http/Controllers/CalendarController.php:27
* @route '/calendar'
*/
CalendarController.url = (options?: RouteQueryOptions) => {
    return CalendarController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarController::__invoke
* @see app/Http/Controllers/CalendarController.php:27
* @route '/calendar'
*/
CalendarController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CalendarController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::__invoke
* @see app/Http/Controllers/CalendarController.php:27
* @route '/calendar'
*/
CalendarController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CalendarController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CalendarController::__invoke
* @see app/Http/Controllers/CalendarController.php:27
* @route '/calendar'
*/
const CalendarControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CalendarController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::__invoke
* @see app/Http/Controllers/CalendarController.php:27
* @route '/calendar'
*/
CalendarControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CalendarController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::__invoke
* @see app/Http/Controllers/CalendarController.php:27
* @route '/calendar'
*/
CalendarControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CalendarController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

CalendarController.form = CalendarControllerForm

/**
* @see \App\Http\Controllers\CalendarController::exportIcs
* @see app/Http/Controllers/CalendarController.php:152
* @route '/calendar/export/ics'
*/
export const exportIcs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportIcs.url(options),
    method: 'get',
})

exportIcs.definition = {
    methods: ["get","head"],
    url: '/calendar/export/ics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CalendarController::exportIcs
* @see app/Http/Controllers/CalendarController.php:152
* @route '/calendar/export/ics'
*/
exportIcs.url = (options?: RouteQueryOptions) => {
    return exportIcs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarController::exportIcs
* @see app/Http/Controllers/CalendarController.php:152
* @route '/calendar/export/ics'
*/
exportIcs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportIcs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::exportIcs
* @see app/Http/Controllers/CalendarController.php:152
* @route '/calendar/export/ics'
*/
exportIcs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportIcs.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CalendarController::exportIcs
* @see app/Http/Controllers/CalendarController.php:152
* @route '/calendar/export/ics'
*/
const exportIcsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportIcs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::exportIcs
* @see app/Http/Controllers/CalendarController.php:152
* @route '/calendar/export/ics'
*/
exportIcsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportIcs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::exportIcs
* @see app/Http/Controllers/CalendarController.php:152
* @route '/calendar/export/ics'
*/
exportIcsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportIcs.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportIcs.form = exportIcsForm

/**
* @see \App\Http\Controllers\CalendarController::rotateToken
* @see app/Http/Controllers/CalendarController.php:142
* @route '/calendar/feed/rotate'
*/
export const rotateToken = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rotateToken.url(options),
    method: 'post',
})

rotateToken.definition = {
    methods: ["post"],
    url: '/calendar/feed/rotate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CalendarController::rotateToken
* @see app/Http/Controllers/CalendarController.php:142
* @route '/calendar/feed/rotate'
*/
rotateToken.url = (options?: RouteQueryOptions) => {
    return rotateToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarController::rotateToken
* @see app/Http/Controllers/CalendarController.php:142
* @route '/calendar/feed/rotate'
*/
rotateToken.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rotateToken.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CalendarController::rotateToken
* @see app/Http/Controllers/CalendarController.php:142
* @route '/calendar/feed/rotate'
*/
const rotateTokenForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rotateToken.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CalendarController::rotateToken
* @see app/Http/Controllers/CalendarController.php:142
* @route '/calendar/feed/rotate'
*/
rotateTokenForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rotateToken.url(options),
    method: 'post',
})

rotateToken.form = rotateTokenForm

CalendarController.feed = feed
CalendarController.exportIcs = exportIcs
CalendarController.rotateToken = rotateToken

export default CalendarController