console.log('hello world')

Rx.DOM.post('/poem', { text: 'sometext' })
  .subscribe(
    function (data) {
      console.log(data.response)
    },
    function (err) {
      console.log(err)
      // Log the error
    }
  )
