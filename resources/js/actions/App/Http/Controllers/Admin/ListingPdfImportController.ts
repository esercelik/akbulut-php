import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ListingPdfImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingPdfImportController.php:21
 * @route '/admin/listings/import-pdf'
 */
const ListingPdfImportController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ListingPdfImportController.url(options),
    method: 'post',
})

ListingPdfImportController.definition = {
    methods: ["post"],
    url: '/admin/listings/import-pdf',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ListingPdfImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingPdfImportController.php:21
 * @route '/admin/listings/import-pdf'
 */
ListingPdfImportController.url = (options?: RouteQueryOptions) => {
    return ListingPdfImportController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ListingPdfImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingPdfImportController.php:21
 * @route '/admin/listings/import-pdf'
 */
ListingPdfImportController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ListingPdfImportController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ListingPdfImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingPdfImportController.php:21
 * @route '/admin/listings/import-pdf'
 */
    const ListingPdfImportControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: ListingPdfImportController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ListingPdfImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingPdfImportController.php:21
 * @route '/admin/listings/import-pdf'
 */
        ListingPdfImportControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: ListingPdfImportController.url(options),
            method: 'post',
        })
    
    ListingPdfImportController.form = ListingPdfImportControllerForm
export default ListingPdfImportController