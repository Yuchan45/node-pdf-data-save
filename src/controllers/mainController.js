const path = require('path');


const mainController = {
    index: async function(req, res) {
        pdfName = 'g-28_unlocked.pdf';
        return res.status(200).render('home', { pdfName });    

    }
}


module.exports = mainController;