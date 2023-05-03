const path = require('path');


const mainController = {
    index: async function(req, res) {
        return res.status(200).render('home', {
            // products: products,
        });
        
    }
}


module.exports = mainController;