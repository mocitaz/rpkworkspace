import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:160
* @route '/governance/conflict-checks'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/governance/conflict-checks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:160
* @route '/governance/conflict-checks'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:160
* @route '/governance/conflict-checks'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::preview
* @see app/Http/Controllers/GovernanceController.php:186
* @route '/governance/conflict-checks/preview'
*/
export const preview = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview.url(options),
    method: 'post',
})

preview.definition = {
    methods: ["post"],
    url: '/governance/conflict-checks/preview',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GovernanceController::preview
* @see app/Http/Controllers/GovernanceController.php:186
* @route '/governance/conflict-checks/preview'
*/
preview.url = (options?: RouteQueryOptions) => {
    return preview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::preview
* @see app/Http/Controllers/GovernanceController.php:186
* @route '/governance/conflict-checks/preview'
*/
preview.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::resolve
* @see app/Http/Controllers/GovernanceController.php:176
* @route '/governance/conflict-checks/{conflictCheck}'
*/
export const resolve = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resolve.url(args, options),
    method: 'patch',
})

resolve.definition = {
    methods: ["patch"],
    url: '/governance/conflict-checks/{conflictCheck}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\GovernanceController::resolve
* @see app/Http/Controllers/GovernanceController.php:176
* @route '/governance/conflict-checks/{conflictCheck}'
*/
resolve.url = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conflictCheck: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { conflictCheck: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            conflictCheck: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        conflictCheck: typeof args.conflictCheck === 'object'
        ? args.conflictCheck.id
        : args.conflictCheck,
    }

    return resolve.definition.url
            .replace('{conflictCheck}', parsedArgs.conflictCheck.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::resolve
* @see app/Http/Controllers/GovernanceController.php:176
* @route '/governance/conflict-checks/{conflictCheck}'
*/
resolve.patch = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resolve.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\GovernanceController::certificate
* @see app/Http/Controllers/GovernanceController.php:211
* @route '/governance/conflict-checks/{conflictCheck}/certificate'
*/
export const certificate = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: certificate.url(args, options),
    method: 'get',
})

certificate.definition = {
    methods: ["get","head"],
    url: '/governance/conflict-checks/{conflictCheck}/certificate',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GovernanceController::certificate
* @see app/Http/Controllers/GovernanceController.php:211
* @route '/governance/conflict-checks/{conflictCheck}/certificate'
*/
certificate.url = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conflictCheck: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { conflictCheck: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            conflictCheck: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        conflictCheck: typeof args.conflictCheck === 'object'
        ? args.conflictCheck.id
        : args.conflictCheck,
    }

    return certificate.definition.url
            .replace('{conflictCheck}', parsedArgs.conflictCheck.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::certificate
* @see app/Http/Controllers/GovernanceController.php:211
* @route '/governance/conflict-checks/{conflictCheck}/certificate'
*/
certificate.get = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: certificate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::certificate
* @see app/Http/Controllers/GovernanceController.php:211
* @route '/governance/conflict-checks/{conflictCheck}/certificate'
*/
certificate.head = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: certificate.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GovernanceController::pdf
* @see app/Http/Controllers/GovernanceController.php:231
* @route '/governance/conflict-checks/{conflictCheck}/pdf'
*/
export const pdf = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/governance/conflict-checks/{conflictCheck}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GovernanceController::pdf
* @see app/Http/Controllers/GovernanceController.php:231
* @route '/governance/conflict-checks/{conflictCheck}/pdf'
*/
pdf.url = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conflictCheck: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { conflictCheck: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            conflictCheck: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        conflictCheck: typeof args.conflictCheck === 'object'
        ? args.conflictCheck.id
        : args.conflictCheck,
    }

    return pdf.definition.url
            .replace('{conflictCheck}', parsedArgs.conflictCheck.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::pdf
* @see app/Http/Controllers/GovernanceController.php:231
* @route '/governance/conflict-checks/{conflictCheck}/pdf'
*/
pdf.get = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::pdf
* @see app/Http/Controllers/GovernanceController.php:231
* @route '/governance/conflict-checks/{conflictCheck}/pdf'
*/
pdf.head = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

const conflictChecks = {
    store: Object.assign(store, store),
    preview: Object.assign(preview, preview),
    resolve: Object.assign(resolve, resolve),
    certificate: Object.assign(certificate, certificate),
    pdf: Object.assign(pdf, pdf),
}

export default conflictChecks