// ============================================================
// MENU.JS - AMOVIN ERP SOCIAL (VERSÃO CORRETA)
// ============================================================
// Módulos unificados e organizados
// Última atualização: 04/09/2026

(function() {
    'use strict';

    var PERFIL_ATUAL = sessionStorage.getItem('amovin_perfil') || 'admin';
    var USUARIO_NOME = sessionStorage.getItem('amovin_nome') || 'Administrador';

    var MENU_CONFIG = {
        admin: {
            categorias: [
                // ============================================================
                // PRINCIPAL
                // ============================================================
                {
                    nome: 'Principal',
                    itens: [
                        { icone: '📊', label: 'Dashboard', href: 'dashboard.html' },
                        { icone: '📈', label: 'BI Executivo', href: 'bi.html' }
                    ]
                },
                // ============================================================
                // CAPTAÇÃO
                // ============================================================
                {
                    nome: 'Captação',
                    itens: [
                        { icone: '🚀', label: 'Amovin Capta+', href: 'https://amovin-capta.vercel.app/login', target: '_blank' },
                        { icone: '📋', label: 'Sala de Espera', href: 'sala-espera.html' },
                        { icone: '📝', label: 'Pré-Cadastro Interno', href: 'pre-cadastro.html' },
                        { icone: '📋', label: 'Projetos e Convênios', href: 'projetos-convenios.html' },
                        { icone: '📋', label: 'Projetos', href: 'projetos.html' }
                    ]
                },
                // ============================================================
                // FINANCEIRO
                // ============================================================
                {
                    nome: 'Financeiro',
                    itens: [
                        { icone: '💰', label: 'Financeiro', href: 'financeiro.html' },
                        { icone: '📊', label: 'Orçamentos', href: 'orcamentos.html' },
                        { icone: '📋', label: 'Prestação de Contas', href: 'prestacao-contas.html' },
                        { icone: '📄', label: 'Notas Fiscais', href: 'notas-fiscais.html' }
                    ]
                },
                // ============================================================
                // PESSOAS
                // ============================================================
                {
                    nome: 'Pessoas',
                    itens: [
                        { icone: '👥', label: 'Gestão de Pessoas (IDP)', href: 'idp.html' },
                        { icone: '☎️', label: 'CRM Social', href: 'agenda-telefonica.html' }
                    ]
                },
                // ============================================================
                // ATENDIMENTO
                // ============================================================
                {
                    nome: 'Atendimento',
                    itens: [
                        { icone: '📅', label: 'Agenda', href: 'agenda.html' },
                        { icone: '💬', label: 'Chat Interno', href: 'chat.html' },
                        { icone: '📝', label: 'Prontuário', href: 'prontuario.html' }
                    ]
                },
                // ============================================================
                // DOCUMENTOS
                // ============================================================
                {
                    nome: 'Documentos',
                    itens: [
                        { icone: '📝', label: 'Documentos Oficiais', href: 'documentos.html' },
                        { icone: '📱', label: 'QR Codes', href: 'qrcodes.html' },
                        { icone: '📦', label: 'Estoque', href: 'estoque.html' },
                        { icone: '🏢', label: 'Patrimônio', href: 'patrimonio.html' },
                        { icone: '📋', label: 'Ofícios', href: 'oficios.html' }
                    ]
                },
                // ============================================================
                // EDUCAÇÃO
                // ============================================================
                {
                    nome: 'Educação',
                    itens: [
                        { icone: '📚', label: 'Biblioteca Digital', href: 'biblioteca.html' },
                        { icone: '🎓', label: 'Certificados', href: 'certificados.html' }
                    ]
                },
                // ============================================================
                // COMUNICAÇÃO
                // ============================================================
                {
                    nome: 'Comunicação',
                    itens: [
                        { icone: '🤖', label: 'Assistente IA', href: 'assistente.html' },
                        { icone: '🧠', label: 'Central IA', href: 'central-ia.html' }
                    ]
                },
                // ============================================================
                // RELATÓRIOS
                // ============================================================
                {
                    nome: 'Relatórios',
                    itens: [
                        { icone: '📈', label: 'Relatórios', href: 'relatorios.html' }
                    ]
                },
                // ============================================================
                // SISTEMA
                // ============================================================
                {
                    nome: 'Sistema',
                    itens: [
                        { icone: '⚙️', label: 'Configurações', href: 'configuracoes.html' },
                        { icone: '💾', label: 'Backup', href: 'backup.html' }
                    ]
                }
            ]
        },
        // ============================================================
        // PERFIL: RECEPÇÃO
        // ============================================================
        recepcao: {
            categorias: [
                { nome: 'Principal', itens: [{ icone: '📊', label: 'Dashboard', href: 'dashboard.html' }] },
                { nome: 'Pessoas', itens: [{ icone: '👥', label: 'Gestão de Pessoas (IDP)', href: 'idp.html' }, { icone: '☎️', label: 'CRM Social', href: 'agenda-telefonica.html' }] },
                { nome: 'Atendimento', itens: [{ icone: '📅', label: 'Agenda', href: 'agenda.html' }] },
                { nome: 'Documentos', itens: [{ icone: '📝', label: 'Documentos Oficiais', href: 'documentos.html' }] },
                { nome: 'Captação', itens: [{ icone: '📋', label: 'Sala de Espera', href: 'sala-espera.html' }] }
            ]
        },
        // ============================================================
        // PERFIL: CONSULTA
        // ============================================================
        consulta: {
            categorias: [
                { nome: 'Principal', itens: [{ icone: '📊', label: 'Dashboard', href: 'dashboard.html' }] },
                { nome: 'Atendimento', itens: [{ icone: '📅', label: 'Agenda', href: 'agenda.html' }, { icone: '☎️', label: 'CRM Social', href: 'agenda-telefonica.html' }, { icone: '📝', label: 'Prontuário', href: 'prontuario.html' }] },
                { nome: 'Comunicação', itens: [{ icone: '🤖', label: 'Assistente IA', href: 'assistente.html' }, { icone: '💬', label: 'Chat Interno', href: 'chat.html' }] }
            ]
        },
        // ============================================================
        // PERFIL: FINANCEIRO
        // ============================================================
        financeiro: {
            categorias: [
                { nome: 'Principal', itens: [{ icone: '📊', label: 'Dashboard', href: 'dashboard.html' }] },
                { nome: 'Financeiro', itens: [{ icone: '💰', label: 'Financeiro', href: 'financeiro.html' }, { icone: '📊', label: 'Orçamentos', href: 'orcamentos.html' }, { icone: '📋', label: 'Prestação de Contas', href: 'prestacao-contas.html' }, { icone: '📄', label: 'Notas Fiscais', href: 'notas-fiscais.html' }] },
                { nome: 'Relatórios', itens: [{ icone: '📈', label: 'Relatórios', href: 'relatorios.html' }] }
            ]
        },
        // ============================================================
        // PERFIL: VOLUNTÁRIO
        // ============================================================
        voluntario: {
            categorias: [
                { nome: 'Principal', itens: [{ icone: '📊', label: 'Dashboard', href: 'dashboard.html' }] },
                { nome: 'Atendimento', itens: [{ icone: '📅', label: 'Agenda', href: 'agenda.html' }, { icone: '☎️', label: 'CRM Social', href: 'agenda-telefonica.html' }] },
                { nome: 'Pessoas', itens: [{ icone: '👥', label: 'Gestão de Pessoas (IDP)', href: 'idp.html' }] }
            ]
        }
    };

    // ============================================================
    // GERAR MENU HTML
    // ============================================================
    function gerarMenuHTML() {
        var perfilConfig = MENU_CONFIG[PERFIL_ATUAL] || MENU_CONFIG.admin;
        var html = '';

        html += '<aside class="sidebar">';
        html += '  <div class="sidebar-header">';
        html += '    <img src="images/amovin-logo.png" alt="AMOVIN" class="sidebar-logo-img" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\';">';
        html += '    <div class="sidebar-logo-fallback">🌻</div>';
        html += '    <div class="brand">Amovin ERP Social</div>';
        html += '    <div class="user-info">';
        html += '      <span class="user-name">👤 ' + USUARIO_NOME + '</span>';
        html += '      <span class="user-perfil">' + PERFIL_ATUAL.toUpperCase() + '</span>';
        html += '    </div>';
        html += '  </div>';
        html += '  <nav class="sidebar-nav">';

        perfilConfig.categorias.forEach(function(categoria) {
            html += '    <div class="nav-categoria">' + categoria.nome + '</div>';
            categoria.itens.forEach(function(item) {
                var target = item.target ? ' target="' + item.target + '"' : '';
                var paginaAtual = window.location.pathname.split('/').pop() || 'dashboard.html';
                var isAtivo = (paginaAtual === item.href) ? ' ativo' : '';
                html += '    <a href="' + item.href + '" class="nav-item' + isAtivo + '"' + target + '>';
                html += '      <span class="icone">' + item.icone + '</span> ' + item.label;
                html += '    </a>';
            });
        });

        html += '  </nav>';
        html += '  <div class="sidebar-footer">';
        html += '    <button class="btn-logout" onclick="logout()">🚪 Sair</button>';
        html += '  </div>';
        html += '</aside>';

        return html;
    }

    // ============================================================
    // FUNÇÕES DO MENU
    // ============================================================
    window.logout = function() {
        sessionStorage.clear();
        window.location.href = 'index.html';
    };

    function carregarMenu() {
        var container = document.getElementById('menu-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'menu-container';
            document.body.insertBefore(container, document.body.firstChild);
        }

        container.innerHTML = gerarMenuHTML();
        document.body.classList.add('has-menu');

        var perfilEl = document.querySelector('.user-perfil');
        if (perfilEl) {
            perfilEl.textContent = PERFIL_ATUAL.toUpperCase();
        }
    }

    function injectMenuStyles() {
        if (document.getElementById('menu-styles')) return;

        var style = document.createElement('style');
        style.id = 'menu-styles';
        style.textContent = `
            body.has-menu { display: flex; min-height: 100vh; margin: 0; padding: 0; }
            .sidebar { width: 270px; min-width: 270px; background: #FFFFFF; color: #1A1A1A; position: fixed; left: 0; top: 0; bottom: 0; z-index: 100; display: flex; flex-direction: column; border-right: 1px solid #F0E9DF; overflow-y: auto; overflow-x: hidden; transition: transform 0.3s ease; height: 100vh; }
            .sidebar-header { padding: 20px 24px 16px; text-align: center; border-bottom: 1px solid #F0E9DF; flex-shrink: 0; background: #FFFFFF; }
            .sidebar-logo-img { width: 80px; height: auto; margin-bottom: 8px; display: block; margin-left: auto; margin-right: auto; }
            .sidebar-logo-fallback { font-size: 48px; margin-bottom: 8px; display: none; }
            .sidebar-header .brand { font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 700; color: #1A1A1A; }
            .user-info { margin-top: 8px; padding-top: 8px; border-top: 1px solid #F0E9DF; }
            .user-info .user-name { display: block; font-size: 12px; font-weight: 600; color: #1A1A1A; }
            .user-info .user-perfil { display: inline-block; font-size: 9px; background: #F0E9DF; padding: 2px 12px; border-radius: 12px; color: #6B7280; font-weight: 600; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
            .sidebar-nav { flex: 1; padding: 12px 0 20px; overflow-y: auto; overflow-x: hidden; }
            .nav-categoria { padding: 12px 24px 6px; font-size: 10px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1.5px; }
            .nav-item { display: flex; align-items: center; gap: 13px; padding: 10px 24px; color: #4B5563; text-decoration: none; font-size: 13px; font-weight: 500; transition: all 0.2s; border-left: 3px solid transparent; cursor: pointer; }
            .nav-item:hover { background: #FFF8E7; color: #C65A11; border-left-color: #F5C518; }
            .nav-item.ativo { background: #FFF3E0; color: #C65A11; border-left-color: #C65A11; font-weight: 600; }
            .nav-item .icone { font-size: 17px; width: 24px; text-align: center; flex-shrink: 0; }
            .sidebar-footer { padding: 12px 20px 16px; border-top: 1px solid #F0E9DF; flex-shrink: 0; background: #FFFFFF; }
            .btn-logout { width: 100%; padding: 10px; background: #F8F4ED; color: #1A1A1A; border: 1px solid #F0E9DF; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; }
            .btn-logout:hover { background: #FFEBEE; border-color: #E53935; color: #E53935; }
            .main-content { flex: 1; margin-left: 270px; padding: 24px 30px; min-height: 100vh; transition: margin-left 0.3s ease; width: calc(100% - 270px); }
            @media (max-width: 768px) { .sidebar { transform: translateX(-100%); width: 280px; min-width: 280px; box-shadow: 4px 0 20px rgba(0,0,0,0.1); } .sidebar.open { transform: translateX(0); } .menu-toggle { display: flex !important; } .main-content { margin-left: 0 !important; width: 100% !important; padding: 16px; padding-top: 60px; } .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 99; } .sidebar-overlay.active { display: block; } }
            .menu-toggle { display: none; position: fixed; top: 12px; left: 12px; z-index: 200; background: #FFFFFF; border: 1px solid #F0E9DF; border-radius: 10px; padding: 8px 12px; font-size: 20px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.08); font-family: 'Inter', sans-serif; }
            .menu-toggle:hover { background: #F8F4ED; }
            .sidebar-nav::-webkit-scrollbar { width: 4px; }
            .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
            .sidebar-nav::-webkit-scrollbar-thumb { background: #E5E0D8; border-radius: 4px; }
            .sidebar-nav::-webkit-scrollbar-thumb:hover { background: #C65A11; }
        `;
        document.head.appendChild(style);
    }

    function criarMenuToggle() {
        if (document.querySelector('.menu-toggle')) return;

        var toggle = document.createElement('button');
        toggle.className = 'menu-toggle';
        toggle.innerHTML = '☰';
        toggle.setAttribute('aria-label', 'Abrir menu');
        toggle.onclick = function() {
            var sidebar = document.querySelector('.sidebar');
            var overlay = document.querySelector('.sidebar-overlay');
            if (sidebar) {
                sidebar.classList.toggle('open');
                if (overlay) {
                    overlay.classList.toggle('active');
                }
            }
        };
        document.body.prepend(toggle);

        var overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.onclick = function() {
            var sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        };
        document.body.appendChild(overlay);
    }

    // ============================================================
    // INICIALIZAÇÃO
    // ============================================================
    function init() {
        injectMenuStyles();
        carregarMenu();
        criarMenuToggle();

        if (!sessionStorage.getItem('amovin_logado')) {
            window.location.href = 'index.html';
        }

        console.log('✅ Menu carregado com sucesso! Perfil:', PERFIL_ATUAL);
        console.log('👤 Usuário:', USUARIO_NOME);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
