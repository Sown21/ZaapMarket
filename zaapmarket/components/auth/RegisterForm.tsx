"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegisterFormData } from "@/types";

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [isTypingPassword, setIsTypingPassword] = useState<boolean>(false);
  const router = useRouter();

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);

    // eslint-disable-next-line prefer-const
    let errorMessage = [];
    if (!minLength) errorMessage.push("8 caractères minimum");
    if (!hasSpecialChar) errorMessage.push("1 caractère spécial");
    if (!hasNumber) errorMessage.push("1 chiffre");
    if (!hasUpperCase) errorMessage.push("1 majuscule");
    if (!hasLowerCase) errorMessage.push("1 minuscule");

    if (errorMessage.length > 0) {
      setPasswordError(`Il manque : ${errorMessage.join(", ")}`);
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "password") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(formData.password)) {
      setError("Veuillez corriger les erreurs du mot de passe");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue lors de l'inscription");
      }

      router.push("/login?registered=true");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-20 p-6 rounded-lg shadow-md backdrop-blur-xl bg-white/20">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Créer un compte</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100/80 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-white mb-2">Nom</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-white mb-2">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-white mb-2">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setIsTypingPassword(true)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 ${passwordError && isTypingPassword ? 'border-red-500' : ''}`}
            required
          />
          {isTypingPassword && passwordError && (
            <p className="text-sm text-red-200 mt-1">{passwordError}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={loading || !!passwordError}
        >
          {loading ? "Inscription en cours..." : "S'inscrire"}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-white">
          Déjà inscrit?{" "}
          <Link href="/login" className="text-blue-200 hover:text-blue-100">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}