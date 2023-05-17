const path = require('path');
const { readFile, writeFile } = require('fs/promises');
const { PDFDocument, PDFTextField, PDFCheckBox  } = require('pdf-lib');


const mainController = {
    index: async function(req, res) {
        const pdfName = 'pdfPocosDatosTexts.pdf';
        // const pdfName = 'i360ConBotonSend.pdf';
        const data = "Hello, world!\nSave changes and see the PDF's key-values here!";

        return res.status(200).render('home', { pdfName, data });    
    },

    processData: async function(req, res) {
        // console.log("Entre");
        pdfName = 'g-28_unlocked.pdf';
        const version = "v-3";
        const fields = req.body;

        let fileData = [];

        fields.forEach(field => {
            fieldName = field.fieldName;
            fieldValue = field.fieldValue ? field.fieldValue : 'Empty';

            fileData.push({fieldName: fieldName, fieldValue: fieldValue});
        });

        const pdfToSend = {
            fileName: pdfName,
            version: version,
            fileData: fileData
        };

        return res.status(200).send(pdfToSend);
        // return res.status(200).render('home', { pdfName, data });    
    },

    savePdfFile: async function(req, res) {
        console.log("PDF Guardado en la carpeta 'outputEditedPDFS'!");

        

        return res.status(200).send("PDF Guardado en la carpeta 'outputEditedPDFS'!");
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