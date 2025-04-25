-- Création des tables
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS formations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  mode ENUM('présentiel', 'distanciel', 'hybride'),
  niveau ENUM('débutant', 'intermédiaire', 'avancé'),
  duree INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  formation_id INT,
  professeur_id INT,
  date_debut DATE,
  date_fin DATE,
  FOREIGN KEY (formation_id) REFERENCES formations(id),
  FOREIGN KEY (professeur_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS participations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  etudiant_id INT,
  module_id INT,
  statut ENUM('inscrit', 'en cours', 'terminé', 'absent'),
  date_participation DATE,
  FOREIGN KEY (etudiant_id) REFERENCES users(id),
  FOREIGN KEY (module_id) REFERENCES modules(id)
);

-- Insertion des rôles
INSERT IGNORE INTO roles (name) VALUES ('etudiant'), ('professeur'), ('admin');
