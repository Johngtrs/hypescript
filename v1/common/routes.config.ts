import express from "express";

export abstract class RoutesConfig {
    protected app: express.Application;
    protected name: string;
    protected static version: string = "/v1";

    public constructor(app: express.Application, name: string) {
        this.app = app;
        this.name = name;
        this.configureRoutes();
    }

    public getApp() {
        return this.app;
    }

    public getName() {
        return this.name;
    }

    protected abstract configureRoutes(): express.Application;
}