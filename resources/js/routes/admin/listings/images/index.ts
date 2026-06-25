import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ListingsController::store
 * @see app/Http/Controllers/Admin/ListingsController.php:462
 * @route '/admin/listings/{property}/images'
 */
export const store = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/listings/{property}/images',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ListingsController::store
 * @see app/Http/Controllers/Admin/ListingsController.php:462
 * @route '/admin/listings/{property}/images'
 */
store.url = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { property: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { property: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    property: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        property: typeof args.property === 'object'
                ? args.property.id
                : args.property,
                }

    return store.definition.url
            .replace('{property}', parsedArgs.property.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ListingsController::store
 * @see app/Http/Controllers/Admin/ListingsController.php:462
 * @route '/admin/listings/{property}/images'
 */
store.post = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ListingsController::store
 * @see app/Http/Controllers/Admin/ListingsController.php:462
 * @route '/admin/listings/{property}/images'
 */
    const storeForm = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ListingsController::store
 * @see app/Http/Controllers/Admin/ListingsController.php:462
 * @route '/admin/listings/{property}/images'
 */
        storeForm.post = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const images = {
    store: Object.assign(store, store),
}

export default images