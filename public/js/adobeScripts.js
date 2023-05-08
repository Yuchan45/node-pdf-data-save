const pdfjsLib = window['pdfjs-dist/build/pdf'];

const responseTxt = document.getElementById("response-text");


async function getPDFKeyValues(arrayBuffer) {
    // Cargar el PDF usando PDF.js
    pdfjsLib.getDocument({data: arrayBuffer}).promise.then(function(pdf) {
        let pdfValues = [];
        const numPaginas = pdf.numPages;
        // Cargar cada página y extraer los campos de formulario

        for (let i = 1; i <= numPaginas; i++) {
            pdf.getPage(i).then(function(pagina) {
                pagina.getAnnotations().then(function(annotations) {
                    for (let j = 0; j < annotations.length; j++) {
                        let annotation = annotations[j];
                        if (annotation.fieldType && annotation.fieldType === 'Tx') {
                            let fieldName = annotation.fieldName;
                            let fieldValue = annotation.fieldValue;
                            // console.log(fieldName + ': ' + fieldValue);
                            pdfValues.push({fieldName: fieldName, fieldValue: fieldValue});
                        }
                    }
                });
            });
        }
        // console.log("PDF Fields Content: ");
        console.log("padfValues: ", pdfValues);
        return pdfValues;
    });

};


document.addEventListener("adobe_dc_view_sdk.ready", function() {
    const pdfName = 'pdfPocosDatosTexts.pdf';

    // const miApiKey = 45fc1d368d724aadb79e26afe3fcbd32;
    // const ApiKeyMati = 5da6731fa7134ae481916d27d363d44;
    var adobeDCView = new AdobeDC.View({clientId: "45fc1d368d724aadb79e26afe3fcbd32", divId: "adobe-dc-view"});
    adobeDCView.previewFile({
        content: {location: {url: "/outputPdfs/" + pdfName}},
        metaData: {
            fileName: pdfName,
            hasReadOnlyAccess: false
        }
    },
    {
        embedMode: "FULL_WINDOW",
        showAnnotationTools: false,
        showDownloadPDF: true,
        showPrintPDF: true,
        enableFormFilling: true,
        showAnnotationTools: true
    });

    /* Options to control save behavior */
    const saveOptions = {
        autoSaveFrequency: 0, // Cada 0s realiza un autosave.
        enableFocusPolling: false,
        showSaveButton: true
    };
     
     /* Register save callback */
    adobeDCView.registerCallback(
        // Este metodo se ejecuta cuando se guarda el pdf.
        AdobeDC.View.Enum.CallbackType.SAVE_API,

        async function(metaData, content, options) {
            /* Add your custom save implementation here...and based on that resolve or reject response in given format */
            const pdfArrayBuffer = content;
            // fs.writeFile('rotateTest.pdf', arrayBuffer);

            const results = await getPDFKeyValues(pdfArrayBuffer);
            console.log("results: ", results);
            
            // const data2 = [
            //     { name: 'John', age: 30 },
            //     { name: 'Jane', age: 25 },
            //     { name: 'Bob', age: 40 }
            //   ];
            // console.log(data2)
            // Send to sv.
            // const url = '/processData';

            // const options = {
            //     headers: {
            //       'Content-Type': 'application/json'
            //     }
            // };

            // // Enviar la petición axios
            // axios.post(url, data2, options)
            //     .then(response => {
            //         console.log(response.data2);
            //     })
            //     .catch(error => {
            //         console.error('Error:', error);
            //     });


            return new Promise((resolve, reject) => {
                resolve({
                    code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
                    data: {
                        /* Updated file metadata after successful save operation */
                        metaData: Object.assign(metaData, {fileName: "updated_" + pdfName})
                    }
                });
            });
        },
        saveOptions
    );
}); 


