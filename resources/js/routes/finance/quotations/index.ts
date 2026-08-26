import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:153
* @route '/finance/quotations'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/finance/quotations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:153
* @route '/finance/quotations'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:153
* @route '/finance/quotations'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:153
* @route '/finance/quotations'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::store
* @see app/Http/Controllers/FinanceController.php:153
* @route '/finance/quotations'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\FinanceController::approve
* @see app/Http/Controllers/FinanceController.php:170
* @route '/finance/quotations/{quotation}/approve'
*/
export const approve = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/finance/quotations/{quotation}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::approve
* @see app/Http/Controllers/FinanceController.php:170
* @route '/finance/quotations/{quotation}/approve'
*/
approve.url = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { quotation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { quotation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            quotation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        quotation: typeof args.quotation === 'object'
        ? args.quotation.id
        : args.quotation,
    }

    return approve.definition.url
            .replace('{quotation}', parsedArgs.quotation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::approve
* @see app/Http/Controllers/FinanceController.php:170
* @route '/finance/quotations/{quotation}/approve'
*/
approve.post = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::approve
* @see app/Http/Controllers/FinanceController.php:170
* @route '/finance/quotations/{quotation}/approve'
*/
const approveForm = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::approve
* @see app/Http/Controllers/FinanceController.php:170
* @route '/finance/quotations/{quotation}/approve'
*/
approveForm.post = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\FinanceController::pdf
* @see app/Http/Controllers/FinanceController.php:558
* @route '/finance/quotations/{quotation}/pdf'
*/
export const pdf = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/finance/quotations/{quotation}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceController::pdf
* @see app/Http/Controllers/FinanceController.php:558
* @route '/finance/quotations/{quotation}/pdf'
*/
pdf.url = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { quotation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { quotation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            quotation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        quotation: typeof args.quotation === 'object'
        ? args.quotation.id
        : args.quotation,
    }

    return pdf.definition.url
            .replace('{quotation}', parsedArgs.quotation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::pdf
* @see app/Http/Controllers/FinanceController.php:558
* @route '/finance/quotations/{quotation}/pdf'
*/
pdf.get = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::pdf
* @see app/Http/Controllers/FinanceController.php:558
* @route '/finance/quotations/{quotation}/pdf'
*/
pdf.head = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FinanceController::pdf
* @see app/Http/Controllers/FinanceController.php:558
* @route '/finance/quotations/{quotation}/pdf'
*/
const pdfForm = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::pdf
* @see app/Http/Controllers/FinanceController.php:558
* @route '/finance/quotations/{quotation}/pdf'
*/
pdfForm.get = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::pdf
* @see app/Http/Controllers/FinanceController.php:558
* @route '/finance/quotations/{quotation}/pdf'
*/
pdfForm.head = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pdf.form = pdfForm

const quotations = {
    store: Object.assign(store, store),
    approve: Object.assign(approve, approve),
    pdf: Object.assign(pdf, pdf),
}

export default quotations