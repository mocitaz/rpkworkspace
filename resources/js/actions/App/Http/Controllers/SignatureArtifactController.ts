import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SignatureArtifactController::signedRecord
* @see app/Http/Controllers/SignatureArtifactController.php:16
* @route '/signature-requests/{signatureRequest}/signed-record'
*/
export const signedRecord = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: signedRecord.url(args, options),
    method: 'get',
})

signedRecord.definition = {
    methods: ["get","head"],
    url: '/signature-requests/{signatureRequest}/signed-record',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SignatureArtifactController::signedRecord
* @see app/Http/Controllers/SignatureArtifactController.php:16
* @route '/signature-requests/{signatureRequest}/signed-record'
*/
signedRecord.url = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { signatureRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { signatureRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            signatureRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        signatureRequest: typeof args.signatureRequest === 'object'
        ? args.signatureRequest.id
        : args.signatureRequest,
    }

    return signedRecord.definition.url
            .replace('{signatureRequest}', parsedArgs.signatureRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SignatureArtifactController::signedRecord
* @see app/Http/Controllers/SignatureArtifactController.php:16
* @route '/signature-requests/{signatureRequest}/signed-record'
*/
signedRecord.get = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: signedRecord.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SignatureArtifactController::signedRecord
* @see app/Http/Controllers/SignatureArtifactController.php:16
* @route '/signature-requests/{signatureRequest}/signed-record'
*/
signedRecord.head = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: signedRecord.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SignatureArtifactController::signedRecord
* @see app/Http/Controllers/SignatureArtifactController.php:16
* @route '/signature-requests/{signatureRequest}/signed-record'
*/
const signedRecordForm = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: signedRecord.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SignatureArtifactController::signedRecord
* @see app/Http/Controllers/SignatureArtifactController.php:16
* @route '/signature-requests/{signatureRequest}/signed-record'
*/
signedRecordForm.get = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: signedRecord.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SignatureArtifactController::signedRecord
* @see app/Http/Controllers/SignatureArtifactController.php:16
* @route '/signature-requests/{signatureRequest}/signed-record'
*/
signedRecordForm.head = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: signedRecord.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

signedRecord.form = signedRecordForm

/**
* @see \App\Http\Controllers\SignatureArtifactController::signedFinal
* @see app/Http/Controllers/SignatureArtifactController.php:26
* @route '/signature-requests/{signatureRequest}/signed-final'
*/
export const signedFinal = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: signedFinal.url(args, options),
    method: 'get',
})

signedFinal.definition = {
    methods: ["get","head"],
    url: '/signature-requests/{signatureRequest}/signed-final',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SignatureArtifactController::signedFinal
* @see app/Http/Controllers/SignatureArtifactController.php:26
* @route '/signature-requests/{signatureRequest}/signed-final'
*/
signedFinal.url = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { signatureRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { signatureRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            signatureRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        signatureRequest: typeof args.signatureRequest === 'object'
        ? args.signatureRequest.id
        : args.signatureRequest,
    }

    return signedFinal.definition.url
            .replace('{signatureRequest}', parsedArgs.signatureRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SignatureArtifactController::signedFinal
* @see app/Http/Controllers/SignatureArtifactController.php:26
* @route '/signature-requests/{signatureRequest}/signed-final'
*/
signedFinal.get = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: signedFinal.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SignatureArtifactController::signedFinal
* @see app/Http/Controllers/SignatureArtifactController.php:26
* @route '/signature-requests/{signatureRequest}/signed-final'
*/
signedFinal.head = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: signedFinal.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SignatureArtifactController::signedFinal
* @see app/Http/Controllers/SignatureArtifactController.php:26
* @route '/signature-requests/{signatureRequest}/signed-final'
*/
const signedFinalForm = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: signedFinal.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SignatureArtifactController::signedFinal
* @see app/Http/Controllers/SignatureArtifactController.php:26
* @route '/signature-requests/{signatureRequest}/signed-final'
*/
signedFinalForm.get = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: signedFinal.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SignatureArtifactController::signedFinal
* @see app/Http/Controllers/SignatureArtifactController.php:26
* @route '/signature-requests/{signatureRequest}/signed-final'
*/
signedFinalForm.head = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: signedFinal.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

signedFinal.form = signedFinalForm

/**
* @see \App\Http\Controllers\SignatureArtifactController::certificate
* @see app/Http/Controllers/SignatureArtifactController.php:21
* @route '/signature-requests/{signatureRequest}/certificate'
*/
export const certificate = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: certificate.url(args, options),
    method: 'get',
})

certificate.definition = {
    methods: ["get","head"],
    url: '/signature-requests/{signatureRequest}/certificate',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SignatureArtifactController::certificate
* @see app/Http/Controllers/SignatureArtifactController.php:21
* @route '/signature-requests/{signatureRequest}/certificate'
*/
certificate.url = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { signatureRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { signatureRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            signatureRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        signatureRequest: typeof args.signatureRequest === 'object'
        ? args.signatureRequest.id
        : args.signatureRequest,
    }

    return certificate.definition.url
            .replace('{signatureRequest}', parsedArgs.signatureRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SignatureArtifactController::certificate
* @see app/Http/Controllers/SignatureArtifactController.php:21
* @route '/signature-requests/{signatureRequest}/certificate'
*/
certificate.get = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: certificate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SignatureArtifactController::certificate
* @see app/Http/Controllers/SignatureArtifactController.php:21
* @route '/signature-requests/{signatureRequest}/certificate'
*/
certificate.head = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: certificate.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SignatureArtifactController::certificate
* @see app/Http/Controllers/SignatureArtifactController.php:21
* @route '/signature-requests/{signatureRequest}/certificate'
*/
const certificateForm = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: certificate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SignatureArtifactController::certificate
* @see app/Http/Controllers/SignatureArtifactController.php:21
* @route '/signature-requests/{signatureRequest}/certificate'
*/
certificateForm.get = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: certificate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SignatureArtifactController::certificate
* @see app/Http/Controllers/SignatureArtifactController.php:21
* @route '/signature-requests/{signatureRequest}/certificate'
*/
certificateForm.head = (args: { signatureRequest: string | { id: string } } | [signatureRequest: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: certificate.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

certificate.form = certificateForm

const SignatureArtifactController = { signedRecord, signedFinal, certificate }

export default SignatureArtifactController