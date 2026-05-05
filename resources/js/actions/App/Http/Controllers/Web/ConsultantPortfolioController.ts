import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\ConsultantPortfolioController::__invoke
 * @see app/Http/Controllers/Web/ConsultantPortfolioController.php:16
 * @route '/danisman/{consultant}'
 */
const ConsultantPortfolioController = (args: { consultant: string | { slug: string } } | [consultant: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ConsultantPortfolioController.url(args, options),
    method: 'get',
})

ConsultantPortfolioController.definition = {
    methods: ["get","head"],
    url: '/danisman/{consultant}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\ConsultantPortfolioController::__invoke
 * @see app/Http/Controllers/Web/ConsultantPortfolioController.php:16
 * @route '/danisman/{consultant}'
 */
ConsultantPortfolioController.url = (args: { consultant: string | { slug: string } } | [consultant: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { consultant: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { consultant: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    consultant: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        consultant: typeof args.consultant === 'object'
                ? args.consultant.slug
                : args.consultant,
                }

    return ConsultantPortfolioController.definition.url
            .replace('{consultant}', parsedArgs.consultant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\ConsultantPortfolioController::__invoke
 * @see app/Http/Controllers/Web/ConsultantPortfolioController.php:16
 * @route '/danisman/{consultant}'
 */
ConsultantPortfolioController.get = (args: { consultant: string | { slug: string } } | [consultant: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ConsultantPortfolioController.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\ConsultantPortfolioController::__invoke
 * @see app/Http/Controllers/Web/ConsultantPortfolioController.php:16
 * @route '/danisman/{consultant}'
 */
ConsultantPortfolioController.head = (args: { consultant: string | { slug: string } } | [consultant: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ConsultantPortfolioController.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\ConsultantPortfolioController::__invoke
 * @see app/Http/Controllers/Web/ConsultantPortfolioController.php:16
 * @route '/danisman/{consultant}'
 */
    const ConsultantPortfolioControllerForm = (args: { consultant: string | { slug: string } } | [consultant: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ConsultantPortfolioController.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\ConsultantPortfolioController::__invoke
 * @see app/Http/Controllers/Web/ConsultantPortfolioController.php:16
 * @route '/danisman/{consultant}'
 */
        ConsultantPortfolioControllerForm.get = (args: { consultant: string | { slug: string } } | [consultant: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ConsultantPortfolioController.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\ConsultantPortfolioController::__invoke
 * @see app/Http/Controllers/Web/ConsultantPortfolioController.php:16
 * @route '/danisman/{consultant}'
 */
        ConsultantPortfolioControllerForm.head = (args: { consultant: string | { slug: string } } | [consultant: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ConsultantPortfolioController.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ConsultantPortfolioController.form = ConsultantPortfolioControllerForm
export default ConsultantPortfolioController