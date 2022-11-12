const axios = require('axios')
const express = require('express')
const app = express()
const { config, engine } = require('express-edge')
const path = require('path')
const fs = require('fs');
const cors = require('cors')


const router = express.Router({ mergeParams: true })

app.use(cors())
config({ cache: process.env.NODE_ENV === 'production' })
app.set('views', `${__dirname}/views`)
app.use(engine)

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

router.get('/book/:id', ({ params, query }, res) => {
  axios.get(`${baseApiUrl}/books_by_category/${query.category_id}`).then(({ data }) => {
    const book = data.find(i => i.id == params.id)
    const books = data.filter(i => i.id != params.id)
    res.render('book', { book, books })
  })
})

app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/books', express.static(path.join(__dirname, 'books')))
app.use(`/:lang(${languages.join('|')})?`, router)
app.listen(process.env.port || 3000)

console.log('Running at http://localhost:3000')
