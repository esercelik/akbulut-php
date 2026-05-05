import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LocationController::cities
 * @see app/Http/Controllers/LocationController.php:13
 * @route '/locations/cities'
 */
export const cities = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cities.url(options),
    method: 'get',
})

cities.definition = {
    methods: ["get","head"],
    url: '/locations/cities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocationController::cities
 * @see app/Http/Controllers/LocationController.php:13
 * @route '/locations/cities'
 */
cities.url = (options?: RouteQueryOptions) => {
    return cities.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocationController::cities
 * @see app/Http/Controllers/LocationController.php:13
 * @route '/locations/cities'
 */
cities.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cities.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocationController::cities
 * @see app/Http/Controllers/LocationController.php:13
 * @route '/locations/cities'
 */
cities.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cities.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LocationController::cities
 * @see app/Http/Controllers/LocationController.php:13
 * @route '/locations/cities'
 */
    const citiesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cities.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LocationController::cities
 * @see app/Http/Controllers/LocationController.php:13
 * @route '/locations/cities'
 */
        citiesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cities.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LocationController::cities
 * @see app/Http/Controllers/LocationController.php:13
 * @route '/locations/cities'
 */
        citiesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cities.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cities.form = citiesForm
/**
* @see \App\Http\Controllers\LocationController::districts
 * @see app/Http/Controllers/LocationController.php:23
 * @route '/locations/districts'
 */
export const districts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: districts.url(options),
    method: 'get',
})

districts.definition = {
    methods: ["get","head"],
    url: '/locations/districts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocationController::districts
 * @see app/Http/Controllers/LocationController.php:23
 * @route '/locations/districts'
 */
districts.url = (options?: RouteQueryOptions) => {
    return districts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocationController::districts
 * @see app/Http/Controllers/LocationController.php:23
 * @route '/locations/districts'
 */
districts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: districts.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocationController::districts
 * @see app/Http/Controllers/LocationController.php:23
 * @route '/locations/districts'
 */
districts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: districts.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LocationController::districts
 * @see app/Http/Controllers/LocationController.php:23
 * @route '/locations/districts'
 */
    const districtsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: districts.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LocationController::districts
 * @see app/Http/Controllers/LocationController.php:23
 * @route '/locations/districts'
 */
        districtsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: districts.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LocationController::districts
 * @see app/Http/Controllers/LocationController.php:23
 * @route '/locations/districts'
 */
        districtsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: districts.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    districts.form = districtsForm
/**
* @see \App\Http\Controllers\LocationController::neighborhoods
 * @see app/Http/Controllers/LocationController.php:38
 * @route '/locations/neighborhoods'
 */
export const neighborhoods = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: neighborhoods.url(options),
    method: 'get',
})

neighborhoods.definition = {
    methods: ["get","head"],
    url: '/locations/neighborhoods',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocationController::neighborhoods
 * @see app/Http/Controllers/LocationController.php:38
 * @route '/locations/neighborhoods'
 */
neighborhoods.url = (options?: RouteQueryOptions) => {
    return neighborhoods.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocationController::neighborhoods
 * @see app/Http/Controllers/LocationController.php:38
 * @route '/locations/neighborhoods'
 */
neighborhoods.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: neighborhoods.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocationController::neighborhoods
 * @see app/Http/Controllers/LocationController.php:38
 * @route '/locations/neighborhoods'
 */
neighborhoods.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: neighborhoods.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LocationController::neighborhoods
 * @see app/Http/Controllers/LocationController.php:38
 * @route '/locations/neighborhoods'
 */
    const neighborhoodsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: neighborhoods.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LocationController::neighborhoods
 * @see app/Http/Controllers/LocationController.php:38
 * @route '/locations/neighborhoods'
 */
        neighborhoodsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: neighborhoods.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LocationController::neighborhoods
 * @see app/Http/Controllers/LocationController.php:38
 * @route '/locations/neighborhoods'
 */
        neighborhoodsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: neighborhoods.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    neighborhoods.form = neighborhoodsForm
const LocationController = { cities, districts, neighborhoods }

export default LocationController