import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MatterOperationController::storeParty
* @see app/Http/Controllers/MatterOperationController.php:26
* @route '/matters/{matter}/parties'
*/
export const storeParty = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeParty.url(args, options),
    method: 'post',
})

storeParty.definition = {
    methods: ["post"],
    url: '/matters/{matter}/parties',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MatterOperationController::storeParty
* @see app/Http/Controllers/MatterOperationController.php:26
* @route '/matters/{matter}/parties'
*/
storeParty.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return storeParty.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::storeParty
* @see app/Http/Controllers/MatterOperationController.php:26
* @route '/matters/{matter}/parties'
*/
storeParty.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeParty.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::storeParty
* @see app/Http/Controllers/MatterOperationController.php:26
* @route '/matters/{matter}/parties'
*/
const storePartyForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeParty.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::storeParty
* @see app/Http/Controllers/MatterOperationController.php:26
* @route '/matters/{matter}/parties'
*/
storePartyForm.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeParty.url(args, options),
    method: 'post',
})

storeParty.form = storePartyForm

/**
* @see \App\Http\Controllers\MatterOperationController::destroyParty
* @see app/Http/Controllers/MatterOperationController.php:151
* @route '/matters/{matter}/parties/{party}'
*/
export const destroyParty = (args: { matter: string | { id: string }, party: string | { id: string } } | [matter: string | { id: string }, party: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyParty.url(args, options),
    method: 'delete',
})

destroyParty.definition = {
    methods: ["delete"],
    url: '/matters/{matter}/parties/{party}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MatterOperationController::destroyParty
* @see app/Http/Controllers/MatterOperationController.php:151
* @route '/matters/{matter}/parties/{party}'
*/
destroyParty.url = (args: { matter: string | { id: string }, party: string | { id: string } } | [matter: string | { id: string }, party: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            matter: args[0],
            party: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
        party: typeof args.party === 'object'
        ? args.party.id
        : args.party,
    }

    return destroyParty.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{party}', parsedArgs.party.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::destroyParty
* @see app/Http/Controllers/MatterOperationController.php:151
* @route '/matters/{matter}/parties/{party}'
*/
destroyParty.delete = (args: { matter: string | { id: string }, party: string | { id: string } } | [matter: string | { id: string }, party: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyParty.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroyParty
* @see app/Http/Controllers/MatterOperationController.php:151
* @route '/matters/{matter}/parties/{party}'
*/
const destroyPartyForm = (args: { matter: string | { id: string }, party: string | { id: string } } | [matter: string | { id: string }, party: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyParty.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroyParty
* @see app/Http/Controllers/MatterOperationController.php:151
* @route '/matters/{matter}/parties/{party}'
*/
destroyPartyForm.delete = (args: { matter: string | { id: string }, party: string | { id: string } } | [matter: string | { id: string }, party: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyParty.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyParty.form = destroyPartyForm

/**
* @see \App\Http\Controllers\MatterOperationController::storeDeadline
* @see app/Http/Controllers/MatterOperationController.php:36
* @route '/matters/{matter}/deadlines'
*/
export const storeDeadline = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDeadline.url(args, options),
    method: 'post',
})

storeDeadline.definition = {
    methods: ["post"],
    url: '/matters/{matter}/deadlines',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MatterOperationController::storeDeadline
* @see app/Http/Controllers/MatterOperationController.php:36
* @route '/matters/{matter}/deadlines'
*/
storeDeadline.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return storeDeadline.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::storeDeadline
* @see app/Http/Controllers/MatterOperationController.php:36
* @route '/matters/{matter}/deadlines'
*/
storeDeadline.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDeadline.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::storeDeadline
* @see app/Http/Controllers/MatterOperationController.php:36
* @route '/matters/{matter}/deadlines'
*/
const storeDeadlineForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeDeadline.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::storeDeadline
* @see app/Http/Controllers/MatterOperationController.php:36
* @route '/matters/{matter}/deadlines'
*/
storeDeadlineForm.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeDeadline.url(args, options),
    method: 'post',
})

storeDeadline.form = storeDeadlineForm

/**
* @see \App\Http\Controllers\MatterOperationController::destroyDeadline
* @see app/Http/Controllers/MatterOperationController.php:167
* @route '/matters/{matter}/deadlines/{deadline}'
*/
export const destroyDeadline = (args: { matter: string | { id: string }, deadline: string | { id: string } } | [matter: string | { id: string }, deadline: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyDeadline.url(args, options),
    method: 'delete',
})

destroyDeadline.definition = {
    methods: ["delete"],
    url: '/matters/{matter}/deadlines/{deadline}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MatterOperationController::destroyDeadline
* @see app/Http/Controllers/MatterOperationController.php:167
* @route '/matters/{matter}/deadlines/{deadline}'
*/
destroyDeadline.url = (args: { matter: string | { id: string }, deadline: string | { id: string } } | [matter: string | { id: string }, deadline: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            matter: args[0],
            deadline: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
        deadline: typeof args.deadline === 'object'
        ? args.deadline.id
        : args.deadline,
    }

    return destroyDeadline.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{deadline}', parsedArgs.deadline.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::destroyDeadline
* @see app/Http/Controllers/MatterOperationController.php:167
* @route '/matters/{matter}/deadlines/{deadline}'
*/
destroyDeadline.delete = (args: { matter: string | { id: string }, deadline: string | { id: string } } | [matter: string | { id: string }, deadline: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyDeadline.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroyDeadline
* @see app/Http/Controllers/MatterOperationController.php:167
* @route '/matters/{matter}/deadlines/{deadline}'
*/
const destroyDeadlineForm = (args: { matter: string | { id: string }, deadline: string | { id: string } } | [matter: string | { id: string }, deadline: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyDeadline.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroyDeadline
* @see app/Http/Controllers/MatterOperationController.php:167
* @route '/matters/{matter}/deadlines/{deadline}'
*/
destroyDeadlineForm.delete = (args: { matter: string | { id: string }, deadline: string | { id: string } } | [matter: string | { id: string }, deadline: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyDeadline.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyDeadline.form = destroyDeadlineForm

/**
* @see \App\Http\Controllers\MatterOperationController::storeEvent
* @see app/Http/Controllers/MatterOperationController.php:46
* @route '/matters/{matter}/events'
*/
export const storeEvent = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeEvent.url(args, options),
    method: 'post',
})

storeEvent.definition = {
    methods: ["post"],
    url: '/matters/{matter}/events',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MatterOperationController::storeEvent
* @see app/Http/Controllers/MatterOperationController.php:46
* @route '/matters/{matter}/events'
*/
storeEvent.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return storeEvent.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::storeEvent
* @see app/Http/Controllers/MatterOperationController.php:46
* @route '/matters/{matter}/events'
*/
storeEvent.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeEvent.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::storeEvent
* @see app/Http/Controllers/MatterOperationController.php:46
* @route '/matters/{matter}/events'
*/
const storeEventForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeEvent.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::storeEvent
* @see app/Http/Controllers/MatterOperationController.php:46
* @route '/matters/{matter}/events'
*/
storeEventForm.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeEvent.url(args, options),
    method: 'post',
})

storeEvent.form = storeEventForm

/**
* @see \App\Http\Controllers\MatterOperationController::destroyEvent
* @see app/Http/Controllers/MatterOperationController.php:183
* @route '/matters/{matter}/events/{event}'
*/
export const destroyEvent = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyEvent.url(args, options),
    method: 'delete',
})

destroyEvent.definition = {
    methods: ["delete"],
    url: '/matters/{matter}/events/{event}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MatterOperationController::destroyEvent
* @see app/Http/Controllers/MatterOperationController.php:183
* @route '/matters/{matter}/events/{event}'
*/
destroyEvent.url = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            matter: args[0],
            event: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
        event: typeof args.event === 'object'
        ? args.event.id
        : args.event,
    }

    return destroyEvent.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::destroyEvent
* @see app/Http/Controllers/MatterOperationController.php:183
* @route '/matters/{matter}/events/{event}'
*/
destroyEvent.delete = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyEvent.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroyEvent
* @see app/Http/Controllers/MatterOperationController.php:183
* @route '/matters/{matter}/events/{event}'
*/
const destroyEventForm = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyEvent.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroyEvent
* @see app/Http/Controllers/MatterOperationController.php:183
* @route '/matters/{matter}/events/{event}'
*/
destroyEventForm.delete = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyEvent.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyEvent.form = destroyEventForm

/**
* @see \App\Http\Controllers\MatterOperationController::recordOutcome
* @see app/Http/Controllers/MatterOperationController.php:218
* @route '/matters/{matter}/events/{event}/outcome'
*/
export const recordOutcome = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordOutcome.url(args, options),
    method: 'post',
})

recordOutcome.definition = {
    methods: ["post"],
    url: '/matters/{matter}/events/{event}/outcome',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MatterOperationController::recordOutcome
* @see app/Http/Controllers/MatterOperationController.php:218
* @route '/matters/{matter}/events/{event}/outcome'
*/
recordOutcome.url = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            matter: args[0],
            event: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
        event: typeof args.event === 'object'
        ? args.event.id
        : args.event,
    }

    return recordOutcome.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::recordOutcome
* @see app/Http/Controllers/MatterOperationController.php:218
* @route '/matters/{matter}/events/{event}/outcome'
*/
recordOutcome.post = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordOutcome.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::recordOutcome
* @see app/Http/Controllers/MatterOperationController.php:218
* @route '/matters/{matter}/events/{event}/outcome'
*/
const recordOutcomeForm = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: recordOutcome.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::recordOutcome
* @see app/Http/Controllers/MatterOperationController.php:218
* @route '/matters/{matter}/events/{event}/outcome'
*/
recordOutcomeForm.post = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: recordOutcome.url(args, options),
    method: 'post',
})

recordOutcome.form = recordOutcomeForm

/**
* @see \App\Http\Controllers\MatterOperationController::storeNote
* @see app/Http/Controllers/MatterOperationController.php:68
* @route '/matters/{matter}/notes'
*/
export const storeNote = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeNote.url(args, options),
    method: 'post',
})

storeNote.definition = {
    methods: ["post"],
    url: '/matters/{matter}/notes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MatterOperationController::storeNote
* @see app/Http/Controllers/MatterOperationController.php:68
* @route '/matters/{matter}/notes'
*/
storeNote.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return storeNote.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::storeNote
* @see app/Http/Controllers/MatterOperationController.php:68
* @route '/matters/{matter}/notes'
*/
storeNote.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeNote.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::storeNote
* @see app/Http/Controllers/MatterOperationController.php:68
* @route '/matters/{matter}/notes'
*/
const storeNoteForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeNote.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::storeNote
* @see app/Http/Controllers/MatterOperationController.php:68
* @route '/matters/{matter}/notes'
*/
storeNoteForm.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeNote.url(args, options),
    method: 'post',
})

storeNote.form = storeNoteForm

/**
* @see \App\Http\Controllers\MatterOperationController::destroyNote
* @see app/Http/Controllers/MatterOperationController.php:199
* @route '/matters/{matter}/notes/{note}'
*/
export const destroyNote = (args: { matter: string | { id: string }, note: string | { id: string } } | [matter: string | { id: string }, note: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyNote.url(args, options),
    method: 'delete',
})

destroyNote.definition = {
    methods: ["delete"],
    url: '/matters/{matter}/notes/{note}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MatterOperationController::destroyNote
* @see app/Http/Controllers/MatterOperationController.php:199
* @route '/matters/{matter}/notes/{note}'
*/
destroyNote.url = (args: { matter: string | { id: string }, note: string | { id: string } } | [matter: string | { id: string }, note: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            matter: args[0],
            note: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
        note: typeof args.note === 'object'
        ? args.note.id
        : args.note,
    }

    return destroyNote.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{note}', parsedArgs.note.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::destroyNote
* @see app/Http/Controllers/MatterOperationController.php:199
* @route '/matters/{matter}/notes/{note}'
*/
destroyNote.delete = (args: { matter: string | { id: string }, note: string | { id: string } } | [matter: string | { id: string }, note: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyNote.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroyNote
* @see app/Http/Controllers/MatterOperationController.php:199
* @route '/matters/{matter}/notes/{note}'
*/
const destroyNoteForm = (args: { matter: string | { id: string }, note: string | { id: string } } | [matter: string | { id: string }, note: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyNote.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroyNote
* @see app/Http/Controllers/MatterOperationController.php:199
* @route '/matters/{matter}/notes/{note}'
*/
destroyNoteForm.delete = (args: { matter: string | { id: string }, note: string | { id: string } } | [matter: string | { id: string }, note: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyNote.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyNote.form = destroyNoteForm

/**
* @see \App\Http\Controllers\MatterOperationController::storeEvidence
* @see app/Http/Controllers/MatterOperationController.php:78
* @route '/matters/{matter}/evidences'
*/
export const storeEvidence = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeEvidence.url(args, options),
    method: 'post',
})

storeEvidence.definition = {
    methods: ["post"],
    url: '/matters/{matter}/evidences',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MatterOperationController::storeEvidence
* @see app/Http/Controllers/MatterOperationController.php:78
* @route '/matters/{matter}/evidences'
*/
storeEvidence.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return storeEvidence.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::storeEvidence
* @see app/Http/Controllers/MatterOperationController.php:78
* @route '/matters/{matter}/evidences'
*/
storeEvidence.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeEvidence.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::storeEvidence
* @see app/Http/Controllers/MatterOperationController.php:78
* @route '/matters/{matter}/evidences'
*/
const storeEvidenceForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeEvidence.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::storeEvidence
* @see app/Http/Controllers/MatterOperationController.php:78
* @route '/matters/{matter}/evidences'
*/
storeEvidenceForm.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeEvidence.url(args, options),
    method: 'post',
})

storeEvidence.form = storeEvidenceForm

/**
* @see \App\Http\Controllers\MatterOperationController::updateEvidence
* @see app/Http/Controllers/MatterOperationController.php:108
* @route '/matters/{matter}/evidences/{evidence}'
*/
export const updateEvidence = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateEvidence.url(args, options),
    method: 'put',
})

updateEvidence.definition = {
    methods: ["put"],
    url: '/matters/{matter}/evidences/{evidence}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\MatterOperationController::updateEvidence
* @see app/Http/Controllers/MatterOperationController.php:108
* @route '/matters/{matter}/evidences/{evidence}'
*/
updateEvidence.url = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            matter: args[0],
            evidence: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
        evidence: typeof args.evidence === 'object'
        ? args.evidence.id
        : args.evidence,
    }

    return updateEvidence.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{evidence}', parsedArgs.evidence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::updateEvidence
* @see app/Http/Controllers/MatterOperationController.php:108
* @route '/matters/{matter}/evidences/{evidence}'
*/
updateEvidence.put = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateEvidence.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MatterOperationController::updateEvidence
* @see app/Http/Controllers/MatterOperationController.php:108
* @route '/matters/{matter}/evidences/{evidence}'
*/
const updateEvidenceForm = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateEvidence.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::updateEvidence
* @see app/Http/Controllers/MatterOperationController.php:108
* @route '/matters/{matter}/evidences/{evidence}'
*/
updateEvidenceForm.put = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateEvidence.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateEvidence.form = updateEvidenceForm

/**
* @see \App\Http\Controllers\MatterOperationController::destroyEvidence
* @see app/Http/Controllers/MatterOperationController.php:135
* @route '/matters/{matter}/evidences/{evidence}'
*/
export const destroyEvidence = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyEvidence.url(args, options),
    method: 'delete',
})

destroyEvidence.definition = {
    methods: ["delete"],
    url: '/matters/{matter}/evidences/{evidence}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MatterOperationController::destroyEvidence
* @see app/Http/Controllers/MatterOperationController.php:135
* @route '/matters/{matter}/evidences/{evidence}'
*/
destroyEvidence.url = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            matter: args[0],
            evidence: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        matter: typeof args.matter === 'object'
        ? args.matter.id
        : args.matter,
        evidence: typeof args.evidence === 'object'
        ? args.evidence.id
        : args.evidence,
    }

    return destroyEvidence.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{evidence}', parsedArgs.evidence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterOperationController::destroyEvidence
* @see app/Http/Controllers/MatterOperationController.php:135
* @route '/matters/{matter}/evidences/{evidence}'
*/
destroyEvidence.delete = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyEvidence.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroyEvidence
* @see app/Http/Controllers/MatterOperationController.php:135
* @route '/matters/{matter}/evidences/{evidence}'
*/
const destroyEvidenceForm = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyEvidence.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MatterOperationController::destroyEvidence
* @see app/Http/Controllers/MatterOperationController.php:135
* @route '/matters/{matter}/evidences/{evidence}'
*/
destroyEvidenceForm.delete = (args: { matter: string | { id: string }, evidence: string | { id: string } } | [matter: string | { id: string }, evidence: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyEvidence.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyEvidence.form = destroyEvidenceForm

const MatterOperationController = { storeParty, destroyParty, storeDeadline, destroyDeadline, storeEvent, destroyEvent, recordOutcome, storeNote, destroyNote, storeEvidence, updateEvidence, destroyEvidence }

export default MatterOperationController