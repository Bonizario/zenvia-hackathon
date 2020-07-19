const unidecode = require('unidecode');
const fuzzball = require('fuzzball');
const axios = require('axios');
require('dotenv').config();

const api = require('../api');
const db = require('../db');
const getTwoLowers = require('../util_function');
const key = process.env.DISTANCE_MATRIX_API_KEY;

const unidecodeAndClean = str =>
  unidecode(str)
    .trim()
    .replace(/([!*'();:@&=+$,/?%#\[\]])/g, '')
    .toLowerCase();

module.exports = {
  index(req, res) {
    return res.render('index.njk');
  },
  async oferecer(req, res) {
    // Reading values from the request body

    // let {
    //   telefone: telephone,
    //   oferta_procura: objective,
    //   endereco_com_cep: address,
    //   prod_serv_estab: action
    // } = req.body;

    let { telephone, objective, origin, action } = {
      telephone: '34123451234',
      objective: 'Oferecer produto',
      origin: 'Av. da Saudade, 1411, Uberaba, 38061-000',
      action: 'Costuro blusas.',
    };

    telephone = unidecodeAndClean(telephone);
    objective = unidecodeAndClean(objective);
    origin = unidecodeAndClean(origin);
    action = unidecodeAndClean(action);

    // Debug
    // console.log(name, objective, origin, action);
    // destinations.forEach(console.log);

    // Chamada à API do Thales, recebe a tag
    const tag = await axios
      .get(`http://tfreitaz.pythonanywhere.com/classificar/${action}`)
      .then(response => response.data.tag);

    // Inserting values in the database
    const query = `
      INSERT INTO offers (
        telephone,
        objective,
        origin,
        action,
        tag
      ) VALUES (?,?,?,?,?);
    `;
    console.log([telephone, objective, origin, action, tag]);

    db.run(query, [telephone, objective, origin, action, tag], function (err) {
      if (err) {
        return console.error(err.message);
      }

      //console.log(`A row has been inserted with rowid ${this.lastID}`);
      return res.json({ resultado: 'ok' });
    });
  },
  async procurar(req, res) {
    let { telephone, objective, origin, action } = {
      telephone: '34123451234',
      objective: 'Procurar produto',
      origin: 'Rua Araguari, 777, Uberaba',
      action: 'Gostaria de comprar bolos e tortas.',
    };

    telephone = unidecodeAndClean(telephone);
    objective = unidecodeAndClean(objective);
    origin = unidecodeAndClean(origin);
    action = unidecodeAndClean(action);

    // Debug
    // console.log(name, objective, origin, action);
    // destinations.forEach(console.log);

    // Chamada à API do Thales, recebe a tag
    const tag = await axios
      .get(`http://tfreitaz.pythonanywhere.com/classificar/${action}`)
      .then(response => response.data.tag);

    db.all('SELECT * FROM offers', function (err, rows) {
      const addresses = rows.filter(
        row => fuzzball.partial_ratio(row.action, action) > 80
      );

      // console.log('Endereços do banco de dados', addresses);
      if (addresses.length === 0) {
        // Chamada à API do Google
        let query = `
          SELECT *
          FROM offers
          WHERE tag=?
        `;
        let destinations = [];
        db.all(query, [tag], async function (err, rows) {
          if (err) {
            return console.error(err.message);
          }

          for (const row of rows) {
            destinations.push(row.origin);
          }

          destinations = destinations.map(unidecodeAndClean);

          origin = encodeURI(origin);
          destinations = encodeURI(destinations.join('|'));

          const googleResponse = await api
            .get(
              `/json?language=pt-BR&units=metric&origins=${origin}&destinations=${destinations}&key=${key}`
            )
            .then(function (response) {
              // return response.rows[0].elements;
              return response.data.rows[0].elements;
            })
            .catch(err => {
              console.error(err);
              throw new Error();
            });

          console.log(googleResponse);
          const distances = googleResponse.map(item =>
            item.status === 'OK' ? item.distance.value : 999999999
          );

          console.log(distances);
          const { first, second } = getTwoLowers(rows, distances);
          console.log('Google response', first, second);

          // Inserting values in the database
          query = `
          INSERT INTO searches (
            telephone,
            objective,
            origin,
            action,
            tag
          ) VALUES (?,?,?,?,?);
          `;
          console.log([telephone, objective, origin, action, tag]);

          db.run(query, [telephone, objective, origin, action, tag], function (
            err
          ) {
            if (err) {
              return console.error(err.message);
            }
            return res.json({
              data: {
                Resultado1: {
                  Distancia: `${first.distance} metros`,
                  Empresa: first.action,
                  Endereco: first.origin,
                  Telefone: first.telephone,
                },
                Resultado2: {
                  Distancia: `${second.distance} metros`,
                  Empresa: second.action,
                  Endereco: second.origin,
                  Telefone: second.telephone,
                },
              },
            });
          });
        });
      } else if (addresses.length === 1) {
        // Inserting values in the database
        const query = `
        INSERT INTO searches (
          telephone,
          objective,
          origin,
          action,
          tag
        ) VALUES (?,?,?,?,?);
        `;
        console.log([telephone, objective, origin, action, tag]);

        db.run(query, [telephone, objective, origin, action, tag], function (
          err
        ) {
          if (err) {
            return console.error(err.message);
          }
          return res.json({
            data: {
              Resultado1: {
                Distancia: '--',
                Empresa: addresses[0].action,
                Endereco: addresses[0].origin,
                Telefone: addresses[0].telephone,
              },
              Resultado2: {
                Distancia: '--',
                Empresa: 'Não encontrada',
                Endereco: '--',
                Telefone: '--',
              },
            },
          });
        });
      } else if (addresses.length >= 1) {
        const query = `
        INSERT INTO searches (
          telephone,
          objective,
          origin,
          action,
          tag
        ) VALUES (?,?,?,?,?);
        `;
        console.log([telephone, objective, origin, action, tag]);

        db.run(
          query, // query
          [telephone, objective, origin, action, tag], // values
          function (err) {
            // callback
            if (err) {
              return console.error(err.message);
            }
            return res.json({
              data: {
                Resultado1: {
                  Distancia: '--',
                  Empresa: addresses[0].action,
                  Endereco: addresses[0].origin,
                  Telefone: addresses[0].telephone,
                },
                Resultado2: {
                  Distancia: '--',
                  Empresa: addresses[1].action,
                  Endereco: addresses[1].origin,
                  Telefone: addresses[1].telephone,
                },
              },
            });
          }
        );
      }
    });
  },
};
