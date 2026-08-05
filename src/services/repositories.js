// Compatibility barrel. Domain repository owners live under ./repositories/.
export { authRepository } from "./repositories/auth";
export {
    escrowBoxRepository,
    gameRepository,
    mediaRepository,
    productRepository,
    transactionRepository,
    purchaseRepository,
} from "./repositories/marketplace";
export {
    contentRepository,
    marketplaceOptionsRepository,
    serviceRepository,
} from "./repositories/content";
export {
    documentRepository,
    notificationRepository,
    walletRepository,
    profileRepository,
    payoutRepository,
    marketplaceOperationsRepository,
} from "./repositories/customer";
export { trustRepository } from "./repositories/trust";
