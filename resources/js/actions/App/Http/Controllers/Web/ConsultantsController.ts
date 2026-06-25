import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\ConsultantsController::__invoke
 * @see app/Http/Controllers/Web/ConsultantsController.php:12
 * @route '/consultants'
 */
const ConsultantsController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ConsultantsController.url(options),
    method: 'get',
})

ConsultantsController.definition = {
    methods: ["get","head"],
    url: '/consultants',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\ConsultantsController::__invoke
 * @see app/Http/Controllers/Web/ConsultantsController.php:12
 * @route '/consultants'
 */
ConsultantsController.url = (options?: RouteQueryOptions) => {
    return ConsultantsController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\ConsultantsController::__invoke
 * @see app/Http/Controllers/Web/ConsultantsController.php:12
 * @route '/consultants'
 */
ConsultantsController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ConsultantsController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\ConsultantsController::__invoke
 * @see app/Http/Controllers/Web/ConsultantsController.php:12
 * @route '/consultants'
 */
ConsultantsController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ConsultantsController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\ConsultantsController::__invoke
 * @see app/Http/Controllers/Web/ConsultantsController.php:12
 * @route '/consultants'
 */
    const ConsultantsControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ConsultantsController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\ConsultantsController::__invoke
 * @see app/Http/Controllers/Web/ConsultantsController.php:12
 * @route '/consultants'
 */
        ConsultantsControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ConsultantsController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\ConsultantsController::__invoke
 * @see app/Http/Controllers/Web/ConsultantsController.php:12
 * @route '/consultants'
 */
        ConsultantsControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ConsultantsController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ConsultantsController.form = ConsultantsControllerForm
export default ConsultantsController