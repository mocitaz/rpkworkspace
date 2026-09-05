import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\FinanceController::upload
* @see app/Http/Controllers/FinanceController.php:1054
* @route '/finance/{entity}/{id}/proof'
*/
export const upload = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(args, options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/finance/{entity}/{id}/proof',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::upload
* @see app/Http/Controllers/FinanceController.php:1054
* @route '/finance/{entity}/{id}/proof'
*/
upload.url = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            entity: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        entity: args.entity,
        id: args.id,
    }

    return upload.definition.url
            .replace('{entity}', parsedArgs.entity.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::upload
* @see app/Http/Controllers/FinanceController.php:1054
* @route '/finance/{entity}/{id}/proof'
*/
upload.post = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::upload
* @see app/Http/Controllers/FinanceController.php:1054
* @route '/finance/{entity}/{id}/proof'
*/
const uploadForm = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: upload.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::upload
* @see app/Http/Controllers/FinanceController.php:1054
* @route '/finance/{entity}/{id}/proof'
*/
uploadForm.post = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: upload.url(args, options),
    method: 'post',
})

upload.form = uploadForm

/**
* @see \App\Http\Controllers\FinanceController::destroy
* @see app/Http/Controllers/FinanceController.php:1081
* @route '/finance/{entity}/{id}/proof'
*/
export const destroy = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/finance/{entity}/{id}/proof',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FinanceController::destroy
* @see app/Http/Controllers/FinanceController.php:1081
* @route '/finance/{entity}/{id}/proof'
*/
destroy.url = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            entity: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        entity: args.entity,
        id: args.id,
    }

    return destroy.definition.url
            .replace('{entity}', parsedArgs.entity.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::destroy
* @see app/Http/Controllers/FinanceController.php:1081
* @route '/finance/{entity}/{id}/proof'
*/
destroy.delete = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\FinanceController::destroy
* @see app/Http/Controllers/FinanceController.php:1081
* @route '/finance/{entity}/{id}/proof'
*/
const destroyForm = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::destroy
* @see app/Http/Controllers/FinanceController.php:1081
* @route '/finance/{entity}/{id}/proof'
*/
destroyForm.delete = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const proof = {
    upload: Object.assign(upload, upload),
    destroy: Object.assign(destroy, destroy),
}

export default proof