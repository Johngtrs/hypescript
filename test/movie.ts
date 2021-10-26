require("dotenv").config();
import chai from 'chai';
import chaiHttp from 'chai-http';
import Movie from '../v1/movies/daos/movie.dao';

chai.should();
chai.use(chaiHttp);
declare var process: {
  env: {
    API_KEY: string,
    NODE_DOCKER_PORT: string
  }
}

const baseUrl: string = `http://localhost:${process.env.NODE_DOCKER_PORT}`;
const apiVersion: string = "/v1";
const randomChars = [
  "!rf!zerpoijè_çà)=ep^$ùk", "'fshifsj$^ù*'ééùééù*ù*_-èù_ù*-èçè-çè-ç-",
  877899797979446351513156416417147514754751571, "⛄️ 🌬 💨 💧 💦 ☔️ ☂️ 🌊",
  "♠ ♣ ♥ ♦ ← ↑ ‍ → ↓ ↔ « » ‹ › ◊ ¡ ¿ € £ ¤ ¥ ¢ ‰ ¶ “ ” „ ‌ ¦ ‡ † § © ™ ® ¹ ² ³ ¼ ½ ¾ Δ Ω α β π µ ð ∂ ∏ ∑ ƒ",
  "👁 👄 👁 ", "😏 😀 😃 😄 😁 😆 😅 😂 🤣 🥲", "                 "
];

// /movies
describe(`GET ${apiVersion}/movies`, () => {
  it('it should GET all the movies', (done) => {
    chai.request(baseUrl)
      .get(`${apiVersion}/movies`)
      .set("Authorization", process.env.API_KEY)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });

  it('it should return unauthorized', (done) => {
    chai.request(baseUrl)
      .get(`${apiVersion}/movies`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.an('object');
        res.body.should.have.property("error", "Unauthorized");
        done();
      });
  });
});

// /movies/:id
describe(`GET ${apiVersion}/movies/:id`, () => {
  it('it should GET a movie by the given id', (done) => {
    let movie = Movie.addMovie({
      year: 2018, rent_number: 50, title: "Bienvenue chez John",
      author: "Noname", editor: "Super editeur", index: "P BIEN",
      bib: "CABANIS", ref: "2021", cat1: "P BIEN", cat2: "DVDFIC"
    });

    movie.then((id) => {
      chai.request(baseUrl)
        .get(`${apiVersion}/movies/${id}`)
        .set("Authorization", process.env.API_KEY)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property("id").eql(id);
          res.body.should.have.property("year");
          res.body.should.have.property("rent_number");
          res.body.should.have.property("title");
          res.body.should.have.property("editor");
          res.body.should.have.property("index");
          res.body.should.have.property("bib");
          res.body.should.have.property("ref");
          res.body.should.have.property("cat_1");
          res.body.should.have.property("cat_2");
          done();
        });
    });
  });

  it('it should return 404 error', (done) => {
    chai.request(baseUrl)
      .get(`${apiVersion}/movies/0`)
      .set("Authorization", process.env.API_KEY)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object');
        res.body.should.have.property("error", "Movie not found");
        done();
      });
  });
});

// /movies/top100/:year
describe(`GET ${apiVersion}/movies/top100/:year`, () => {
  it('it should GET top100 of the 2018 year', (done) => {
    let year = 2018;
    chai.request(baseUrl)
      .get(`${apiVersion}/movies/top100/${year}`)
      .set("Authorization", process.env.API_KEY)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array').that.have.lengthOf(100);

        for (let movie of res.body) {
          movie.should.have.property("id");
          movie.should.have.property("year", year);
          movie.should.have.property("rent_number");
          movie.should.have.property("title");
          movie.should.have.property("editor");
          movie.should.have.property("index");
          movie.should.have.property("bib");
          movie.should.have.property("ref");
          movie.should.have.property("cat_1");
          movie.should.have.property("cat_2");
        }

        done();
      });
  });

  it('it should return 200 with empty array', (done) => {
    // Looping random chars just for test
    for (let i = 0; i < randomChars.length; i++) {
      chai.request(baseUrl)
        .get(encodeURI(`${apiVersion}/movies/top100/${randomChars[i]}`))
        .set("Authorization", process.env.API_KEY)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array').that.is.empty;
          if (i === randomChars.length - 1) {
            done();
          }
        });
    }
  });
});

describe('/POST movies', () => {
  it('it should POST a movie', (done) => {
    let movie = {
      year: 2018, rent_number: 50, title: "Bienvenue chez John",
      author: "Noname", editor: "Super editeur", index: "P BIEN",
      bib: "CABANIS", ref: "2021", cat1: "P BIEN", cat2: "DVDFIC"
    };

    chai.request(baseUrl)
    .post(`${apiVersion}/movies`)
    .set("Authorization", process.env.API_KEY)
    .send(movie)
    .end((err, res) => {
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('movieId').to.be.a('number');
      done();
    });
  });
});

/* To be continued... */