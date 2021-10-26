import { CreateMovieDTO } from "../dtos/create.movie.dto";
import { MovieDTO } from "../dtos/movie.dto";
import { DatabaseConfig } from "../../common/db"
import debug from "debug";
import { HttpError } from "../../common/http.error";
import * as mysql from 'mysql2/promise';

const log: debug.IDebugger = debug('app:movie-dao');
const db = DatabaseConfig.getInstance().db();

class MovieDAO {
    
    public constructor() {
        log('new MovieDAO created');
    }

    public async getMovies() {
        const [rows] = await db.query<MovieDTO[]>("SELECT * FROM movie");
        return rows;
    }

    public async getMovieById(id: string) {
       const [rows] = await db.query<MovieDTO[]>("SELECT * FROM movie WHERE id=?", id);
        if (!rows[0]) {
            throw new HttpError(404, "Movie not found");
        }
        return rows[0];
    }

    private async mostRented(year: string, cols: string = "*", limit: number = 1): Promise<string | MovieDTO | MovieDTO[]>  {
        let rows: MovieDTO[];
        if (year) {
            const select = "SELECT " + cols + " FROM movie WHERE year=? ORDER BY rent_number DESC LIMIT " + limit;
            [rows] = await db.query<MovieDTO[]>(select, year);
        } else {
            const select = "SELECT " + cols + " FROM movie ORDER BY rent_number DESC LIMIT " + limit;
            [rows] = await db.query<MovieDTO[]>(select);
        }
        return limit > 1 ? rows : rows[0];
    }

    public async getTop100(year: string) {
        return await this.mostRented(year, "*", 100);
    }

    public async getMostRented(year: string) {
        return await this.mostRented(year);
    }

    public async getBestAuthor() {
        return await this.mostRented("", "author as author");
    }

    public async getMovieByTitle(title: string) {
        const [rows] = await db.query<MovieDTO[]>("SELECT * FROM movie WHERE title LIKE ?", "%" + title + "%");
        return rows;
    }

    public async addMovie(movie: CreateMovieDTO) {
        const insert = "INSERT INTO movie(`year`, `rent_number`, `title`, `author`, `editor`, `index`, `bib`, `ref`, `cat_1`, `cat_2`) " + 
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        console.log(movie);
        const binds = [
            movie.year, movie.rent_number, movie.title, 
            movie.author, movie.editor, movie.index, 
            movie.bib, movie.ref, movie.cat1, movie.cat2
        ];

        const [newMovie] = await db.query<mysql.ResultSetHeader>(insert, binds);
        return newMovie.insertId;
    }

    public async incrementRentedNumber(title: string, year: string) {  
        // Check if the movie exists
        const select = "SELECT COUNT(*) AS total FROM movie WHERE title=? AND year=?";
        const [rows] = await db.query<mysql.RowDataPacket[]>(select, [title, year]);
        if (rows[0].total < 1) {
            throw new HttpError(404, "Movie not found");
        }
    
        const update = "UPDATE movie SET rent_number = rent_number + 1 WHERE title=? AND year=?";
        await db.query<mysql.ResultSetHeader>(update, [title, year]);
    }
}

export default new MovieDAO();