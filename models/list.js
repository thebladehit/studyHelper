'use strict';

const path = require('node:path');
const fs = require('node:fs');

class List {
  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, '..', 'data', 'list.json'), 'utf-8', (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    })
  }

  static async add(subject) {
    const list = await List.getAll();
    const repeated = list.find(x => x.id === subject.id);
    if (!repeated) {
      list.push(subject);
      return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, '..', 'data', 'list.json'), JSON.stringify(list), (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    }
    return;    
  }

  static async delete(id) {
    const list = await List.getAll();
    const newList = list.filter(x => x.id !== id);

    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(__dirname, '..', 'data', 'list.json'), JSON.stringify(newList), (err) => {
        if (err) reject(err);
        resolve(newList);
      });
    });
  }
}

module.exports = List;