import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  private fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private fileExtension = '.xlsx';
  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    
    const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const myworkbook: XLSX.WorkBook = { Sheets: { 'data': myworksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_exported'+ EXCEL_EXTENSION);
  }
  public exportExcel(dataToBeExported: Array<any>, fileName: string) {
    const sheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToBeExported),
        workbook: XLSX.WorkBook = { Sheets: { 'Plan Information': sheet }, SheetNames: ['Plan Information'] },
        excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveExcelFile(excelBuffer, fileName);
}

private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: this.fileType});
    FileSaver.saveAs(data, `${fileName}${this.fileExtension}`);
}
}
