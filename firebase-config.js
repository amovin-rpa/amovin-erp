// ============================================================
// FIREBASE CONFIG - AMOVIN ERP
// ============================================================
// Conexão com o projeto gestao-amovin (Firebase)
// Última atualização: 22/09/2026
// ============================================================
// Este arquivo centraliza:
//  - Inicialização do Firebase
//  - Exportação do Firestore, Auth e Storage
//  - Coleções disponíveis (COLLECTIONS)
//  - Funções utilitárias (CRUD completo)
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, deleteDoc, getDoc, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// ============================================================
// CONFIGURAÇÃO DO FIREBASE
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyDQO-69vVBhmBK8oLt0DzfyigBmjxzu7b4",
  authDomain: "gestao-amovin.firebaseapp.com",
  projectId: "gestao-amovin",
  storageBucket: "gestao-amovin.firebasestorage.app",
  messagingSenderId: "316793420445",
  appId: "1:316793420445:web:68e9898bbfcd30853f3274",
  measurementId: "G-WTKFCF0LRD"
};

// ============================================================
// INICIALIZAÇÃO
// ============================================================
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Disponibiliza globalmente para scripts HTML comuns
window.firebaseApp = app;
window.firebaseDB = db;
window.firebaseAuth = auth;
window.firebaseStorage = storage;

// ============================================================
// COLEÇÕES DISPONÍVEIS
// ============================================================
export const COLLECTIONS = {
  // Pessoas
  BENEFICIARIES: 'beneficiaries',
  PROFESSIONALS: 'professionals',
  VOLUNTEERS: 'volunteers',

  // Saúde
  CONSULTATIONS: 'consultations',
  MEDICAL_RECORDS: 'medicalRecords',

  // Financeiro
  FINANCES: 'finances',

  // Agenda
  SCHEDULE: 'schedule',

  // Comunicação
  CHAT_MESSAGES: 'chatMessages',

  // Auditoria
  AUDIT_LOGS: 'auditLogs',

  // Documentos e fiscal
  NOTAS_FISCAIS: 'notas_fiscais',
  PROJETOS: 'projetos',
  ORCAMENTOS: 'orcamentos',
  CONTATOS: 'contatos',

  // Estoque e patrimônio
  ESTOQUE: 'estoque',
  PATRIMONIO: 'patrimonio',
  PRODUTOS_ESPERA: 'produtos_espera'
};

// ============================================================
// FUNÇÕES UTILITÁRIAS GLOBAIS (para uso em HTML puro)
// ============================================================

/**
 * Carrega todos os documentos de uma coleção
 * @param {string} collectionName - Nome da coleção
 * @returns {Promise<Array>} - Array de documentos com ID
 */
window.carregarColecao = async function(collectionName) {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    const items = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    console.log(`✅ ${items.length} itens carregados de "${collectionName}"`);
    return items;
  } catch (error) {
    console.error(`❌ Erro ao carregar "${collectionName}":`, error);
    return [];
  }
};

/**
 * Salva um novo documento em uma coleção
 * @param {string} collectionName - Nome da coleção
 * @param {object} data - Dados a salvar
 * @returns {Promise<string|null>} - ID do documento salvo ou null
 */
window.salvarDocumento = async function(collectionName, data) {
  try {
    // Remove campos undefined/null
    const cleaned = {};
    for (const key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        cleaned[key] = data[key];
      }
    }

    cleaned.criadoEm = new Date().toISOString();
    cleaned.atualizadoEm = new Date().toISOString();

    const docRef = await addDoc(collection(db, collectionName), cleaned);
    console.log(`✅ Documento salvo em "${collectionName}": ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`❌ Erro ao salvar em "${collectionName}":`, error);
    return null;
  }
};

/**
 * Salva um documento com ID específico (sobrescreve)
 * @param {string} collectionName - Nome da coleção
 * @param {string} docId - ID do documento
 * @param {object} data - Dados a salvar
 * @returns {Promise<boolean>} - Sucesso
 */
window.salvarComId = async function(collectionName, docId, data) {
  try {
    const cleaned = {};
    for (const key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        cleaned[key] = data[key];
      }
    }

    cleaned.atualizadoEm = new Date().toISOString();

    await setDoc(doc(db, collectionName, docId), cleaned, { merge: true });
    console.log(`✅ Documento salvo: ${collectionName}/${docId}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao salvar:`, error);
    return false;
  }
};

/**
 * Atualiza um documento existente
 * @param {string} collectionName - Nome da coleção
 * @param {string} docId - ID do documento
 * @param {object} data - Dados a atualizar
 * @returns {Promise<boolean>} - Sucesso
 */
window.atualizarDocumento = async function(collectionName, docId, data) {
  try {
    const cleaned = {};
    for (const key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        cleaned[key] = data[key];
      }
    }

    cleaned.atualizadoEm = new Date().toISOString();

    await setDoc(doc(db, collectionName, docId), cleaned, { merge: true });
    console.log(`✅ Documento atualizado: ${collectionName}/${docId}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao atualizar:`, error);
    return false;
  }
};

/**
 * Deleta um documento
 * @param {string} collectionName - Nome da coleção
 * @param {string} docId - ID do documento
 * @returns {Promise<boolean>} - Sucesso
 */
window.deletarDocumento = async function(collectionName, docId) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    console.log(`✅ Documento deletado: ${collectionName}/${docId}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao deletar:`, error);
    return false;
  }
};

/**
 * Busca um documento específico pelo ID
 * @param {string} collectionName - Nome da coleção
 * @param {string} docId - ID do documento
 * @returns {Promise<object|null>} - Documento ou null
 */
window.buscarPorId = async function(collectionName, docId) {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`❌ Erro ao buscar:`, error);
    return null;
  }
};

/**
 * Busca documentos por um campo específico
 * @param {string} collectionName - Nome da coleção
 * @param {string} campo - Nome do campo
 * @param {*} valor - Valor a buscar
 * @returns {Promise<Array>} - Array de documentos
 */
window.buscarPorCampo = async function(collectionName, campo, valor) {
  try {
    const q = query(collection(db, collectionName), where(campo, '==', valor));
    const snapshot = await getDocs(q);
    const items = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return items;
  } catch (error) {
    console.error(`❌ Erro ao buscar por campo:`, error);
    return [];
  }
};

/**
 * Busca um documento por CPF
 * @param {string} collectionName - Nome da coleção
 * @param {string} cpf - CPF (com ou sem formatação)
 * @returns {Promise<object|null>} - Documento ou null
 */
window.buscarPorCpf = async function(collectionName, cpf) {
  // Remove formatação do CPF
  const cpfLimpo = String(cpf).replace(/\D/g, '');
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    let resultado = null;
    snapshot.forEach((doc) => {
      const d = doc.data();
      const cpfDoc = String(d.cpf || '').replace(/\D/g, '');
      if (cpfDoc === cpfLimpo) {
        resultado = { id: doc.id, ...d };
      }
    });
    return resultado;
  } catch (error) {
    console.error(`❌ Erro ao buscar por CPF:`, error);
    return null;
  }
};

/**
 * Conta documentos de uma coleção
 * @param {string} collectionName - Nome da coleção
 * @returns {Promise<number>} - Total de documentos
 */
window.contarDocumentos = async function(collectionName) {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.size;
  } catch (error) {
    console.error(`❌ Erro ao contar:`, error);
    return 0;
  }
};

/**
 * Carrega os últimos N documentos (por ordem de criação)
 * @param {string} collectionName - Nome da coleção
 * @param {number} quantidade - Quantidade
 * @returns {Promise<Array>} - Array de documentos
 */
window.carregarUltimos = async function(collectionName, quantidade = 10) {
  try {
    const q = query(collection(db, collectionName), limit(quantidade));
    const snapshot = await getDocs(q);
    const items = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return items;
  } catch (error) {
    console.error(`❌ Erro ao carregar últimos:`, error);
    return [];
  }
};

/**
 * Escuta mudanças em tempo real de uma coleção
 * @param {string} collectionName - Nome da coleção
 * @param {function} callback - Função chamada quando há mudanças
 * @returns {function} - Função para cancelar a escuta
 */
window.escutarColecao = function(collectionName, callback) {
  // Importa onSnapshot dinamicamente
  import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js").then(function(module) {
    return module.onSnapshot(collection(db, collectionName), function(snapshot) {
      const items = [];
      snapshot.forEach(function(doc) {
        items.push({ id: doc.id, ...doc.data() });
      });
      callback(items);
    });
  });
};

// ============================================================
// LOG DE INICIALIZAÇÃO
// ============================================================
console.log('%c🔥 Firebase conectado!', 'color: #C65A11; font-weight: bold; font-size: 14px;');
console.log('%c📦 Projeto: ' + firebaseConfig.projectId, 'color: #6B7280;');
console.log('%c📁 Coleções disponíveis:', 'color: #6B7280;', Object.values(COLLECTIONS).join(', '));
