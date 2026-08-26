import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import legalHold from './legal-hold'
import exports from './exports'
/**
* @see \App\Http\Controllers\GovernanceController::archive
* @see app/Http/Controllers/GovernanceController.php:245
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
* @see app/Http/Controllers/GovernanceController.php:245
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
* @see app/Http/Controllers/GovernanceController.php:245
* @route '/governance/matters/{matter}/archive'
*/
archive.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: archive.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::archive
* @see app/Http/Controllers/GovernanceController.php:245
* @route '/governance/matters/{matter}/archive'
*/
const archiveForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: archive.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::archive
* @see app/Http/Controllers/GovernanceController.php:245
* @route '/governance/matters/{matter}/archive'
*/
archiveForm.post = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: archive.url(args, options),
    method: 'post',
})

archive.form = archiveForm

const matters = {
    legalHold: Object.assign(legalHold, legalHold),
    archive: Object.assign(archive, archive),
    exports: Object.assign(exports, exports),
}

export default matters