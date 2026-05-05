import Web from './Web'
import LocationController from './LocationController'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    Web: Object.assign(Web, Web),
LocationController: Object.assign(LocationController, LocationController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers