const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      ejs = require('ejs'),
      methodOverride = require('method-override');

// ================
//    APP CONFIG
// ================
mongoose.connect('mongodb+srv://readWriteUser123:readWriteUser123@experimental-cluster-ar7kg.mongodb.net/talespin-blog', {useNewUrlParser: true, useFindAndModify: false});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// =====================
//    MONGOOSE CONFIG
// =====================
const blogSchema = new mongoose.Schema({
  title: String,
  image: 
    {
      type: String, 
      default: 'https://images.unsplash.com/photo-1522794338816-ee3a17a00ae8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9'
    },
  body: String,
  created: 
    {
      type: Date, 
      default: Date.now
    }
});
const Blog = mongoose.model('Blog', blogSchema);


// ===============
//    TEST BLOG
// ===============

// Blog.create({
//   title: 'Welcome To The Test Blog',
//   body: 'Lorem ipsum Imperial lando calrissian chevron ned flanders class definer doctor watson. cigars, cigars imperial grooming chevron doctor watson. class definer ned flanders Semi beard lando calrissian dis? Face broom dolor sit amet robert winston hulk hogan?'
// });


// ============
//    ROUTES
// ============

// INDEX ROUTE
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if(err){
      console.log('Oh no, something went wrong!');
    } else {
      res.render('index', {blogs: blogs});
    }
  });
});

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// NEW ROUTE
app.get('/blogs/new', (req, res) => {
  res.render("new");
});

// CREATE ROUTE
app.post('/blogs', (req, res) => {
  Blog.create(req.body.blog, (err, newBlog) => {
     if(err){
         res.render('/new')
     } else {
         res.redirect('/blogs')
     }
  });
});

// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
      if(err){
          res.redirect('/blogs');
      } else {
          res.render('show', {blog: foundBlog});
      }
  });
});

// EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if(err){
        res.redirect('/blogs');
    } else {
        res.render('edit', {blog: foundBlog});
    }
  });
});


// UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {
  Blog.findOneAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if(err){
        res.redirect('/blogs');
    } else {
        res.redirect('/blogs/' + req.params.id);
    }
  });
});

// DELETE ROUTE
app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if(err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  });
});

// ALL ROUTES NOT COVERED ABOVE
app.get('/*', (req, res) => {
  res.send('Sorry, there\'s nothing to see here')
});

app.listen(process.env.PORT, process.env.IP, () => {
  console.log('server on');
});
