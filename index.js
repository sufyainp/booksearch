import express from "express";
import axios from "axios";

const app = express();
const port = 3050;

app.use(express.static("public"));
app.set('view engine', 'ejs');

// Render the search form
app.get('/', (req, res) => {
    res.render('index', { query: '', books: [] });
});

// Handle the search query
app.get('/search', async (req, res) => {
    try {
        const apiKey = '';
        const query = req.query.query;
        
        // Fetch book information from Google Books API
        const response = await axios.get("https://www.googleapis.com/books/v1/volumes", {
            params: {
                q: query,
                maxResults: 5,
                key: apiKey
            }
        });

        // Extract relevant book information
        const books = response.data.items.map(item => ({
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown',
            description: item.volumeInfo.description ? item.volumeInfo.description : 'No description available'
        }));

        // Render the EJS template with search query and results
        res.render("index", { query, books });
    } catch (error) {
        console.error('Error fetching book information:', error);
        res.status(500).send('Error fetching book information');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
