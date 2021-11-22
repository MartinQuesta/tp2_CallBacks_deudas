import assert from 'assert'
import { actualizar } from '../../src/utils/actualizarDeudas.js'
import mpl from '../../src/utils/mensajesParaLoguear.js'
import { mismosElementos, ordenar } from '../../src/utils/arrayUtils.js'

describe('apareoConActualizacion', function () {
  describe('actualizarDeudas', function () {
    describe('si no se reciben deudas ni pagos', function () {
      it('devuelve una coleccion vacia', function () {
        const deudas = []
        const pagos = []
        const logger = () => { }
        const resultado = actualizar(deudas, pagos, logger)
        assert.deepStrictEqual(resultado, [])
      })
    })
    describe('si recibe deudas pero no pagos', function () {

      it('devuelve las mismas deudas', function () {
        const deudas = [{
          id: 3,
          dni: 345,
          nombre: "lisa",
          apellido: "fernandez",
          debe: 200
        }]
        const pagos = []
        const logger = () => { }
        const resultado = actualizar(deudas, pagos, logger)
        assert.deepStrictEqual(resultado, deudas)
      })
    })

    describe(`si los pagos son menores a la deuda`, function () {
      it(`esta se reduce en forma acorde en el resultado`, function () {
        const deudas = [{
          id: 3,
          dni: 345,
          nombre: "lisa",
          apellido: "fernandez",
          debe: 200
        }]
        const pagos = [{
          dni: 345,
          nombre: "lisa",
          apellido: "fernandez",
          pago: 100
        }]
        const logger = () => { }
        const resultado = actualizar(deudas, pagos, logger)
        assert.deepStrictEqual(resultado, esperado)
      })
    })
    describe(`si los pagos igualan o superan la deuda`, function () {
      it(`esta no aparece en el resultado`, function () {
        const deudas = [{
          id: 3,
          dni: 345,
          nombre: "lisa",
          apellido: "fernandez",
          debe: 200
        }]
        const pagos = [{
          dni: 345,
          nombre: "lisa",
          apellido: "fernandez",
          pago: 100
        }]
        const esperado = []
        const logger = () => { }
        const resultado = actualizar(deudas, pagos, logger)
        assert.deepStrictEqual(resultado, esperado)
      })
    })
    describe(`si los pagos superan la deuda`, function () {
      it(`ademas loguea un mensaje de error`, function () {
        const deudas = [{
          id: 3,
          dni: 345,
          nombre: "lisa",
          apellido: "fernandez",
          debe: 200
        }]
        const msjEsperado = mpl.armarMsgPagoDeMas({
          id: 3,
          dni: 345,
          nombre: "lisa",
          apellido: "fernandez",
          debe: -100
        })
        let mensajeGenerado
        const logger = (mensaje) => {
          mensajeGenerado = mensaje
        }
        actualizar(deudas, pagos, logger)
        assert.equal(mensajeGenerado, msjEsperado)
      })
    })
    describe(`si entre una deuda y un pago coinciden dni, pero no su nombre y apellido`, function () {
      it(`no se procesa y loguea un mensaje de error`, function () {
        const deuda = {
          id: 3,
          dni: 345,
          nombre: "lisa",
          apellido: "fernandez",
          debe: 200
        }
        const pago = {
          dni: 345,
          nombre: "juan",
          apellido: "perez",
          pago: 300
        }
        const msjEsperado = mpl.armarMsgPagoConDatosErroneos(deuda, pago)
        let mensajeGenerado
        const logger = (mensaje) => {
          mensajeGenerado = mensaje
        }
        const resultado = actualizar([deuda], [pago], logger)
        assert.deepStrictEqual(resultado, [deuda])
        assert.equal(mensajeGenerado, msjEsperado)
      })
    })
    describe(`si algun pago no tiene deuda asociada`, function () {
      it(`no se procesa y loguea un mensaje de error`, function () {
        const deuda = {
          id: 3,
          dni: 345,
          nombre: "lisa",
          apellido: "fernandez",
          debe: 200
        }
        const pago = {
          dni: 456,
          nombre: "juan",
          apellido: "perez",
          pago: 300
        }
        const msjEsperado = mpl.armarMsgPagoSinDeudaAsociada(pago)
        let mensajeGenerado
        const logger = (mensaje) => {
          mensajeGenerado = mensaje
        }
        const resultado = actualizar([deuda], [pago], logger)
        assert.deepStrictEqual(resultado, [deuda])
        assert.equal(mensajeGenerado, msjEsperado)
      })
    })
    describe(`en casos mas complejos, con muchas deudas y pagos, previamente ordenados`, function () {
      it(`pueden loguearse numerosos mensajes, y se preserva el orden de las deudas`, function () {
        const muchasDeudas = [
          {
            id: 1,
            dni: 123,
            nombre: "pepe",
            apellido: "perez",
            debe: 400
          },
          {
            id: 2,
            dni: 234,
            nombre: "coca",
            apellido: "gutierrez",
            debe: 300
          }
        ]
        const muchosPagos = [
          {
            dni: 123,
            fecha: "2019-03-23T17:13:26.000Z",
            nombre: "pepe",
            apellido: "perez",
            pago: 400
          },
        {
          id: 4,
          dni: 456,
          nombre: "paul",
          apellido: "lopez",
          debe: 600
        },
        {
          id: 5,
          dni: 567,
          nombre: "ariel",
          apellido: "martinez",
          debe: 120
        }]

        const msjEsperado1 = mpl.armarMsgPagoConDatosErroneos({
          id: 4,
          dni: 456,
          nombre: "paul",
          apellido: "lopez",
          debe: 600
        }, {
          dni: 456,
          fecha: "2019-03-23T17:13:26.000Z",
          nombre: "paul",
          apellido: "Ropez",
          pago: 100
        })
        const msjEsperado2 = mpl.armarMsgPagoDeMas({
          id: 2,
          dni: 234,
          nombre: "coca",
          apellido: "gutierrez",
          debe: -100
        })
        const msjEsperado3 = mpl.armarMsgPagoSinDeudaAsociada({
          dni: 678,
          fecha: "2019-03-22T17:00:26.000Z",
          nombre: "daniela",
          apellido: "gimenez",
          pago: 100
        })

        const mensajesEsperados = [
          msjEsperado2,
          msjEsperado3,
          msjEsperado1,
        ]

        const mensajesGenerados = []
        const logger = (mensaje) => {
          mensajesGenerados.push(mensaje)
        }

        const resultado = actualizar(muchasDeudas, muchosPagos, logger)

        assert.deepStrictEqual(resultado, deudasActualizadas)
        assert.equal(mismosElementos(mensajesGenerados, mensajesEsperados), true)
      })
    })
  })
})