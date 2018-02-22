module.exports = function(app, fs)
{
    app.get('/', function(req, res){
        res.render('index', {
            title: 'My Homepage',
            length: 5
        });
    });

    app.get('/list', function(req, res){
        fs.readFile(__dirname + '/../data/' + 'user.json', 'utf8', function(err, data){
            console.log(data);
            console.log(JSON.parse(data));
            res.end(data);
        });
    });

    app.get('/getUser/:username', function(req, res){
        fs.readFile(__dirname + '/../data/user.json', 'utf8', function(err, data){
            var users = JSON.parse(data);
            // res.end(user);
            res.json(users[req.params.username]);
            // console.log(req.params.username);
        });
    });

    app.post('/addUser/:username', function(req, res){
        var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA & CHECK DUPLICATION
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            if(users[username]){
                // DUPLICATION FOUND
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            // ADD TO DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
    });

    app.put('/updateUser/:username', function(req, res){

        var result = {};
        var username = req.params.username;

        if(!(req.body["password"] && req.body["name"])) {
            result["success"] = 0;
            result["errorMsg"] = "Invalid request";
            res.json(result);
            return;
        }

        // file 읽어서 데이터 존재여부 확인
        fs.readFile(__dirname + '/../data/user.json', 'utf8', function(err, data){
            var users = JSON.parse(data);

            if(!users[username]){
                res.end("There is no one named " + username);
                return;
            }
            users[username] = req.body;

            fs.writeFile(__dirname + '/../data/user.json',
            JSON.stringify(users, null, '\t'), 'utf8', function(err, data) {
                result["success"] = 1;
                res.json(result);
            })
        })
    })

    app.delete('/deleteUser/:username', function(req, res){
        var result = { };
        //LOAD DATA
        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);

            // IF NOT FOUND
            if(!users[req.params.username]){
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            // DELETE FROM DATA
            delete users[req.params.username];

            // SAVE FILE
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result["success"] = 1;
                res.json(result);
                return;
            })
        })

    })
}