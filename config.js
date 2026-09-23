/**
 * 📄 AMOVIN ERP - config.js
 * Versão: 8.0 (Compatível com Chaves AQ. e Modelos Gemini 3.8 Flash)
 * Descrição: Centraliza a chave da API, chamadas à IA e utilitários do sistema.
 */

const AMOVIN_CONFIG = {
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/',

    // Modelos atualizados (Setembro/2026) - Ordem de prioridade
    MODELOS_DISPONIVEIS: [
        'gemini-3.8-flash',      // Principal - melhor para NF-e
        'gemini-3.7-flash',      // Fallback 1
        'gemini-3.6-flash',      // Fallback 2
        'gemini-3.5-flash-lite'  // Fallback econômico
    ],

    MODELO_IA: 'gemini-3.8-flash',

    MAX_TENTATIVAS: 3,
    ESPERA_INICIAL: 1500,

    getGeminiKey: function() {
        return localStorage.getItem('amovin_gemini_key') || '';
    },

    setGeminiKey: function(key) {
        if (key && key.trim().length > 20) {
            localStorage.setItem('amovin_gemini_key', key.trim());
            return true;
        }
        return false;
    },

    _chamarAPI: async function(prompt, model, options) {
        const apiKey = this.getGeminiKey();
        const isJSON = options.json || false;
        const temperature = options.temperature !== undefined ? options.temperature : 0.1;
        const url = this.API_URL + model + ':generateContent';

        const generationConfig = {
            temperature: temperature,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
        };

        if (isJSON) generationConfig.responseMimeType = "application/json";

        const body = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: generationConfig
        };

        // ✅ CORREÇÃO: Usa o cabeçalho x-goog-api-key para todas as chaves
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey 
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = (errorData.error && errorData.error.message) || ('Erro HTTP ' + response.status);
            const erro = new Error(errorMsg);
            erro.status = response.status;
            throw erro;
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts[0]) {
            throw new Error('Resposta vazia ou bloqueada.');
        }

        let textResult = data.candidates[0].content.parts[0].text;

        if (isJSON) {
            try {
                return JSON.parse(textResult);
            } catch (e) {
                const limpo = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(limpo);
            }
        }

        return textResult;
    },

    callGeminiAPI: async function(prompt, options) {
        options = options || {};
        const apiKey = this.getGeminiKey();
        if (!apiKey) {
            throw new Error('Chave da API não configurada. Clique em 🔑 Configurar.');
        }
        // Aceita chaves que começam com 'AIzaSy' ou 'AQ.'
        if (!apiKey.startsWith('AIzaSy') && !apiKey.startsWith('AQ.')) {
            throw new Error('Chave inválida. O formato não é reconhecido.');
        }

        const modelos = options.model ? [options.model].concat(this.MODELOS_DISPONIVEIS) : this.MODELOS_DISPONIVEIS;
        let ultimoErro = null;
        let espera = this.ESPERA_INICIAL;

        for (let tentativa = 1; tentativa <= this.MAX_TENTATIVAS; tentativa++) {
            for (let i = 0; i < modelos.length; i++) {
                const modelo = modelos[i];
                try {
                    console.log('🤖 Tentativa ' + tentativa + ' | Modelo: ' + modelo);
                    const resultado = await this._chamarAPI(prompt, modelo, options);
                    console.log('✅ Sucesso com: ' + modelo);
                    return resultado;
                } catch (error) {
                    ultimoErro = error;
                    console.warn('⚠️ Falha ' + modelo + ':', error.message);

                    if (error.status === 400 || error.status === 401 || error.status === 403) {
                        throw new Error('Chave da API inválida ou sem permissão.');
                    }
                    if (error.status === 404) continue;
                    if (error.status === 429 || error.status === 503) continue;
                }
            }

            if (tentativa < this.MAX_TENTATIVAS) {
                const jitter = Math.random() * 500;
                const tempoEspera = Math.min(espera + jitter, 8000);
                console.log('⏳ Aguardando ' + (tempoEspera/1000).toFixed(1) + 's...');
                await new Promise(r => setTimeout(r, tempoEspera));
                espera *= 2;
            }
        }

        throw new Error('Google Gemini sobrecarregado. Use "✏️ Inserir Manual" ou aguarde alguns minutos.');
    },

    mostrarToast: function(mensagem, tipo) {
        tipo = tipo || 'info';
        const toast = document.createElement('div');
        toast.innerHTML = mensagem;
        toast.style.cssText = 'position:fixed;top:20px;right:20px;padding:16px 24px;border-radius:12px;color:white;font-weight:600;font-size:14px;z-index:10000;box-shadow:0 8px 32px rgba(0,0,0,0.15);max-width:400px;';
        const cores = { success: '#57C220', error: '#E53935', warning: '#D97706', info: '#1E88E5' };
        toast.style.background = cores[tipo] || cores.info;
        document.body.appendChild(toast);
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.4s ease';
            setTimeout(function() { toast.remove(); }, 400);
        }, 4000);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 AMOVIN ERP | Modelo: ' + AMOVIN_CONFIG.MODELO_IA);
});
