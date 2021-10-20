import * as mysql from 'mysql2/promise';

export interface MovieDTO extends mysql.RowDataPacket {
    id: number;
    year: number;
    rent_number: number;
    title: string;
    author: string
    editor: string;
    index: string;
    bib: string;
    ref: string;
    cat1: string;
    cat2: string;
}