


let data = '';


https.get(_EXTERNAL_URL, options, ( res ) => {
    
    // A chunk of data has been recieved.
    res.on('data', (chunk) => {
        data += chunk;
    });

    data = "let clanData =" + data 

    // The whole response has been received. Print out the result.
    res.on('end', () => {
        fs.writeFile('./public/data/clanData.js', data, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        console.log(JSON.stringify(data));
        //res.end(JSON.stringify(data));
    });

    }).on("error", (err) => {
        
    console.log("Error: " + err.message);
});


httpsCall.get(_EXTERNAL_URL, options, ( res ) => {
    // A chunk of data has been recieved.
    res.on('data', (chunk) => {
        data += chunk;
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});