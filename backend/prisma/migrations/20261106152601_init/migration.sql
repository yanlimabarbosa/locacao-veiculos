CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(120) NOT NULL,
    `email` VARCHAR(160) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `veiculos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `marca` VARCHAR(60) NOT NULL,
    `modelo` VARCHAR(60) NOT NULL,
    `placa` VARCHAR(7) NOT NULL,
    `ano` INTEGER NOT NULL,
    `valor_diaria` DECIMAL(10, 2) NOT NULL,
    `disponivel` BOOLEAN NOT NULL DEFAULT true,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `veiculos_placa_key`(`placa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `locacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `veiculo_id` INTEGER NOT NULL,
    `data_inicio` DATETIME(3) NOT NULL,
    `data_prevista_devolucao` DATETIME(3) NOT NULL,
    `data_devolucao` DATETIME(3) NULL,
    `quantidade_diarias` INTEGER NOT NULL,
    `valor_total` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('ATIVA', 'FINALIZADA') NOT NULL DEFAULT 'ATIVA',
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `locacoes_usuario_id_idx`(`usuario_id`),
    INDEX `locacoes_veiculo_id_status_idx`(`veiculo_id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `locacoes` ADD CONSTRAINT `locacoes_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `locacoes` ADD CONSTRAINT `locacoes_veiculo_id_fkey` FOREIGN KEY (`veiculo_id`) REFERENCES `veiculos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
