import { useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

function App() {
  const [nombre, setNombre] = useState("");
  const [participante, setParticipante] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const buscarParticipante = async (e) => {
    e.preventDefault();

    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      setError("Escribe tu primer nombre.");
      return;
    }

    setCargando(true);
    setError("");
    setParticipante(null);

    const { data, error } = await supabase.rpc("buscar_participante", {
      nombre_buscado: nombreLimpio,
    });

    if (error) {
      setError("Ocurrió un error. Intenta nuevamente.");
      setCargando(false);
      return;
    }

    if (!data || data.length === 0) {
      setError("No encontramos ese nombre. Verifica que esté escrito correctamente.");
      setCargando(false);
      return;
    }

    setParticipante(data[0]);
    setCargando(false);
  };

  const reiniciar = () => {
    setNombre("");
    setParticipante(null);
    setError("");
  };

  return (
    <main className="app">
      <div className="card">
        {!participante ? (
          <>
            <div className="logo">MESGEST</div>
            <h1>¡Bienvenido!</h1>
            <p className="descripcion">Escribe tu primer nombre para continuar.</p>

            <form onSubmit={buscarParticipante}>
              <label htmlFor="nombre">Primer nombre</label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej. Juan"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="off"
              />
              <button type="submit" disabled={cargando}>
                {cargando ? "Buscando..." : "Continuar"}
              </button>
            </form>

            {error && <div className="error">{error}</div>}
          </>
        ) : (
          <>
            <div className="success-icon">✓</div>
            <h1>¡Hola, {participante.nombre.split(" ")[0]}!</h1>
            <p className="descripcion">Estos son tus datos de acceso.</p>

            <div className="datos">
              <div className="dato">
                <span>Casa Salesiana</span>
                <strong>{participante.casa_salesiana}</strong>
              </div>

              <div className="dato">
                <span>Nombre</span>
                <strong>{participante.nombre}</strong>
              </div>

              <div className="dato">
                <span>Correo</span>
                <div className="row">
                  <strong>••••••••••••</strong>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => navigator.clipboard.writeText(participante.correo)}
                  >
                    Copiar correo
                  </button>
                </div>
              </div>

              <div className="dato">
                <span>Contraseña</span>
                <div className="row">
                  <strong>••••••••••••</strong>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => navigator.clipboard.writeText(participante.contrasena)}
                  >
                    Copiar contraseña
                  </button>
                </div>
              </div>
            </div>

            <button className="secondary full" onClick={reiniciar}>
              Volver
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default App;
