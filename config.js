/**
 * 📄 AMOVIN ERP - Arquivo Central de Configuração (config.js)
 * Versão: 5.0 (Modelos 2026 + Retry + Fallback)
 */

const AMOVIN_CONFIG = {
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/',

    // ============================================================
    // MODELOS EM ORDEM DE PRIORIDADE (Setembro/2026)
    // ============================================================
    MODELOS_DISPONIVEIS: [
        'gemini-3.8-flash',      // Principal — melhor para NF-e
        'gemini-3.7-flash',      // Fallback 1
        'gemini-3.6-flash',      // Fallback 2
        'gemini-3.5-flash',      // Fallback 3
        'gemini-3.5-flash-lite', // Fallback econômico
        'gemini-2.5-flash'       // Último recurso
    ],

    MODELO_IA: 'gemini-3.8-flash',

    MAX_TENTATIVAS: 3,
    ESPERA_INICIAL: 1000, // 1 segundo
    ESPERA_MAXIMA: 8000,  // 8 segundos

    // ============================================================
    // GERENCIAMENTO DE CHAVE
    // ============================================================
    getGeminiKey: function() {
        return localStorage.getItem('amovin_gemini_key') || '';
    },

    setGeminiKey: function(key) {
        if (key && key.trim().length > 10) {
            localStorage.setItem('amovin_gemini_key', key.trim());
            return true;
        }
        return false;
    },

    // ============================================================
    // CHAMADA ÚNICA À API
    // ============================================================
    _chamarAPI: async function(prompt, model, options) {
        const apiKey = this.getGeminiKey();
        const isJSON = options.json || false;
        const temperature = options.temperature !== undefined ? options.temperature : 0.1;
        const url = `${this.API_URL}${model}:generateContent?key=${apiKey}`;

        const generationConfig = {
            temperature: temperature,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
        };

        if (isJSON) {
            generationConfig.responseMimeType = "application/json";
        }

        const body = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: generationConfig
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.error?.message || `Erro HTTP ${response.status}`;
            const erro = new Error(errorMsg);
            erro.status = response.status;
            throw erro;
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
            throw new Error('A IA retornou uma resposta vazia ou bloqueada.');
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

    // ============================================================
    // CHAMADA COM RETRY + FALLBACK DE MODELO
    // ============================================================
    callGeminiAPI: async function(prompt, options = {}) {
        const apiKey = this.getGeminiKey();
        if (!apiKey) {
            throw new Error('Chave da API não configurada. Clique em 🔑 Configurar.');
        }

        const modelos = options.model ? [options.model, ...this.MODELOS_DISPONIVEIS] : this.MODELOS_DISPONIVEIS;
        let ultimoErro = null;
        let espera = this.ESPERA_INICIAL;

        for (let tentativa = 1; tentativa <= this.MAX_TENTATIVAS; tentativa++) {
            for (let i = 0; i < modelos.length; i++) {
                const modelo = modelos[i];
                try {
                    console.log(`🤖 Tentativa ${tentativa} | Modelo: ${modelo}`);
                    const resultado = await this._chamarAPI(prompt, modelo, options);
                    console.log(`✅ Sucesso com: ${modelo}`);
                    return resultado;
                } catch (error) {
                    ultimoErro = error;
                    console.warn(`⚠️ Falha ${modelo}:`, error.message);

                    // Erros de cliente (chave inválida) — não tenta mais
                    if (error.status === 400 || error.status === 401 || error.status === 403) {
                        throw new Error('Chave da API inválida ou sem permissão.');
                    }

                    // Erros 404 (modelo não existe) — pula para o próximo
                    if (error.status === 404) {
                        continue;
                    }

                    // Erros 429/503 (transitórios) — tenta próximo modelo
                    if (error.status === 429 || error.status === 503) {
                        continue;
                    }
                }
            }

            // Espera exponencial antes da próxima rodada de tentativas
            if (tentativa < this.MAX_TENTATIVAS) {
                const jitter = Math.random() * 500;
                const tempoEspera = Math.min(espera + jitter, this.ESPERA_MAXIMA);
                console.log(`⏳ Aguardando ${(tempoEspera/1000).toFixed(1)}s...`);
                await new Promise(resolve => setTimeout(resolve, tempoEspera));
                espera *= 2; // Exponential backoff
            }
        }

        throw new Error(
            'O Google Gemini está sobrecarregado. ' +
            'Use "✏️ Inserir Manual" ou aguarde alguns minutos.'
        );
    },

    // ============================================================
    // UTILITÁRIOS
    // ============================================================
    mostrarToast: function(mensagem, tipo = 'info') {
        const toast = document.createElement('div');
        toast.innerHTML = mensagem;
        toast.style.cssText = 'position:fixed;top:20px;right:20px;padding:16px 24px;border-radius:12px;color:white;font-weight:600;font-size:14px;z-index:10000;box-shadow:0 8px 32px rgba(0,0,0,0.15);max-width:400px;';
        const cores = { success: '#57C220', error: '#E53935', warning: '#D97706', info: '#1E88E5' };
        toast.style.background = cores[tipo] || cores.info;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log(`🚀 AMOVIN ERP | Modelo: ${AMOVIN_CONFIG.MODELO_IA}`);
    console.log(`🔄 Fallback: ${AMOVIN_CONFIG.MODELOS_DISPONIVEIS.slice(1).join(' → ')}`);
});
