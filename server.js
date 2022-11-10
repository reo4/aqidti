const axios = require('axios')
const express = require('express')
const app = express()
const { config, engine } = require('express-edge')
const path = require('path')
const fs = require('fs');
var https = require('https');

const router = express.Router({ mergeParams: true })

config({ cache: process.env.NODE_ENV === 'production' })
app.use(engine)
app.set('views', `${__dirname}/views`)

const baseApiUrl = `https://aqidti.com/api`

const languages = [
  'ar',
  'en',
  'fr',
  'id',
  'hi',
  'ru',
  'ur',
  'ps',
  'bn',
  'tl',
  'sw',
  'te',
]

const rtl = ['ar', 'ur', 'ps', 'te']

const langMiddleware = ({ params }, res, next) => {
  let code = params.lang ? params.lang : 'ar'
  res.locals.lang = code
  res.locals.rtl = rtl.includes(code)
  res.locals.data = JSON.parse(fs.readFileSync(path.join(__dirname, `lang/${code}.json`), 'utf8'));
  next()
}

router.use(langMiddleware)

router.get('/', ({ params }, res) => {
  axios.get(`${baseApiUrl}/books`).then(({ data }) => {
    res.render('home', { books: data })
  })
})

router.get('/book/:id', ({ params }, res) => {
  axios.get(`${baseApiUrl}/book/${params.id}`).then(({ data }) => {
    const book = data
    axios.get(`${baseApiUrl}/books_by_category/${book.category_id}`).then(({ data }) => {
      const books = data.filter(i => i.id !== book.id)
      res.render('book', { book, books })
    })
  })
})

router.get('/download/:book_id', ({ params }, res) => {
  const lang = res.locals.lang
  axios.get(`${baseApiUrl}/book/${params.book_id}`).then(({ data }) => {
    const bookPath = path.join(__dirname, `books/${data.name[lang]}.pdf`)
    const file = fs.createWriteStream(bookPath);
    const request = https.get(data.pdf[lang], function (response) {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        res.download(bookPath)
      });
    });
  })
})

app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/books', express.static(path.join(__dirname, 'books')))
app.use(`/:lang(${languages.join('|')})?`, router)
app.listen(process.env.port || 3000)

console.log('Running at http://localhost:3000')
