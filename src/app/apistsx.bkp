import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function APIs() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState({ nNF: '', startDate: '', endDate: '', chNFe: '' });
  const [nfes, setNfes] = useState([]);
  const [message, setMessage] = useState('');

  if (status === 'loading') return <p>Carregando...</p>;
  if (!session) {
    router.push('/');
    return null;
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Selecione um arquivo XML');
      return;
    }

    const formData = new FormData();
    formData.append('xml', file);

    try {
      const res = await fetch('http://localhost:5000/api/nfe/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('NF-e salva com sucesso');
      } else {
        setMessage(data.error || 'Erro ao salvar NF-e');
      }
    } catch (err) {
      setMessage('Erro ao conectar ao servidor');
    }
  };

  const handleQuery = async () => {
    const params = new URLSearchParams();
    if (query.nNF) params.append('nNF', query.nNF);
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);
    if (query.chNFe) params.append('chNFe', query.chNFe);

    try {
      const res = await fetch(`http://localhost:5000/api/nfe?${params}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setNfes(data);
        setMessage('Consulta realizada com sucesso');
      } else {
        setMessage(data.error || 'Erro ao consultar NF-e');
      }
    } catch (err) {
      setMessage('Erro ao conectar ao servidor');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/nfe/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setNfes(nfes.filter((nfe) => nfe._id !== id));
        setMessage('NF-e excluída com sucesso');
      } else {
        setMessage(data.error || 'Erro ao excluir NF-e');
      }
    } catch (err) {
      setMessage('Erro ao conectar ao servidor');
    }
  };

  return (
    <div className="section">
      <h2>Gerenciamento de NF-e</h2>
      <div className="api-section">
        <h3>Upload de XML NF-e</h3>
        <input type="file" accept=".xml" onChange={handleFileChange} />
        <button className="btn" onClick={handleUpload}>Enviar XML</button>
      </div>
      <div className="api-section">
        <h3>Consulta de NF-e</h3>
        <input
          type="text"
          placeholder="Número da NF"
          value={query.nNF}
          onChange={(e) => setQuery({ ...query, nNF: e.target.value })}
        />
        <input
          type="date"
          placeholder="Data Inicial"
          value={query.startDate}
          onChange={(e) => setQuery({ ...query, startDate: e.target.value })}
        />
        <input
          type="date"
          placeholder="Data Final"
          value={query.endDate}
          onChange={(e) => setQuery({ ...query, endDate: e.target.value })}
        />
        <input
          type="text"
          placeholder="Chave NF-e"
          value={query.chNFe}
          onChange={(e) => setQuery({ ...query, chNFe: e.target.value })}
        />
        <button className="btn" onClick={handleQuery}>Consultar</button>
      </div>
      {message && <p className="message">{message}</p>}
      {nfes.length > 0 && (
        <div className="api-section">
          <h3>Resultados</h3>
          <ul className="nfe-list">
            {nfes.map((nfe) => (
              <li key={nfe._id} className="nfe-item">
                <p>
                  NF: {nfe.nNF} | Chave: {nfe.chNFe} | Data: {new Date(nfe.dhEmi).toLocaleDateString()} | 
                  Emissor: {nfe.emitter.xNome} (CNPJ: {nfe.emitter.CNPJ})
                </p>
                <button className="btn btn-delete" onClick={() => handleDelete(nfe._id)}>Excluir</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}