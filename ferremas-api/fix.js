const bcrypt = require('bcryptjs');
const db = require('./src/config/database');

async function fixPasswords() {
    try {
        console.log('Generando hash de seguridad...');
        // Generamos un hash real y válido para la contraseña 'password123'
        const hashReal = await bcrypt.hash('password123', 10);

        // Actualizamos todos los usuarios de prueba con el nuevo hash seguro
        await db.execute('UPDATE Usuario SET password_hash = ?', [hashReal]);

        console.log('✅ ¡Éxito! Todas las contraseñas de prueba fueron encriptadas y actualizadas a: password123');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixPasswords();