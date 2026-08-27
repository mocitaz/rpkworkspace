import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\TaskController::toggle
* @see app/Http/Controllers/TaskController.php:298
* @route '/tasks/{task}/checklists/{checklistId}/toggle'
*/
export const toggle = (args: { task: string | { id: string }, checklistId: string | number } | [task: string | { id: string }, checklistId: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

toggle.definition = {
    methods: ["patch"],
    url: '/tasks/{task}/checklists/{checklistId}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\TaskController::toggle
* @see app/Http/Controllers/TaskController.php:298
* @route '/tasks/{task}/checklists/{checklistId}/toggle'
*/
toggle.url = (args: { task: string | { id: string }, checklistId: string | number } | [task: string | { id: string }, checklistId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            task: args[0],
            checklistId: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
        checklistId: args.checklistId,
    }

    return toggle.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace('{checklistId}', parsedArgs.checklistId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::toggle
* @see app/Http/Controllers/TaskController.php:298
* @route '/tasks/{task}/checklists/{checklistId}/toggle'
*/
toggle.patch = (args: { task: string | { id: string }, checklistId: string | number } | [task: string | { id: string }, checklistId: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

const checklists = {
    toggle: Object.assign(toggle, toggle),
}

export default checklists