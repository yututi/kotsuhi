var document = { 'createElementNS': function(){ return {} } };
var window = this;
importScripts( 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/pdfmake.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/vfs_fonts.js' );

self.addEventListener("message", () => {
    console.log("start")
    const docDefinition = {
        content: [
            { text: 'Tables', style: 'header' }
        ]
    }

    pdfMake.createPdf(docDefinition).getBlob((blob)=>{
        self.postMessage(blob)
    });
})

