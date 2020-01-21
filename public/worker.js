var document = { 'createElementNS': function () { return {} } };
var window = this;
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.62/pdfmake.min.js', 'vfs_fonts.js');

pdfMake.vfs = vfs;

pdfMake.fonts = {
    ...pdfMake.fonts,
    IPAgothic: {
        normal: 'ipagp.ttf',
        bold: 'ipagp.ttf',
        italics: 'ipagp.ttf',
        bolditalics: 'ipagp.ttf'
    },
    IPAmincho: {
        normal: 'ipamp.ttf',
        bold: 'ipamp.ttf',
        italics: 'ipamp.ttf',
        bolditalics: 'ipamp.ttf'
    }
}

pdfMake.tableLayouts = {
    exampleLayout: {
      hLineWidth: function (i, node) {
        if (i === 0 || i === node.table.body.length) {
          return 0;
        }
        return (i === node.table.headerRows) ? 2 : 1;
      },
      vLineWidth: function (i) {
        return 0;
      },
      hLineColor: function (i) {
        return i === 1 ? 'black' : '#aaa';
      },
      paddingLeft: function (i) {
        return i === 0 ? 0 : 8;
      },
      paddingRight: function (i, node) {
        return (i === node.table.widths.length - 1) ? 0 : 8;
      }
    }
  };

self.addEventListener("message", () => {
    const docDefinition = {
        content: [
            { text: '交通費請求票', style: 'header' },
            { text: ' 2019年2月1日 ', style: "date" },
        ],
        styles: {
            header: {
                fontSize: 22,
                alignment: "center"
            },
            date: {
                decoration: "underline"
            },
            right: {
                decoration: "underline",
                alignment: "right"
            }
        },
        defaultStyle: {
            font: "IPAgothic"
        }
    }

    pdfMake.createPdf(docDefinition).getBlob((blob) => {
        self.postMessage(blob)
    });
})
