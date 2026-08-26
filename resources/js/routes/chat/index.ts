import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
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
* @see \App\Http\Controllers\DirectMessageController::index
* @see app/Http/Controllers/DirectMessageController.php:21
* @route '/chat'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DirectMessageController::index
* @see app/Http/Controllers/DirectMessageController.php:21
* @route '/chat'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DirectMessageController::index
* @see app/Http/Controllers/DirectMessageController.php:21
* @route '/chat'
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
* @see \App\Http\Controllers\DirectMessageController::contacts
* @see app/Http/Controllers/DirectMessageController.php:64
* @route '/api/chat/contacts'
*/
const contactsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: contacts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DirectMessageController::contacts
* @see app/Http/Controllers/DirectMessageController.php:64
* @route '/api/chat/contacts'
*/
contactsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: contacts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DirectMessageController::contacts
* @see app/Http/Controllers/DirectMessageController.php:64
* @route '/api/chat/contacts'
*/
contactsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: contacts.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

contacts.form = contactsForm

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
* @see \App\Http\Controllers\DirectMessageController::messages
* @see app/Http/Controllers/DirectMessageController.php:85
* @route '/api/chat/messages/{user}'
*/
const messagesForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: messages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DirectMessageController::messages
* @see app/Http/Controllers/DirectMessageController.php:85
* @route '/api/chat/messages/{user}'
*/
messagesForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: messages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DirectMessageController::messages
* @see app/Http/Controllers/DirectMessageController.php:85
* @route '/api/chat/messages/{user}'
*/
messagesForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: messages.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

messages.form = messagesForm

/**
* @see \App\Http\Controllers\DirectMessageController::reaction
* @see app/Http/Controllers/DirectMessageController.php:169
* @route '/api/chat/messages/{message}/reaction'
*/
export const reaction = (args: { message: string | { id: string } } | [message: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reaction.url(args, options),
    method: 'post',
})

reaction.definition = {
    methods: ["post"],
    url: '/api/chat/messages/{message}/reaction',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DirectMessageController::reaction
* @see app/Http/Controllers/DirectMessageController.php:169
* @route '/api/chat/messages/{message}/reaction'
*/
reaction.url = (args: { message: string | { id: string } } | [message: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return reaction.definition.url
            .replace('{message}', parsedArgs.message.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DirectMessageController::reaction
* @see app/Http/Controllers/DirectMessageController.php:169
* @route '/api/chat/messages/{message}/reaction'
*/
reaction.post = (args: { message: string | { id: string } } | [message: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reaction.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DirectMessageController::reaction
* @see app/Http/Controllers/DirectMessageController.php:169
* @route '/api/chat/messages/{message}/reaction'
*/
const reactionForm = (args: { message: string | { id: string } } | [message: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reaction.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DirectMessageController::reaction
* @see app/Http/Controllers/DirectMessageController.php:169
* @route '/api/chat/messages/{message}/reaction'
*/
reactionForm.post = (args: { message: string | { id: string } } | [message: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reaction.url(args, options),
    method: 'post',
})

reaction.form = reactionForm

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

/**
* @see \App\Http\Controllers\DirectMessageController::store
* @see app/Http/Controllers/DirectMessageController.php:111
* @route '/chat'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DirectMessageController::store
* @see app/Http/Controllers/DirectMessageController.php:111
* @route '/chat'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const chat = {
    index: Object.assign(index, index),
    contacts: Object.assign(contacts, contacts),
    messages: Object.assign(messages, messages),
    reaction: Object.assign(reaction, reaction),
    store: Object.assign(store, store),
}

export default chat