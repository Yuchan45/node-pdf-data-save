const path = require('path');


const mainController = {
    index: async function(req, res) {
        const pdfName = 'g-28_unlocked.pdf';
        // const pdfName = 'i360ConBotonSend.pdf';
        const data = {
            Example_pdf: {
                "form1[0].#pageSet[0].Page1[0].PDF417BarCode1[0]": "Tomas",
                "form1[0].#pageSet[0].Page1[0].PDF417BarCode1[1]": "Yu",
                "form1[0].#pageSet[0].Page1[0].PDF417BarCode1[2]": "Nakasone",
            }
        };

        return res.status(200).render('home', { pdfName, data });    
    },
    processData: async function(req, res) {
        pdfName = 'g-28_unlocked.pdf';
        const data = {
            EstoyAca: "asdas"
        }
        // const files = req.files;
        // console.log(files);

        const pdfFile = '/public/';
        


        return res.status(200).render('home', { pdfName, data });    
    }
}


module.exports = mainController;