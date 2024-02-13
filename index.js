const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgress://localhost/acme_ice_cream_db');


const init = async()=> {
    await client.connect();
    console.log('connected to database');
    let SQL = `
        DROP TABLE IF EXISTS notes;
        CREATE TABLE notes(
            id SERIAL PRIMARY KEY,
            txt VARCHAR(100),
            ranking INTEGER DEFAULT 5,
            created_at TIMESTAMP DEFAULT now()
        );
    `;
    await client.query(SQL);
    console.log('tables created');
    SQL = `
        INSERT INTO notes(txt) VALUES ('learn SQL');
        INSERT INTO notes(txt, ranking) VALUES ('learn Express', 10);
        INSERT INTO notes(txt, ranking) VALUES ('learn to bake a cake', 1);
    `;
    await client.query(SQL);
    console.log('data seeded');
    
};

init();