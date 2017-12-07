//
// array of tiles objects
//

var tiles = [
  {
    id: 1,
    type: ['forest'],
    tag: 'f',
    coords: [1,1],
    nodes: []
  }, {
    id: 2,
    type: ['road'],
    tag: 'r',
    coords: [2,1],
    nodes: [[0,-1],[0,1]]
  }, {
    id: 3,
    type: ['road'],
    tag: 'r',
    coords: [3,1],
    nodes: [[-1,0],[1,0]]
  }, {
    id: 4,
    type: ['river'],
    tag: 'w',
    coords: [4,1],
    nodes: [[0,1],[0,-1]]
  }, {
    id: 5,
    type: ['river'],
    tag: 'w',
    coords: [5,1],
    nodes: [[1,0],[-1,0]]
  }, {
    id: 6,
    type: ['plain'],
    tag: 'p',
    coords: [1,2],
    nodes: []
  }, {
    id: 7,
    type: ['road'],
    tag: 'r',
    coords: [2,2],
    nodes: [[1,0],[0,1]]
  }, {
    id: 8,
    type: ['road'],
    tag: 'r',
    coords: [3,2],
    nodes: [[-1,0],[0,1]]
  }, {
    id: 9,
    type: ['river'],
    tag: 'w',
    coords: [4,2],
    nodes: [[1,0],[0,1]]
  }, {
    id: 10,
    type: ['river'],
    tag: 'w',
    coords: [5,2],
    nodes: [[-1,0],[0,1]]
  }, {
    id: 11,
    type: ['camp','road'],
    tag: 'L',
    coords: [1,3],
    nodes: [[-1,0],[1,0]]
  }, {
    id: 12,
    type: ['road'],
    tag: 'r',
    coords: [2,3], 
    nodes: [[1,0],[0,-1]]
  }, {
    id: 13,
    type: ['road'],
    tag: 'r',
    coords: [3,3],
    nodes: [[-1,0],[0,-1]]
  }, {
    id: 14,
    type: ['river'],
    tag: 'w',
    coords: [4,3],
    nodes: [[1,0],[0,-1]]
  }, {
    id: 15,
    type: ['river'],
    tag: 'w',
    coords: [5,3],
    nodes: [[-1,0],[0,-1]]
  }, {
    id: 16,
    type: ['camp','road'],
    tag: 'C',
    coords: [1,4],
    nodes: [[-1,0],[1,0]]
  }, {
    id: 17,
    type: ['road'],
    tag: 'r',
    coords: [2,4], 
    nodes: [[-1,0],[1,0],[0,1]]
  }, {
    id: 18,
    type: ['road'],
    tag: 'r',
    coords: [3,4],
    nodes: [[-1,0],[0,-1],[0,1]]
  }, {
    id: 19,
    type: ['river','road'],
    tag: 'X',
    coords: [4,4],
    nodes: [[1,0],[0,1],[-1,0],[0,-1]]
  }, {
    id: 20,
    type: ['river', 'road'],
    tag: 'X',
    coords: [5,4],
    nodes: [[1,0],[0,1],[-1,0],[0,-1]]
  }, {
    id: 21, 
    type: ['camp','river'],
    tag: 'T',
    coords: [1,5],
    nodes: [[-1,0],[1,0]]
  }, { 
    id: 22,
    type: ['road'],
    tag: 'r',
    coords: [2,5],
    nodes: [[1,0],[0,-1],[0,1]]
  }, {
    id: 23,
    type: ['road'],
    tag: 'r',
    coords: [3,5],
    nodes: [[-1,0],[0,-1],[1,0]]
  }, {
    id: 24,
    type: ['road'],
    tag: 'X',
    coords: [4,5],
    nodes: [[1,0],[0,1],[-1,0],[0,-1]]
  }, {
    id: 25,
    type: [],
    tag: ' ',
    coords: [5,5],
    nodes: []
  }, {
    id: 26,
    type: ['ui'],
    tag: '<',
    coords: [1,6],
    nodes: []
  }, {
    id: 27,
    type: ['ui'],
    tag: 'v',
    coords: [2,6],
    nodes: []
  }, {
    id: 28,
    type: ['ui'],
    tag: '^',
    coords: [3,6],
    nodes: []
  }, {
    id: 29,
    type: ['ui'],
    tag: '>',
    coords: [4,6],
    nodes: []
  }, {
    id: 30,
    type: ['ui'],
    tag: 'P',
    coords: [5,6],
    nodes: []
  }
];

//
// map object
//

var map = {
  cols: 20,
  rows: 20,
  tsize: 128,
  layers: [

    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 

    [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 3, 3, 16, 3, 3, 24, 3, 3, 3, 3, 8, 0, 0, 0, 0, 0, 0, 0, 0, 14, 5, 10, 0, 0, 0, 2, 0, 0, 0, 0, 12, 3, 3, 3, 8, 0, 0, 0, 0, 0, 0, 14, 10, 0, 0, 2, 0, 0, 9, 10, 0, 0, 0, 0, 12, 8, 0, 0, 0, 0, 0, 9, 15, 0, 0, 2, 9, 10, 4, 14, 10, 0, 0, 0, 0, 12, 17, 3, 3, 0, 0, 14, 5, 10, 9, 20, 15, 14, 15, 0, 14, 5, 21, 10, 0, 0, 2, 0, 0, 0, 0, 0, 0, 14, 15, 2, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 14, 10, 9, 20, 10, 0, 0, 0, 0, 0, 0, 0, 22, 11, 3, 0, 0, 0, 0, 0, 0, 14, 15, 2, 14, 5, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 24, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  
  ],
  getTile: function (layer, col, row) {
    let id = this.layers[layer][row * map.cols + col];
    return tiles[id-1];
  }
};
