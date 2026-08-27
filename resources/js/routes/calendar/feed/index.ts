import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CalendarController::rotate
* @see app/Http/Controllers/CalendarController.php:132
* @route '/calendar/feed/rotate'
*/
export const rotate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rotate.url(options),
    method: 'post',
})

rotate.definition = {
    methods: ["post"],
    url: '/calendar/feed/rotate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CalendarController::rotate
* @see app/Http/Controllers/CalendarController.php:132
* @route '/calendar/feed/rotate'
*/
rotate.url = (options?: RouteQueryOptions) => {
    return rotate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarController::rotate
* @see app/Http/Controllers/CalendarController.php:132
* @route '/calendar/feed/rotate'
*/
rotate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rotate.url(options),
    method: 'post',
})

const feed = {
    rotate: Object.assign(rotate, rotate),
}

export default feed