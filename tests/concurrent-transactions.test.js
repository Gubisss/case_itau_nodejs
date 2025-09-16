const axios = require('axios');

// --- PARÂMETROS DO TESTE ---
const API_BASE_URL = 'http://localhost:8080'; // Porta correta da sua API
const CLIENT_ID = 1;                          // ID do cliente para teste
const DEBIT_AMOUNT = 100;                     // Valor a ser debitado em cada requisição
const CONCURRENT_REQUESTS = 10;               // Número de requisições simultâneas

async function runTest() {
    console.log('\n=== Teste de Concorrência em Transações Financeiras ===\n');

    try {
        // 1. Verificar o saldo inicial
        const initialBalanceResponse = await axios.get(`${API_BASE_URL}/clientes/${CLIENT_ID}`);
        const initialBalance = initialBalanceResponse.data.saldo;
        console.log(`🏦 Saldo inicial do cliente ${CLIENT_ID}: R$ ${initialBalance}`);

        const expectedFinalBalance = initialBalance - (DEBIT_AMOUNT * CONCURRENT_REQUESTS);
        console.log(`\n📊 Configuração do teste:`);
        console.log(`   - Número de saques simultâneos: ${CONCURRENT_REQUESTS}`);
        console.log(`   - Valor de cada saque: R$ ${DEBIT_AMOUNT}`);
        console.log(`   - Saldo final esperado: R$ ${expectedFinalBalance}`);
        console.log('\n🚀 Iniciando requisições simultâneas...\n');

        // 2. Criar requisições de saque simultâneas
        const requests = Array(CONCURRENT_REQUESTS).fill().map((_,index) => 
            axios.post(`${API_BASE_URL}/clientes/${CLIENT_ID}/sacar`, {
                valor: DEBIT_AMOUNT
            }, {
                headers: { 'idempotency-key': `test-${Date.now()}-${index}-${Math.random()}` } // Chave única para cada requisição
            })
        );

        // 3. Executar todas as requisições simultaneamente
        const startTime = Date.now();
        const results = await Promise.allSettled(requests);
        const endTime = Date.now();

        // 4. Analisar resultados
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        console.log('📝 Resultados das requisições:');
        console.log(`   - Sucesso: ${successful}`);
        console.log(`   - Falhas: ${failed}`);
        console.log(`   - Tempo total: ${(endTime - startTime)/1000} segundos`);

        // 5. Verificar saldo final
        const finalBalanceResponse = await axios.get(`${API_BASE_URL}/clientes/${CLIENT_ID}`);
        const finalBalance = finalBalanceResponse.data.saldo;
        console.log(`\n🏦 Saldo final: R$ ${finalBalance}`);

        // 6. Análise do resultado
        const difference = expectedFinalBalance - finalBalance;
        if (difference === 0) {
            console.log('\n✅ TESTE PASSOU: Transações processadas corretamente!');
            console.log('   O saldo final está exatamente como esperado.');
        } else {
            console.log('\n⚠️ POTENCIAL PROBLEMA DETECTADO:');
            console.log(`   - Saldo esperado: R$ ${expectedFinalBalance}`);
            console.log(`   - Saldo atual: R$ ${finalBalance}`);
            console.log(`   - Diferença: R$ ${Math.abs(difference)}`);
        }

    } catch (error) {
        console.error('\n❌ ERRO DURANTE O TESTE:', error.message);
    }
}

// Executar o teste
console.log('🔄 Iniciando teste de concorrência...');
runTest().then(() => {
    console.log('\n✨ Teste concluído!');
});