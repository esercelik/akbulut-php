import Web from './Web'
import PublicStorageController from './PublicStorageController'
import LocationController from './LocationController'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    Web: Object.assign(Web, Web),
PublicStorageController: Object.assign(PublicStorageController, PublicStorageController),
LocationController: Object.assign(LocationController, LocationController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers