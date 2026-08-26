import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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

/**
* @see \App\Http\Controllers\GuideController::index
* @see app/Http/Controllers/GuideController.php:14
* @route '/guide'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GuideController::index
* @see app/Http/Controllers/GuideController.php:14
* @route '/guide'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GuideController::index
* @see app/Http/Controllers/GuideController.php:14
* @route '/guide'
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

const GuideController = { index }

export default GuideController