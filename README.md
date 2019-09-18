# Funciones utiles para proyectos con JS

## Leer archivo asyncrono | read async file
```js
const fs = require('fs');
const readFile = (path) => new Promise((resolve, reject)=>{
    fs.readFile(path,  "utf-8", (err, buf)=>{
        if(err) return reject(err);
        
        resolve(buf.toString());
    })
})
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

## Reemplazar texto en archivos
```js
const replaceData = async ({path, contenido})=>{
    let source = await readFile(path);  // funcion: Leer archivo asyncrono

    if(Array.isArray(contenido)){
        for (let i = 0; i < contenido.length; i++)
            source = source.replace(contenido[i].oldText, contenido[i].newText);

    }else{
        source = source.replace(contenido.oldText, contenido.newText);
    }

    fs.writeFileSync(path+'1', source);
    return source;
}
```
