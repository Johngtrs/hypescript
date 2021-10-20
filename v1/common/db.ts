import mysql from "mysql2"
import { Pool } from "mysql2/promise";

export class DatabaseConfig {
    private promisePool: Pool;
    private static instance: DatabaseConfig;

    private constructor() {
        const pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        this.promisePool = pool.promise();
    }

    public static getInstance(): DatabaseConfig{
        if (!this.instance) {
            this.instance = new DatabaseConfig();
        }
        return this.instance;
    }

    public db(): Pool {
        return this.promisePool;
    }
}