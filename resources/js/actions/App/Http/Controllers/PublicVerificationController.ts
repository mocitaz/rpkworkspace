import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicVerificationController::verifyInvoice
* @see app/Http/Controllers/PublicVerificationController.php:22
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
* @see app/Http/Controllers/PublicVerificationController.php:22
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
* @see app/Http/Controllers/PublicVerificationController.php:22
* @route '/verify/invoice/{invoiceNumber}'
*/
verifyInvoice.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyInvoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyInvoice
* @see app/Http/Controllers/PublicVerificationController.php:22
* @route '/verify/invoice/{invoiceNumber}'
*/
verifyInvoice.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verifyInvoice.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyInvoice
* @see app/Http/Controllers/PublicVerificationController.php:22
* @route '/verify/invoice/{invoiceNumber}'
*/
const verifyInvoiceForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyInvoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyInvoice
* @see app/Http/Controllers/PublicVerificationController.php:22
* @route '/verify/invoice/{invoiceNumber}'
*/
verifyInvoiceForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyInvoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyInvoice
* @see app/Http/Controllers/PublicVerificationController.php:22
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
* @see app/Http/Controllers/PublicVerificationController.php:41
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
* @see app/Http/Controllers/PublicVerificationController.php:41
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
* @see app/Http/Controllers/PublicVerificationController.php:41
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
invoiceQr.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoiceQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::invoiceQr
* @see app/Http/Controllers/PublicVerificationController.php:41
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
invoiceQr.head = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: invoiceQr.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::invoiceQr
* @see app/Http/Controllers/PublicVerificationController.php:41
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
const invoiceQrForm = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: invoiceQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::invoiceQr
* @see app/Http/Controllers/PublicVerificationController.php:41
* @route '/verify/invoice/{invoiceNumber}/qr.svg'
*/
invoiceQrForm.get = (args: { invoiceNumber: string | number } | [invoiceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: invoiceQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::invoiceQr
* @see app/Http/Controllers/PublicVerificationController.php:41
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
* @see \App\Http\Controllers\PublicVerificationController::verifyQuotation
* @see app/Http/Controllers/PublicVerificationController.php:137
* @route '/verify/quotation/{quotationNumber}'
*/
export const verifyQuotation = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyQuotation.url(args, options),
    method: 'get',
})

verifyQuotation.definition = {
    methods: ["get","head"],
    url: '/verify/quotation/{quotationNumber}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyQuotation
* @see app/Http/Controllers/PublicVerificationController.php:137
* @route '/verify/quotation/{quotationNumber}'
*/
verifyQuotation.url = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return verifyQuotation.definition.url
            .replace('{quotationNumber}', parsedArgs.quotationNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyQuotation
* @see app/Http/Controllers/PublicVerificationController.php:137
* @route '/verify/quotation/{quotationNumber}'
*/
verifyQuotation.get = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyQuotation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyQuotation
* @see app/Http/Controllers/PublicVerificationController.php:137
* @route '/verify/quotation/{quotationNumber}'
*/
verifyQuotation.head = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verifyQuotation.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyQuotation
* @see app/Http/Controllers/PublicVerificationController.php:137
* @route '/verify/quotation/{quotationNumber}'
*/
const verifyQuotationForm = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyQuotation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyQuotation
* @see app/Http/Controllers/PublicVerificationController.php:137
* @route '/verify/quotation/{quotationNumber}'
*/
verifyQuotationForm.get = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyQuotation.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyQuotation
* @see app/Http/Controllers/PublicVerificationController.php:137
* @route '/verify/quotation/{quotationNumber}'
*/
verifyQuotationForm.head = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyQuotation.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

verifyQuotation.form = verifyQuotationForm

/**
* @see \App\Http\Controllers\PublicVerificationController::quotationQr
* @see app/Http/Controllers/PublicVerificationController.php:157
* @route '/verify/quotation/{quotationNumber}/qr.svg'
*/
export const quotationQr = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: quotationQr.url(args, options),
    method: 'get',
})

quotationQr.definition = {
    methods: ["get","head"],
    url: '/verify/quotation/{quotationNumber}/qr.svg',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::quotationQr
* @see app/Http/Controllers/PublicVerificationController.php:157
* @route '/verify/quotation/{quotationNumber}/qr.svg'
*/
quotationQr.url = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return quotationQr.definition.url
            .replace('{quotationNumber}', parsedArgs.quotationNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::quotationQr
* @see app/Http/Controllers/PublicVerificationController.php:157
* @route '/verify/quotation/{quotationNumber}/qr.svg'
*/
quotationQr.get = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: quotationQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::quotationQr
* @see app/Http/Controllers/PublicVerificationController.php:157
* @route '/verify/quotation/{quotationNumber}/qr.svg'
*/
quotationQr.head = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: quotationQr.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::quotationQr
* @see app/Http/Controllers/PublicVerificationController.php:157
* @route '/verify/quotation/{quotationNumber}/qr.svg'
*/
const quotationQrForm = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: quotationQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::quotationQr
* @see app/Http/Controllers/PublicVerificationController.php:157
* @route '/verify/quotation/{quotationNumber}/qr.svg'
*/
quotationQrForm.get = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: quotationQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::quotationQr
* @see app/Http/Controllers/PublicVerificationController.php:157
* @route '/verify/quotation/{quotationNumber}/qr.svg'
*/
quotationQrForm.head = (args: { quotationNumber: string | number } | [quotationNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: quotationQr.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

quotationQr.form = quotationQrForm

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyPaymentReceipt
* @see app/Http/Controllers/PublicVerificationController.php:181
* @route '/verify/payment-receipt/{referenceNumber}'
*/
export const verifyPaymentReceipt = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyPaymentReceipt.url(args, options),
    method: 'get',
})

verifyPaymentReceipt.definition = {
    methods: ["get","head"],
    url: '/verify/payment-receipt/{referenceNumber}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyPaymentReceipt
* @see app/Http/Controllers/PublicVerificationController.php:181
* @route '/verify/payment-receipt/{referenceNumber}'
*/
verifyPaymentReceipt.url = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return verifyPaymentReceipt.definition.url
            .replace('{referenceNumber}', parsedArgs.referenceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyPaymentReceipt
* @see app/Http/Controllers/PublicVerificationController.php:181
* @route '/verify/payment-receipt/{referenceNumber}'
*/
verifyPaymentReceipt.get = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyPaymentReceipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyPaymentReceipt
* @see app/Http/Controllers/PublicVerificationController.php:181
* @route '/verify/payment-receipt/{referenceNumber}'
*/
verifyPaymentReceipt.head = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verifyPaymentReceipt.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyPaymentReceipt
* @see app/Http/Controllers/PublicVerificationController.php:181
* @route '/verify/payment-receipt/{referenceNumber}'
*/
const verifyPaymentReceiptForm = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyPaymentReceipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyPaymentReceipt
* @see app/Http/Controllers/PublicVerificationController.php:181
* @route '/verify/payment-receipt/{referenceNumber}'
*/
verifyPaymentReceiptForm.get = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyPaymentReceipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyPaymentReceipt
* @see app/Http/Controllers/PublicVerificationController.php:181
* @route '/verify/payment-receipt/{referenceNumber}'
*/
verifyPaymentReceiptForm.head = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyPaymentReceipt.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

verifyPaymentReceipt.form = verifyPaymentReceiptForm

/**
* @see \App\Http\Controllers\PublicVerificationController::paymentReceiptQr
* @see app/Http/Controllers/PublicVerificationController.php:201
* @route '/verify/payment-receipt/{referenceNumber}/qr.svg'
*/
export const paymentReceiptQr = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentReceiptQr.url(args, options),
    method: 'get',
})

paymentReceiptQr.definition = {
    methods: ["get","head"],
    url: '/verify/payment-receipt/{referenceNumber}/qr.svg',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::paymentReceiptQr
* @see app/Http/Controllers/PublicVerificationController.php:201
* @route '/verify/payment-receipt/{referenceNumber}/qr.svg'
*/
paymentReceiptQr.url = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return paymentReceiptQr.definition.url
            .replace('{referenceNumber}', parsedArgs.referenceNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::paymentReceiptQr
* @see app/Http/Controllers/PublicVerificationController.php:201
* @route '/verify/payment-receipt/{referenceNumber}/qr.svg'
*/
paymentReceiptQr.get = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentReceiptQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::paymentReceiptQr
* @see app/Http/Controllers/PublicVerificationController.php:201
* @route '/verify/payment-receipt/{referenceNumber}/qr.svg'
*/
paymentReceiptQr.head = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: paymentReceiptQr.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::paymentReceiptQr
* @see app/Http/Controllers/PublicVerificationController.php:201
* @route '/verify/payment-receipt/{referenceNumber}/qr.svg'
*/
const paymentReceiptQrForm = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: paymentReceiptQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::paymentReceiptQr
* @see app/Http/Controllers/PublicVerificationController.php:201
* @route '/verify/payment-receipt/{referenceNumber}/qr.svg'
*/
paymentReceiptQrForm.get = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: paymentReceiptQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::paymentReceiptQr
* @see app/Http/Controllers/PublicVerificationController.php:201
* @route '/verify/payment-receipt/{referenceNumber}/qr.svg'
*/
paymentReceiptQrForm.head = (args: { referenceNumber: string | number } | [referenceNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: paymentReceiptQr.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

paymentReceiptQr.form = paymentReceiptQrForm

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyPayslip
* @see app/Http/Controllers/PublicVerificationController.php:99
* @route '/verify/payslip/{payslipNumber}'
*/
export const verifyPayslip = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyPayslip.url(args, options),
    method: 'get',
})

verifyPayslip.definition = {
    methods: ["get","head"],
    url: '/verify/payslip/{payslipNumber}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyPayslip
* @see app/Http/Controllers/PublicVerificationController.php:99
* @route '/verify/payslip/{payslipNumber}'
*/
verifyPayslip.url = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return verifyPayslip.definition.url
            .replace('{payslipNumber}', parsedArgs.payslipNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyPayslip
* @see app/Http/Controllers/PublicVerificationController.php:99
* @route '/verify/payslip/{payslipNumber}'
*/
verifyPayslip.get = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyPayslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyPayslip
* @see app/Http/Controllers/PublicVerificationController.php:99
* @route '/verify/payslip/{payslipNumber}'
*/
verifyPayslip.head = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verifyPayslip.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyPayslip
* @see app/Http/Controllers/PublicVerificationController.php:99
* @route '/verify/payslip/{payslipNumber}'
*/
const verifyPayslipForm = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyPayslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyPayslip
* @see app/Http/Controllers/PublicVerificationController.php:99
* @route '/verify/payslip/{payslipNumber}'
*/
verifyPayslipForm.get = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyPayslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyPayslip
* @see app/Http/Controllers/PublicVerificationController.php:99
* @route '/verify/payslip/{payslipNumber}'
*/
verifyPayslipForm.head = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyPayslip.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

verifyPayslip.form = verifyPayslipForm

/**
* @see \App\Http\Controllers\PublicVerificationController::payslipQr
* @see app/Http/Controllers/PublicVerificationController.php:113
* @route '/verify/payslip/{payslipNumber}/qr.svg'
*/
export const payslipQr = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslipQr.url(args, options),
    method: 'get',
})

payslipQr.definition = {
    methods: ["get","head"],
    url: '/verify/payslip/{payslipNumber}/qr.svg',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::payslipQr
* @see app/Http/Controllers/PublicVerificationController.php:113
* @route '/verify/payslip/{payslipNumber}/qr.svg'
*/
payslipQr.url = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return payslipQr.definition.url
            .replace('{payslipNumber}', parsedArgs.payslipNumber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::payslipQr
* @see app/Http/Controllers/PublicVerificationController.php:113
* @route '/verify/payslip/{payslipNumber}/qr.svg'
*/
payslipQr.get = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslipQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::payslipQr
* @see app/Http/Controllers/PublicVerificationController.php:113
* @route '/verify/payslip/{payslipNumber}/qr.svg'
*/
payslipQr.head = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payslipQr.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::payslipQr
* @see app/Http/Controllers/PublicVerificationController.php:113
* @route '/verify/payslip/{payslipNumber}/qr.svg'
*/
const payslipQrForm = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payslipQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::payslipQr
* @see app/Http/Controllers/PublicVerificationController.php:113
* @route '/verify/payslip/{payslipNumber}/qr.svg'
*/
payslipQrForm.get = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payslipQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::payslipQr
* @see app/Http/Controllers/PublicVerificationController.php:113
* @route '/verify/payslip/{payslipNumber}/qr.svg'
*/
payslipQrForm.head = (args: { payslipNumber: string | number } | [payslipNumber: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payslipQr.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

payslipQr.form = payslipQrForm

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyCorrespondence
* @see app/Http/Controllers/PublicVerificationController.php:65
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
* @see app/Http/Controllers/PublicVerificationController.php:65
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
* @see app/Http/Controllers/PublicVerificationController.php:65
* @route '/verify/correspondence/{correspondence}'
*/
verifyCorrespondence.get = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyCorrespondence.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyCorrespondence
* @see app/Http/Controllers/PublicVerificationController.php:65
* @route '/verify/correspondence/{correspondence}'
*/
verifyCorrespondence.head = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verifyCorrespondence.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyCorrespondence
* @see app/Http/Controllers/PublicVerificationController.php:65
* @route '/verify/correspondence/{correspondence}'
*/
const verifyCorrespondenceForm = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyCorrespondence.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyCorrespondence
* @see app/Http/Controllers/PublicVerificationController.php:65
* @route '/verify/correspondence/{correspondence}'
*/
verifyCorrespondenceForm.get = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyCorrespondence.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyCorrespondence
* @see app/Http/Controllers/PublicVerificationController.php:65
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
* @see app/Http/Controllers/PublicVerificationController.php:80
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
* @see app/Http/Controllers/PublicVerificationController.php:80
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
* @see app/Http/Controllers/PublicVerificationController.php:80
* @route '/verify/correspondence/{correspondence}/qr.svg'
*/
correspondenceQr.get = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correspondenceQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondenceQr
* @see app/Http/Controllers/PublicVerificationController.php:80
* @route '/verify/correspondence/{correspondence}/qr.svg'
*/
correspondenceQr.head = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: correspondenceQr.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondenceQr
* @see app/Http/Controllers/PublicVerificationController.php:80
* @route '/verify/correspondence/{correspondence}/qr.svg'
*/
const correspondenceQrForm = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: correspondenceQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondenceQr
* @see app/Http/Controllers/PublicVerificationController.php:80
* @route '/verify/correspondence/{correspondence}/qr.svg'
*/
correspondenceQrForm.get = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: correspondenceQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::correspondenceQr
* @see app/Http/Controllers/PublicVerificationController.php:80
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

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyConflictCertificate
* @see app/Http/Controllers/PublicVerificationController.php:225
* @route '/verify/conflict/{conflictCheck}'
*/
export const verifyConflictCertificate = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyConflictCertificate.url(args, options),
    method: 'get',
})

verifyConflictCertificate.definition = {
    methods: ["get","head"],
    url: '/verify/conflict/{conflictCheck}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyConflictCertificate
* @see app/Http/Controllers/PublicVerificationController.php:225
* @route '/verify/conflict/{conflictCheck}'
*/
verifyConflictCertificate.url = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return verifyConflictCertificate.definition.url
            .replace('{conflictCheck}', parsedArgs.conflictCheck.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyConflictCertificate
* @see app/Http/Controllers/PublicVerificationController.php:225
* @route '/verify/conflict/{conflictCheck}'
*/
verifyConflictCertificate.get = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyConflictCertificate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyConflictCertificate
* @see app/Http/Controllers/PublicVerificationController.php:225
* @route '/verify/conflict/{conflictCheck}'
*/
verifyConflictCertificate.head = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verifyConflictCertificate.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyConflictCertificate
* @see app/Http/Controllers/PublicVerificationController.php:225
* @route '/verify/conflict/{conflictCheck}'
*/
const verifyConflictCertificateForm = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyConflictCertificate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyConflictCertificate
* @see app/Http/Controllers/PublicVerificationController.php:225
* @route '/verify/conflict/{conflictCheck}'
*/
verifyConflictCertificateForm.get = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyConflictCertificate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyConflictCertificate
* @see app/Http/Controllers/PublicVerificationController.php:225
* @route '/verify/conflict/{conflictCheck}'
*/
verifyConflictCertificateForm.head = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyConflictCertificate.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

verifyConflictCertificate.form = verifyConflictCertificateForm

/**
* @see \App\Http\Controllers\PublicVerificationController::conflictCertificateQr
* @see app/Http/Controllers/PublicVerificationController.php:240
* @route '/verify/conflict/{conflictCheck}/qr.svg'
*/
export const conflictCertificateQr = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conflictCertificateQr.url(args, options),
    method: 'get',
})

conflictCertificateQr.definition = {
    methods: ["get","head"],
    url: '/verify/conflict/{conflictCheck}/qr.svg',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::conflictCertificateQr
* @see app/Http/Controllers/PublicVerificationController.php:240
* @route '/verify/conflict/{conflictCheck}/qr.svg'
*/
conflictCertificateQr.url = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return conflictCertificateQr.definition.url
            .replace('{conflictCheck}', parsedArgs.conflictCheck.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::conflictCertificateQr
* @see app/Http/Controllers/PublicVerificationController.php:240
* @route '/verify/conflict/{conflictCheck}/qr.svg'
*/
conflictCertificateQr.get = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conflictCertificateQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::conflictCertificateQr
* @see app/Http/Controllers/PublicVerificationController.php:240
* @route '/verify/conflict/{conflictCheck}/qr.svg'
*/
conflictCertificateQr.head = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: conflictCertificateQr.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::conflictCertificateQr
* @see app/Http/Controllers/PublicVerificationController.php:240
* @route '/verify/conflict/{conflictCheck}/qr.svg'
*/
const conflictCertificateQrForm = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: conflictCertificateQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::conflictCertificateQr
* @see app/Http/Controllers/PublicVerificationController.php:240
* @route '/verify/conflict/{conflictCheck}/qr.svg'
*/
conflictCertificateQrForm.get = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: conflictCertificateQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::conflictCertificateQr
* @see app/Http/Controllers/PublicVerificationController.php:240
* @route '/verify/conflict/{conflictCheck}/qr.svg'
*/
conflictCertificateQrForm.head = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: conflictCertificateQr.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

conflictCertificateQr.form = conflictCertificateQrForm

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyMatterStatus
* @see app/Http/Controllers/PublicVerificationController.php:259
* @route '/verify/matter-status/{matter}'
*/
export const verifyMatterStatus = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyMatterStatus.url(args, options),
    method: 'get',
})

verifyMatterStatus.definition = {
    methods: ["get","head"],
    url: '/verify/matter-status/{matter}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyMatterStatus
* @see app/Http/Controllers/PublicVerificationController.php:259
* @route '/verify/matter-status/{matter}'
*/
verifyMatterStatus.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return verifyMatterStatus.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyMatterStatus
* @see app/Http/Controllers/PublicVerificationController.php:259
* @route '/verify/matter-status/{matter}'
*/
verifyMatterStatus.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyMatterStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyMatterStatus
* @see app/Http/Controllers/PublicVerificationController.php:259
* @route '/verify/matter-status/{matter}'
*/
verifyMatterStatus.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verifyMatterStatus.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyMatterStatus
* @see app/Http/Controllers/PublicVerificationController.php:259
* @route '/verify/matter-status/{matter}'
*/
const verifyMatterStatusForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyMatterStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyMatterStatus
* @see app/Http/Controllers/PublicVerificationController.php:259
* @route '/verify/matter-status/{matter}'
*/
verifyMatterStatusForm.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyMatterStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::verifyMatterStatus
* @see app/Http/Controllers/PublicVerificationController.php:259
* @route '/verify/matter-status/{matter}'
*/
verifyMatterStatusForm.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verifyMatterStatus.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

verifyMatterStatus.form = verifyMatterStatusForm

/**
* @see \App\Http\Controllers\PublicVerificationController::matterStatusQr
* @see app/Http/Controllers/PublicVerificationController.php:276
* @route '/verify/matter-status/{matter}/qr.svg'
*/
export const matterStatusQr = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: matterStatusQr.url(args, options),
    method: 'get',
})

matterStatusQr.definition = {
    methods: ["get","head"],
    url: '/verify/matter-status/{matter}/qr.svg',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicVerificationController::matterStatusQr
* @see app/Http/Controllers/PublicVerificationController.php:276
* @route '/verify/matter-status/{matter}/qr.svg'
*/
matterStatusQr.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return matterStatusQr.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicVerificationController::matterStatusQr
* @see app/Http/Controllers/PublicVerificationController.php:276
* @route '/verify/matter-status/{matter}/qr.svg'
*/
matterStatusQr.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: matterStatusQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::matterStatusQr
* @see app/Http/Controllers/PublicVerificationController.php:276
* @route '/verify/matter-status/{matter}/qr.svg'
*/
matterStatusQr.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: matterStatusQr.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::matterStatusQr
* @see app/Http/Controllers/PublicVerificationController.php:276
* @route '/verify/matter-status/{matter}/qr.svg'
*/
const matterStatusQrForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: matterStatusQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::matterStatusQr
* @see app/Http/Controllers/PublicVerificationController.php:276
* @route '/verify/matter-status/{matter}/qr.svg'
*/
matterStatusQrForm.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: matterStatusQr.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicVerificationController::matterStatusQr
* @see app/Http/Controllers/PublicVerificationController.php:276
* @route '/verify/matter-status/{matter}/qr.svg'
*/
matterStatusQrForm.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: matterStatusQr.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

matterStatusQr.form = matterStatusQrForm

const PublicVerificationController = { verifyInvoice, invoiceQr, verifyQuotation, quotationQr, verifyPaymentReceipt, paymentReceiptQr, verifyPayslip, payslipQr, verifyCorrespondence, correspondenceQr, verifyConflictCertificate, conflictCertificateQr, verifyMatterStatus, matterStatusQr }

export default PublicVerificationController