# Funciones utiles para proyectos con JS

## Solo digitos 
```js
const getNumbers = (val) => Array.from(val)
	.filter(el=> !/\D/.test(el))
	.join('');
```

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

## Leer una Imagen
```js
const request = require('request');
const getImage = (url)=> new Promise((resolve, reject)=>{
	request({ url, encoding: null}, (err, resp, buffer) => {
		if(err) return reject(err);
		
		resolve(`data:${resp.headers['content-type']};base64,${buffer.toString('base64')}`);
	});
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

## Crear un Readable stream a partir de un Buffer de datos
```js
const { Readable } = require('stream');

const buffer = new Buffer(img_string, 'base64')
const readable = new Readable()
readable._read = () => {};
readable.push(buffer)
readable.push(null)

readable.pipe(consumer)
```

## Comparacion profunda de objeto | Deep comparison
La forma sencilla:
```js
JSON.stringify(obj1) === JSON.stringify(obj2);
```

La forma compleja
```js
Object.compare = function (obj1, obj2) {
    if(typeof obj1 !== typeof obj2 ) return false;
	//iterar propiedades obj1
	for (let p in obj1) {
		//Verificar si la propiedad existe en ambos objetos
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

		switch (typeof (obj1[p])) {
			//Comparar objetos internos
			case 'object':
				if (!Object.compare(obj1[p], obj2[p])) return false;
				break;
			//Comparar codigo de los metodos internos
			case 'function':
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
				break;
			//Comparar valores primitivos
			default:
				if (obj1[p] != obj2[p]) return false;
		}
	}

	//Verificar si obj2 tiene propiedades extra
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false;
	}
	return true;
};
```
