import fs from 'fs'
import { actualizar } from './actualizarDeudas.js'
import { ordenar } from '../../src/utils/arrayUtils.js'

/**
 * recibe las rutas del archivo de deudas original, archivo de pagos, archivo de deudas con las actualizaciones, y archivo de log para registrar errores o advertencias.
 * @param {string} rutaDeudasOld
 * @param {string} rutaPagos
 * @param {string} rutaDeudasNew
 * @param {string} rutaLog
 */
function actualizarArchivosDeudas(rutaDeudasOld, rutaPagos, rutaDeudasNew, rutaLog) {

    try {
        const deudasOldAsArr = JSON.parse(fs.readFileSync(rutaDeudasOld))
        const pagosAsArr = JSON.parse(fs.readFileSync(rutaPagos))

        ordenar(deudasOldAsArr, ['dni'])
        ordenar(pagosAsArr, ['dni'])

        const deudasNew = actualizar(deudasOldAsArr, pagosAsArr, (mensaje) => {
            fs.appendFileSync(rutaLog, mensaje)
        })

        fs.writeFileSync(rutaDeudasNew, JSON.stringify(deudasNew, null, 2))
    } catch (err) {
        console.log(err)
    }
}

// no modificar la interfaz pública!
export default {
    actualizarArchivosDeudas
}
