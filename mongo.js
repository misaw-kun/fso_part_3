const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);

const url = `mongodb+srv://redpanda:${password}@cluster0.rkm2xzd.mongodb.net/phonebookDB?retryWrites=true&w=majority`;

const contactSchema = new mongoose.Schema({
  name: String,
  tel: String,
});

const Contact = mongoose.model('Contact', contactSchema);

mongoose
  .connect(url)
  .then(() => {
    console.log('connected');

    if (process.argv.length === 5) {
      const person = new Contact({
        name: process.argv[3],
        tel: process.argv[4],
      });
      person.save().then(() => {
        console.log('contact saved');
        return mongoose.connection.close();
      });
    } else if (process.argv.length === 3) {
      Contact.find({}).then((results) => {
        console.log('phonebook: \n');
        results.map((person) => console.log(person.name, person.tel));
        return mongoose.connection.close();
      });
    } else {
      console.log(
        'use the following format to enter info in the database \n eg: node mongo.js <passwd> "full name" phonenumber'
      );
      process.exit(1);
    }
  })
  .catch((err) => console.log(err));
