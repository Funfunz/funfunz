import Debug from 'debug'

const debug = Debug('cpmbg:boot')

/* server boot script
** this will run everytime the server is started
*/
export default function() {
  debug('Start')
  Promise.all([]).then(
    () => {
      debug('End')
    }
  ).catch(
    (err) => {
      debug('End' + JSON.stringify(err))
    }
  )
}
