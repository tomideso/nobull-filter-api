import Account from "@/entity/Account";

export default class AccountRepository {
  private transactionMananger;

  async connect() {
    if (this.transactionMananger) {
      return Promise.resolve(this.transactionMananger);
    }
  }

  public async findByName(email: string) {
    // await this.connect();
  }

  public async findByPhone(email: string) {
    // await this.connect();

    return this.transactionMananger.findOneOrFail(Account, {
      where: { email },
      select: ["email", "roles", "id"],
    });
  }
}
