import HomeController from './HomeController'
import SeoController from './SeoController'
import ListingController from './ListingController'
import ConsultantsController from './ConsultantsController'
import ConsultantPortfolioController from './ConsultantPortfolioController'
import ContactRequestController from './ContactRequestController'
const Web = {
    HomeController: Object.assign(HomeController, HomeController),
SeoController: Object.assign(SeoController, SeoController),
ListingController: Object.assign(ListingController, ListingController),
ConsultantsController: Object.assign(ConsultantsController, ConsultantsController),
ConsultantPortfolioController: Object.assign(ConsultantPortfolioController, ConsultantPortfolioController),
ContactRequestController: Object.assign(ContactRequestController, ContactRequestController),
}

export default Web