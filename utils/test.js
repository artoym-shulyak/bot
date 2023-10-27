// const lerp = (min, max, value) => ((1 - value) * min + value * max);

// const drop = items => {
//  const total = items.reduce((accumulator, item) => (accumulator + item.dropChance), 0);
//  const chance = lerp(0, total, Math.random());

//  let current = 0;
//  for (const item of items) {
//      if (current <= chance && chance < current + item.dropChance) {
//      	console.log(`🧩 Персонаж: ${item.name}, ✨ Ранг: ${item.rank}, 🎲 Шанс: ${item.chance}`)
//          return item;

//      }

//      current += item.dropChance;
//  }
// };



// drop(items)