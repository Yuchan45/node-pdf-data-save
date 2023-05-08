const pdfjsLib = window['pdfjs-dist/build/pdf'];
const responseTxt = document.getElementById("response-text");



async function getPDFKeyValues(arrayBuffer) {
    /**
     * Recibe un arrayBuffer con el contenido del PDF.
     * Retorna un array de objetos con key: 'fieldName' y valor: 'fieldValue'.
     */

    // Cargar el PDF usando PDF.js
    const pdfValues = [];
    const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
    const numPaginas = pdf.numPages;

    // Cargar cada página y extraer los campos de formulario
    await Promise.all(Array.from({length: numPaginas}, (_, i) => i + 1).map(async (i) => {
        const pagina = await pdf.getPage(i);
        const annotations = await pagina.getAnnotations();
        annotations.forEach(function(annotation) {
            if (annotation.fieldType && annotation.fieldType === 'Tx') {
                const fieldName = annotation.fieldName;
                const fieldValue = annotation.fieldValue;
                pdfValues.push({fieldName: fieldName, fieldValue: fieldValue});
            }
        });
    }));
    return pdfValues;
};


async function postData(url, results, fetchOptions) {
    /**
     * Recibe la url a la que postear, los results (data a enviar al sv) y las opciones.
     * Hace envio de los results al servidor. Retorna lo que devuelve el servidor, o el error en su defecto.
     */

    let response;
    try {
      response = await axios.post(url, results, fetchOptions);
    } catch (error) {
        response.error = 'Error:' + error;
      //console.error('Error:', error);
    }
    return response.data ? response.data : response.error;
};


async function showPDFKeyValues(pdfArrayBuffer) {
    /**
     * Recibe un arrayBuffer con el contenido del PDF.
     * Se encarga de procesar los datos del PDF actualizado y mostrar los resultados obtenidos en la pantalla en formato de json.
     */

    const results = await getPDFKeyValues(pdfArrayBuffer);   

    // POST al SV.
    const url = '/processData';
    const fetchOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const processedResults = await postData(url, results, fetchOptions);

    // Print
    responseTxt.innerHTML = JSON.stringify(processedResults, null, 2);
};



document.addEventListener("adobe_dc_view_sdk.ready", function() {
    const pdfName = 'pdfPocosDatosTexts.pdf';

    // const miApiKey = 45fc1d368d724aadb79e26afe3fcbd32;
    // const ApiKeyMati = 5da6731fa7134ae481916d27d363d44;

    var adobeDCView = new AdobeDC.View({clientId: "45fc1d368d724aadb79e26afe3fcbd32", divId: "adobe-dc-view"});
    // Preview PDF.
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
     
    // Register save callback
    adobeDCView.registerCallback(
        // Este metodo se ejecuta cuando se guarda el pdf.
        AdobeDC.View.Enum.CallbackType.SAVE_API,
        async function(metaData, content, options) {
            /* Add your custom save implementation here...and based on that resolve or reject response in given format */
            const pdfArrayBuffer = content;
            // fs.writeFile('rotateTest.pdf', arrayBuffer);
            
            showPDFKeyValues(pdfArrayBuffer);





            // Adobe API success return.
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


