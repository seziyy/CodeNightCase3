package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@NoArgsConstructor
@Data
@AllArgsConstructor
public class User {

    @Id
    @Column(name = "user_id")
    private String userId;

    private String name;
    private String city;
    private String segment;


}
