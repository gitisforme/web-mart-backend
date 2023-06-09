import { createConnection, Connection } from "typeorm";

import postgreTypeormConfig from "../config/postgreTypeorm";

export default class Database {
  static #instance: Database;

  #connection?: Connection;
  // #mongoConnection?: Connection;

  constructor() {
    if (Database.#instance instanceof Database) {
      return Database.#instance;
    }

    Database.#instance = this;
  }

  get connection(): Connection | undefined {
    return this.#connection;
  }

  // TODO: MongoDB and Postgres connection.
  async connect(): Promise<Connection> {
    [this.#connection] = await Promise.all([
      createConnection(postgreTypeormConfig),
    ]);
    return this.#connection;
  }

  async disConnect(): Promise<void> {
    if (this.#connection) {
      await this.#connection.close();
    }
  }
}
