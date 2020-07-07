let bodyParser = require('body-parser'),
	expressSanitizer = require('express-sanitizer'),
	methodOverride = require('method-override'),
	mongoose = require('mongoose'),
	express = require('express'),
	app = express();
//App Config
mongoose.connect('mongodb://localhost:27017/blogapp', { useNewUrlParser: true, useUnifiedTopology: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
//Mongoose/Model config
let blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: { type: Date, default: Date.now() }
});

let blog = mongoose.model('blogs', blogSchema);

// blog.create({
// 	title: 'Test Blog',
// 	image:
// 		'https://images.unsplash.com/photo-1444212477490-ca407925329e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
// 	body: "what's new is all here.."
// });

//RESTful Routes
app.get('/', (req, res) => {
	res.redirect('/blogs');
});
//index route
app.get('/blogs', (req, res) => {
	blog.find({}, (err, allblogs) => {
		if (err) {
			console.log(err);
		} else {
			res.render('index', { blogs: allblogs });
		}
	});
});
//new route
app.get('/blogs/new', (req, res) => {
	res.render('new');
});
//post route for new blog
app.post('/blogs', (req, res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	blog.create(req.body.blog, (err, newblog) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/blogs');
		}
	});
});
//show route
app.get('/blogs/:id', (req, res) => {
	blog.findById(req.params.id, (err, foundBlog) => {
		if (err) {
			console.log(err);
		} else {
			res.render('show', { blog: foundBlog });
		}
	});
});

//Edit route
app.get('/blogs/:id/edit', (req, res) => {
	blog.findById(req.params.id, (err, foundBlog) => {
		if (err) {
			console.log(err);
			res.redirect('/blogs/:id');
		} else {
			res.render('edit', { blog: foundBlog });
		}
	});
});
app.put('/blogs/:id', (req, res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if (err) {
			console.log(err);
			res.redirect('/blogs/' + req.params.id + '/edit');
		} else {
			res.redirect('/blogs/' + req.params.id);
		}
	});
});
//Delete route
app.delete('/blogs/:id', (req, res) => {
	blog.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect('/blogs/' + req.params.id);
		} else {
			res.redirect('/blogs');
		}
	});
});
//Adding up sanitizer module
//Styling index page
app.listen(3000, () => {
	console.log('Server Started!');
});
