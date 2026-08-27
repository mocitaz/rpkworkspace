import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GuideController::index
* @see app/Http/Controllers/GuideController.php:14
* @route '/guide'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/guide',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GuideController::index
* @see app/Http/Controllers/GuideController.php:14
* @route '/guide'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GuideController::index
* @see app/Http/Controllers/GuideController.php:14
* @route '/guide'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GuideController::index
* @see app/Http/Controllers/GuideController.php:14
* @route '/guide'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const GuideController = { index }

export default GuideController