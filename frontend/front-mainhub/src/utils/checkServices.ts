// Script para verificar la conexión con los servicios backend

const AUTH_URL = 'http://localhost:8082';
const USER_URL = 'http://localhost:8081';

async function checkService(name: string, url: string) {
  try {
    const response = await fetch(url);
    console.log(`✅ ${name} está corriendo en ${url}`);
    return true;
  } catch (error) {
    console.error(`❌ ${name} NO está disponible en ${url}`);
    console.error(`   Error: ${error}`);
    return false;
  }
}

async function checkAllServices() {
  console.log('🔍 Verificando servicios backend...\n');
  
  const authOk = await checkService('Auth Service', AUTH_URL);
  const userOk = await checkService('User Service', USER_URL);
  
  console.log('\n📊 Resultado:');
  if (authOk && userOk) {
    console.log('✅ Todos los servicios están disponibles');
    console.log('🚀 Puedes iniciar el frontend con: npm run dev');
  } else {
    console.log('⚠️  Algunos servicios no están disponibles');
    console.log('💡 Ejecuta: docker-compose up -d');
  }
}

// Ejecutar verificación si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  checkAllServices();
}

export { checkService, checkAllServices };
