import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import invoice18aa04 from './invoice'
import quotationBcb01b from './quotation'
import paymentReceipt065a76 from './payment-receipt'
import payslip5f0ae0 from './payslip'
import correspondence66c71e from './correspondence'
import conflictCertificate3f733e from './conflict-certificate'
import matterStatus79464c from './matter-status'
/**
* @see \App\Http\Controllers\PublicVerificationController::invoice
* @see app/Http/Controllers/PublicVerificationController.php:22
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
* @see app/Http/Controllers/PublicVerificationController.php:22
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
* @see app/Http/Controllers/PublicVerificationController.php:22
* @route '/verify/invoice/{invoiceNumber}'
*/
invoice.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::invoice
* @see app/Http/Controllers/PublicVerificationController.php:22
* @route '/verify/invoice/{invoiceNumber}'
*/
invoice.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: invoice.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::quotation
* @see app/Http/Controllers/PublicVerificationController.php:137
* @route '/verify/quotation/{quotationNumber}'
*/
export const quotation = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: quotation.url(args, options),
    method: 'get',
})

quotation.definition = {
    methods: ["get","head"],
    url: '/verify/quotation/{quotationNumber}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::quotation
* @see app/Http/Controllers/PublicVerificationController.php:137
* @route '/verify/quotation/{quotationNumber}'
*/
quotation.url = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { quotationNumber: args }
    }

    if (Array.isArray(args)) {
        args = {
            quotationNumber: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        quotationNumber: args.quotationNumber,
    }

    return quotation.definition.url
            .replace('{quotationNumber}', parsedArgs.quotationNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::quotation
* @see app/Http/Controllers/PublicVerificationController.php:137
* @route '/verify/quotation/{quotationNumber}'
*/
quotation.get = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: quotation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::quotation
* @see app/Http/Controllers/PublicVerificationController.php:137
* @route '/verify/quotation/{quotationNumber}'
*/
quotation.head = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: quotation.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::paymentReceipt
* @see app/Http/Controllers/PublicVerificationController.php:181
* @route '/verify/payment-receipt/{referenceNumber}'
*/
export const paymentReceipt = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentReceipt.url(args, options),
    method: 'get',
})

paymentReceipt.definition = {
    methods: ["get","head"],
    url: '/verify/payment-receipt/{referenceNumber}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::paymentReceipt
* @see app/Http/Controllers/PublicVerificationController.php:181
* @route '/verify/payment-receipt/{referenceNumber}'
*/
paymentReceipt.url = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { referenceNumber: args }
    }

    if (Array.isArray(args)) {
        args = {
            referenceNumber: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        referenceNumber: args.referenceNumber,
    }

    return paymentReceipt.definition.url
            .replace('{referenceNumber}', parsedArgs.referenceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::paymentReceipt
* @see app/Http/Controllers/PublicVerificationController.php:181
* @route '/verify/payment-receipt/{referenceNumber}'
*/
paymentReceipt.get = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentReceipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::paymentReceipt
* @see app/Http/Controllers/PublicVerificationController.php:181
* @route '/verify/payment-receipt/{referenceNumber}'
*/
paymentReceipt.head = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: paymentReceipt.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::payslip
* @see app/Http/Controllers/PublicVerificationController.php:99
* @route '/verify/payslip/{payslipNumber}'
*/
export const payslip = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslip.url(args, options),
    method: 'get',
})

payslip.definition = {
    methods: ["get","head"],
    url: '/verify/payslip/{payslipNumber}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::payslip
* @see app/Http/Controllers/PublicVerificationController.php:99
* @route '/verify/payslip/{payslipNumber}'
*/
payslip.url = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payslipNumber: args }
    }

    if (Array.isArray(args)) {
        args = {
            payslipNumber: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payslipNumber: args.payslipNumber,
    }

    return payslip.definition.url
            .replace('{payslipNumber}', parsedArgs.payslipNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::payslip
* @see app/Http/Controllers/PublicVerificationController.php:99
* @route '/verify/payslip/{payslipNumber}'
*/
payslip.get = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::payslip
* @see app/Http/Controllers/PublicVerificationController.php:99
* @route '/verify/payslip/{payslipNumber}'
*/
payslip.head = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payslip.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondence
* @see app/Http/Controllers/PublicVerificationController.php:65
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
* @see app/Http/Controllers/PublicVerificationController.php:65
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
* @see app/Http/Controllers/PublicVerificationController.php:65
* @route '/verify/correspondence/{correspondence}'
*/
correspondence.get = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correspondence.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondence
* @see app/Http/Controllers/PublicVerificationController.php:65
* @route '/verify/correspondence/{correspondence}'
*/
correspondence.head = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: correspondence.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::conflictCertificate
* @see app/Http/Controllers/PublicVerificationController.php:225
* @route '/verify/conflict/{conflictCheck}'
*/
export const conflictCertificate = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conflictCertificate.url(args, options),
    method: 'get',
})

conflictCertificate.definition = {
    methods: ["get","head"],
    url: '/verify/conflict/{conflictCheck}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::conflictCertificate
* @see app/Http/Controllers/PublicVerificationController.php:225
* @route '/verify/conflict/{conflictCheck}'
*/
conflictCertificate.url = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return conflictCertificate.definition.url
            .replace('{conflictCheck}', parsedArgs.conflictCheck.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::conflictCertificate
* @see app/Http/Controllers/PublicVerificationController.php:225
* @route '/verify/conflict/{conflictCheck}'
*/
conflictCertificate.get = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conflictCertificate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::conflictCertificate
* @see app/Http/Controllers/PublicVerificationController.php:225
* @route '/verify/conflict/{conflictCheck}'
*/
conflictCertificate.head = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: conflictCertificate.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::matterStatus
* @see app/Http/Controllers/PublicVerificationController.php:259
* @route '/verify/matter-status/{matter}'
*/
export const matterStatus = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: matterStatus.url(args, options),
    method: 'get',
})

matterStatus.definition = {
    methods: ["get","head"],
    url: '/verify/matter-status/{matter}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::matterStatus
* @see app/Http/Controllers/PublicVerificationController.php:259
* @route '/verify/matter-status/{matter}'
*/
matterStatus.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return matterStatus.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::matterStatus
* @see app/Http/Controllers/PublicVerificationController.php:259
* @route '/verify/matter-status/{matter}'
*/
matterStatus.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: matterStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::matterStatus
* @see app/Http/Controllers/PublicVerificationController.php:259
* @route '/verify/matter-status/{matter}'
*/
matterStatus.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: matterStatus.url(args, options),
    method: 'head',
})

const verify = {
    invoice: Object.assign(invoice, invoice18aa04),
    quotation: Object.assign(quotation, quotationBcb01b),
    paymentReceipt: Object.assign(paymentReceipt, paymentReceipt065a76),
    payslip: Object.assign(payslip, payslip5f0ae0),
    correspondence: Object.assign(correspondence, correspondence66c71e),
    conflictCertificate: Object.assign(conflictCertificate, conflictCertificate3f733e),
    matterStatus: Object.assign(matterStatus, matterStatus79464c),
}

export default verify