const { PDFDocument } = PDFLib;
// Load the PDF.js library
const pdfjsLib = window['pdfjs-dist/build/pdf'];

let pdfDoc;

async function loadPdf() {
	// Fetch an existing PDF document.
	const url = '/outputPdfs/pdfPocosDatosTexts.pdf';
	const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

	// Load a `PDFDocument` from the existing PDF bytes.
	return PDFDocument.load(existingPdfBytes);
}

async function saveAndRender(doc) {
	// Serialize the `PDFDocument` to bytes (a `Uint8Array`).
	const pdfBytes = await doc.save();

	const pdfDataUri = await doc.saveAsBase64({ dataUri: true });
	document.getElementById('pdf').src = pdfDataUri;
}



loadPdf().then((doc) => {
    pdfDoc = doc;
    return saveAndRender(pdfDoc);
})

const submitBtn = document.getElementById("submitBtn");


submitBtn.addEventListener("click", async function() {
    console.log("Save Click");
    const iframe = document.getElementById('pdf');

    const iframeContent = iframe.contentDocument || iframe.contentWindow.document;
    const pdfData = iframeContent.body.innerHTML;
    
    // const iframeDoc = iframe.contentDocument;
    // const pdfData = await iframeDoc.body.innerHTML;
    
    
    console.log(pdfData)

    const pdfDocWithChanges = await PDFDocument.load(pdfData, { ignoreEncryption: true });
    const form = pdfDocWithChanges.getForm();
    const values = form.getValues();

    console.log(values);

    // const fields = {};      
    // const formFields = this.pdfDoc.getForm().getFields();
    // console.log(formFields)
    // for (const field of formFields) {
    //     //console.log(field)
    //     fields[field.getName()] = field.getValue();
    // }
    // this.fields = fields;
    //this.sendFields(fields);



    // // Get the <embed> element by ID
    // const embed = document.getElementById('pdf');

    // // Get the URL of the PDF file from the src attribute of the <embed> element
    // const url = embed.getAttribute('src');

    // // Load the PDF document using PDF.js
    // const loadingTask = pdfjsLib.getDocument(url);
    // loadingTask.promise.then((pdfDoc) => {
    // // Do something with the PDF document
    //     console.log(pdfDoc)
    // });

});
