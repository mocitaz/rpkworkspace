import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MatterController::store
* @see app/Http/Controllers/MatterController.php:87
* @route '/matters/conflict-checks'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/matters/conflict-checks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MatterController::store
* @see app/Http/Controllers/MatterController.php:87
* @route '/matters/conflict-checks'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterController::store
* @see app/Http/Controllers/MatterController.php:87
* @route '/matters/conflict-checks'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

const conflictChecks = {
    store: Object.assign(store, store),
}

export default conflictChecks