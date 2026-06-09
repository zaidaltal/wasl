-- ============================================================
-- Wasl (وصل) — Freelance Marketplace Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS wasl_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wasl_db;

-- Users (shared between freelancers, clients, and admins)
CREATE TABLE users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)                          NOT NULL,
    email      VARCHAR(150) UNIQUE                   NOT NULL,
    password   VARCHAR(255)                          NOT NULL,
    role       ENUM('freelancer', 'client', 'admin') NOT NULL,
    avatar     VARCHAR(255),
    country    VARCHAR(100),
    city       VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Freelancer Profiles
CREATE TABLE freelancer_profiles (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNIQUE NOT NULL,
    bio             TEXT,
    skills          JSON,
    portfolio_links JSON,
    hourly_rate     DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Client Profiles
CREATE TABLE client_profiles (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    user_id             INT UNIQUE NOT NULL,
    company_name        VARCHAR(150),
    company_description TEXT,
    website             VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories
CREATE TABLE categories (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    icon    VARCHAR(50),
    INDEX idx_name_en (name_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Jobs
CREATE TABLE jobs (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    client_id   INT                           NOT NULL,
    category_id INT,
    title       VARCHAR(200)                  NOT NULL,
    description TEXT                          NOT NULL,
    budget      DECIMAL(10, 2),
    country     VARCHAR(100),
    status      ENUM('open', 'closed') DEFAULT 'open',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id)   REFERENCES users (id)       ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id)  ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_client (client_id),
    INDEX idx_category (category_id),
    INDEX idx_country (country),
    FULLTEXT idx_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Applications
CREATE TABLE applications (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    job_id        INT                                         NOT NULL,
    freelancer_id INT                                         NOT NULL,
    cover_letter  TEXT,
    status        ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    applied_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id)        REFERENCES jobs (id)  ON DELETE CASCADE,
    FOREIGN KEY (freelancer_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (job_id, freelancer_id),
    INDEX idx_freelancer (freelancer_id),
    INDEX idx_job (job_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
