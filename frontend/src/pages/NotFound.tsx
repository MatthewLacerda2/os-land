import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl font-bold text-slate-400">404</span>
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Página não encontrada</h1>
      <p className="text-slate-500 mb-8 max-w-xs">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Button
        onClick={() => navigate('/')}
        size="lg"
        className="px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
      >
        Voltar para o Início
      </Button>
    </div>
  );
};

export default NotFound;
