# Funciones utiles para proyectos con JS

## Leer archivo asyncrono | read async file
```js
const fs = require('fs');
const readFile = (path) => new Promise((resolve, reject)=>{
    fs.readFile(path,  "utf-8", (err, buf)=> err ? reject(err) : resolve(buf.toString()));
});
```

## Leer Archivos de carpeta | read files from folder
```js
const fs = require('fs');
const readFolder = (path) => new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => err ? reject(err) : resolve(files));
});
```

## Reemplazar texto en archivos
```js
const fs = require('fs');
const {readFile} = require('./recursosUtiles');
/**
 * Lee un archivo y reemplaza su contenido
 * @param {Object} params - Parametros
 * @param {string} params.path - Ruta del archivo
 * @param {(Object|Object[])} params.contenido
 * @param {string} [params.contenido.oldText] - Texto a anterior
 * @param {string} [params.contenido.newText] - Texto a nuevo
 * @param {string} [params.contenido[].oldText] - Texto a anterior
 * @param {string} [params.contenido[].newText] - Texto a nuevo
 * @returns {Promise} Contenido de final del archivo
 */
const replaceData = async ({path, contenido})=>{
    let source = await readFile(path);

    if(Array.isArray(contenido)){
        for (let i = 0; i < contenido.length; i++)
            source = source.replace( new RegExp(contenido[i].oldText, 'g'), contenido[i].newText);

    }else{
        source = source.replace( new RegExp(contenido.oldText, 'g'), contenido.newText);
    }

    fs.writeFileSync(path, source);
    return source;
}
```

## Leer desde la consola | read input from console
```js
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
const ask = (text)=> new Promise((resolve, reject)=>{
    readline.question(text, (answer)=>resolve(answer));
});
```
