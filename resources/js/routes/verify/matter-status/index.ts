import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:276
* @route '/verify/matter-status/{matter}/qr.svg'
*/
export const qr = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})

qr.definition = {
    methods: ["get","head"],
    url: '/verify/matter-status/{matter}/qr.svg',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:276
* @route '/verify/matter-status/{matter}/qr.svg'
*/
qr.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return qr.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:276
* @route '/verify/matter-status/{matter}/qr.svg'
*/
qr.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:276
* @route '/verify/matter-status/{matter}/qr.svg'
*/
qr.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: qr.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:276
* @route '/verify/matter-status/{matter}/qr.svg'
*/
const qrForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: qr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:276
* @route '/verify/matter-status/{matter}/qr.svg'
*/
qrForm.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: qr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::qr
* @see app/Http/Controllers/PublicVerificationController.php:276
* @route '/verify/matter-status/{matter}/qr.svg'
*/
qrForm.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: qr.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

qr.form = qrForm

const matterStatus = {
    qr: Object.assign(qr, qr),
}

export default matterStatus