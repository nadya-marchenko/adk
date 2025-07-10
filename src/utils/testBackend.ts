export const testBackendConnection = async (): Promise<void> => {
    const baseUrl = 'http://0.0.0.0:8000';
    
    console.log('🧪 Testing backend connection...');
    console.log('🔗 Base URL:', baseUrl);
    
    // Test 1: Simple fetch to root endpoint
    console.log('\n📡 Test 1: Testing root endpoint...');
    try {
        const response = await fetch(`${baseUrl}/`, {
            method: 'GET',
            mode: 'cors',
        });
        console.log('✅ Root endpoint response:', response.status, response.statusText);
    } catch (error) {
        console.error('❌ Root endpoint failed:', error);
    }
    
    // Test 2: Test sortable fields endpoint
    console.log('\n📡 Test 2: Testing sortable fields endpoint...');
    try {
        const response = await fetch(`${baseUrl}/sortable-fields`, {
            method: 'GET',
            mode: 'cors',
        });
        console.log('✅ Sortable fields response:', response.status, response.statusText);
        if (response.ok) {
            const data = await response.text();
            console.log('📄 Sortable fields data:', data);
        }
    } catch (error) {
        console.error('❌ Sortable fields failed:', error);
    }
    
    // Test 3: Test funds endpoint
    console.log('\n📡 Test 3: Testing funds endpoint...');
    try {
        const response = await fetch(`${baseUrl}/funds`, {
            method: 'GET',
            mode: 'cors',
        });
        console.log('✅ Funds response:', response.status, response.statusText);
        if (response.ok) {
            const data = await response.text();
            console.log('📄 Funds data (first 200 chars):', data.substring(0, 200) + '...');
        }
    } catch (error) {
        console.error('❌ Funds endpoint failed:', error);
    }
    
    // Test 4: Test with query parameters
    console.log('\n📡 Test 4: Testing funds endpoint with parameters...');
    try {
        const response = await fetch(`${baseUrl}/funds?limit=1`, {
            method: 'GET',
            mode: 'cors',
        });
        console.log('✅ Funds with params response:', response.status, response.statusText);
        if (response.ok) {
            const data = await response.text();
            console.log('📄 Funds with params data:', data);
        }
    } catch (error) {
        console.error('❌ Funds with params failed:', error);
    }
    
    console.log('\n🏁 Backend connection test completed!');
};

export const testDirectBackendAccess = (): void => {
    const baseUrl = 'http://0.0.0.0:8000';
    
    console.log('🌐 Manual testing URLs:');
    console.log('Copy and paste these URLs into a new browser tab to test directly:');
    console.log(`\n1. Root: ${baseUrl}/`);
    console.log(`2. Sortable fields: ${baseUrl}/sortable-fields`);
    console.log(`3. Funds: ${baseUrl}/funds`);
    console.log(`4. Funds with limit: ${baseUrl}/funds?limit=5`);
    console.log(`5. Funds with sort: ${baseUrl}/funds?sort_by=return1Year&sort_order=desc&limit=5`);
}; 