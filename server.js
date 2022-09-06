//Toimii, serverin käynnistys samassa kansiossa node './server.js', pysäytys ctrl+c

// Ota mongoose käyttöön -> tietokantayhteys
const mongoose = require('mongoose');

// Ota express käyttöön
const express =  require('express');
const app = express();

//Ota books käyttöön
const book = require('./bookSchema.js');

//Ota bodyparser käyttöön lomakkeen käsittelyä varten
const bodyparser = require('body-parser');

//Ota mongodb käyttöön
const mongodb = require('mongodb');



// Aseta määritykset express-palvelimelle
    //Ota käyttöön public-tiedosto
app.use(express.static('public'));
    //Ota käyttöön bodyparser
app.use(bodyparser.urlencoded({extended:false}));


// Luo vakio connectionstringille
const uri = 'mongodb+srv://demokko:rQzVIcmTCeKg46k9@cluster0.sotfj2v.mongodb.net/bookDb?retryWrites=true&w=majority'
// Muodostetaan yhteys tietokantaan
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser:true})

// Luodaan vakio tietokantayhteydelle
const db = mongoose.connection
// Näytä ilmoitus, jos yhteys ok
db.once('open', function() {
    console.log('Tietokantayhteys avattu');
})

// Kirjoita get-funktio, req.query toimii nyt
app.get('/books', function(req,res) {
    // Hae kirjat tietokannasta
    book.find(req.query, function( err, result) { //tyhjät {} hakuehdossa tuo kaikki, req.query rajaa hakua
        if (err) {
            res.send(err)
        } else {
            res.send(result);
        }
    })
    })

// Kirjan lisäys post-funktio
app.post('/newBook', function (req, res) {
    //console.log(req.body)
    //Varmistetaan, ettei ole ID:tä ja poistetaan jos on.
    delete req.body._id; 
    //Lisätään collectioniin uusi kirja
    db.collection('books').insertOne(req.body);
    res.send('Book is added with following data: ' + JSON.stringify(req.body)); //req.body on JSON-objekti, joten muutetaan se Stringiksi ennen palautusta.
})

// Poistofunktio
app.post('/deleteBook', function (req, res) {
    //Poistetaan collectionista kirja
    db.collection('books').deleteOne( { _id: new mongodb.ObjectId(req.body._id)}, function( err, result){
        if ( err ) {
            res.send('Error deleting with floowing data: ' + err);
        } else {
            res.send('Book is deleted with following id: ' + req.body._id);
        }
    });
   
})

// Päivitysfunktio
app.post('/updateBook', function(req,res){
    //Päivitetän collectionista kirja. Kolme parametria: ID, mitä päivitetään ja funktio virheenkäsittelyyn ja palautteeseen.
    db.collection('books').updateOne({_id:new mongodb.ObjectID(req.body._id)},{$set:{title:req.body.title, author:req.body.author, publisher:req.body.publisher}},function(err,results){
        if ( err ) {
            res.send('Error updating: ' + err);
        } else {
            res.send('Book is updated with following id: ' + req.body._id + ' and following data: ' + JSON.stringify(req.body) );
        }
    });
   
})


// Laitetaan palvelin kuuntelemaan porttia 8080
const server = app.listen(8080, function(){})

//Huom! Selaimessa localhost:8080/books