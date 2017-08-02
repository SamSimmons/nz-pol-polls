const axios = require('axios')
const cheerio = require('cheerio')
const _ = require('lodash')
const fs = require('fs')

const generateRequest = (url) => {
  return axios.get(url)
    .then(res => res.data)
}

const getPostJson = (content) => {
  const $ = cheerio.load(content)
  const data = content.find('ul').first().children().map(function (i, elt) {
    return $(this).text()
  }).toArray()
  return {
    title: content.find('.title').first().text(),
    date: content.find('.date').first().text(),
    data
  }
}

const saveFile = (data, n) => {
  fs.writeFile(`${__dirname}/data.json`, JSON.stringify(data), (err) => {
    if (err) {
      console.log('🌋', err)
    }
    console.log("File Saved", n)
  })
}

const getPage = (url) => {
  return axios.get(url)
    .then(res => res.data)
    .then(res => {
      const $ = cheerio.load(res)
      const posts = $('.title a').toArray()
      const links = posts.map((elt) => {
        return elt.attribs.href
      })
      return axios.all(links.map(link => generateRequest(link)))
        .then(axios.spread((...posts) => {
          return posts.map((postHtml) => {
            const $ = cheerio.load(postHtml)
            const content = $('.post.single')
            return getPostJson(content)
          })
        }))
    })
}
const requests =  _.range(1, 11).map(n => `http://www.curia.co.nz/category/nz-political-party-polls/page/${n}`)
const polls = []
requests.forEach((request, i) => {
  getPage(request)
    .then(d => polls.push(d))
    .then(d => saveFile(polls, i))
    .catch(() => {
      getPage(request)
      .then(d => polls.push(d))
      .then(d => saveFile(polls, i))
    })
})
console.log('🌴', polls)
