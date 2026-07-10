package com.futebol.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:no-reply@futebol.app}")
    private String mailFrom;

    @Override
    public void sendResetPasswordEmail(String to, String resetLink) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(mailFrom);
        msg.setTo(to);
        msg.setSubject("Redefinição de senha");
        msg.setText("Você solicitou a redefinição de senha. Clique no link abaixo para criar uma nova senha:\n\n"
                + resetLink + "\n\nSe você não solicitou, ignore este email.");
        mailSender.send(msg);
    }
}