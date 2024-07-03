import mysql, { QueryResult } from "mysql2";
import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";

export class DatabaseService {
  static connection: mysql.Connection;
  static pool: mysql.Pool;

  static async connect() {
    // Define the database connection parameters
    const dbParams: mysql.PoolOptions = {
      host: process.env.DB_HOST!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      port: 3306,

      waitForConnections: true,
    };

    // Create a MySQL connection
    this.pool = mysql
      .createPool(dbParams)
      .on("connection", (connection: mysql.Connection) => {
        console.log("DB Connected to: " + { connection });
      })
      .on("release", (connection: mysql.Connection) => {
        console.log("Connection released");
      })
      .on("error", (connection: mysql.Connection) => {
        console.error("DB Error: " + { connection });
        this.pool.end();
      });
  }

  static async execute(
    query: mysql.QueryOptions
  ): Promise<Query | QueryResult> {
    return new Promise((resolve, reject) => {
      this.connect();
      this.pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }

        connection.config.queryFormat = function (query, values) {
          if (!values) return query;
          return query.replace(
            /\:(\w+)/g,
            function (txt: any, key: any) {
              if (values.hasOwnProperty(key)) {
                return connection.escape(values[key]);
              }
              return txt;
            }.bind(this)
          );
        };

        connection.query(query, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
          connection.release();
        });
      });
    });
  }

  static async disconnect() {
    // Close the database connection
    this.connection.end();
    this.connection.destroy();
    console.log("Disconnected from database");
  }
}
