import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:67
* @route '/finance/matters/{matter}/contract'
*/
export const update = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/finance/matters/{matter}/contract',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:67
* @route '/finance/matters/{matter}/contract'
*/
update.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { matter: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { matter: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            matter: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
    }

    return update.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:67
* @route '/finance/matters/{matter}/contract'
*/
update.patch = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:67
* @route '/finance/matters/{matter}/contract'
*/
const updateForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:67
* @route '/finance/matters/{matter}/contract'
*/
updateForm.patch = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const contract = {
    update: Object.assign(update, update),
}

export default contract