import express from "express";
import MovieService from "../services/movie.service";
import debug from "debug";

const log: debug.IDebugger = debug('app:movie-controller');
class MovieController {
    public async getListMovies(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const movies = await MovieService.list();
            res.status(200).json(movies);
        } catch (err) {
              if (err) next(err);
        }
    }

    public async getMovieById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const movie = await MovieService.readById(req.params.id);
            res.status(200).json(movie);
        } catch (err) {
              if (err) next(err);
        }
    }

    public async getTop100(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const movies = await MovieService.top100(req.params.year);
            res.status(200).json(movies);
        } catch (err) {
              if (err) next(err);
        }
    }

    public async getMostRented(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const movie = await MovieService.mostRented(req.params.year);
            res.status(200).json(movie);
        } catch (err) {
              if (err) next(err);
        }
    }

    public async getBestAuthor(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const author = await MovieService.bestAuthor();
            res.status(200).json(author);
        } catch (err) {
              if (err) next(err);
        }
    }

    public async getMovieByTitle(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const author = await MovieService.readByTitle(req.params.title);
            res.status(200).json(author);
        } catch (err) {
              if (err) next(err);
        }
    }

    public async createMovie(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const movieId = await MovieService.create(req.body);
            res.status(200).json({movieId: movieId});
        } catch (err) {
              if (err) next(err);
        }
    }

    public async incrementRentedNumber(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            await MovieService.incrementRentedNumber(req.body.title, req.body.year);
            res.status(200).json({message: "Rented number updated"});
        } catch (err) {
              if (err) next(err);
        }
    }
}

export default new MovieController();