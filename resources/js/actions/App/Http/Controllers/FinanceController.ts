import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:80
* @route '/finance'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/finance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:80
* @route '/finance'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:80
* @route '/finance'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:80
* @route '/finance'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:80
* @route '/finance'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:80
* @route '/finance'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:80
* @route '/finance'
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
* @see \App\Http\Controllers\FinanceController::updateMatterContract
* @see app/Http/Controllers/FinanceController.php:67
* @route '/finance/matters/{matter}/contract'
*/
export const updateMatterContract = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateMatterContract.url(args, options),
    method: 'patch',
})

updateMatterContract.definition = {
    methods: ["patch"],
    url: '/finance/matters/{matter}/contract',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\FinanceController::updateMatterContract
* @see app/Http/Controllers/FinanceController.php:67
* @route '/finance/matters/{matter}/contract'
*/
updateMatterContract.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return updateMatterContract.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::updateMatterContract
* @see app/Http/Controllers/FinanceController.php:67
* @route '/finance/matters/{matter}/contract'
*/
updateMatterContract.patch = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateMatterContract.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\FinanceController::updateMatterContract
* @see app/Http/Controllers/FinanceController.php:67
* @route '/finance/matters/{matter}/contract'
*/
const updateMatterContractForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMatterContract.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::updateMatterContract
* @see app/Http/Controllers/FinanceController.php:67
* @route '/finance/matters/{matter}/contract'
*/
updateMatterContractForm.patch = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMatterContract.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateMatterContract.form = updateMatterContractForm

/**
* @see \App\Http\Controllers\FinanceController::exportExcel
* @see app/Http/Controllers/FinanceController.php:873
* @route '/finance/export/excel'
*/
export const exportExcel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel.url(options),
    method: 'get',
})

exportExcel.definition = {
    methods: ["get","head"],
    url: '/finance/export/excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceController::exportExcel
* @see app/Http/Controllers/FinanceController.php:873
* @route '/finance/export/excel'
*/
exportExcel.url = (options?: RouteQueryOptions) => {
    return exportExcel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::exportExcel
* @see app/Http/Controllers/FinanceController.php:873
* @route '/finance/export/excel'
*/
exportExcel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::exportExcel
* @see app/Http/Controllers/FinanceController.php:873
* @route '/finance/export/excel'
*/
exportExcel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportExcel.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FinanceController::exportExcel
* @see app/Http/Controllers/FinanceController.php:873
* @route '/finance/export/excel'
*/
const exportExcelForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::exportExcel
* @see app/Http/Controllers/FinanceController.php:873
* @route '/finance/export/excel'
*/
exportExcelForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::exportExcel
* @see app/Http/Controllers/FinanceController.php:873
* @route '/finance/export/excel'
*/
exportExcelForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcel.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportExcel.form = exportExcelForm

/**
* @see \App\Http\Controllers\FinanceController::storeInvoice
* @see app/Http/Controllers/FinanceController.php:179
* @route '/finance/invoices'
*/
export const storeInvoice = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeInvoice.url(options),
    method: 'post',
})

storeInvoice.definition = {
    methods: ["post"],
    url: '/finance/invoices',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::storeInvoice
* @see app/Http/Controllers/FinanceController.php:179
* @route '/finance/invoices'
*/
storeInvoice.url = (options?: RouteQueryOptions) => {
    return storeInvoice.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::storeInvoice
* @see app/Http/Controllers/FinanceController.php:179
* @route '/finance/invoices'
*/
storeInvoice.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeInvoice.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storeInvoice
* @see app/Http/Controllers/FinanceController.php:179
* @route '/finance/invoices'
*/
const storeInvoiceForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeInvoice.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storeInvoice
* @see app/Http/Controllers/FinanceController.php:179
* @route '/finance/invoices'
*/
storeInvoiceForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeInvoice.url(options),
    method: 'post',
})

storeInvoice.form = storeInvoiceForm

/**
* @see \App\Http\Controllers\FinanceController::updateInvoice
* @see app/Http/Controllers/FinanceController.php:195
* @route '/finance/invoices/{invoice}'
*/
export const updateInvoice = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateInvoice.url(args, options),
    method: 'put',
})

updateInvoice.definition = {
    methods: ["put"],
    url: '/finance/invoices/{invoice}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FinanceController::updateInvoice
* @see app/Http/Controllers/FinanceController.php:195
* @route '/finance/invoices/{invoice}'
*/
updateInvoice.url = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return updateInvoice.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::updateInvoice
* @see app/Http/Controllers/FinanceController.php:195
* @route '/finance/invoices/{invoice}'
*/
updateInvoice.put = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateInvoice.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\FinanceController::updateInvoice
* @see app/Http/Controllers/FinanceController.php:195
* @route '/finance/invoices/{invoice}'
*/
const updateInvoiceForm = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateInvoice.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::updateInvoice
* @see app/Http/Controllers/FinanceController.php:195
* @route '/finance/invoices/{invoice}'
*/
updateInvoiceForm.put = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateInvoice.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateInvoice.form = updateInvoiceForm

/**
* @see \App\Http\Controllers\FinanceController::transitionInvoice
* @see app/Http/Controllers/FinanceController.php:229
* @route '/finance/invoices/{invoice}/status'
*/
export const transitionInvoice = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: transitionInvoice.url(args, options),
    method: 'patch',
})

transitionInvoice.definition = {
    methods: ["patch"],
    url: '/finance/invoices/{invoice}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\FinanceController::transitionInvoice
* @see app/Http/Controllers/FinanceController.php:229
* @route '/finance/invoices/{invoice}/status'
*/
transitionInvoice.url = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return transitionInvoice.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::transitionInvoice
* @see app/Http/Controllers/FinanceController.php:229
* @route '/finance/invoices/{invoice}/status'
*/
transitionInvoice.patch = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: transitionInvoice.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\FinanceController::transitionInvoice
* @see app/Http/Controllers/FinanceController.php:229
* @route '/finance/invoices/{invoice}/status'
*/
const transitionInvoiceForm = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: transitionInvoice.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::transitionInvoice
* @see app/Http/Controllers/FinanceController.php:229
* @route '/finance/invoices/{invoice}/status'
*/
transitionInvoiceForm.patch = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: transitionInvoice.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

transitionInvoice.form = transitionInvoiceForm

/**
* @see \App\Http\Controllers\FinanceController::storeQuotation
* @see app/Http/Controllers/FinanceController.php:211
* @route '/finance/quotations'
*/
export const storeQuotation = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeQuotation.url(options),
    method: 'post',
})

storeQuotation.definition = {
    methods: ["post"],
    url: '/finance/quotations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::storeQuotation
* @see app/Http/Controllers/FinanceController.php:211
* @route '/finance/quotations'
*/
storeQuotation.url = (options?: RouteQueryOptions) => {
    return storeQuotation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::storeQuotation
* @see app/Http/Controllers/FinanceController.php:211
* @route '/finance/quotations'
*/
storeQuotation.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeQuotation.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storeQuotation
* @see app/Http/Controllers/FinanceController.php:211
* @route '/finance/quotations'
*/
const storeQuotationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeQuotation.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storeQuotation
* @see app/Http/Controllers/FinanceController.php:211
* @route '/finance/quotations'
*/
storeQuotationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeQuotation.url(options),
    method: 'post',
})

storeQuotation.form = storeQuotationForm

/**
* @see \App\Http\Controllers\FinanceController::updateQuotation
* @see app/Http/Controllers/FinanceController.php:220
* @route '/finance/quotations/{quotation}'
*/
export const updateQuotation = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateQuotation.url(args, options),
    method: 'put',
})

updateQuotation.definition = {
    methods: ["put"],
    url: '/finance/quotations/{quotation}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FinanceController::updateQuotation
* @see app/Http/Controllers/FinanceController.php:220
* @route '/finance/quotations/{quotation}'
*/
updateQuotation.url = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return updateQuotation.definition.url
            .replace('{quotation}', parsedArgs.quotation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::updateQuotation
* @see app/Http/Controllers/FinanceController.php:220
* @route '/finance/quotations/{quotation}'
*/
updateQuotation.put = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateQuotation.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\FinanceController::updateQuotation
* @see app/Http/Controllers/FinanceController.php:220
* @route '/finance/quotations/{quotation}'
*/
const updateQuotationForm = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateQuotation.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::updateQuotation
* @see app/Http/Controllers/FinanceController.php:220
* @route '/finance/quotations/{quotation}'
*/
updateQuotationForm.put = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateQuotation.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateQuotation.form = updateQuotationForm

/**
* @see \App\Http\Controllers\FinanceController::approveQuotation
* @see app/Http/Controllers/FinanceController.php:237
* @route '/finance/quotations/{quotation}/approve'
*/
export const approveQuotation = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveQuotation.url(args, options),
    method: 'post',
})

approveQuotation.definition = {
    methods: ["post"],
    url: '/finance/quotations/{quotation}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::approveQuotation
* @see app/Http/Controllers/FinanceController.php:237
* @route '/finance/quotations/{quotation}/approve'
*/
approveQuotation.url = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return approveQuotation.definition.url
            .replace('{quotation}', parsedArgs.quotation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::approveQuotation
* @see app/Http/Controllers/FinanceController.php:237
* @route '/finance/quotations/{quotation}/approve'
*/
approveQuotation.post = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveQuotation.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::approveQuotation
* @see app/Http/Controllers/FinanceController.php:237
* @route '/finance/quotations/{quotation}/approve'
*/
const approveQuotationForm = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approveQuotation.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::approveQuotation
* @see app/Http/Controllers/FinanceController.php:237
* @route '/finance/quotations/{quotation}/approve'
*/
approveQuotationForm.post = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approveQuotation.url(args, options),
    method: 'post',
})

approveQuotation.form = approveQuotationForm

/**
* @see \App\Http\Controllers\FinanceController::storeExpense
* @see app/Http/Controllers/FinanceController.php:245
* @route '/finance/expenses'
*/
export const storeExpense = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeExpense.url(options),
    method: 'post',
})

storeExpense.definition = {
    methods: ["post"],
    url: '/finance/expenses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::storeExpense
* @see app/Http/Controllers/FinanceController.php:245
* @route '/finance/expenses'
*/
storeExpense.url = (options?: RouteQueryOptions) => {
    return storeExpense.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::storeExpense
* @see app/Http/Controllers/FinanceController.php:245
* @route '/finance/expenses'
*/
storeExpense.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeExpense.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storeExpense
* @see app/Http/Controllers/FinanceController.php:245
* @route '/finance/expenses'
*/
const storeExpenseForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeExpense.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storeExpense
* @see app/Http/Controllers/FinanceController.php:245
* @route '/finance/expenses'
*/
storeExpenseForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeExpense.url(options),
    method: 'post',
})

storeExpense.form = storeExpenseForm

/**
* @see \App\Http\Controllers\FinanceController::destroyExpense
* @see app/Http/Controllers/FinanceController.php:282
* @route '/finance/expenses/{expense}'
*/
export const destroyExpense = (args: { expense: string | { id: string } } | [expense: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyExpense.url(args, options),
    method: 'delete',
})

destroyExpense.definition = {
    methods: ["delete"],
    url: '/finance/expenses/{expense}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FinanceController::destroyExpense
* @see app/Http/Controllers/FinanceController.php:282
* @route '/finance/expenses/{expense}'
*/
destroyExpense.url = (args: { expense: string | { id: string } } | [expense: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { expense: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { expense: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            expense: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        expense: typeof args.expense === 'object'
        ? args.expense.id
        : args.expense,
    }

    return destroyExpense.definition.url
            .replace('{expense}', parsedArgs.expense.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::destroyExpense
* @see app/Http/Controllers/FinanceController.php:282
* @route '/finance/expenses/{expense}'
*/
destroyExpense.delete = (args: { expense: string | { id: string } } | [expense: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyExpense.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\FinanceController::destroyExpense
* @see app/Http/Controllers/FinanceController.php:282
* @route '/finance/expenses/{expense}'
*/
const destroyExpenseForm = (args: { expense: string | { id: string } } | [expense: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyExpense.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::destroyExpense
* @see app/Http/Controllers/FinanceController.php:282
* @route '/finance/expenses/{expense}'
*/
destroyExpenseForm.delete = (args: { expense: string | { id: string } } | [expense: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyExpense.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyExpense.form = destroyExpenseForm

/**
* @see \App\Http\Controllers\FinanceController::updateExpense
* @see app/Http/Controllers/FinanceController.php:308
* @route '/finance/expenses/{expense}'
*/
export const updateExpense = (args: { expense: string | { id: string } } | [expense: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateExpense.url(args, options),
    method: 'put',
})

updateExpense.definition = {
    methods: ["put"],
    url: '/finance/expenses/{expense}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FinanceController::updateExpense
* @see app/Http/Controllers/FinanceController.php:308
* @route '/finance/expenses/{expense}'
*/
updateExpense.url = (args: { expense: string | { id: string } } | [expense: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { expense: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { expense: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            expense: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        expense: typeof args.expense === 'object'
        ? args.expense.id
        : args.expense,
    }

    return updateExpense.definition.url
            .replace('{expense}', parsedArgs.expense.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::updateExpense
* @see app/Http/Controllers/FinanceController.php:308
* @route '/finance/expenses/{expense}'
*/
updateExpense.put = (args: { expense: string | { id: string } } | [expense: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateExpense.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\FinanceController::updateExpense
* @see app/Http/Controllers/FinanceController.php:308
* @route '/finance/expenses/{expense}'
*/
const updateExpenseForm = (args: { expense: string | { id: string } } | [expense: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateExpense.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::updateExpense
* @see app/Http/Controllers/FinanceController.php:308
* @route '/finance/expenses/{expense}'
*/
updateExpenseForm.put = (args: { expense: string | { id: string } } | [expense: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateExpense.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateExpense.form = updateExpenseForm

/**
* @see \App\Http\Controllers\FinanceController::storePayment
* @see app/Http/Controllers/FinanceController.php:360
* @route '/finance/payments'
*/
export const storePayment = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(options),
    method: 'post',
})

storePayment.definition = {
    methods: ["post"],
    url: '/finance/payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::storePayment
* @see app/Http/Controllers/FinanceController.php:360
* @route '/finance/payments'
*/
storePayment.url = (options?: RouteQueryOptions) => {
    return storePayment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::storePayment
* @see app/Http/Controllers/FinanceController.php:360
* @route '/finance/payments'
*/
storePayment.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storePayment
* @see app/Http/Controllers/FinanceController.php:360
* @route '/finance/payments'
*/
const storePaymentForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePayment.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storePayment
* @see app/Http/Controllers/FinanceController.php:360
* @route '/finance/payments'
*/
storePaymentForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePayment.url(options),
    method: 'post',
})

storePayment.form = storePaymentForm

/**
* @see \App\Http\Controllers\FinanceController::reversePayment
* @see app/Http/Controllers/FinanceController.php:396
* @route '/finance/payments/{payment}/reverse'
*/
export const reversePayment = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reversePayment.url(args, options),
    method: 'post',
})

reversePayment.definition = {
    methods: ["post"],
    url: '/finance/payments/{payment}/reverse',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::reversePayment
* @see app/Http/Controllers/FinanceController.php:396
* @route '/finance/payments/{payment}/reverse'
*/
reversePayment.url = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: typeof args.payment === 'object'
        ? args.payment.id
        : args.payment,
    }

    return reversePayment.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::reversePayment
* @see app/Http/Controllers/FinanceController.php:396
* @route '/finance/payments/{payment}/reverse'
*/
reversePayment.post = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reversePayment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::reversePayment
* @see app/Http/Controllers/FinanceController.php:396
* @route '/finance/payments/{payment}/reverse'
*/
const reversePaymentForm = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reversePayment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::reversePayment
* @see app/Http/Controllers/FinanceController.php:396
* @route '/finance/payments/{payment}/reverse'
*/
reversePaymentForm.post = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reversePayment.url(args, options),
    method: 'post',
})

reversePayment.form = reversePaymentForm

/**
* @see \App\Http\Controllers\FinanceController::refundPayment
* @see app/Http/Controllers/FinanceController.php:408
* @route '/finance/payments/{payment}/refund'
*/
export const refundPayment = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refundPayment.url(args, options),
    method: 'post',
})

refundPayment.definition = {
    methods: ["post"],
    url: '/finance/payments/{payment}/refund',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::refundPayment
* @see app/Http/Controllers/FinanceController.php:408
* @route '/finance/payments/{payment}/refund'
*/
refundPayment.url = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: typeof args.payment === 'object'
        ? args.payment.id
        : args.payment,
    }

    return refundPayment.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::refundPayment
* @see app/Http/Controllers/FinanceController.php:408
* @route '/finance/payments/{payment}/refund'
*/
refundPayment.post = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refundPayment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::refundPayment
* @see app/Http/Controllers/FinanceController.php:408
* @route '/finance/payments/{payment}/refund'
*/
const refundPaymentForm = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: refundPayment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::refundPayment
* @see app/Http/Controllers/FinanceController.php:408
* @route '/finance/payments/{payment}/refund'
*/
refundPaymentForm.post = (args: { payment: string | { id: string } } | [payment: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: refundPayment.url(args, options),
    method: 'post',
})

refundPayment.form = refundPaymentForm

/**
* @see \App\Http\Controllers\FinanceController::downloadInvoice
* @see app/Http/Controllers/FinanceController.php:847
* @route '/finance/invoices/{invoice}/pdf'
*/
export const downloadInvoice = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadInvoice.url(args, options),
    method: 'get',
})

downloadInvoice.definition = {
    methods: ["get","head"],
    url: '/finance/invoices/{invoice}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceController::downloadInvoice
* @see app/Http/Controllers/FinanceController.php:847
* @route '/finance/invoices/{invoice}/pdf'
*/
downloadInvoice.url = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return downloadInvoice.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::downloadInvoice
* @see app/Http/Controllers/FinanceController.php:847
* @route '/finance/invoices/{invoice}/pdf'
*/
downloadInvoice.get = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadInvoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::downloadInvoice
* @see app/Http/Controllers/FinanceController.php:847
* @route '/finance/invoices/{invoice}/pdf'
*/
downloadInvoice.head = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadInvoice.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FinanceController::downloadInvoice
* @see app/Http/Controllers/FinanceController.php:847
* @route '/finance/invoices/{invoice}/pdf'
*/
const downloadInvoiceForm = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadInvoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::downloadInvoice
* @see app/Http/Controllers/FinanceController.php:847
* @route '/finance/invoices/{invoice}/pdf'
*/
downloadInvoiceForm.get = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadInvoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::downloadInvoice
* @see app/Http/Controllers/FinanceController.php:847
* @route '/finance/invoices/{invoice}/pdf'
*/
downloadInvoiceForm.head = (args: { invoice: string | { id: string } } | [invoice: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadInvoice.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadInvoice.form = downloadInvoiceForm

/**
* @see \App\Http\Controllers\FinanceController::downloadQuotation
* @see app/Http/Controllers/FinanceController.php:860
* @route '/finance/quotations/{quotation}/pdf'
*/
export const downloadQuotation = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadQuotation.url(args, options),
    method: 'get',
})

downloadQuotation.definition = {
    methods: ["get","head"],
    url: '/finance/quotations/{quotation}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceController::downloadQuotation
* @see app/Http/Controllers/FinanceController.php:860
* @route '/finance/quotations/{quotation}/pdf'
*/
downloadQuotation.url = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return downloadQuotation.definition.url
            .replace('{quotation}', parsedArgs.quotation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::downloadQuotation
* @see app/Http/Controllers/FinanceController.php:860
* @route '/finance/quotations/{quotation}/pdf'
*/
downloadQuotation.get = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadQuotation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::downloadQuotation
* @see app/Http/Controllers/FinanceController.php:860
* @route '/finance/quotations/{quotation}/pdf'
*/
downloadQuotation.head = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadQuotation.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FinanceController::downloadQuotation
* @see app/Http/Controllers/FinanceController.php:860
* @route '/finance/quotations/{quotation}/pdf'
*/
const downloadQuotationForm = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadQuotation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::downloadQuotation
* @see app/Http/Controllers/FinanceController.php:860
* @route '/finance/quotations/{quotation}/pdf'
*/
downloadQuotationForm.get = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadQuotation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::downloadQuotation
* @see app/Http/Controllers/FinanceController.php:860
* @route '/finance/quotations/{quotation}/pdf'
*/
downloadQuotationForm.head = (args: { quotation: string | { id: string } } | [quotation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadQuotation.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadQuotation.form = downloadQuotationForm

/**
* @see \App\Http\Controllers\FinanceController::storeAccount
* @see app/Http/Controllers/FinanceController.php:420
* @route '/finance/accounts'
*/
export const storeAccount = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAccount.url(options),
    method: 'post',
})

storeAccount.definition = {
    methods: ["post"],
    url: '/finance/accounts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::storeAccount
* @see app/Http/Controllers/FinanceController.php:420
* @route '/finance/accounts'
*/
storeAccount.url = (options?: RouteQueryOptions) => {
    return storeAccount.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::storeAccount
* @see app/Http/Controllers/FinanceController.php:420
* @route '/finance/accounts'
*/
storeAccount.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAccount.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storeAccount
* @see app/Http/Controllers/FinanceController.php:420
* @route '/finance/accounts'
*/
const storeAccountForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeAccount.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storeAccount
* @see app/Http/Controllers/FinanceController.php:420
* @route '/finance/accounts'
*/
storeAccountForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeAccount.url(options),
    method: 'post',
})

storeAccount.form = storeAccountForm

/**
* @see \App\Http\Controllers\FinanceController::storeTransfer
* @see app/Http/Controllers/FinanceController.php:434
* @route '/finance/transfers'
*/
export const storeTransfer = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTransfer.url(options),
    method: 'post',
})

storeTransfer.definition = {
    methods: ["post"],
    url: '/finance/transfers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::storeTransfer
* @see app/Http/Controllers/FinanceController.php:434
* @route '/finance/transfers'
*/
storeTransfer.url = (options?: RouteQueryOptions) => {
    return storeTransfer.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::storeTransfer
* @see app/Http/Controllers/FinanceController.php:434
* @route '/finance/transfers'
*/
storeTransfer.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTransfer.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storeTransfer
* @see app/Http/Controllers/FinanceController.php:434
* @route '/finance/transfers'
*/
const storeTransferForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTransfer.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storeTransfer
* @see app/Http/Controllers/FinanceController.php:434
* @route '/finance/transfers'
*/
storeTransferForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTransfer.url(options),
    method: 'post',
})

storeTransfer.form = storeTransferForm

/**
* @see \App\Http\Controllers\FinanceController::storePartnerTransaction
* @see app/Http/Controllers/FinanceController.php:474
* @route '/finance/partner-transactions'
*/
export const storePartnerTransaction = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePartnerTransaction.url(options),
    method: 'post',
})

storePartnerTransaction.definition = {
    methods: ["post"],
    url: '/finance/partner-transactions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::storePartnerTransaction
* @see app/Http/Controllers/FinanceController.php:474
* @route '/finance/partner-transactions'
*/
storePartnerTransaction.url = (options?: RouteQueryOptions) => {
    return storePartnerTransaction.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::storePartnerTransaction
* @see app/Http/Controllers/FinanceController.php:474
* @route '/finance/partner-transactions'
*/
storePartnerTransaction.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePartnerTransaction.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storePartnerTransaction
* @see app/Http/Controllers/FinanceController.php:474
* @route '/finance/partner-transactions'
*/
const storePartnerTransactionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePartnerTransaction.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storePartnerTransaction
* @see app/Http/Controllers/FinanceController.php:474
* @route '/finance/partner-transactions'
*/
storePartnerTransactionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePartnerTransaction.url(options),
    method: 'post',
})

storePartnerTransaction.form = storePartnerTransactionForm

/**
* @see \App\Http\Controllers\FinanceController::updatePartnerTransaction
* @see app/Http/Controllers/FinanceController.php:537
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
export const updatePartnerTransaction = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePartnerTransaction.url(args, options),
    method: 'put',
})

updatePartnerTransaction.definition = {
    methods: ["put"],
    url: '/finance/partner-transactions/{partnerTransaction}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FinanceController::updatePartnerTransaction
* @see app/Http/Controllers/FinanceController.php:537
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
updatePartnerTransaction.url = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { partnerTransaction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { partnerTransaction: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            partnerTransaction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        partnerTransaction: typeof args.partnerTransaction === 'object'
        ? args.partnerTransaction.id
        : args.partnerTransaction,
    }

    return updatePartnerTransaction.definition.url
            .replace('{partnerTransaction}', parsedArgs.partnerTransaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::updatePartnerTransaction
* @see app/Http/Controllers/FinanceController.php:537
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
updatePartnerTransaction.put = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePartnerTransaction.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\FinanceController::updatePartnerTransaction
* @see app/Http/Controllers/FinanceController.php:537
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
const updatePartnerTransactionForm = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePartnerTransaction.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::updatePartnerTransaction
* @see app/Http/Controllers/FinanceController.php:537
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
updatePartnerTransactionForm.put = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePartnerTransaction.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updatePartnerTransaction.form = updatePartnerTransactionForm

/**
* @see \App\Http\Controllers\FinanceController::destroyPartnerTransaction
* @see app/Http/Controllers/FinanceController.php:620
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
export const destroyPartnerTransaction = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPartnerTransaction.url(args, options),
    method: 'delete',
})

destroyPartnerTransaction.definition = {
    methods: ["delete"],
    url: '/finance/partner-transactions/{partnerTransaction}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FinanceController::destroyPartnerTransaction
* @see app/Http/Controllers/FinanceController.php:620
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
destroyPartnerTransaction.url = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { partnerTransaction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { partnerTransaction: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            partnerTransaction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        partnerTransaction: typeof args.partnerTransaction === 'object'
        ? args.partnerTransaction.id
        : args.partnerTransaction,
    }

    return destroyPartnerTransaction.definition.url
            .replace('{partnerTransaction}', parsedArgs.partnerTransaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::destroyPartnerTransaction
* @see app/Http/Controllers/FinanceController.php:620
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
destroyPartnerTransaction.delete = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPartnerTransaction.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\FinanceController::destroyPartnerTransaction
* @see app/Http/Controllers/FinanceController.php:620
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
const destroyPartnerTransactionForm = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyPartnerTransaction.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::destroyPartnerTransaction
* @see app/Http/Controllers/FinanceController.php:620
* @route '/finance/partner-transactions/{partnerTransaction}'
*/
destroyPartnerTransactionForm.delete = (args: { partnerTransaction: string | { id: string } } | [partnerTransaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyPartnerTransaction.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyPartnerTransaction.form = destroyPartnerTransactionForm

/**
* @see \App\Http\Controllers\FinanceController::storeClientTrustFund
* @see app/Http/Controllers/FinanceController.php:642
* @route '/finance/client-trust-funds'
*/
export const storeClientTrustFund = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeClientTrustFund.url(options),
    method: 'post',
})

storeClientTrustFund.definition = {
    methods: ["post"],
    url: '/finance/client-trust-funds',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::storeClientTrustFund
* @see app/Http/Controllers/FinanceController.php:642
* @route '/finance/client-trust-funds'
*/
storeClientTrustFund.url = (options?: RouteQueryOptions) => {
    return storeClientTrustFund.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::storeClientTrustFund
* @see app/Http/Controllers/FinanceController.php:642
* @route '/finance/client-trust-funds'
*/
storeClientTrustFund.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeClientTrustFund.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storeClientTrustFund
* @see app/Http/Controllers/FinanceController.php:642
* @route '/finance/client-trust-funds'
*/
const storeClientTrustFundForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeClientTrustFund.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storeClientTrustFund
* @see app/Http/Controllers/FinanceController.php:642
* @route '/finance/client-trust-funds'
*/
storeClientTrustFundForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeClientTrustFund.url(options),
    method: 'post',
})

storeClientTrustFund.form = storeClientTrustFundForm

/**
* @see \App\Http\Controllers\FinanceController::storePayroll
* @see app/Http/Controllers/FinanceController.php:688
* @route '/finance/payrolls'
*/
export const storePayroll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayroll.url(options),
    method: 'post',
})

storePayroll.definition = {
    methods: ["post"],
    url: '/finance/payrolls',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::storePayroll
* @see app/Http/Controllers/FinanceController.php:688
* @route '/finance/payrolls'
*/
storePayroll.url = (options?: RouteQueryOptions) => {
    return storePayroll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::storePayroll
* @see app/Http/Controllers/FinanceController.php:688
* @route '/finance/payrolls'
*/
storePayroll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayroll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storePayroll
* @see app/Http/Controllers/FinanceController.php:688
* @route '/finance/payrolls'
*/
const storePayrollForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePayroll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::storePayroll
* @see app/Http/Controllers/FinanceController.php:688
* @route '/finance/payrolls'
*/
storePayrollForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePayroll.url(options),
    method: 'post',
})

storePayroll.form = storePayrollForm

/**
* @see \App\Http\Controllers\FinanceController::updatePayroll
* @see app/Http/Controllers/FinanceController.php:739
* @route '/finance/payrolls/{payroll}'
*/
export const updatePayroll = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePayroll.url(args, options),
    method: 'put',
})

updatePayroll.definition = {
    methods: ["put"],
    url: '/finance/payrolls/{payroll}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FinanceController::updatePayroll
* @see app/Http/Controllers/FinanceController.php:739
* @route '/finance/payrolls/{payroll}'
*/
updatePayroll.url = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payroll: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payroll: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payroll: typeof args.payroll === 'object'
        ? args.payroll.id
        : args.payroll,
    }

    return updatePayroll.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::updatePayroll
* @see app/Http/Controllers/FinanceController.php:739
* @route '/finance/payrolls/{payroll}'
*/
updatePayroll.put = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePayroll.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\FinanceController::updatePayroll
* @see app/Http/Controllers/FinanceController.php:739
* @route '/finance/payrolls/{payroll}'
*/
const updatePayrollForm = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePayroll.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::updatePayroll
* @see app/Http/Controllers/FinanceController.php:739
* @route '/finance/payrolls/{payroll}'
*/
updatePayrollForm.put = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePayroll.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updatePayroll.form = updatePayrollForm

/**
* @see \App\Http\Controllers\FinanceController::updatePayrollStatus
* @see app/Http/Controllers/FinanceController.php:810
* @route '/finance/payrolls/{payroll}/status'
*/
export const updatePayrollStatus = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePayrollStatus.url(args, options),
    method: 'patch',
})

updatePayrollStatus.definition = {
    methods: ["patch"],
    url: '/finance/payrolls/{payroll}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\FinanceController::updatePayrollStatus
* @see app/Http/Controllers/FinanceController.php:810
* @route '/finance/payrolls/{payroll}/status'
*/
updatePayrollStatus.url = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payroll: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payroll: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payroll: typeof args.payroll === 'object'
        ? args.payroll.id
        : args.payroll,
    }

    return updatePayrollStatus.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::updatePayrollStatus
* @see app/Http/Controllers/FinanceController.php:810
* @route '/finance/payrolls/{payroll}/status'
*/
updatePayrollStatus.patch = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePayrollStatus.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\FinanceController::updatePayrollStatus
* @see app/Http/Controllers/FinanceController.php:810
* @route '/finance/payrolls/{payroll}/status'
*/
const updatePayrollStatusForm = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePayrollStatus.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::updatePayrollStatus
* @see app/Http/Controllers/FinanceController.php:810
* @route '/finance/payrolls/{payroll}/status'
*/
updatePayrollStatusForm.patch = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePayrollStatus.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updatePayrollStatus.form = updatePayrollStatusForm

/**
* @see \App\Http\Controllers\FinanceController::downloadPayslip
* @see app/Http/Controllers/FinanceController.php:832
* @route '/finance/payrolls/{payroll}/slip'
*/
export const downloadPayslip = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPayslip.url(args, options),
    method: 'get',
})

downloadPayslip.definition = {
    methods: ["get","head"],
    url: '/finance/payrolls/{payroll}/slip',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceController::downloadPayslip
* @see app/Http/Controllers/FinanceController.php:832
* @route '/finance/payrolls/{payroll}/slip'
*/
downloadPayslip.url = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payroll: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payroll: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payroll: typeof args.payroll === 'object'
        ? args.payroll.id
        : args.payroll,
    }

    return downloadPayslip.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::downloadPayslip
* @see app/Http/Controllers/FinanceController.php:832
* @route '/finance/payrolls/{payroll}/slip'
*/
downloadPayslip.get = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPayslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::downloadPayslip
* @see app/Http/Controllers/FinanceController.php:832
* @route '/finance/payrolls/{payroll}/slip'
*/
downloadPayslip.head = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadPayslip.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FinanceController::downloadPayslip
* @see app/Http/Controllers/FinanceController.php:832
* @route '/finance/payrolls/{payroll}/slip'
*/
const downloadPayslipForm = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadPayslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::downloadPayslip
* @see app/Http/Controllers/FinanceController.php:832
* @route '/finance/payrolls/{payroll}/slip'
*/
downloadPayslipForm.get = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadPayslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::downloadPayslip
* @see app/Http/Controllers/FinanceController.php:832
* @route '/finance/payrolls/{payroll}/slip'
*/
downloadPayslipForm.head = (args: { payroll: string | { id: string } } | [payroll: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadPayslip.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadPayslip.form = downloadPayslipForm

/**
* @see \App\Http\Controllers\FinanceController::uploadProof
* @see app/Http/Controllers/FinanceController.php:894
* @route '/finance/{entity}/{id}/proof'
*/
export const uploadProof = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadProof.url(args, options),
    method: 'post',
})

uploadProof.definition = {
    methods: ["post"],
    url: '/finance/{entity}/{id}/proof',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FinanceController::uploadProof
* @see app/Http/Controllers/FinanceController.php:894
* @route '/finance/{entity}/{id}/proof'
*/
uploadProof.url = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            entity: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        entity: args.entity,
        id: args.id,
    }

    return uploadProof.definition.url
            .replace('{entity}', parsedArgs.entity.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::uploadProof
* @see app/Http/Controllers/FinanceController.php:894
* @route '/finance/{entity}/{id}/proof'
*/
uploadProof.post = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadProof.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::uploadProof
* @see app/Http/Controllers/FinanceController.php:894
* @route '/finance/{entity}/{id}/proof'
*/
const uploadProofForm = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadProof.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::uploadProof
* @see app/Http/Controllers/FinanceController.php:894
* @route '/finance/{entity}/{id}/proof'
*/
uploadProofForm.post = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadProof.url(args, options),
    method: 'post',
})

uploadProof.form = uploadProofForm

/**
* @see \App\Http\Controllers\FinanceController::destroyProof
* @see app/Http/Controllers/FinanceController.php:921
* @route '/finance/{entity}/{id}/proof'
*/
export const destroyProof = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyProof.url(args, options),
    method: 'delete',
})

destroyProof.definition = {
    methods: ["delete"],
    url: '/finance/{entity}/{id}/proof',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FinanceController::destroyProof
* @see app/Http/Controllers/FinanceController.php:921
* @route '/finance/{entity}/{id}/proof'
*/
destroyProof.url = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            entity: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        entity: args.entity,
        id: args.id,
    }

    return destroyProof.definition.url
            .replace('{entity}', parsedArgs.entity.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::destroyProof
* @see app/Http/Controllers/FinanceController.php:921
* @route '/finance/{entity}/{id}/proof'
*/
destroyProof.delete = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyProof.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\FinanceController::destroyProof
* @see app/Http/Controllers/FinanceController.php:921
* @route '/finance/{entity}/{id}/proof'
*/
const destroyProofForm = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyProof.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FinanceController::destroyProof
* @see app/Http/Controllers/FinanceController.php:921
* @route '/finance/{entity}/{id}/proof'
*/
destroyProofForm.delete = (args: { entity: string | number, id: string | number } | [entity: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyProof.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyProof.form = destroyProofForm

const FinanceController = { index, updateMatterContract, exportExcel, storeInvoice, updateInvoice, transitionInvoice, storeQuotation, updateQuotation, approveQuotation, storeExpense, destroyExpense, updateExpense, storePayment, reversePayment, refundPayment, downloadInvoice, downloadQuotation, storeAccount, storeTransfer, storePartnerTransaction, updatePartnerTransaction, destroyPartnerTransaction, storeClientTrustFund, storePayroll, updatePayroll, updatePayrollStatus, downloadPayslip, uploadProof, destroyProof }

export default FinanceController