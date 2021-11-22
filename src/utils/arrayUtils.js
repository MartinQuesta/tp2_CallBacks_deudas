/**
 * ordena (in place) una coleccion de datos segun las claves provistas.
 * @param {Object[]} coleccion el array que quiero ordenar
 * @param {string[]} claves las claves por las que quiero ordenar, por orden de importancia
 */
function ordenar(coleccion, claves) {
    coleccion.sort((obj1, obj2) => {
        let result = 0
        let keepComparing = true
        let i = 0
        while (keepComparing && i < claves.length) {
            if (obj1[claves[i]] < obj2[claves[i]]) {
                result = -1
                keepComparing = false
            } else if (obj1[claves[i]] > obj2[claves[i]]) {
                result = 1
                keepComparing = false
            } else {
                i++
            }
        }
        return result
    })
}

/**
 * chequea si dos arrays tienen el mismo contenido, independientemente de su orden.
 * @param {Object[]} arr1 el primer array a comparar
 * @param {Object[]} arr2 el segundo array a comparar
 */
function mismosElementos(arr1, arr2) {
    for (const elem of arr1) {
        if (!arr2.includes(elem)) {
            return false
        }
    }
    for (const elem of arr2) {
        if (!arr1.includes(elem)) {
            return false
        }
    }
    if (arr1.length != arr2.length) {
        return false
    }
    return true
}

export {
    mismosElementos,
    ordenar
}
