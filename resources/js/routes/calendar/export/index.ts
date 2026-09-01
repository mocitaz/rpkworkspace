import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CalendarController::ics
* @see app/Http/Controllers/CalendarController.php:152
* @route '/calendar/export/ics'
*/
export const ics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ics.url(options),
    method: 'get',
})

ics.definition = {
    methods: ["get","head"],
    url: '/calendar/export/ics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CalendarController::ics
* @see app/Http/Controllers/CalendarController.php:152
* @route '/calendar/export/ics'
*/
ics.url = (options?: RouteQueryOptions) => {
    return ics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarController::ics
* @see app/Http/Controllers/CalendarController.php:152
* @route '/calendar/export/ics'
*/
ics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::ics
* @see app/Http/Controllers/CalendarController.php:152
* @route '/calendar/export/ics'
*/
ics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CalendarController::ics
* @see app/Http/Controllers/CalendarController.php:152
* @route '/calendar/export/ics'
*/
const icsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::ics
* @see app/Http/Controllers/CalendarController.php:152
* @route '/calendar/export/ics'
*/
icsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::ics
* @see app/Http/Controllers/CalendarController.php:152
* @route '/calendar/export/ics'
*/
icsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ics.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ics.form = icsForm

const exportMethod = {
    ics: Object.assign(ics, ics),
}

export default exportMethod