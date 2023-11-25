const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const app = express();
const publicDirectoryPath = path.join(__dirname, 'public');
const scriptsDirectoryPath = path.join(__dirname, 'scripts');
app.use(express.json());
app.use(express.static(publicDirectoryPath));
app.use('/scripts', express.static(scriptsDirectoryPath));
//imports
const customerRoutes = require('./routes/customer');
// settings
app.set('port', 3000);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(myConnection(mysql,{
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'escalafon'
}, 'single'));

//routes
app.use('/',customerRoutes);

app.get('/getResoluciones/:seccion',(req,res) =>{
  const seccion = req.params.query;
  console.log(seccion);
})

app.use(express.static(path.join(__dirname,'public')));
app.listen(app.get('port'), () => {
    console.log('Listening on port 3000');
});