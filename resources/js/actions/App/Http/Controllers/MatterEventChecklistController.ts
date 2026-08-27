import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MatterEventChecklistController::update
* @see app/Http/Controllers/MatterEventChecklistController.php:13
* @route '/matters/{matter}/events/{event}/checklist'
*/
export const update = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/matters/{matter}/events/{event}/checklist',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\MatterEventChecklistController::update
* @see app/Http/Controllers/MatterEventChecklistController.php:13
* @route '/matters/{matter}/events/{event}/checklist'
*/
update.url = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace('{event}', parsedArgs.event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterEventChecklistController::update
* @see app/Http/Controllers/MatterEventChecklistController.php:13
* @route '/matters/{matter}/events/{event}/checklist'
*/
update.put = (args: { matter: string | { id: string }, event: string | { id: string } } | [matter: string | { id: string }, event: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

const MatterEventChecklistController = { update }

export default MatterEventChecklistController