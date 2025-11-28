package com.example.model;

import java.time.LocalDateTime;

public class MaintenanceNotificationRequest {
    private Long requestId;
    private String recipientEmail;
    private String recipientName;
    private String oldStatus;
    private String newStatus;
    private LocalDateTime changeDate;
    private String propertyId;

    public MaintenanceNotificationRequest() {
    }

    public MaintenanceNotificationRequest(Long requestId, String recipientEmail, String recipientName,
                                          String oldStatus, String newStatus, LocalDateTime changeDate,
                                          String propertyId) {
        this.requestId = requestId;
        this.recipientEmail = recipientEmail;
        this.recipientName = recipientName;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.changeDate = changeDate;
        this.propertyId = propertyId;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(String oldStatus) {
        this.oldStatus = oldStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }

    public LocalDateTime getChangeDate() {
        return changeDate;
    }

    public void setChangeDate(LocalDateTime changeDate) {
        this.changeDate = changeDate;
    }

    public String getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(String propertyId) {
        this.propertyId = propertyId;
    }

    @Override
    public String toString() {
        return "MaintenanceNotificationRequest{" +
                "requestId=" + requestId +
                ", recipientEmail='" + recipientEmail + '\'' +
                ", recipientName='" + recipientName + '\'' +
                ", oldStatus='" + oldStatus + '\'' +
                ", newStatus='" + newStatus + '\'' +
                ", changeDate=" + changeDate +
                ", propertyId='" + propertyId + '\'' +
                '}';
    }
}
