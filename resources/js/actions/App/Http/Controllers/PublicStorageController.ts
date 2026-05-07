import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicStorageController::__invoke
 * @see app/Http/Controllers/PublicStorageController.php:11
 * @route '/storage/{path}'
 */
const PublicStorageController = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PublicStorageController.url(args, options),
    method: 'get',
})

PublicStorageController.definition = {
    methods: ["get","head"],
    url: '/storage/{path}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicStorageController::__invoke
 * @see app/Http/Controllers/PublicStorageController.php:11
 * @route '/storage/{path}'
 */
PublicStorageController.url = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { path: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    path: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        path: args.path,
                }

    return PublicStorageController.definition.url
            .replace('{path}', parsedArgs.path.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicStorageController::__invoke
 * @see app/Http/Controllers/PublicStorageController.php:11
 * @route '/storage/{path}'
 */
PublicStorageController.get = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PublicStorageController.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicStorageController::__invoke
 * @see app/Http/Controllers/PublicStorageController.php:11
 * @route '/storage/{path}'
 */
PublicStorageController.head = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PublicStorageController.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicStorageController::__invoke
 * @see app/Http/Controllers/PublicStorageController.php:11
 * @route '/storage/{path}'
 */
    const PublicStorageControllerForm = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: PublicStorageController.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicStorageController::__invoke
 * @see app/Http/Controllers/PublicStorageController.php:11
 * @route '/storage/{path}'
 */
        PublicStorageControllerForm.get = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: PublicStorageController.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicStorageController::__invoke
 * @see app/Http/Controllers/PublicStorageController.php:11
 * @route '/storage/{path}'
 */
        PublicStorageControllerForm.head = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: PublicStorageController.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    PublicStorageController.form = PublicStorageControllerForm
export default PublicStorageController