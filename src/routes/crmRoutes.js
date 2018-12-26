import { 
    addNewContact, 
    getContacts, 
    getContactWithID, 
    updateContact,
    deleteContact 
} from '../controllers/crmController';
import { login, register, loginRequired} from '../controllers/userControllers';

const routes = (app) => {
    app.route('/contact')
        .get(loginRequired, getContacts)  // retrieve list of all contacts
        .post(loginRequired, addNewContact);  // create a new contact

    app.route('/contact/:contactId')
        .get(loginRequired, getContactWithID) // get specific contact
        .put(loginRequired, updateContact)  // update specific contact
        .delete(loginRequired, deleteContact);  // delete specific contact

    // registration route
    app.route('/auth/register')
        .post(register);

    // login route
    app.route('/auth/login')
        .post(login);
}

export default routes;
