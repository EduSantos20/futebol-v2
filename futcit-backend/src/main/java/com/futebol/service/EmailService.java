package com.futebol.service;

public interface EmailService {
    void sendResetPasswordEmail(String to, String resetLink);
}