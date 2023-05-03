
const submitButton = document.getElementById("button_id");

submitButton.addEventListener("click", function() {
    console.log("Click!")
    // Assuming the iframe has an ID of "pdfIframe"
    const iframe = document.getElementById("pdfIframe");
    const pdfContent = iframe.contentWindow.document.body.innerHTML;

    // Convert the content to a Blob object
    const blob = new Blob([pdfContent], { type: 'application/pdf' });

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
});

