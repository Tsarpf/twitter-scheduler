window.onload = () => {
  console.log('hello world')

  const input = document.querySelector('div.body-container textarea[name=poem]')
  const submit = document.querySelector('button[name=submit]')
  const charLeft = document.querySelector('#char-left')

  const inputLength = Rx.DOM.input(input).map(() => input.value.length)

  const submitClick = Rx.DOM.click(submit)
        .map(() => input.value)
        .filter(x => x !== '')

  submitClick.subscribe((text) => {
    input.value = ''
    charLeft.innerHTML = 140
    fetch('/poem', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        poem: text
      })
    }).then(response => response.json())
      .then(json => {
        console.log('then what?', json)
      })
  })

  inputLength.subscribe(
    (length) => {
      charLeft.innerHTML = 140 - length
    },
    (error) => console.log(error),
    () => console.log('input changes finished')
  )
}
