import DashboardController from './DashboardController'
import ListingsController from './ListingsController'
import ListingPdfImportController from './ListingPdfImportController'
import ListingUrlImportController from './ListingUrlImportController'
import ConsultantsController from './ConsultantsController'
import MessagesController from './MessagesController'
import SettingsController from './SettingsController'
const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
ListingsController: Object.assign(ListingsController, ListingsController),
ListingPdfImportController: Object.assign(ListingPdfImportController, ListingPdfImportController),
ListingUrlImportController: Object.assign(ListingUrlImportController, ListingUrlImportController),
ConsultantsController: Object.assign(ConsultantsController, ConsultantsController),
MessagesController: Object.assign(MessagesController, MessagesController),
SettingsController: Object.assign(SettingsController, SettingsController),
}

export default Admin