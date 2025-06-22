import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    observation: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://whatsdocinho.vercel.app/api' 
    : 'http://localhost:3001/api';

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_URL}/contacts`);
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId 
        ? `${API_URL}/contacts/${editingId}`
        : `${API_URL}/contacts`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ name: '', phone: '', observation: '' });
        setEditingId(null);
        fetchContacts();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Erro ao salvar contato:', error);
      alert('Erro ao salvar contato');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      observation: contact.observation || ''
    });
    setEditingId(contact.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este contato?')) return;

    try {
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchContacts();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
      alert('Erro ao deletar contato');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`${API_URL}/contacts/${id}/toggle`, {
        method: 'PUT'
      });

      if (response.ok) {
        fetchContacts();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>WhatsDocinho</h1>
        <p>Gerenciador de Contatos WhatsApp</p>
      </header>

      <main className="App-main">
        {/* Formulário de Cadastro */}
        <section className="contact-form">
          <h2>{editingId ? 'Editar Contato' : 'Novo Contato'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nome do contato"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Telefone (com DDD):</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="11999999999"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Observação:</label>
              <textarea
                value={formData.observation}
                onChange={(e) => setFormData({...formData, observation: e.target.value})}
                placeholder="Observações sobre o contato"
                rows="3"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : (editingId ? 'Atualizar' : 'Cadastrar')}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setFormData({ name: '', phone: '', observation: '' });
                    setEditingId(null);
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Lista de Contatos */}
        <section className="contacts-list">
          <h2>Contatos Cadastrados ({contacts.length})</h2>
          {contacts.length === 0 ? (
            <p className="no-contacts">Nenhum contato cadastrado</p>
          ) : (
            <div className="contacts-grid">
              {contacts.map(contact => (
                <div key={contact.id} className={`contact-card ${!contact.active ? 'inactive' : ''}`}>
                  <div className="contact-header">
                    <h3>{contact.name}</h3>
                    <span className={`status ${contact.active ? 'active' : 'inactive'}`}>
                      {contact.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  <div className="contact-info">
                    <p><strong>Telefone:</strong> {contact.phone}</p>
                    {contact.observation && (
                      <p><strong>Observação:</strong> {contact.observation}</p>
                    )}
                    <p><strong>Criado em:</strong> {new Date(contact.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="contact-actions">
                    <button 
                      onClick={() => handleEdit(contact)}
                      className="btn-edit"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(contact.id)}
                      className={`btn-toggle ${contact.active ? 'btn-deactivate' : 'btn-activate'}`}
                    >
                      {contact.active ? 'Desativar' : 'Ativar'}
                    </button>
                    <button 
                      onClick={() => handleDelete(contact.id)}
                      className="btn-delete"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
