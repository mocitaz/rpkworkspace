import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\CommentController::toggleReaction
* @see app/Http/Controllers/CommentController.php:115
* @route '/comments/{comment}/reaction'
*/
export const toggleReaction = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleReaction.url(args, options),
    method: 'post',
})

toggleReaction.definition = {
    methods: ["post"],
    url: '/comments/{comment}/reaction',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommentController::toggleReaction
* @see app/Http/Controllers/CommentController.php:115
* @route '/comments/{comment}/reaction'
*/
toggleReaction.url = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return toggleReaction.definition.url
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::toggleReaction
* @see app/Http/Controllers/CommentController.php:115
* @route '/comments/{comment}/reaction'
*/
toggleReaction.post = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleReaction.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::toggleReaction
* @see app/Http/Controllers/CommentController.php:115
* @route '/comments/{comment}/reaction'
*/
const toggleReactionForm = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleReaction.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::toggleReaction
* @see app/Http/Controllers/CommentController.php:115
* @route '/comments/{comment}/reaction'
*/
toggleReactionForm.post = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleReaction.url(args, options),
    method: 'post',
})

toggleReaction.form = toggleReactionForm

/**
* @see \App\Http\Controllers\CommentController::togglePin
* @see app/Http/Controllers/CommentController.php:139
* @route '/comments/{comment}/pin'
*/
export const togglePin = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: togglePin.url(args, options),
    method: 'post',
})

togglePin.definition = {
    methods: ["post"],
    url: '/comments/{comment}/pin',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommentController::togglePin
* @see app/Http/Controllers/CommentController.php:139
* @route '/comments/{comment}/pin'
*/
togglePin.url = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return togglePin.definition.url
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::togglePin
* @see app/Http/Controllers/CommentController.php:139
* @route '/comments/{comment}/pin'
*/
togglePin.post = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: togglePin.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::togglePin
* @see app/Http/Controllers/CommentController.php:139
* @route '/comments/{comment}/pin'
*/
const togglePinForm = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: togglePin.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::togglePin
* @see app/Http/Controllers/CommentController.php:139
* @route '/comments/{comment}/pin'
*/
togglePinForm.post = (args: { comment: string | { id: string } } | [comment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: togglePin.url(args, options),
    method: 'post',
})

togglePin.form = togglePinForm

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

const CommentController = { store, toggleReaction, togglePin, destroy }

export default CommentController