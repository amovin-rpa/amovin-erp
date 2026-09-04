/**
 * 📄 AMOVIN ERP - Arquivo Central de Configuração (config.js)
 * Versão: 3.0 (Definitiva e Blindada)
 * Descrição: Centraliza a chave da API, chamadas à IA e utilitários do sistema.
 */

const AMOVIN_CONFIG = {
    // ============================================================
    // CONFIGURAÇÕES DA API
    // ============================================================
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/',
    
    // 🎯 MODELO COM MENOR RISCO:
    // 'gemini-flash-latest' é o alias oficial do Google. Ele sempre aponta 
    // para a versão estável mais recente da família Flash disponível na sua chave.
    MODELO_IA: 'gemini-flash-latest', 
    
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
    // CHAMADA UNIFICADA À API DO GEMINI
    // ============================================================
    callGeminiAPI: async function(prompt, options = {}) {
        const apiKey = this.getGeminiKey();
        
        if (!apiKey) {
            throw new Error('Chave da API não configurada. Clique em 🔑 Configurar.');
        }

        const isJSON = options.json || false;
        const temperature = options.temperature !== undefined ? options.temperature : 0.1;
        const model = options.model || this.MODELO_IA;
        
        // Monta a URL
        const url = `${this.API_URL}${model}:generateContent?key=${apiKey}`;

        // Configurações de Geração
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
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: generationConfig
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.error?.message || `Erro HTTP ${response.status}`;
                
                // Tratamento específico de erros
                if (response.status === 404) {
                    throw new Error(`Modelo "${model}" não encontrado. Verifique o console.`);
                } else if (response.status === 429) {
                    throw new Error('Limite de requisições excedido (429). Aguarde 1 minuto.');
                } else if (response.status === 503) {
                    throw new Error('Serviço do Google sobrecarregado (503). Tente o modo manual.');
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            
            if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
                throw new Error('A IA retornou uma resposta vazia ou bloqueada.');
            }

            let textResult = data.candidates[0].content.parts[0].text;

            // Se esperamos JSON, tentamos parsear
            if (isJSON) {
                try {
                    return JSON.parse(textResult);
                } catch (e) {
                    // Fallback: tenta limpar markdown e parsear
                    const limpo = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
                    return JSON.parse(limpo);
                }
            }

            return textResult;

        } catch (error) {
            console.error('❌ Erro na API Gemini:', error);
            throw error;
        }
    },

    // ============================================================
    // UTILITÁRIOS DO SISTEMA
    // ============================================================
    mostrarToast: function(mensagem, tipo = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${tipo}`;
        toast.innerHTML = mensagem;
        
        // Estilos inline para garantir que funcione mesmo sem o CSS do toast
        toast.style.cssText = 'position:fixed;top:20px;right:20px;padding:16px 24px;border-radius:12px;color:white;font-weight:600;font-size:14px;z-index:10000;box-shadow:0 8px 32px rgba(0,0,0,0.15);animation:slideInRight 0.4s ease;max-width:400px;';
        if (tipo === 'success') toast.style.background = '#57C220';
        else if (tipo === 'error') toast.style.background = '#E53935';
        else if (tipo === 'warning') toast.style.background = '#D97706';
        else toast.style.background = '#1E88E5';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }
};

// Inicialização automática ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    console.log(`🚀 AMOVIN ERP Carregado | Modelo IA: ${AMOVIN_CONFIG.MODELO_IA}`);
});
