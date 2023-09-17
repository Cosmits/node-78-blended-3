const { connect } = require('mongoose');

const connectDB = async () => {
  try {
    const DB = await connect(process.env.DB_HOST);
    // console.log("🚀 DB:", DB)
    console.log(`DB is connected. On port: ${DB.connection.port}. Name: ${DB.connection.name}. Host: ${DB.connection.host}`.green.italic.bold)
  } catch (error) {
    console.log(error.message.red.bold)
    process.exit(1);
  }
}

module.exports = connectDB;

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));