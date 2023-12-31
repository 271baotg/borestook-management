package com.example.bookstore_backend.repository;

import com.example.bookstore_backend.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


public interface OrderDetailRepository extends JpaRepository<OrderDetail,Long> {
    @Query(value = "SELECT * FROM order_detail WHERE order_id = :id", nativeQuery = true)
    public List<OrderDetail> findByOrderId(@Param("id") Long id);
}
