import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import halloAPI from '../lib/hallo';

function App() {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    observation: ''
  });
  const [messageForm, setMessageForm] = useState({
    mediaType: 'text',
    mediaUrl: '',
    textContent: '',
    selectedFile: null,
    selectedFiles: []
  });
  const [editingId, setEditingId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    fetchContacts();
    fetchMessages();
  }, []);

  // Debug: monitorar mudanças no messageForm
  useEffect(() => {
    console.log('messageForm atualizado:', messageForm);
  }, [messageForm]);

  // Validar telefone em tempo real
  useEffect(() => {
    if (formData.phone) {
      const existingContact = contacts.find(contact => 
        contact.phone === formData.phone && contact.id !== editingId
      );
      
      if (existingContact) {
        setPhoneError(`Telefone já cadastrado para ${existingContact.name}`);
      } else {
        setPhoneError('');
      }
    } else {
      setPhoneError('');
    }
  }, [formData.phone, contacts, editingId]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verificar se o telefone já existe (exceto se estiver editando o mesmo contato)
      const existingContact = contacts.find(contact => 
        contact.phone === formData.phone && contact.id !== editingId
      );
      
      if (existingContact) {
        alert(`O telefone ${formData.phone} já está cadastrado para ${existingContact.name}`);
        setLoading(false);
        return;
      }

      if (editingId) {
        const { error } = await supabase
          .from('contacts')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contacts')
          .insert([formData]);

        if (error) throw error;
      }

      setFormData({ name: '', phone: '', observation: '' });
      setEditingId(null);
      fetchContacts();
    } catch (error) {
      console.error('Erro ao salvar contato:', error);
      alert('Erro ao salvar contato');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMessageForm({...messageForm, selectedFile: file, selectedFiles: []});
    }
  };

  // Nova função para múltiplos arquivos
  const handleMultipleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setMessageForm({...messageForm, selectedFiles: files, selectedFile: null});
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    setMessageLoading(true);

    try {
      let mediaUrl = messageForm.mediaUrl;
      
      // Se tem arquivo selecionado, fazer upload
      if (messageForm.selectedFile) {
        console.log('Fazendo upload do arquivo:', messageForm.selectedFile.name);
        
        const fileName = `${Date.now()}-${messageForm.selectedFile.name}`;
        const { error } = await supabase.storage
          .from('whatsapp-media')
          .upload(fileName, messageForm.selectedFile);
        
        if (error) {
          console.error('Erro no upload:', error);
          throw new Error(`Erro no upload: ${error.message}`);
        }
        
        // Gerar URL pública
        const { data: urlData } = supabase.storage
          .from('whatsapp-media')
          .getPublicUrl(fileName);
        
        mediaUrl = urlData.publicUrl;
        console.log('URL gerada:', mediaUrl);
      }

      const messageData = {
        media_type: messageForm.mediaType,
        media_url: messageForm.mediaType === 'text' ? null : mediaUrl,
        text_content: messageForm.textContent
      };

      console.log('Dados da mensagem:', messageData);

      if (editingMessageId) {
        const { error } = await supabase
          .from('messages')
          .update(messageData)
          .eq('id', editingMessageId);

        if (error) {
          console.error('Erro ao atualizar mensagem:', error);
          throw new Error(`Erro ao atualizar: ${error.message}`);
        }
      } else {
        const { error } = await supabase
          .from('messages')
          .insert([messageData]);

        if (error) {
          console.error('Erro ao inserir mensagem:', error);
          throw new Error(`Erro ao salvar: ${error.message}`);
        }
      }

      setMessageForm({ 
        mediaType: 'text', 
        mediaUrl: '', 
        textContent: '', 
        selectedFile: null 
      });
      setEditingMessageId(null);
      fetchMessages();
    } catch (error) {
      console.error('Erro completo:', error);
      alert(`Erro ao salvar mensagem: ${error.message}`);
    } finally {
      setMessageLoading(false);
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

  const handleEditMessage = (message) => {
    console.log('Editando mensagem:', message);
    console.log('Estado atual do form:', messageForm);
    
    // Usar setTimeout para garantir que o estado seja atualizado
    setTimeout(() => {
      setMessageForm({
        mediaType: message.media_type,
        mediaUrl: message.media_url || '',
        textContent: message.text_content || '',
        selectedFile: null
      });
      setEditingMessageId(message.id);
    }, 0);
    
    console.log('Novo estado do form será:', {
      mediaType: message.media_type,
      mediaUrl: message.media_url || '',
      textContent: message.text_content || '',
      selectedFile: null
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este contato?')) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchContacts();
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
      alert('Erro ao deletar contato');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta mensagem?')) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
      alert('Erro ao deletar mensagem');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const contact = contacts.find(c => c.id === id);
      const newStatus = !contact.active;

      const { error } = await supabase
        .from('contacts')
        .update({ active: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchContacts();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status');
    }
  };

  const handleToggleMessageStatus = async (id) => {
    try {
      const message = messages.find(m => m.id === id);
      const newStatus = !message.active;

      const { error } = await supabase
        .from('messages')
        .update({ active: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error('Erro ao alterar status da mensagem:', error);
      alert('Erro ao alterar status da mensagem');
    }
  };

  const handleTestSend = async (contact) => {
    setSendingId(contact.id);
    try {
      // Encontrar a mensagem ativa
      const activeMessage = messages.find(message => message.active);
      
      if (!activeMessage) {
        alert('❌ Nenhuma mensagem ativa encontrada!\n\nPara testar o envio, você precisa:\n1. Criar uma mensagem\n2. Ativá-la usando o botão "Ativar"');
        return;
      }

      console.log('Tentando enviar mensagem para:', contact.phone);
      console.log('Mensagem ativa:', activeMessage);
      console.log('Configuração Hallo:', {
        baseURL: halloAPI.baseURL,
        instanceName: halloAPI.instanceName,
        isConfigured: halloAPI.isConfigured()
      });
      
      let result;
      
      // Verificar se a mensagem tem mídia
      if (activeMessage.media_type !== 'text' && activeMessage.media_url) {
        // Enviar mídia com legenda (texto)
        console.log('📸 Enviando mídia com legenda...');
        result = await halloAPI.sendMediaMessage(
          contact.phone,
          activeMessage.media_url,
          activeMessage.media_type,
          activeMessage.text_content || ''
        );
      } else if (activeMessage.text_content) {
        // Enviar apenas texto
        console.log('📝 Enviando apenas texto...');
        result = await halloAPI.sendTextMessage(
          contact.phone,
          activeMessage.text_content
        );
      } else {
        alert('❌ A mensagem ativa não possui conteúdo válido!\n\nPara testar o envio, a mensagem ativa deve conter:\n- Texto, OU\n- Mídia (imagem, vídeo, documento)');
        return;
      }
      
      console.log('Resultado:', result);
      
      if (result.success) {
        const mediaInfo = activeMessage.media_type !== 'text' && activeMessage.media_url 
          ? `\n🖼️ Mídia: ${activeMessage.media_type} (${activeMessage.media_url})`
          : '';
        
        alert(`✅ Mensagem enviada com sucesso!\n\n📱 Para: ${contact.name} (${contact.phone})${mediaInfo}\n📝 Texto: "${activeMessage.text_content || 'Sem texto'}"\n\nID da mensagem: ${result.messageId || 'N/A'}\nID da instância: ${result.instanceId || 'N/A'}`);
      } else {
        alert(`❌ ${result.message}\n\nDetalhes: ${JSON.stringify(result.details, null, 2)}`);
      }
    } catch (error) {
      console.error('Erro detalhado:', error);
      alert('Erro ao enviar mensagem: ' + (error.message || error));
    } finally {
      setSendingId(null);
    }
  };

  const renderMessagePreview = () => {
    if (!messageForm.textContent && !messageForm.mediaUrl && !messageForm.selectedFile) {
      return <div className="preview-empty">Digite uma mensagem para ver o preview</div>;
    }

    return (
      <div className="whatsapp-preview">
        <div className="whatsapp-header">
          <div className="whatsapp-avatar">👤</div>
          <div className="whatsapp-info">
            <div className="whatsapp-name">Você</div>
            <div className="whatsapp-time">{new Date().toLocaleTimeString()}</div>
          </div>
        </div>
        <div className="whatsapp-message">
          {messageForm.mediaType !== 'text' && (messageForm.mediaUrl || messageForm.selectedFile) && (
            <div className="media-preview">
              {messageForm.mediaType === 'photo' && (
                <img 
                  src={messageForm.selectedFile ? URL.createObjectURL(messageForm.selectedFile) : messageForm.mediaUrl} 
                  alt="Preview" 
                  onError={(e) => e.target.style.display = 'none'} 
                />
              )}
              {messageForm.mediaType === 'video' && (
                <video controls>
                  <source src={messageForm.selectedFile ? URL.createObjectURL(messageForm.selectedFile) : messageForm.mediaUrl} />
                  Seu navegador não suporta vídeos.
                </video>
              )}
              {messageForm.mediaType === 'file' && (
                <div className="file-preview">
                  📎 {messageForm.selectedFile ? messageForm.selectedFile.name : 'Arquivo anexado'}
                </div>
              )}
            </div>
          )}
          {messageForm.textContent && (
            <div className="text-preview">{messageForm.textContent}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>WhatsDocinho</h1>
        <p>Gerenciador de Contatos e Mensagens WhatsApp</p>
      </header>

      <main className="App-main">
        {/* Coluna Esquerda - Mensagens (mais compacta) */}
        <div className="messages-column">
          {/* Gerenciamento de Mensagens */}
          <section className="message-form">
            <h2>{editingMessageId ? 'Editar Mensagem' : 'Nova Mensagem'}</h2>
            <form onSubmit={handleMessageSubmit}>
              <div className="form-group">
                <label>Tipo de Mídia:</label>
                <select
                  key={`mediaType-${editingMessageId}`}
                  value={messageForm.mediaType}
                  onChange={(e) => setMessageForm({...messageForm, mediaType: e.target.value, selectedFile: null, mediaUrl: ''})}
                >
                  <option value="text">Apenas texto</option>
                  <option value="photo">Foto</option>
                  <option value="video">Vídeo</option>
                  <option value="file">Arquivo</option>
                </select>
              </div>
              
              {messageForm.mediaType !== 'text' && (
                <div className="form-group">
                  <label>Arquivo do Dispositivo:</label>
                  <input
                    key={`file-${editingMessageId}`}
                    type="file"
                    onChange={handleFileChange}
                    accept={
                      messageForm.mediaType === 'photo' ? 'image/jpeg,image/png,image/gif,image/webp' :
                      messageForm.mediaType === 'video' ? 'video/mp4,video/avi,video/mov,video/wmv,video/flv' :
                      '*/*'
                    }
                  />
                  <small>
                    {messageForm.mediaType === 'photo' && 'Formatos aceitos: JPG, PNG, GIF, WebP (máx 50MB)'}
                    {messageForm.mediaType === 'video' && 'Formatos aceitos: MP4, AVI, MOV, WMV, FLV (máx 50MB)'}
                    {messageForm.mediaType === 'file' && 'Qualquer tipo de arquivo (máx 50MB)'}
                  </small>
                </div>
              )}
              
              {messageForm.mediaType !== 'text' && (
                <div className="form-group">
                  <label>Ou cole a URL da mídia:</label>
                  <input
                    key={`mediaUrl-${editingMessageId}`}
                    type="url"
                    value={messageForm.mediaUrl}
                    onChange={(e) => setMessageForm({...messageForm, mediaUrl: e.target.value, selectedFile: null})}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>Texto da Mensagem:</label>
                <textarea
                  key={`textContent-${editingMessageId}`}
                  value={messageForm.textContent}
                  onChange={(e) => setMessageForm({...messageForm, textContent: e.target.value})}
                  placeholder="Digite a mensagem que será enviada..."
                  rows="4"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" disabled={messageLoading}>
                  {messageLoading ? 'Salvando...' : (editingMessageId ? 'Atualizar' : 'Salvar')}
                </button>
                {editingMessageId && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setMessageForm({ 
                        mediaType: 'text', 
                        mediaUrl: '', 
                        textContent: '', 
                        selectedFile: null 
                      });
                      setEditingMessageId(null);
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Preview da Mensagem */}
          <section className="message-preview">
            <h3>Preview da Mensagem</h3>
            {renderMessagePreview()}
          </section>

          {/* Lista de Mensagens */}
          <section className="messages-section">
            <h2>Mensagens Salvas ({messages.length})</h2>
            {messages.length === 0 ? (
              <div className="preview-empty">
                <p>Nenhuma mensagem salva</p>
              </div>
            ) : (
              <div className="messages-list">
                {messages.map(message => (
                  <div key={message.id} className={`message-item ${!message.active ? 'inactive' : ''}`}>
                    <div className="message-info">
                      <p><strong>ID:</strong> #{message.id}</p>
                      <p><strong>Tipo:</strong> {message.media_type}</p>
                      {message.media_type !== 'text' && message.media_url && (
                        <div className="message-media-preview">
                          {message.media_type === 'photo' && (
                            <img 
                              src={message.media_url} 
                              alt="Mídia da mensagem" 
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          )}
                          {message.media_type === 'video' && (
                            <video controls>
                              <source src={message.media_url} />
                              Seu navegador não suporta vídeos.
                            </video>
                          )}
                          {message.media_type === 'file' && (
                            <div className="file-indicator">
                              📎 Arquivo anexado
                            </div>
                          )}
                        </div>
                      )}
                      {message.text_content && (
                        <p><strong>Texto:</strong> {message.text_content.length > 50 
                          ? `${message.text_content.substring(0, 50)}...` 
                          : message.text_content
                        }</p>
                      )}
                      <p><strong>Status:</strong> 
                        <span className={`status ${message.active ? 'active' : 'inactive'}`}>
                          {message.active ? 'Ativa' : 'Inativa'}
                        </span>
                      </p>
                    </div>
                    
                    <div className="message-actions">
                      <button 
                        onClick={() => handleEditMessage(message)}
                        className="btn-edit"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleToggleMessageStatus(message.id)}
                        className={`btn-toggle ${message.active ? 'btn-deactivate' : 'btn-activate'}`}
                      >
                        {message.active ? 'Desativar' : 'Ativar'}
                      </button>
                      <button 
                        onClick={() => handleDeleteMessage(message.id)}
                        className="btn-delete"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Coluna Direita - Contatos (largura total) */}
        <div className="contacts-column">
          {/* Formulário de Cadastro de Contatos */}
          <section className="message-form">
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
                  className={phoneError ? 'error' : ''}
                />
                {phoneError && (
                  <div className="error-message">
                    ⚠️ {phoneError}
                  </div>
                )}
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
          <section className="contacts-section">
            <h2>Contatos Cadastrados ({contacts.length})</h2>
            {contacts.length === 0 ? (
              <div className="preview-empty">
                <p>Nenhum contato cadastrado</p>
              </div>
            ) : (
              <div className="contacts-list">
                {contacts.map(contact => (
                  <div key={contact.id} className={`contact-item ${!contact.active ? 'inactive' : ''}`}>
                    <div className="contact-info">
                      <p><strong>Nome:</strong> {contact.name}</p>
                      <p><strong>Telefone:</strong> {contact.phone}</p>
                      {contact.observation && (
                        <p><strong>Observação:</strong> {contact.observation}</p>
                      )}
                      <p><strong>Criado em:</strong> {new Date(contact.created_at).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> 
                        <span className={`status ${contact.active ? 'active' : 'inactive'}`}>
                          {contact.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </p>
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
                        Excluir
                      </button>
                      <button 
                        className="btn-test-send"
                        onClick={() => handleTestSend(contact)}
                        disabled={sendingId === contact.id}
                      >
                        {sendingId === contact.id ? 'Enviando...' : 'Testar envio'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
