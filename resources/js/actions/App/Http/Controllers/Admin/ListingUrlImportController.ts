import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ListingUrlImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingUrlImportController.php:21
 * @route '/admin/listings/import-url'
 */
const ListingUrlImportController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ListingUrlImportController.url(options),
    method: 'post',
})

ListingUrlImportController.definition = {
    methods: ["post"],
    url: '/admin/listings/import-url',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ListingUrlImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingUrlImportController.php:21
 * @route '/admin/listings/import-url'
 */
ListingUrlImportController.url = (options?: RouteQueryOptions) => {
    return ListingUrlImportController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ListingUrlImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingUrlImportController.php:21
 * @route '/admin/listings/import-url'
 */
ListingUrlImportController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ListingUrlImportController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ListingUrlImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingUrlImportController.php:21
 * @route '/admin/listings/import-url'
 */
    const ListingUrlImportControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: ListingUrlImportController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ListingUrlImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingUrlImportController.php:21
 * @route '/admin/listings/import-url'
 */
        ListingUrlImportControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: ListingUrlImportController.url(options),
            method: 'post',
        })
    
    ListingUrlImportController.form = ListingUrlImportControllerForm
export default ListingUrlImportController