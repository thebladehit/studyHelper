'use strict';

const uuid = require('uuid').v4;
const path = require('node:path');
const fs = require('node:fs');

class Subject {
  constructor(name, teacher, shortName) {
    this.name = name;
    this.teacher = teacher;
    this.shortName = shortName;
    this.id = uuid();
  }

  toJSON() {
    return {
      name: this.name,
      teacher: this.teacher,
      shortName: this.shortName,
      id: this.id
    };
  }

  async add() {
    const subjects = await Subject.getAll();
    subjects.push(this.toJSON());
    
    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(__dirname, '..', 'data', 'subjects.json'), JSON.stringify(subjects), (err) => {
        if (err) reject(err);
        resolve();
      })
    });
  }

  static async update(subject) {
    const subjects = await Subject.getAll();
    const idx = subjects.findIndex(x => x.id === subject.id);
    subjects[idx] = subject;

    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(__dirname, '..', 'data', 'subjects.json'), JSON.stringify(subjects), (err) => {
        if (err) reject(err);
        resolve();
      })
    });
  }
  
  static async getById(id) {
    const subjects = await Subject.getAll();
    return subjects.find(x => x.id === id);
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, '..', 'data', 'subjects.json'), 'utf-8', (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    });
  }
}

module.exports = Subject;