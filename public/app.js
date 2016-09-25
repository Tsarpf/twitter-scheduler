window.onload = () => {
  console.log('hello world')

  const input = document.querySelector('div.body-container textarea[name=poem]')
  const submit = document.querySelector('button[name=submit]')
  const charLeft = document.querySelector('#char-left')

  const inputChange = Rx.DOM.input(input)
  const submitClick = Rx.Observable.fromEvent(submit, 'click')

  const changeSub = inputChange.subscribe(
    () => {
      charLeft.innerHTML = 140 - input.value.length
    },
    (error) => console.log(error),
    () => console.log('input changes finished')
  )

  const clickSub = submitClick.subscribe(
    () => {
      Rx.DOM.post('/poem', {poem: input.value})
        .subscribe(
          function (data) {
            console.log('got data')
            console.log(data.response)
          },
          function (err) {
            console.log(err)
            // Log the error
          }
        )
    },
    (error) => console.log(error),
    () => console.log('clicking finished')
  )

}
