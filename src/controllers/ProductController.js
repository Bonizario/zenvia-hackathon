const unidecode = require('unidecode');
const fuzzball = require('fuzzball');
require('dotenv').config();

const api = require('../api');
const db = require('../db');
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
  async search(req, res) {
    // Reading values from the request body

    // let {
    //   telefone: telephone,
    //   oferta_procura: objective,
    //   endereco_com_cep: address,
    //   prod_serv_estab: action
    // } = req.body;

    let { name, objective, origin, action, tag } = {
      name: 'Rogério Marques',
      objective: 'Procurar produto',
      origin: 'Av. da Saudade, 1411, Uberaba, 38061-000',
      action: 'Quero cortar meu cabelo',
      tag: 'cabeleireiro',
    };

    name = unidecodeAndClean(name);
    objective = unidecodeAndClean(objective);
    origin = unidecodeAndClean(origin);
    action = unidecodeAndClean(action);

    // Debug
    // console.log(name, objective, origin, action);
    // destinations.forEach(console.log);

    if (objective.includes('oferecer')) {
      // Chamada à API do Thales, recebe a tag
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

      db.run(query, [name, objective, origin, action, tag], function (err) {
        if (err) {
          return console.error(err.message);
        }

        console.log(`A row has been inserted with rowid ${this.lastID}`);
      });

      db.close();
    } else if (objective.includes('procurar')) {
      // Chamada à API do Thales
      const query = `
        SELECT origin
        FROM offers
      `;

      let destinations = [];
      db.each(query, function (err, row) {
        if (err) {
          return console.error(err.message);
        }

        destinations.push(row.origin);
      });

      console.log(destinations);
      db.close();

      // let destinations = [
      //   'R. Goiás, 1007 - Santa Maria, Uberaba - MG, 38050-060',
      //   'Av. Afrânio Azevedo, 707 - Santa Maria, Uberaba - MG, 38050-110',
      // ];
      // destinations = destinations.map(unidecodeAndClean);
    } else {
      return res.json({ message: 'Um erro ocorreu!' });
    }

    return res.json({ message: 'Ok' });

    /*
    google distance matrix api setup
    origin = encodeURI(
      origin
        .replace(/([!*'();:@&=+$,/?%#\[\]])||(\d{5}-\d{3}){1}/g, '')
        .toLowerCase()
    );

    destinations = encodeURI(
      destinations
        .join('|')
        .replace(/([!*'();:@&=+$,/?%#\[\]])||(\d{5}-\d{3}){1}/g, '')
        .toLowerCase()
    );

    console.log(
      `/json?language=pt-BR&units=metric&origins=${origin}&destinations=${destinations}&key=${key}`
    );

    // const response = await api.get(
    //   `/json?language=pt-BR&units=metric&origins=${origins}&destinations=${destinations}&key=${key}`
    // );

    // console.log(response.data);

    */
  },
};
