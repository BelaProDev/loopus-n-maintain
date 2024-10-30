import pdfMake from 'pdfmake-browser';
import { TDocumentDefinitions } from 'pdfmake-browser';

const generatePDF = (documentDefinition: TDocumentDefinitions) => {
  return new Promise((resolve, reject) => {
    pdfMake.createPdf(documentDefinition).getBase64((data) => {
      if (data) {
        resolve(data);
      } else {
        reject(new Error('Failed to generate PDF'));
      }
    });
  });
};

export { generatePDF };
