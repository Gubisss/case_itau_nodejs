// idempotency.test.js
const axios = require('axios');

// --- CONFIGURAÇÕES DE TESTE ---
const API_BASE_URL = 'http://localhost:8080'; 
const DEBIT_AMOUNT = 100; // Valor a ser debitado/depositado nos testes

// Função principal de teste de idempotência
async function testIdempotency() {
    console.log('\n=== Teste de Idempotência em Transações Financeiras ===\n');

    let clientId;
    let initialBalance;
    let finalBalanceAfterIdentical; 
    let newFinalBalance;          
    
    try {
        // 1. Criar cliente para teste
        console.log('1. Criando cliente para teste...');
        const createResponse = await axios.post(`${API_BASE_URL}/clientes`, {
            nome: 'Cliente Teste Idempotência',
            email: `teste.idempotencia.${Date.now()}@example.com`
        });
        clientId = createResponse.data.id;
        console.log(`✅ Cliente criado com ID: ${clientId}`);

        // 2. Fazendo depósito inicial para ter saldo
        console.log('\n2. Fazendo depósito inicial...');
        // Gerar uma chave de idempotência para o depósito inicial
        const initialDepositIdempotencyKey = `deposit-initial-${Date.now()}`;
        await axios.post(`${API_BASE_URL}/clientes/${clientId}/depositar`, {
            valor: 1000 // Depósito de 1000 para começar
        }, {
            headers: { 'Idempotency-Key': initialDepositIdempotencyKey }
        });
        console.log('✅ Depósito inicial de R$ 1000 realizado.');


        // 3. Verificar saldo inicial
        console.log('\n3. Verificando saldo inicial...');
        const initialBalanceResponse = await axios.get(`${API_BASE_URL}/clientes/${clientId}`);
        initialBalance = initialBalanceResponse.data.saldo;
        console.log(`✅ Saldo inicial: R$ ${initialBalance}`);

        // --- 4. TESTE DE IDEMPOTÊNCIA: mesma chave, múltiplas requisições ---
        console.log('\n4. TESTE DE IDEMPOTÊNCIA: mesma chave, múltiplas requisições');
        const idempotencyKey = `test-idempotency-${Date.now()}`; // Chave única para este teste
        console.log(`Usando Idempotency-Key: ${idempotencyKey}`);
        console.log(`Enviando 5 requisições idênticas (saques de R$ ${DEBIT_AMOUNT})...`);

        const identicalRequests = Array(5).fill(null).map(() => 
            axios.post(`${API_BASE_URL}/clientes/${clientId}/sacar`, {
                valor: DEBIT_AMOUNT
            }, {
                headers: { 'Idempotency-Key': idempotencyKey }
            }).catch(error => {
                return { status: 'rejected', reason: error.response?.data || error.message };
            })
        );

        const startTime = Date.now();
        const results = await Promise.allSettled(identicalRequests); // Envia todas simultaneamente
        const endTime = Date.now();

        // 5. Analisar resultados
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        console.log('\nResultados das requisições idênticas:');
        console.log(`- Sucesso: ${successful}`);
        console.log(`- Falhas/Rejeições: ${failed}`);
        console.log(`- Tempo total: ${(endTime - startTime) / 1000} segundos`);

        // 6. Verificar saldo final
        const finalResponseAfterIdenticalReqs = await axios.get(`${API_BASE_URL}/clientes/${clientId}`);
        finalBalanceAfterIdentical = finalResponseAfterIdenticalReqs.data.saldo; // ATRIBUIÇÃO, não declaração
        console.log(`\nSaldo real após requisições idênticas: R$ ${finalBalanceAfterIdentical}`);

        // 7. Validar idempotência
        // Apenas UM saque de DEBIT_AMOUNT deveria ter sido processado.
        const expectedBalanceAfterIdentical = initialBalance - DEBIT_AMOUNT;

        if (finalBalanceAfterIdentical === expectedBalanceAfterIdentical) {
            console.log('\n✅ TESTE DE IDEMPOTÊNCIA PASSOU!');
            console.log('    - Apenas uma transação foi processada.');
            console.log('    - Requisições duplicadas foram ignoradas.');
            console.log(`    - Saldo está correto: R$ ${expectedBalanceAfterIdentical}`);
        } else {
            console.log('\n❌ TESTE DE IDEMPOTÊNCIA FALHOU!');
            console.log(`    - Saldo esperado: R$ ${expectedBalanceAfterIdentical}`);
            console.log(`    - Saldo obtido: R$ ${finalBalanceAfterIdentical}`);
            console.log('    - Múltiplas transações podem ter sido processadas ou houve outro erro.');
        }

        // --- 8. TESTE ADICIONAL: Nova chave deve permitir nova transação ---
        console.log('\n\n--- 8. TESTE ADICIONAL: Nova chave deve permitir nova transação ---');
        console.log('Testando nova transação com nova chave...');
        const newIdempotencyKey = `teste-new-${Date.now()}`; // Nova chave
        
        await axios.post(`${API_BASE_URL}/clientes/${clientId}/sacar`, {
            valor: DEBIT_AMOUNT
        }, {
            headers: { 'Idempotency-Key': newIdempotencyKey }
        });
        console.log(`✅ Nova transação (saque de R$ ${DEBIT_AMOUNT}) processada com sucesso usando a chave: ${newIdempotencyKey}`);

        const finalBalanceResponse = await axios.get(`${API_BASE_URL}/clientes/${clientId}`);
        newFinalBalance = finalBalanceResponse.data.saldo; // ATRIBUIÇÃO, não declaração
        const expectedNewBalance = expectedBalanceAfterIdentical - DEBIT_AMOUNT;

        if (newFinalBalance === expectedNewBalance) {
            console.log('✅ Nova transação com nova chave processada corretamente!');
            console.log(`    - Saldo final esperado: R$ ${expectedNewBalance}`);
            console.log(`    - Saldo final obtido: R$ ${newFinalBalance}`);
        } else {
            console.log('❌ Nova transação falhou!');
            console.log(`    - Saldo final esperado: R$ ${expectedNewBalance}`);
            console.log(`    - Saldo final obtido: R$ ${newFinalBalance}`);
        }

    } catch (error) {
        console.error('\n❌ ERRO DURANTE O TESTE:', error.response?.data || error.message);
    } finally {
        // Resumo Final
        console.log('\n--- Resumo Final ---');
        const currentInitialBalance = initialBalance !== undefined ? initialBalance : 'N/A';
        const currentFinalBalanceAfterIdentical = finalBalanceAfterIdentical !== undefined ? finalBalanceAfterIdentical : 'N/A';
        const currentNewFinalBalance = newFinalBalance !== undefined ? newFinalBalance : 'N/A';

        console.log(`Saldo Inicial (após depósito): R$ ${currentInitialBalance}`);
        console.log(`Saldo após 5 requisições idênticas (1 processada): R$ ${currentFinalBalanceAfterIdentical}`);
        console.log(`Saldo final (após nova transação): R$ ${currentNewFinalBalance}`);
        
        console.log(`\nTestes de idempotência concluídos para o cliente ID: ${clientId !== undefined ? clientId : 'N/A'}`);
        console.log(`\n### Teste de Idempotência Concluído! ###`);

    }
}

// --- Executar o teste ---
console.log('--- Iniciando teste de Idempotência ---');
testIdempotency().then(() => {
    console.log('\n### Teste de Idempotência concluído! ###');
}).catch(error => {
    console.error('\nERRO CRÍTICO NA EXECUÇÃO DO TESTE:', error.message);
});