import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import reminders from './reminders'
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

const signatureRequests = {
    reminders: Object.assign(reminders, reminders),
    signedRecord: Object.assign(signedRecord, signedRecord),
    signedFinal: Object.assign(signedFinal, signedFinal),
    certificate: Object.assign(certificate, certificate),
}

export default signatureRequests