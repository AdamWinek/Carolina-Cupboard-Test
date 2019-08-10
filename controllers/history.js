let express = require("express"),
    router = express.Router(),
    authService = require("../services/authorization-service"),
    tranService = require("../services/transaction-service"),
    itemService = require("../services/item-service"),
    exceptionHandler = require("../exceptions/exception-handler");

router.get('/', async function(req, res, next) {
    let onyen = await authService.getOnyen(req);
    let userType = await authService.getUserType(onyen);
    let response = {};
    try {
        response.transactions = await tranService.getUserPurchaseHistory(onyen);
        for(const t of response.transactions) {
            t['item_name'] = (await itemService.getItem(t['item_id']))['name'];
            t['count'] = -t['count'];
        }

    }
    catch(e) {
        response.error = e;
        throw e;
    }
    res.render('user/history.ejs', {response: response, onyen: onyen, userType: userType    });
});

module.exports = router;