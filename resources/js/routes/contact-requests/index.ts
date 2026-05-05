import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Web\ContactRequestController::store
 * @see app/Http/Controllers/Web/ContactRequestController.php:12
 * @route '/contact-requests'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/contact-requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\ContactRequestController::store
 * @see app/Http/Controllers/Web/ContactRequestController.php:12
 * @route '/contact-requests'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\ContactRequestController::store
 * @see app/Http/Controllers/Web/ContactRequestController.php:12
 * @route '/contact-requests'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Web\ContactRequestController::store
 * @see app/Http/Controllers/Web/ContactRequestController.php:12
 * @route '/contact-requests'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Web\ContactRequestController::store
 * @see app/Http/Controllers/Web/ContactRequestController.php:12
 * @route '/contact-requests'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const contactRequests = {
    store: Object.assign(store, store),
}

export default contactRequests