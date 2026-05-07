import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ConsultantsController::update
 * @see app/Http/Controllers/Admin/ConsultantsController.php:285
 * @route '/admin/consultants/{consultant}/profile-photo'
 */
export const update = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/admin/consultants/{consultant}/profile-photo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ConsultantsController::update
 * @see app/Http/Controllers/Admin/ConsultantsController.php:285
 * @route '/admin/consultants/{consultant}/profile-photo'
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
 * @see app/Http/Controllers/Admin/ConsultantsController.php:285
 * @route '/admin/consultants/{consultant}/profile-photo'
 */
update.post = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ConsultantsController::update
 * @see app/Http/Controllers/Admin/ConsultantsController.php:285
 * @route '/admin/consultants/{consultant}/profile-photo'
 */
    const updateForm = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ConsultantsController::update
 * @see app/Http/Controllers/Admin/ConsultantsController.php:285
 * @route '/admin/consultants/{consultant}/profile-photo'
 */
        updateForm.post = (args: { consultant: number | { id: number } } | [consultant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, options),
            method: 'post',
        })
    
    update.form = updateForm
const profilePhoto = {
    update: Object.assign(update, update),
}

export default profilePhoto