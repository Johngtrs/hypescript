import debug from "debug";
import express from "express";
import { Tools } from "../../../tools";
const validator = require("validator");

interface MovieRulesValidation {
    required: boolean;
    type: string;
    field: string;
    minLength: number;
    maxLength: number;
}

const log: debug.IDebugger = debug('app:movie-middleware');
class MovieMiddleware {
    public postValidation = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const rules: MovieRulesValidation[] = [
            { required: true, type: "int", field: "year", minLength: 4, maxLength: 4 },
            { required: true, type: "int", field: "rent_number", minLength: 1, maxLength: 11 },
            { required: true, type: "string", field: "title", minLength: 1, maxLength: 255 },
            { required: true, type: "string", field: "author", minLength: 1, maxLength: 80 },
            { required: true, type: "string", field: "editor", minLength: 1, maxLength: 125 },
            { required: true, type: "string", field: "index", minLength: 1, maxLength: 125 },
            { required: true, type: "string", field: "bib", minLength: 1, maxLength: 20 },
            { required: true, type: "string", field: "ref", minLength: 1, maxLength: 20 },
            { required: true, type: "string", field: "cat1", minLength: 1, maxLength: 20 },
            { required: true, type: "string", field: "cat2", minLength: 1, maxLength: 10 }
        ];

        let errors: Record<string, string[]> = {};
        for (let rule of rules) {
            const messages: string[] = this.rulesValidation(rule, req);
            if (!Tools.isEmpty(messages)) {
                errors[rule.field] = messages;
            }
        }

        if (!Tools.isEmpty(errors)) {
            return res.status(400).send({ errors: errors });
        }

        next();
    }

    public patchRentedNumberValidation = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (!req.body || !req.body.title || !req.body.year) {
            return res.status(400).send({ errors: ["Fields title and year are required"] });
        }

        next();
    }

    private rulesValidation(rule: MovieRulesValidation, req: express.Request): string[] {
        let messages: string[] = [];
        const param = String(req.body[rule.field]);

        // Required validation
        if (rule.required && !req.body[rule.field]) {
            messages.push("This parameter is required");
        } else {
            // Int validation
            if (rule.type == "int") {
                if (!validator.isInt(param)) {
                    messages.push("Invalid int");
                }
            }

            // length validation
            if (!validator.isLength(param, { min: rule.minLength, max: rule.maxLength })) {
                if (rule.minLength == rule.maxLength) {
                    messages.push("Must be " + rule.maxLength + " digits");
                } else if (rule.minLength > 1) {
                    messages.push("Length between " + rule.minLength + " and " + rule.maxLength + " characters");
                } else {
                    messages.push(rule.maxLength + " characters maxmimum");
                }
            }
        }
        
        return messages;
    }
}

export default new MovieMiddleware();