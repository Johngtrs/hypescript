import express from "express";

export class Tools {

  // trim all string prpoerties of an object
  public static trimStringProperties(obj: object): typeof obj {
    if(obj !== null) for(let prop in obj) {
      // @ts-ignore
      if(typeof obj[prop] === "string") {
        // @ts-ignore
        obj[prop] = obj[prop].trim();
      }
    }
    return obj;
  }

  // trimRequest middleware: trim all request object: body, params, query
  public static trimAll(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.body) {
      this.trimStringProperties(req.body);
    }
    if (req.params) {
      this.trimStringProperties(req.params);
    }
    if (req.query) {
      this.trimStringProperties(req.query);
    }
    next();
  }

  // trimBody middleware: trim only the body object
  public static trimBody(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.body) {
      this.trimStringProperties(req.body);
    }
    next();
  }

  public static TrimParam(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.params) {
      this.trimStringProperties(req.params);
    }
    next();
  }

  public static trimQuery(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.query) {
      this.trimStringProperties(req.query);
    }
    next();
  }

    // Check empty object
    public static isEmpty(obj: Object) {
      return Object.keys(obj).length === 0;
    }
}