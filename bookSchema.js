//Toimii

//Otetaan Mongoose käytöön
const mongoose = require('mongoose');

const bookSchema = mongoose.Schema;

  let book = new bookSchema ( {
  title: {
  type: String
  },
  author: {
    type: String
  },
  publisher: {
    type: String
  },
  read: {
    type: Boolean
  }
},
  { collection: 'books'}
)
// Export model, huom! Parametreina kokoelman nimi ja skeeman nimi
module.exports = mongoose.model('books', book);