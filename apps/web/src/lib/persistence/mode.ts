export function useDatabasePersistence() {
  return process.env.BATCH_PERSISTENCE === "database";
}
