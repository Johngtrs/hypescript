import MovieDAO from "../daos/movie.dao";
import { CreateMovieDTO } from "../dtos/create.movie.dto";
import debug from 'debug';

const log: debug.IDebugger = debug('app:movie-service');
class MovieService {
    public async list() {
        return MovieDAO.getMovies();
    }

    public async readById(id: string) {
        return MovieDAO.getMovieById(id);
    }

    public async top100(year: string) {
        return MovieDAO.getTop100(year);
    }

    public async mostRented(year: string) {
        return MovieDAO.getMostRented(year);
    }

    public async bestAuthor() {
        return MovieDAO.getBestAuthor();
    }

    public async readByTitle(title: string) {
        return MovieDAO.getMovieByTitle(title);
    }

    public async create(movie: CreateMovieDTO) {
        return MovieDAO.addMovie(movie);
    }

    public async incrementRentedNumber(title: string, year: string) {
        return MovieDAO.incrementRentedNumber(title, year);
    }
}

export default new MovieService();