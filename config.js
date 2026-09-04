// ============================================================
// CONFIG.JS - CONFIGURAÇÕES CENTRALIZADAS DO AMOVIN ERP
// ============================================================
// Última atualização: 05/09/2026
// Este arquivo é compartilhado por todos os módulos do sistema.
// Para atualizar a chave da API, edite apenas este arquivo.
// ============================================================

var AMOVIN_CONFIG = (function() {
    'use strict';

    // ============================================================
    // CONFIGURAÇÕES GERAIS
    // ============================================================
    var CONFIG = {
        // Versão do sistema
        VERSAO: '2.0.0',
        
        // Nome do sistema
        NOME_SISTEMA: 'AMOVIN ERP Social',
        
        // ============================================================
        // CHAVE DA API GEMINI (GOOGLE AI STUDIO)
        // ============================================================
        // OPÇÃO 1: Deixe vazio ('') para usar a interface do sistema
        // OPÇÃO 2: Cole sua chave aqui para usar em todo o sistema
        // Exemplo: GEMINI_API_KEY: 'AQAb8RN6IzLHStOMb_A2OZXk8S6UVav2qVWUjIYy9agfE9_KLMCA',
        GEMINI_API_KEY: '',
        
        // Modelo da IA (use -latest para evitar erros de modelo não encontrado)
        MODELO_IA: 'gemini-1.5-flash-latest',
        
        // URL base da API do Google
        API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/',
        
        // Configurações de geração
        TEMPERATURA: 0.1,
        MAX_TOKENS: 4000,
        MIME_TYPE: 'application/json',
        
        // Chaves do localStorage
        STORAGE_KEYS: {
            GEMINI_KEY: 'amovin_gemini_key',
            NOTAS_FISCAIS: 'amovin_notas_fiscais',
            PROJETOS: 'amovin_projetos',
            ORCAMENTOS: 'amovin_orcamentos',
            PRODUTOS_ESPERA: 'amovin_produtos_espera',
            CONTATOS: 'amovin_contatos',
            USUARIO_LOGADO: 'amovin_logado',
            USUARIO_PERFIL: 'amovin_perfil',
            USUARIO_NOME: 'amovin_nome',
            USUARIO_LOGIN: 'amovin_usuario'
        }
    };

    // ============================================================
    // FUNÇÕES DE GERENCIAMENTO DA CHAVE
    // ============================================================
    
    /**
     * Obtém a chave da API Gemini
     * Prioridade: 1. CONFIG.GEMINI_API_KEY (hardcoded) 2. localStorage
     */
    function getGeminiKey() {
        // Se a chave está hardcoded no CONFIG, usa ela
        if (CONFIG.GEMINI_API_KEY && CONFIG.GEMINI_API_KEY.length > 20) {
            return CONFIG.GEMINI_API_KEY;
        }
        // Senão, busca do localStorage
        return localStorage.getItem(CONFIG.STORAGE_KEYS.GEMINI_KEY);
    }

    /**
     * Salva a chave da API Gemini no localStorage
     */
    function setGeminiKey(key) {
        if (key && key.trim().length > 20) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.GEMINI_KEY, key.trim());
            CONFIG.GEMINI_API_KEY = key.trim();
            return true;
        }
        return false;
    }

    /**
     * Remove a chave do localStorage
     */
    function clearGeminiKey() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.GEMINI_KEY);
        CONFIG.GEMINI_API_KEY = '';
    }

    /**
     * Verifica se a chave está configurada e válida
     */
    function isKeyConfigured() {
        var key = getGeminiKey();
        return key && key.length > 20 && key !== 'undefined';
    }

    // ============================================================
    // FUNÇÕES DE API (CHAMADAS AO GEMINI)
    // ============================================================

    /**
     * Faz uma chamada à API do Gemini
     * @param {string} prompt - O texto/prompt a ser enviado
     * @param {object} options - Opções adicionais (temperatura, maxTokens, etc.)
     * @returns {Promise<object>} - Resposta da API
     */
    async function callGeminiAPI(prompt, options = {}) {
        var key = getGeminiKey();
        
        if (!isKeyConfigured()) {
            throw new Error('Chave da API Gemini não configurada. Acesse as configurações do sistema.');
        }

        var temperatura = options.temperature !== undefined ? options.temperature : CONFIG.TEMPERATURA;
        var maxTokens = options.maxTokens || CONFIG.MAX_TOKENS;
        var mimeType = options.mimeType || CONFIG.MIME_TYPE;
        var modelo = options.model || CONFIG.MODELO_IA;

        var url = CONFIG.API_URL + modelo + ':generateContent?key=' + key;

        var body = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: temperatura,
                maxOutputTokens: maxTokens,
                response_mime_type: mimeType
            }
        };

        var response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            if (response.status === 400) throw new Error('Chave inválida ou expirada (400).');
            if (response.status === 429) throw new Error('Limite de requisições atingido (429). Aguarde um minuto.');
            if (response.status === 503) throw new Error('Serviço temporariamente indisponível (503).');
            throw new Error('Erro na API: ' + response.status);
        }

        var data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'Erro desconhecido na API');
        }

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Resposta inválida da IA');
        }

        return data;
    }

    /**
     * Extrai dados de texto usando o Gemini com JSON nativo
     * @param {string} texto - Texto a ser processado
     * @param {string} instrucoes - Instruções específicas para extração
     * @returns {Promise<object>} - Dados extraídos em formato JSON
     */
    async function extrairDadosComIA(texto, instrucoes) {
        var prompt = instrucoes + '\n\nTexto:\n' + texto.substring(0, 8000);
        
        var data = await callGeminiAPI(prompt, {
            mimeType: 'application/json',
            temperature: 0.1
        });

        var resposta = data.candidates[0].content.parts[0].text;
        
        try {
            return JSON.parse(resposta);
        } catch (e) {
            // Fallback: tentar extrair JSON com regex
            var match = resposta.match(/\{[\s\S]*\}/);
            if (!match) throw new Error('Não foi possível extrair JSON da resposta');
            return JSON.parse(match[0]);
        }
    }

    // ============================================================
    // FUNÇÕES DE UTILIDADE
    // ============================================================

    /**
     * Formata valor monetário
     */
    function formatarMoeda(valor) {
        return 'R$ ' + (valor || 0).toFixed(2).replace('.', ',');
    }

    /**
     * Formata data para exibição
     */
    function formatarData(data) {
        if (!data) return '—';
        var d = new Date(data);
        return d.toLocaleDateString('pt-BR');
    }

    /**
     * Valida CPF
     */
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        
        var soma = 0;
        for (var i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
        var resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;
        
        soma = 0;
        for (var i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
        resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }

    /**
     * Valida CNPJ
     */
    function validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, '');
        if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
        
        var tamanho = cnpj.length - 2;
        var numeros = cnpj.substring(0, tamanho);
        var digitos = cnpj.substring(tamanho);
        var soma = 0;
        var pos = tamanho - 7;
        
        for (var i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(0))) return false;
        
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        
        for (var i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(1))) return false;
        
        return true;
    }

    /**
     * Limpa string de caracteres especiais
     */
    function limparString(str) {
        if (!str) return '';
        return str.replace(/[^\w\s@.\-()/]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    /**
     * Gera ID único
     */
    function gerarID() {
        return Date.now() + Math.random() * 1000;
    }

    /**
     * Mostra toast de notificação
     */
    function mostrarToast(mensagem, tipo) {
        var toast = document.createElement('div');
        var classes = { 
            'success': 'toast-success', 
            'error': 'toast-error', 
            'info': 'toast-info', 
            'warning': 'toast-warning' 
        };
        toast.className = 'toast ' + (classes[tipo] || 'toast-info');
        toast.textContent = mensagem;
        document.body.appendChild(toast);
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.4s ease';
            setTimeout(function() { toast.remove(); }, 400);
        }, 4000);
    }

    // ============================================================
    // RETORNAR API PÚBLICA
    // ============================================================
    return {
        // Configurações
        CONFIG: CONFIG,
        
        // Gerenciamento de chave
        getGeminiKey: getGeminiKey,
        setGeminiKey: setGeminiKey,
        clearGeminiKey: clearGeminiKey,
        isKeyConfigured: isKeyConfigured,
        
        // API
        callGeminiAPI: callGeminiAPI,
        extrairDadosComIA: extrairDadosComIA,
        
        // Utilidades
        formatarMoeda: formatarMoeda,
        formatarData: formatarData,
        validarCPF: validarCPF,
        validarCNPJ: validarCNPJ,
        limparString: limparString,
        gerarID: gerarID,
        mostrarToast: mostrarToast
    };

})();

// ============================================================
// LOG DE INICIALIZAÇÃO
// ============================================================
console.log('️ AMOVIN Config v' + AMOVIN_CONFIG.CONFIG.VERSAO + ' carregado');
console.log(' Chave Gemini:', AMOVIN_CONFIG.isKeyConfigured() ? 'Configurada ✅' : 'Não configurada ❌');
console.log('🤖 Modelo IA:', AMOVIN_CONFIG.CONFIG.MODELO_IA);
