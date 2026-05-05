import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\ListingController::show
 * @see app/Http/Controllers/Web/ListingController.php:15
 * @route '/listings'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/listings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\ListingController::show
 * @see app/Http/Controllers/Web/ListingController.php:15
 * @route '/listings'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\ListingController::show
 * @see app/Http/Controllers/Web/ListingController.php:15
 * @route '/listings'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\ListingController::show
 * @see app/Http/Controllers/Web/ListingController.php:15
 * @route '/listings'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\ListingController::show
 * @see app/Http/Controllers/Web/ListingController.php:15
 * @route '/listings'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\ListingController::show
 * @see app/Http/Controllers/Web/ListingController.php:15
 * @route '/listings'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\ListingController::show
 * @see app/Http/Controllers/Web/ListingController.php:15
 * @route '/listings'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Web\ListingController::legacyDetails
 * @see app/Http/Controllers/Web/ListingController.php:42
 * @route '/listings/{reference}'
 */
export const legacyDetails = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: legacyDetails.url(args, options),
    method: 'get',
})

legacyDetails.definition = {
    methods: ["get","head"],
    url: '/listings/{reference}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\ListingController::legacyDetails
 * @see app/Http/Controllers/Web/ListingController.php:42
 * @route '/listings/{reference}'
 */
legacyDetails.url = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reference: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reference: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reference: args.reference,
                }

    return legacyDetails.definition.url
            .replace('{reference}', parsedArgs.reference.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\ListingController::legacyDetails
 * @see app/Http/Controllers/Web/ListingController.php:42
 * @route '/listings/{reference}'
 */
legacyDetails.get = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: legacyDetails.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\ListingController::legacyDetails
 * @see app/Http/Controllers/Web/ListingController.php:42
 * @route '/listings/{reference}'
 */
legacyDetails.head = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: legacyDetails.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\ListingController::legacyDetails
 * @see app/Http/Controllers/Web/ListingController.php:42
 * @route '/listings/{reference}'
 */
    const legacyDetailsForm = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: legacyDetails.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\ListingController::legacyDetails
 * @see app/Http/Controllers/Web/ListingController.php:42
 * @route '/listings/{reference}'
 */
        legacyDetailsForm.get = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: legacyDetails.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\ListingController::legacyDetails
 * @see app/Http/Controllers/Web/ListingController.php:42
 * @route '/listings/{reference}'
 */
        legacyDetailsForm.head = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: legacyDetails.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    legacyDetails.form = legacyDetailsForm
/**
* @see \App\Http\Controllers\Web\ListingController::details
 * @see app/Http/Controllers/Web/ListingController.php:49
 * @route '/ilan/{reference}'
 */
export const details = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: details.url(args, options),
    method: 'get',
})

details.definition = {
    methods: ["get","head"],
    url: '/ilan/{reference}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\ListingController::details
 * @see app/Http/Controllers/Web/ListingController.php:49
 * @route '/ilan/{reference}'
 */
details.url = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reference: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reference: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reference: args.reference,
                }

    return details.definition.url
            .replace('{reference}', parsedArgs.reference.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\ListingController::details
 * @see app/Http/Controllers/Web/ListingController.php:49
 * @route '/ilan/{reference}'
 */
details.get = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: details.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\ListingController::details
 * @see app/Http/Controllers/Web/ListingController.php:49
 * @route '/ilan/{reference}'
 */
details.head = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: details.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\ListingController::details
 * @see app/Http/Controllers/Web/ListingController.php:49
 * @route '/ilan/{reference}'
 */
    const detailsForm = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: details.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\ListingController::details
 * @see app/Http/Controllers/Web/ListingController.php:49
 * @route '/ilan/{reference}'
 */
        detailsForm.get = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: details.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\ListingController::details
 * @see app/Http/Controllers/Web/ListingController.php:49
 * @route '/ilan/{reference}'
 */
        detailsForm.head = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: details.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    details.form = detailsForm
const ListingController = { show, legacyDetails, details }

export default ListingController