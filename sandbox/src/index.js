/**
 * Background
 *
 * We would like to send a request to a URL, but the URL may not be ready at that time.
 * Please write a function to implement auto resend the request until succeed.
 */

const http = require('http');

// This is an async function that use callback to fetch data from a url
const fetch = (url, callback) => {
  http
    .get(url, resp => {
      let data = '';
      resp.on('data', chunk => (data += chunk));
      resp.on('end', () => callback(null, data));
    })
    .on('error', err => {
      callback(err);
    });
};

// This is an example how to use fetch
// Fetch Success
// fetch('http://google.com', (err, data) => {
//   if (!err) {
//     console.info('success', data);
//     return;
//   }
//   console.error('error', err);
// });

// Fetch Failed
// fetch('http://google1234.com', (err, data) => {
//   if (!err) {
//     console.info('success', data);
//     return;
//   }
//   console.error('error', err);
// });

// ****** DO NOT MODIFY THE CODE ABOVE ******** //

/**
 * TASK 1: Implement a function that can auto refetch a url
 *  until success or the maximum retry number is reached.
 *
 *  When a fetch is failed, wait 'waitTime' seconds before the next fetch.
 *
 *  Requirement:
 *    1. Implement the function use callback, callback function signiture is same as fetch()
 *    2. Please use fetch(url, callback) function providded above.
 */
const autoRefetch = (url, maxRetryNumber, waitTime, callback) => {
  if (maxRetryNumber >= 1) {
    console.log("回调ing", maxRetryNumber)
    maxRetryNumber--;
    fetch(url, (data, err) => {
      if (!err) {
        console.log("成功", data);
        return
      } else {
        setTimeout(() => {
          callback(data, err)
          autoRefetch(url, maxRetryNumber, waitTime, callback)
        }, waitTime);
      }
    })
  } else {
    console.log("maxRetryNumber超出请求最大限度")
  }
};
// autoRefetch('http://google1234.com', 4, 3000, (data, err) => {
//   if (err) {
//     console.error('失败:', err);
//   } else {
//     console.log('成功:', data);
//   }
// })



/**
 *  TASK 2: Implement the same function in TASK 1 using Promise
 *
 *  Requirement:
 *    1. Please implement your function use Promise.
 *    2. Please use fetch(url, callback) function providded above.
 */
const autoRefetchPromise = (url, maxRetryNumber, waitTime) => {
  const promise = new Promise((resolve, reject) => {
    if (--maxRetryNumber >= 1) {
      setTimeout(() => {
        fetch(url, (data, err) => {
          if (!err) {
            resolve(data)
          } else {
            reject(err)
          }
        })
      }, waitTime);
    }
  })
  promise.then(data => {
    console.log("success", data)
  }).catch(err => {
    console.log("失败", err)
    autoRefetchPromise(url, maxRetryNumber, waitTime)
  })
};
// autoRefetchPromise('http://google1234.com', 3, 3000)


/**
 * TASK 3: Implement the same function in TASK 1 using async/await
 *
 * Requirement:
 *    1. Please implement your function use async/await.
 *    2. Please use fetch(url, callback) function providded above.
 */
const autoRefetchAsync = async (url, maxRetryNumber, timeout) => {
  if (--maxRetryNumber >= 1) {
    let response = await fetch(url, (data, err) => {
      if (!err) {
        console.log("ok")
        return
      } else {
        console.log("No+1")
        setTimeout(() => {
          autoRefetchAsync(url, maxRetryNumber, timeout)
        }, timeout);
      }
    });
  }
}

autoRefetchAsync('http://google1234.com', 3, 3000);