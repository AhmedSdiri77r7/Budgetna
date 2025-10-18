-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  mer. 15 fév. 2023 à 16:32
-- Version du serveur :  5.7.24
-- Version de PHP :  7.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `bpdbackend`
--

-- --------------------------------------------------------

--
-- Structure de la table `budget`
--

DROP TABLE IF EXISTS `budget`;
CREATE TABLE IF NOT EXISTS `budget` (
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `id_budget_initial` int(11) NOT NULL,
  `id_employe` int(11) NOT NULL,
  `is_valide` bit(1) NOT NULL,
  `id_direction` int(11) DEFAULT NULL,
  PRIMARY KEY (`date_debut`,`date_fin`,`id_budget_initial`,`id_employe`),
  KEY `FKi1qe67jvk74d9dsbnbekc0i6k` (`id_budget_initial`),
  KEY `FK7jfq038kp7299et3ofqrfrb8r` (`id_employe`),
  KEY `FKl1pm2yi1p5m2wno5yy8kn7jil` (`id_direction`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `budget`
--

INSERT INTO `budget` (`date_debut`, `date_fin`, `id_budget_initial`, `id_employe`, `is_valide`, `id_direction`) VALUES
('2022-12-01', '2023-01-31', 1, 1, b'0', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `budget_initial`
--

DROP TABLE IF EXISTS `budget_initial`;
CREATE TABLE IF NOT EXISTS `budget_initial` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `taux_budget` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `budget_initial`
--

INSERT INTO `budget_initial` (`id`, `description`, `name`, `taux_budget`) VALUES
(1, 'PC lenovo', 'Investissement', 11),
(7, 'maintenance', 'exploitation', 150000),
(8, NULL, NULL, 0),
(9, 'logiciel', 'investissement', 0);

-- --------------------------------------------------------

--
-- Structure de la table `budget_revise`
--

DROP TABLE IF EXISTS `budget_revise`;
CREATE TABLE IF NOT EXISTS `budget_revise` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `email_facturation` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `taux_budget` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `budget_revise`
--

INSERT INTO `budget_revise` (`id`, `description`, `email_facturation`, `name`, `taux_budget`) VALUES
(1, 'pc lenovo', 'ahmed.sdiri@esprit.tn', 'Investissement', 11),
(3, NULL, NULL, NULL, 0),
(4, NULL, NULL, NULL, 0),
(5, NULL, NULL, NULL, 0),
(6, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `contrat`
--

DROP TABLE IF EXISTS `contrat`;
CREATE TABLE IF NOT EXISTS `contrat` (
  `reference` int(11) NOT NULL AUTO_INCREMENT,
  `date_debut` date DEFAULT NULL,
  `salaire` float NOT NULL,
  `type_contrat` varchar(255) DEFAULT NULL,
  `employe_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`reference`),
  KEY `FKidi9k1fvw6mma24yqoe2kmtju` (`employe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `contrat`
--

INSERT INTO `contrat` (`reference`, `date_debut`, `salaire`, `type_contrat`, `employe_id`) VALUES
(2, '2023-02-15', 27, 'aaa', 1);

-- --------------------------------------------------------

--
-- Structure de la table `direction`
--

DROP TABLE IF EXISTS `direction`;
CREATE TABLE IF NOT EXISTS `direction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `budget_initials_id` int(11) DEFAULT NULL,
  `budget_revise_id` int(11) DEFAULT NULL,
  `entreprise_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdpjjqautpygi2j4xpgflop6bc` (`budget_initials_id`),
  KEY `FK9rt6cvafei5otkju7y47l062n` (`budget_revise_id`),
  KEY `FKcy7q5t1ye0b0dxkym7lpyik2l` (`entreprise_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `direction`
--

INSERT INTO `direction` (`id`, `name`, `budget_initials_id`, `budget_revise_id`, `entreprise_id`) VALUES
(1, 'Informatique', 1, 1, 1),
(2, 'financiere', 7, 6, 1),
(3, 'Rh', 8, NULL, 1);

-- --------------------------------------------------------

--
-- Structure de la table `employe`
--

DROP TABLE IF EXISTS `employe`;
CREATE TABLE IF NOT EXISTS `employe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `is_actif` bit(1) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `direction_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjf33dj4v6rigg20heq6j2r68u` (`direction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `employe`
--

INSERT INTO `employe` (`id`, `email`, `is_actif`, `nom`, `password`, `prenom`, `role`, `direction_id`) VALUES
(1, 'Khaled.boughdiri@ETAP.com.tn', b'0', 'SDIRI', '12345', 'Ahmed', 'INGENIEUR', 1),
(2, 'nesrinebenasker@ETAP.tn.com', b'0', 'Bes Asker', '123456', 'Nesrine', 'INGENIEUR', 1),
(3, 'KhaledBoughddiri@ETAP.tn', b'0', 'Boughdiri', '123566', 'Khaled', 'CHEF_DEPARTEMENT', 1),
(5, 'ahmed.sdiri@esprit.com', b'0', 'Sdiri', '123456', 'Lina', 'INGENIEUR', 1),
(6, 'ameni.rommene@esprit.tn', b'0', 'Rommene ', '147855', 'Ameni', 'INGENIEUR', 1);

-- --------------------------------------------------------

--
-- Structure de la table `entreprise`
--

DROP TABLE IF EXISTS `entreprise`;
CREATE TABLE IF NOT EXISTS `entreprise` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `raison_social` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `entreprise`
--

INSERT INTO `entreprise` (`id`, `name`, `raison_social`) VALUES
(1, 'ETAP', 'Hydrocarbure');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `budget`
--
ALTER TABLE `budget`
  ADD CONSTRAINT `FK7jfq038kp7299et3ofqrfrb8r` FOREIGN KEY (`id_employe`) REFERENCES `employe` (`id`),
  ADD CONSTRAINT `FKi1qe67jvk74d9dsbnbekc0i6k` FOREIGN KEY (`id_budget_initial`) REFERENCES `budget_initial` (`id`),
  ADD CONSTRAINT `FKl1pm2yi1p5m2wno5yy8kn7jil` FOREIGN KEY (`id_direction`) REFERENCES `direction` (`id`);

--
-- Contraintes pour la table `contrat`
--
ALTER TABLE `contrat`
  ADD CONSTRAINT `FKidi9k1fvw6mma24yqoe2kmtju` FOREIGN KEY (`employe_id`) REFERENCES `employe` (`id`);

--
-- Contraintes pour la table `direction`
--
ALTER TABLE `direction`
  ADD CONSTRAINT `FK9rt6cvafei5otkju7y47l062n` FOREIGN KEY (`budget_revise_id`) REFERENCES `budget_revise` (`id`),
  ADD CONSTRAINT `FKcy7q5t1ye0b0dxkym7lpyik2l` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprise` (`id`),
  ADD CONSTRAINT `FKdpjjqautpygi2j4xpgflop6bc` FOREIGN KEY (`budget_initials_id`) REFERENCES `budget_initial` (`id`);

--
-- Contraintes pour la table `employe`
--
ALTER TABLE `employe`
  ADD CONSTRAINT `FKjf33dj4v6rigg20heq6j2r68u` FOREIGN KEY (`direction_id`) REFERENCES `direction` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
