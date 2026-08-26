import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:35
* @route '/governance'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/governance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:35
* @route '/governance'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:35
* @route '/governance'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:35
* @route '/governance'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:35
* @route '/governance'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:35
* @route '/governance'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:35
* @route '/governance'
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
* @see \App\Http\Controllers\GovernanceController::storeCorrespondence
* @see app/Http/Controllers/GovernanceController.php:88
* @route '/governance/correspondences'
*/
export const storeCorrespondence = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCorrespondence.url(options),
    method: 'post',
})

storeCorrespondence.definition = {
    methods: ["post"],
    url: '/governance/correspondences',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GovernanceController::storeCorrespondence
* @see app/Http/Controllers/GovernanceController.php:88
* @route '/governance/correspondences'
*/
storeCorrespondence.url = (options?: RouteQueryOptions) => {
    return storeCorrespondence.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::storeCorrespondence
* @see app/Http/Controllers/GovernanceController.php:88
* @route '/governance/correspondences'
*/
storeCorrespondence.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCorrespondence.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::storeCorrespondence
* @see app/Http/Controllers/GovernanceController.php:88
* @route '/governance/correspondences'
*/
const storeCorrespondenceForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeCorrespondence.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::storeCorrespondence
* @see app/Http/Controllers/GovernanceController.php:88
* @route '/governance/correspondences'
*/
storeCorrespondenceForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeCorrespondence.url(options),
    method: 'post',
})

storeCorrespondence.form = storeCorrespondenceForm

/**
* @see \App\Http\Controllers\GovernanceController::showCorrespondence
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/correspondences/{correspondence}'
*/
export const showCorrespondence = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showCorrespondence.url(args, options),
    method: 'get',
})

showCorrespondence.definition = {
    methods: ["get","head"],
    url: '/governance/correspondences/{correspondence}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GovernanceController::showCorrespondence
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/correspondences/{correspondence}'
*/
showCorrespondence.url = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return showCorrespondence.definition.url
            .replace('{correspondence}', parsedArgs.correspondence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::showCorrespondence
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/correspondences/{correspondence}'
*/
showCorrespondence.get = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showCorrespondence.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::showCorrespondence
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/correspondences/{correspondence}'
*/
showCorrespondence.head = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showCorrespondence.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GovernanceController::showCorrespondence
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/correspondences/{correspondence}'
*/
const showCorrespondenceForm = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showCorrespondence.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::showCorrespondence
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/correspondences/{correspondence}'
*/
showCorrespondenceForm.get = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showCorrespondence.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::showCorrespondence
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/correspondences/{correspondence}'
*/
showCorrespondenceForm.head = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showCorrespondence.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showCorrespondence.form = showCorrespondenceForm

/**
* @see \App\Http\Controllers\GovernanceController::destroyCorrespondence
* @see app/Http/Controllers/GovernanceController.php:135
* @route '/governance/correspondences/{correspondence}'
*/
export const destroyCorrespondence = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyCorrespondence.url(args, options),
    method: 'delete',
})

destroyCorrespondence.definition = {
    methods: ["delete"],
    url: '/governance/correspondences/{correspondence}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GovernanceController::destroyCorrespondence
* @see app/Http/Controllers/GovernanceController.php:135
* @route '/governance/correspondences/{correspondence}'
*/
destroyCorrespondence.url = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return destroyCorrespondence.definition.url
            .replace('{correspondence}', parsedArgs.correspondence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::destroyCorrespondence
* @see app/Http/Controllers/GovernanceController.php:135
* @route '/governance/correspondences/{correspondence}'
*/
destroyCorrespondence.delete = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyCorrespondence.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\GovernanceController::destroyCorrespondence
* @see app/Http/Controllers/GovernanceController.php:135
* @route '/governance/correspondences/{correspondence}'
*/
const destroyCorrespondenceForm = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyCorrespondence.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::destroyCorrespondence
* @see app/Http/Controllers/GovernanceController.php:135
* @route '/governance/correspondences/{correspondence}'
*/
destroyCorrespondenceForm.delete = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyCorrespondence.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyCorrespondence.form = destroyCorrespondenceForm

/**
* @see \App\Http\Controllers\GovernanceController::storeCorrespondenceAttachment
* @see app/Http/Controllers/GovernanceController.php:115
* @route '/governance/correspondences/{correspondence}/attachments'
*/
export const storeCorrespondenceAttachment = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCorrespondenceAttachment.url(args, options),
    method: 'post',
})

storeCorrespondenceAttachment.definition = {
    methods: ["post"],
    url: '/governance/correspondences/{correspondence}/attachments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GovernanceController::storeCorrespondenceAttachment
* @see app/Http/Controllers/GovernanceController.php:115
* @route '/governance/correspondences/{correspondence}/attachments'
*/
storeCorrespondenceAttachment.url = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return storeCorrespondenceAttachment.definition.url
            .replace('{correspondence}', parsedArgs.correspondence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::storeCorrespondenceAttachment
* @see app/Http/Controllers/GovernanceController.php:115
* @route '/governance/correspondences/{correspondence}/attachments'
*/
storeCorrespondenceAttachment.post = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCorrespondenceAttachment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::storeCorrespondenceAttachment
* @see app/Http/Controllers/GovernanceController.php:115
* @route '/governance/correspondences/{correspondence}/attachments'
*/
const storeCorrespondenceAttachmentForm = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeCorrespondenceAttachment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::storeCorrespondenceAttachment
* @see app/Http/Controllers/GovernanceController.php:115
* @route '/governance/correspondences/{correspondence}/attachments'
*/
storeCorrespondenceAttachmentForm.post = (args: { correspondence: string | { id: string } } | [correspondence: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeCorrespondenceAttachment.url(args, options),
    method: 'post',
})

storeCorrespondenceAttachment.form = storeCorrespondenceAttachmentForm

/**
* @see \App\Http\Controllers\GovernanceController::storeConflictCheck
* @see app/Http/Controllers/GovernanceController.php:152
* @route '/governance/conflict-checks'
*/
export const storeConflictCheck = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConflictCheck.url(options),
    method: 'post',
})

storeConflictCheck.definition = {
    methods: ["post"],
    url: '/governance/conflict-checks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GovernanceController::storeConflictCheck
* @see app/Http/Controllers/GovernanceController.php:152
* @route '/governance/conflict-checks'
*/
storeConflictCheck.url = (options?: RouteQueryOptions) => {
    return storeConflictCheck.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::storeConflictCheck
* @see app/Http/Controllers/GovernanceController.php:152
* @route '/governance/conflict-checks'
*/
storeConflictCheck.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConflictCheck.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::storeConflictCheck
* @see app/Http/Controllers/GovernanceController.php:152
* @route '/governance/conflict-checks'
*/
const storeConflictCheckForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeConflictCheck.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::storeConflictCheck
* @see app/Http/Controllers/GovernanceController.php:152
* @route '/governance/conflict-checks'
*/
storeConflictCheckForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeConflictCheck.url(options),
    method: 'post',
})

storeConflictCheck.form = storeConflictCheckForm

/**
* @see \App\Http\Controllers\GovernanceController::resolveConflictCheck
* @see app/Http/Controllers/GovernanceController.php:168
* @route '/governance/conflict-checks/{conflictCheck}'
*/
export const resolveConflictCheck = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resolveConflictCheck.url(args, options),
    method: 'patch',
})

resolveConflictCheck.definition = {
    methods: ["patch"],
    url: '/governance/conflict-checks/{conflictCheck}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\GovernanceController::resolveConflictCheck
* @see app/Http/Controllers/GovernanceController.php:168
* @route '/governance/conflict-checks/{conflictCheck}'
*/
resolveConflictCheck.url = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return resolveConflictCheck.definition.url
            .replace('{conflictCheck}', parsedArgs.conflictCheck.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::resolveConflictCheck
* @see app/Http/Controllers/GovernanceController.php:168
* @route '/governance/conflict-checks/{conflictCheck}'
*/
resolveConflictCheck.patch = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resolveConflictCheck.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\GovernanceController::resolveConflictCheck
* @see app/Http/Controllers/GovernanceController.php:168
* @route '/governance/conflict-checks/{conflictCheck}'
*/
const resolveConflictCheckForm = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolveConflictCheck.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::resolveConflictCheck
* @see app/Http/Controllers/GovernanceController.php:168
* @route '/governance/conflict-checks/{conflictCheck}'
*/
resolveConflictCheckForm.patch = (args: { conflictCheck: string | { id: string } } | [conflictCheck: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolveConflictCheck.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

resolveConflictCheck.form = resolveConflictCheckForm

/**
* @see \App\Http\Controllers\GovernanceController::placeLegalHold
* @see app/Http/Controllers/GovernanceController.php:178
* @route '/governance/matters/{matter}/legal-hold'
*/
export const placeLegalHold = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: placeLegalHold.url(args, options),
    method: 'post',
})

placeLegalHold.definition = {
    methods: ["post"],
    url: '/governance/matters/{matter}/legal-hold',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GovernanceController::placeLegalHold
* @see app/Http/Controllers/GovernanceController.php:178
* @route '/governance/matters/{matter}/legal-hold'
*/
placeLegalHold.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return placeLegalHold.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::placeLegalHold
* @see app/Http/Controllers/GovernanceController.php:178
* @route '/governance/matters/{matter}/legal-hold'
*/
placeLegalHold.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: placeLegalHold.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::placeLegalHold
* @see app/Http/Controllers/GovernanceController.php:178
* @route '/governance/matters/{matter}/legal-hold'
*/
const placeLegalHoldForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: placeLegalHold.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::placeLegalHold
* @see app/Http/Controllers/GovernanceController.php:178
* @route '/governance/matters/{matter}/legal-hold'
*/
placeLegalHoldForm.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: placeLegalHold.url(args, options),
    method: 'post',
})

placeLegalHold.form = placeLegalHoldForm

/**
* @see \App\Http\Controllers\GovernanceController::releaseLegalHold
* @see app/Http/Controllers/GovernanceController.php:187
* @route '/governance/matters/{matter}/legal-hold'
*/
export const releaseLegalHold = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: releaseLegalHold.url(args, options),
    method: 'delete',
})

releaseLegalHold.definition = {
    methods: ["delete"],
    url: '/governance/matters/{matter}/legal-hold',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GovernanceController::releaseLegalHold
* @see app/Http/Controllers/GovernanceController.php:187
* @route '/governance/matters/{matter}/legal-hold'
*/
releaseLegalHold.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return releaseLegalHold.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::releaseLegalHold
* @see app/Http/Controllers/GovernanceController.php:187
* @route '/governance/matters/{matter}/legal-hold'
*/
releaseLegalHold.delete = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: releaseLegalHold.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\GovernanceController::releaseLegalHold
* @see app/Http/Controllers/GovernanceController.php:187
* @route '/governance/matters/{matter}/legal-hold'
*/
const releaseLegalHoldForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: releaseLegalHold.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::releaseLegalHold
* @see app/Http/Controllers/GovernanceController.php:187
* @route '/governance/matters/{matter}/legal-hold'
*/
releaseLegalHoldForm.delete = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: releaseLegalHold.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

releaseLegalHold.form = releaseLegalHoldForm

/**
* @see \App\Http\Controllers\GovernanceController::archive
* @see app/Http/Controllers/GovernanceController.php:196
* @route '/governance/matters/{matter}/archive'
*/
export const archive = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: archive.url(args, options),
    method: 'post',
})

archive.definition = {
    methods: ["post"],
    url: '/governance/matters/{matter}/archive',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GovernanceController::archive
* @see app/Http/Controllers/GovernanceController.php:196
* @route '/governance/matters/{matter}/archive'
*/
archive.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return archive.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::archive
* @see app/Http/Controllers/GovernanceController.php:196
* @route '/governance/matters/{matter}/archive'
*/
archive.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: archive.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::archive
* @see app/Http/Controllers/GovernanceController.php:196
* @route '/governance/matters/{matter}/archive'
*/
const archiveForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: archive.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::archive
* @see app/Http/Controllers/GovernanceController.php:196
* @route '/governance/matters/{matter}/archive'
*/
archiveForm.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: archive.url(args, options),
    method: 'post',
})

archive.form = archiveForm

/**
* @see \App\Http\Controllers\GovernanceController::requestExport
* @see app/Http/Controllers/GovernanceController.php:204
* @route '/governance/matters/{matter}/exports'
*/
export const requestExport = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestExport.url(args, options),
    method: 'post',
})

requestExport.definition = {
    methods: ["post"],
    url: '/governance/matters/{matter}/exports',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GovernanceController::requestExport
* @see app/Http/Controllers/GovernanceController.php:204
* @route '/governance/matters/{matter}/exports'
*/
requestExport.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return requestExport.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::requestExport
* @see app/Http/Controllers/GovernanceController.php:204
* @route '/governance/matters/{matter}/exports'
*/
requestExport.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestExport.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::requestExport
* @see app/Http/Controllers/GovernanceController.php:204
* @route '/governance/matters/{matter}/exports'
*/
const requestExportForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: requestExport.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::requestExport
* @see app/Http/Controllers/GovernanceController.php:204
* @route '/governance/matters/{matter}/exports'
*/
requestExportForm.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: requestExport.url(args, options),
    method: 'post',
})

requestExport.form = requestExportForm

/**
* @see \App\Http\Controllers\GovernanceController::downloadExport
* @see app/Http/Controllers/GovernanceController.php:213
* @route '/governance/exports/{matterExport}/download'
*/
export const downloadExport = (args: { matterExport: string | { id: string } } | [matterExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadExport.url(args, options),
    method: 'get',
})

downloadExport.definition = {
    methods: ["get","head"],
    url: '/governance/exports/{matterExport}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GovernanceController::downloadExport
* @see app/Http/Controllers/GovernanceController.php:213
* @route '/governance/exports/{matterExport}/download'
*/
downloadExport.url = (args: { matterExport: string | { id: string } } | [matterExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { matterExport: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { matterExport: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            matterExport: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matterExport: typeof args.matterExport === 'object'
        ? args.matterExport.id
        : args.matterExport,
    }

    return downloadExport.definition.url
            .replace('{matterExport}', parsedArgs.matterExport.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::downloadExport
* @see app/Http/Controllers/GovernanceController.php:213
* @route '/governance/exports/{matterExport}/download'
*/
downloadExport.get = (args: { matterExport: string | { id: string } } | [matterExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadExport.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::downloadExport
* @see app/Http/Controllers/GovernanceController.php:213
* @route '/governance/exports/{matterExport}/download'
*/
downloadExport.head = (args: { matterExport: string | { id: string } } | [matterExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadExport.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GovernanceController::downloadExport
* @see app/Http/Controllers/GovernanceController.php:213
* @route '/governance/exports/{matterExport}/download'
*/
const downloadExportForm = (args: { matterExport: string | { id: string } } | [matterExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadExport.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::downloadExport
* @see app/Http/Controllers/GovernanceController.php:213
* @route '/governance/exports/{matterExport}/download'
*/
downloadExportForm.get = (args: { matterExport: string | { id: string } } | [matterExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadExport.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::downloadExport
* @see app/Http/Controllers/GovernanceController.php:213
* @route '/governance/exports/{matterExport}/download'
*/
downloadExportForm.head = (args: { matterExport: string | { id: string } } | [matterExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadExport.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadExport.form = downloadExportForm

const GovernanceController = { index, storeCorrespondence, showCorrespondence, destroyCorrespondence, storeCorrespondenceAttachment, storeConflictCheck, resolveConflictCheck, placeLegalHold, releaseLegalHold, archive, requestExport, downloadExport }

export default GovernanceController