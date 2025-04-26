import pkg, { QueryResultRow } from "pg";

const { Pool } = pkg;

const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

const pool = new Pool({
  connectionString: connectionString,
  ssl: true,
});

export function query<T extends QueryResultRow>(
  text: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any[]
): Promise<pkg.QueryResult<T>> {
  return pool.query(text, params);
}

export function end() {
  return pool.end();
}
