import fs from 'fs';
import normalizeData from '../utils/normalizeData.js';
import logger from '../logger/logger.js';
export default class ContainerFs {
	constructor(ruta) {
		this.ruta = ruta;
	}

	async getArchivo() {
		try {
			const archivo = JSON.parse(
				await fs.promises.readFile(this.ruta, 'utf-8')
			);
			return archivo;
		} catch (error) {
			logger.error(`Error al leer el archivo ${error}`);
			return [];
		}
	}

	async getNormalizedMensajes() {
		const archivo = await this.getArchivo();
		return normalizeData(archivo);
	}

	async save(mensaje) {
		const archivo = await this.getArchivo();
		const mensajes = archivo.mensajes;
		mensajes.push({ ...mensaje });
		try {
			await fs.promises.writeFile(this.ruta, JSON.stringify(archivo));
		} catch (error) {
			logger.error(`Hubo un error al guardar el archivo ${error}`);
		}
	}
}
