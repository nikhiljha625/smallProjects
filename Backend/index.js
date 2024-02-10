
import  express  from "express";
import randomstring from "randomstring";

const app = express();
app.use(express.json());


let url_store=new Map();
let url_store2=new Map();
let short_url_store=new Set();

function shorten(req,res){
    
    let long_url=req.body.long_url;
    
    if(url_store.get(long_url)){
        res.send({'short_url':url_store.get(long_url)});
    }
    else{
        let shortened_url=null;
        while(shortened_url==null){
            shortened_url=randomstring.generate(5);
            if(short_url_store.has(shortened_url)){
                shortened_url=null;
            }
        }
        url_store.set(long_url,shortened_url);
        url_store2.set(shortened_url,long_url);
        short_url_store.add(shortened_url);
        res.send({'short_url':shortened_url});
    }
}

function retrieveLongUrl(req,res){
    let short_url=req.body.short_url;
    let long_url=url_store2.get(short_url);
    if(long_url=== null || long_url=== undefined){
        res.status(400).send({"Eroor":"URL not found"})
    }
    res.status(200).send({"long_url":long_url});
}
app.post('/shorten',shorten)

app.get('/retrieveLongUrl',retrieveLongUrl);

const port=3005;
app.listen(port);