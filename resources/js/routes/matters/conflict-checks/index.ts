import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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

/**
* @see \App\Http\Controllers\MatterController::store
* @see app/Http/Controllers/MatterController.php:87
* @route '/matters/conflict-checks'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterController::store
* @see app/Http/Controllers/MatterController.php:87
* @route '/matters/conflict-checks'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const conflictChecks = {
    store: Object.assign(store, store),
}

export default conflictChecks