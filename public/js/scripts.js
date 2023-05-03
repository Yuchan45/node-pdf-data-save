const submitButton = document.querySelector("#button_id");

submitButton.addEventListener("click", function() {
    console.log("Click!")
    // Assuming the iframe has an ID of "pdfIframe"
    const iframe = document.getElementById("pdfIframe");
    // console.log("iframe", iframe);
    const pdfContent = iframe.contentWindow.document;
    // console.log("pdfContent", pdfContent);
    
    
    // Get the binary data of the PDF content
    pdfContent.addEventListener('load', function() {
        console.log("PDF content loaded!");
        const pdfData = pdfContent.contentDocument.defaultView.PDFViewerApplication.pdfDocument
            .getData()
            .then(function(data) {
            // Create a Blob object with the binary data
            const blob = new Blob([data], { type: 'application/pdf' });

            // Create a FormData object and append the Blob
            const formData = new FormData();
            formData.append('pdf', blob, 'filename.pdf');

            // Send the FormData to the server using fetch()
            fetch('/processData', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Request failed.');
                }
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
            })
    });

});