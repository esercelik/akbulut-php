import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import images from './images'
/**
* @see \App\Http\Controllers\Admin\ListingsController::__invoke
 * @see app/Http/Controllers/Admin/ListingsController.php:311
 * @route '/admin/listings'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/listings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ListingsController::__invoke
 * @see app/Http/Controllers/Admin/ListingsController.php:311
 * @route '/admin/listings'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ListingsController::__invoke
 * @see app/Http/Controllers/Admin/ListingsController.php:311
 * @route '/admin/listings'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ListingsController::__invoke
 * @see app/Http/Controllers/Admin/ListingsController.php:311
 * @route '/admin/listings'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ListingsController::__invoke
 * @see app/Http/Controllers/Admin/ListingsController.php:311
 * @route '/admin/listings'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ListingsController::__invoke
 * @see app/Http/Controllers/Admin/ListingsController.php:311
 * @route '/admin/listings'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ListingsController::__invoke
 * @see app/Http/Controllers/Admin/ListingsController.php:311
 * @route '/admin/listings'
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
* @see \App\Http\Controllers\Admin\ListingsController::create
 * @see app/Http/Controllers/Admin/ListingsController.php:366
 * @route '/admin/listings/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/listings/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ListingsController::create
 * @see app/Http/Controllers/Admin/ListingsController.php:366
 * @route '/admin/listings/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ListingsController::create
 * @see app/Http/Controllers/Admin/ListingsController.php:366
 * @route '/admin/listings/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ListingsController::create
 * @see app/Http/Controllers/Admin/ListingsController.php:366
 * @route '/admin/listings/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ListingsController::create
 * @see app/Http/Controllers/Admin/ListingsController.php:366
 * @route '/admin/listings/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ListingsController::create
 * @see app/Http/Controllers/Admin/ListingsController.php:366
 * @route '/admin/listings/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ListingsController::create
 * @see app/Http/Controllers/Admin/ListingsController.php:366
 * @route '/admin/listings/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Admin\ListingPdfImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingPdfImportController.php:21
 * @route '/admin/listings/import-pdf'
 */
export const importPdf = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importPdf.url(options),
    method: 'post',
})

importPdf.definition = {
    methods: ["post"],
    url: '/admin/listings/import-pdf',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ListingPdfImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingPdfImportController.php:21
 * @route '/admin/listings/import-pdf'
 */
importPdf.url = (options?: RouteQueryOptions) => {
    return importPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ListingPdfImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingPdfImportController.php:21
 * @route '/admin/listings/import-pdf'
 */
importPdf.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importPdf.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ListingPdfImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingPdfImportController.php:21
 * @route '/admin/listings/import-pdf'
 */
    const importPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importPdf.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ListingPdfImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingPdfImportController.php:21
 * @route '/admin/listings/import-pdf'
 */
        importPdfForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importPdf.url(options),
            method: 'post',
        })
    
    importPdf.form = importPdfForm
/**
* @see \App\Http\Controllers\Admin\ListingUrlImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingUrlImportController.php:21
 * @route '/admin/listings/import-url'
 */
export const importUrl = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importUrl.url(options),
    method: 'post',
})

importUrl.definition = {
    methods: ["post"],
    url: '/admin/listings/import-url',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ListingUrlImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingUrlImportController.php:21
 * @route '/admin/listings/import-url'
 */
importUrl.url = (options?: RouteQueryOptions) => {
    return importUrl.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ListingUrlImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingUrlImportController.php:21
 * @route '/admin/listings/import-url'
 */
importUrl.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importUrl.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ListingUrlImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingUrlImportController.php:21
 * @route '/admin/listings/import-url'
 */
    const importUrlForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importUrl.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ListingUrlImportController::__invoke
 * @see app/Http/Controllers/Admin/ListingUrlImportController.php:21
 * @route '/admin/listings/import-url'
 */
        importUrlForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importUrl.url(options),
            method: 'post',
        })
    
    importUrl.form = importUrlForm
/**
* @see \App\Http\Controllers\Admin\ListingsController::store
 * @see app/Http/Controllers/Admin/ListingsController.php:382
 * @route '/admin/listings'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/listings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ListingsController::store
 * @see app/Http/Controllers/Admin/ListingsController.php:382
 * @route '/admin/listings'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ListingsController::store
 * @see app/Http/Controllers/Admin/ListingsController.php:382
 * @route '/admin/listings'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ListingsController::store
 * @see app/Http/Controllers/Admin/ListingsController.php:382
 * @route '/admin/listings'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ListingsController::store
 * @see app/Http/Controllers/Admin/ListingsController.php:382
 * @route '/admin/listings'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\ListingsController::edit
 * @see app/Http/Controllers/Admin/ListingsController.php:411
 * @route '/admin/listings/{property}/edit'
 */
export const edit = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/listings/{property}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ListingsController::edit
 * @see app/Http/Controllers/Admin/ListingsController.php:411
 * @route '/admin/listings/{property}/edit'
 */
edit.url = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{property}', parsedArgs.property.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ListingsController::edit
 * @see app/Http/Controllers/Admin/ListingsController.php:411
 * @route '/admin/listings/{property}/edit'
 */
edit.get = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ListingsController::edit
 * @see app/Http/Controllers/Admin/ListingsController.php:411
 * @route '/admin/listings/{property}/edit'
 */
edit.head = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ListingsController::edit
 * @see app/Http/Controllers/Admin/ListingsController.php:411
 * @route '/admin/listings/{property}/edit'
 */
    const editForm = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ListingsController::edit
 * @see app/Http/Controllers/Admin/ListingsController.php:411
 * @route '/admin/listings/{property}/edit'
 */
        editForm.get = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ListingsController::edit
 * @see app/Http/Controllers/Admin/ListingsController.php:411
 * @route '/admin/listings/{property}/edit'
 */
        editForm.head = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\ListingsController::update
 * @see app/Http/Controllers/Admin/ListingsController.php:428
 * @route '/admin/listings/{property}'
 */
export const update = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/listings/{property}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ListingsController::update
 * @see app/Http/Controllers/Admin/ListingsController.php:428
 * @route '/admin/listings/{property}'
 */
update.url = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{property}', parsedArgs.property.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ListingsController::update
 * @see app/Http/Controllers/Admin/ListingsController.php:428
 * @route '/admin/listings/{property}'
 */
update.put = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ListingsController::update
 * @see app/Http/Controllers/Admin/ListingsController.php:428
 * @route '/admin/listings/{property}'
 */
    const updateForm = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ListingsController::update
 * @see app/Http/Controllers/Admin/ListingsController.php:428
 * @route '/admin/listings/{property}'
 */
        updateForm.put = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\ListingsController::destroy
 * @see app/Http/Controllers/Admin/ListingsController.php:482
 * @route '/admin/listings/{property}'
 */
export const destroy = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/listings/{property}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ListingsController::destroy
 * @see app/Http/Controllers/Admin/ListingsController.php:482
 * @route '/admin/listings/{property}'
 */
destroy.url = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{property}', parsedArgs.property.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ListingsController::destroy
 * @see app/Http/Controllers/Admin/ListingsController.php:482
 * @route '/admin/listings/{property}'
 */
destroy.delete = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\ListingsController::destroy
 * @see app/Http/Controllers/Admin/ListingsController.php:482
 * @route '/admin/listings/{property}'
 */
    const destroyForm = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ListingsController::destroy
 * @see app/Http/Controllers/Admin/ListingsController.php:482
 * @route '/admin/listings/{property}'
 */
        destroyForm.delete = (args: { property: number | { id: number } } | [property: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const listings = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
importPdf: Object.assign(importPdf, importPdf),
importUrl: Object.assign(importUrl, importUrl),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
images: Object.assign(images, images),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default listings