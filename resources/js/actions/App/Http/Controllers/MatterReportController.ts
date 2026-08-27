import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MatterReportController::statusReport
* @see app/Http/Controllers/MatterReportController.php:14
* @route '/matters/{matter}/status-report/pdf'
*/
export const statusReport = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statusReport.url(args, options),
    method: 'get',
})

statusReport.definition = {
    methods: ["get","head"],
    url: '/matters/{matter}/status-report/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MatterReportController::statusReport
* @see app/Http/Controllers/MatterReportController.php:14
* @route '/matters/{matter}/status-report/pdf'
*/
statusReport.url = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return statusReport.definition.url
            .replace('{matter}', parsedArgs.matter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MatterReportController::statusReport
* @see app/Http/Controllers/MatterReportController.php:14
* @route '/matters/{matter}/status-report/pdf'
*/
statusReport.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statusReport.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterReportController::statusReport
* @see app/Http/Controllers/MatterReportController.php:14
* @route '/matters/{matter}/status-report/pdf'
*/
statusReport.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: statusReport.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MatterReportController::statusReport
* @see app/Http/Controllers/MatterReportController.php:14
* @route '/matters/{matter}/status-report/pdf'
*/
const statusReportForm = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statusReport.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterReportController::statusReport
* @see app/Http/Controllers/MatterReportController.php:14
* @route '/matters/{matter}/status-report/pdf'
*/
statusReportForm.get = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statusReport.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MatterReportController::statusReport
* @see app/Http/Controllers/MatterReportController.php:14
* @route '/matters/{matter}/status-report/pdf'
*/
statusReportForm.head = (args: { matter: string | { id: string } } | [matter: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statusReport.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

statusReport.form = statusReportForm

const MatterReportController = { statusReport }

export default MatterReportController