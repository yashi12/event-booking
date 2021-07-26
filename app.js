var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { graphqlHTTP } = require('express-graphql');
const {buildSchema} = require('graphql');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
     type RootQuery{
       events: [String!]!
     }
     type RootMutation{
       createEvent(name:String):String
     }
    schema {
      query: RootQuery
      mutation: RootMutation
    }`),
    rootValue: {
        events: () => {
            return ['Code', 'Study', 'Code', 'Eat', 'Sleep']
        },
        createEvent: (args) => {
            return args.name
        }
    },
    graphiql: true
}));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
