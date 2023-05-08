const path = require('path');
const { readFile, writeFile } = require('fs/promises');
const { PDFDocument, PDFTextField, PDFCheckBox  } = require('pdf-lib');


const mainController = {
    index: async function(req, res) {
        const pdfName = 'pdfPocosDatosTexts.pdf';
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
        console.log("Entre");
        pdfName = 'g-28_unlocked.pdf';
        const fields = req.body;
        // console.log("fields:" + data[0].fieldValue);

        fields.forEach(field => {
            fieldName = field.fieldName;
            fieldValue = field.fieldValue ? field.fieldValue : 'Empty';
            console.log(fieldName + ": " + fieldValue);
        });

        return res.status(200).send("Holis");
        // return res.status(200).render('home', { pdfName, data });    
    },


    processData2: async (req, res) => {
        pdfName = 'g-28_unlocked.pdf';
        const data = [];
        // const files = req.files;
        // console.log(files);

        const pdfFile = './public/outputPdfs/pdfPocosDatosTextYCheckboxYAcNum.pdf';
        const pdfDoc = await PDFDocument.load(await readFile(pdfFile), { ignoreEncryption: true });

        const form = pdfDoc.getForm();
        if (!form) {
            throw new Error('The PDF file does not have a form.');
        }

        const fields = form.getFields();
            if (!fields.length) {
            throw new Error('The PDF form does not have any fields.');
        }

        fields.forEach(field => {
            let newData;

            let fieldType;
            let fieldName;
            let fieldValue;

            if (field instanceof PDFTextField) { // Verificar que el campo sea un objeto PDFTextField
                //console.log(field.constructor.name);
                fieldName = field.getName();
                fieldValue = field.getText() ? field.getText() : 'Empty';
                fieldType = field.constructor.name;
            } else if (field instanceof PDFCheckBox) { // Verificar que el campo sea un objeto PDFCheckBox
                fieldName = field.getName();
                fieldValue = field.isChecked();
                fieldType = field.constructor.name;
            }
            // console.log(`${fieldName}: ${fieldValue}, instancia de: ${fieldType}`);
            newData = {fieldName: fieldName, fieldValue: fieldValue, fieldType: fieldType};
            data.push(newData);
        });
        console.log(data);

        return res.status(200).render('home', { pdfName, data });    
    }
}


module.exports = mainController;