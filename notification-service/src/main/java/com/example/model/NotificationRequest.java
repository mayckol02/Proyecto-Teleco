package com.example.model;

public class NotificationRequest {
    private String recipient;
    private String message;
    private String channel; // e.g. email, sms, push

    public NotificationRequest() {
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    @Override
    public String toString() {
        return "NotificationRequest{" +
                "recipient='" + recipient + '\'' +
                ", message='" + message + '\'' +
                ", channel='" + channel + '\'' +
                '}';
    }
}
