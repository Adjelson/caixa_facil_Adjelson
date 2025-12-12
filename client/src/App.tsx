import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Caixa Fácil</h1>
        <p className="text-gray-600">Sistema PDV iniciado com sucesso.</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Iniciar
        </button>
      </div>
    </div>
  )
}

export default App
