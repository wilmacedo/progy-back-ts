import { Response } from 'express';
import PdfPrinter from 'pdfmake';
import {
  TDocumentDefinitions,
  TFontDictionary,
  DynamicContent,
  Content,
} from 'pdfmake/interfaces';
import { formatDate } from '../../../utils/index';

export class Report {
  name: string;
  printer: PdfPrinter;
  filterName: string;

  constructor(name: string, filterName: string) {
    this.name = name;
    this.printer = new PdfPrinter(this.fonts);
    this.filterName = filterName;
  }

  get fonts(): TFontDictionary {
    return {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };
  }

  footer: DynamicContent = (currentPage, pageCount) => {
    return {
      margin: [10, 0, 10, 0],
      height: 30,
      columns: [
        { alignment: 'left', text: `Gerado em ${formatDate(new Date())}` },
        {
          alignment: 'right',
          text: [
            { text: currentPage.toString(), italics: true },
            ' de ',
            { text: pageCount.toString(), italics: true },
          ],
        },
      ],
    };
  };

  get definitions(): TDocumentDefinitions {
    return {
      defaultStyle: { font: 'Helvetica' },
      content: [],
      footer: this.footer,
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
        },
        tableHeader: {
          bold: true,
          alignment: 'center',
        },
        tableItem: {
          fontSize: 10,
        },
        tableItemCenter: {
          fontSize: 10,
          alignment: 'center',
        },
      },
    };
  }

  generateHeaders(headers: string[]) {
    return headers.map(header => ({ text: header, style: 'tableHeader' }));
  }

  async createBuffer(document: PDFKit.PDFDocument) {
    return new Promise((resolve, reject) => {
      try {
        const chunks: Uint8Array[] = [];

        document.on('data', chunk => chunks.push(chunk));
        document.on('end', () => resolve(Buffer.concat(chunks)));
        document.end();
      } catch (e) {
        reject(e);
      }
    });
  }

  createHeader() {
    const header: Content = [];

    header.push({
      text: [`Relatório das ${this.name} `, '\n\n'],
      style: 'header',
      alignment: 'center',
    });

    header.push([
      {
        text: `Unidade: ${this.filterName}`,
        alignment: 'center',
      },
    ]);

    return header;
  }

  async createBody(): Promise<Content[]> {
    return [];
  }

  async generate(response: Response) {
    const header = this.createHeader();
    const body = await this.createBody();

    const definitions = this.definitions;
    definitions.content = [...header, ...body];

    const document = this.printer.createPdfKitDocument(definitions);
    const buffer = await this.createBuffer(document);

    response.contentType('application/pdf').send(buffer);
  }
}
