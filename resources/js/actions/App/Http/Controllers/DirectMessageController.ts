import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DirectMessageController::index
* @see app/Http/Controllers/DirectMessageController.php:21
* @route '/chat'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/chat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DirectMessageController::index
* @see app/Http/Controllers/DirectMessageController.php:21
* @route '/chat'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DirectMessageController::index
* @see app/Http/Controllers/DirectMessageController.php:21
* @route '/chat'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DirectMessageController::index
* @see app/Http/Controllers/DirectMessageController.php:21
* @route '/chat'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DirectMessageController::contacts
* @see app/Http/Controllers/DirectMessageController.php:64
* @route '/api/chat/contacts'
*/
export const contacts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contacts.url(options),
    method: 'get',
})

contacts.definition = {
    methods: ["get","head"],
    url: '/api/chat/contacts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DirectMessageController::contacts
* @see app/Http/Controllers/DirectMessageController.php:64
* @route '/api/chat/contacts'
*/
contacts.url = (options?: RouteQueryOptions) => {
    return contacts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DirectMessageController::contacts
* @see app/Http/Controllers/DirectMessageController.php:64
* @route '/api/chat/contacts'
*/
contacts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contacts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DirectMessageController::contacts
* @see app/Http/Controllers/DirectMessageController.php:64
* @route '/api/chat/contacts'
*/
contacts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contacts.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DirectMessageController::messages
* @see app/Http/Controllers/DirectMessageController.php:85
* @route '/api/chat/messages/{user}'
*/
export const messages = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: messages.url(args, options),
    method: 'get',
})

messages.definition = {
    methods: ["get","head"],
    url: '/api/chat/messages/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DirectMessageController::messages
* @see app/Http/Controllers/DirectMessageController.php:85
* @route '/api/chat/messages/{user}'
*/
messages.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return messages.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DirectMessageController::messages
* @see app/Http/Controllers/DirectMessageController.php:85
* @route '/api/chat/messages/{user}'
*/
messages.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: messages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DirectMessageController::messages
* @see app/Http/Controllers/DirectMessageController.php:85
* @route '/api/chat/messages/{user}'
*/
messages.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: messages.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DirectMessageController::toggleReaction
* @see app/Http/Controllers/DirectMessageController.php:169
* @route '/api/chat/messages/{message}/reaction'
*/
export const toggleReaction = (args: { message: string | { id: string } } | [message: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleReaction.url(args, options),
    method: 'post',
})

toggleReaction.definition = {
    methods: ["post"],
    url: '/api/chat/messages/{message}/reaction',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DirectMessageController::toggleReaction
* @see app/Http/Controllers/DirectMessageController.php:169
* @route '/api/chat/messages/{message}/reaction'
*/
toggleReaction.url = (args: { message: string | { id: string } } | [message: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { message: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { message: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            message: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        message: typeof args.message === 'object'
        ? args.message.id
        : args.message,
    }

    return toggleReaction.definition.url
            .replace('{message}', parsedArgs.message.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DirectMessageController::toggleReaction
* @see app/Http/Controllers/DirectMessageController.php:169
* @route '/api/chat/messages/{message}/reaction'
*/
toggleReaction.post = (args: { message: string | { id: string } } | [message: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleReaction.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DirectMessageController::store
* @see app/Http/Controllers/DirectMessageController.php:111
* @route '/chat'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/chat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DirectMessageController::store
* @see app/Http/Controllers/DirectMessageController.php:111
* @route '/chat'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DirectMessageController::store
* @see app/Http/Controllers/DirectMessageController.php:111
* @route '/chat'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

const DirectMessageController = { index, contacts, messages, toggleReaction, store }

export default DirectMessageController