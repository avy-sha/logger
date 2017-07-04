var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var file = "./config.json";
var jsonfile = require('jsonfile');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var staticPath = path.join(__dirname, '/assets');
app.use(express.static(staticPath));


app.listen(80, function() {
    console.log('listening');
});
app.post('/api/save', function(req, res) {
	var deviceObj = {
        "slaveId": req.body.slaveId,
        "commCategory": req.body.comm,
        "driverType": req.body.driver,
    };
    console.log(deviceObj);
    if (deviceObj.slaveId && deviceObj.commCategory && deviceObj.driverType) {
		jsonfile.readFile(file, function(err, obj) {
            if (err)
                res.send(err);
            if (obj) {
                obj.modbus.push(deviceObj);
                jsonfile.writeFile(file, obj, function(err) {
                        if (err)
                            res.send(err)
						res.redirect('/?valid=true&dev=' + deviceObj.slaveId);
                    })
            }

        })
    }else
    { res.json(402,{});}
});
app.get('/api/delete', function(req, res) {
	jsonfile.readFile(file, function(err, obj) {
		if (err)
			res.send(err);
		if (obj) {
		      if(obj.modbus !=null){
			res.status(200).json(obj.modbus);}
			else{
		            res.status(200).json("no device to delete");
                  }
		}

	})

});

app.post('/api/delete/:slaveId', function(req, res) {
	jsonfile.readFile(file, function(err, obj) {
		if (err)
			res.send(err);
		if (obj) {
			if(obj.modbus !=null){
				//variable to check if device with that slave id exists.
				var noslave=0;
			      console.log(req.params.slaveId);
			      for(var i=0;i<obj.modbus.length;i++){
			      	if(obj.modbus[i].slaveId==req.params.slaveId){
			      		obj.modbus.splice(i,1);
			      		noslave++;
				      }
			      }
				jsonfile.writeFile(file, obj, function(err) {
					if (err)
						res.send(err);
					if(noslave>0)
						res.status(200).json("successfully deleted");
					else
						res.status(200).json("no device with that slaveId exists");

				});
				}

		}

	})

});

/* Single Items */
