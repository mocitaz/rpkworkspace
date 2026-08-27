import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
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
/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:64
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
* @see app/Http/Controllers/FinanceController.php:64
* @route '/finance'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:64
* @route '/finance'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FinanceController::index
* @see app/Http/Controllers/FinanceController.php:64
* @route '/finance'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const finance = {
    index: Object.assign(index, index),
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
}

export default finance