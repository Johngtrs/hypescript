import { RoutesConfig } from "../common/routes.config";
import express from "express";
import movieController from "./controllers/movie.controller";
import movieMiddleware from "./middlewares/movie.middleware";

export class MovieRoutesV1 extends RoutesConfig {
    public constructor(app: express.Application) {
        super(app, "MoviesRoutesV1");
    }

    protected configureRoutes(): express.Application {
        this.app.route(RoutesConfig.version + "/movies")
            .get(movieController.getListMovies)
            .post(movieMiddleware.postValidation, movieController.createMovie);

        this.app.route(RoutesConfig.version + "/movies/top100")
            .get(movieController.getTop100);

        this.app.route(RoutesConfig.version + "/movies/top100/:year")
            .get(movieController.getTop100);

        this.app.route(RoutesConfig.version + "/movies/most_rented")
            .get(movieController.getMostRented);

        this.app.route(RoutesConfig.version + "/movies/most_rented/:year")
            .get(movieController.getMostRented);

        this.app.route(RoutesConfig.version + "/movies/best_author")
            .get(movieController.getBestAuthor);
        
        this.app.route(RoutesConfig.version + "/movies/search/:title")
            .get(movieController.getMovieByTitle);

        this.app.route(RoutesConfig.version + "/movies/:id")
            .get(movieController.getMovieById);

        this.app.route(RoutesConfig.version + "/movies/increment_rented")
            .patch(movieMiddleware.patchRentedNumberValidation, movieController.incrementRentedNumber);
            
        return this.app;
    }
}