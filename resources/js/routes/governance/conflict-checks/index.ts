import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:165
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
* @see app/Http/Controllers/GovernanceController.php:165
* @route '/governance/conflict-checks'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:165
* @route '/governance/conflict-checks'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:165
* @route '/governance/conflict-checks'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::store
* @see app/Http/Controllers/GovernanceController.php:165
* @route '/governance/conflict-checks'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\GovernanceController::preview
* @see app/Http/Controllers/GovernanceController.php:191
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
* @see app/Http/Controllers/GovernanceController.php:191
* @route '/governance/conflict-checks/preview'
*/
preview.url = (options?: RouteQueryOptions) => {
    return preview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::preview
* @see app/Http/Controllers/GovernanceController.php:191
* @route '/governance/conflict-checks/preview'
*/
preview.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::preview
* @see app/Http/Controllers/GovernanceController.php:191
* @route '/governance/conflict-checks/preview'
*/
const previewForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: preview.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::preview
* @see app/Http/Controllers/GovernanceController.php:191
* @route '/governance/conflict-checks/preview'
*/
previewForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: preview.url(options),
    method: 'post',
})

preview.form = previewForm

/**
* @see \App\Http\Controllers\GovernanceController::resolve
* @see app/Http/Controllers/GovernanceController.php:181
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
* @see app/Http/Controllers/GovernanceController.php:181
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
* @see app/Http/Controllers/GovernanceController.php:181
* @route '/governance/conflict-checks/{conflictCheck}'
*/
resolve.patch = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resolve.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\GovernanceController::resolve
* @see app/Http/Controllers/GovernanceController.php:181
* @route '/governance/conflict-checks/{conflictCheck}'
*/
const resolveForm = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::resolve
* @see app/Http/Controllers/GovernanceController.php:181
* @route '/governance/conflict-checks/{conflictCheck}'
*/
resolveForm.patch = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

resolve.form = resolveForm

/**
* @see \App\Http\Controllers\GovernanceController::certificate
* @see app/Http/Controllers/GovernanceController.php:216
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
* @see app/Http/Controllers/GovernanceController.php:216
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
* @see app/Http/Controllers/GovernanceController.php:216
* @route '/governance/conflict-checks/{conflictCheck}/certificate'
*/
certificate.get = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: certificate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::certificate
* @see app/Http/Controllers/GovernanceController.php:216
* @route '/governance/conflict-checks/{conflictCheck}/certificate'
*/
certificate.head = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: certificate.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GovernanceController::certificate
* @see app/Http/Controllers/GovernanceController.php:216
* @route '/governance/conflict-checks/{conflictCheck}/certificate'
*/
const certificateForm = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: certificate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::certificate
* @see app/Http/Controllers/GovernanceController.php:216
* @route '/governance/conflict-checks/{conflictCheck}/certificate'
*/
certificateForm.get = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: certificate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::certificate
* @see app/Http/Controllers/GovernanceController.php:216
* @route '/governance/conflict-checks/{conflictCheck}/certificate'
*/
certificateForm.head = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: certificate.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

certificate.form = certificateForm

/**
* @see \App\Http\Controllers\GovernanceController::pdf
* @see app/Http/Controllers/GovernanceController.php:236
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
* @see app/Http/Controllers/GovernanceController.php:236
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
* @see app/Http/Controllers/GovernanceController.php:236
* @route '/governance/conflict-checks/{conflictCheck}/pdf'
*/
pdf.get = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::pdf
* @see app/Http/Controllers/GovernanceController.php:236
* @route '/governance/conflict-checks/{conflictCheck}/pdf'
*/
pdf.head = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GovernanceController::pdf
* @see app/Http/Controllers/GovernanceController.php:236
* @route '/governance/conflict-checks/{conflictCheck}/pdf'
*/
const pdfForm = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::pdf
* @see app/Http/Controllers/GovernanceController.php:236
* @route '/governance/conflict-checks/{conflictCheck}/pdf'
*/
pdfForm.get = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::pdf
* @see app/Http/Controllers/GovernanceController.php:236
* @route '/governance/conflict-checks/{conflictCheck}/pdf'
*/
pdfForm.head = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pdf.form = pdfForm

const conflictChecks = {
    store: Object.assign(store, store),
    preview: Object.assign(preview, preview),
    resolve: Object.assign(resolve, resolve),
    certificate: Object.assign(certificate, certificate),
    pdf: Object.assign(pdf, pdf),
}

export default conflictChecks