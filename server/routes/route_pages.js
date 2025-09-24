const express = require('express');
const router = express.Router();
const controllPages = require('../controller/control_pages');
const verify_admin_token = require('../middleware/verify_admin_token');

router.get('/',controllPages.home);
router.get('/features',controllPages.features);
router.get('/wallets',controllPages.wallet);
router.get('/admin',controllPages.admin);
router.get('/login',controllPages.admin_login);
router.get('/admin-home',verify_admin_token,controllPages.admin_home)
router.get('/logout',controllPages.Admin_logout);

router.post('/adminRegister',controllPages.createAdmin)
router.post('/get_wallet_details',controllPages.get_wallet_details);
router.post('/postwallet',controllPages.postwallet);
router.post('/admin_login',controllPages.post_admin_login);
module.exports = router;