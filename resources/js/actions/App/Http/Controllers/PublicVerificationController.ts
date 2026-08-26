import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicVerificationController::verifyInvoice
* @see app/Http/Controllers/PublicVerificationController.php:17
* @route '/verify/invoice/{invoiceNumber}'
*/
export const verifyInvoice = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyInvoice.url(args, options),
    method: 'get',
})

verifyInvoice.definition = {
    methods: ["get","head"],
    url: '/verify/invoice/{invoiceNumber}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyInvoice
* @see app/Http/Controllers/PublicVerificationController.php:17
* @route '/verify/invoice/{invoiceNumber}'
*/
verifyInvoice.url = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoiceNumber: args }
    }

    if (Array.isArray(args)) {
        args = {
            invoiceNumber: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invoiceNumber: args.invoiceNumber,
    }

    return verifyInvoice.definition.url
            .replace('{invoiceNumber}', parsedArgs.invoiceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyInvoice
* @see app/Http/Controllers/PublicVerificationController.php:17
* @route '/verify/invoice/{invoiceNumber}'
*/
verifyInvoice.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyInvoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyInvoice
* @see app/Http/Controllers/PublicVerificationController.php:17
* @route '/verify/invoice/{invoiceNumber}'
*/
verifyInvoice.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verifyInvoice.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyInvoice
* @see app/Http/Controllers/PublicVerificationController.php:17
* @route '/verify/invoice/{invoiceNumber}'
*/
const verifyInvoiceForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyInvoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyInvoice
* @see app/Http/Controllers/PublicVerificationController.php:17
* @route '/verify/invoice/{invoiceNumber}'
*/
verifyInvoiceForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyInvoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyInvoice
* @see app/Http/Controllers/PublicVerificationController.php:17
* @route '/verify/invoice/{invoiceNumber}'
*/
verifyInvoiceForm.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyInvoice.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

verifyInvoice.form = verifyInvoiceForm

/**
* @see \App\Http\Controllers\PublicVerificationController::invoiceQr
* @see app/Http/Controllers/PublicVerificationController.php:36
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
export const invoiceQr = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoiceQr.url(args, options),
    method: 'get',
})

invoiceQr.definition = {
    methods: ["get","head"],
    url: '/verify/invoice/{invoiceNumber}/qr.svg',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::invoiceQr
* @see app/Http/Controllers/PublicVerificationController.php:36
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
invoiceQr.url = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoiceNumber: args }
    }

    if (Array.isArray(args)) {
        args = {
            invoiceNumber: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invoiceNumber: args.invoiceNumber,
    }

    return invoiceQr.definition.url
            .replace('{invoiceNumber}', parsedArgs.invoiceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::invoiceQr
* @see app/Http/Controllers/PublicVerificationController.php:36
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
invoiceQr.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoiceQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::invoiceQr
* @see app/Http/Controllers/PublicVerificationController.php:36
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
invoiceQr.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: invoiceQr.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::invoiceQr
* @see app/Http/Controllers/PublicVerificationController.php:36
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
const invoiceQrForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: invoiceQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::invoiceQr
* @see app/Http/Controllers/PublicVerificationController.php:36
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
invoiceQrForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: invoiceQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::invoiceQr
* @see app/Http/Controllers/PublicVerificationController.php:36
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
invoiceQrForm.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: invoiceQr.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

invoiceQr.form = invoiceQrForm

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyCorrespondence
* @see app/Http/Controllers/PublicVerificationController.php:60
* @route '/verify/correspondence/{correspondence}'
*/
export const verifyCorrespondence = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyCorrespondence.url(args, options),
    method: 'get',
})

verifyCorrespondence.definition = {
    methods: ["get","head"],
    url: '/verify/correspondence/{correspondence}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyCorrespondence
* @see app/Http/Controllers/PublicVerificationController.php:60
* @route '/verify/correspondence/{correspondence}'
*/
verifyCorrespondence.url = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { correspondence: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { correspondence: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            correspondence: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        correspondence: typeof args.correspondence === 'object'
        ? args.correspondence.id
        : args.correspondence,
    }

    return verifyCorrespondence.definition.url
            .replace('{correspondence}', parsedArgs.correspondence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyCorrespondence
* @see app/Http/Controllers/PublicVerificationController.php:60
* @route '/verify/correspondence/{correspondence}'
*/
verifyCorrespondence.get = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyCorrespondence.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyCorrespondence
* @see app/Http/Controllers/PublicVerificationController.php:60
* @route '/verify/correspondence/{correspondence}'
*/
verifyCorrespondence.head = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verifyCorrespondence.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyCorrespondence
* @see app/Http/Controllers/PublicVerificationController.php:60
* @route '/verify/correspondence/{correspondence}'
*/
const verifyCorrespondenceForm = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyCorrespondence.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyCorrespondence
* @see app/Http/Controllers/PublicVerificationController.php:60
* @route '/verify/correspondence/{correspondence}'
*/
verifyCorrespondenceForm.get = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyCorrespondence.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyCorrespondence
* @see app/Http/Controllers/PublicVerificationController.php:60
* @route '/verify/correspondence/{correspondence}'
*/
verifyCorrespondenceForm.head = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyCorrespondence.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

verifyCorrespondence.form = verifyCorrespondenceForm

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondenceQr
* @see app/Http/Controllers/PublicVerificationController.php:75
* @route '/verify/correspondence/{correspondence}/qr.svg'
*/
export const correspondenceQr = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correspondenceQr.url(args, options),
    method: 'get',
})

correspondenceQr.definition = {
    methods: ["get","head"],
    url: '/verify/correspondence/{correspondence}/qr.svg',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondenceQr
* @see app/Http/Controllers/PublicVerificationController.php:75
* @route '/verify/correspondence/{correspondence}/qr.svg'
*/
correspondenceQr.url = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { correspondence: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { correspondence: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            correspondence: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        correspondence: typeof args.correspondence === 'object'
        ? args.correspondence.id
        : args.correspondence,
    }

    return correspondenceQr.definition.url
            .replace('{correspondence}', parsedArgs.correspondence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondenceQr
* @see app/Http/Controllers/PublicVerificationController.php:75
* @route '/verify/correspondence/{correspondence}/qr.svg'
*/
correspondenceQr.get = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correspondenceQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondenceQr
* @see app/Http/Controllers/PublicVerificationController.php:75
* @route '/verify/correspondence/{correspondence}/qr.svg'
*/
correspondenceQr.head = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: correspondenceQr.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondenceQr
* @see app/Http/Controllers/PublicVerificationController.php:75
* @route '/verify/correspondence/{correspondence}/qr.svg'
*/
const correspondenceQrForm = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: correspondenceQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondenceQr
* @see app/Http/Controllers/PublicVerificationController.php:75
* @route '/verify/correspondence/{correspondence}/qr.svg'
*/
correspondenceQrForm.get = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: correspondenceQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondenceQr
* @see app/Http/Controllers/PublicVerificationController.php:75
* @route '/verify/correspondence/{correspondence}/qr.svg'
*/
correspondenceQrForm.head = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: correspondenceQr.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

correspondenceQr.form = correspondenceQrForm

const PublicVerificationController = { verifyInvoice, invoiceQr, verifyCorrespondence, correspondenceQr }

export default PublicVerificationController