import postgres from 'postgres';

// A single connection shared across the whole application
const globalForPostgres = globalThis as unknown as {
  sql: postgres.Sql<{}> | undefined;
};

// If the connection is already in the global object, use it. Otherwise, create a new one and add it to the global object. This is to prevent creating multiple connections in development when the module is reloaded
export const sql = globalForPostgres.sql ?? postgres(process.env.POSTGRES_URL!, { 
  ssl: 'require',
  max: 10, // Set a maximum of 10 connections in the pool
});

if (process.env.NODE_ENV !== 'production') globalForPostgres.sql = sql;