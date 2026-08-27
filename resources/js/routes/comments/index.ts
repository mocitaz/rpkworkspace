import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:24
* @route '/comments'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:24
* @route '/comments'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:24
* @route '/comments'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:24
* @route '/comments'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:24
* @route '/comments'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\CommentController::reaction
* @see app/Http/Controllers/CommentController.php:115
* @route '/comments/{comment}/reaction'
*/
export const reaction = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reaction.url(args, options),
    method: 'post',
})

reaction.definition = {
    methods: ["post"],
    url: '/comments/{comment}/reaction',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommentController::reaction
* @see app/Http/Controllers/CommentController.php:115
* @route '/comments/{comment}/reaction'
*/
reaction.url = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { comment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { comment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            comment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return reaction.definition.url
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::reaction
* @see app/Http/Controllers/CommentController.php:115
* @route '/comments/{comment}/reaction'
*/
reaction.post = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reaction.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::reaction
* @see app/Http/Controllers/CommentController.php:115
* @route '/comments/{comment}/reaction'
*/
const reactionForm = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reaction.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::reaction
* @see app/Http/Controllers/CommentController.php:115
* @route '/comments/{comment}/reaction'
*/
reactionForm.post = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reaction.url(args, options),
    method: 'post',
})

reaction.form = reactionForm

/**
* @see \App\Http\Controllers\CommentController::pin
* @see app/Http/Controllers/CommentController.php:139
* @route '/comments/{comment}/pin'
*/
export const pin = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pin.url(args, options),
    method: 'post',
})

pin.definition = {
    methods: ["post"],
    url: '/comments/{comment}/pin',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommentController::pin
* @see app/Http/Controllers/CommentController.php:139
* @route '/comments/{comment}/pin'
*/
pin.url = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { comment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { comment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            comment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return pin.definition.url
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::pin
* @see app/Http/Controllers/CommentController.php:139
* @route '/comments/{comment}/pin'
*/
pin.post = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pin.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::pin
* @see app/Http/Controllers/CommentController.php:139
* @route '/comments/{comment}/pin'
*/
const pinForm = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pin.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::pin
* @see app/Http/Controllers/CommentController.php:139
* @route '/comments/{comment}/pin'
*/
pinForm.post = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pin.url(args, options),
    method: 'post',
})

pin.form = pinForm

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:157
* @route '/comments/{comment}'
*/
export const destroy = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/comments/{comment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:157
* @route '/comments/{comment}'
*/
destroy.url = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { comment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { comment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            comment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return destroy.definition.url
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:157
* @route '/comments/{comment}'
*/
destroy.delete = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:157
* @route '/comments/{comment}'
*/
const destroyForm = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:157
* @route '/comments/{comment}'
*/
destroyForm.delete = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const comments = {
    store: Object.assign(store, store),
    reaction: Object.assign(reaction, reaction),
    pin: Object.assign(pin, pin),
    destroy: Object.assign(destroy, destroy),
}

export default comments