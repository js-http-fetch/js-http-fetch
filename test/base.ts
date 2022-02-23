// Fetch('/a') // expected url: http://localhost:8000/a
// Fetch.config.base = 'http://localhost:3000'
// Fetch('/a') // url: http://localhost:3000/a
// Fetch('http://custom.com', {params: {p: '2'}}) // expected url: http://custom.com/?p=2
// Fetch('https://custom.com', {params: {h: '5'}}) // expected url: https://custom.com/?h=5
// Fetch('//custom.com', {params: {c: '3'}}) // expected url: http://custom.com/?c=3
// const base = 'http://myhost.com'
// const Fetch2 = Fetch.create({timeout: 1000, base})
// console.log(Fetch2.config.base === base)
