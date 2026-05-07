import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ConsultantsController::__invoke
 * @see app/Http/Controllers/Admin/ConsultantsController.php:115
 * @route '/admin/consultants'
 */
const ConsultantsController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ConsultantsController.url(options),
    method: 'get',
})

ConsultantsController.definition = {
    methods: ["get","head"],
    url: '/admin/consultants',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ConsultantsController::__invoke
 * @see app/Http/Controllers/Admin/ConsultantsController.php:115
 * @route '/admin/consultants'
 */
ConsultantsController.url = (options?: RouteQueryOptions) => {
    return ConsultantsController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ConsultantsController::__invoke
 * @see app/Http/Controllers/Admin/ConsultantsController.php:115
 * @route '/admin/consultants'
 */
ConsultantsController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ConsultantsController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ConsultantsController::__invoke
 * @see app/Http/Controllers/Admin/ConsultantsController.php:115
 * @route '/admin/consultants'
 */
ConsultantsController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ConsultantsController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ConsultantsController::__invoke
 * @see app/Http/Controllers/Admin/ConsultantsController.php:115
 * @route '/admin/consultants'
 */
    const ConsultantsControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ConsultantsController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ConsultantsController::__invoke
 * @see app/Http/Controllers/Admin/ConsultantsController.php:115
 * @route '/admin/consultants'
 */
        ConsultantsControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ConsultantsController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ConsultantsController::__invoke
 * @see app/Http/Controllers/Admin/ConsultantsController.php:115
 * @route '/admin/consultants'
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
/**
* @see \App\Http\Controllers\Admin\ConsultantsController::store
 * @see app/Http/Controllers/Admin/ConsultantsController.php:161
 * @route '/admin/consultants'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/consultants',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ConsultantsController::store
 * @see app/Http/Controllers/Admin/ConsultantsController.php:161
 * @route '/admin/consultants'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ConsultantsController::store
 * @see app/Http/Controllers/Admin/ConsultantsController.php:161
 * @route '/admin/consultants'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ConsultantsController::store
 * @see app/Http/Controllers/Admin/ConsultantsController.php:161
 * @route '/admin/consultants'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ConsultantsController::store
 * @see app/Http/Controllers/Admin/ConsultantsController.php:161
 * @route '/admin/consultants'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\ConsultantsController::edit
 * @see app/Http/Controllers/Admin/ConsultantsController.php:200
 * @route '/admin/consultants/{consultant}/edit'
 */
export const edit = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/consultants/{consultant}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ConsultantsController::edit
 * @see app/Http/Controllers/Admin/ConsultantsController.php:200
 * @route '/admin/consultants/{consultant}/edit'
 */
edit.url = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { consultant: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { consultant: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    consultant: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        consultant: typeof args.consultant === 'object'
                ? args.consultant.id
                : args.consultant,
                }

    return edit.definition.url
            .replace('{consultant}', parsedArgs.consultant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ConsultantsController::edit
 * @see app/Http/Controllers/Admin/ConsultantsController.php:200
 * @route '/admin/consultants/{consultant}/edit'
 */
edit.get = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ConsultantsController::edit
 * @see app/Http/Controllers/Admin/ConsultantsController.php:200
 * @route '/admin/consultants/{consultant}/edit'
 */
edit.head = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ConsultantsController::edit
 * @see app/Http/Controllers/Admin/ConsultantsController.php:200
 * @route '/admin/consultants/{consultant}/edit'
 */
    const editForm = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ConsultantsController::edit
 * @see app/Http/Controllers/Admin/ConsultantsController.php:200
 * @route '/admin/consultants/{consultant}/edit'
 */
        editForm.get = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ConsultantsController::edit
 * @see app/Http/Controllers/Admin/ConsultantsController.php:200
 * @route '/admin/consultants/{consultant}/edit'
 */
        editForm.head = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\ConsultantsController::updateProfilePhoto
 * @see app/Http/Controllers/Admin/ConsultantsController.php:285
 * @route '/admin/consultants/{consultant}/profile-photo'
 */
export const updateProfilePhoto = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateProfilePhoto.url(args, options),
    method: 'post',
})

updateProfilePhoto.definition = {
    methods: ["post"],
    url: '/admin/consultants/{consultant}/profile-photo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ConsultantsController::updateProfilePhoto
 * @see app/Http/Controllers/Admin/ConsultantsController.php:285
 * @route '/admin/consultants/{consultant}/profile-photo'
 */
updateProfilePhoto.url = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { consultant: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { consultant: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    consultant: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        consultant: typeof args.consultant === 'object'
                ? args.consultant.id
                : args.consultant,
                }

    return updateProfilePhoto.definition.url
            .replace('{consultant}', parsedArgs.consultant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ConsultantsController::updateProfilePhoto
 * @see app/Http/Controllers/Admin/ConsultantsController.php:285
 * @route '/admin/consultants/{consultant}/profile-photo'
 */
updateProfilePhoto.post = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateProfilePhoto.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ConsultantsController::updateProfilePhoto
 * @see app/Http/Controllers/Admin/ConsultantsController.php:285
 * @route '/admin/consultants/{consultant}/profile-photo'
 */
    const updateProfilePhotoForm = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateProfilePhoto.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ConsultantsController::updateProfilePhoto
 * @see app/Http/Controllers/Admin/ConsultantsController.php:285
 * @route '/admin/consultants/{consultant}/profile-photo'
 */
        updateProfilePhotoForm.post = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateProfilePhoto.url(args, options),
            method: 'post',
        })
    
    updateProfilePhoto.form = updateProfilePhotoForm
/**
* @see \App\Http\Controllers\Admin\ConsultantsController::update
 * @see app/Http/Controllers/Admin/ConsultantsController.php:234
 * @route '/admin/consultants/{consultant}'
 */
export const update = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/consultants/{consultant}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ConsultantsController::update
 * @see app/Http/Controllers/Admin/ConsultantsController.php:234
 * @route '/admin/consultants/{consultant}'
 */
update.url = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { consultant: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { consultant: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    consultant: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        consultant: typeof args.consultant === 'object'
                ? args.consultant.id
                : args.consultant,
                }

    return update.definition.url
            .replace('{consultant}', parsedArgs.consultant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ConsultantsController::update
 * @see app/Http/Controllers/Admin/ConsultantsController.php:234
 * @route '/admin/consultants/{consultant}'
 */
update.put = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ConsultantsController::update
 * @see app/Http/Controllers/Admin/ConsultantsController.php:234
 * @route '/admin/consultants/{consultant}'
 */
    const updateForm = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ConsultantsController::update
 * @see app/Http/Controllers/Admin/ConsultantsController.php:234
 * @route '/admin/consultants/{consultant}'
 */
        updateForm.put = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\ConsultantsController::destroy
 * @see app/Http/Controllers/Admin/ConsultantsController.php:307
 * @route '/admin/consultants/{consultant}'
 */
export const destroy = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/consultants/{consultant}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ConsultantsController::destroy
 * @see app/Http/Controllers/Admin/ConsultantsController.php:307
 * @route '/admin/consultants/{consultant}'
 */
destroy.url = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { consultant: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { consultant: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    consultant: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        consultant: typeof args.consultant === 'object'
                ? args.consultant.id
                : args.consultant,
                }

    return destroy.definition.url
            .replace('{consultant}', parsedArgs.consultant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ConsultantsController::destroy
 * @see app/Http/Controllers/Admin/ConsultantsController.php:307
 * @route '/admin/consultants/{consultant}'
 */
destroy.delete = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\ConsultantsController::destroy
 * @see app/Http/Controllers/Admin/ConsultantsController.php:307
 * @route '/admin/consultants/{consultant}'
 */
    const destroyForm = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ConsultantsController::destroy
 * @see app/Http/Controllers/Admin/ConsultantsController.php:307
 * @route '/admin/consultants/{consultant}'
 */
        destroyForm.delete = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
ConsultantsController.store = store
ConsultantsController.edit = edit
ConsultantsController.updateProfilePhoto = updateProfilePhoto
ConsultantsController.update = update
ConsultantsController.destroy = destroy

export default ConsultantsController