/**
 * Función para asegurar independencia de los tests de samples 
 * y no depender de otro test para tener un token de sesión válido
 */
 async function okLogin()
 {
    // 1. Login como productor (pepe) para obtener un token válido
     const response = await fetch('/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ username: 'pepe', password: '12345' }) // Usamos pepe hardcodeado
     });
     const data = await response.json();
     // Guardamos el token para tests de samples
     localStorage.setItem('test_token', data.token);
 }

/**
 * Test: GET /api/samples/my-samples
 */
 testUtils.createTestButton("Test Listar Mis Samples", async (btn) => {
    // 1. Asegurar y guardar una sesión válida
    await okLogin();
    const token = localStorage.getItem('test_token');
    
    // 2. Realizar la petición
    const response = await fetch('/api/samples/my-samples', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    testUtils.log(data);
    if (response.ok) testUtils.setSuccess(btn);
});

/**
 * Test: POST /api/samples/upload (Simulado)
 */
testUtils.createTestButton("Test Subir Sample (Simulado)", async (btn) => {
    // 1. Asegurar y guardar una sesión válida
    await okLogin();
    const token = localStorage.getItem('test_token');
    
    // Creamos un FormData
    const formData = new FormData();
    formData.append('display_name', 'Test Loop Pedagogico');
    formData.append('category', 'Drums');
    formData.append('bpm', '120');

    // Simulamos un archivo WAV (binario vacío para la prueba)
    const blob = new Blob(["Simulated Audio Content"], { type: 'audio/wav' });
    formData.append('audioFile', blob, 'DRUM_LOOP_01.wav');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);
    if (response.ok) testUtils.setSuccess(btn);
});


/**
 * Test: DELETE /api/samples/99999 - Borrado Fantasma (HTTP 404 Not Found)
 */
testUtils.createTestButton("Test Borrado Fantasma (ID invalido 99999)", async (btn) => {
    // 1. Asegurar y guardar una sesión válida
    await okLogin();
    const token = localStorage.getItem('test_token');
    
    // 2. Intentar borrar un ID que no existe 
    const response = await fetch('/api/samples/99999', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
   
    const data = await response.json();
    testUtils.log(data);
    if (response.status === 404) testUtils.setSuccess(btn);
});
/**
 *Test: Manipulación del Token JWT
 */
testUtils.createTestButton("Manipulación del Token JWT", async (btn) => {

    // 1) Obtener token válido
    await okLogin();

    const token =
        localStorage.getItem('test_token');

    // 2) Alterar un carácter
    const badToken =
        token.slice(0, -1) + 'X';

    // 3) Intentar acceder a una ruta protegida
    const response =
        await fetch('/api/samples/my-samples', {
            headers: {
                'Authorization':
                    `Bearer ${badToken}`
            }
        });

    const data =
        await response.json();

    testUtils.log(data);

    // 4) El éxito es que falle
    if(response.status === 401)
        testUtils.setSuccess(btn);
});

/**
 * Test: Validación 6 - BPM inválido (HTTP 400)
 */
testUtils.createTestButton("Test Subir Sample - BPM Inválido (-15)", async (btn) => {
    // 1. Asegurar sesión válida
    await okLogin();
    const token = localStorage.getItem('test_token');

    // 2. Armar FormData con BPM ilógico
    const formData = new FormData();
    formData.append('display_name', 'Test BPM Invalido');
    formData.append('category', 'Drums');
    formData.append('bpm', '-15');

    const blob = new Blob(["Simulated Audio Content"], { type: 'audio/wav' });
    formData.append('audioFile', blob, 'TEST_BPM_INVALIDO.wav');

    // 3. Enviar la petición
    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);

    // 4. Exitoso si el servidor rechaza con 400
    if (response.status === 400) {
        testUtils.setSuccess(btn);
    }
});