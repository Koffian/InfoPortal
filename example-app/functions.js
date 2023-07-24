/** функция парсинга query параметра из url, сгенерированная нейросетью */
function getParameterByName(name, url) {
     if (!url) url = window.location.href;
     name = name.replace(/[\[\]]/g, '\\$&');
     const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
     const results = regex.exec(url);
     if (!results) return null;
     if (!results[2]) return '';
     return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

async function readFileContent(file) {
     return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = function (e) {
               resolve(reader.result)
          };

          reader.onerror = function (e) {
               reject(reader.result)
          };
          reader.readAsText(file)
     });
}