var bodyParser = require("body-parser"),
methodOverride = require("method-override")
express = require("express"),
mongoose = require("mongoose"),
app = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"))

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req,res){
    res.redirect("/blogs");
});

//Index

app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs){
        if (err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

//New

app.get("/blogs/new", function(req,res){
    res.render("new")
});

//Create

app.post("/blogs", function(req,res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new")
        } else {
            res.redirect("/blogs");
        }
    });
});

//Show Route
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE ROUTE 
app.put("/blogs/:id", function(req,res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});

//RESTFUL ROUTES

app.listen(process.env.PORT,process.env.IP, function(){
   console.log("Server running"); 
});

