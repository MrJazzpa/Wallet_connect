const { urlencoded } = require('body-parser');
const express = require('express');
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser');
app = express();
const port = 8000 || process.env.PORT;
connectDB();

app.use(cookieParser())
app.use(urlencoded({extended:true}));
app.use(express.json());

app.use(express.static('public'));
app.set('view engine','ejs')

app.use('/',require('./server/routes/route_pages'));

app.use((req,res, next)=>{
    local={
        title:"404"
    }
    res.render('404',{local});
})



app.listen(port,()=>{
    console.log(`app listening to port ${port}`);
})


