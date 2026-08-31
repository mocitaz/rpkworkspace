import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import matters from './matters'
import exportMethod from './export'
import invoices from './invoices'
import payments from './payments'
import quotations from './quotations'
import expenses from './expenses'
import accounts from './accounts'
import transfers from './transfers'
import partnerTransactions from './partner-transactions'
import clientTrustFunds from './client-trust-funds'
import payrolls from './payrolls'
import proof from './proof'
/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:80
* @route '/finance'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/finance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:80
* @route '/finance'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:80
* @route '/finance'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:80
* @route '/finance'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:80
* @route '/finance'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:80
* @route '/finance'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:80
* @route '/finance'
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

const finance = {
    index: Object.assign(index, index),
    matters: Object.assign(matters, matters),
    export: Object.assign(exportMethod, exportMethod),
    invoices: Object.assign(invoices, invoices),
    payments: Object.assign(payments, payments),
    quotations: Object.assign(quotations, quotations),
    expenses: Object.assign(expenses, expenses),
    accounts: Object.assign(accounts, accounts),
    transfers: Object.assign(transfers, transfers),
    partnerTransactions: Object.assign(partnerTransactions, partnerTransactions),
    clientTrustFunds: Object.assign(clientTrustFunds, clientTrustFunds),
    payrolls: Object.assign(payrolls, payrolls),
    proof: Object.assign(proof, proof),
}

export default finance