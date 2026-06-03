/**
* Project     : Sample Vault
* Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
* License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
* Date        : Marzo 2026
*/

const express = require('express');
const router = express.Router();
/**
 * Módulo/Biblioteca para el manejo de rutas:
 */
const path = require('path');git

// --- Rutas de Navegación del Frontend HTML ---

// Al entrar a http://localhost:3000/ cargamos el laboratorio de pruebas
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/html/tests.html'));
});

// Rutas amigables para las pantallas (Apuntando a tests.html temporalmente):
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/html/tests.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/html/register.html'));
});

router.get('/producer-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/html/producer-dashboard.html'));
});

router.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/html/admin-dashboard.html'));
});

/**
 * @refactoring poner condición para cuando pide un archivo y no una uri
 * Captura de rutas inexistentes (404)
 * Si el usuario intenta acceder a una ruta que no existe,
 * se lo redirige automáticamente al panel de tests por seguridad y UX.
 */
router.use((req, res) => {
    // Si la petición pide un archivo (tiene extensión), mejor devolver un 404 seco
    // para no romper el debug de scripts/estilos.
    if (req.path.includes('.')) {
        return res.status(404).send('Recurso no encontrado');
    }

    // Si es una ruta de navegación falsa, servimos los tests en vez del login
    res.status(404).sendFile(path.join(__dirname, '../../frontend/html/tests.html'));
});

module.exports = router;