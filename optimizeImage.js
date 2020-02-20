const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

module.exports = (()=>{

	const handler = async ({body}, ctx) => {
		try {

			if(!body){
				console.log('Error :', "Falta enviar el cuerpo de la peticion");

				return {
					statusCode:400,
					body: "Falta enviar el cuerpo de la peticion"
				}
			} 

			const { base64 } = JSON.parse(body);
			if(!base64){
				console.log('Error :', `Falta enviar el base64`);

				return {
					statusCode:400,
					body: `Falta enviar el base64`
				};
			} 
		
		
			const file = await imagemin.buffer(Buffer.from(base64), {
				destinationPath: 'tmp/',
				plugins: [
					imageminMozjpeg({quality: 50}),
					imageminPngquant({
						quality: [0.6, 0.8]
					})
				]
			});

			return {
				statusCode: 200,
				body: JSON.stringify({result: file.toString()}),
			};

		} catch (error) {
			console.log(error);
			
			return {
				statusCode: 500,
				body: JSON.stringify(error),
			};
		}
	}

	return { handler }

})();