
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('pocketTherapistUsers') || '{}');

      if (isSignUp) {
        if (users[email]) {
          setError('Este e-mail já está cadastrado.');
        } else {
          const newUsers = { ...users, [email]: password };
          localStorage.setItem('pocketTherapistUsers', JSON.stringify(newUsers));
          onLogin(email);
        }
      } else {
        if (users[email] && users[email] === password) {
          onLogin(email);
        } else {
          setError('E-mail ou senha inválidos.');
        }
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
      console.error(err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-700">Terapeuta de Bolso 🌱</h1>
            <p className="text-gray-500 mt-2">Seu espaço seguro para encontrar a calma.</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl shadow-blue-200/50">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </h2>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FA8DC]"
                placeholder="seu@email.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="password">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FA8DC]"
                placeholder="********"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 text-white bg-[#6FA8DC] rounded-lg hover:bg-[#5a96c9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6FA8DC] transition-colors"
            >
              {isSignUp ? 'Registrar' : 'Entrar'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="font-medium text-[#6FA8DC] hover:underline ml-1"
            >
              {isSignUp ? 'Entrar' : 'Crie uma'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
