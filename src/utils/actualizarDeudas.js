import mpl from './mensajesParaLoguear.js'

/**
 * @callback loggerCallback
 * @param {string} error error message to display
 */

/**
 * segunda version, mejora la performance, a la primera version.
 * funciona únicamente si los archivos de deudas y pagos se encuentran previamente ordenados.
 *
 * realiza el apareo con actualizacion entre deudas y pagos, y loguea algunos eventos relevantes.
 *
 * Precondiciones: tanto deudas como pagos estan ordenadas por dni
 * Postcondicion: las deudas aparecen actualizadas y preservan el orden inicial
 *
 * @param {Object[]} deudas las deudas originales
 * @param {Object[]} pagos los pagos a aplicar
 * @param {loggerCallback} logger funcion a la cual llamar en caso de necesitar loguear un evento
 * @returns {Object[]} las deudas actualizadas
 */


/**
 * primera version. acepta pagos y deudas en cualquier orden.
 * baja performance, ya que recorre varias veces los pagos para cada deuda.
 *
 * realiza el apareo con actualizacion entre deudas y pagos, y loguea algunos eventos relevantes.
 *
 * Precondiciones: ninguna
 * Postcondicion: las deudas actualizadas preservan el orden inicial
 *
 * @param {Object[]} deudas las deudas originales
 * @param {Object[]} pagos los pagos a aplicar
 * @param {loggerCallback} logger funcion a la cual llamar en caso de necesitar loguear un evento
 * @returns {Object[]} las deudas actualizadas
 */
function actualizar(deudas, pagos, logger) {
    const resultado = []

    for (const deuda of deudas) {
        for (const pago of pagos) {
            if (pago.dni === deuda.dni) {
                if (coincidenDatosPersonales(pago, deuda)) {
                    deuda.debe -= pago.pago
                } else {
                    logger(mpl.armarMsgPagoConDatosErroneos(deuda, pago))
                }
            }
        }
        if (deuda.debe > 0) {
            resultado.push(deuda)
        } else if (deuda.debe < 0) {
            logger(mpl.armarMsgPagoDeMas(deuda))
        }
        pagos = pagos.filter(p => p.dni !== deuda.dni)
    }

    for (const pago of pagos) {
        logger(mpl.armarMsgPagoSinDeudaAsociada(pago))
    }
    return resultado
}

function coincidenDatosPersonales(pago, deuda) {
    return pago.nombre === deuda.nombre &&
        pago.apellido === deuda.apellido
}

export {
    actualizar
}
