const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgress://localhost/acme_ice_cream_db');
const express = require('express');
const app = express();
const path = require('path');
console.log(__dirname);

app.get('/', (req, res, next)=> {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/notes', async(req, res, next)=> {
    try {
    const SQL = `
        SELECT *
        FROM notes
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
    }
    catch(ex){
        next(ex);
    }
});

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
    
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
    
};

init();