/* eslint-disable */
function getQueryVariable (variable) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] === variable) {
      console.log(pair[1])
      const index = pair[1].indexOf('#')
      if (index >= 0) {
        return pair[1].substring(0, index)
      } else {
        return pair[1]
      }
    }
  }
  return null
}
