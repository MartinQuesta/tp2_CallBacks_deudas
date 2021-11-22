import util from 'util'

/**
 * arma un mensaje informando los detalles de un pago que no corresponde a ninguna deuda
 * @param {Object} pago el pago sin deuda correspondiente
 * @returns {string} el mensaje a logguear
 */
function armarMsgPagoSinDeudaAsociada(pago) {
    const logMsg = `
el siguiente pago no corresponde a ninguna deuda:
${util.inspect(pago)}

=================================
`
    return logMsg
}

/**
 * arma un mensaje indicando el dni del sujeto que pagó de más, y cuanto dinero quedó a su favor
 * @param {Object} deuda la deuda con excedente de pago
 * @returns {string} el mensaje a logguear
 */
function armarMsgPagoDeMas(deuda) {
    const logMsg = `
dni: ${deuda.dni} posee $${Math.abs(deuda.debe)} a su favor

=================================
`
    return logMsg
}

/**
 * arma un mensaje mostrando la deuda, y el pago que no se pudo concretar, y notifica que el registro permanece sin cambios.
 * @param {Object} deuda
 * @param {Object} pago
 * @returns {string} el mensaje a logguear
 */
function armarMsgPagoConDatosErroneos(deuda, pago) {
    const logMsg = `
error al querer actualizar esta deuda:
${util.inspect(deuda)}
con este pago:
${util.inspect(pago)}

se mantiene el registro original sin cambios

=================================
`
    return logMsg
}

export default {
    armarMsgPagoDeMas,
    armarMsgPagoConDatosErroneos,
    armarMsgPagoSinDeudaAsociada
}
