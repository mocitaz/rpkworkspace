import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SignatureReminderController::store
* @see app/Http/Controllers/SignatureReminderController.php:13
* @route '/signature-requests/{signatureRequest}/reminders'
*/
export const store = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/signature-requests/{signatureRequest}/reminders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SignatureReminderController::store
* @see app/Http/Controllers/SignatureReminderController.php:13
* @route '/signature-requests/{signatureRequest}/reminders'
*/
store.url = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { signatureRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { signatureRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            signatureRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        signatureRequest: typeof args.signatureRequest === 'object'
        ? args.signatureRequest.id
        : args.signatureRequest,
    }

    return store.definition.url
            .replace('{signatureRequest}', parsedArgs.signatureRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SignatureReminderController::store
* @see app/Http/Controllers/SignatureReminderController.php:13
* @route '/signature-requests/{signatureRequest}/reminders'
*/
store.post = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SignatureReminderController::store
* @see app/Http/Controllers/SignatureReminderController.php:13
* @route '/signature-requests/{signatureRequest}/reminders'
*/
const storeForm = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SignatureReminderController::store
* @see app/Http/Controllers/SignatureReminderController.php:13
* @route '/signature-requests/{signatureRequest}/reminders'
*/
storeForm.post = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const reminders = {
    store: Object.assign(store, store),
}

export default reminders