/* PETA LABIRIN. Mudah diubah.
   #=semak(dinding)  .=jalan  P=awal monyet  D=pintu terkunci  R=tujuan (kelinci / gerbang)
   Semua baris dalam satu peta harus sama panjang. */
const LEVEL_MAPS = [
  [ // Level 1 (11 x 10)
    "###########",
    "#P..#.....#",
    "#.#.#.###.#",
    "#.#...#...#",
    "#.#####.#.#",
    "#...#...#.#",
    "###.#.###.#",
    "#.....#..D#",
    "#.....###R#",
    "###########"
  ],
  [ // Level 2 (15 x 11) - lebih luas, banyak jalan buntu
    "###############",
    "#P....#.......#",
    "#.###.#.#####.#",
    "#.#...#.#...#.#",
    "#.#.###.#.#.#.#",
    "#.#.....#.#...#",
    "#.#####.#.#####",
    "#.....#.#.....#",
    "###.#.#.#####.#",
    "#...#...#####D#",
    "#############R#"
  ]
];
if (typeof module !== 'undefined') module.exports = LEVEL_MAPS;
