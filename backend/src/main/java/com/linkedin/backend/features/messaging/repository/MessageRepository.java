package com.linkedin.backend.features.messaging.repository;

import com.linkedin.backend.features.messaging.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversation(Long conversationId);
}
