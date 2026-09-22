// ============================================================
// FIREBASE CONFIG - AMOVIN ERP
// ============================================================
// Este arquivo conecta o sistema ao Firebase antigo (gestao-amovin)
// Última atualização: 22/09/2026
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// ============================================================
// CONFIGURAÇÃO DO FIREBASE (projeto: gestao-amovin)
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

// Exporta os serviços do Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// ============================================================
// DISPONIBILIZA GLOBALMENTE (para uso em HTML puro)
// ============================================================
window.firebaseApp = app;
window.firebaseDB = db;
window.firebaseAuth = auth;
window.firebaseStorage = storage;

// ============================================================
// COLECOES DISPONÍVEIS NO FIRESTORE
// ============================================================
export const COLLECTIONS = {
  BENEFICIARIES: 'beneficiaries',
  PROFESSIONALS: 'professionals',
  VOLUNTEERS: 'volunteers',
  CONSULTATIONS: 'consultations',
  FINANCES: 'finances',
  MEDICAL_RECORDS: 'medicalRecords',
  SCHEDULE: 'schedule',
  CHAT_MESSAGES: 'chatMessages',
  AUDIT_LOGS: 'auditLogs',
  NOTAS_FISCAIS: 'notas_fiscais',
  PROJETOS: 'projetos',
  ORCAMENTOS: 'orcamentos',
  CONTATOS: 'contatos',
  ESTOQUE: 'estoque',
  PATRIMONIO: 'patrimonio',
  PRODUTOS_ESPERA: 'produtos_espera'
};

// ============================================================
// FUNÇÕES UTILITÁRIAS (para uso em HTML puro)
// ============================================================

/**
 * Carrega todos os documentos de uma coleção
 * @param {string} collectionName - Nome da coleção
 * @returns {Promise<Array>} - Array de documentos
 */
window.carregarColecao = async function(collectionName) {
  try {
    const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
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
 * Salva um documento em uma coleção
 * @param {string} collectionName - Nome da coleção
 * @param {object} data - Dados a salvar
 * @returns {Promise<string>} - ID do documento salvo
 */
window.salvarDocumento = async function(collectionName, data) {
  try {
    const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    });
    console.log(`✅ Documento salvo em "${collectionName}": ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`❌ Erro ao salvar em "${collectionName}":`, error);
    return null;
  }
};

/**
 * Atualiza um documento existente
 * @param {string} collectionName - Nome da coleção
 * @param {string} docId - ID do documento
 * @param {object} data - Dados a atualizar
 */
window.atualizarDocumento = async function(collectionName, docId, data) {
  try {
    const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    await setDoc(doc(db, collectionName, docId), {
      ...data,
      atualizadoEm: new Date().toISOString()
    }, { merge: true });
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
 */
window.deletarDocumento = async function(collectionName, docId) {
  try {
    const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    await deleteDoc(doc(db, collectionName, docId));
    console.log(`✅ Documento deletado: ${collectionName}/${docId}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao deletar:`, error);
    return false;
  }
};

// ============================================================
// LOG DE INICIALIZAÇÃO
// ============================================================
console.log('🔥 Firebase conectado com sucesso!');
console.log('📦 Projeto:', firebaseConfig.projectId);
console.log('📁 Coleções disponíveis:', Object.values(COLLECTIONS).join(', '));
