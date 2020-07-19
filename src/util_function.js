function compareNumbers(a, b) {
  return a - b;
}

function get_two_lowers(rows, distances) {
  const sorted_distances = [...distances].sort(compareNumbers);

  const first_index = distances.indexOf(sorted_distances[0]);
  const second_index = distances.indexOf(sorted_distances[1]);

  return {
    first: { ...rows[first_index], distance: sorted_distances[0] },
    second: { ...rows[second_index], distance: sorted_distances[1] },
  };
}

module.exports = get_two_lowers;

// const rows = [
//   {
//     objective: 'oferecer estabelecimento',
//     origin: 'Rua H, Carmo 150, 38500-000',
//     telephone: '34 5163-5689',
//     action: 'Costuro roupas para quadrilha!',
//   },
//   {
//     objective: 'oferecer serviço',
//     origin: 'Rua G, Carmo 220, 38500-000',
//     telephone: '34 5163-2222',
//     action: 'Prego botões de camisa!',
//   },
//   {
//     objective: 'oferecer estabelecimento',
//     origin: 'Rua D, Catulina 150, 38500-000',
//     telephone: '34 5163-5689',
//     action: 'Vendo tecidos variados',
//   },
//   {
//     objective: 'oferecer estabelecimento',
//     origin: 'Rua E, 150, Catulina, 38500-000',
//     telephone: '34 5163-5689',
//     action: 'Vendo vestidos e ternos para casamento!',
//   },
//   {
//     objective: 'oferecer estabelecimento',
//     origin: 'Rua C, 170, Catulina, 38500-000',
//     telephone: '34 5163-5689',
//     action: 'Costuro calças, camisas e camisetas!',
//   },
// ];

// const distances = [6, 3, 4, 7, 2];

// console.log(get_two_lowers(rows, distances));
