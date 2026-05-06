// Quick API test
async function test() {
  try {
    console.log('Testing API...\n');

    // Test categories
    const catRes = await fetch('http://localhost:5000/api/categories');
    const catData = await catRes.json();
    console.log('Categories API:', catRes.ok ? '✅ OK' : '❌ FAIL');
    console.log('Categories found:', catData.categories?.length || 0);

    // Test products
    const prodRes = await fetch('http://localhost:5000/api/products');
    const prodData = await prodRes.json();
    console.log('Products API:', prodRes.ok ? '✅ OK' : '❌ FAIL');
    console.log('Products found:', prodData.products?.length || 0);

    // Test health
    const healthRes = await fetch('http://localhost:5000/api/health');
    const healthData = await healthRes.json();
    console.log('Health API:', healthRes.ok ? '✅ OK' : '❌ FAIL');
    console.log('Server:', healthData);

  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();