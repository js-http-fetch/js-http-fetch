// let data
// switch (option.responseType) {
//   case 'blob':
//     data = new Blob(chunks)
//     break
//   case 'arrayBuffer':
//     data = unionUint8Array(chunks, progress.loaded).buffer
//     break
//   case 'text':
//     data = new TextDecoder('utf-8').decode(unionUint8Array(chunks, progress.loaded))
//     break
//   default:
//     data = new TextDecoder('utf-8').decode(unionUint8Array(chunks, progress.loaded))
//     try {
//       data = JSON.parse(data)
//     } catch (e) {
//     }
// }



// fetch(url + search, option).then(r => {
//   console.log('r1', r)
//   if (!r.ok) return reject(r)
//   if (['arrayBuffer', 'blob', 'formData', 'json', 'text'].includes(option.responseType as TransformMethod)) return r[option.responseType as TransformMethod]()
//   return r.text()
// }, e => console.log('e1', e)).then(r => {
//   // console.log('r2', r)
//   if (!option.responseType) {
//     try {
//       resolve(JSON.parse(r))
//     } catch (e) {
//       resolve(r)
//     }
//   } else resolve(r)
// }, e => console.log('e2', e))
