if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const phoneRouter = require('./router/phones');
const userRouter = require('./router/users');
const errorHandler = require('./middleware/errorHandler');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/users', userRouter);
app.use('/phones', phoneRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
