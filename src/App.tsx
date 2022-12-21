import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [loadingPartidos, setLoadingPartidos] = useState(false);
  const [loadingMembros, setLoadingMembros] = useState(false);
  const [partidos, setPartidos] = useState([]);
  const [membros, setMembros] = useState([]);

  //Ao carregar a página, busca os partidos da legislatura atual (56)
  useEffect(() => {
    const fetchData = async () => {
      setLoadingPartidos(true);
      try {
        const { data } = await axios.get(
          "https://dadosabertos.camara.leg.br/api/v2/partidos?idLegislatura=56&itens=100&ordem=ASC&ordenarPor=sigla"
        );
        setPartidos(data.dados);
        setMembros([]);
      } catch (error) {
      }
      setLoadingPartidos(false);
    };
    fetchData();
  }, []);

  //Recebe o partido selecionado na legislatura atual (56)
  const getSelectedPart = async (id: Number) => {
    setLoadingMembros(true);
    try {
      const { data } = await axios.get(
        `https://dadosabertos.camara.leg.br/api/v2/partidos/${id}/membros?idLegislatura=56&itens=500`
      );
      setMembros(data.dados);
    } catch (error) {
      console.log(error);
    }
    setLoadingMembros(false);
  };

  return (
    <div className="App">
      <h1>Selecione um partido da legislatura atual!</h1>
      {loadingPartidos === true ? (
        <p>Carregando partidos...</p>
      ) : (
        <select
          onChange={(id) => getSelectedPart(Number(id.currentTarget.value))}
        >
          {partidos.map((partido: any) => {
            return <option key={partido.id} value={partido.id}>{partido.sigla}</option>;
          })}
        </select>
      )}

      {loadingMembros === true ? (
        <p>Carragendo membros do partido...</p>
      ) : (
        <>
          {membros !== null ? (
            <>
              {membros.map((membro: any) => {
                return (
                  <div key={membro.id}>
                    <h1>{membro.nome}</h1>
                    <img
                      src={membro.urlFoto}
                      alt={`foto do candidato ${membro.nome}`}
                      width="150px"
                      height="180px"
                    />
                    <p>{membro.email}</p>
                  </div>
                );
              })}
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
}

export default App;
