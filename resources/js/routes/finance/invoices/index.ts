import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:179
* @route '/finance/invoices'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/finance/invoices',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:179
* @route '/finance/invoices'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:179
* @route '/finance/invoices'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:179
* @route '/finance/invoices'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:179
* @route '/finance/invoices'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:195
* @route '/finance/invoices/{invoice}'
*/
export const update = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/finance/invoices/{invoice}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:195
* @route '/finance/invoices/{invoice}'
*/
update.url = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invoice: typeof args.invoice === 'object'
        ? args.invoice.id
        : args.invoice,
    }

    return update.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:195
* @route '/finance/invoices/{invoice}'
*/
update.put = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:195
* @route '/finance/invoices/{invoice}'
*/
const updateForm = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::update
* @see app/Http/Controllers/FinanceController.php:195
* @route '/finance/invoices/{invoice}'
*/
updateForm.put = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\FinanceController::transition
* @see app/Http/Controllers/FinanceController.php:229
* @route '/finance/invoices/{invoice}/status'
*/
export const transition = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: transition.url(args, options),
    method: 'patch',
})

transition.definition = {
    methods: ["patch"],
    url: '/finance/invoices/{invoice}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\FinanceController::transition
* @see app/Http/Controllers/FinanceController.php:229
* @route '/finance/invoices/{invoice}/status'
*/
transition.url = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invoice: typeof args.invoice === 'object'
        ? args.invoice.id
        : args.invoice,
    }

    return transition.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::transition
* @see app/Http/Controllers/FinanceController.php:229
* @route '/finance/invoices/{invoice}/status'
*/
transition.patch = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: transition.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\FinanceController::transition
* @see app/Http/Controllers/FinanceController.php:229
* @route '/finance/invoices/{invoice}/status'
*/
const transitionForm = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: transition.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::transition
* @see app/Http/Controllers/FinanceController.php:229
* @route '/finance/invoices/{invoice}/status'
*/
transitionForm.patch = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: transition.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

transition.form = transitionForm

/**
* @see \App\Http\Controllers\FinanceController::pdf
* @see app/Http/Controllers/FinanceController.php:851
* @route '/finance/invoices/{invoice}/pdf'
*/
export const pdf = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/finance/invoices/{invoice}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceController::pdf
* @see app/Http/Controllers/FinanceController.php:851
* @route '/finance/invoices/{invoice}/pdf'
*/
pdf.url = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invoice: typeof args.invoice === 'object'
        ? args.invoice.id
        : args.invoice,
    }

    return pdf.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::pdf
* @see app/Http/Controllers/FinanceController.php:851
* @route '/finance/invoices/{invoice}/pdf'
*/
pdf.get = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::pdf
* @see app/Http/Controllers/FinanceController.php:851
* @route '/finance/invoices/{invoice}/pdf'
*/
pdf.head = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FinanceController::pdf
* @see app/Http/Controllers/FinanceController.php:851
* @route '/finance/invoices/{invoice}/pdf'
*/
const pdfForm = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::pdf
* @see app/Http/Controllers/FinanceController.php:851
* @route '/finance/invoices/{invoice}/pdf'
*/
pdfForm.get = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::pdf
* @see app/Http/Controllers/FinanceController.php:851
* @route '/finance/invoices/{invoice}/pdf'
*/
pdfForm.head = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pdf.form = pdfForm

const invoices = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    transition: Object.assign(transition, transition),
    pdf: Object.assign(pdf, pdf),
}

export default invoices