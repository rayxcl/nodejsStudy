module.exports = function(app, fs)
{
    app.get('/', function(req, res){
        res.render('index', {
            title: 'My Homepage',
            length: 5
        })
    });

    app.get('/list', function(){
        fs.readFile(__dirname + '/../data' + 'user.json', 'utf8', function(err, data){
            console.log(data);
            res.end(data);
        })
    });
}