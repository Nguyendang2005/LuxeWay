package com.luxeway.service;

import com.luxeway.entity.Booking;
import com.luxeway.entity.Invoice;
import com.luxeway.entity.Dispute;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("all")
public class EmailService {

    private final JavaMailSender mailSender;
    private final com.luxeway.repository.UserRepository userRepository;
    private final TranslationService translationService;

    @Value("${spring.mail.username:no-reply@luxeway.local}")
    private String mailFrom;

    private String getLanguageForEmail(String email) {
        return userRepository.findByEmail(email)
                .map(com.luxeway.entity.User::getPreferredLanguage)
                .orElse("en");
    }

    public void sendOtp(String email, String otp) {
        log.info("[OTP FOR DEV/STAGING]: Send to email [{}] - Code [{}]", email, otp);
        String lang = getLanguageForEmail(email);
        String subject = translationService.getMessage("email.otp.subject", lang);
        String htmlContent = translationService.getMessage("email.otp.body", lang, otp);
        sendEmail(email, subject, htmlContent, null, null);
    }

    public void sendRegistrationOtp(String email, String firstName, String otp) {
        log.info("[REGISTRATION OTP FOR DEV/STAGING]: Send to email [{}] - Code [{}]", email, otp);
        String lang = getLanguageForEmail(email);
        String subject = translationService.getMessage("email.registration.otp.subject", lang);
        String htmlContent = translationService.getMessage("email.registration.otp.body", lang, firstName, otp);
        sendEmail(email, subject, htmlContent, null, null);
    }

    public void sendPasswordResetLink(String email, String resetLink) {
        log.info("[PASSWORD RESET LINK LOGGER]: Sending link to {}: {}", email, resetLink);
        String lang = getLanguageForEmail(email);
        String subject = translationService.getMessage("email.reset.subject", lang);
        String htmlContent = translationService.getMessage("email.reset.body", lang, resetLink);
        sendEmail(email, subject, htmlContent, null, null);
    }

    public void sendBookingConfirmation(String email, Booking booking) {
        log.info("[BOOKING DEV LOGGER]: Sending booking confirmation for #{} to {}", booking.getId(), email);
        String lang = booking.getRenter() != null ? booking.getRenter().getPreferredLanguage() : "en";
        String shortId = booking.getId().substring(0, 8).toUpperCase();
        String subject = translationService.getMessage("email.booking.confirm.subject", lang, shortId);
        
        String vehicleBrand = booking.getVehicle().getBrand();
        String vehicleModel = booking.getVehicle().getModel();
        String startDate = booking.getStartDate().toString();
        String endDate = booking.getEndDate().toString();
        String totalDays = String.valueOf(booking.getTotalDays());
        String totalPaid = String.format("%,.0f VND", booking.getTotal());
        
        String htmlContent = translationService.getMessage("email.booking.confirm.body", lang, 
                vehicleBrand, vehicleModel, startDate, endDate, totalDays, totalPaid);
        sendEmail(email, subject, htmlContent, null, null);
    }

    public void sendInvoiceEmail(String email, Invoice invoice, byte[] pdfBytes) {
        log.info("[INVOICE DEV LOGGER]: Sending PDF invoice #{} to {}", invoice.getInvoiceNumber(), email);
        String lang = invoice.getUser() != null ? invoice.getUser().getPreferredLanguage() : "en";
        String shortBookingId = invoice.getBooking().getId().substring(0, 8).toUpperCase();
        String subject = translationService.getMessage("email.invoice.subject", lang, invoice.getInvoiceNumber());
        String formattedAmount = String.format("%,.0f VND", invoice.getAmount());
        
        String htmlContent = translationService.getMessage("email.invoice.body", lang, 
                invoice.getInvoiceNumber(), shortBookingId, formattedAmount);
        sendEmail(email, subject, htmlContent, "invoice-" + invoice.getInvoiceNumber() + ".pdf", pdfBytes);
    }

    public void sendDisputeUpdate(String email, Dispute dispute) {
        log.info("[DISPUTE DEV LOGGER]: Sending dispute update for #{} to {}", dispute.getId(), email);
        String lang = getLanguageForEmail(email);
        String subject = translationService.getMessage("email.dispute.subject", lang, String.valueOf(dispute.getId()));
        String notes = dispute.getAdminDecision() != null ? dispute.getAdminDecision() : "Under review by support agent.";
        String htmlContent = translationService.getMessage("email.dispute.body", lang, 
                String.valueOf(dispute.getId()), dispute.getStatus(), notes);
        sendEmail(email, subject, htmlContent, null, null);
    }

    public void sendPasswordResetSuccess(String email) {
        log.info("[PASSWORD RESET SUCCESS LOGGER]: Sending confirmation to {}", email);
        String lang = getLanguageForEmail(email);
        String subject = translationService.getMessage("email.reset.success.subject", lang);
        String htmlContent = translationService.getMessage("email.reset.success.body", lang);
        sendEmail(email, subject, htmlContent, null, null);
    }

    public void sendEmailVerification(String email, String firstName) {
        log.info("[EMAIL VERIFICATION LOGGER]: Sending welcome/verification to {}", email);
        String lang = getLanguageForEmail(email);
        String subject = translationService.getMessage("email.welcome.subject", lang);
        String htmlContent = translationService.getMessage("email.welcome.body", lang, firstName);
        sendEmail(email, subject, htmlContent, null, null);
    }

    public void sendBookingCancellation(String email, Booking booking) {
        log.info("[BOOKING CANCELLATION LOGGER]: Sending cancellation for #{} to {}", booking.getId(), email);
        String lang = getLanguageForEmail(email);
        String shortId = booking.getId().substring(0, 8).toUpperCase();
        String subject = translationService.getMessage("email.booking.cancel.subject", lang, shortId);
        
        String vehicleBrand = booking.getVehicle().getBrand();
        String vehicleModel = booking.getVehicle().getModel();
        String startDate = booking.getStartDate().toString();
        String endDate = booking.getEndDate().toString();
        String totalDays = String.valueOf(booking.getTotalDays());
        String totalPaid = String.format("%,.0f VND", booking.getTotal());
        
        String htmlContent = translationService.getMessage("email.booking.cancel.body", lang, 
                shortId, vehicleBrand, vehicleModel, startDate, endDate, totalDays, totalPaid);
        sendEmail(email, subject, htmlContent, null, null);
    }

    public void sendKycStatus(String email, String docType, String status, String reason) {
        log.info("[KYC STATUS LOGGER]: Sending KYC update ({}) to {}", status, email);
        String lang = getLanguageForEmail(email);
        String subject = translationService.getMessage("email.kyc.subject", lang);
        String docDisplay = docType.replace("_", " ");
        String reasonHtml = "REJECTED".equals(status) && reason != null ? "<p><b>Reason:</b> " + reason + "</p>" : "";
        String htmlContent = translationService.getMessage("email.kyc.body", lang, docDisplay, 
                "VERIFIED".equals(status) ? "#16A34A" : "#DC2626", status, reasonHtml);
        sendEmail(email, subject, htmlContent, null, null);
    }

    public void sendVehicleApprovalStatus(String email, com.luxeway.entity.Vehicle vehicle, String status, String reason) {
        log.info("[VEHICLE APPROVAL LOGGER]: Sending vehicle approval ({}) for {} to {}", status, vehicle.getLicensePlate(), email);
        String lang = getLanguageForEmail(email);
        String subject = translationService.getMessage("email.vehicle.subject", lang);
        String statusLabel = "AVAILABLE".equals(status) ? "APPROVED & LIVE" : "REJECTED";
        String reasonHtml = "REJECTED".equals(status) && reason != null ? "<p><b>Reason for rejection:</b> " + reason + "</p>" : "";
        String htmlContent = translationService.getMessage("email.vehicle.body", lang, 
                vehicle.getBrand(), vehicle.getModel(), vehicle.getLicensePlate(),
                "AVAILABLE".equals(status) ? "#16A34A" : "#DC2626", statusLabel, reasonHtml);
        sendEmail(email, subject, htmlContent, null, null);
    }

    public void sendAdminNotification(String subject, String message) {
        log.info("[ADMIN ALERT LOGGER]: Sending notification to admin: {}", subject);
        String adminEmail = "admin@luxeway.vn";
        String htmlContent = "<h2>LuxeWay Administrative Alert</h2>"
                + "<p>The following administrative event requires attention:</p>"
                + "<div style='background-color: #F8FAFC; padding: 12px; border-left: 4px solid #4F46E5; border-radius: 4px; font-family: monospace; white-space: pre-wrap;'>" + message + "</div>"
                + "<p>Please access the platform operations console to verify details.</p>";
        sendEmail(adminEmail, subject, htmlContent, null, null);
    }

    /**
     * Send login alert email to a user after successful login.
     * Called asynchronously from AuthService to not block login flow.
     */
    public void sendLoginAlert(String email, String firstName) {
        log.info("[LOGIN ALERT]: Sending login notification to {}", email);
        try {
            String lang = getLanguageForEmail(email);
            String safeFirstName = firstName != null ? firstName : "User";
            String timeStr = java.time.LocalDateTime.now()
                    .format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            String subject = "[LuxeWay] Successful Login Detected";
            String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>"
                    + "<div style='background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 24px; border-radius: 12px 12px 0 0;'>"
                    + "<h1 style='color: white; margin: 0; font-size: 22px;'>🔐 Login Notification</h1></div>"
                    + "<div style='background: #F8FAFC; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #E2E8F0;'>"
                    + "<p style='color: #374151;'>Hi <strong>" + safeFirstName + "</strong>,</p>"
                    + "<p style='color: #374151;'>A successful login was detected on your <strong>LuxeWay</strong> account.</p>"
                    + "<div style='background: white; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin: 16px 0;'>"
                    + "<p style='margin: 4px 0; color: #6B7280; font-size: 14px;'><strong>Time:</strong> " + timeStr + " (UTC+7)</p>"
                    + "<p style='margin: 4px 0; color: #6B7280; font-size: 14px;'><strong>Account:</strong> " + email + "</p>"
                    + "</div>"
                    + "<p style='color: #6B7280; font-size: 14px;'>If this was not you, please <a href='https://luxeway.io.vn/auth/login' style='color: #4F46E5;'>change your password immediately</a>.</p>"
                    + "<p style='color: #374151;'>— The LuxeWay Security Team</p>"
                    + "</div></div>";
            sendEmail(email, subject, htmlContent, null, null);
        } catch (Exception e) {
            log.warn("Failed to send login alert email to {}: {}", email, e.getMessage());
        }
    }

    public void sendCustomHtmlEmail(String to, String subject, String htmlContent) {
        sendEmail(to, subject, htmlContent, null, null);
    }

    private void sendEmail(String to, String subject, String htmlContent, String attachmentName, byte[] attachmentBytes) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom(mailFrom, "LuxeWay");

            if (attachmentName != null && attachmentBytes != null) {
                helper.addAttachment(attachmentName, new ByteArrayResource(attachmentBytes));
            }

            mailSender.send(message);
            log.info("Email successfully sent to [{}] with subject [{}]", to, subject);
        } catch (Exception e) {
            log.warn("SMTP send failed (offline/dev/mock credentials). Falling back to dynamic log printing. Details: {}", e.getMessage());
            log.info("---- OFFLINE EMAIL DISPATCH MOCK ----\nTo: {}\nSubject: {}\nBody:\n{}\n-------------------------------------", to, subject, htmlContent);
        }
    }
}
