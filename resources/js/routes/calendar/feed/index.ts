import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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

/**
* @see \App\Http\Controllers\CalendarController::rotate
* @see app/Http/Controllers/CalendarController.php:132
* @route '/calendar/feed/rotate'
*/
const rotateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rotate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CalendarController::rotate
* @see app/Http/Controllers/CalendarController.php:132
* @route '/calendar/feed/rotate'
*/
rotateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rotate.url(options),
    method: 'post',
})

rotate.form = rotateForm

const feed = {
    rotate: Object.assign(rotate, rotate),
}

export default feed