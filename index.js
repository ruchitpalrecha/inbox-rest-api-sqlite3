
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const Joi = require('joi');
const sqlite3 = require('sqlite3');

app.use(bodyParser.urlencoded({ extended: true }));
// let db = new sqlite3.Database('inbox.db', (err) => {
//     if(err) {
//         console.log(err.message);
//     } else {
//         console.log('Connected to inbox.db');
//     }
// });

app.get('/', (req, res) => {
    res.send('Welcome to Inbox!');
})

app.get('/employees', (req, res) => {
    if(req.query.department) {
        db.all('SELECT * FROM Employees WHERE Department = ?', [req.query.department], (err, rows) => {
            if(err) {
                res.send(err.message);
            } else {
                console.log('Finding employees in department: ' + req.query.department);
                res.json(rows);
            }
        });
    }
    else if(req.query.location) {
        db.all('SELECT * FROM Employees WHERE Location = ?', [req.query.location], (err, rows) => {
            if(err) {
                res.send(err.message);
            } else {
                console.log('Finding employees in location: ' + req.query.location);
                res.json(rows);
            }
        });
    }
    else if(req.query.education) {
        db.all('SELECT * FROM Employees WHERE Education = ?', [req.query.education], (err, rows) => {
            if(err) {
                res.send(err.message);
            } else {
                console.log('Finding Employees with education: ' + req.query.education);
                res.json(rows);
            }
        })
    }
    else {
        db.all('SELECT * FROM Employees', (err, rows) => {
            if(err) {
                console.log(err.message);
            } else {
                res.json(rows);
            }
        });
    }
});

app.get('/employees/:id', (req, res) => {
    console.log('Finding employees with id: ' + req.params.id);
    db.get('SELECT * FROM Employees WHERE id = ?', [req.params.id], (err, row) => {
        if(err) {
            res.send(err.message);
        } else {
            res.json(row);
        }
    });
});

app.post('/employees', (req, res) => {
    const schema = {
        id: Joi.number().integer().required(),
        firstName: Joi.string().min(3),
        lastName: Joi.string().min(3),
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        department: Joi.string().min(3),
        location: Joi.string().min(3),
        education: Joi.string()
    };

    const result = Joi.validate(req.body, schema);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    console.log(`Adding new employee: ${req.body.firstName} ${req.body.lastName}`);
    db.run('INSERT INTO Employees VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.body.id, req.body.firstName, req.body.lastName, req.body.email,
        req.body.department, req.body.location, req.body.education],
    (err) => {
        if(err) {
            res.send(err.message);
        } else {
            res.send(`Added new employee with id: ${req.body.id}`);
        }
    });
});

app.delete('/employees/:id', (req, res) => {
    console.log(`Removing employee with id ${req.params.id}`);
    db.run('DELETE FROM Employees WHERE id = ?', [req.params.id], (err) => {
        if(err) {
            console.log(err.message);
        } else {
            res.send(`Employee with id ${req.params.id} deleted`);
        }
    });
});

app.listen(PORT, () => {
    console.log('Listening on Port: ' + PORT);
});
