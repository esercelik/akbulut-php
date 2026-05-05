import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Web\ConsultantsController::__invoke
 * @see app/Http/Controllers/Web/ConsultantsController.php:12
 * @route '/consultants'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/consultants',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\ConsultantsController::__invoke
 * @see app/Http/Controllers/Web/ConsultantsController.php:12
 * @route '/consultants'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\ConsultantsController::__invoke
 * @see app/Http/Controllers/Web/ConsultantsController.php:12
 * @route '/consultants'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\ConsultantsController::__invoke
 * @see app/Http/Controllers/Web/ConsultantsController.php:12
 * @route '/consultants'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\ConsultantsController::__invoke
 * @see app/Http/Controllers/Web/ConsultantsController.php:12
 * @route '/consultants'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\ConsultantsController::__invoke
 * @see app/Http/Controllers/Web/ConsultantsController.php:12
 * @route '/consultants'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\ConsultantsController::__invoke
 * @see app/Http/Controllers/Web/ConsultantsController.php:12
 * @route '/consultants'
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
/**
* @see \App\Http\Controllers\Web\ConsultantPortfolioController::__invoke
 * @see app/Http/Controllers/Web/ConsultantPortfolioController.php:16
 * @route '/danisman/{consultant}'
 */
export const show = (args: { consultant: string | { slug: string } } | [consultant: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/danisman/{consultant}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\ConsultantPortfolioController::__invoke
 * @see app/Http/Controllers/Web/ConsultantPortfolioController.php:16
 * @route '/danisman/{consultant}'
 */
show.url = (args: { consultant: string | { slug: string } } | [consultant: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{consultant}', parsedArgs.consultant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\ConsultantPortfolioController::__invoke
 * @see app/Http/Controllers/Web/ConsultantPortfolioController.php:16
 * @route '/danisman/{consultant}'
 */
show.get = (args: { consultant: string | { slug: string } } | [consultant: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\ConsultantPortfolioController::__invoke
 * @see app/Http/Controllers/Web/ConsultantPortfolioController.php:16
 * @route '/danisman/{consultant}'
 */
show.head = (args: { consultant: string | { slug: string } } | [consultant: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\ConsultantPortfolioController::__invoke
 * @see app/Http/Controllers/Web/ConsultantPortfolioController.php:16
 * @route '/danisman/{consultant}'
 */
    const showForm = (args: { consultant: string | { slug: string } } | [consultant: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\ConsultantPortfolioController::__invoke
 * @see app/Http/Controllers/Web/ConsultantPortfolioController.php:16
 * @route '/danisman/{consultant}'
 */
        showForm.get = (args: { consultant: string | { slug: string } } | [consultant: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\ConsultantPortfolioController::__invoke
 * @see app/Http/Controllers/Web/ConsultantPortfolioController.php:16
 * @route '/danisman/{consultant}'
 */
        showForm.head = (args: { consultant: string | { slug: string } } | [consultant: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const consultants = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
}

export default consultants