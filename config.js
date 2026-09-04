var AMOVIN_CONFIG = (function() {
    'use strict';

    var CONFIG = {
        VERSAO: '2.2.0',
        NOME_SISTEMA: 'AMOVIN ERP Social',
        GEMINI_API_KEY: '', // Deixe vazio para usar a interface, ou cole sua chave aqui
        
        // ✅ MODELO CORRETO: Descoberto via script de listagem
        // Opções válidas para sua chave:
        // - gemini-3.8-flash (mais recente, estável)
        // - gemini-3.6-flash (recomendado)
        // - gemini-flash-latest (alias, sempre atualiza)
        MODELO_IA: 'gemini-3.6-flash',
        
        API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/',
        TEMPERATURA: 0.1,
        MAX_TOKENS: 4000,
        MIME_TYPE: 'application/json',
        
        STORAGE_KEYS: {
            GEMINI_KEY: 'amovin_gemini_key',
            NOTAS_FISCAIS: 'amovin_notas_fiscais',
            PROJETOS: 'amovin_projetos',
            ORCAMENTOS: 'amovin_orcamentos',
            PRODUTOS_ESPERA: 'amovin_produtos_espera',
            CONTATOS: 'amovin_contatos',
            USUARIO_LOGADO: 'amovin_logado'
        }
    };

    function getGeminiKey() {
        if (CONFIG.GEMINI_API_KEY && CONFIG.GEMINI_API_KEY.length > 20) return CONFIG.GEMINI_API_KEY;
        return localStorage.getItem(CONFIG.STORAGE_KEYS.GEMINI_KEY);
    }

    function setGeminiKey(key) {
        if (key && key.trim().length > 20) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.GEMINI_KEY, key.trim());
            CONFIG.GEMINI_API_KEY = key.trim();
            return true;
        }
        return false;
    }

    function isKeyConfigured() {
        var key = getGeminiKey();
        return key && key.length > 20 && key !== 'undefined';
    }

    async function callGeminiAPI(prompt, options = {}) {
        var key = getGeminiKey();
        if (!isKeyConfigured()) throw new Error('Chave da API não configurada.');

        // ✅ MODELO: usa o passado ou o padrão do CONFIG
        var modelo = options.model || CONFIG.MODELO_IA || 'gemini-3.6-flash';
        
        // Remove "models/" se vier com prefixo (para evitar duplicação na URL)
        modelo = modelo.replace('models/', '');
        
        var url = CONFIG.API_URL + modelo + ':generateContent?key=' + key;

        var body = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: options.temperature !== undefined ? options.temperature : CONFIG.TEMPERATURA,
                maxOutputTokens: options.maxTokens || CONFIG.MAX_TOKENS,
                response_mime_type: options.mimeType || CONFIG.MIME_TYPE
            }
        };

        var response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            if (response.status === 400) throw new Error('Chave inválida ou API não ativada (400).');
            if (response.status === 404) throw new Error('Modelo "' + modelo + '" não encontrado. Use: gemini-3.6-flash, gemini-2.5-flash ou gemini-flash-latest');
            if (response.status === 429) throw new Error('Limite de requisições atingido (429).');
            throw new Error('Erro na API: ' + response.status);
        }

        var data = await response.json();
        if (data.error) throw new Error(data.error.message || 'Erro desconhecido na API');
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) throw new Error('Resposta vazia da IA');

        return data;
    }

    function mostrarToast(mensagem, tipo) {
        var toast = document.createElement('div');
        var classes = { 'success': 'toast-success', 'error': 'toast-error', 'info': 'toast-info', 'warning': 'toast-warning' };
        toast.className = 'toast ' + (classes[tipo] || 'toast-info');
        toast.textContent = mensagem;
        toast.style.cssText = 'position:fixed;top:20px;right:20px;padding:16px 24px;border-radius:12px;color:white;font-weight:600;font-size:14px;z-index:10000;box-shadow:0 8px 32px rgba(0,0,0,0.15);animation:slideInRight 0.4s ease;max-width:400px;';
        if (tipo === 'success') toast.style.background = '#57C220';
        else if (tipo === 'error') toast.style.background = '#E53935';
        else if (tipo === 'warning') toast.style.background = '#D97706';
        else toast.style.background = '#1E88E5';
        
        document.body.appendChild(toast);
        setTimeout(function() {
            toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = 'all 0.4s ease';
            setTimeout(function() { toast.remove(); }, 400);
        }, 4000);
    }

    return {
        CONFIG: CONFIG,
        getGeminiKey: getGeminiKey,
        setGeminiKey: setGeminiKey,
        isKeyConfigured: isKeyConfigured,
        callGeminiAPI: callGeminiAPI,
        mostrarToast: mostrarToast
    };
})();

console.log('⚙️ AMOVIN Config v' + AMOVIN_CONFIG.CONFIG.VERSAO + ' carregado');
console.log('🤖 Modelo IA:', AMOVIN_CONFIG.CONFIG.MODELO_IA);
