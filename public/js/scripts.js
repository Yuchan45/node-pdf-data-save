function sendPdf() {
    console.log("ENTERED sendPdf");
    // Get a reference to the iframe element
    const iframe = document.getElementById('pdfIframe');

    // Get a reference to the PDF document inside the iframe
    const pdfDoc = iframe.contentDocument || iframe.contentWindow.document;

    // Create a new FileReader object
    const reader = new FileReader();

    // Read the PDF data from the iframe
    reader.readAsArrayBuffer(pdfDoc.fileData);

    // When the reader is done reading the data, send it to the server
    reader.addEventListener('loadend', function() {
        fetch('/processData', {
            method: 'POST',
            body: reader.result
        })
        .then(response => {
            // Handle the response from the server
            console.log('Server response:', response);
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch request
            console.error('Fetch error:', error);
        });
    });
};

// Add a load event listener to the window
window.addEventListener('load', function() {
    // Wait for the iframe to finish loading the PDF
    const iframe = document.getElementById('pdfIframe');
    iframe.addEventListener('load', function() {
        console.log("PDF loaded");
    });

    // Add a click event listener to the button
    document.getElementById("button_id").addEventListener("click", function() {
        // Trigger the form submission by clicking the hidden file input element
        console.log("Button clicked");
        sendPdf();
    });
});
