import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\FinanceController::excel
* @see app/Http/Controllers/FinanceController.php:825
* @route '/finance/export/excel'
*/
export const excel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: excel.url(options),
    method: 'get',
})

excel.definition = {
    methods: ["get","head"],
    url: '/finance/export/excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceController::excel
* @see app/Http/Controllers/FinanceController.php:825
* @route '/finance/export/excel'
*/
excel.url = (options?: RouteQueryOptions) => {
    return excel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::excel
* @see app/Http/Controllers/FinanceController.php:825
* @route '/finance/export/excel'
*/
excel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: excel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::excel
* @see app/Http/Controllers/FinanceController.php:825
* @route '/finance/export/excel'
*/
excel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: excel.url(options),
    method: 'head',
})

const exportMethod = {
    excel: Object.assign(excel, excel),
}

export default exportMethod