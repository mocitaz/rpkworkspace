import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\InboundEmailController::store
* @see app/Http/Controllers/InboundEmailController.php:11
* @route '/inbound/email'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inbound/email',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InboundEmailController::store
* @see app/Http/Controllers/InboundEmailController.php:11
* @route '/inbound/email'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InboundEmailController::store
* @see app/Http/Controllers/InboundEmailController.php:11
* @route '/inbound/email'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InboundEmailController::store
* @see app/Http/Controllers/InboundEmailController.php:11
* @route '/inbound/email'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InboundEmailController::store
* @see app/Http/Controllers/InboundEmailController.php:11
* @route '/inbound/email'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const email = {
    store: Object.assign(store, store),
}

export default email