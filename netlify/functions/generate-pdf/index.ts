import { Handler } from '@netlify/functions';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import { Invoice } from '../../../src/types/business';

const generateHTML = (invoice: Invoice) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.number}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { font-size: 24px; color: #2563eb; margin-bottom: 20px; }
        .info { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
        th { background: #f8f9fa; }
        .total { text-align: right; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">INVOICE</div>
      <div class="info">
        <p>Invoice Number: ${invoice.number}</p>
        <p>Date: ${new Date(invoice.date).toLocaleDateString()}</p>
        <p>Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>VAT Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>€${item.unitPrice.toFixed(2)}</td>
              <td>${item.vatRate}%</td>
              <td>€${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="total">
        <p>Subtotal (excl. VAT): €${(invoice.totalAmount - invoice.tax).toFixed(2)}</p>
        <p>VAT (21%): €${invoice.tax.toFixed(2)}</p>
        <p><strong>Total Amount (incl. VAT): €${invoice.totalAmount.toFixed(2)}</strong></p>
      </div>
    </body>
  </html>
`;

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const invoice: Invoice = JSON.parse(event.body || '');
    const html = generateHTML(invoice);

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.number}.pdf"`
      },
      body: pdf.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('PDF generation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate PDF' })
    };
  }
};

export { handler };