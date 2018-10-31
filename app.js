var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose    = require('mongoose');

mongoose.connect("mongodb://localhost/faq_app");

app.set("view engine","ejs");

app.use(express.static("public"));
//only for custom styling

app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride("_method"))
//MONGOOSE/MODEL Config
var faqSchema = new mongoose.Schema({
    problem : String ,
    diagram : String ,
    solution :[],
    created : {type :Date , default : Date.now }
})

var Faq = mongoose.model("Faq",faqSchema);

/*Faq.create({
    problem : "What is the full form of REST ?",
    solution : [ "Representational State Transfer",
                 "It is a routing technique"],
    diagram : "https://cdn.lynda.com/video/159165-107-635293993475267315_338x600_thumb.jpg"
})*/

//RESTful Routes

app.get('/',function(req,res){
    res.redirect('/faqs');
})

app.get('/faqs',function(req,res){
    Faq.find({},function(err,data){
        if(err){
            console.log("ERROR!");
        }else{
            res.render('index', { allfaqs : data} );
        }
    })
});

//new FAQ route

app.get('/faqs/new',function(req,res){
    res.render('new');
})

//create FAQ route

app.post('/faqs',function(req,res){
    //create faq
    Faq.create( req.body.faq , function(err , newFAQ){
        if(err){
            res.render('new')
        }else{
            res.redirect('/faqs')
        }
    })
})

//show route

app.get('/faqs/:id',function(req,res){
    Faq.findById(req.params.id , function(err, theFaq){
        if(err){
            res.redirect('/faqs')
        }else{
            res.render('show' , { faq : theFaq});
        }
    })
})

//edit route

app.get('/faqs/:id/edit',function(req,res){
    Faq.findById(req.params.id , function(err , theFaq ){
        if(err){
            res.redirect('/faqs');
        }else{
            res.render('edit',{ faq : theFaq})
        }
    })
})

//Update Route

app.put('/faqs/:id',function(req,res){
    Faq.findByIdAndUpdate(req.params.id , req.body.faq , function(err , updatedFaq) {
        if(err){
            res.redirect('/faqs');
        }else{
            res.redirect(`/faqs/${req.params.id}`)
        }
    })
})

//delete route

app.delete('/faqs/:id',function(req,res){
   Faq.findByIdAndRemove(req.params.id , function(err){
       if(err) { 
           res.send("ERROR OCCURED!!");
       }else{
           res.redirect('/faqs')
       }
   })
})

var port = process.env.PORT || 3000;

app.listen(3000,function(){
     console.log(`Server is running on ${port}`)
})




