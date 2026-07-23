import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../store/authStore";

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

    const token =
      params.get("token") ||
      hash.get("token") ||
      params.get("access_token") ||
      hash.get("access_token");

    const userParam =
      params.get("usuario") ||
      params.get("user") ||
      hash.get("usuario") ||
      hash.get("user");

    const error =
      params.get("erro") ||
      params.get("error") ||
      hash.get("erro") ||
      hash.get("error");

    if (error) {
      toast.error(decodeURIComponent(error));
      navigate("/login");
      return;
    }

    if (!token) {
      toast.error("Não foi possível concluir o acesso com Google.");
      navigate("/login");
      return;
    }

    let usuario = null;
    if (userParam) {
      try {
        usuario = JSON.parse(decodeURIComponent(userParam));
      } catch {
        try {
          usuario = JSON.parse(userParam);
        } catch {
          usuario = null;
        }
      }
    }

    login(token, usuario);
    toast.success("Login realizado com sucesso!");
    navigate("/");
  }, [login, navigate]);

  return null;
}
