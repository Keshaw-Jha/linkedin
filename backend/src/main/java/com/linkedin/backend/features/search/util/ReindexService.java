package com.linkedin.backend.features.search.util;

import com.linkedin.backend.features.authentication.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.search.mapper.orm.Search;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReindexService {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void reindex() throws InterruptedException {

        Search.session(entityManager)
                .massIndexer(User.class)
                .startAndWait();

        System.out.println("Lucene indexes rebuilt successfully.");
    }
}
