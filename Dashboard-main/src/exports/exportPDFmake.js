export const exportToPDFmake = (questions) => {
  if (!window.pdfMake) {
    alert("pdfMake not loaded. Please check your internet or script tag.");
    return;
  }

  const docDefinition = {
    content: [
      { text: 'Interview / OA Questions', style: 'header' },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*'],
          body: [
            ['Link', 'Type', 'Topic', 'Difficulty'],
            ...questions.map(q => [
              {
                text: q.link,
                link: q.link?.startsWith("http") ? q.link : undefined,
                color: 'blue',
                decoration: 'underline'
              },
              q.type || '',
              q.topic || '',
              q.difficulty || ''
            ])
          ]
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      }
    }
  };

  window.pdfMake.createPdf(docDefinition).download("questions_report.pdf");
};
