import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
* @see app/Http/Controllers/Settings/SecurityController.php:22
* @route '/settings/security'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/security',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
* @see app/Http/Controllers/Settings/SecurityController.php:22
* @route '/settings/security'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
* @see app/Http/Controllers/Settings/SecurityController.php:22
* @route '/settings/security'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
* @see app/Http/Controllers/Settings/SecurityController.php:22
* @route '/settings/security'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
* @see app/Http/Controllers/Settings/SecurityController.php:22
* @route '/settings/security'
*/
const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
* @see app/Http/Controllers/Settings/SecurityController.php:22
* @route '/settings/security'
*/
editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
* @see app/Http/Controllers/Settings/SecurityController.php:22
* @route '/settings/security'
*/
editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Settings\SecurityController::verifyCurrentPassword
* @see app/Http/Controllers/Settings/SecurityController.php:83
* @route '/settings/security/verify-current-password'
*/
export const verifyCurrentPassword = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyCurrentPassword.url(options),
    method: 'post',
})

verifyCurrentPassword.definition = {
    methods: ["post"],
    url: '/settings/security/verify-current-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\SecurityController::verifyCurrentPassword
* @see app/Http/Controllers/Settings/SecurityController.php:83
* @route '/settings/security/verify-current-password'
*/
verifyCurrentPassword.url = (options?: RouteQueryOptions) => {
    return verifyCurrentPassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SecurityController::verifyCurrentPassword
* @see app/Http/Controllers/Settings/SecurityController.php:83
* @route '/settings/security/verify-current-password'
*/
verifyCurrentPassword.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyCurrentPassword.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\SecurityController::verifyCurrentPassword
* @see app/Http/Controllers/Settings/SecurityController.php:83
* @route '/settings/security/verify-current-password'
*/
const verifyCurrentPasswordForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verifyCurrentPassword.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\SecurityController::verifyCurrentPassword
* @see app/Http/Controllers/Settings/SecurityController.php:83
* @route '/settings/security/verify-current-password'
*/
verifyCurrentPasswordForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verifyCurrentPassword.url(options),
    method: 'post',
})

verifyCurrentPassword.form = verifyCurrentPasswordForm

const security = {
    edit: Object.assign(edit, edit),
    verifyCurrentPassword: Object.assign(verifyCurrentPassword, verifyCurrentPassword),
}

export default security