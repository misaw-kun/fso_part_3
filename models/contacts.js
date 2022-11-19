const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to...\n', url);

mongoose
  .connect(url)
  .then(() => console.log('connected to atlas cluster'))
  .catch((err) => console.log('error connecting to db', err.message));

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

contactSchema.set('toJSON', {
  /*
    Sanitizing response by modifying it
    document and returnedObject as params
  */
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString();
    delete retObj._id;
    delete retObj.__v;
  },
});

module.exports = mongoose.model('Contact', contactSchema);
