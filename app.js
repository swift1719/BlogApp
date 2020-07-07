let bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	express = require('express'),
	app = express();
//App Config
mongoose.connect('mongodb://localhost:27017/blogapp', { useNewUrlParser: true, useUnifiedTopology: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
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
app.get('/blogs', (req, res) => {
	blog.find({}, (err, allblogs) => {
		if (err) {
			console.log(err);
		} else {
			res.render('index', { blogs: allblogs });
		}
	});
});

app.listen(3000, () => {
	console.log('Server Started!');
});
