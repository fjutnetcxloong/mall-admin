
//请求接口
// function fetch(url, params = {}) {
//     const res = new Promise((resolve, reject) => {
//         axios.post(url,
//             {
//                 userToken: window.localStorage.getItem('zpyght_userToken'),
//                 ...params
//             }).then((response) => {
//             if (response.data.status === 0) {
//                 resolve(response.data);
//             } else {
//                 reject(response.data);
//             }
//         });
//     });
//     return res;
// }