import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmailController::index
* @see app/Http/Controllers/EmailController.php:18
* @route '/email'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/email',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmailController::index
* @see app/Http/Controllers/EmailController.php:18
* @route '/email'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmailController::index
* @see app/Http/Controllers/EmailController.php:18
* @route '/email'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailController::index
* @see app/Http/Controllers/EmailController.php:18
* @route '/email'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmailController::index
* @see app/Http/Controllers/EmailController.php:18
* @route '/email'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailController::index
* @see app/Http/Controllers/EmailController.php:18
* @route '/email'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailController::index
* @see app/Http/Controllers/EmailController.php:18
* @route '/email'
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
* @see \App\Http\Controllers\EmailController::store
* @see app/Http/Controllers/EmailController.php:25
* @route '/email'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/email',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmailController::store
* @see app/Http/Controllers/EmailController.php:25
* @route '/email'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmailController::store
* @see app/Http/Controllers/EmailController.php:25
* @route '/email'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmailController::store
* @see app/Http/Controllers/EmailController.php:25
* @route '/email'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmailController::store
* @see app/Http/Controllers/EmailController.php:25
* @route '/email'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const EmailController = { index, store }

export default EmailController