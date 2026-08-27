import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import checklists from './checklists'
/**
* @see \App\Http\Controllers\TaskController::index
* @see app/Http/Controllers/TaskController.php:29
* @route '/tasks'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TaskController::index
* @see app/Http/Controllers/TaskController.php:29
* @route '/tasks'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::index
* @see app/Http/Controllers/TaskController.php:29
* @route '/tasks'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TaskController::index
* @see app/Http/Controllers/TaskController.php:29
* @route '/tasks'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TaskController::create
* @see app/Http/Controllers/TaskController.php:81
* @route '/tasks/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/tasks/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TaskController::create
* @see app/Http/Controllers/TaskController.php:81
* @route '/tasks/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::create
* @see app/Http/Controllers/TaskController.php:81
* @route '/tasks/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TaskController::create
* @see app/Http/Controllers/TaskController.php:81
* @route '/tasks/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TaskController::store
* @see app/Http/Controllers/TaskController.php:117
* @route '/tasks'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TaskController::store
* @see app/Http/Controllers/TaskController.php:117
* @route '/tasks'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::store
* @see app/Http/Controllers/TaskController.php:117
* @route '/tasks'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TaskController::show
* @see app/Http/Controllers/TaskController.php:156
* @route '/tasks/{task}'
*/
export const show = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tasks/{task}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TaskController::show
* @see app/Http/Controllers/TaskController.php:156
* @route '/tasks/{task}'
*/
show.url = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { task: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            task: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return show.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::show
* @see app/Http/Controllers/TaskController.php:156
* @route '/tasks/{task}'
*/
show.get = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TaskController::show
* @see app/Http/Controllers/TaskController.php:156
* @route '/tasks/{task}'
*/
show.head = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TaskController::edit
* @see app/Http/Controllers/TaskController.php:217
* @route '/tasks/{task}/edit'
*/
export const edit = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/tasks/{task}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TaskController::edit
* @see app/Http/Controllers/TaskController.php:217
* @route '/tasks/{task}/edit'
*/
edit.url = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { task: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            task: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return edit.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::edit
* @see app/Http/Controllers/TaskController.php:217
* @route '/tasks/{task}/edit'
*/
edit.get = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TaskController::edit
* @see app/Http/Controllers/TaskController.php:217
* @route '/tasks/{task}/edit'
*/
edit.head = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TaskController::update
* @see app/Http/Controllers/TaskController.php:248
* @route '/tasks/{task}'
*/
export const update = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/tasks/{task}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TaskController::update
* @see app/Http/Controllers/TaskController.php:248
* @route '/tasks/{task}'
*/
update.url = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { task: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            task: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return update.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::update
* @see app/Http/Controllers/TaskController.php:248
* @route '/tasks/{task}'
*/
update.put = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\TaskController::update
* @see app/Http/Controllers/TaskController.php:248
* @route '/tasks/{task}'
*/
update.patch = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\TaskController::destroy
* @see app/Http/Controllers/TaskController.php:330
* @route '/tasks/{task}'
*/
export const destroy = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/tasks/{task}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TaskController::destroy
* @see app/Http/Controllers/TaskController.php:330
* @route '/tasks/{task}'
*/
destroy.url = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { task: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            task: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return destroy.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::destroy
* @see app/Http/Controllers/TaskController.php:330
* @route '/tasks/{task}'
*/
destroy.delete = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\TaskController::submitReview
* @see app/Http/Controllers/TaskController.php:345
* @route '/tasks/{task}/submit-review'
*/
export const submitReview = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitReview.url(args, options),
    method: 'post',
})

submitReview.definition = {
    methods: ["post"],
    url: '/tasks/{task}/submit-review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TaskController::submitReview
* @see app/Http/Controllers/TaskController.php:345
* @route '/tasks/{task}/submit-review'
*/
submitReview.url = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { task: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            task: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return submitReview.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::submitReview
* @see app/Http/Controllers/TaskController.php:345
* @route '/tasks/{task}/submit-review'
*/
submitReview.post = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitReview.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TaskController::approve
* @see app/Http/Controllers/TaskController.php:386
* @route '/tasks/{task}/approve'
*/
export const approve = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/tasks/{task}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TaskController::approve
* @see app/Http/Controllers/TaskController.php:386
* @route '/tasks/{task}/approve'
*/
approve.url = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { task: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            task: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return approve.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::approve
* @see app/Http/Controllers/TaskController.php:386
* @route '/tasks/{task}/approve'
*/
approve.post = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TaskController::requestRevision
* @see app/Http/Controllers/TaskController.php:433
* @route '/tasks/{task}/request-revision'
*/
export const requestRevision = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestRevision.url(args, options),
    method: 'post',
})

requestRevision.definition = {
    methods: ["post"],
    url: '/tasks/{task}/request-revision',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TaskController::requestRevision
* @see app/Http/Controllers/TaskController.php:433
* @route '/tasks/{task}/request-revision'
*/
requestRevision.url = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { task: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            task: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return requestRevision.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskController::requestRevision
* @see app/Http/Controllers/TaskController.php:433
* @route '/tasks/{task}/request-revision'
*/
requestRevision.post = (args: { task: string | { id: string } } | [task: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestRevision.url(args, options),
    method: 'post',
})

const tasks = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    checklists: Object.assign(checklists, checklists),
    submitReview: Object.assign(submitReview, submitReview),
    approve: Object.assign(approve, approve),
    requestRevision: Object.assign(requestRevision, requestRevision),
}

export default tasks