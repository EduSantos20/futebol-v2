package com.futebol.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Adiciona headers que o ngrok exige para não mostrar tela de aviso.
 * Roda ANTES do Spring Security (Order = 1).
 */
@Component
@Order(1)
public class NgrokFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletResponse res = (HttpServletResponse) response;
        HttpServletRequest  req = (HttpServletRequest)  request;

        // Header que o ngrok usa para pular a tela de aviso do browser
        res.setHeader("ngrok-skip-browser-warning", "true");

        // Para requisições OPTIONS (preflight), responde 200 imediatamente
        // com os headers CORS necessários — evita o 403 no preflight
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            String origin = req.getHeader("Origin");
            if (origin != null) {
                res.setHeader("Access-Control-Allow-Origin", origin);
            }
            res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "*");
            res.setHeader("Access-Control-Max-Age", "3600");
            res.setStatus(HttpServletResponse.SC_OK);
            return; // não continua a cadeia para requisições preflight
        }

        chain.doFilter(request, response);
    }
}
