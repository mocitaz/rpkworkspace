import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import invoice18aa04 from './invoice'
import correspondence66c71e from './correspondence'
/**
* @see \App\Http\Controllers\PublicVerificationController::invoice
* @see app/Http/Controllers/PublicVerificationController.php:17
* @route '/verify/invoice/{invoiceNumber}'
*/
export const invoice = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})

invoice.definition = {
    methods: ["get","head"],
    url: '/verify/invoice/{invoiceNumber}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::invoice
* @see app/Http/Controllers/PublicVerificationController.php:17
* @route '/verify/invoice/{invoiceNumber}'
*/
invoice.url = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return invoice.definition.url
            .replace('{invoiceNumber}', parsedArgs.invoiceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::invoice
* @see app/Http/Controllers/PublicVerificationController.php:17
* @route '/verify/invoice/{invoiceNumber}'
*/
invoice.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::invoice
* @see app/Http/Controllers/PublicVerificationController.php:17
* @route '/verify/invoice/{invoiceNumber}'
*/
invoice.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: invoice.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::invoice
* @see app/Http/Controllers/PublicVerificationController.php:17
* @route '/verify/invoice/{invoiceNumber}'
*/
const invoiceForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: invoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::invoice
* @see app/Http/Controllers/PublicVerificationController.php:17
* @route '/verify/invoice/{invoiceNumber}'
*/
invoiceForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: invoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::invoice
* @see app/Http/Controllers/PublicVerificationController.php:17
* @route '/verify/invoice/{invoiceNumber}'
*/
invoiceForm.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: invoice.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

invoice.form = invoiceForm

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondence
* @see app/Http/Controllers/PublicVerificationController.php:60
* @route '/verify/correspondence/{correspondence}'
*/
export const correspondence = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correspondence.url(args, options),
    method: 'get',
})

correspondence.definition = {
    methods: ["get","head"],
    url: '/verify/correspondence/{correspondence}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondence
* @see app/Http/Controllers/PublicVerificationController.php:60
* @route '/verify/correspondence/{correspondence}'
*/
correspondence.url = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return correspondence.definition.url
            .replace('{correspondence}', parsedArgs.correspondence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondence
* @see app/Http/Controllers/PublicVerificationController.php:60
* @route '/verify/correspondence/{correspondence}'
*/
correspondence.get = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correspondence.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondence
* @see app/Http/Controllers/PublicVerificationController.php:60
* @route '/verify/correspondence/{correspondence}'
*/
correspondence.head = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: correspondence.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondence
* @see app/Http/Controllers/PublicVerificationController.php:60
* @route '/verify/correspondence/{correspondence}'
*/
const correspondenceForm = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: correspondence.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondence
* @see app/Http/Controllers/PublicVerificationController.php:60
* @route '/verify/correspondence/{correspondence}'
*/
correspondenceForm.get = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: correspondence.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondence
* @see app/Http/Controllers/PublicVerificationController.php:60
* @route '/verify/correspondence/{correspondence}'
*/
correspondenceForm.head = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: correspondence.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

correspondence.form = correspondenceForm

const verify = {
    invoice: Object.assign(invoice, invoice18aa04),
    correspondence: Object.assign(correspondence, correspondence66c71e),
}

export default verify